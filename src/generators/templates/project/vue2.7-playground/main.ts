import Vue, { version } from 'vue';
import { TemplateComponent } from '../src/index';
import App from './App.vue';

console.warn('2.7 Vue version: ', version);
Vue.config.productionTip = false;
Vue.use(TemplateComponent);

new Vue({ render: h => h(App as any) }).$mount('#app');
