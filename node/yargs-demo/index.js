const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
yargs(hideBin(process.argv))
  .command('server [port]', 'start the server', (yargs) => {
    return yargs.positional('port', {
      describe: 'port to bind on',
      default: 5000,
    })
  })
  .parse()

