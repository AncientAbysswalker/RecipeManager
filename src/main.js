import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';

// Global Components
import TextareaAutosize from 'vue-textarea-autosize';
Vue.use(TextareaAutosize);

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  data: {
    sessionInfo: null
  },
  render: h => h(App)
}).$mount('#app')
