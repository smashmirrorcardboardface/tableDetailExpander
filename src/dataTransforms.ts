export default function transformData(data) {
  let tableData = [];

  let categories = data.categorical.categories;

  let values = data.categorical.values ? data.categorical.values : null;

  let categoriesAndValues = values ? categories.concat(values) : categories;

  let columnLabels = categoriesAndValues.map(function (cv) {
    let sortOrder = cv.source.rolesIndex.summaryRowColumn ? cv.source.rolesIndex.summaryRowColumn[0] : null;
    return { name: cv.source.displayName, sortOrder: sortOrder };
  });

  let numberOfRecords = getMaxArrayLength(values);

  for (let i = 0; i < numberOfRecords; i++) {
    let rowData = {};
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
    let castValue = field?.source.type.dateTime ? new Date(value?.toString()) : value;
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
