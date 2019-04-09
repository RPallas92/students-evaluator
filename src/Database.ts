import firebase from "firebase";
import { StudentEvaluations } from "./StudentEvaluation";
import { firebaseConfig } from "./FirebaseConfig";

export class Database {

    private firestore: firebase.firestore.Firestore

    constructor() {        
        firebase.initializeApp(firebaseConfig);
        this.firestore = firebase.firestore()
    }

    async saveEvaluations(studentEvaluations: StudentEvaluations): Promise<any> {
        return this.firestore.collection("StudentsEvaluations").add(studentEvaluations)
    }

}