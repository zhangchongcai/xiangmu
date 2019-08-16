<template>
    <div class="schedule-info">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "Index"
    }
</script>

<style lang="scss">
    .schedule-info {
        .search-form {
            background: #F5F5F5;
            padding: 24px 0 6px 24px;
            .el-form-item {
                margin-right: 32px;
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
        .el-form {
            .el-form-item__label {
                font-size: 12px;
            }
            .el-form-item__content {
                .el-input__inner {
                    font-size: 12px;
                }
            }
        }
    }

</style>