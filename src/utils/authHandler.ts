import { Auth, browserSessionPersistence, ConfirmationResult, getAuth, RecaptchaVerifier, setPersistence, signInWithPhoneNumber, UserCredential } from "firebase/auth";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class AuthHandler extends Vue {
    private auth: Auth | undefined
    private recaptchaVerifier: RecaptchaVerifier | undefined
    private confirmationResult: ConfirmationResult | undefined

    created(): void {
        this.auth = getAuth()
    }

    protected async login(phn: string): Promise<ConfirmationResult | undefined> {
        if (this.auth) {
            await setPersistence(this.auth, browserSessionPersistence)

            return new Promise((resolve, reject) => {
                this.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
                    size: 'invisible',
                    callback: () => {
                        // reCAPTCHA solved, allow signInWithPhoneNumber.
                        this.signInWithPhoneNumber(phn).then(resolve).catch(reject)
                    }

                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                }, this.auth!);
                this.recaptchaVerifier.verify()
            })
        } else {
            throw new Error('Auth not initialized')
        }
    }

    private async signInWithPhoneNumber(phn: string) {
        if (this.recaptchaVerifier && this.auth)
            this.confirmationResult = await signInWithPhoneNumber(this.auth, phn, this.recaptchaVerifier)
        return this.confirmationResult
    }

    protected async confirm(otp: string): Promise<UserCredential | undefined> {
        const user = await this.confirmationResult?.confirm(otp)
        return user
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
}