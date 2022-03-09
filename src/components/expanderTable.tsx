import * as React from 'react';
//import ReactDOM from 'react-dom';
import powerbi from 'powerbi-visuals-api';
import { Table, IconButton, Row } from 'rsuite';
import MinusSquareO from '@rsuite/icons/legacy/MinusSquareO';
import PlusSquareO from '@rsuite/icons/legacy/PlusSquareO';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

const { HeaderCell, Cell, Column, ColumnGroup } = Table;
export interface State {
  columns: any[];
  rows: any[];
  sortColumn: string;
  sortType: string;
  loading: boolean;
  expandedRowKeys: any[];
}

export const initialState: State = {
  columns: [],
  rows: [],
  sortColumn: '',
  sortType: '',
  loading: false,
  expandedRowKeys: [],
};

const rowKey = 'Id';

const ExpandCell = ({ rowData, dataKey, expandedRowKeys, onChange, ...props }) => {
  return (
    <Cell {...props}>
      {rowData['Detail HTML'] && (
        <IconButton
          size="xs"
          appearance="subtle"
          onClick={() => {
            onChange(rowData);
          }}
          icon={expandedRowKeys.some((key) => key === rowData[rowKey]) ? <MinusSquareO /> : <PlusSquareO />}
        />
      )}
    </Cell>
  );
};

const htmlFrom = (htmlString) => {
  const cleanHtmlString = DOMPurify.sanitize(htmlString, { USE_PROFILES: { html: true } });
  const html = parse(cleanHtmlString);
  return html;
};

export class ExpanderTable extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleExpanded = this.handleExpanded.bind(this);
  }

  getData() {
    let { sortColumn, sortType, rows } = this.state;
    if (sortColumn && sortType) {
      return rows.sort((a, b) => {
        console.log(a[sortColumn], b[sortColumn]);

        let x = a[sortColumn];
        let y = b[sortColumn];
        if (x instanceof Date && y instanceof Date) {
          x = x.getTime();
          y = y.getTime();
        }

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

  handleExpanded(rowData, dataKey) {
    console.log('handleExpanded', rowData, dataKey);

    const { expandedRowKeys } = this.state;

    let open = false;
    const nextExpandedRowKeys = [];

    expandedRowKeys.forEach((key) => {
      if (key === rowData[rowKey]) {
        open = true;
      } else {
        nextExpandedRowKeys.push(key);
      }
    });

    if (!open) {
      nextExpandedRowKeys.push(rowData[rowKey]);
    }
    this.setState({
      expandedRowKeys: nextExpandedRowKeys,
    });
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
    const { columns, rows, expandedRowKeys } = this.state;
    let dateOptions = { dateStyle: 'short' };
    return (
      <div className="container">
        <Table
          rowKey={rowKey}
          expandedRowKeys={expandedRowKeys}
          onSortColumn={this.handleSortColumn}
          sortColumn={this.state.sortColumn}
          sortType={this.state.sortType}
          loading={this.state.loading}
          height={400}
          data={this.getData()}
          onRowClick={(data) => {
            console.log(data);
          }}
          renderRowExpanded={(rowData) => {
            return (
              <div>
                <div
                  style={{
                    width: '100%',
                    height: 60,
                    float: 'left',
                    marginRight: 10,
                    background: '#eee',
                  }}
                >
                  <p>{htmlFrom(rowData['Detail HTML'])}</p>
                </div>
              </div>
            );
          }}
        >
          <Column width={70} align="center">
            <HeaderCell></HeaderCell>
            <ExpandCell rowData={Row} dataKey="id" expandedRowKeys={expandedRowKeys} onChange={this.handleExpanded} />
          </Column>
          {columns.map((column, index) => {
            const { key, name } = column;
            if (name !== 'Detail HTML') {
              return (
                <Column key={name} flexGrow={index} sortable>
                  <HeaderCell>{name}</HeaderCell>
                  <Cell dataKey={name}>{(rowData) => rowData[name].toLocaleString('en-GB', dateOptions)}</Cell>
                  {/* <Cell dataKey={name} /> */}
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
