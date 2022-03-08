'use strict';
import powerbi from 'powerbi-visuals-api';

import DataView = powerbi.DataView;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IViewport = powerbi.IViewport;

// Import React dependencies and the added component
import * as React from 'react';
import * as ReactDOM from 'react-dom';
//import { ReactCircleCard, initialState } from './components/circleCard';
import { ExpanderTable, initialState } from './components/expanderTable';
import transformData from './dataTransforms';
import './../style/visual.less';

export class Visual implements IVisual {
  private target: HTMLElement;
  private reactRoot: JSX.Element;
  private viewport: IViewport;

  private tableData = { message: 'initial table' };

  constructor(options: VisualConstructorOptions) {
    this.reactRoot = React.createElement(ExpanderTable, this.tableData as any);
    this.target = options.element;

    ReactDOM.render(this.reactRoot, this.target);
  }

  public update(options: VisualUpdateOptions) {
    console.log('Visual update', options);

    if (options.dataViews && options.dataViews[0]) {
      const dataView: DataView = options.dataViews[0];
      const transformedData = transformData(dataView);

      console.log('transformedData', transformedData);
      const columns = transformedData.columnLabels;

      ExpanderTable.update({
        columns: columns,
        rows: transformedData.tableData,
      });

      this.viewport = options.viewport;
      const { width, height } = this.viewport;
      const size = Math.min(width, height);
    } else {
      this.clear();
    }
  }

  private clear() {
    ExpanderTable.update(initialState);
  }
}
