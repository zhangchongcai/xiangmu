<template>
    <section class="headquartersView">

        <singleCinema
                ref="frameSingleCinema"
                :framedialogVisible.sync="singleCinemaVisible"
                :type="singleCinemaType"
                :innerData="innerData"
                @callBackSingle="callBackSingle">
            <div slot="footerId">
                <el-button @click="singleCinemaVisible = false">取 消</el-button>
                <el-button type="primary" @click="$refs.frameSingleCinema.confirmData(), singleCinemaVisible = false">确 定</el-button>
            </div>
        </singleCinema>

        <el-dialog :title="mode === 'add' ? '新增支付方式' : ( mode === 'view' ? '查看支付方式' : '修改支付方式')" :visible.sync="outerVisible">
            <el-dialog
                    title="选择影院"
                    :visible.sync="innerVisible"
                    append-to-body>
                <el-form size="small">
                    <el-form-item label="影院名称">
                        <el-input
                                style="width: 200px;"
                                placeholder="请输入内容"
                                v-model="filterText">
                        </el-input>
                        <el-button type="primary" @click="searchCinema">搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-tree
                                class="filter-tree"
                                :data="treeData"
                                :props="defaultProps"
                                node-key="name"
                                show-checkbox
                                default-expand-all
                                :filter-node-method="filterNode"
                                ref="cinemaTree">
                        </el-tree>
                    </el-form-item>
                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="confirmSelectCinema">确定</el-button>
                    <el-button @click="innerVisible = false">取消</el-button>
                </div>

            </el-dialog>
            <el-form :model="addForm" :rules="rules" ref="addForm" :label-width="formLabelWidth">
                <el-form-item label="支付方式编码：">
                    <span>{{ addForm.payTypeCode }}</span>
                </el-form-item>
                <el-form-item label="支付方式名称：" prop="payTypeName">
                    <el-input
                            style="width: 200px"
                            :readonly="mode === 'view' ? true : false"
                            v-model="addForm.payTypeName"
                            placeholder="请输入支付方式名称"
                    ></el-input>
                </el-form-item>
                <el-form-item label="pos端是否显示：">
                    <el-radio :disabled="mode === 'view' ? true : false" v-model="addForm.showFlag" :label="1">显示</el-radio>
                    <el-radio :disabled="mode === 'view' ? true : false" v-model="addForm.showFlag" :label="0">不显示</el-radio>
                </el-form-item>
                <el-form-item label="适用影院：" prop="useCinema">
                    <div>
                        <el-radio :disabled="mode === 'view' ? true : false" v-model="addForm.useCinema" :label="1" @change="useCinemaChange">全部影院</el-radio>
                    </div>
                    <div>
                        <el-radio :disabled="mode === 'view' ? true : false" v-model="addForm.useCinema" :label="0" @change="useCinemaChange">指定影院</el-radio>
                        <el-input
                                style="width: 200px"
                                v-model="selectedCinema"
                                @clear="clearSelectedCinema"
                                clearable
                                readonly>
                        </el-input>
                        <el-button :disabled="addForm.useCinema === 1 || mode === 'view' ? true : false" @click="innerVisible = true">选 择</el-button>
                    </div>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button v-if="mode === 'view' ? false : true" type="primary" @click="savePayType('addForm')">保 存</el-button>
                <el-button @click="outerVisible = false">取 消</el-button>
            </div>
        </el-dialog>
        
        <el-form :inline="true" :model="formData" class="demo-form-inline search-form" size="small">
            <el-form-item label="支付方式编码：">
                <el-input
                    placeholder="请输入支付方式编码"
                    v-model="formData.code"
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item label="支付方式名称：">
                <el-input
                    placeholder="请输入支付方式名称"
                    v-model="formData.name"
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item label="适用影院：">
                <el-button
                        class="single-cinema-button"
                        @click="singleCinemaVisible = true, $refs.frameSingleCinema.listAuthCommCinemas()"
                >{{ cinemaName }}</el-button>
                <i v-if="cinemaName !== '全部'"
                   class="delete-cinema-icon el-icon-circle-close el-icon--right"
                   @click="clearCurrentCinema"
                ></i>
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
                width="60">
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
                label="支付类型"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.defFlag">自定义支付方式</span>
                    <span v-else>默认支付方式</span>
                </template>
            </el-table-column>
            <el-table-column
                label="pos端是否显示"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.showFlag">显示</span>
                    <span v-else>不显示</span>
                </template>
            </el-table-column>
            <el-table-column
                label="适用影院"
                width="260"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.useCinema">全部</span>
                    <span v-else v-for="item in scope.row.cinemaNames" :key="item">{{item}} </span>
                </template>
            </el-table-column>
            <el-table-column
                width="200"
                fixed="right"
                label="操作">
                <template slot-scope="scope">
                    <el-button style="padding: 0" @click="toView(scope.row.payTypeCode, scope.row.cinemaNames)" type="text" size="small">查看</el-button>
                    <el-button v-if="scope.row.defFlag" style="padding: 0" @click="toUpdate(scope.row.payTypeCode, scope.row.cinemaNames)" type="text" size="small">修改</el-button>
                    <el-button v-if="scope.row.defFlag" style="padding: 0" @click="deletePayType(scope.row.payTypeCode)" type="text" size="small">删除</el-button>
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
                :page-size="formData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>

    </section>
</template>

<script>
    import singleCinema from "frame_cpm/dialogs/cinemaDialog/singleCinema"

    export default {
        name: "HeadquartersView",
        components: {
            singleCinema
        },
        data() {
            let useCinemaValidator = (rule, value, callback) => {
                if (value === 0 && this.selectedCinema === '') {
                    callback(new Error('请至少选择一个影院'))
                } else {
                    callback()
                }
            }
            return {

                outerVisible: false,
                innerVisible: false,
                treeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                filterText: '',
                selectedCinema: '',


                singleCinemaVisible: false,
                singleCinemaType: 2,
                innerData: {
                    id: '',
                },
                cinemaName: '全部',

                mode: 'add',
                rules: {
                    payTypeName: [
                        { required: true, message: '请输入支付方式名称', trigger: 'blur' },
                    ],
                    useCinema: [
                        { validator: useCinemaValidator, trigger: 'submit' }
                    ]
                },
                addForm: {
                    payTypeCode: '',
                    payTypeName: '',
                    useCinema: 1,
                    showFlag: 1,
                    cinemaUids: [],
                    id: '',
                    uid: '',
                },
                formLabelWidth: '120px',
                tableData: [],
                total: 0,
                formData: {
                    cinemaUid: '',
                    code: '',
                    name: '',
                    pageSize: 20,
                    current: 1,
                }
            }
        },
        methods: {
            toView(code, cinemaNames) {
                this.mode = 'view'
                this.findPayTypeByCode(code, cinemaNames)
            },

            toUpdate(code, cinemaNames) {
                this.mode = 'update'
                this.findPayTypeByCode(code, cinemaNames)
            },

            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },

            useCinemaChange(val) {
                if(val === 1) {
                    this.addForm.cinemaUids = []
                    this.selectedCinema = ''
                    if(this.$refs.cinemaTree) {
                        this.$refs.cinemaTree.setCheckedKeys([])
                    }
                }

            },


            clearSelectedCinema() {
                this.addForm.cinemaUids = []
                this.$refs.cinemaTree.setCheckedKeys([])

            },


            confirmSelectCinema() {
                let checkedNodes = this.$refs.cinemaTree.getCheckedNodes()
                let selectedCinemaName = []
                let selectedCinemaUid = []
                checkedNodes.forEach( item => {
                    if(item.cinema) {
                        selectedCinemaName.push(item.name)
                        selectedCinemaUid.push(item.uid)
                    }

                })
                console.log(selectedCinemaName, selectedCinemaUid)
                this.selectedCinema = selectedCinemaName.join('，')
                this.addForm.cinemaUids = selectedCinemaUid

                this.innerVisible = false

            },

            searchCinema() {
                this.$refs.cinemaTree.filter(this.filterText)
            },

            clearCurrentCinema() {
                this.formData.cinemaUid = ''
                this.cinemaName = '全部'
                this.innerData.id = ''

                this.search()
            },

            callBackSingle(data) {
                this.singleCinemaVisible = data.framedialogVisible

                if(data.isCloseWindow) return

                console.log(data, '-----> data')
                this.formData.cinemaUid = data.data.id
                this.cinemaName = data.data.name
                 this.cinemaName = this.cinemaName.length> 10?this.cinemaName.substring(0,9)+"...": this.cinemaName
                this.innerData.id = data.data.id

                this.search()
            },

            findPayTypeByCode(code, cinemaNames) {
                this.$csmList.findPayTypeByCode({ code }).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        if(this.$refs.addForm) {
                            this.$refs.addForm.clearValidate()
                        }
                        this.addForm.payTypeCode = res.data.payTypeCode
                        this.addForm.payTypeName = res.data.payTypeName

                        this.addForm.showFlag = res.data.showFlag

                        this.addForm.useCinema = res.data.useCinema
                        this.selectedCinema = res.data.useCinema ? '' : cinemaNames.join('，')

                        if(this.mode === 'update') {
                            this.addForm.id = res.data.id
                            this.addForm.uid = res.data.uid
                        }else if(this.mode === 'view') {

                        }
                        this.outerVisible = true


                    }else {
                        this.error(res.msg)
                    }

                })
            },

            updateStatus(status, uid) {
                this.$csmList.updatePayTypeStatus({ uid, status }).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.success(res.msg)
                        this.search()
                    }else {
                        this.error(res.msg)
                    }

                })

            },

            deletePayType(code) {
                this.$confirm('此操作将永久删除该支付方式, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$csmList.deletePayType({ code }).then( res => {
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
                        this.$csmList[this.mode === 'add' ? 'savePayType' : 'updatePayType'](this.addForm).then( res => {
                            console.log(res)
                            if(res.code === 200) {
                                this.outerVisible = false
                                this.success('保存成功！')
                                this.$refs[formName].resetFields()
                                this.useCinemaChange(1)
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
                this.$csmList.getPayTypeCode().then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        if(this.$refs.addForm) {
                            this.$refs.addForm.clearValidate()
                        }
                        this.addForm.payTypeCode = res.data
                        this.addForm.payTypeName = ''
                        this.addForm.useCinema = 1
                        this.addForm.showFlag = 1
                        this.addForm.cinemaUids = []

                        this.mode = 'add'
                        this.outerVisible = true

                    }else {
                        this.error(res.msg);
                    }

                })
            },

            getCinemaTree() {
                this.$ctmList.getCinemaTree().then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.treeData = [res.data]
                    }else {
                        this.error(res.msg)
                    }

                })

            },

            search() {
                this.$csmList.getHeadquartersPayType(this.formData).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.tableData = res.data.list
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
            this.getCinemaTree()

        }

    }
</script>

<style lang="scss">
    .headquartersView {
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
            .single-cinema-button {
                float: left;
                width: 192px;
                height: 32px;
                font-size: 12px;
                color: #606266;
                padding-left: 8px;
                border: 1px solid #BCBCBC;;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                background-color: #fff;
                text-align: left;
                cursor: text;
            }
            .delete-cinema-icon {
                margin-left: -18px;
                cursor: pointer;
                color: #ccc;
            }
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