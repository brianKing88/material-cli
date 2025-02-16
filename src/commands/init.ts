import Generator from 'yeoman-generator';
import path from 'path';

export class InitGenerator extends Generator {
  private projectName: string;

  constructor(args: string[], opts: any) {
    super(args, opts);
    this.projectName = args[0] || path.basename(process.cwd());
  }

  async initializing() {
    this.log('🚀 Initializing Vue component library project...');
  }

  async writing() {
    const templatePath = path.join(__dirname, '../generators/templates/project');
    const destinationPath = this.projectName === path.basename(process.cwd())
      ? process.cwd()
      : path.join(process.cwd(), this.projectName);

    // Copy all template files
    this.fs.copyTpl(
      `${templatePath}/**/*`,
      destinationPath,
      {
        projectName: this.projectName,
      },
      {},
      // { globOptions: { dot: true } }
    );
  }

  async end() {
    this.log('\n✨ Project initialization completed!');
    this.log(`\nNext steps:\n`);
    if (this.projectName !== path.basename(process.cwd())) {
      this.log(`  cd ${this.projectName}`);
    }
    this.log('  pnpm install');
    this.log('  pnpm dev\n');
  }
}

export async function init(projectName?: string) {
  return new Promise((resolve, reject) => {
    const generator = new InitGenerator([projectName || ''], {
      resolved: require.resolve('./init.js'),
      namespace: 'material:app'
    });

    generator.run().then(resolve).catch(reject);
  });
} 