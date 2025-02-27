const Generator = require('yeoman-generator');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

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

    // 读取根 package.json 获取包名前缀
    let packagePrefix = '';
    try {
      const rootPackageJsonPath = this.destinationPath('package.json');
      if (fs.existsSync(rootPackageJsonPath)) {
        const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'));
        packagePrefix = rootPackageJson.name || '';
      }
    } catch (error) {
      this.log(chalk.yellow(`Warning: Could not read root package.json. Using default package prefix.`));
      packagePrefix = 'material-cli';
    }

    // 准备模板变量
    const templateVars = {
      componentName,
      // 组件名首字母大写
      ComponentName: componentName.charAt(0).toUpperCase() + componentName.slice(1),
      // 组件名转换为 kebab-case
      kebabCaseName: componentName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, ''),
      // package name - 使用根 package.json 中的 name 作为前缀
      packageName: `${packagePrefix}/${componentName.toLowerCase()}`
    };

    // 如果包名不是以 @ 开头的作用域包，则添加 @
    if (packagePrefix && !packagePrefix.startsWith('@')) {
      templateVars.packageName = `@${packagePrefix}/${componentName.toLowerCase()}`;
    }

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

    // 更新 src/components/index.ts 文件，添加新组件的导出
    const componentsIndexPath = this.destinationPath('src/components/index.ts');
    
    // 检查文件是否存在
    if (fs.existsSync(componentsIndexPath)) {
      // 读取现有内容
      let content = this.fs.read(componentsIndexPath);
      const { ComponentName } = templateVars;
      
      // 检查是否已经导出了这个组件
      if (!content.includes(`../../packages/${componentName}/src`)) {
        // 在文件末尾添加新组件的导出语句
        const exportStatement = `export * from '../../packages/${componentName}/src'\n`;
        
        // 如果文件中有注释指示添加位置，则在注释后添加
        if (content.includes('// 当你添加新组件时，请在这里导出它们')) {
          content = content.replace(
            '// 当你添加新组件时，请在这里导出它们',
            `// 当你添加新组件时，请在这里导出它们\n${exportStatement}`
          );
        } else {
          // 否则直接添加到文件末尾
          content += exportStatement;
        }
        
        // 写回文件
        this.fs.write(componentsIndexPath, content);
        this.log(`✅ Updated src/components/index.ts with ${ComponentName} component`);
      } else {
        this.log(`ℹ️ Component ${ComponentName} already exported in src/components/index.ts`);
      }
    } else {
      this.log(`⚠️ src/components/index.ts not found. Make sure to manually export your component.`);
    }

    this.log(`\n📦 Creating component in packages/${componentName}`);
  }

  end() {
    const componentName = this.options.componentName || this.answers.componentName;
    const ComponentName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
    
    this.log('\n✨ Component creation completed!');
    this.log(`\nNext steps:\n`);
    this.log(`  cd packages/${componentName}`);
    this.log('  pnpm install');
    this.log('  pnpm build');
    this.log(`\n💡 Your component ${ComponentName} has been automatically added to src/components/index.ts`);
    this.log('  If you need to customize the export, please check that file.\n');
  }
}; 