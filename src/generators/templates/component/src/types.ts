/**
 * <%= ComponentName %> 组件的属性定义
 */
export interface <%= ComponentName %>Props {
  /**
   * 是否禁用组件
   * @default false
   */
  disabled?: boolean;
  
  /**
   * 组件大小
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * 自定义类名
   */
  customClass?: string;
  
  /**
   * 点击事件处理函数
   */
  onClick?: (event: MouseEvent) => void;
}

/**
 * <%= ComponentName %> 组件的实例类型
 */
export type <%= ComponentName %>Instance = InstanceType<typeof <%= ComponentName %>>;
