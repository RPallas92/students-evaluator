import firebase from "firebase";
import { StudentEvaluations } from "./StudentEvaluation";
import { firebaseConfig } from "./FirebaseConfig";
import App, { AppState } from "./App";

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
        const cleanedState = { state: JSON.stringify(state)}
        return this.firestore.collection("StudentsEvaluationsState").doc(stateKey).set(cleanedState)
    }

    async getStateFromCloud(): Promise<AppState | null> {
        const stateRef = await this.firestore.collection("StudentsEvaluationsState").doc(stateKey)
        const doc = await stateRef.get()
        const docData = doc.data()
        if (docData) {
            const flatState = docData.state as string
            return JSON.parse(flatState) as AppState
        } else {
            return null
        }
    }

}