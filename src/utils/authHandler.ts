import { vxm } from "@/store";
import { browserSessionPersistence, ConfirmationResult, getAuth, RecaptchaVerifier, setPersistence, signInWithPhoneNumber, UserCredential } from "firebase/auth";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class AuthHandler extends Vue {
    private auth = getAuth(vxm.firebase.app)
    private recaptchaVerifier: RecaptchaVerifier | undefined
    private confirmationResult: ConfirmationResult | undefined

    protected async login(phn: string): Promise<ConfirmationResult | undefined> {
        await setPersistence(this.auth, browserSessionPersistence)

        return new Promise((resolve, reject) => {
            this.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
                size: 'invisible',
                callback: () => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                    this.signInWithPhoneNumber(phn).then(resolve).catch(reject)
                }
            }, this.auth);
            this.recaptchaVerifier.verify()
        })
    }

    private async signInWithPhoneNumber(phn: string) {
        if (this.recaptchaVerifier)
            this.confirmationResult = await signInWithPhoneNumber(this.auth, phn, this.recaptchaVerifier)
        return this.confirmationResult
    }

    protected async confirm(otp: string): Promise<UserCredential | undefined> {
        const user = await this.confirmationResult?.confirm(otp)
        return user
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