import path from 'path';

/**
 * 获取项目根目录
 */
export function getRootDir(): string {
  return process.cwd();
}

/**
 * 获取 packages 目录
 */
export function getPackagesDir(): string {
  return path.join(getRootDir(), 'packages');
}

/**
 * 获取 templates 目录
 */
export function getTemplatesDir(): string {
  return path.join(getRootDir(), 'templates');
} 