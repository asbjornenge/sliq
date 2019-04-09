const React = require('react')
const { useState } = require('react')
const { render, Color, Text, Box } = require('ink')
const IBox = require('ink-box')
const Spinner = require('ink-spinner').default
const { useStore } = require('react-hookstore')
const emoji = require('node-emoji')
const utils = require('./utils')

const Sliq = () => {
  let [tests] = useStore(utils.testStore) 
  let [contracts] = useStore(utils.contractStore) 

  let _contracts = contracts.map(c => {
    return (
      <Box key={c.rp+'contract'}>{c.rp}</Box>
    )
  })
  let _tests = tests.map(t => {
    return (
      <Box key={t.rp+'test'}>{t.rp}</Box>
    )
  })
  let _status = tests.map(t => {
    let status = <Text>{t.status}</Text>
    if (t.status === 'running')
      status = <Color green><Spinner type="dots" /></Color>
    if (t.status === 'done')
      status = <Text>{emoji.get('white_check_mark')}</Text>
    if (t.status === 'error')
      status = <Text>{emoji.get('x')}</Text>
    return (
      <Box key={t.rp+'status'}>{status}</Box>
    )
  })
  return (
    <Box flexDirection="column">
      <Box><Color magenta>Sliq</Color>{' '+emoji.get('robot_face')+emoji.get('rocket')}</Box>
      <Box flexDirection="row">
        <Box flexDirection="column" paddingRight={1} paddingTop={1}>
          <Color blue>Contracts</Color>
          {_contracts}
        </Box>
        <Box flexDirection="column" padding={1}>
          <Color blue>Tests</Color>
          {_tests}
        </Box>
        <Box flexDirection="column" padding={1}>
          <Color blue>Status</Color>
          {_status}
        </Box>
      </Box>
    </Box>
  )
}

module.exports = (contracts, tests, cwd) => {
  let unmount;
  const onError = () => {
    unmount()
    process.exit(1)
  }
  const onExit = () => {
    unmount()
    process.exit()
  }
  unmount = render(
    <Sliq 
      onExit={onExit} 
      onError={onError} 
    />
  )
} 
