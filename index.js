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

  setInterval(() => {
    utils.testStore.setState(tests.map(t => {
      switch(t.status) {
        case 'waiting':
          t.status = 'running'
          return t
        case 'running':
          process.exit(0)
      }
      return t
    }))
  },5000)

//  for (let test of tests) {
//    test.status = 'running'
//    utils.testStore.setState(tests)
//    try {
//      let res = utils.run(args, contracts.map(c => c.fp), test.fp)
////      console.log(res.test.toString())
//      test.status = 'done'
//    } catch(e) {
//      if (e.stdout)
//        console.log('ERROR:', e.stdout.toString(), e.stderr.toString())
//      else
//        console.log('SLIQ ERROR:', e)
//      test.status = 'error'
//      console.log('error')
//    }
//    utils.testStore.setState(tests)
//  }
})()
