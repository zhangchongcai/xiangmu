<template>
  <div class="_member-dialogVisible" v-show="dialogVisible">
    <div class="shadow"></div>
    <div class="bottom-warp">
      <div class="bottom">
        <div class="header">
          {{name?name:'默认标题'}}
        </div>
        <div class="contetn">
          <slot></slot>
        </div>
        <div class="btnwarp">
          <el-button type="primary" @click="closeAndOk" class="_member-add-edit-save-btn">确定</el-button>
          <el-button @click="closeWarp">取消</el-button>
        </div>
        <div class="iconBox">
          <i class="el-icon-close" @click="closeWarp"></i>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  data () {
    return {};
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    }
  },
  created () { },
  methods: {
    closeWarp () {
      // this.$emit("update:dialogVisible", false);
      this.$emit('crmDialogOutputFlag', 0);
    },
    closeAndOk () {
      // this.$emit("update:dialogVisible", false);
      this.$emit('crmDialogOutputFlag', 1);
    },
    closeAndReset () {
      this.$emit('crmDialogOutputFlag', 'reset');
    }
  },
  watch: {}
};
</script>
<style lang="scss" scope>
._member-dialogVisible {
  position: fixed;
  top: 0;
  left: 0;
  min-height: 100vh;
  min-width: 100vw;
  z-index: 2000;
  overflow: auto;
  .bottom-warp {
    position: absolute;
    width: 100%;
    overflow: hidden;
    z-index: 2000;
    .bottom {
      position: relative;
      margin: 0 auto;
      margin-top: 15vh;
      margin-bottom: 15vh;
      z-index: 2000;
      width: 896px;
      background: #ffffff;
      box-shadow: rgba(0, 0, 0, 0.1);
      border-radius: 2px;
      padding: 4px 20px 10px;
      .header {
        width: 100%;
        height: 40px;
        border-radius: 2px;
        font-size: 16px;
        line-height: 40px;
        font-size: 14px;
        border-bottom: 1px solid #e5e5e5;
        color: #333;
        // margin-bottom: 8px;
      }
      .contetn {
        width: 100%;
        background: #ffffff;
        margin: 4px 0 10px;
      }
      .btnwarp {
        text-align: center;
      }
      .iconBox {
        position: absolute;
        right: 20px;
        top: 14px;
        .el-icon-close {
          cursor: pointer;
          color: #999;
          font-size: 18px;
        }
      }
    }
  }
  .shadow {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.5;
    background: #000;
    z-index: 2000;
  }
}
// 提供给外部弹窗的样式
.__crm-available-coupon-wrap {
  // border-top: 1px solid #e5e5e5;
  .__crm-available-coupon-search {
    .el-form-item {
      margin-bottom: 7px;
      .el-form-item__label {
        margin-left: 0;
        width: auto !important;
      }
      .el-input__inner {
        width: 160px;
        line-height: 32px;
        height: 32px;
        font-size: 12px;
      }
    }
  }
  ._custom-search-item {
    .el-form-item__label {
      text-indent: 0;
      width: auto !important;
    }
  }
  .__crm-available-coupon-dialog-content-wrap {
    display: flex;
    .__crm-available-coupon-dialog-content-left {
      width: 632px;
      .__crm-available-coupon-dialog-table {
        width: 632px;
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
        .__crm-available-coupon-paginatioin {
          padding: 6px 0;
          border: 1px solid #e5e5e5;
          border-top: 0;
        }
      }
    }
    .__crm-available-coupon-dialog-content-right {
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
</style>


