const path = require('path')
const walk = require('walk-promise')
const child_process = require('child_process')
const { createStore } = require('react-hookstore')

const cwd = process.cwd()
const testStore = createStore('testStore', [])
const contractStore = createStore('contractStore', [])
module.exports.testStore = testStore
module.exports.contractStore = contractStore

const image = 'asbjornenge/sliq:1.0.1'
function run(args, contracts, testfile, callback) {
  let contractPaths = contracts.map(p => `-v ${p}:${p}`).join(' ')
  let testPaths = args.tests.map(cp => path.resolve(cp)).map(p => `-v ${p}:${p}`).join(' ')
//  console.log(contractPaths, testPaths, contracts, testfile)
  let compile = `docker run --rm -v /tmp:/tmp ${contractPaths} ${testPaths} ${image} liquidity --no-annot --no-simplify --no-peephole /techel.liq ${contracts.join(' ')} -o /tmp/sliq.techel ${testfile}`
  let test = `docker run --rm -v /tmp:/tmp ${image} techelson /tmp/sliq.techel`
  child_process.exec(compile, { stdio: 'pipe' }, (cerror, cstdout, cstderr) => {
    if (cerror) return callback(cerror, cstdout, cstderr)
    child_process.exec(test, { stdio: 'pipe' }, (terror, tstdout, tstderr) => {
      if (terror) return callback(terror, tstdout, tstderr)
      callback(null, { compile: cstdout, test: tstdout })
//      return { compile: res_c, test: res_t }
    })
  })
}
module.exports.run = run

async function getContracts(args) {
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
module.exports.getContracts = getContracts


async function getTests(args) {
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
module.exports.getTests = getTests
