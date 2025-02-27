import { cac } from 'cac';
import { build } from './commands/build';
import { dev } from './commands/dev';
import { add } from './commands/add';
import { version } from '../package.json';
import path from 'path';
import { createEnv } from 'yeoman-environment';

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
    await add({ componentName });
  });

cli
  .command('build', 'Build components')
  .option('--watch', 'Watch mode')
  .action(async (options) => {
    await build(options);
  });

cli
  .command('dev', 'Start development server')
  .option('--component <component>', 'Component to develop')
  .option('--vue-version <version>', 'Vue version (2, 2.7 or 3)')
  .option('--watch', 'Watch mode')
  .option('--mode <mode>', 'Development mode (playground or docs)')
  .option('--all', 'Develop all components')
  .option('--last', 'Use the last component')
  .action(async (options) => {
    // 设置默认值
    options.vueVersion = options.vueVersion || '3';
    options.mode = options.mode || 'playground';
    
    await dev(options);
  });

cli.help();
cli.version(version);

cli.parse(); 