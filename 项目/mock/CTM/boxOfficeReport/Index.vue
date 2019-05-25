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
         padding: 20px;
        .search-form {
            background: #F5F5F5;
            padding: 24px 24px 6px 24px;
            .el-icon-arrow-left, .el-icon-arrow-right {
                cursor: pointer;
            }
            .month {
                width: 140px;
                .el-input__inner {
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