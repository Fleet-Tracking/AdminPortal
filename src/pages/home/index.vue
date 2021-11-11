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
            @click="setSelectedDelivery(user)"
            >{{ user.phone }}</b-dropdown-item
          >
        </b-dropdown>
      </b-col>
      <b-col>
        <b-dropdown
          id="dropdown-2"
          :text="selectedUser ? selectedUser.phone : ''"
          class="m-md-2"
        >
          <b-dropdown-item
            v-for="user in availableUser"
            :key="user.uid"
            @click="setSelectedUser(user)"
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

  private availableUser: UserDetailsExtended[] = [];
  private selectedUser: UserDetailsExtended | null = null;

  async created(): Promise<void> {
    if (await this.isAlreadyLogged()) {
      await this.setInitialUserData();
      this.availableDelivery = await this.getAllUsers("DELIVERY");
      this.availableUser = await this.getAllUsers("USER");
    }
  }

  private setSelectedDelivery(user: UserDetailsExtended) {
    this.selectedDelivery = user;
  }

  private setSelectedUser(user: UserDetailsExtended) {
    this.selectedUser = user;
  }

  private getInputValue(ref: string) {
    return (this.$refs[ref] as BFormInput).$data.localValue;
  }

  private submit() {
    const lat = this.getInputValue("lat");
    const lng = this.getInputValue("lng");
    if (this.selectedDelivery && this.selectedUser && lat && lng) {
      this.setDeliveryData(this.selectedDelivery, this.selectedUser, lat, lng);
    }
  }
}
</script>
