<template>
    <section class="payment">

        <el-dialog :title="isDetail?'支付方式详情':'新增支付方式'" :visible.sync="dialogVisible">
            <el-form :model="addForm" :rules="rules" ref="addForm" :label-width="formLabelWidth" style="width: 400px">
                <el-form-item label="支付方式编码：">
                    <span>{{ addForm.payTypeCode }}</span>
                </el-form-item>
                <el-form-item label="支付方式名称：" prop="payTypeName">
                    <span v-if="isDetail">{{ addForm.payTypeName }}</span>
                    <el-input v-else v-model="addForm.payTypeName"></el-input>
                </el-form-item>
                <el-form-item v-if="isDetail" label="支付类型：">
                    <span v-if="defFg">自定义支付方式</span>
                    <span v-else>默认支付方式</span>
                </el-form-item>
                <el-form-item label="使用状态：" prop="status">
                    <el-radio :disabled="isDetail" v-model="addForm.status" :label="1">启用</el-radio>
                    <el-radio :disabled="isDetail" v-model="addForm.status" :label="0">停用</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!isDetail">
                <el-button type="primary" @click="savePayType('addForm')">保 存</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>
        
        <el-form :inline="true" :model="formData" class="demo-form-inline search-form" size="small">
            <el-form-item label="支付方式编码：">
                <el-input
                    placeholder="请输入支付方式编码"
                    v-model="formData.payTypeCode"
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item label="支付方式名称：">
                <el-input
                    placeholder="请输入支付方式名称"
                    v-model="formData.payTypeName"
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item label="使用状态：">
                <el-select v-model="formData.status" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                        v-for="item in statusOptions"
                        :key="item.keyCode"
                        :label="item.keyName"
                        :value="item.keyCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
                <!--<el-button @click="resetFields">重置条件</el-button>-->
            </el-form-item>
        </el-form>
        <div class="el-row-btns clearfix">
            <el-button style="float: right;" @click="getPayTypeCode" size="small">添加支付方式</el-button>
        </div>
        <el-table
            :data="tableData"
            stripe
            :header-cell-style="{'background': '#F2F4FD'}"
            style="width: 100%">
            <el-table-column
                label="序号"
                type="index"
                width="100">
            </el-table-column>
            <el-table-column
                prop="payTypeCode"
                label="支付方式编码"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="payTypeName"
                label="支付方式名称"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="defFg"
                label="支付类型"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.defFg">自定义支付方式</span>
                    <span v-else>默认支付方式</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="status"
                label="使用状态"
                width="120"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.status">启用</span>
                    <span v-else>停用</span>
                </template>
            </el-table-column>
            <el-table-column
                width="260"
                fixed="right"
                label="操作">
                <template slot-scope="scope">
                    <el-button style="padding: 0" @click="findPayTypeByCode(scope.row.payTypeCode)" type="text" size="small">查看</el-button>
                    <el-button style="padding: 0" @click="updateStatus(scope.row.status === 0 ? 1 : 0, scope.row.uid)" type="text" size="small">{{scope.row.status ? '停用' : '启用'}}</el-button>
                    <el-button v-if="scope.row.defFg" style="padding: 0" @click="deletePayType(scope.row.uid)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="page-wrap">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="formData.current"
                :page-sizes="[20, 40, 60, 80]"
                :page-size="formData.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>


    </section>
</template>

<script>
    export default {
        name: "Payment",
        data() {
            return {
                defFg: '',
                isDetail: false,
                rules: {
                    payTypeName: [
                        { required: true, message: '请输入支付方式名称', trigger: 'blur' },
                    ],
                    status: [
                        { required: true, message: '请选择使用状态', trigger: 'change' }
                    ]
                },
                addForm: {
                    payTypeCode: '',
                    payTypeName: '',
                    status: 1,
                },
                formLabelWidth: '120px',
                dialogVisible: false,
                tableData: [],
                statusOptions: [{
                    keyCode: 1,
                    keyName: '启用'
                }, {
                    keyCode: 0,
                    keyName: '停用'
                }],
                total: 0,
                formData: {
                    payTypeCode: '',
                    payTypeName: '',
                    status: '',
                    size: 20,
                    current: 1,
                }
            }
        },
        methods: {

            findPayTypeByCode(code) {
                this.$api.findPayTypeByCode({ code }).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.addForm.payTypeCode = res.data.payTypeCode
                        this.addForm.payTypeName = res.data.payTypeName
                        this.addForm.status = res.data.status
                        this.defFg = res.data.defFg
                        this.isDetail = true
                        this.dialogVisible = true

                    }else {
                        this.error(res.msg)
                    }

                })
            },

            updateStatus(status, uid) {
                this.$api.updatePayTypeStatus({ uid, status }).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.success(res.msg)
                        this.search()
                    }else {
                        this.error(res.msg)
                    }

                })

            },

            deletePayType(uid) {
                this.$confirm('此操作将永久删除该支付方式, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api.deletePayType({ uid }).then( res => {
                        console.log(res)
                        if(res.code === 200) {
                            this.success('删除成功！')
                            this.search()

                        }else {
                            this.error(res.msg);
                        }

                    })
                }).catch(() => {
                    
                });
                
            },

            savePayType(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$api.savePayType(this.addForm).then( res => {
                            console.log(res)
                            if(res.code === 200) {
                                this.dialogVisible = false
                                this.success('保存成功！')
                                this.$refs[formName].resetFields()
                                this.search()

                            }else {
                                this.error(res.msg);
                            }

                        })
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },

            getPayTypeCode() {
                this.$api.getPayTypeCode().then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.addForm.payTypeCode = res.data
                        this.addForm.payTypeName = ''
                        this.addForm.status = 1
                        this.isDetail = false
                        this.dialogVisible = true

                    }else {
                        this.error(res.msg);
                    }

                })
            },

            search() {
                this.$api.findPayTypePage(this.formData).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.tableData = res.data.records
                        this.total = res.data.total

                    }else {
                        this.error(res.msg)
                    }

                })
            },

            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.formData.size = val
                this.search()
            },

            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.formData.current = val
                this.search()
            },


        },
        mounted() {
            this.search()
        }

    }
</script>

<style lang="scss">
    .payment {
        padding: 20px;
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
            .el-icon-date, .el-range__close-icon {
                display: none;
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
                padding: 0;
                span {
                    font-size: 12px;
                }
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