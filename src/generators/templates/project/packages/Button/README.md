# Button 按钮

### 介绍

按钮组件

### 引入

```js
import { MrpButton } from '@tuhu/shop-mars-pc';

const { MrpButtonGroup } = MrpButton;
// 或
app.use(MrpButton);
```

## 代码演示

:::demo ./demo/basic.vue
:::

:::demo ./demo/icon.vue
:::

:::demo ./demo/square.vue
:::

:::demo ./demo/size.vue
:::

:::demo ./demo/status.vue
:::

:::demo ./demo/disabled.vue
:::

:::demo ./demo/loading.vue
:::

:::demo ./demo/long.vue
:::

:::demo ./demo/debounce.vue
:::

:::demo ./demo/group.vue
:::

## API

### Props

| 参数名    | 描述                                                                                                                                          | 类型                                                          |    默认值     |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | :-----------: |
| type      | 按钮的类型，分为五种：次要按钮、主要按钮、虚框按钮、线性按钮、文字按钮。                                                                      | `'primary' \| 'secondary' \| 'outline' \| 'dashed' \| 'text'` | `'secondary'` |
| shape     | 按钮的形状                                                                                                                                    | `'square' \| 'round' \| 'circle'`                             |      `-`      |
| status    | 按钮的状态                                                                                                                                    | `'normal' \| 'warning' \| 'success' \| 'danger'`              |  `'normal'`   |
| size      | 按钮的尺寸                                                                                                                                    | `'mini' \| 'small' \| 'medium' \| 'large'`                    |  `'medium'`   |
| long      | 按钮的宽度是否随容器自适应。                                                                                                                  | `boolean`                                                     |    `false`    |
| loading   | 按钮是否为加载中状态                                                                                                                          | `boolean`                                                     |    `false`    |
| disabled  | 按钮是否禁用                                                                                                                                  | `boolean`                                                     |    `false`    |
| html-type | 设置 `button` 的原生 `type` 属性，可选值参考 [HTML 标准](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type '_blank') | `string`                                                      |  `'button'`   |
| href      | 设置跳转链接。设置此属性时，按钮渲染为 a 标签。                                                                                               | `string`                                                      |      `-`      |
| debounce  | 设置防抖时间                                                                                                                           | `number`                                                     |    `0`    |


### Events

| 事件名 | 描述           | 参数             |
| ------ | -------------- | ---------------- |
| click  | 点击按钮时触发 | ev: `MouseEvent` |

### Slots

| 插槽名 | 描述 | 参数 |
| ------ | :--: | ---- |
| icon   | 图标 | -    |

### ButtonGroup Props

| 参数名   | 描述                                                                     | 类型                                                          | 默认值  |
| -------- | ------------------------------------------------------------------------ | ------------------------------------------------------------- | :-----: |
| type     | 按钮的类型，分为五种：次要按钮、主要按钮、虚框按钮、线性按钮、文字按钮。 | `'primary' \| 'secondary' \| 'outline' \| 'dashed' \| 'text'` |   `-`   |
| status   | 按钮的状态                                                               | `'normal' \| 'warning' \| 'success' \| 'danger'`              |   `-`   |
| shape    | 按钮的形状                                                               | `'square' \| 'round' \| 'circle'`                             |   `-`   |
| size     | 按钮的尺寸                                                               | `'mini' \| 'small' \| 'medium' \| 'large'`                    |   `-`   |
| disabled | 全部子按钮是否禁用                                                       | `boolean`                                                     | `false` |

## 主题定制

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 MrpCol 组件

| 名称   | 默认值 | 描述 |
| ------ | ------ | ---- |
| --demo | _80%_  | -    |
