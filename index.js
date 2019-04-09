#!/usr/bin/env node
const child_process = require('child_process')
const importJsx = require('import-jsx')
const chalk = require('chalk')
const path = require('path')
const walk = require('walk-promise')
const args = require('minimist')(process.argv.slice(2), {
  default : {
    contracts : '',
    tests     : '',
    watch     : false,
    help      : false
  }
})
const ui = importJsx('./ui')
const utils = require('./utils')
const image = 'asbjornenge/sliq:1.0.1'
const cwd = process.cwd()
if (args.help || args.tests == '') {
  console.log(`Sliq [OPTIONS]

OPTIONS
--contracts   - Location of contract(s)
--tests       - Location of test(s)     (required)
--help        - Display this message
`)
  process.exit(0)
}

;

function run(contracts, testfile) {
  let contractPaths = contracts.map(p => `-v ${p}:${p}`).join(' ')
  let testPaths = args.tests.map(cp => path.resolve(cp)).map(p => `-v ${p}:${p}`).join(' ')
//  console.log(contractPaths, testPaths, contracts, testfile)
  let compile = `docker run --rm -v /tmp:/tmp ${contractPaths} ${testPaths} ${image} liquidity --no-annot --no-simplify --no-peephole /techel.liq ${contracts.join(' ')} -o /tmp/sliq.techel ${testfile}`
  let test = `docker run --rm -v /tmp:/tmp ${image} techelson /tmp/sliq.techel`
  let res_c = child_process.execSync(compile, { stdio: 'pipe' })
  let res_t = child_process.execSync(test, { stdio: 'pipe' })
  return { compile: res_c, test: res_t }
}

async function getContracts() {
  if (args.contracts == '') return []
  if (typeof args.contracts === 'string')
    args.contracts = [args.contracts]
  let paths = args.contracts.map(cp => path.resolve(cp))
  let contracts = await walk(paths)
    .then(c => c.map(_c => _c.root+'/'+_c.name))
    .then(c => c.filter(_c => _c.endsWith('liq')))
    .then(c => c.map(_c => {
      return {
        fp: _c,
        rp: _c.replace(cwd, '.'),
      }
    }))
  return contracts
}

async function getTests() {
  if (args.tests == '') return []
  if (typeof args.tests === 'string')
    args.tests = [args.tests]
  let paths = args.tests.map(tp => path.resolve(tp))
  let tests = await walk(paths)
    .then(c => c.map(_c => _c.root+'/'+_c.name))
    .then(c => c.filter(_c => _c.endsWith('liq')))
    .then(c => c.map(_c => {
      return {
        fp: _c,
        rp: _c.replace(cwd, '.'),
        status: 'waiting'
      }
    }))
  return tests
}

(async () => {
  let contracts = await getContracts()
  let tests = await getTests()
  utils.testStore.setState(tests)
  utils.contractStore.setState(contracts)
  ui()
//  console.log(`${chalk.magenta('Sliq')}
//  ${chalk.cyan('Contracts')}
//    ${contracts.map(c => c.replace(cwd, '.')).join('\n    ')}
//  ${chalk.green('Tests')}
//    ${tests.map(c => c.replace(cwd, '.')).join('\n    ')}`)
//  console.log(chalk.magenta('Running tests...'))
//  for (let test of tests) {
//    console.log(chalk.blue(`===== ${chalk.green(test.replace(cwd, '.'))} =====`))
//    try {
//      let res = run(contracts, test)
//      console.log(res.test.toString())
//    } catch(e) {
//      if (e.stdout)
//        console.log('ERROR:', e.stdout.toString(), e.stderr.toString())
//      else
//        console.log('SLIQ ERROR:', e)
//    }
//  }
})()
