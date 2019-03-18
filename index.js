#!/usr/bin/env node
const { exec, spawn } = require('child-process-async')
const chalk = require('chalk')
const path = require('path')
const walk = require('walk-promise')
const args = require('minimist')(process.argv.slice(2), {
  default : {
    contracts : '',
    tests     : '',
    watch     : false
  }
})
const image = 'asbjornenge/sliq:1.0.0'

;

async function run(ctxPath, contracts, testfile) {
  let compile = `docker run --rm -v ${ctxPath}:/ctx ${image} liquidity --no-annot --no-simplify --no-peephole /techel.liq ${contracts} -o /ctx/tests/sliq.techel ${testfile}`
  let test = `docker run --rm -v ${ctxPath}:/ctx ${image} techelson /ctx/tests/sliq.techel`
  let res_c = await exec(compile)
  let res_t = await exec(test)
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
  return tests
}

(async () => {
  let cwd = process.cwd()
  let contracts = await getContracts()
  let tests = await getTests()
  console.log(`${chalk.magenta('Sliq')}
  ${chalk.cyan('Contracts')}
    ${contracts.map(c => c.replace(cwd, '.')).join('\n    ')}
  ${chalk.green('Tests')}
    ${tests.map(c => c.replace(cwd, '.')).join('\n    ')}
`)
//  for (let test of tests) {
//    console.log(chalk.blue(`===== ${chalk.green(test)} =====`))
//    let res = await run(ctxPath, contracts, test)
//    console.log(res.test.stdout)
//  }
})()
