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
import { ExpanderTable, updateExpanderTable } from './components/expanderTable';

import './../style/visual.less';

export class Visual implements IVisual {
  private target: HTMLElement;
  private reactRoot: JSX.Element;
  private viewport: IViewport;

  constructor(options: VisualConstructorOptions) {
    this.reactRoot = React.createElement(ExpanderTable, {});
    this.target = options.element;

    ReactDOM.render(this.reactRoot, this.target);
  }

  public update(options: VisualUpdateOptions) {
    if (options.dataViews && options.dataViews[0]) {
      const dataView: DataView = options.dataViews[0];

      this.viewport = options.viewport;
      const { width, height } = this.viewport;
      const size = Math.min(width, height);
      updateExpanderTable({ tableData: { columns: [], data: [] } });
    } else {
      this.clear();
    }
  }

  private clear() {
    //ReactCircleCard.update(initialState);
  }
}
