<template>
    <div class="box-office-report">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "Index"
    }
</script>

<style lang="scss">
    .box-office-report{
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
    }

</style>