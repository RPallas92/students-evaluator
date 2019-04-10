import firebase from "firebase";
import { StudentEvaluations } from "./StudentEvaluation";
import { firebaseConfig } from "./FirebaseConfig";
import { AppState } from "./App";

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

    async saveStateOnCloud(studentEvaluations: StudentEvaluations): Promise<any> {
        return this.firestore.collection("StudentsEvaluations").add(studentEvaluations)
    }

}