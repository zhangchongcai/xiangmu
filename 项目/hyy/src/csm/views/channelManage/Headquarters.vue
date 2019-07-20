<template>
    <section class="headquarters">

        <el-dialog title="院线渠道详情" :visible.sync="detailDialogVisible">
            <el-form :model="detailForm" label-width="120px">
                <el-form-item class="detail-title" label="基础信息" label-width="80px"></el-form-item>
                <el-form-item label="渠道编码：">
                    <span>{{detailForm.code}}</span>
                </el-form-item>
                <el-form-item label="渠道名称：">
                    <span>{{detailForm.name}}</span>
                </el-form-item>
                <el-form-item label="渠道类型：">
                    <span v-if="detailForm.channelNature === 1 || detailForm.channelNature === 0">自营渠道</span>
                    <span v-else-if="detailForm.channelNature === 2">第三方渠道</span>
                </el-form-item>
                <el-form-item class="detail-title" label="授权影院" label-width="80px"></el-form-item>
                <el-form-item label="授权影院：">
                    <span v-for="item in detailForm.cinemaNames" :key="item">{{item}}，</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setCurrentChannelCinema">设置授权影院</el-button>
                <el-button type="primary" @click="updateCurrentStatus">{{detailForm.status ? '启用' : '停用'}}</el-button>
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
                    height="420"
                    :header-cell-style="{'background': '#F2F4FD'}"
                    @selection-change="handleSelectionChange"
                    style="width: 70%">
                    <el-table-column
                        type="selection"
                        width="55"
                        :selectable="selectable">
                    </el-table-column>
                    <el-table-column property="code" label="渠道编码" width="150"></el-table-column>
                    <el-table-column property="name" label="渠道名称"></el-table-column>
                    <el-table-column
                        label="渠道类型"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.type === 1 || scope.row.type === 0">自营渠道</span>
                            <span v-else-if="scope.row.type === 2">第三方渠道</span>
                        </template>
                    </el-table-column>
                </el-table>

                <el-card class="box-card" shadow="never">
                    <div slot="header" class="clearfix">
                        <span style="display: inline-block; height: 22px; line-height: 22px">已选内容：</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="emptyData">清空</el-button>
                    </div>
                    <div v-for="item in multipleSelection" :key="item.code" class="text item">
                        <span :title="item.name" style="display: inline-block; width: 80%; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ item.name }}</span>
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
            <el-button style="float: right;" @click="addChannel" size="small">添加渠道</el-button>
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
                    <span v-if="scope.row.channelNature === 1 || scope.row.channelNature === 0">自营渠道</span>
                    <span v-else-if="scope.row.channelNature === 2">第三方渠道</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="cinemaNames"
                label="授权影院数"
                width="240"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-for="item in scope.row.cinemaNames" :key="item">{{item}}，</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态"
                width="120"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.status === 0">启用</span>
                    <span v-else>停用</span>
                </template>
            </el-table-column>
            <el-table-column
                width="260"
                fixed="right"
                label="操作">
                <template slot-scope="scope">
                    <el-button style="padding: 0" @click="updateStatus(scope.row.status === 0 ? 1 : 0, scope.row.uid)" type="text" size="small">{{scope.row.status ? '启用' : '停用'}}</el-button>
                    <el-button style="padding: 0" @click="setAuthorizedCinema(scope.row.uid)" type="text" size="small">设置授权影院</el-button>
                    <el-button style="padding: 0" @click="showChannelDetail(scope.row)" type="text" size="small">查看详情</el-button>

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
                detailForm: {},
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
                    keyName: '第三方渠道'
                }, {
                    keyCode: 1,
                    keyName: '自营渠道'
                }],
                channelNatureOptions: [{
                    keyCode: 2,
                    keyName: '第三方渠道'
                }, {
                    keyCode: 1,
                    keyName: '自营渠道'
                }],
                statusOptions: [{
                    keyCode: 0,
                    keyName: '启用'
                }, {
                    keyCode: 1,
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
            updateCurrentStatus() {
                this.updateStatus(this.detailForm.status === 0 ? 1 : 0, this.detailForm.uid, _ => {
                    this.detailDialogVisible = false
                })
            },

            setCurrentChannelCinema() {
                this.detailDialogVisible = false
                this.setAuthorizedCinema(this.detailForm.uid)
            },

            selectable(row) {
                return row.isAdded === 0
            },

            addChannel() {
                this.dialogVisible = true
                this.getChannelOtherList()

            },

            clearSelectedCinema() {
                this.authorizedCinemaData.cinemaUids = []
                this.$refs.cinemaTree.setCheckedKeys([])

            },

            useRangeChange(val) {
                if(val === 1) {
                    this.authorizedCinemaData.cinemaUids = []
                    this.selectedCinema = ''
                    if(this.$refs.cinemaTree) {
                        this.$refs.cinemaTree.setCheckedKeys([])
                    }
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
                        code: item.code,
                        uid: item.uid,
                        buttUser: item.buttUser,
                        buttPass: item.buttPass
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
                this.multipleSelection.forEach( row => {
                    this.$refs.multipleTable.toggleRowSelection(row)
                })
                this.multipleSelection = []

            },

            deleteCurrent(code) {
                console.log(code)
                let row = this.multipleSelection.find( item => {
                    return item.code === code
                })
                this.$refs.multipleTable.toggleRowSelection(row)

            },

            handleSelectionChange(val) {
                this.multipleSelection = val.filter( row => {
                    return row.isAdded === 0
                })
            },

            showChannelDetail(row) {
                this.detailForm = row
                this.detailDialogVisible = true
            },

            setChannelCinema() {
                this.$csmList.setChannelCinema(this.authorizedCinemaData).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.outerVisible = false
                        this.success('设置成功！')
                        this.search()
                        // 清空数据
                        this.useRangeChange(1)

                    }else {
                        this.error(res.msg)
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

            getChannelOtherList() {
                this.$csmList.getChannelOtherList(this.searchForm).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.gridData = res.data
                        this.$nextTick( _ => {
                            this.gridData.forEach( row => {
                                if(row.isAdded === 1) {
                                    this.$refs.multipleTable.toggleRowSelection(row)

                                }
                            })
                        })

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

            updateStatus(status, channelUid, cb) {
                this.$csmList.setChannelStatus({ channelUid, status }).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.success(res.msg)
                        this.search()
                        cb && cb()
                    }else {
                        this.error(res.msg)
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
                this.$ctmList.getUserInfo().then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.cinemaUid = res.data.cinemaUid
                    }else {
                        this.error(res.msg)
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
                .el-card__header {
                    padding: 8px 20px;
                }
                .el-card__body {
                    max-height: 340px;
                    overflow-y: auto;
                }
                .text {
                    font-size: 12px;
                }
                .item {
                    margin-bottom: 8px;
                }
            }
            .detail-title {
                font-weight: bold;
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