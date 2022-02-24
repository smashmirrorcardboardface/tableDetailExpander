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

import { v4 as uuidv4 } from 'uuid';

import { VisualSettings } from './settings';
export class Visual implements IVisual {
  private target: HTMLElement;
  private table: HTMLElement;
  private settings: VisualSettings;
  private wrapper: HTMLElement;

  constructor(options: VisualConstructorOptions) {
    console.log('Visual constructor', options);
    this.target = options.element;

    if (document) {
      this.wrapper = document.createElement('div');
      this.wrapper.setAttribute('id', 'tableFixHead');
      this.table = document.createElement('table');
      this.target.appendChild(this.wrapper);
      this.wrapper.appendChild(this.table);
    }
  }

  public update(options: VisualUpdateOptions) {
    document.getElementById('tableFixHead').style.height = `${options.viewport.height}px`;
    this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
    console.log('Visual update', options);
    console.log('Visual settings', this.settings);

    let dataViews = options.dataViews;
    console.log('Testing Data');
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

    while (this.table.firstChild) {
      this.table.removeChild(this.table.firstChild);
    }

    const transformedData = this.transformData(dataViews[0].categorical.categories);
    console.log('transformedData', transformedData);
    let thead = document.createElement('thead');
    this.table.appendChild(thead);
    let tbody = document.createElement('tbody');
    this.table.appendChild(tbody);

    const tableHeader = document.createElement('tr');
    tableHeader.classList.add('table-header');
    transformedData.summaryRowColumnsNames.forEach((column) => {
      const tableHeaderColumn = document.createElement('th');
      tableHeaderColumn.innerText = column;
      tableHeader.appendChild(tableHeaderColumn);
    });
    thead.appendChild(tableHeader);

    transformedData.summaryRowData.forEach((row, rowIndex) => {
      const tableRow = document.createElement('tr');
      tableRow.classList.add('summary-row');
      let rowId = uuidv4();
      row.forEach((column) => {
        const cell = document.createElement('td');
        cell.innerText = column.value;
        tableRow.appendChild(cell);
      });
      tbody.appendChild(tableRow);

      if (transformedData.detailValues[rowIndex]) {
        tableRow.onclick = () => toggleRow(rowId);
        const detailRow = document.createElement('tr');
        detailRow.setAttribute('id', rowId);
        detailRow.classList.add('hide-row', 'detail-row');
        const detailRowCell = document.createElement('td');
        detailRowCell.classList.add('details-cell');
        detailRowCell.colSpan = transformedData.summaryRowColumnsNames.length;
        detailRowCell.innerHTML = transformedData.detailValues[rowIndex].toLocaleString();
        detailRow.appendChild(detailRowCell);
        tbody.appendChild(detailRow);
      }
    });

    function toggleRow(rowId: string) {
      const row = document.getElementById(rowId);
      if (row.classList.contains('hide-row')) {
        row.classList.remove('hide-row');
      } else {
        row.classList.add('hide-row');
      }
    }
  }

  private transformData(data: powerbi.DataViewCategoryColumn[]) {
    console.log('data', data);

    let summaryRowColumns = data.filter((c) => c.source.roles.summaryRowColumn);
    console.log('summaryRowColumns', summaryRowColumns);

    let summaryRowColumnsSorted = [...summaryRowColumns].sort((a: any, b: any) => {
      return a.source.rolesIndex.summaryRowColumn[0] - b.source.rolesIndex.summaryRowColumn[0];
    });

    let summaryRowColumnsNames = summaryRowColumnsSorted.map((c) => c.source.displayName);
    console.log('summaryRowColumnsNames', summaryRowColumnsNames);

    let detailRowMeta = data.filter((c) => c.source.roles.detailHTML)[0];
    console.log('detailRowMeta', detailRowMeta);

    let maxValueArrayLength = -Infinity;
    summaryRowColumns.forEach(function (a, i) {
      if (a.values.length > maxValueArrayLength) {
        maxValueArrayLength = a.values.length;
      }
    });

    let summaryRowData = [];
    for (let i = 0; i < maxValueArrayLength; i++) {
      let row = summaryRowColumns.map((c) => {
        let value = c.values[i];
        if (value instanceof Date && !isNaN(value.getTime())) {
          value = new Intl.DateTimeFormat('en-GB').format(value);
        } else if (c.source.type.dateTime === true) {
          // vile fudge due to bug - https://github.com/microsoft/PowerBI-visuals-tools/issues/412
          let valueDateTime = value.toLocaleString().split('T');
          let isBST = valueDateTime[1].split(':')[0] === '23' ? true : false;
          let valueDate = new Date(valueDateTime[0]);
          value = isBST ? new Date(valueDate.setHours(valueDate.getHours() + 23)) : valueDate;
          value = new Intl.DateTimeFormat('en-GB').format(value);
        }
        return {
          name: c.source.displayName,
          value: value,
        };
      });
      summaryRowData.push(row);
    }

    console.log('summaryRowData', summaryRowData);

    let detailRows = data.filter((c) => c.source.roles.detailHTML);

    let detailValues = detailRows[0].values;

    return {
      summaryRowColumns: summaryRowColumns,
      summaryRowColumnsNames: summaryRowColumnsNames,
      summaryRowData: summaryRowData,
      detailValues: detailValues,
    };
  }

  private static parseSettings(dataView: DataView): VisualSettings {
    return <VisualSettings>VisualSettings.parse(dataView);
  }

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
