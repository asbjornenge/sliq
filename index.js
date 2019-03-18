#!/usr/bin/env node
const { exec, spawn } = require('child-process-async')
const path = require('path')
const walk = require('walk-promise')
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

async function run(ctxPath, contracts, testfile) {
  let compile = `docker run --rm -v ${ctxPath}:/ctx ${image} liquidity --no-annot --no-simplify --no-peephole /techel.liq ${contracts} -o /ctx/tests/sliq.techel ${testfile}`
  let test = `docker run --rm -v ${ctxPath}:/ctx ${image} techelson /ctx/tests/sliq.techel`
  let res_c = await exec(compile)
  let res_t = await exec(test)
  return { compile: res_c, test: res_t }
}

async function getContracts(ctxPath) {
  let contracts = await walk([ctxPath+'/contracts'])
    .then(c => c.map(_c => _c.root+'/'+_c.name))
    .then(c => c.map(_c => _c.replace(ctxPath,'/ctx')))
    .then(c => c.filter(_c => _c.endsWith('liq')))
    .then(p => p.reduce((fp,p) => fp+' '+p,''))
  return contracts
}

async function getTests(ctxPath) {
  let tests = await walk([ctxPath+'/tests'])
    .then(c => c.map(_c => _c.root+'/'+_c.name))
    .then(c => c.map(_c => _c.replace(ctxPath,'/ctx')))
    .then(c => c.filter(_c => _c.endsWith('liq')))
  // TODO if args.only filter
  return tests
}

(async () => {
  let ctxPath = path.resolve(ctx)
  let contracts = await getContracts(ctxPath)
  let tests = await getTests(ctxPath)
  for (let test of tests) {
    console.log(`===== ${test} =====`)
    let res = await run(ctxPath, contracts, test)
    console.log(res.test.stdout)
  }
})()
