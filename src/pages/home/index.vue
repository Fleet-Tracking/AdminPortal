<template>
  <b-container>
    <b-row>
      <b-col>
        <b-dropdown
          id="dropdown-1"
          :text="selectedDelivery ? selectedDelivery.phone : ''"
          class="m-md-2"
        >
          <b-dropdown-item
            v-for="user in availableDelivery"
            :key="user.uid"
            @click="setSelected(user)"
            >{{ user.phone }}</b-dropdown-item
          >
        </b-dropdown>
      </b-col>
      <b-col>
        <b-input ref="lat" placeholder="lat"></b-input>
      </b-col>
      <b-col>
        <b-input ref="lng" placeholder="lng"></b-input>
      </b-col>
    </b-row>
    <b-row>
      <b-button @click="submit">Submit</b-button>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Navbar from "@/components/Navbar.vue";
import { mixins } from "vue-class-component";
import FirebaseHandler from "@/utils/firebaseHandler";
import { BFormInput } from "bootstrap-vue";

@Component({
  name: "Home",
  components: {
    Navbar,
  },
})
export default class Home extends mixins(FirebaseHandler) {
  private availableDelivery: UserDetailsExtended[] = [];
  private selectedDelivery: UserDetailsExtended | null = null;

  async created(): Promise<void> {
    if (await this.isAlreadyLogged()) {
      await this.setInitialUserData();
      this.availableDelivery = await this.getAllDelivery();
    }
  }

  private setSelected(user: UserDetailsExtended) {
    this.selectedDelivery = user;
  }

  private getInputValue(ref: string) {
    return (this.$refs[ref] as BFormInput).$data.localValue;
  }

  private submit() {
    const lat = this.getInputValue("lat");
    const lng = this.getInputValue("lng");
    if (this.selectedDelivery && lat && lng) {
      this.setDeliveryData(this.selectedDelivery, lat, lng);
    }
  }
}
</script>
