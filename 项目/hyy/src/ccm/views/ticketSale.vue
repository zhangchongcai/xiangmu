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
$content in (end:flex-end, center:center, between:space-between) {
    .flex-#{$title} {
        justify-content: $content;
    }
}

@each $title in (top,bottom,left,right) {
    @each $content in (5,10,15,20) {
        .margin-#{$title}-#{$content} {
            margin-#{$title}: #{$content}px;
        }
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
@each $i in 360,
217,
166,
124,
94 {
    .input-type-#{$i} {
        width: #{$i}px;
    }
}

.el-form-item__label {
    font-size: 12px;
}

/** 
* 列表页统一设置
*/
.table-page {
    /*
        search - 搜索栏
        btnGroup - 按钮组
        table - 表格
        pagination  - 分页
    */
    @each $title in (search,btnGroup,table,pagenation) {
        &>.#{$title}-section {
            margin-bottom: 10px;
        }
    }
    // 单独设置
    // 搜索栏
    &>.sarch-section {

    }
    // 按钮组
    &>.btnGroup-section {

    }
    // 表格
    &>.table-section {

    }
    // 分页
    &>.pagenation-section{

    }
}

</style>
