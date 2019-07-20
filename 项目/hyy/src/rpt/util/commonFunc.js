export const filterFunc = (filterData, baseData) => {
  let inputData = JSON.parse(JSON.stringify(baseData));
  filterData.forEach(element => {
    if (element.queryColValue === "空白") {
      element.operation = " is";
      element.queryColValue = "null";
    }
    if (element.queryColValue === "无空白") {
      element.operation = " is not";
      element.queryColValue = "null";
    }
  });
  filterData.forEach(element => {
    inputData.push(element);
  });
  return inputData;
}

export default {
  filterFunc,
}