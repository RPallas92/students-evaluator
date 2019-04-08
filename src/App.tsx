import React, {  } from 'react';
import './App.css';
import ReactDataSheet from 'react-datasheet';
import "react-datasheet/lib/react-datasheet.css";
import { Pane, Button, Text, Heading, Select, TextInput, Dialog } from 'evergreen-ui';
import { StudentEvaluation, StudentEvaluations, calculateGrades, GradesConfig, isConfigValid } from './StudentEvaluation';

export interface GridElement extends ReactDataSheet.Cell<GridElement, number> {
  value: string | number | null;
}

class MyReactDataSheet extends ReactDataSheet<GridElement, number> { }

interface AppState {
  evaluations: StudentEvaluations[];
  currentEvaluation: StudentEvaluations;
  grid: GridElement[][];
  currentValidConfig: GradesConfig;
  nextConfigCandidate: GradesConfig;
  nextConfigCandidateValid: boolean;
  deleteDialogShown: boolean;
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

  row.push({ value: evaluation.id, readOnly: true })
  row.push({ value: evaluation.name })
  evaluation.units.forEach((unit) => {
    row.push({ value: unit })
  })
  row.push({ value: evaluation.unitsGrade, readOnly: true })
  row.push({ value: evaluation.tasksGrade })
  row.push({ value: evaluation.dailyGrade })
  row.push({ value: evaluation.finalGrade, readOnly: true })

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
  const unitsGrade = parseFloat(`${row[indexAfterUnits].value}` || "0")
  const tasksGrade = parseFloat(`${row[indexAfterUnits + 1].value}` || "0")
  const dailyGrade = parseFloat(`${row[indexAfterUnits + 2].value}` || "0")
  const finalGrade = parseFloat(`${row[indexAfterUnits + 3].value}` || "0")

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

function isThereAnyStudentWithoutName(evaluations: StudentEvaluation[]): boolean {
  const studentWithoutName = evaluations.find((evaluation) => !evaluation.name)
  return studentWithoutName ? true : false
}

export class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props)

    const firstEvaluation = { id: 1, name: "Ricardo Pallás", units: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], unitsGrade: 0, tasksGrade: 0, dailyGrade: 0, finalGrade: 0 }
    const evaluation = { name: "Lengua - Primer trimestre 2019", evaluations: [firstEvaluation]}
    this.state = {
      evaluations: [evaluation],
      currentEvaluation: evaluation,
      grid: evaluationsToGrid(evaluation.evaluations),
      currentValidConfig: {
        unitsGradePercentage: 40,
        tasksGradePercentage: 40,
        dailyGradePercentage: 20
      },
      nextConfigCandidate: {
        unitsGradePercentage: 40,
        tasksGradePercentage: 40,
        dailyGradePercentage: 20
      },
      nextConfigCandidateValid: true,
      deleteDialogShown: false
    }
  }

  addRow = () => {
    const lastId = this.state.currentEvaluation.evaluations.length > 0 ? this.state.currentEvaluation.evaluations[this.state.currentEvaluation.evaluations.length - 1].id : 0
    const evaluation = { id: lastId + 1, name: "Ricardo Pallás", units: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], unitsGrade: 0, tasksGrade: 0, dailyGrade: 0, finalGrade: 0 }
    this.state.currentEvaluation.evaluations.push(evaluation)
    this.state.grid.push(evaluationToGridRow(evaluation))
    this.setState(this.state)
  }

  unitsGradeConfigChanged = (value: string) => {
    const valueNumber = parseInt(value, 10) || 0;
    const configCandidate = { ...this.state.nextConfigCandidate, unitsGradePercentage: valueNumber }
    this.configPercentageChanged(configCandidate)
  }

  tasksGradeConfigChanged = (value: string) => {
    const valueNumber = parseInt(value, 10) || 0;
    const configCandidate = { ...this.state.nextConfigCandidate, tasksGradePercentage: valueNumber }
    this.configPercentageChanged(configCandidate)
  }

  dailyGradeConfigChanged = (value: string) => {
    const valueNumber = parseInt(value, 10) || 0;
    const configCandidate = { ...this.state.nextConfigCandidate, dailyGradePercentage: valueNumber }
    this.configPercentageChanged(configCandidate)
  }

  configPercentageChanged = (newConfig: GradesConfig) => {
    console.log(newConfig)
    if (isConfigValid(newConfig)) {
      this.setState({ ...this.state, nextConfigCandidate: newConfig, currentValidConfig: newConfig, nextConfigCandidateValid: true }, () => {
        this.updateEvaluations(this.state.currentEvaluation.evaluations, newConfig)
      })
    } else {
      this.setState({ ...this.state, nextConfigCandidate: newConfig, nextConfigCandidateValid: false })
    }
  }

  updateEvaluations = (evaluations: StudentEvaluation[], config: GradesConfig, callback?: () => void) => {
    const recalculatedEvaluations = calculateGrades(evaluations, config)
    const recalculatedGrid = evaluationsToGrid(recalculatedEvaluations)
    const evaluation = { ...this.state.currentEvaluation, evaluations: recalculatedEvaluations}

    this.setState({ ...this.state, grid: recalculatedGrid, currentEvaluation: evaluation}, callback)
  }

  deleteStudentsWithoutName = () => {
    const evaluations = this.state.currentEvaluation.evaluations.filter((evaluation) => evaluation.name)
    this.setState({ ...this.state, deleteDialogShown: false }, () => {
      this.updateEvaluations(evaluations, this.state.currentValidConfig)
    })
  }

  changeTitle = (title: string) => {
    const currentEvaluation = {...this.state.currentEvaluation, name: title}
    const evaluations = this.state.evaluations.map((evaluation) => {
      if (evaluation.name === this.state.currentEvaluation.name) {
        evaluation.name = title
      }
      return evaluation
    })
    this.setState({...this.state, currentEvaluation, evaluations})
  }

  addEvaluation = () => {
    const firstEvaluation = { id: 1, name: "Ricardo Pallás", units: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], unitsGrade: 0, tasksGrade: 0, dailyGrade: 0, finalGrade: 0 }
    const evaluation = { name: "Nueva evaluación " + Date.now(), evaluations: [firstEvaluation]}
    const evaluations = this.state.evaluations.concat(evaluation)
    this.setState({...this.state, evaluations}, () => {
      this.changeCurrentEvaluation(evaluation.name)
    })
  }

  changeCurrentEvaluation = (evaluationName: string) => {
    // TODO refactor as save current evaluation grades
    const currentEvaluation = this.state.currentEvaluation
    const recalculatedEvaluations = calculateGrades(currentEvaluation.evaluations, this.state.currentValidConfig)
    const evaluations = this.state.evaluations.map((anEvaluation) => {
      if(anEvaluation.name === currentEvaluation.name) {
        anEvaluation.evaluations = recalculatedEvaluations
      }
      return anEvaluation
    })

    this.setState({...this.state, evaluations}, () => {
      const evaluation = this.state.evaluations.find((evaluation) => (evaluation.name === evaluationName))

      if (evaluation) {
        const grid = evaluationsToGrid(evaluation.evaluations)
        this.setState({...this.state, currentEvaluation: evaluation, grid})
      }
    })
  }

  render() {
    return (
      <Pane height="100%" paddingLeft={32} paddingTop={32} paddingBottom={32} paddingRight={32} background="tint2" borderRadius={3}>
        <TextInput
          name="text-input-name"
          className="title"
          onChange={(e: any) => this.changeTitle(e.target.value)}
          value={this.state.currentEvaluation.name} />

        <Pane >
          <Select width={240} marginTop={16} value={this.state.currentEvaluation.name} onChange={(event:any) => this.changeCurrentEvaluation(event.target.value)}>
            {this.state.evaluations.map((evaluation) => (<option value={evaluation.name}>{evaluation.name}</option>))}
          </Select>
          <Button marginLeft={16} appearance="primary" onClick={this.addEvaluation}>Añadir tabla</Button>
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
                    {columns.map((col, index) => (<th key={index} className='rotate'> <div><span>{col} </span></div></th>))}
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
              const config = this.state.currentValidConfig
              this.updateEvaluations(evaluations, config, () => {
                if (isThereAnyStudentWithoutName(evaluations)) {
                  this.setState({ ...this.state, deleteDialogShown: true })
                }
              })
            }}
            cellRenderer={cellRenderer}
          />
        </Pane>

        <Button marginTop={16} onClick={this.addRow} appearance="primary">Añadir fila</Button>

        <Pane marginTop={48}>
          <Text className="configPercentageText" width={210} marginRight={4}>Porcentaje pruebas: </Text>
          <TextInput isInvalid={!this.state.nextConfigCandidateValid} width={40} onChange={(e: any) => this.unitsGradeConfigChanged(e.target.value)} value={this.state.nextConfigCandidate.unitsGradePercentage}></TextInput>
        </Pane>

        <Pane marginTop={4}>
          <Text className="configPercentageText" width={210} marginRight={4}>Porcentaje cuadernos y tareas: </Text>
          <TextInput isInvalid={!this.state.nextConfigCandidateValid} width={40} onChange={(e: any) => this.tasksGradeConfigChanged(e.target.value)} value={this.state.nextConfigCandidate.tasksGradePercentage}></TextInput>
        </Pane>

        <Pane marginTop={4}>
          <Text className="configPercentageText" width={210} marginRight={4}>Porcentaje observación diaria: </Text>
          <TextInput isInvalid={!this.state.nextConfigCandidateValid} width={40} onChange={(e: any) => this.dailyGradeConfigChanged(e.target.value)} value={this.state.nextConfigCandidate.dailyGradePercentage}></TextInput>
        </Pane>

        <Dialog
          isShown={this.state.deleteDialogShown}
          title="Borrar almuno"
          intent="danger"
          confirmLabel="Sí"
          cancelLabel="No"
          onConfirm={this.deleteStudentsWithoutName}
          onCancel={() => (this.setState({ ...this.state, deleteDialogShown: false }))}>
          ¿Desea borrar el alumno?
      </Dialog>

      </Pane>
    )
  }
}

export default App;