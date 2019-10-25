<template>
  <div class="_crm-member-wrap">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Index'
};
</script>

<style lang='scss'>
._crm-member-wrap {
  // padding: 0 14px 0 14px;
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
  // 所有弹窗的title字体颜色
  .el-dialog__header {
    .el-dialog__title {
      color: #333;
      font-weight: normal;
    }
  }
  .el-form-item__label {
    font-size: 12px;
    color: #666 !important;
    line-height: 1.4;
    text-indent: -0.75em;
    margin-top: 12px;
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
  // 自有权益dialog样式
  .__equity-dialog {
    .el-dialog {
      height: 576px;
      .el-dialog__header {
        padding: 10px 20px;
        .el-dialog__headerbtn {
          top: 12px;
          .el-dialog__close {
            color: #979797;
            font-size: 14px;
          }
        }
      }
      .el-dialog__body {
        padding: 0px 20px;
      }
      .el-dialog__footer {
        text-align: center;
      }
      .__table-wrap {
        border-top: 1px solid #e5e5e5;
        padding-top: 4px;
        // dialog内部表格公共样式
        .__dialog-search-bar-btn-wrap {
          margin-right: 0 !important;
        }
        .has-gutter tr th {
          height: 31px;
          line-height: 31px;
        }
        .el-table__body-wrapper {
          overflow-y: auto;
          height: 352px;
          .el-table__body {
            border-collapse: collapse;
            tbody {
              tr:last-child {
                border-bottom: 1px solid #f0f0f0;
              }
            }
          }
        }
        td {
          height: 32px;
          line-height: 32px;
        }
        .is-leaf {
          padding: 0;
          border-bottom: 0;
          .cell {
            color: #333;
            height: 30px;
            line-height: 30px;
          }
        }
        .cell {
          font-size: 12px;
          padding-left: 8px;
          padding-right: 0;
          height: 32px;
          line-height: 32px;
        }
        ._equity-dialog-paginatioin {
          padding: 6px 0;
          border: 1px solid #e5e5e5;
          border-top: 0;
        }
        .__dialog-table-form {
          display: flex;
          flex-wrap: wrap;
          .el-input__inner {
            width: 160px;
            line-height: 32px;
            height: 32px;
          }
          .el-form-item {
            margin: 0 14px 5px 0;
            .el-form-item__label {
              text-indent: 0;
              padding: 0 4px 0 0;
            }
          }
          .heightBug input {
            height: 32px !important;
          }
        }
        .__equity-dialog-content-wrap {
          display: flex;
          .__equity-dialog-content-left {
            width: 632px;
            .__equity-dialog-table {
              width: 632px;
            }
          }
          .__equity-dialog-content-right {
            width: 224px;
            border: 1px solid #e5e5e5;
            border-left: 0;
            padding: 12px 16px;
            .__content-right-wrap {
              display: flex;
              justify-content: space-between;
              padding: 0 0 12px;
              border-bottom: 1px solid #f5f5f5;
              .__content-right-title {
                font-size: 10px;
                color: #666666;
                letter-spacing: 0;
              }
              .__clear-btn {
                font-size: 12px;
                color: #3b74ff;
                letter-spacing: 0;
                cursor: pointer;
              }
            }
            .__selected-equity-wrap {
              height: 375px;
              overflow-y: auto;
              display: flex;
              flex-direction: column;
              .__selected-equity-item-inner {
                padding-top: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .__selected-equity-name-desc {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  font-size: 12px;
                  color: #666666;
                }
                .__dialog-icon-delete {
                  margin-left: 14px;
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
    }
  }

  // 所有列表页筛选项的样式
  ._member-search-area-custom {
    padding: 19px 24px;
    background: #f5f5f5;
    .el-form-item {
      margin-right: 29px !important;
      margin-bottom: 0;
      .el-form-item__label {
        font-size: 12px;
        color: #717171;
        padding: 0 6px 0 0;
        text-indent: 0;
      }
      .el-input__inner {
        width: 192px !important;
      }
      .el-date-editor.el-input__inner {
        width: 256px !important;
      }
      .el-date-editor .el-range-input {
        // color: #717171;
        font-size: 12px;
      }
      .el-date-editor .el-range-separator {
        font-size: 12px;
      }
      .el-date-editor--daterange.el-input__inner {
        width: 210px;
        color: #717171;
        font-size: 12px;
      }
      .el-input--suffix .el-input__inner {
        width: 125px;
        color: #717171;
        font-size: 12px;
        padding-right: 0;
      }
    }
    .btn-wrap {
      ._el-btn-custom:last-child {
        margin-left: 5px !important;
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
    .el-input {
      .el-input__inner {
        font-size: 12px !important;
      }
    }
    .el-select-dropdown__item {
      > span {
        font-size: 12px !important;
      }
    }
  }
  // 积分查询
  ._member-integral-query {
    .el-input {
      .el-input__inner {
        font-size: 12px !important;
      }
    }
    .el-select-dropdown__item {
      > span {
        font-size: 12px !important;
      }
    }
  }

  // 创建积分获取规则
  ._edit-member-integral-rules {
    .el-input {
      .el-input__inner {
        font-size: 12px !important;
        padding-right: 0;
      }
    }
    .label-content-item {
      .el-input {
        width: 100px !important;
        .el-input__inner {
          width: 100px !important;
        }
      }
      .el-select {
        .el-input {
          width: 192px !important;
          .el-input__inner {
            width: 192px !important;
          }
        }
      }
    }
    .el-form-item__label {
      font-size: 12px;
      color: #333 !important;
    }
    .el-collapse-item__content {
      padding: 0 20px;
    }
    .channel-selection {
      .el-form-item__content {
        padding-left: 50px;
      }
    }
  }
}
</style>