import { cac } from 'cac'
import { build } from './commands/build'
import { version } from '../package.json'
import type { MaterialConfig, BuildOptions } from './types'

export { defineConfig }
export type { MaterialConfig }

function defineConfig(config: MaterialConfig) {
  return config
}

const cli = cac('material')

cli
  .command('[default]', 'Show version info')
  .action(() => {
    console.log(`material-cli v${version}`)
    cli.outputHelp()
  })

cli
  .command('build', 'Build components')
  .option('--watch', 'Watch mode')
  .action(async (options: BuildOptions) => {
    await build(options)
  })

cli.help()
cli.version(version)

cli.parse() 