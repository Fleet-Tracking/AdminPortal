import { vxm } from "@/store";
import { get, push, set } from "@firebase/database";
import { getAuth } from "firebase/auth";
import { DatabaseReference, ref } from "firebase/database";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class FirebaseHandler extends Vue {
  private auth = getAuth(vxm.firebase.app)

  private get currentUser() {
    return this.auth.currentUser
  }

  private getReference(path: string): DatabaseReference | undefined {
    if (vxm.firebase.db)
      return ref(vxm.firebase.db, path)
  }

  protected async setInitialUserData(): Promise<void> {
    if (this.currentUser) {
      const ref = this.getReference('/users/' + this.currentUser.uid)
      if (ref) {
        await set(ref, {
          phone: this.currentUser.phoneNumber,
          role: 'ADMIN'
        })
      }
    }
  }

  protected async isAlreadyLogged(): Promise<boolean> {
    return new Promise(resolve => {

      if (this.auth.currentUser) {
        resolve(true)
        return
      }
      this.auth.onAuthStateChanged((user) => {
        resolve(!!user)
      })
    })
  }

  protected async getAllDelivery(): Promise<UserDetailsExtended[]> {
    const final: UserDetailsExtended[] = []
    const ref = this.getReference('/users')
    if (ref) {
      const data = await get(ref)
      if (data) {
        const parsed = data.val() as { [key: string]: UserDetails }
        for (const [key, val] of Object.entries(parsed)) {
          if (val.role === 'DELIVERY') {

            final.push({ ...val, uid: key })
          }
        }
      }
    }
    return final
  }

  protected async setDeliveryData(user: UserDetailsExtended, lat: number, lng: number): Promise<void> {
    const ref = this.getReference(`/delivery/${user.uid}`)
    if (ref) {
      return set(push(ref), {
        lat, lng
      })
    }
  }
}