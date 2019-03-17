#!/usr/bin/env node
const { exec, spawn } = require('child-process-async')
const path = require('path')
const args = require('minimist')(process.argv.slice(2), {
  default : {
    contracts : './contracts',
    tests     : './tests',
    watch     : false
  }
})
const ctx = args._.length > 0 ? args._[0] : '.'
const image = 'asbjornenge/sliq:1.0.0'

;

async function run(cmd) {
  let compile = `docker run --rm -v ${path.resolve(ctx)}:/ctx ${image} liquidity --no-annot --no-simplify --no-peephole /techel.liq /ctx/tests/basic.liq -o /ctx/tests/basic.techel`
  let test = `docker run --rm -v ${path.resolve(ctx)}:/ctx ${image} techelson /ctx/tests/basic.techel`

  let res_c = await exec(compile)
  let res_t = await exec(test)
  return { compile: res_c, test: res_t }
}

(async () => {
  let res = await run()
  console.log(res.test.stdout)
})()
