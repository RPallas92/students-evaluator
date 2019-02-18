import React, { Component } from 'react';
import './App.css';
import ReactDataSheet from 'react-datasheet';
import "react-datasheet/lib/react-datasheet.css";
import { Pane, Button, Text, Heading, Select } from 'evergreen-ui';
import { StudentEvaluation } from './StudentEvaluation';

export interface GridElement extends ReactDataSheet.Cell<GridElement, number> {
	value: string | number | null;
}

class MyReactDataSheet extends ReactDataSheet<GridElement, number> { }

interface AppState {
	grid: GridElement[][];
}

//You can also strongly type all the Components or SFCs that you pass into ReactDataSheet.
let cellRenderer: ReactDataSheet.CellRenderer<GridElement, number> = (props) => {
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

	row.push({value: evaluation.id})
	row.push({value: evaluation.name})
	evaluation.units.forEach((unit) => {
		row.push({value: unit})
	})
	row.push({value: evaluation.unitsGrade})
	row.push({value: evaluation.tasksGrade})
	row.push({value: evaluation.dailyGrade})
	row.push({value: evaluation.finalGrade})

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
	const units = row.slice(2, indexAfterUnits - 1).map((unit) => unit.value as number)
	const unitsGrade = row[indexAfterUnits].value as number
	const tasksGrade = row[indexAfterUnits+1].value as number
	const dailyGrade = row[indexAfterUnits+2].value as number
	const finalGrade = row[indexAfterUnits+3].value as number

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
		this.state = {
			grid: [
				[{ value: 1 }, { value: "Ricardo Pallas", readOnly: true }, { value: 8.7 }],
				[{ value: 2 }, { value: "Jesús López" }, { value: 9.1 }]
			]
		}
	}
	render() {
		return (
			<Pane height="100%" paddingLeft={48} paddingTop={32} paddingBottom={32} paddingRight={48} background="tint2" borderRadius={3}>

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
						onCellsChanged={changes => {
							const grid = this.state.grid.map(row => [...row])
							changes.forEach(({ cell, row, col, value }) => {
								grid[row][col] = { ...grid[row][col], value }
							})
							this.setState({ grid })
						}}
						cellRenderer={cellRenderer}
					/>
				</Pane>

				<Button marginTop={16} appearance="primary">Añadir fila</Button>

			</Pane>




		)
	}
}

export default App;