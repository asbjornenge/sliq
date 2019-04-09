const { createStore } = require('react-hookstore')

const testStore = createStore('testStore', [])
const contractStore = createStore('contractStore', [])
module.exports.testStore = testStore
module.exports.contractStore = contractStore
