import { cac } from 'cac';
import { build } from './commands/build';
import { dev } from './commands/dev';
import { version } from '../package.json';
import path from 'path';
import { createEnv } from 'yeoman-environment';
import fs from 'fs-extra';
import chalk from 'chalk';

const cli = cac('material');

cli
  .command('[default]', 'Show version info')
  .action(() => {
    console.log(`material-cli v${version}`);
    cli.outputHelp();
  });

cli
  .command('init [projectName]', 'Initialize a new Vue component library project')
  .action(async (projectName: string) => {
    console.log(projectName);

    // Create a Yeoman environment
    const env = createEnv();
    
    // Register the generator path and resolve the path
    const generatorPath = path.resolve(__dirname, './generators/app');
    env.register(require.resolve(generatorPath), {
      namespace: 'material:app',
      resolved: require.resolve(generatorPath)
    });

    // Run the generator with options
    await env.run('material:app', { projectName });
  });

cli
  .command('add [componentName]', 'Add a new component to the library')
  .action(async (componentName: string) => {
    // Create a Yeoman environment
    const env = createEnv();
    
    // Register the generator path and resolve the path
    const generatorPath = path.resolve(__dirname, './generators/component');
    env.register(require.resolve(generatorPath), {
      namespace: 'material:component',
      resolved: require.resolve(generatorPath)
    });

    // Run the generator with options
    await env.run('material:component', { componentName });
  });

cli
  .command('dev [component]', 'Start development server')
  .option('--vue <version>', 'Vue version to use (2, 2.7, or 3)', { default: '3' })
  .option('--watch', 'Enable watch mode')
  .option('--all', 'Develop all components in playground mode')
  .option('--last', 'Develop the last component you worked on')
  .action(async (component: string | undefined, options: { vue: string, watch: boolean, all: boolean, last: boolean }) => {
    await dev({
      component,
      vueVersion: options.vue as '2' | '2.7' | '3',
      watch: options.watch,
      all: options.all,
      last: options.last
    });
  });

cli
  .command('build', 'Build components')
  .option('--watch', 'Watch mode')
  .action(async (options) => {
    await build(options);
  });

cli.help();
cli.version(version);

cli.parse();
