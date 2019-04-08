const React = require('react')
const { useState } = require('react')
const { render, Color, Text, Box } = require('ink')
const IBox = require('ink-box')
const Spinner = require('ink-spinner').default

const Sliq = (props) => {
  let contracts = props.contracts.map(c => {
    return (
      <Box key={c.rp+'contract'}>{c.rp}</Box>
    )
  })
  let tests = props.tests.map(t => {
    return (
      <Box key={t.rp+'test'}>{t.rp}</Box>
    )
  })
  let status = props.tests.map(t => {
    return (
      <Box key={t.rp+'status'}>{t.status}</Box>
    )
  })
  return (
    <Box flexDirection="column">
      <Box><Color magenta>Sliq</Color></Box>
      <Box flexDirection="row">
        <Box flexDirection="column" paddingRight={1} paddingTop={1}>
          <Color blue>Contracts</Color>
          {contracts}
        </Box>
        <Box flexDirection="column" padding={1}>
          <Color blue>Tests</Color>
          {tests}
        </Box>
        <Box flexDirection="column" padding={1}>
          <Color blue>Status</Color>
          {status}
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
  tests = tests.map(t => {
    return {
      fp: t,
      rp: t.replace(cwd, '.'),
      status: 'waiting'
    }
  })
  contracts = contracts.map(c => {
    return {
      fp: c,
      rp: c.replace(cwd, '.')
    }
  })
  unmount = render(
    <Sliq 
      contracts={contracts} 
      tests={tests}
      cwd={cwd} 
      onExit={onExit} 
      onError={onError} 
    />
  )
} 
