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
@each $type in (left, right, bottom, top) {
    @each $margin in (0,5, 10, 15, 20) {
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
  .el-step__icon.is-text {
        margin-bottom: 5px;
    }
</style>
