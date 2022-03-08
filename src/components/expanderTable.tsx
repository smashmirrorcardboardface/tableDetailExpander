import * as React from 'react';
//import ReactDOM from 'react-dom';
import powerbi from 'powerbi-visuals-api';
import { Table, Toggle, TagPicker } from 'rsuite';

const { HeaderCell, Cell, Column, ColumnGroup } = Table;

export interface State {
  columns: any[];
  rows: any[];
}

export const initialState: State = {
  columns: [],
  rows: [],
};

export class ExpanderTable extends React.Component<{}, State> {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  render() {
    const { columns, rows } = this.state;
    return (
      <div className="container">
        <Table
          height={400}
          data={rows}
          onRowClick={(data) => {
            console.log(data);
          }}
        >
          {columns.map((column, index) => {
            const { key, name } = column;
            if (name !== 'Detail HTML') {
              return (
                <Column key={name} flexGrow={index}>
                  <HeaderCell>{name}</HeaderCell>
                  <Cell dataKey={name} />
                </Column>
              );
            }
          })}
        </Table>
      </div>
    );
  }

  private static updateCallback: (data: object) => void = null;

  public static update(newState: State) {
    console.log('update', newState);
    //checks to see if component is mounted and updates state
    if (typeof ExpanderTable.updateCallback === 'function') {
      ExpanderTable.updateCallback(newState);
    }
  }

  public state: State = initialState;

  public componentWillMount() {
    //changes state when component mounts and sets updateCallback to allow state to be updated
    ExpanderTable.updateCallback = (newState: State): void => {
      this.setState(newState);
    };
  }

  public componentWillUnmount() {
    ExpanderTable.updateCallback = null;
  }
}
