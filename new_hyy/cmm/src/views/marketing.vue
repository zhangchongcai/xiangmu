<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
// 弹性布局基础
.flex-base {
  display: flex;
  display: -webkit-flex;
  align-items: center;
  flex-wrap: wrap;
}

.self-start {
  align-self: flex-start;
}

@each $title,
  $content in (end: flex-end, center: center, between: space-between)
{
  .flex-#{$title} {
    justify-content: $content;
  }
}

/*table页*/
.table-page {
  section {
    margin-bottom: 10px;
  }

  & > section:nth-of-type(1) {
    margin-bottom: unset;
  }
}

.table-search-name {
  font-family: MicrosoftYaHei;
  font-size: 12px;
  color: #666666;
  letter-spacing: 0;
  margin-right: 10px;
}

.table-search-inner-width {
  width: 208px;
}

.table-number-inner-width {
  width: 100px;
}

.zoom-keep-font {
  user-select: none;
  opacity: 0;
}

/* 设计规范 输入框 选择框宽度 */
@each $i in 360, 217, 166, 124, 94 {
  .input-type-#{$i} {
    width: #{$i}px;
  }
}

.el-form-item__label {
  font-size: 12px;
}

@each $type in (left, right, bottom, top) {
  @each $margin in (0, 5, 10, 15, 20) {
    .margin-#{$type}-#{$margin} {
      margin-#{$type}: #{$margin}px;
    }

    .margin-#{$type}-#{$margin}-important {
      margin-#{$type}: #{$margin}px !important;
    }
  }
}

@each $title,
  $content
    in (
      end: flex-end,
      center: center,
      between: space-between,
      start: flex-start
    )
{
  .flex-#{$title} {
    justify-content: $content;
  }
}

/* 设计规范 输入框 选择框宽度 */
@each $i in 360, 217, 166, 124, 94 {
  .input-type-#{$i} {
    width: #{$i}px;
  }
}
.el-dropdown-menu__item {
  font-size: 12px !important;
}
//营销全局样式(公共样式\组件样式)防止样式覆盖(后期如果需要重构样式时可以用到)
.cmm_view {
  //影票活动管理样式
  .cmm_movie-ticket-activity {
    //列表页
    .cmm_movie-ticket-activity-list {
    }
    //查看页
    .cmm_movie-ticket-activity-detail {
    }
    //新建-编辑页
    .cmm_movie-ticket-activity-add-or-edit {
    }
  }
  //卖品活动管理样式
  .cmm_sales-activity {
    //列表页
    .cmm_sales-activity-list {
    }
    //查看页
    .cmm_sales-activity-detail {
    }
    //新建-编辑页
    .cmm_sales-activity-add-or-edit {
    }
  }
  //套票促销活动管理样式
  .cmm_package-promotion-activity {
    //列表页
    .cmm_package-promotion-activity-list {
    }
    //查看页
    .cmm_package-promotion-activity-detail {
    }
    //新建-编辑页
    .cmm_package-promotion-add-or-edit {
    }
  }
  //赠送积分活动管理样式
  .cmm_gift-points-activity {
    //列表页
    .cmm_gift-points-activity-list {
    }
    //查看页
    .cmm_gift-points-activity-detail {
    }
    //新建-编辑页
    .cmm_gift-points-activity-add-or-edit {
    }
  }
  //赠送余额活动管理样式
  .cmm_gift-balance-activity {
    //列表页
    .cmm_gift-balance-activity-list {
    }
    //查看页
    .cmm_gift-balance-activity-detail {
    }
    //新建-编辑页
    .cmm_gift-balance-activity-add-or-edit {
    }
  }
  //赠送票券活动管理样式
  .cmm_gift-tickets-activity {
    //列表页
    .cmm_gift-tickets-activity-list {
    }
    //查看页
    .cmm_gift-tickets-activity-detail {
    }
    //新建-编辑页
    .cmm_gift-tickets-activity-add-or-edit {
    }
  }
  //自定义营销管理活动样式
  .cmm_user-defined-activity {
    //列表页
    .cmm_user-defined-activity-list {
    }
    //查看页
    .cmm_user-defined-activity-detail {
    }
    //新建-编辑页
    .cmm_user-defined-activity-add-or-edit {
    }
  }
}
.bottom-control-group {
  margin-bottom: 50px;
}
</style>
