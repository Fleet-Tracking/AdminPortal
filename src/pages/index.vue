<template>
  <b-container>
    <b-row>
      <b-col v-if="!gotConfirmation"> Enter Phone number </b-col>
      <b-col v-else> Enter OTP </b-col>
    </b-row>
    <b-row>
      <b-input v-if="!gotConfirmation" v-model="phoneNumber" />
      <b-input v-else v-model="otp" />
    </b-row>
    <b-row
      ><b-button id="sign-in-button" @click="handleSubmit"
        >Submit</b-button
      ></b-row
    >
  </b-container>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Navbar from "@/components/Navbar.vue";
import AuthHandler from "@/utils/authHandler";
import { mixins } from "vue-class-component";

@Component({
  name: "Home",
  components: {
    Navbar,
  },
})
export default class Home extends mixins(AuthHandler) {
  private phoneNumber = "";
  private otp = "";
  private gotConfirmation = false;
  private handleSubmit() {
    if (this.gotConfirmation) {
      this.submitOTP();
    } else {
      this.loginToFirebase();
    }
  }
  private loginToFirebase() {
    this.login(this.phoneNumber)
      .then((confirm) => {
        if (confirm) this.gotConfirmation = true;
      })
      .catch((err) => console.error(err));
  }
  private submitOTP() {
    if (this.otp) this.confirm(this.otp).then(() => this.gotoHome());
  }
  mounted(): void {
    this.isAlreadyLogged().then((val) => {
      if (val) {
        this.gotoHome();
      }
    });
  }
  private gotoHome() {
    this.$router.replace("/home");
  }
}
</script>

<style scoped>
</style>
