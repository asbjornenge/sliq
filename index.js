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

async function run(cmd) {
  let ctxPath = path.resolve(ctx)
  let contracts = await walk([ctxPath+'/contracts'])
    .then(c => c.map(_c => _c.root+'/'+_c.name))
    .then(c => c.map(_c => _c.replace(ctxPath,'/ctx')))
    .then(c => c.filter(_c => _c.endsWith('liq')))
    .then(p => p.reduce((fp,p) => fp+' '+p,''))
  console.log(contracts, contracts.length) 
  let compile = `docker run --rm -v ${ctxPath}:/ctx ${image} liquidity --no-annot --no-simplify --no-peephole /techel.liq ${contracts} -o /ctx/tests/sliq.techel /ctx/tests/basic.liq`
  let test = `docker run --rm -v ${ctxPath}:/ctx ${image} techelson /ctx/tests/sliq.techel`

  let res_c = await exec(compile)
  let res_t = await exec(test)
  return { compile: res_c, test: res_t }
}

(async () => {
  let res = await run()
  console.log(res.test.stdout)
})()
