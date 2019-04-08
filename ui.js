const React = require('react')
const { render, Box } = require('ink')

const Demo = () => (
  <Box>
    Hello World
  </Box>
)

module.exports = () => {
  let unmount;
  const onError = () => {
    unmount()
    process.exit(1)
  }
  const onExit = () => {
    unmount()
    process.exit()
  }
  unmount = render(<Demo onExit={onExit} onError={onError} />)
} 
