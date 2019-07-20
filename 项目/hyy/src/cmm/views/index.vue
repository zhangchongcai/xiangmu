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
.el-select-dropdown__item {
    font-size: 12px !important;
    font-family: "MicrosoftYaHei" !important;
}
</style>
