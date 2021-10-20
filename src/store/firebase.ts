import { FirebaseApp } from '@firebase/app';
import { Database, DatabaseReference } from '@firebase/database';
import { VuexModule } from './module';

export class FirebaseStore extends VuexModule.With({ namespaced: 'firebase' }) {
    private _firebaseInstance: Database | undefined
    private _app: FirebaseApp | undefined

    private _databaseRef: DatabaseReference | undefined

    get db(): Database | undefined {
        return this._firebaseInstance
    }

    set db(f: Database | undefined) {
        this._firebaseInstance = f
    }

    get app(): FirebaseApp | undefined {
        return this._app
    }

    set app(f: FirebaseApp | undefined) {
        this._app = f
    }
}