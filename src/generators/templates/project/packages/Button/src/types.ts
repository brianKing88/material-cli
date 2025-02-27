export type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type ButtonSize = 'small' | 'medium' | 'large' | 'mini';

/**
 * Button 组件的属性定义
 */
export interface ButtonProps {
  /**
   * 按钮类型
   */
  type?: ButtonType;
  
  /**
   * 按钮大小
   * @default 'medium'
   */
  size?: ButtonSize;
  
  /**
   * 是否禁用按钮
   * @default false
   */
  disabled?: boolean;
  
  /**
   * 是否为圆角按钮
   * @default false
   */
  round?: boolean;
  
  /**
   * 自定义类名
   */
  customClass?: string;
  
  /**
   * 点击事件处理函数
   */
  onClick?: (event: MouseEvent) => void;
}

export interface ButtonEmits {
  (e: 'click', event: MouseEvent): void;
}
