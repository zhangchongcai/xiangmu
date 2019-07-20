<template>
    <div class="set-prime-time">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "Index"
    }
</script>

<style lang="scss">
    .set-prime-time {
        .search-form {
            background: #F5F5F5;
            padding: 24px 0 6px 24px;
            .el-form-item {
                margin-right: 32px;
                .el-checkbox__label {
                    font-size: 12px;
                }
                .el-button + .el-button {
                    margin-left: 8px;
                }
            }
            .el-icon-arrow-left, .el-icon-arrow-right {
                cursor: pointer;
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
            .el-button {
                padding: 2px 8px;
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