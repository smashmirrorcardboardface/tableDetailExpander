'use strict';

import { dataViewObjectsParser } from 'powerbi-visuals-utils-dataviewutils';
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class VisualSettings extends DataViewObjectsParser {
  public expandedRowHeight: expandedRowSettings = new expandedRowSettings();
}

export class expandedRowSettings {
  expandedRowHeight: number = 60;
}
