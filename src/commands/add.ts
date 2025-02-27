import path from 'path';
import { createEnv } from 'yeoman-environment';
import chalk from 'chalk';

export interface AddOptions {
  componentName?: string;
  path?: string;
}

/**
 * 添加新组件到库
 * @param options 组件选项
 */
export async function add(options: AddOptions) {
  const { componentName } = options;
  
  if (!componentName) {
    console.log(chalk.red('❌ Error: Component name is required.'));
    console.log(chalk.yellow('Please specify a component name:'));
    console.log(chalk.blue('\n  material add MyComponent\n'));
    process.exit(1);
    return;
  }

  console.log(chalk.blue(`🚀 Adding new component: ${componentName}`));

  try {
    // 创建 Yeoman 环境
    const env = createEnv();
    
    // 注册组件生成器路径并解析路径
    const generatorPath = path.resolve(__dirname, '../generators/component');
    env.register(require.resolve(generatorPath), {
      namespace: 'material:component',
      resolved: require.resolve(generatorPath)
    });

    // 运行生成器
    await env.run('material:component', { componentName });
    
    console.log(chalk.green(`\n✨ Component ${componentName} creation process completed!`));
  } catch (error) {
    console.error(chalk.red('\n❌ Failed to create component:'), error);
    process.exit(1);
  }
} 