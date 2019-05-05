<template>
    <section class="headquarters">

        <el-dialog title="院线渠道详情" :visible.sync="detailDialogVisible">
            <el-form :model="detailForm">
                <el-form-item label="渠道编码：" :label-width="formLabelWidth">
                    {{detailForm.chennelCode}}
                </el-form-item>
                <el-form-item label="渠道名称：" :label-width="formLabelWidth">
                    {{detailForm.channelName}}
                </el-form-item>
                <el-form-item label="渠道类型：" :label-width="formLabelWidth">
                    {{detailForm.type}}
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="detailDialogVisible = false">设置授权影院</el-button>
                <el-button type="primary" @click="detailDialogVisible = false">停用</el-button>
            </div>
        </el-dialog>

        <el-dialog title="设置授权影院" :visible.sync="outerVisible">
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

            <div>
                <div>
                    <el-radio v-model="authorizedCinemaData.useRange" :label="1" @change="useRangeChange">全部影院</el-radio>

                </div>
                <div style="margin-top: 20px">
                    <el-radio v-model="authorizedCinemaData.useRange" :label="2" @change="useRangeChange">指定影院</el-radio>
                    <el-input
                            style="width: 200px"
                            v-model="selectedCinema"
                            @clear="clearSelectedCinema"
                            clearable
                            readonly>
                    </el-input>
                    <i class="el-icon-more"
                       style="background: #3B74FF; color: #fff; border-radius: 2px; cursor: pointer"
                       @click="innerVisible = authorizedCinemaData.useRange === 2 ? true : false"
                    ></i>

                </div>

            </div>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="setChannelCinema">确定</el-button>
                <el-button @click="outerVisible = false">取消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="选择渠道" :visible.sync="dialogVisible" width="76%">
            <el-form :inline="true" :model="searchForm" :label-width="formLabelWidth" size="small">
                <el-form-item label="渠道类型">
                    <el-select v-model="searchForm.type" placeholder="请选择">
                        <el-option label="全部" value=""></el-option>
                        <el-option
                            v-for="item in dialogChannelNatureOptions"
                            :key="item.keyCode"
                            :label="item.keyName"
                            :value="item.keyCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道编码">
                    <el-input v-model="searchForm.code" placeholder="请输入渠道编码"></el-input>
                </el-form-item>
                <el-form-item label="渠道名称">
                    <el-input v-model="searchForm.name" placeholder="请输入渠道名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getChannelOtherList" icon="el-icon-search">查询</el-button>
                </el-form-item>
            </el-form>

            <div style="display: flex">
                <el-table
                    :data="gridData"
                    ref="multipleTable"
                    stripe
                    :header-cell-style="{'background': '#F2F4FD'}"
                    @selection-change="handleSelectionChange"
                    style="width: 70%">
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column property="code" label="渠道编码" width="150"></el-table-column>
                    <el-table-column property="name" label="渠道名称"></el-table-column>
                    <el-table-column
                        label="渠道类型"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.type === 0">线下渠道</span>
                            <span v-else-if="scope.row.type === 1">直营线上</span>
                            <span v-else-if="scope.row.type === 2">网络代售渠道</span>
                        </template>
                    </el-table-column>
                </el-table>

                <el-card class="box-card" shadow="never">
                    <div slot="header" class="clearfix">
                        <span>已选内容：</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="emptyData">清空</el-button>
                    </div>
                    <div v-for="item in multipleSelection" :key="item.code" class="text item">
                        <span>{{ item.name }}</span>
                        <i style="float: right; padding: 3px 0; cursor: pointer" class="el-icon-close" @click="deleteCurrent(item.code)"></i>
                    </div>
                </el-card>

            </div>

            <div slot="footer" class="dialog-footer">
                <el-button :disabled="!multipleSelection.length"  type="primary" @click="addHeaderChannel">保 存</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-form :inline="true" :model="formData" class="demo-form-inline search-form" size="small">
            <el-form-item label="渠道类型：">
                <el-select v-model="formData.channelNature" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                        v-for="item in channelNatureOptions"
                        :key="item.keyCode"
                        :label="item.keyName"
                        :value="item.keyCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态：">
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
            <el-form-item label="渠道名称：">
                <el-input
                    placeholder="请输入渠道名称"
                    v-model="formData.name"
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
                <!--<el-button @click="resetFields">重置条件</el-button>-->
            </el-form-item>
        </el-form>

        <div class="el-row-btns clearfix">
            <el-button style="float: right;" @click="dialogVisible = true" size="small">添加渠道</el-button>
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
                prop="code"
                label="渠道编码"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="name"
                label="渠道名称"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="channelNature"
                label="渠道类型"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.channelNature === 0">线下渠道</span>
                    <span v-else-if="scope.row.channelNature === 1">直营线上</span>
                    <span v-else-if="scope.row.channelNature === 2">网络代售渠道</span>
                </template>
            </el-table-column>
            <el-table-column
                label="授权影院数"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-for="item in scope.row.ciCinemas" :key="item.name">{{item.name}}，</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态"
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
                    <el-button style="padding: 0" @click="updateStatus(scope.row.status === 0 ? 1 : 0, scope.row.uid)" type="text" size="small">{{scope.row.status ? '停用' : '启用'}}</el-button>
                    <el-button style="padding: 0" @click="setAuthorizedCinema(scope.row.uid)" type="text" size="small">设置授权影院</el-button>
                    <el-button style="padding: 0" @click="getChannelDetail(scope.row.uid)" type="text" size="small">查看详情</el-button>

                </template>
            </el-table-column>
        </el-table>

        <div class="page-wrap">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="formData.page"
                :page-sizes="[20, 40, 60, 80]"
                :page-size="formData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
    </section>
</template>

<script>
    export default {
        name: "Headquarters",
        data() {
            return {
                detailForm: {

                },
                detailDialogVisible: false,
                cinemaUid: '',
                outerVisible: false,
                innerVisible: false,
                multipleSelection: [],
                gridData: [],
                searchForm: {
                    type: '',
                    name: '',
                    code: '',
                },
                formLabelWidth: '60px',
                dialogVisible: false,
                tableData: [],
                dialogChannelNatureOptions: [{
                    keyCode: 2,
                    keyName: '网络代售'
                }, {
                    keyCode: 1,
                    keyName: '直营线上'
                }],
                channelNatureOptions: [{
                    keyCode: 2,
                    keyName: '网络代售渠道'
                }, {
                    keyCode: 1,
                    keyName: '直营线上'
                }, {
                    keyCode: 0,
                    keyName: '线下渠道'
                }],
                statusOptions: [{
                    keyCode: 1,
                    keyName: '启用'
                }, {
                    keyCode: 0,
                    keyName: '停用'
                }],
                total: 0,
                formData: {
                    channelNature: '',
                    name: '',
                    status: '',
                    pageSize: 20,
                    page: 1,
                },
                authorizedCinemaData: {
                    channelUid: '',
                    cinemaUids: [],
                    useRange: 1
                },
                selectedCinema: '',
                treeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                filterText: '',
            }
        },
        methods: {

            clearSelectedCinema() {
                this.authorizedCinemaData.cinemaUids = []
                this.$refs.cinemaTree.setCheckedKeys([])

            },

            useRangeChange(val) {
                if(val === 1) {
                    this.authorizedCinemaData.cinemaUids = []
                    this.selectedCinema = ''
                    this.$refs.cinemaTree.setCheckedKeys([])
                }

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
                this.authorizedCinemaData.cinemaUids = selectedCinemaUid

                this.innerVisible = false

            },

            searchCinema() {
                this.$refs.cinemaTree.filter(this.filterText)
            },

            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },

            setAuthorizedCinema(uid) {
                this.authorizedCinemaData.channelUid = uid
                this.outerVisible = true

            },

            addHeaderChannel() {
                let channel = this.multipleSelection.map( item => {
                    return {
                        channelNature: item.type,
                        name: item.name,
                        company: item.company,
                        code: item.code
                    }
                })
                console.log(channel)
                this.$csmList.addHeaderChannel(channel).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.$refs.multipleTable.clearSelection()
                        this.dialogVisible = false
                        this.success(res.msg)
                        this.search()
                    }else {
                        this.error(res.msg)
                    }

                })

            },

            emptyData() {
                this.multipleSelection = []
                this.$refs.multipleTable.clearSelection()

            },

            deleteCurrent(code) {
                console.log(code)
                let row = this.multipleSelection.find( item => {
                    return item.code === code
                })
                this.$refs.multipleTable.toggleRowSelection(row)

            },

            handleSelectionChange(val) {
                this.multipleSelection = val
            },

            getChannelDetail(channelUid) {
                this.$csmList.getChannelDetail({ channelUid, cinemaUid: this.cinemaUid }).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.detailForm = res.data.data


                    }else {
                        this.error(res.msg)
                    }

                })
            },

            setChannelCinema() {
                this.$csmList.setChannelCinema(JSON.stringify(this.authorizedCinemaData)).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.outerVisible = false
                        this.success('设置成功！')

                    }else {
                        this.error(res.msg)
                    }

                })

            },

            getCinemaTree() {
                // this.$csmList.getCinemaTree().then( res => {
                //     console.log(res)
                //     if(res.code === 200) {
                //         this.treeData = [res.data]
                //
                //     }else {
                //         this.error(res.msg)
                //     }
                //
                // })
                this.axios({
                    method: 'get',
                    url: 'http://10.8.0.18:8082/cinema/tree',
                }).then( res => {
                    console.log(res.data)
                    if(res.data.code === 200) {
                        this.treeData = [res.data.data]

                    }else {
                        this.error(res.data.msg)
                    }
                })

            },

            getChannelOtherList() {
                this.$csmList.getChannelOtherList(this.searchForm).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.gridData = res.data
                    }else {
                        this.error(res.msg)
                    }

                })

            },

            findPayTypeByCode(code) {
                this.$csmList.findPayTypeByCode({ code }).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.addForm.payTypeCode = res.data.payTypeCode
                        this.addForm.payTypeName = res.data.payTypeName
                        this.addForm.status = res.data.status
                        this.dialogVisible = true

                    }else {
                        this.error(res.msg)
                    }

                })
            },

            updateStatus(status, channelUid) {
                this.$csmList.setChannelStatus({ channelUid, status }).then( res => {
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
                    this.$csmList.deletePayType({ uid }).then( res => {
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
                        this.$csmList.savePayType(this.addForm).then( res => {
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

            search() {
                this.$csmList.getChannelList(this.formData).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.tableData = res.data.list
                        this.total = res.data.total

                    }else {
                        this.error(res.msg)
                    }

                })
            },

            getUserInfo() {
                // this.$csmList.getUserInfo().then( res => {
                //     console.log(res)
                //     if(res.code === 200) {
                //
                //
                //     }else {
                //         this.error(res.msg)
                //     }
                //
                // })
                this.axios({
                    method: 'get',
                    url: 'http://10.8.0.18:8082/common/user',
                }).then( res => {
                    console.log(res.data)
                    if(res.data.code === 200) {
                        this.cinemaUid = res.data.data.cinemaUid

                    }else {
                        this.error(res.data.msg)
                    }
                })
            },

            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.formData.pageSize = val
                this.search()
            },

            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.formData.page = val
                this.search()
            },


        },
        mounted() {
            this.getUserInfo()
            this.search()
            this.getCinemaTree()
        }
    }
</script>

<style lang="scss">
    .headquarters {
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
            .box-card {
                width: 30%;
                .text {
                    font-size: 12px;
                }
                .item {
                    margin-bottom: 8px;
                }
            }
            .el-form-item {
                margin-bottom: 16px;
                .el-form-item__label, .el-range-input {
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