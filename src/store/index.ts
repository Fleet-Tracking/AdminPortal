import Vue from "vue";
import Vuex from "vuex";
import { createProxy, extractVuexModule } from "vuex-class-component";
import { FirebaseStore } from "./firebase";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    ...extractVuexModule(FirebaseStore)
  }
})

// Creating proxies.
export const vxm = {
  firebase: createProxy(store, FirebaseStore),
}
