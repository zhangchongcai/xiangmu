<template>
  <div class="app-container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  mounted() {}
};
</script>

<style lang="scss">
html,
body,
div,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
dir,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
font,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td {
  margin: 0px;
  padding: 0px;
  border: 0px;
  outline: 0;
  font-size: 12px;
  vertical-align: baseline;
  background: transparent;
}
html,
body,
.app-container {
  width: 100%;
  height: 100%;
}
body {
  margin: 0px;
  padding: 0px;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  font-size: 12px;
  -webkit-font-smoothing: antialiased;
  background: #fff;
}
ul,
ol,
ul {
  list-style: none;
}
blockquote,
q {
  quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: "";
  content: none;
}
:focus {
  outline: 0;
  -moz-outline-style: none;
}
ins {
  text-decoration: none;
}
del {
  text-decoration: line-through;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
}
img {
  vertical-align: middle;
  border: 0;
}
address,
caption,
cite,
code,
dfn,
em,
th,
var {
  font-weight: normal;
  font-style: normal;
}
select {
  border: 1px solid #b5bcc2;
}
input,
textarea,
select {
  font-family: Arial;
  vertical-align: middle;
}
input[type="checkbox"],
input[type="radio"] {
  top: -2px;
  *top: 0px;
}
.clear {
  clear: both;
  height: 0;
  overflow: hidden;
}
a {
  text-decoration: none;
  cursor: pointer;
}
a {
  outline-style: none;
  color: #333;
  text-decoration: none;
}
a:visited {
}
a:active {
}
a:hover {
  text-decoration: none;
  color: #5ca7ff;
}
.clearfix {
}
.clearfix:after {
  content: ".";
  height: 0px;
  font-size: 0px;
  clear: both;
  display: block;
  visibility: hidden;
}
.el-submenu[class^="fa"] {
  vertical-align: baseline;
  margin-right: 10px;
}
.el-menu-item [class^="fa"] {
  vertical-align: baseline;
  margin-right: 10px;
}
.toolbar {
  background: #f2f2f2;
  padding: 10px;
  /*  //border:1px solid #dfe6ec;*/
  margin: 10px 0px;
}
.el-table .cell span.table-btn-mini {
  color: #3b74ff;
  cursor: pointer;
  margin-right: 8px;
}
.toolbar .el-form-item {
  margin-bottom: 10px;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.app-container {
  // 重置elementUI分页样式
  .page-wrap {
    padding: 24px;
    text-align: center;
    .el-pagination {
      display: inline-block;
      .el-input__inner {
        height: 28px;
        line-height: 28px;
      }
      .el-input__icon {
        line-height: 28px;
      }
    }
  }
}
.action_start {
  color: #6ed200;
}
.action_stop {
  color: #ff3c00;
}
.action_more {
  color: #808080;
}

.el-tooltip__popper.is-dark {
  background: #212121bf;
}

// 重写框架样式
.el-button {
  padding: 8px 22px;
  font-size: 12px;
}
// 默认按钮
.el-button--default {
  background: #ffffff;
  border: 1px solid #bcbcbc;
  color: #666666;
}
.el-button--default:hover {
  background: #f5f5f5;
  border: 1px solid #bcbcbc;
  color: #666666;
}
.el-button--default.is-disabled {
  background: #f5f5f5;
  color: #bcbcbc;
}
// 主要按钮
.el-button--primary {
  background: #3b74ff;
  color: #ffffff;
}
.el-button--primary:hover {
  background: #0f55ff;
  color: #ffffff;
}
.el-button--primary.is-disabled {
  background: #3b74ff;
  color: #ffffff;
}
// 主要按钮 空心
.el-button--primary.is-plain {
  background: #ffffff;
  border: 1px solid #3b74ff;
  color: #3b74ff;
}
.el-button--primary.is-plain:hover {
  background: #ffffff;
  border: 1px solid #0f55ff;
  color: #0f55ff;
}
.el-button--primary.is-plain.is-disabled {
  background: #ffffff;
  border: 1px solid #3b74ff;
  color: #3b74ff;
}

// 表格中的按钮
.el-table .el-button {
  padding: 2px 20px;
  font-size: 12px;
  border-radius: 2px;
}
.el-table .el-button--primary {
  background: #ffffff;
  border: 1px solid #3b74ff;
}
.el-table .el-button--primary:hover {
  background: #f5f5f5;
  border: 1px solid #bcbcbc;
  color: #666666;
}
// selected 样式要根据自己的操作 js动态添加
.el-table .el-button--primary.selected {
  background: #3b74ff;
  color: #ffffff;
}

.el-table .el-button--default {
  background: #ffffff;
  border: 1px solid #bcbcbc;
}
.el-table .el-button--default:hover {
  background: #ffffff;
  border: 1px solid #bcbcbc;
}
// selected 样式要根据自己的操作 js动态添加
.el-table .el-button--default.selected {
  background: #3b74ff;
  border-radius: 2px;
  color: #ffffff;
}

// 输入框
.el-input__inner {
  height: 32px;
  border: 1px solid #bcbcbc;
  line-height: 32px;
}
.el-input__inner:focus {
  border-color: #3b74ff;
}
// 下拉框内的图标
.el-input__icon {
  line-height: 32px;
}
.el-table .el-input__inner {
  height: 20px;
  line-height: 20px;
}
.el-table .el-input__icon {
  line-height: 20px;
}
// dialog弹窗
.main-container .el-dialog .el-dialog__header {
  padding: 20px 20px 10px 20px !important;
}
.main-container .el-dialog .el-dialog__body {
  padding: 30px 20px !important;
}
.el-dialog__title {
  font-size: 14px;
}
.el-dialog__footer {
  text-align: center;
}

// collapse 样式
.el-collapse {
  border-top: none;
  border-bottom: none;
  padding-bottom: 64px;
}
//设置折叠框箭头和位置
.el-collapse-item__arrow {
  margin: 0 8px 0;
  // transform: rotate(-90deg);
}
.el-collapse-item__header {
  display: inline-block;
  border-bottom: none;
  position: relative;
  padding: 7px 0;
  font-size: 14px;
  color: #333;
  &::after {
    left: 0;
    bottom: 0;
    width: 968px;
    height: 1px;
    content: "";
    position: absolute;
    background-color: #ebeef5;
    z-index: 1;
  }
}
.el-collapse-item__wrap {
  border: none;
  padding-top: 24px;
  // 修改 内部 tab 样式
  .el-tabs__header.is-top {
    border-bottom: none;
  }
  .el-tabs--card > .el-tabs__header {
    .el-tabs__nav {
      border: 1px solid #3b74ff;
      border-radius: 4px;
      .el-tabs__item {
        transition: none;
        min-width: 80px;
        box-sizing: border-box;
        padding: 0 16px;
        height: 32px;
        line-height: 32px;
        font-size: 12px;
        vertical-align: middle;
        color: #3b74ff;
        text-align: center;
        &.is-active {
          background-color: #3b74ff;
          border-color: #3b74ff;
          color: #fff;
        }
      }
    }
  }
}
//信息框全局样式 message
.el-message {
  background-color: rgba(51, 51, 51, 0.8);
  .el-message__icon {
    color: #fff;
  }
  .el-message__content {
    color: #fff;
  }
}
// hyy-toast Toast 全局样式
.hyy-toast {
  min-width: 192px;
  min-height: 48px;
  box-sizing: border-box;
  color: #fff;
  background: rgba(51, 51, 51, 0.8);
  padding: 12px 48px;
  border-radius: 4px;
  & > i {
    width: 16px;
    height: 16px;
    color: #fff;
    margin-right: 10px;
  }
  & > p {
    font-size: 16px;
    line-height: 22px;
  }
}
//table样式
/* 解决 table表头与内容不对齐的问题*/
body .el-table th.gutter {
  display: table-cell !important;
}
body .el-table colgroup.gutter {
  display: table-cell !important;
}
.has-gutter tr th {
  height: 38px;
  box-sizing: border-box;
}
.el-table {
  border: 1px solid #e5e5e5 !important;
}
.el-table td {
  border-right: 1px solid #f0f0f0 !important;
  border-bottom: none;
}
.el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #f0f0f0;
}
//table-end
.el-table {
  span {
    font-size: 12px;
  }
  &::before {
    height: 0;
  }
  tr:nth-child(1n) {
    background-color: #fff;
    &:hover > td {
      background-color: #e7ebff;
    }
  }
  tr:nth-child(2n) {
    background-color: #f0f0f0;
    &:hover > td {
      background-color: #e7ebff;
    }
  }
  th {
    border-right: 1px solid #e5e5e5 !important;
    border-bottom: 1px solid #e5e5e5 !important;
  }
  th,
  td {
    padding: 0;
    height: 38px;
    line-height: 38px;
    box-sizing: border-box;
  }
  th {
    background-color: #e7ebff;
  }
  .el-table__header-wrapper {
    background-color: #e7ebff;
  }
  .has-gutter {
    .cell {
      color: #333;
    }
  }
  .cell {
    font-size: 12px;
    color: #333;
  }

  // 表格中的按钮
  .el-button {
    font-size: 12px;
    color: #3b74ff;
    &.is-disabled {
      color: #c0c4cc;
    }
  }
  .el-button--primary,
  .el-button--default {
    padding: 2px 20px;
    border-radius: 2px;
  }
  .table-btn-mini {
    color: #3b74ff;
  }
  .el-button--text {
    margin-right: 8px;
    padding: 0;
    display: inline-block;
    color: #3b74ff;
  }
  .el-button--primary {
    background: #ffffff;
    border: 1px solid #3b74ff;
    &:hover {
      background: #f5f5f5;
      border: 1px solid #bcbcbc;
      color: #666666;
    }
    // selected 样式要根据自己的操作 js动态添加
    &.selected {
      background: #3b74ff;
      color: #ffffff;
    }
  }
  .el-button--default {
    background: #ffffff;
    border: 1px solid #bcbcbc;
    &:hover {
      background: #ffffff;
      border: 1px solid #bcbcbc;
    }
    // selected 样式要根据自己的操作 js动态添加
    &.selected {
      background: #3b74ff;
      border-radius: 2px;
      color: #ffffff;
    }
  }
}

/*滚动条样式设置*/
::-webkit-scrollbar {
  width: 0.5rem;
  height: 0.5rem;
  background: rgba(255, 255, 255, 0);
}

::-webkit-scrollbar-track {
  border-radius: 0;
}
::-webkit-scrollbar-thumb {
  border-radius: 0;
  background-color: rgba(95, 95, 95, 0.2);
  transition: all 0.2s;
  border-radius: 0.5rem;
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(95, 95, 95, 0.7);
}
</style>
