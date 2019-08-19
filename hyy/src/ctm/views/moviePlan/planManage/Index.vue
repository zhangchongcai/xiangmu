<template>
    <div class="projection-plan">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "Index"
    }
</script>

<style lang="scss">
    .projection-plan{
        height: 100%;
        /*padding: 20px;*/
        .single-cinema-button {
            float: left;
            width: 180px;
            height: 32px;
            font-size: 12px;
            color: #606266;
            padding-left: 8px;
            overflow: hidden;
            border: none;
            text-overflow: ellipsis;
            white-space: nowrap;
            background-color: #fff;
            text-align: left;
            cursor: text;
        }
        .el-dialog__header {
            padding: 20px 0;
            margin: 0 20px;
            border-bottom: 1px solid #E5E5E5;
            .el-dialog__title {
                color: #333;
            }
        }
        .el-dialog__body {
            border-bottom: 1px solid #E5E5E5;
            .el-form-item {
                margin-bottom: 16px;
                .el-form-item__label, .el-range-input, span {
                    color: #666;
                    font-size: 12px;
                }
                .el-icon-date, .el-range__close-icon {
                    display: none;
                }
                .el-checkbox-group {
                    .el-checkbox {
                        width: 33%;
                        margin-right: 0;
                    }

                }
            }
        }
        .search-form {
            background: #F5F5F5;
            padding: 24px 24px 6px 24px;
            .el-form-item {
                margin-right: 32px;
                .el-button + .el-button {
                    margin-left: 8px;
                }
            }
            .el-icon-arrow-left, .el-icon-arrow-right {
                cursor: pointer;
            }
            .el-icon-date {
                display: none;
            }
            .el-range-editor {
                width: 300px;
                .el-range-separator {
                    width: 15%;
                }

            }
            .month {
                width: 140px;
                .el-input__inner {
                    border: none;
                    text-align: center;
                }
                .el-input__prefix {
                    display: none;
                }
            }
        }
        .el-table {
            span {
                font-size: 12px;
            }
            .el-button {
                padding: 0;
            }
            .el-button + .el-button {
                margin-left: 0;
            }
        }
        .el-row-btns {
            padding: 8px 0;
        }
    }

</style>