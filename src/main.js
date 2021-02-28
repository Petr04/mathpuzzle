import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import store from './vuex'
import axios from './plugins/axios';
import router from './router';
import './assets/css/main.css';

Vue.config.productionTip = false

Vue.prototype.$axios = axios;

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
