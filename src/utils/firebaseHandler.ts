import { vxm } from "@/store";
import { set } from "@firebase/database";
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

    protected setInitialUserData(): void {
        if (this.currentUser) {
            const ref = this.getReference('/users/' + this.currentUser.uid)
            if (ref) {
                set(ref, {
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
}