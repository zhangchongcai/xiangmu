<template>
    <section>
        <el-dialog title="选择票类" :visible.sync="dialogVisible">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="票类名称：">
                    <el-input v-model="formInline.ticketTypeName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getTickettypeList">查 询</el-button>
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
                        prop="name"
                        label="票类名称"
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
            cinemaUids: {
                type: Array,
                require: true
            },
            type: {
                type: Number,
                require: true
            }
        },

        data() {
            return {
                dialogVisible: false,
                multipleSelection: [],
                tableData: [],
                formInline: {
                    ticketTypeName: ''
                },

            }
        },
        methods: {
            confirmSelect() {
                this.$emit('getData', this.multipleSelection)
                this.dialogVisible = false
            },

            handleDialogVisible(val) {
                this.dialogVisible = val
            },

            handleSelectionChange(val) {
                this.multipleSelection = val
            },

            getTickettypeList() {
                this.$ctmList.getTickettypeList({
                    cinemaUids: this.cinemaUids,
                    type: this.type
                }).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.tableData = res.data
                        
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