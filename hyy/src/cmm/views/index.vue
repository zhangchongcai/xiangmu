<template>
<div class="cmm_view">
    <router-view></router-view>
</div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
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

@each $title, $content in (end:flex-end,center:center,between:space-between,start:flex-start) {
    .flex-#{$title} {
        justify-content: $content;
    }
}

/* 设计规范 输入框 选择框宽度 */
@each $i in 360,
217,
166,
124,
94 {
    .input-type-#{$i} {
        width: #{$i}px;
    }
}


/* 此样式用于查看时规范样式 */
.isTableCheck {
    $font-color: #666666;
    @mixin elementBase {
        cursor: auto;
        background: unset;
        border: none;
        color: $font-color;
        width: unset;
        padding: unset;
        // height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    @each $elementParent,
    $elementChild in (el-input: el-input__inner, el-textarea:el-textarea__inner) {
        .#{$elementParent}.is-disabled {
            .#{$elementChild} {
                @include elementBase;
            }
        }
    }
    .el-form-item {
        margin-bottom: 10px;

        .el-button {
            display: none;
        }
    }
    .el-radio-group {
        // 分类按钮
        .el-radio-button {
            background: none;
            display: none;

            .el-radio-button__inner {
                background: none;
                border: none;
                padding: unset;
            }
        }
        .is-active {
            display: block;

            .el-radio-button__inner {
                @include elementBase;
            }
        }
        // 单选框
        .el-radio {
            display: none;

            .el-radio__inner {
                display: none;
            }

            .el-radio__original {
                display: none;
            }
        }
        .is-checked {
            display: inherit;

            span {
                @include elementBase;
            }
        }
    }
    .el-date-editor {
        .el-input__icon {
            display: none;
        }
        .el-range-input {
            cursor: auto;
            background: unset;
            color: $font-color;
            width: 75px;
        }
        .el-range-separator {
            color: $font-color;
        }
        background: unset;
        border: unset;
        cursor: auto;
        color: $font-color;
        padding: unset;
    }
    .el-input.is-disabled {
        .el-input__suffix {
            display: none;
        }
    }
    .el-input {

        .el-input__inner {
            border: none;
        }
    }
    .check-font-color {
        color: $font-color;
    }
    span {
        color: $font-color;
    }
    // .el-select {
    //     width:100px;
    // }
}

.bottom-control-group {
    margin-bottom: 100px;
}

//实在无法改动的全局样式 
.el-select-dropdown__item{
    font-size: 12px !important;
    font-family: "MicrosoftYaHei" !important;
}

//营销全局样式(公共样式\组件样式)防止样式覆盖
.cmm_view{
    //影票活动管理样式
    .cmm_movie-ticket-activity{
        //列表页
        .cmm_movie-ticket-activity-list{
        
        }
        //查看页
        .cmm_movie-ticket-activity-detail{
        
        }
        //新建-编辑页
        .cmm_movie-ticket-activity-add-or-edit{
        
        }
    }
    //卖品活动管理样式
    .cmm_sales-activity{
        //列表页
        .cmm_sales-activity-list{
        
        }
        //查看页
        .cmm_sales-activity-detail{
        
        }
        //新建-编辑页
        .cmm_sales-activity-add-or-edit{
        
        }
    }
    //套票促销活动管理样式
    .cmm_package-promotion-activity{
        //列表页
        .cmm_package-promotion-activity-list{
        
        }
        //查看页
        .cmm_package-promotion-activity-detail{
        
        }
        //新建-编辑页
        .cmm_package-promotion-add-or-edit{
        
        }
    }
    //赠送积分活动管理样式
    .cmm_gift-points-activity{
        //列表页
        .cmm_gift-points-activity-list{
        
        }
        //查看页
        .cmm_gift-points-activity-detail{
        
        }
        //新建-编辑页
        .cmm_gift-points-activity-add-or-edit{
        
        }
    }
    //赠送余额活动管理样式
    .cmm_gift-balance-activity{
        //列表页
        .cmm_gift-balance-activity-list{
        
        }
        //查看页
        .cmm_gift-balance-activity-detail{
        
        }
        //新建-编辑页
        .cmm_gift-balance-activity-add-or-edit{
        
        }
    }
    //赠送票券活动管理样式
    .cmm_gift-tickets-activity{
        //列表页
        .cmm_gift-tickets-activity-list{
        
        }
        //查看页
        .cmm_gift-tickets-activity-detail{
        
        }
        //新建-编辑页
        .cmm_gift-tickets-activity-add-or-edit{
        
        }
    }
    //自定义营销管理活动样式
    .cmm_user-defined-activity{
        //列表页
        .cmm_user-defined-activity-list{
        
        }
        //查看页
        .cmm_user-defined-activity-detail{
        
        }
        //新建-编辑页
        .cmm_user-defined-activity-add-or-edit{
        
        }
    }
}

</style>
