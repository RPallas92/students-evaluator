import firebase from "firebase";
import { StudentEvaluations } from "./StudentEvaluation";

export class Database {

    private firestore: firebase.firestore.Firestore


    constructor() {
        const firebaseConfig = {
            apiKey: "AIzaSyDkId_dG4QjU31XqPLpGDyWf78gYX9wwFg",
            authDomain: "students-evaluator.firebaseapp.com",
            databaseURL: "https://students-evaluator.firebaseio.com",
            projectId: "students-evaluator",
            storageBucket: "students-evaluator.appspot.com",
            messagingSenderId: "122329597109"
        }
        firebase.initializeApp(firebaseConfig);
        this.firestore = firebase.firestore()
    }

    async saveEvaluations(studentEvaluations: StudentEvaluations): Promise<any> {
        return this.firestore.collection("StudentsEvaluations").add(studentEvaluations)
    }

}