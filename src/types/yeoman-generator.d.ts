declare module 'yeoman-generator' {
  class Generator {
    constructor(args: string[], opts: any);
    
    // Properties
    fs: {
      copyTpl(
        from: string,
        to: string,
        context?: any,
        templateOptions?: any,
        copyOptions?: { globOptions: { dot: boolean } }
      ): void;
    };
    options: Record<string, any>;
    answers: Record<string, any>;

    // Methods
    argument(name: string, config: { type: any; required?: boolean }): void;
    log(message: string): void;
    prompt(questions: Array<{
      type: string;
      name: string;
      message: string;
      default?: any;
      choices?: Array<{ name: string; value: any }>;
    }>): Promise<Record<string, any>>;
    templatePath(...paths: string[]): string;
    destinationPath(...paths: string[]): string;
    run(): Promise<void>;
  }

  export = Generator;
} 