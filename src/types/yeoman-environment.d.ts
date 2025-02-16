declare module 'yeoman-environment' {
  interface GeneratorMeta {
    namespace: string;
    resolved: string;
  }

  interface Environment {
    register(path: string, meta: GeneratorMeta): void;
    run(namespace: string, options?: any): Promise<void>;
  }

  export function createEnv(): Environment;
} 