<template>
  <div class="member-wrap">
    <!-- <div class="rightTopWebSite">
      <el-breadcrumb separator="/" class="breadcrumb-inner" style="float:none;">
        <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
          <router-link :to="item.path" tag="a">{{item.name}}</router-link>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>-->
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
  padding: 0 24px 0 24px;
  ._fixsteptool-member{
    right: 100px;
    min-width: 145px;
    top: 50%;
    transform: translateY(-50%);
  }
  //公共样式类
  .mybtnsize{
    cursor:pointer;
    font-size: 12px;
    color: #3B74FF
  }
  .my12size{
    font-size: 12px;
    color: #666666
  }
  .cursor{
    cursor:pointer;
  }
  // 自定义button样式
  .el-btn-custom {
    width: 96px;
    height: 32px;
    padding: 6px 12px;
    span {
      font-size: 12px;
    }
  }
  // 自定义表格样式
  ._m-member-table-custom {
    .is-leaf {
      // padding: 8px 0;
      padding: 0;
      border-bottom: 0;
      background: #f1f4fd;
      .cell {
        color: #333;
        font-weight: bold;
        height: 38px;
        line-height: 38px;
      }
    }
    .cell {
      font-size: 12px;
      padding-left: 10px;
      padding-right: 10px;
      height: 38px;
      line-height: 38px;
    }
    .el-table td {
      // padding: 3px 0;
      padding: 0;
      border-bottom: 0;
    }
    .el-table::before,
    .el-table__fixed::before,
    .el-table__fixed-right::before {
      height: 0 !important;
    }

    // 斑马线颜色
    .el-table--striped .el-table__body tr.el-table__row--striped td {
      // background: #F5F5F5;
    }
  }
  // 折叠面板样式调整
  .el-collapse-item__header {
    display: flex;
    color: #333333;
    border: 0;
    // flex-direction: row-reverse;
    // justify-content: flex-end;
  }
  .el-collapse-item__arrow {
    margin: 0 8px 0 0;
  }
  .el-collapse-item__wrap {
    border: 0;
  }

  .crumbs-wrap {
    display:none;
    .el-breadcrumb__item:last-child .el-breadcrumb__inner,
    .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
      font-weight: normal;
      color: #3b74ff;
      cursor: text;
    }
  }
  .el-input__inner {
    line-height: 32px;
    height: 32px;
  }

  .btnRepeat,
  .btnRepeat:hover {
    background: #ffffff;
    color: #3b74ff;
    border: 1px slid #3b74ff;
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
}
</style>