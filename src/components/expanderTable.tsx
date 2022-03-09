import * as React from 'react';
//import ReactDOM from 'react-dom';
import powerbi from 'powerbi-visuals-api';
import { Table, Toggle, TagPicker } from 'rsuite';
import { getDataGroupBy } from 'rsuite/esm/utils';

const { HeaderCell, Cell, Column, ColumnGroup } = Table;

export interface State {
  columns: any[];
  rows: any[];
  sortColumn: string;
  sortType: string;
  loading: boolean;
}

export const initialState: State = {
  columns: [],
  rows: [],
  sortColumn: '',
  sortType: '',
  loading: false,
};

export class ExpanderTable extends React.Component<{}, State> {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  getData() {
    let { sortColumn, sortType, rows } = this.state;
    if (sortColumn && sortType) {
      return rows.sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (x > y) {
          return sortType === 'asc' ? 1 : -1;
        }
        if (x < y) {
          return sortType === 'asc' ? -1 : 1;
        }
        return 0;
      });
    }
  }

  handleSortColumn = (sortColumn, sortType) => {
    console.log('handleSortColumnIn', sortColumn, sortType);
    this.setState({
      loading: true,
    });

    setTimeout(() => {
      this.setState({
        sortColumn,
        sortType,
        loading: false,
      });
    }, 500);
  };

  render() {
    const { columns, rows } = this.state;
    return (
      <div className="container">
        <Table
          onSortColumn={this.handleSortColumn}
          sortColumn={this.state.sortColumn}
          sortType={this.state.sortType}
          loading={this.state.loading}
          height={400}
          data={this.getData()}
          onRowClick={(data) => {
            console.log(data);
          }}
        >
          {columns.map((column, index) => {
            const { key, name } = column;
            if (name !== 'Detail HTML') {
              return (
                <Column key={name} flexGrow={index} sortable>
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
