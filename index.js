#!/usr/bin/env node
const importJsx = require('import-jsx')
const chalk = require('chalk')
const emoji = require('node-emoji')
const args = require('minimist')(process.argv.slice(2), {
  default : {
    contracts : '',
    tests     : '',
    build     : '',
    watch     : false,
    help      : false,
    verbose   : false,
    version   : false
  }
})
const ui = importJsx('./ui')
const utils = require('./utils')
if (args.version) {
  console.log(require('./package.json').version)
  process.exit(0)
}
if (args.help) {
  console.log(`Sliq [OPTIONS]

OPTIONS
--contracts   - Location of contract(s)
--tests       - Location of test(s)     (required)
--help        - Display this message
--verbose -v  - Verbose output
--version     - Sliq version
`)
  process.exit(0)
}

;

let build = async () => {
  args.contracts = args.build
  let builds = await utils.getContracts(args)
  utils.build(args, builds.map(c => c.fp), (err, res, stderr) => {
    if (err) {
      console.log(`${chalk.red('ERROR')}`)
      if (err.stdout != '')
        console.log(err.stdout, err.stderr)
      else {
        let msg = err.message
        msg = msg.split('\n').filter(m => m.indexOf('Command failed') < 0).join('\n')
        console.log(msg)
      }
    }
    else if (args.v || args.verbose) {
      console.log(res.stdout)
    }
    console.log(`Built ${res.outfile} ${emoji.get('tada')}`)
  }) 
}

(async () => {
  if (args.build != '') return await build()
  let contracts = await utils.getContracts(args)
  let tests = await utils.getTests(args)
  utils.testStore.setState(tests)
  utils.contractStore.setState(contracts)
  ui()

  let updateTestState = (test, property, value) => {
    utils.testStore.setState(tests.map(t => {
      if (t.fp !== test.fp) return t
      t[property] = value
      return t
    }))
  }

  let printResults = () => {
    setTimeout(() => {
      tests.forEach(test => {
        if (test.err) {
          console.log(`${chalk.blue('====')} ${test.rp} ${chalk.blue('====')}`)
          console.log(`${chalk.red('ERROR')}`)
          let e = test.err
          if (test.stdout != '')
            console.log(test.stdout, test.stderr)
          else {
            let msg = e.message
            msg = msg.split('\n').filter(m => m.indexOf('Command failed') < 0).join('\n')
            console.log(msg)
          }
        }
        else if (args.v || args.verbose) {
          console.log(`${chalk.blue('====')} ${test.rp} ${chalk.blue('====')}`)
          console.log(test.stdout)
        }
      })
    }, 1000)
  }

  let numTestsRun = 0
  tests.forEach(test => {
    updateTestState(test, 'status', 'running')
    utils.run(args, contracts.map(c => c.fp), test.fp, (err, stdout, stderr) => {
      if (err) {
        updateTestState(test, 'status', 'error')
      } else {
        updateTestState(test, 'status', 'done')
      }
      test.err = err
      test.stdout = stdout
      test.stderr = stderr
      numTestsRun++
      if (numTestsRun === tests.length)
        printResults()
    })
  })
})()
