import Vue from "vue";
import App from "@/App.vue";
import "@/registerServiceWorker";
import router from "@/router/index";
import { store, vxm } from "@/store";
import "@/assets/css/styles.scss";
import './plugins/bootstrap'

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { firebaseConfig } from "./utils/constants";

Vue.prototype.$mapFields = Vue;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

vxm.firebase.app = initializeApp(firebaseConfig);

vxm.firebase.db = getDatabase(vxm.firebase.app);



