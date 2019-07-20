<template>
    <section class="cinema">

        <singleCinema ref="frameSingleCinema" :framedialogVisible.sync="singleCinemaVisible" :type="singleCinemaType"
            :innerData="innerData" @callBackSingle="callBackSingle">
            <div slot="footerId">
                <el-button @click="singleCinemaVisible = false">取 消</el-button>
                <el-button type="primary" @click="$refs.frameSingleCinema.confirmData(), singleCinemaVisible = false">确
                    定</el-button>
            </div>
        </singleCinema>

        <el-form :inline="true" :model="formData" class="demo-form-inline search-form" size="small">
            <el-form-item label="影院名称：">
                <el-button @click="singleCinemaVisible = true, $refs.frameSingleCinema.listAuthCommCinemas()">
                    {{ cinemaName }}</el-button>
            </el-form-item>
            <el-form-item label="渠道类型：">
                <el-select v-model="formData.channelNature" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in channelNatureOptions" :key="item.keyCode" :label="item.keyName"
                        :value="item.keyCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态：">
                <el-select v-model="formData.status" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in statusOptions" :key="item.keyCode" :label="item.keyName"
                        :value="item.keyCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="渠道名称：">
                <el-input placeholder="请输入渠道名称" v-model="formData.channelName" clearable>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
                <!--<el-button @click="resetFields">重置条件</el-button>-->
            </el-form-item>
        </el-form>

        <el-table :data="tableData" stripe :header-cell-style="{'background': '#F2F4FD'}"
            style="width: 100%; margin-top: 20px">
            <el-table-column label="序号" type="index" width="100">
            </el-table-column>
            <el-table-column prop="code" label="渠道编码" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="name" label="渠道名称" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="nature" label="渠道类型" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.nature === 1 || scope.row.nature === 0">自营渠道</span>
                    <span v-else-if="scope.row.nature === 2">第三方渠道</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.status === 0">启用</span>
                    <span v-else>停用</span>
                </template>
            </el-table-column>
            <el-table-column width="300" fixed="right" label="操作">
                <template slot-scope="scope">
                    <!--                    <el-button style="padding: 0" @click="updateStatus(scope.row.status === 0 ? 1 : 0, scope.row.uid)" type="text" size="small">{{scope.row.status ? '启用' : '停用'}}</el-button>-->
                    <el-button style="padding: 0" @click="setParams(scope.row)" type="text" size="small">设置参数
                    </el-button>
                    <!--                    <el-button style="padding: 0" @click="setAuthorizedCinema(scope.row.uid)" type="text" size="small">卖品网售设置</el-button>-->
                    <el-button style="padding: 0" @click="toParamsDetail(scope.row)" type="text" size="small">查看详情
                    </el-button>

                </template>
            </el-table-column>
        </el-table>

        <div class="page-wrap">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="formData.current" :page-sizes="[20, 40, 60, 80]" :page-size="formData.pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </section>
</template>

<script>
    import singleCinema from "frame_cpm/dialogs/cinemaDialog/singleCinema"

    export default {
        name: "cinema",
        components: {
            singleCinema
        },
        data() {
            return {
                singleCinemaVisible: false,
                singleCinemaType: 2,
                innerData: {
                    id: '',
                },

                cinemaName: '',
                tableData: [],
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
                    cinemaUid: '',
                    channelNature: '',
                    channelName: '',
                    status: '',
                    pageSize: 20,
                    current: 1,
                },
            }
        },
        methods: {

            callBackSingle(data) {
                console.log(data, '-----> data')
                this.formData.cinemaUid = data.data.id
                this.cinemaName = data.data.name
                this.innerData.id = data.data.id

                this.search()
            },

            toParamsDetail(row) {
                this.$router.push({
                    path: '/trade/cinemaChannelDetail',
                    query: {
                        data: row,
                        cinemaUid: this.formData.cinemaUid
                    }
                })
            },

            setParams(row) {
                this.$router.push({
                    path: '/trade/cinemaChannelParam',
                    query: {
                        data: row,
                        cinemaUid: this.formData.cinemaUid
                    }
                })

            },

            updateStatus(status, channelUid) {
                this.$csmList.setChannelStatus({
                    channelUid,
                    status
                }).then(res => {
                    console.log(res)
                    if (res.code === 200) {
                        this.success(res.msg)
                        this.search()
                    } else {
                        this.error(res.msg)
                    }

                })

            },

            search() {
                this.$csmList.getCinemaChannelList(this.formData).then(res => {
                    console.log(res)
                    if (res.code === 200) {
                        this.tableData = res.data.list
                        this.total = res.data.total

                    } else {
                        this.error(res.msg)
                    }

                })
            },

            getUserInfo() {
                this.$ctmList.getUserInfo().then(res => {
                    console.log(res)
                    if (res.code === 200) {
                        this.cinemaName = res.data.cinemaName
                        this.formData.cinemaUid = res.data.cinemaUid
                        this.innerData.id = Number(res.data.cinemaUid)

                        this.search()

                    } else {
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
                this.formData.current = val
                this.search()
            },


        },
        mounted() {
            this.getUserInfo()
        }
    }
</script>

<style lang="scss">
    .cinema {
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

                .el-form-item__label,
                .el-range-input {
                    color: #666;
                    font-size: 12px;
                }

                .el-icon-date,
                .el-range__close-icon {
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

                .el-button+.el-button {
                    margin-left: 8px;
                }
            }

            .el-icon-arrow-left,
            .el-icon-arrow-right {
                cursor: pointer;
            }

            .el-icon-date,
            .el-range__close-icon {
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

            .el-button+.el-button {
                margin-left: 0;
            }
        }

        .el-row-btns {
            padding: 8px 0;
        }
    }
</style>