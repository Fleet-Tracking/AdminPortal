<template>
  <div class="about">
    <Navbar />
    <h1>This is an home page</h1>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Navbar from "@/components/Navbar.vue";
import { mixins } from "vue-class-component";
import FirebaseHandler from "@/utils/firebaseHandler";

@Component({
  name: "Home",
  components: {
    Navbar,
  },
})
export default class Home extends mixins(FirebaseHandler) {
  async created(): Promise<void> {
    if (await this.isAlreadyLogged()) {
      this.setInitialUserData();
    }
  }
}
</script>
