export interface StudentEvaluation {
	id: number
	name: string
	units: number[]
	unitsGrade: number
	tasksGrade: number
	dailyGrade: number
	finalGrade: number
}

export class GradesConfig {

	public static create() {

	}

	private isConfigValid(): boolean {
		return false
	}

	private constructor() {

	}

	unitsGradePercentage: number
	dai
}