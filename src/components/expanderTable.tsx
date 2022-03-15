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
  detailColumnName: string;
}

export const initialState: State = {
  columns: [],
  rows: [],
  sortColumn: '',
  sortType: '',
  loading: false,
  expandedRowKeys: [],
  detailColumnName: 'none',
};

const rowKey = 'uuid';

const ExpandCell = ({ rowData, dataKey, expandedRowKeys, onChange, detailColumnName, ...props }) => {
  return (
    <Cell {...props}>
      {rowData[detailColumnName] && (
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

  calculateOptimalColumnWidth(name) {
    let optimalColumnWidth = name.length < 10 ? name.length * 8 : name.length * 7 - 5;
    optimalColumnWidth = optimalColumnWidth < 70 ? 70 : optimalColumnWidth;
    return optimalColumnWidth;
  }

  render() {
    const { columns, rows, expandedRowKeys, detailColumnName } = this.state;
    let dateOptions = { dateStyle: 'short' };
    return (
      <div className="container">
        <Table
          virtualized
          rowHeight={28}
          rowKey={rowKey}
          expandedRowKeys={expandedRowKeys}
          onSortColumn={this.handleSortColumn}
          sortColumn={this.state.sortColumn}
          sortType={this.state.sortType}
          loading={this.state.loading}
          height={visualViewport.height - 5}
          data={this.getData()}
          shouldUpdateScroll={false}
          onRowClick={(data) => {
            //console.log(data);
          }}
          renderRowExpanded={(rowData) => {
            return (
              <div>
                <div>
                  <p>{htmlFrom(rowData[detailColumnName])}</p>
                </div>
              </div>
            );
          }}
        >
          <Column width={50} align="left">
            <HeaderCell></HeaderCell>
            <ExpandCell
              rowData={Row}
              dataKey="id"
              detailColumnName={detailColumnName}
              expandedRowKeys={expandedRowKeys}
              onChange={this.handleExpanded}
            />
          </Column>
          {columns.map((column, index) => {
            const { key, name, type } = column;
            let columnWidth = this.calculateOptimalColumnWidth(name);
            if (type !== 'detail') {
              return (
                <Column key={name} width={columnWidth} sortable>
                  <HeaderCell>{name}</HeaderCell>
                  <Cell dataKey={name} style={{ padding: 0 }}>
                    {(rowData) => {
                      if (rowData[name] instanceof Date && rowData[name].getTime()) {
                        return rowData[name].toLocaleString('en-GB', dateOptions);
                      } else {
                        return rowData[name];
                      }
                    }}
                  </Cell>
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
