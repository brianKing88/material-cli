<!-- <docs>
### 基础用法
<%= ComponentName %>组件的基础示例，展示了不同尺寸和状态
</docs> -->
<template>
  <div class="demo-container">
    <h3>默认状态 (medium)</h3>
    <<%= kebabCaseName %>>默认尺寸的<%= ComponentName %>组件</<%= kebabCaseName %>>
    
    <h3>小尺寸 (small)</h3>
    <<%= kebabCaseName %> size="small">小尺寸的<%= ComponentName %>组件</<%= kebabCaseName %>>
    
    <h3>大尺寸 (large)</h3>
    <<%= kebabCaseName %> size="large">大尺寸的<%= ComponentName %>组件</<%= kebabCaseName %>>
    
    <h3>禁用状态</h3>
    <<%= kebabCaseName %> disabled>禁用状态的<%= ComponentName %>组件</<%= kebabCaseName %>>
    
    <h3>自定义类名</h3>
    <<%= kebabCaseName %> custom-class="custom-component">带自定义类名的<%= ComponentName %>组件</<%= kebabCaseName %>>
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

.custom-component {
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  color: #67c23a;
}
</style>
  