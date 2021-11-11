import { vxm } from "@/store";
import { get, push, set } from "@firebase/database";
import { Auth, getAuth } from "firebase/auth";
import { DatabaseReference, ref } from "firebase/database";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class FirebaseHandler extends Vue {
  private auth: Auth | undefined

  created(): void {
    this.auth = getAuth(vxm.firebase.app)
  }

  private get currentUser() {
    return this.auth?.currentUser
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

      if (this.auth?.currentUser) {
        resolve(true)
        return
      }
      this.auth?.onAuthStateChanged((user) => {
        resolve(!!user)
      })
    })
  }

  protected async getAllUsers(type: 'USER' | 'DELIVERY'): Promise<UserDetailsExtended[]> {
    const final: UserDetailsExtended[] = []
    const ref = this.getReference('/users')
    if (ref) {
      const data = await get(ref)
      if (data) {
        const parsed = data.val() as { [key: string]: UserDetails }
        for (const [key, val] of Object.entries(parsed)) {
          if (val.role === type) {
            final.push({ ...val, uid: key })
          }
        }
      }
    }
    return final
  }

  protected async setDeliveryData(delivery: UserDetailsExtended, user: UserDetailsExtended, lat: number, lng: number): Promise<void> {
    const ref = this.getReference(`/delivery/${delivery.uid}`)
    if (ref) {
      const orderRef = push(ref)
      await set(orderRef, {
        lat, lng, user: user.uid
      })

      const userRef = this.getReference(`/receiver/${user.uid}`)
      if (userRef) {
        await set(push(userRef), {
          delivery: delivery.uid,
          order: orderRef.key
        })
      }
    }
  }
}