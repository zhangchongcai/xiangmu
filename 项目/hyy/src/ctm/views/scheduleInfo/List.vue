<template>
    <section class="schedule-info-list">
        <el-form :inline="true" :model="formData" class="demo-form-inline search-form" size="small">
            <el-form-item label="首映年月：">
                <el-date-picker
                        v-model="formData.showMonth"
                        type="month"
                        value-format="yyyyMM"
                        placeholder="请选择">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="影片名称：">
                <el-select
                        v-model="formData.movieCode"
                        filterable
                        remote
                        clearable
                        reserve-keyword
                        placeholder="请输入影片名称"
                        :remote-method="remoteMethod"
                        :loading="loading">
                    <el-option
                            v-for="item in movieOptions"
                            :key="item.movieCode"
                            :label="item.movieName"
                            :value="item.movieCode">
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
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
        </el-form>

        <div class="el-row-btns clearfix">
            <el-button style="float: right;" @click="toAdd" size="small">新建</el-button>
        </div>

        <el-table
                :data="tableData"
                stripe
                :header-cell-style="{'background': '#F2F4FD'}"
                style="width: 100%">
            <el-table-column
                    prop="showMonth"
                    label="首映年月"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="versionNo"
                    label="版本"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="hallCount"
                    label="状态"
                    show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.status === 0">保存未提交</span>
                    <span v-if="scope.row.status === 1" style="color: #739BFF">待审批</span>
                    <span v-if="scope.row.status === 3" style="color: #2DBC2D">审批通过</span>
                    <span v-if="scope.row.status === 4" style="color: #F33430">审批驳回</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="createUserName"
                    label="操作人"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="操作时间"
                    width="260"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="approveUserName"
                    label="审核人"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="approveTime"
                    label="审核时间"
                    width="260"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    width="200"
                    fixed="right"
                    label="操作">
                <template slot-scope="scope">
                    <el-button style="padding: 0" @click="toView(scope.row.showMonth, scope.row.versionNo)" type="text" size="small">查看</el-button>
                    <el-button v-if="scope.row.status !== 1" style="padding: 0" @click="toEdit(scope.row.showMonth, scope.row.versionNo)" type="text" size="small">编辑</el-button>
                    <el-button v-if="scope.row.status === 0 || scope.row.status === 4" style="padding: 0" @click="schGuideInfoDelete(scope.row.showMonth, scope.row.versionNo)" type="text" size="small">删除</el-button>
                    <el-button v-if="scope.row.status === 1" style="padding: 0" @click="schGuideInfoRecall(scope.row.uid)" type="text" size="small">撤回</el-button>
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
        name: "List",
        data() {
            return {
                formData: {
                    showMonth: '',
                    movieCode: '',
                    status: '',
                    current: 1,
                    size: 20,
                },
                tableData: [],
                total: 0,
                loading: false,
                movieOptions: [],
                statusOptions: [{
                    keyCode: 0,
                    keyName: '保存未提交',
                }, {
                    keyCode: 1,
                    keyName: '待审批',
                }, {
                    keyCode: 3,
                    keyName: '审批通过',
                }, {
                    keyCode: 4,
                    keyName: '审批驳回',
                }],

            }
        },
        methods: {

            toView(showMonth, versionNo) {
                this.$router.push({ path: '/ticket/scheduleInfo/view', query: { showMonth, versionNo, mode: 'view' } })

            },

            toEdit(showMonth, versionNo) {
                this.$router.push({ path: '/ticket/scheduleInfo/edit', query: { showMonth, versionNo, mode: 'edit' } })

            },

            toAdd() {
                this.$router.push({ path: '/ticket/scheduleInfo/add' })

            },

            remoteMethod(query) {
                let data = {
                    movieName: query,
                    current: 1,
                    size: 10,
                }
                this.downloadMovieList(data)
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

            downloadMovieList(data) {
                this.loading = true
                this.$ctmList.DownloadmovieList(data).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.loading = false
                        this.movieOptions = res.data.records

                    }else {
                        this.error(res.msg)
                    }

                }).catch( err => {
                    console.log(err)
                })
            },

            schGuideInfoDelete(showMonth, versionNo) {
                this.$ctmList.schGuideInfoDelete({ showMonth, versionNo }).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.success('删除成功！')
                        this.search()

                    }else {
                        this.error(res.msg);
                    }

                })
            },

            schGuideInfoRecall(uid) {
                this.$ctmList.schGuideInfoRecall({ uid }).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.success('撤回成功！')
                        this.search()

                    }else {
                        this.error(res.msg);
                    }

                })
            },

            search() {
                this.$ctmList.schGuideInfoPage(this.formData).then( res => {
                    console.log(res)
                    if(res.code === 200) {
                        this.tableData = res.data.list
                        this.total = res.data.total

                    }else {
                        this.error(res.msg);
                    }

                })
            },

        },
        mounted() {
            this.search()
            this.remoteMethod()
        }
    }
</script>

<style lang="scss">
    .schedule-info-list {

    }

</style>