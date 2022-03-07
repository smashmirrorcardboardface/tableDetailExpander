/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
'use strict';

import 'core-js/stable';
import './../style/visual.less';
import powerbi from 'powerbi-visuals-api';
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import * as $ from 'jquery';
$.noConflict();

import * as DataTable from 'datatables.net';

import { v4 as uuidv4 } from 'uuid';

import { VisualSettings } from './settings';
export class Visual implements IVisual {
  private target: HTMLElement;
  private settings: VisualSettings;

  constructor(options: VisualConstructorOptions) {
    console.log('Visual constructor', options);
    this.target = options.element;

    this.target.innerHTML = `<div id="myGrid" class="ag-theme-material"></div>`;
  }

  public update(options: VisualUpdateOptions) {
    try {
      let eGridDiv: HTMLElement = <HTMLElement>document.querySelector('#myGrid');
      eGridDiv.style.height = `${options.viewport.height}px`;
      eGridDiv.style.width = `${options.viewport.width}px`;
    } catch (e) {
      console.log(e);
    }

    this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
    console.log('Visual update', options);

    let data = this.transformData(options.dataViews);
    console.log('data', data);
    if (!data) return;

    this.target.innerHTML = `<table id="example" class="display" style="width:100%">
        <thead>
            <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Office</th>
                <th>Age</th>
                <th>Start date</th>
                <th>Salary</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Tiger Nixon</td>
                <td>System Architect</td>
                <td>Edinburgh</td>
                <td>61</td>
                <td>2011/04/25</td>
                <td>$320,800</td>
            </tr>
            <tr>
                <td>Garrett Winters</td>
                <td>Accountant</td>
                <td>Tokyo</td>
                <td>63</td>
                <td>2011/07/25</td>
                <td>$170,750</td>
            </tr>
            </tbody>
            </table>`;

    try {
      $('#example').DataTable();
    } catch (e) {
      console.log(e);
    }
    // while (this.target.firstChild) {
    //   this.target.removeChild(this.target.firstChild);
    // }

    // let container = document.createElement('div');
    // container.classList.add('table-responsive', 'wrapper');
    // this.target.appendChild(container);
    // container.style.height = `${options.viewport.height}px`;
    // let table = document.createElement('table');
    // table.classList.add('table');

    // let thead = createTableHead(data.summaryRowColumnsNames);
    // table.appendChild(thead);

    // let tbody = document.createElement('tbody');

    // table.appendChild(tbody);

    // container.appendChild(table);
    // data.summaryRowData.forEach((row, rowIndex) => {
    //   let tr = document.createElement('tr');
    //   //tr.classList.add('summary-row');
    //   row.forEach((cell, cellIndex) => {
    //     if (cellIndex === 0) {
    //       let th = document.createElement('th');
    //       th.classList.add('col-3');
    //       th.setAttribute('scope', 'row');
    //       th.innerHTML = cell.value;
    //       tr.appendChild(th);
    //     } else {
    //       let td = document.createElement('td');
    //       td.classList.add('col-3');
    //       td.innerText = cell.value;
    //       tr.appendChild(td);
    //     }
    //   });
    //   tbody.appendChild(tr);
    // });

    // tbody.innerHTML = `
    //                         <tr>
    //                             <th scope="row" class="col-3">1</th>
    //                             <td class="col-3">Mark</td>
    //                             <td class="col-3">Otto</td>
    //                             <td class="col-3">@mdo</td>
    //                         </tr>
    //                         <tr>
    //                             <th scope="row" class="col-3">2</th>
    //                             <td class="col-3">Jacob</td>
    //                             <td class="col-3">Thornton</td>
    //                             <td class="col-3">@fat</td>
    //                         </tr>
    //                         <tr>
    //                             <th scope="row" class="col-3">3</th>
    //                             <td colspan="2" class="col-6">Larry the Bird</td>
    //                             <td class="col-3">@twitter</td>
    //                         </tr>
    //                         <tr>
    //                             <th scope="row" class="col-3">4</th>
    //                             <td class="col-3">Martin</td>
    //                             <td class="col-3">Williams</td>
    //                             <td class="col-3">@Marty</td>
    //                         </tr>
    //                         <tr>
    //                             <th scope="row" class="col-3">5</th>
    //                             <td colspan="2" class="col-3">Sam</td>
    //                             <td colspan="2" class="col-3">Pascal</td>
    //                             <td class="col-3">@sam</td>
    //                         </tr>
    //                         <tr>
    //                             <th scope="row" class="col-3">6</th>
    //                             <td class="col-3">John</td>
    //                             <td class="col-3">Green</td>
    //                             <td class="col-3">@john</td>
    //                         </tr>
    //                         <tr>
    //                             <th scope="row" class="col-3">7</th>
    //                             <td colspan="2" class="col-3">David</td>
    //                             <td colspan="2" class="col-3">Bowie</td>
    //                             <td class="col-3">@david</td>
    //                         </tr>
    //                         <tr>
    //                             <th scope="row" class="col-3">8</th>
    //                             <td class="col-3">Pedro</td>
    //                             <td class="col-3">Rodriguez</td>
    //                             <td class="col-3">@rod</td>
    //                         </tr>
    //                         <tr>
    //                             <th scope="row" class="col-3">5</th>
    //                             <td colspan="2" class="col-3">Sam</td>
    //                             <td colspan="2" class="col-3">Pascal</td>
    //                             <td class="col-3">@sam</td>
    //                         </tr>
    //                         <tr>
    //                             <th scope="row" class="col-3">10</th>
    //                             <td class="col-3">Jacob</td>
    //                             <td class="col-3">Thornton</td>
    //                             <td class="col-3">@fat</td>
    //                         </tr>
    //                         <tr>
    //                             <th scope="row" class="col-3">11</th>
    //                             <td colspan="2" class="col-6">Larry the Bird</td>
    //                             <td class="col-3">@twitter</td>
    //                         </tr>`;

    //   transformedData.summaryRowData.forEach((row, rowIndex) => {
    //     const tableRow = document.createElement('tr');
    //     tableRow.classList.add('summary-row');
    //     let rowId = uuidv4();

    //     if (transformedData.detailValues[rowIndex]) {
    //       const childExpandCell = document.createElement('td');
    //       childExpandCell.classList.add('expand-cell');
    //       childExpandCell.setAttribute('row-id', rowId);
    //       tableRow.appendChild(childExpandCell);
    //       childExpandCell.onclick = (e) => toggleRow(rowId, e.target as Element);
    //     }

    //     row.forEach((column) => {
    //       const cell = document.createElement('td');
    //       cell.innerText = column.value;
    //       tableRow.appendChild(cell);
    //     });
    //     tbody.appendChild(tableRow);

    //     if (transformedData.detailValues[rowIndex]) {
    //       const detailRow = document.createElement('tr');
    //       detailRow.setAttribute('id', rowId);
    //       detailRow.classList.add('hide-row', 'detail-row');
    //       const detailRowCell = document.createElement('td');
    //       detailRowCell.classList.add('details-cell');
    //       detailRowCell.colSpan = transformedData.summaryRowColumnsNames.length + 1;
    //       detailRowCell.innerHTML = transformedData.detailValues[rowIndex].toLocaleString();
    //       detailRow.appendChild(detailRowCell);
    //       tbody.appendChild(detailRow);
    //     }
    //  });

    //container.appendChild(table);

    function createTableHead(headings: string[]) {
      let thead = document.createElement('thead');
      let tr = document.createElement('tr');
      tr.classList.add('header');
      headings.forEach((columnName) => {
        let th = document.createElement('th');
        th.setAttribute('scope', 'col');
        th.classList.add('col-3');
        th.innerText = columnName;
        tr.appendChild(th);
      });
      thead.appendChild(tr);
      return thead;
    }

    function toggleRow(rowId: string, target: Element) {
      target.closest('tr').classList.toggle('summary-row-selected');
      const row = document.getElementById(rowId);
      row.classList.toggle('hide-row');
      target.classList.toggle('expanded-cell');
    }
  }

  private transformData(dataViews) {
    if (
      !dataViews ||
      !dataViews[0] ||
      !dataViews[0].categorical ||
      !dataViews[0].categorical.categories ||
      !dataViews[0].metadata
    ) {
      console.log('Incorrect data to draw table.');
      return;
    }

    let categories = dataViews[0].categorical.categories;

    let values = dataViews[0].categorical.values ? dataViews[0].categorical.values : null;

    let categoriesAndValues = values ? categories.concat(values) : categories;

    let summaryRowColumns = getSummaryRowColumns(categoriesAndValues);

    let summaryRowColumnsSorted = sortSummaryRowColumns(summaryRowColumns);

    let summaryRowColumnsNames = getSummaryRowColumnsNames(summaryRowColumnsSorted);

    let maxValueArrayLength = getMaxArrayLength(summaryRowColumnsSorted);

    let summaryRowData = [];

    for (let i = 0; i < maxValueArrayLength; i++) {
      let row = summaryRowColumnsSorted.map((summaryRowColumn) => {
        let value = summaryRowColumn.values[i];
        console.log('value', value);

        let castValue = Visual.castPrimitiveValue(summaryRowColumn, value);

        return {
          name: summaryRowColumn.source.displayName,
          value: castValue,
        };
      });
      summaryRowData.push(row);
    }

    console.log('summaryRowData', summaryRowData);

    let detailRows = categoriesAndValues.filter((c) => c.source.roles.detailHTML);

    let detailValues = detailRows[0].values;

    console.log('detailValues', detailValues);

    return {
      summaryRowColumns: summaryRowColumns,
      summaryRowColumnsNames: summaryRowColumnsNames,
      summaryRowData: summaryRowData,
      detailValues: detailValues,
    };

    function getMaxArrayLength(arrays) {
      let maxArrayLength = -Infinity;
      arrays.forEach(function (a, i) {
        if (a.values.length > maxArrayLength) {
          maxArrayLength = a.values.length;
        }
      });
      return maxArrayLength;
    }

    function getSummaryRowColumnsNames(summaryRowColumns) {
      let summaryRowColumnsNames = summaryRowColumns.map((c) => c.source.displayName);
      console.log('summaryRowColumnsNames', summaryRowColumnsNames);
      return summaryRowColumnsNames;
    }

    function sortSummaryRowColumns(summaryRowColumns) {
      console.log('summaryRowColumns', summaryRowColumns);

      return [...summaryRowColumns].sort((a: any, b: any) => {
        return a.source.rolesIndex.summaryRowColumn[0] - b.source.rolesIndex.summaryRowColumn[0];
      });
    }

    function getSummaryRowColumns(data) {
      let summaryRowColumns = data.filter((c) => c.source.roles.summaryRowColumn);
      console.log('summaryRowColumns', summaryRowColumns);
      return summaryRowColumns;
    }
  }

  private static parseSettings(dataView: DataView): VisualSettings {
    return <VisualSettings>VisualSettings.parse(dataView);
  }

  private static castPrimitiveValue = (field, value) =>
    field?.source.type.dateTime ? new Date(value?.toString()) : value;

  /**
   * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
   * objects and properties you want to expose to the users in the property pane.
   *
   */
  public enumerateObjectInstances(
    options: EnumerateVisualObjectInstancesOptions
  ): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
    return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
  }
}
