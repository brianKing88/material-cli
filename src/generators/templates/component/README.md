# Alert 警告提示

### 介绍

向用户显示警告的信息时，通过警告提示，展现需要关注的信息。

### 引入

```js
import { MrpAlert } from '@tuhu/shop-mars-pc';
```

## 代码演示

:::demo ./demo/basic.vue
:::

:::demo ./demo/type.vue
:::

:::demo ./demo/title.vue
:::

:::demo ./demo/closeable.vue
:::

:::demo ./demo/closeElement.vue
:::

:::demo ./demo/icon.vue
:::

:::demo ./demo/action.vue
:::

:::demo ./demo/banner.vue
:::

## API

### Alert Props

|参数名|描述|类型|默认值|
|---|---|---|:---:|
|type|警告提示的类型|`info \| success \| warning \| error \| normal`|`'info'`|
|show-icon|是否展示图标|`boolean`|`true`|
|closable|是否展示关闭按钮|`boolean`|`false`|
|title|警告提示的标题|`string`|`-`|
|banner|是否作为顶部公告使用（去除边框和圆角）|`boolean`|`false`|

### Alert Events

|事件名|描述|参数|
|---|---|---|
|close|点击关闭按钮时触发|ev: `MouseEvent`|
|after-close|关闭动画结束后触发|-|

### Alert Slots

|插槽名|描述|参数|版本|
|---|:---:|---|:---|
|icon|图标|-||
|title|标题|-||
|action|操作项|-||
|close-element|关闭元素|-|2.36.0|