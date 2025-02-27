<!-- <docs>
### 基础用法
Button组件支持多种类型、尺寸和状态，可以满足各种场景的需求。
</docs> -->
<template>
  <div class="demo-container">
    <h3>按钮类型</h3>
    <div class="button-row">
      <v-button type="primary">Primary</v-button>
      <v-button>Default</v-button>
      <v-button type="success">Success</v-button>
      <v-button type="warning">Warning</v-button>
      <v-button type="danger">Danger</v-button>
    </div>
    
    <h3>按钮尺寸</h3>
    <div class="button-row">
      <v-button size="large">Large</v-button>
      <v-button>Medium (默认)</v-button>
      <v-button size="small">Small</v-button>
      <v-button size="mini">Mini</v-button>
    </div>
    
    <h3>禁用状态</h3>
    <div class="button-row">
      <v-button disabled>禁用按钮</v-button>
      <v-button type="primary" disabled>禁用主要按钮</v-button>
    </div>
    
    <h3>圆角按钮</h3>
    <div class="button-row">
      <v-button round>圆角按钮</v-button>
      <v-button type="primary" round>圆角主要按钮</v-button>
    </div>
    
    <h3>自定义类名</h3>
    <div class="button-row">
      <v-button custom-class="custom-button">自定义样式按钮</v-button>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  
  h3 {
    margin-bottom: 10px;
    font-weight: normal;
    color: #606266;
  }
}

.button-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.custom-button {
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  color: #67c23a;
}
</style>
