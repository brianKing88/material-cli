// import type Generator from 'yeoman-generator';
import path from 'path';
import chalk from 'chalk';

const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  answers: any;

  constructor(args: string | string[], opts: any) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // This makes `projectName` available as an argument
    this.argument('projectName', { type: String, required: false });
  }

  initializing() {
    this.log('🚀 Initializing Vue component library project...');
  }

  async prompting() {
    const prompts = [];

    if (!this.options.projectName) {
      prompts.push({
        type: 'input',
        name: 'projectName',
        message: 'Your project name',
        default: path.basename(process.cwd())
      });
    }

    this.answers = await this.prompt(prompts);
  }

  writing() {
    const projectName = this.options.projectName || this.answers.projectName;
    const templatePath = path.join(__dirname, '../../../src/generators/templates/project');
    const destinationPath = projectName === path.basename(process.cwd())
      ? this.destinationPath()
      : this.destinationPath(projectName);

    // Copy all template files
    this.fs.copyTpl(
      `${templatePath}/**/*`,
      destinationPath,
      {
        projectName: projectName,
      },
      {},
      { globOptions: { dot: true } }
    );
  }

  end() {
    const projectName = this.options.projectName || this.answers.projectName;
    this.log('\n✨ Project initialization completed!');
    this.log(`\nNext steps:\n`);
    if (projectName !== path.basename(process.cwd())) {
      this.log(`  cd ${projectName}`);
    }
    this.log('  pnpm install');
    this.log('  pnpm dev\n');
  }
}; 