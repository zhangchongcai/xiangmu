<template>
  <div class="cwf_view">
    <router-view></router-view>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
//实在无法改动的全局样式
.el-select-dropdown__item {
  font-size: 12px !important;
  font-family: "MicrosoftYaHei" !important;
}
//审批页面-公共样式
.cwf_view {
  // 常规业务审批-公共样式
  .cwf_normalApproval {
  }
  // 审批流程设置-公共样式
  .cwf_approvalSetting {
  }
  // 审批流程设置-编辑-公共样式
  .cwf_editApprovalSetting {
    .el-input {
      font-size: 12px !important;
      .el-input__inner {
        font-size: 12px !important;
        color: #666666;
      }
    }
    .input-disabled {
      background-color: #f5f5f5;
      border-color: #bcbcbc;
      color: #666666;
    }
  }
  //业务单据审批设置-公共样式
  .cwf_billSetting {
    .box {
      .el-select {
        .el-input {
          width: 300px;
          .el-input__inner {
            font-size: 12px !important;
            font-family: "MicrosoftYaHei" !important;
            color: #bcbcbc;
          }
        }
      }
    }
    .el-radio-button__inner {
      display: inline-block;
      width: 144px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      padding: 0;
      font-size: 12px !important;
    }
  }
  //业务单据审批设置-编辑-公共样式
  .cwf_editBillSetting {
    .box {
      .el-select {
        .el-input {
          width: 300px;
          .el-input__inner {
            font-size: 12px !important;
            font-family: "MicrosoftYaHei" !important;
            color: #bcbcbc;
          }
        }
      }
    }
    .el-tree-node {
      background-color: #f5f5f5;
      .el-tree-node__label {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #666666;
      }
    }
    .el-checkbox__inner {
      width: 12px;
      height: 12px;
    }
    .el-tree__empty-block {
      background-color: #f5f5f5;
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
        padding-bottom: 15px;
      }
    }
    .el-radio {
      .el-radio__label {
        font-size: 12px !important;
      }
    }
    .el-textarea__inner {
      height: 153px;
      font-size: 12px !important;
    }
  }
}
</style>
