import Vue from "vue";
import App from "@/App.vue";
// import "@/registerServiceWorker";
import router from "@/router/index";
import { store } from "@/store";
import "@/assets/css/styles.scss";
import './plugins/bootstrap'

Vue.prototype.$mapFields = Vue;
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
});




