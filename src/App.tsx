import React, { Component } from 'react';
import './App.css';
import ReactDataSheet from 'react-datasheet';
import "react-datasheet/lib/react-datasheet.css";
import { Pane, Button, Text, Heading, Select, TextInput } from 'evergreen-ui';
import { StudentEvaluation, calculateGrades, GradesConfig } from './StudentEvaluation';

export interface GridElement extends ReactDataSheet.Cell<GridElement, number> {
	value: string | number | null;
}

class MyReactDataSheet extends ReactDataSheet<GridElement, number> { }

interface AppState {
	evaluations: StudentEvaluation[];
	grid: GridElement[][];
}

const columns = [
	'Nombre alumno',
	'Unidad 1',
	'Unidad 2',
	'Unidad 3',
	'Unidad 4',
	'Unidad 5',
	'Unidad 6',
	'Unidad 7',
	'Unidad 8',
	'Unidad 9',
	'Unidad 10',
	'Pruebas',
	'Cuadernos y tareas',
	'Observación diaria',
	'Nota final'
];

//You can also strongly type all the Components or SFCs that you pass into ReactDataSheet.
const cellRenderer: ReactDataSheet.CellRenderer<GridElement, number> = (props) => {
	const color = props.cell.readOnly ? 'grey' : undefined
	const style = { padding: '16px', background: color };
	return (
		<td style={style} onMouseDown={props.onMouseDown} onMouseOver={props.onMouseOver} onDoubleClick={props.onDoubleClick} className="cell">
			{props.children}
		</td>
	)
}

function evaluationsToGrid(evaluations: StudentEvaluation[]): GridElement[][] {
	return evaluations.map((evaluation) => {
		return evaluationToGridRow(evaluation)
	})
}

function evaluationToGridRow(evaluation: StudentEvaluation): GridElement[] {
	const row: GridElement[] = [];

	row.push({value: evaluation.id, readOnly: true})
	row.push({value: evaluation.name})
	evaluation.units.forEach((unit) => {
		row.push({value: unit})
	})
	row.push({value: evaluation.unitsGrade, readOnly: true})
	row.push({value: evaluation.tasksGrade})
	row.push({value: evaluation.dailyGrade})
	row.push({value: evaluation.finalGrade, readOnly: true})

	return row
}

function gridToEvaluations(grid: GridElement[][]): StudentEvaluation[] {
	return grid.map((row) => gridRowToEvaluation(row))
}

function gridRowToEvaluation(row: GridElement[]): StudentEvaluation {
	const fixedFields = 6
	const numberOfUnits = row.length - fixedFields
	const indexAfterUnits = 2 + numberOfUnits

	const id = row[0].value as number
	const name = row[1].value as string
	const units = row.slice(2, indexAfterUnits).map((unit) => parseFloat(`${unit.value}` || "0"))
	console.log(units)
	const unitsGrade = parseFloat(`${row[indexAfterUnits].value}` || "0")
	const tasksGrade = parseFloat(`${row[indexAfterUnits+1].value}` || "0")
	const dailyGrade = parseFloat(`${row[indexAfterUnits+2].value}` || "0")
	const finalGrade = parseFloat(`${row[indexAfterUnits+3].value}` || "0")

	return {
		id,
		name,
		units,
		unitsGrade,
		tasksGrade,
		dailyGrade,
		finalGrade
	}
}

export class App extends React.Component<{}, AppState> {
	constructor(props: {}) {
		super(props)

		const firstEvaluation = {id: 1, name: "Ricardo Pallás", units: [0,0,0,0,0,0,0,0,0,0], unitsGrade: 0, tasksGrade: 0, dailyGrade: 0, finalGrade: 0}
		this.state = {
			evaluations: [
				firstEvaluation
			],
			grid: evaluationsToGrid([firstEvaluation])
		}
	}

	addRow = () => {
		const lastId = this.state.evaluations[this.state.evaluations.length-1].id
		console.log(lastId)
		const evaluation = {id: lastId+1, name: "Ricardo Pallás", units: [0,0,0,0,0,0,0,0,0,0], unitsGrade: 0, tasksGrade: 0, dailyGrade: 0, finalGrade: 0}
		this.state.evaluations.push(evaluation)
		this.state.grid.push(evaluationToGridRow(evaluation))
		this.setState(this.state)
	}
	render() {
		return (
			<Pane height="100%" paddingLeft={32} paddingTop={32} paddingBottom={32} paddingRight={32} background="tint2" borderRadius={3}>

				<Heading size={2000}>Lengua - Primer timestre 2019 </Heading>

				<Pane >
					<Select width={240} marginTop={16}>
						<option value="foo">Foo</option>
						<option value="bar">Bar</option>
					</Select>
					<Button marginLeft={16} appearance="primary">Añadir tabla</Button>
				</Pane>

				<Pane marginTop={48}>
					<MyReactDataSheet
						data={this.state.grid}
						valueRenderer={(cell) => cell.value}
						sheetRenderer={props => (
							<table className={props.className}>
								<thead>
									<tr>
										<th className='action-cell' />
										{columns.map(col => (<th className='rotate'> <div><span>{col} </span></div></th>))}
									</tr>
								</thead>
								<tbody>
									{props.children}
								</tbody>
							</table>
						)}
						onCellsChanged={changes => {
							const grid = this.state.grid.map(row => [...row])
							changes.forEach(({ cell, row, col, value }) => {
								grid[row][col] = { ...grid[row][col], value }
							})
							const evaluations = gridToEvaluations(grid)
							const config: GradesConfig = {
								unitsGradePercentage: 50,
								tasksGradePercentahe: 30,
								dailyGradePercentage: 20
							}
							const recalculatedEvaluations = calculateGrades(evaluations, config)
							const recalculatedGrid = evaluationsToGrid(recalculatedEvaluations)
							this.setState({ grid: recalculatedGrid, evaluations: recalculatedEvaluations })
						}}
						cellRenderer={cellRenderer}
					/>
				</Pane>

				<Button marginTop={16} onClick={this.addRow} appearance="primary">Añadir fila</Button>

				<Pane marginTop={48}>
						<Text className="configPercentageText" width={210} marginRight={4}>Porcentaje pruebas: </Text>
						<TextInput width={40}></TextInput>
				</Pane>

				<Pane marginTop={4}>
						<Text className="configPercentageText" width={210} marginRight={4}>Porcentaje cuadernos y tareas: </Text>
						<TextInput width={40}></TextInput>
				</Pane>

				<Pane marginTop={4}>
						<Text className="configPercentageText" width={210} marginRight={4}>Porcentaje observación diaria: </Text>
						<TextInput width={40}></TextInput>
				</Pane>

			</Pane>
		)
	}
}

export default App;