<script lang="ts">
import { defineComponent, isVue2, isVue3, ref } from 'vue-demi';
import Vue from 'vue';
import VButton from '@martirel-ui/button'

console.log('VButton', VButton);
export default defineComponent({
  name: 'App',
  components: {
    VButton
  },
  data() {
    return {
      Vue2Version: isVue2 ? 'Vue2' : 'Vue3'
    }
  },
  created() {
    console.warn(`Vue env: Vue3:${isVue3} -- Vue2: ${isVue2}`);
    console.log('Vue', Vue);
  },
  methods: {
    handleClick(event: MouseEvent) {
      console.log('App.vue handleClick triggered!', event);
      console.log('Event details:', {
        type: event?.type,
        target: event?.target,
        currentTarget: event?.currentTarget
      });
    }
  },
  mounted() {
    console.log('App mounted - available methods:', this.handleClick);
    console.log('App mounted - components:', this.$options.components);
  }
});
</script>

<template>
  <div>
    <h1>Vue2Version</h1>
    <h2>Button 组件示例</h2>
    <div class="demo-button">
      <v-button type="primary" @click="handleClick">主要按钮</v-button>
      <v-button>默认按钮</v-button>
      <v-button type="success">成功按钮</v-button>
      <v-button type="warning">警告按钮</v-button>
      <v-button type="danger">危险按钮</v-button>
      <v-button type="info">信息按钮</v-button>
    </div>
  </div>
</template>

<style>
body>div {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.demo-button .v-button {
  margin-right: 12px;
  margin-bottom: 12px;
}
</style>
