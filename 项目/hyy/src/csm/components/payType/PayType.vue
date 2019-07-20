<template>
    <section>
        <el-dialog title="选择支付方式" :visible.sync="dialogVisible">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="支付方式名称：">
                    <el-input v-model="formInline.payTypeName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="selectForTenant">查 询</el-button>
                </el-form-item>
            </el-form>
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="payTypeName"
                        label="支付方式"
                        show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmSelect">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
    export default {
        name: "PayType",
        props: {
            cinemaUidList: {
                type: Array,
                require: true
            },
            currentData: {
                type: Array,
                require: true
            }
        },

        data() {
            return {
                dialogVisible: false,
                multipleSelection: [],
                tableData: [],
                formInline: {
                    payTypeName: ''
                },

            }
        },
        methods: {
            confirmSelect() {
                this.$emit('getData', this.multipleSelection)
                this.dialogVisible = false
            },

            handleDialogVisible(val) {
                this.selectForTenant( _ => {
                    // TODO 根据currentData回显表格数据 具体处理要根据currentData格式来定

                    this.dialogVisible = val
                })
            },

            handleSelectionChange(val) {
                this.multipleSelection = val
            },

            selectForTenant(cb) {
                this.$csmList.selectForTenant({
                    cinemaUidList: this.cinemaUidList,
                    payTypeName: this.formInline.payTypeName
                }).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.tableData = res.data

                        cb && cb()

                    }else {
                        this.error(res.msg)
                    }
                })
            },

        }
    }
</script>

<style scoped>

</style>