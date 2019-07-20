<template>
  <div class="member-wrap">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "Index"
};
</script>

<style lang='scss'>
.member-wrap {
  padding: 0 14px 0 14px;
  ._fixsteptool-member {
    right: 100px;
    min-width: 145px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 100;
  }
  //公共样式类
  .mybtnsize {
    cursor: pointer;
    font-size: 12px;
    color: #3b74ff;
  }
  .my12size {
    font-size: 12px;
    color: #666666;
  }
  .cursor {
    cursor: pointer;
  }
  .el-form-item__label {
    font-size: 12px;
    color: #666 !important;
  }
  .el-checkbox__label {
    font-size: 12px;
  }
  // 自定义button样式
  ._el-btn-custom {
    min-width: 80px;
    height: 32px;
    padding: 6px 16px;
    span {
      font-size: 12px;
    }
  }
  ._member-add-edit-save-btn {
    margin-right: 20px;
  }
  // 公共样式-自定义所有提示弹窗
  ._member-tip-dialog-custom-style {
    ._member-tip-dialog-icon {
      width: 18px;
      font-size: 18px;
      color: #ff8900;
    }
    ._member-tip-dialog-desc {
      color: #666;
      margin-left: 8px;
      line-height: 1.3;
    }
    .el-dialog__header {
      padding: 0;
      padding-bottom: 26px;
    }
    .el-dialog__body {
      display: flex;
      justify-content: center;
    }
    .el-dialog__footer {
      padding-left: 36px;
    }
  }
  // 所有列表页筛选项的样式
  ._member-search-area-custom {
    .el-form-item {
      margin-right: 30px !important;
      .el-input__inner {
        width: 192px !important;
      }
      .el-date-editor.el-input__inner {
        width: 256px !important;
      }
    }
  }

  // 幽灵按钮样式
  ._member-custom-ghost-button {
    border: 1px solid #3b74ff;
    color: #3b74ff;
  }
  ._member-custom-ghost-button:hover {
    border: 1px solid #0f55ff;
    color: #0f55ff;
  }

  // 自定义表格样式
  ._m-member-table-custom {
    .is-leaf {
      padding: 0;
      border-bottom: 0;
      .cell {
        color: #333;
        // font-weight: bold;
        height: 38px;
        line-height: 38px;
      }
    }
    .cell {
      font-size: 12px;
      padding-left: 8px;
      padding-right: 0;
      height: 38px;
      line-height: 38px;
    }
    .el-table td {
      padding: 0;
      border-bottom: 0;
    }
    .el-table thead tr th:first-child .cell {
      padding-left: 20px;
    }
    .el-table tbody tr td:first-child .cell {
      padding-left: 20px;
    }
    .el-table::before,
    .el-table__fixed::before,
    .el-table__fixed-right::before {
      height: 0 !important;
    }
  }
  // 折叠面板样式调整
  .el-collapse {
    padding-bottom: 0 !important;
    .el-collapse-item__header {
      display: flex;
      color: #333333;
      border: 0;
      flex-direction: row-reverse;
      justify-content: flex-end;
    }
    .el-collapse-item__header::after {
      height: 0;
    }
    .el-collapse-item__arrow {
      margin: 0 8px 0 0;
    }
    .el-collapse-item__wrap {
      border: 0;
      padding-top: 7px !important;
      .el-collapse-item__content {
        padding-bottom: 20px;
      }
    }
  }
  .el-input__inner {
    line-height: 32px;
    height: 32px;
  }
  .el-button--primary:hover {
    background: #3b74ff;
    color: #ffffff;
    // border: 1px slid #3b74ff;
  }
  .el-date-editor .el-range__icon,
  .el-date-editor .el-range__close-icon {
    line-height: 20px;
  }
  .el-date-editor .el-range-separator {
    line-height: 24px;
    padding: 0 13px 0 0;
  }
  .specialTab {
    .el-input__inner {
      width: 360px;
      height: 32px;
      line-height: 32px;
    }
    .add-entity-card-wrap .form-data-wrap .el-input--suffix {
      width: 360px;
    }
    .add-entity-card-wrap .form-data-wrap .el-form-item__error {
      left: 373px !important;
    }
  }
  .rightTopWebSite {
    width: 100%;
    text-indent: 15px;
    margin-top: 20px;
    .el-breadcrumb {
      font-size: 14px;
      line-height: 1;
      color: #606266;
    }
  }
  div.el-card__body {
    padding: 0;
  }
  // 积分交易记录
  ._member-integral-history {
    .el-dialog__body {
      padding: 0 0 10px 0;
    }
    .el-dialog__header {
      padding: 20px 20px 5px 20px;
    }
  }
  // 创建积分获取规则
  ._edit-member-integral-rules {
    .el-input {
      width: 192px;
      height: 32px;
      .el-input__inner {
        font-size: 12px !important;
        padding-right: 0;
      }
    }
    .el-form-item__label {
      font-size: 12px;
      color: #333 !important;
    }
    .el-collapse-item__content {
      padding: 0 20px;
    }
  }
  // 会员等级权益管理
  ._member-level-equity-detail {

  }
}
</style>