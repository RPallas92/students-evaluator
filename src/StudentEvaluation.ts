export interface StudentEvaluation {
	id: number
	name: string
	units: number[]
	unitsGrade: number
	tasksGrade: number
	dailyGrade: number
	finalGrade: number
}

export interface GradesConfig {
	unitsGradePercentage: number
	tasksGradePercentage: number
	dailyGradePercentage: number
}

export function isConfigValid(config: GradesConfig): boolean {
	return config.unitsGradePercentage + config.tasksGradePercentage + config.dailyGradePercentage == 100
}

export function calculateGrades(evaluations: StudentEvaluation[], config: GradesConfig): StudentEvaluation[] {
	return evaluations.map((evaluation) => calculateGradesForEvaluation(evaluation, config))
}

export function calculateGradesForEvaluation(evaluation: StudentEvaluation, config: GradesConfig): StudentEvaluation {
	const unitsGrade = evaluation.units.reduce((acc, unit) => unit + acc, 0) / evaluation.units.length
	const finalGrade = ((unitsGrade * config.unitsGradePercentage) + (evaluation.dailyGrade * config.dailyGradePercentage) + (evaluation.tasksGrade * config.tasksGradePercentage)) / 100
	return {...evaluation, unitsGrade, finalGrade}
}