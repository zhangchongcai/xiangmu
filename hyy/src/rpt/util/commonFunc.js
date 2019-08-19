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

export const multiSelectionStyleFunc = (selectTionClass, valueArr) => {
  let selectionDom = document.getElementsByClassName(selectTionClass);
  let el = selectionDom[0].children[0];
  let el_span = el.querySelector("span");
  el_span && el.removeChild(el_span);
  el.style.padding = " 0 10px";
  el.style.textOverflow = "ellipsis";
  el.style.fontSize = "12px";
  if (valueArr) el.textContent = String(valueArr).replace(/,/g, "、");
}

export const setSpanDataFunc = (tableData, index, tableHeaderData, columnIndex, spanArr, spanPosition) => {
  if (
    tableData[index][`${tableHeaderData[columnIndex].colKey}`] ===
    tableData[index - 1][`${tableHeaderData[columnIndex].colKey}`]
  ) {
    spanArr[spanPosition] += 1;
    spanArr.push(0);
  } else {
    spanArr.push(1);
    spanPosition = index;
  }
}

export const messageAlertFunc = (self, queryArr) => {
  let timeValue = [];
  queryArr.forEach(element => {
    element.controlType === "CHECK_SING" && element.queryColValue === "" ?
      (element.queryColValue = "0") :
      null;
    element.controlType === "DATE" ||
      element.controlType === "MONTH" ||
      element.controlType === "DATETIME" ||
      element.controlType === "TIME" ?
      timeValue.push(element.queryColValue) :
      null;
    if (
      element.controlType === "CINEMA_TREE" &&
      element.queryColValue === "" && element.queryColKey == "uid_cinema"
    ) {
      self.$message({
        message: "请先选择影院再进行查询",
        iconClass: "iconfont icon-danchuang-jingtanhao",
        customClass: "rpt-alert-message",
        center: "true"
      });
      throw "未选择影院";
    }
  });
  if (
    timeValue.every(element => element === "") &&
    timeValue.length !== 0
  ) {
    self.$message({
      message: "请先选择时间再进行查询",
      iconClass: "iconfont icon-danchuang-jingtanhao",
      customClass: "rpt-alert-message",
      center: "true"
    });
    throw "未选择时间";
  }
}

export default {
  filterFunc,
  multiSelectionStyleFunc,
  setSpanDataFunc
}