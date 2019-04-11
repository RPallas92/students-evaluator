import firebase from "firebase";
import { StudentEvaluations } from "./StudentEvaluation";
import { firebaseConfig } from "./FirebaseConfig";
import { AppState } from "./App";

const stateKey = "stateKey"

export class Database {

    private firestore: firebase.firestore.Firestore

    constructor() {        
        firebase.initializeApp(firebaseConfig);
        this.firestore = firebase.firestore()
    }

    saveState(state: AppState) {
        localStorage.setItem("appState", JSON.stringify(state))
    }

    getState(): AppState | null {
        const unparsedState = localStorage.getItem("appState")
        if(unparsedState) {
            return JSON.parse(unparsedState)
        } else {
            return null
        }
    }

    async saveStateOnCloud(state: AppState): Promise<any> {
        // TODO: Update if exists
        return this.firestore.collection("StudentsEvaluationsState").add(state)
    }

    async getStateFromCloud(): Promise<AppState | null> {
        const collection = await this.firestore.collection("StudentsEvaluationsState").get()
        if (collection.docs.length > 0) {
            return collection.docs[0].data() as AppState
        } else {
            return null
        }
    }

}