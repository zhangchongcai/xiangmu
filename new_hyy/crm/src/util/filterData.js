// 处理windows，mac 系统 回车，空格显示问题
export function formatRemark (remark) {
  if (remark || remark == 0) {
    return remark
      .replace(/\r\n/g, '<br/>')
      .replace(/\n/g, '<br/>')
      .replace(/\s/g, '&nbsp;');
  } else {
    return '-';
  }
}
