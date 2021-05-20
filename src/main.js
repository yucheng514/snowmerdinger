import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import WhiteSharkUI from 'whitesharkui'
import 'whitesharkui/lib/whitesharkui.css'
import "default-passive-events";

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(WhiteSharkUI)

new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
