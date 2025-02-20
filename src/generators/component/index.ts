const Generator = require('yeoman-generator');
const path = require('path');

module.exports = class extends Generator {
  answers: any;

  constructor(args: string | string[], opts: any) {
    super(args, opts);
    this.argument('componentName', { type: String, required: false });
  }

  initializing() {
    this.log('🚀 Creating new component...');
  }

  async prompting() {
    const prompts = [];

    if (!this.options.componentName) {
      prompts.push({
        type: 'input',
        name: 'componentName',
        message: 'Your component name',
        default: 'Button'
      });
    }

    this.answers = await this.prompt(prompts);
  }

  writing() {
    const componentName = this.options.componentName || this.answers.componentName;
    const templatePath = path.join(__dirname, '../../../src/generators/templates/component');
    const destinationPath = this.destinationPath(`packages/${componentName}`);

    // 准备模板变量
    const templateVars = {
      componentName,
      // 组件名首字母大写
      ComponentName: componentName.charAt(0).toUpperCase() + componentName.slice(1),
      // 组件名转换为 kebab-case
      kebabCaseName: componentName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, ''),
      // package name
      packageName: `@martirel-ui/${componentName.toLowerCase()}`
    };

    // 复制并处理模板文件
    this.fs.copyTpl(
      `${templatePath}/package.json`,
      path.join(destinationPath, 'package.json'),
      templateVars
    );

    this.fs.copyTpl(
      `${templatePath}/material.config.ts`,
      path.join(destinationPath, 'material.config.ts'),
      templateVars
    );

    // 复制并重命名组件文件
    this.fs.copyTpl(
      `${templatePath}/src/component.vue`,
      path.join(destinationPath, 'src', `${templateVars.ComponentName}.vue`),
      templateVars
    );

    this.fs.copyTpl(
      `${templatePath}/src/index.ts`,
      path.join(destinationPath, 'src/index.ts'),
      templateVars
    );

    this.fs.copyTpl(
      `${templatePath}/src/types.ts`,
      path.join(destinationPath, 'src/types.ts'),
      templateVars
    );

    // 复制测试文件
    this.fs.copyTpl(
      `${templatePath}/__tests__/component.test.ts`,
      path.join(destinationPath, '__tests__', `${templateVars.ComponentName}.test.ts`),
      templateVars
    );

    // 复制其他文件
    this.fs.copyTpl(
      `${templatePath}/src/types/index.ts`,
      path.join(destinationPath, 'src/types/index.ts'),
      templateVars
    );

    this.fs.copyTpl(
      `${templatePath}/src/shims-vue.d.ts`,
      path.join(destinationPath, 'src/shims-vue.d.ts'),
      templateVars
    );

    this.fs.copyTpl(
      `${templatePath}/env.d.ts`,
      path.join(destinationPath, 'env.d.ts'),
      templateVars
    );

    this.log(`\n📦 Creating component in packages/${componentName}`);
  }

  end() {
    const componentName = this.options.componentName || this.answers.componentName;
    this.log('\n✨ Component creation completed!');
    this.log(`\nNext steps:\n`);
    this.log(`  cd packages/${componentName}`);
    this.log('  pnpm install');
    this.log('  pnpm build\n');
  }
}; 