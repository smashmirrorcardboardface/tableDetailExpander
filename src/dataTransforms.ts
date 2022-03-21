import { v4 as uuidv4 } from 'uuid';
import { valueFormatter } from 'powerbi-visuals-utils-formattingutils';

export default function transformData(data) {
  let tableData = [];

  let categories = data.categorical.categories;

  let values = data.categorical.values ? data.categorical.values : null;

  let categoriesAndValues = values ? categories.concat(values) : categories;

  let columnLabels = categoriesAndValues.map(function (cv) {
    var longestLength = cv.values.reduce(function (a, b) {
      a = a === null ? '' : a;
      b = b === null ? '' : b;
      return castPrimitiveValue(cv, a).length > castPrimitiveValue(cv, b).length
        ? castPrimitiveValue(cv, a)
        : castPrimitiveValue(cv, b);
    });

    let sortOrder = cv.source.rolesIndex.summaryRowColumn ? cv.source.rolesIndex.summaryRowColumn[0] : null;
    return {
      name: cv.source.displayName,
      sortOrder: sortOrder,
      type: cv.source.roles.detailHTML ? 'detail' : 'summary',
      longestValue: longestLength.toString(),
    };
  });

  let numberOfRecords = getMaxArrayLength(values);

  for (let i = 0; i < numberOfRecords; i++) {
    let rowData = { uuid: uuidv4() };
    categoriesAndValues.forEach(function (cv) {
      rowData[cv.source.displayName] = castPrimitiveValue(cv, cv.values[i]);
    });
    tableData.push(rowData);
  }

  let detailRows = categoriesAndValues.filter((c) => c.source.roles.detailHTML);

  let detailValues = detailRows[0].values;

  return {
    numberOfRecords: numberOfRecords,
    columnLabels: columnLabels,
    tableData: tableData,
    detailValues: detailValues,
  };

  function castPrimitiveValue(field, value) {
    let castValue = value;
    if (field?.source.type.dateTime && value) {
      castValue = new Date(value?.toString());
    }
    let iValueFormatter = valueFormatter.create({ format: field.source.format });
    castValue = iValueFormatter.format(castValue);
    castValue = castValue === '(Blank)' ? '' : castValue;
    return castValue;
  }

  function getMaxArrayLength(arrays) {
    let maxArrayLength = -Infinity;
    arrays.forEach(function (a, i) {
      if (a.values.length > maxArrayLength) {
        maxArrayLength = a.values.length;
      }
    });
    return maxArrayLength;
  }
}
