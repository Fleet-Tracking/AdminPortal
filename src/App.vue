<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { Component, Vue } from "vue-property-decorator";
import { vxm } from "./store";
import { firebaseConfig } from "./utils/constants";

@Component({
  name: "App",
})
export default class App extends Vue {
  mounted(): void {
    vxm.firebase.app = initializeApp(firebaseConfig);
    vxm.firebase.db = getDatabase(vxm.firebase.app);
  }
}
</script>

