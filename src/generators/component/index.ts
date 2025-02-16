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

    // Copy all template files
    this.fs.copyTpl(
      `${templatePath}/**/*`,
      destinationPath,
      {
        componentName: componentName,
      },
      {},
      { globOptions: { dot: true } }
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