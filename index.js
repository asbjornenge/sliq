#!/usr/bin/env node
const importJsx = require('import-jsx')
const chalk = require('chalk')
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

(async () => {
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
          if (e.stdout)
            console.log(e.stdout.toString(), e.stderr.toString())
          else {
            let msg = e.message
            msg = msg.split('\n').filter(m => m.indexOf('Command failed') < 0).join('\n')
            console.log(msg)
          }
        }
        else if (args.v) {
          console.log(`${chalk.blue('====')} ${test.rp} ${chalk.blue('====')}`)
          console.log(test.res.test)
        }
      })
    }, 2000)
  }

  let numTestsRun = 0
  tests.forEach(test => {
    updateTestState(test, 'status', 'running')
    utils.run(args, contracts.map(c => c.fp), test.fp, (err, res) => {
      if (err) {
        updateTestState(test, 'status', 'error')
      } else {
        updateTestState(test, 'status', 'done')
      }
      test.err = err
      test.res = res
      numTestsRun++
      if (numTestsRun === tests.length-1)
        printResults()
    })
  })
})()
