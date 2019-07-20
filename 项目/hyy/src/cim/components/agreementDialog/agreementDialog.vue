<template>
    <el-dialog class="agreement-dialog" :width="multiple?'950px': '950px'" :title="title" :visible.sync="channelDialog"
               @open="openCallBack">
        <el-form
                :inline="true"
                :model="queryData"
                label-position="left"
                label-width="80px"
                label-suffix=":"
        >
            <el-form-item label="协议编码">
                <el-input v-model="queryData.code" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="协议名称">
                <el-input v-model="queryData.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="供应商名称">
                <el-input v-model="queryData.supName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="有效期">
                <el-date-picker
                        class="basic-input"
                        v-model="queryData.billTimeTotal"
                        type="daterange"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="queryData.status">
                    <el-option label="全部" value></el-option>
                    <el-option label="有效" value="1"></el-option>
                    <el-option label="无效" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-button @click="handleQuery" class="query-btn" type="primary">搜索</el-button>
        </el-form>
        <el-row>
            <el-col :span="multiple ? 18 : 24">
                <div class="table-box">
                    <el-table
                            ref="channelTable"
                            :data="tableData"
                            row-key="uid"
                            height="300"
                            v-loading="tableLoding"
                            @selection-change="handleSelectionchannel"
                            stripe
                            empty-text="暂无记录"
                    >
                        <el-table-column type="selection" width="40" reserve-selection v-if="!check"></el-table-column>
                        <el-table-column
                                v-for="item in tableColumn"
                                :key="item.key"
                                :prop="item.key"
                                :label="item.label"
                                :formatter="item.formatter"
                        ></el-table-column>
                    </el-table>
                    <div class="page-wrap">
                        <el-pagination
                                background
                                :current-page="queryData.page"
                                :page-size="queryData.pageSize"
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :total="total"
                                layout="total, prev, pager, next, jumper"
                        ></el-pagination>
                    </div>
                </div>
            </el-col>
            <el-col :span="6" v-if="multiple">
                <div class="empty-box">
                    <div class="clearfix">
                        <span class="selected-content left">已选内容</span>
                        <el-button type="text" class="right" @click="handleEmptyMaterials">清 空</el-button>
                    </div>
                    <ul class="empty-content">
                        <li :key="item.merCode" v-for="(item) in selectedData" class="clearfix">
                            <span class="left title">{{item.channelName || item.name}}</span>
                            <i class="el-icon-close right" @click="deleteSelected(item,false)"></i>
                        </li>
                    </ul>
                </div>
            </el-col>
        </el-row>
        <span slot="footer">
      <div v-if="check">
          <el-button @click="handleDialog(false)">关 闭</el-button>
       </div>
      <div v-else>
         <el-button type="primary" @click="handleSubmit">确 定</el-button>
         <el-button @click="handleDialog(false)">取 消</el-button>
      </div>
    </span>
    </el-dialog>
</template>

<script>
    export default {
        props: {
            //标题
            title: {
                type: String,
                default: "选择采购协议"
            },
            //是否多选
            multiple: {
                type: Boolean,
                default: false
            },
            //查看
            check: {
                type: Boolean,
                default: false
            },
            cinemaUid: {
                type: String,
                default: '',
            },
            // 回选数据
            dialogFeedbackData: {
                type: [Array],
                default: () => []
            },
        },
        data() {
            return {
                channelDialog: false,
                //采购协议弹窗查询数据
                queryData: {
                    code: "", //协议单号
                    name: "", //协议名称
                    supName: "", //供应商名称
                    billTimeTotal: [],
                    status: '',
                    page: 1,
                    pageSize: 10
                },

                channelTotal: 0,
                selectedData: [],
                tableColumn: [
                    {
                        label: "协议编码",
                        key: "code"
                    },
                    {
                        label: "协议名称",
                        key: "name"
                    },
                    {
                        label: "供应商名称",
                        key: "supName"
                    },
                    {
                        label: "有效期",
                        key: "effectiveStr"
                    },
                    {
                        label: "状态",
                        key: "status",
                        formatter(row, column, cellValue) {
                            let result = "";
                            switch (row.status) {
                                case 1:
                                    result = "有效";
                                    break;
                                case 0:
                                    result = "无效";
                                    break;
                                    break;
                            }
                            return result;
                        }
                    },
                ],
                tableLoding: false,
                tableData: [],
                total: 0,
            };
        },
        created() {

        },
        mounted() {


        },
        methods: {
            init() {
                console.log(this.dialogFeedbackData)
                this.queryData.page = 1;
                if (this.check) {
                    this.tableData = this.dialogFeedbackData.slice(this.queryData.page - 1, this.queryData.pageSize);
                    this.total = this.dialogFeedbackData.length;
                } else {
                    this.getAgreementList(this.queryData, "open");
                }

            },
            openCallBack() {
                this.init();
            },
            handleDialog(flag) {
                this.channelDialog = flag;
            },
            // 查询
            getAgreementList(param) {
                this.tableLoding = true;
                this.$cimList.procurement
                    .agreementQueryPage(param)
                    .then(resData => {
                        if (resData.code == 200) {
                            this.tableData = resData.data.list;
                            this.total = resData.data.total;
                        }
                        this.tableLoding = false;
                    })
                    .catch(() => {
                        this.tableLoding = false;
                    });
            },
            //弹窗搜索
            handleQuery() {
                if (this.queryData.billTimeTotal.length > 0) {
                    this.queryData.beginTime = this.queryData.billTimeTotal[0];
                    this.queryData.finishTime = this.queryData.billTimeTotal[1];
                } else {
                    this.queryData.beginTime = '';
                    this.queryData.finishTime = ''
                }
                this.getAgreementList(this.queryData);
            },
            //采购协议弹窗选择确定
            handleSubmit() {
                this.$emit("onSumit", this.selectedData);
                this.handleDialog(false);
            },
            //选中采购协议
            handleSelectionchannel(rows) {
                console.log("选中采购协议", rows)
                this.selectedData = rows;
                //不是多选
                if (!this.multiple) {
                    if (this.selectedData.length > 1) {
                        this.$refs.channelTable.toggleRowSelection(
                            this.selectedData[0]
                        );
                    }
                } else {
                }
            },
            //去重(根据uid相同，避免数据问题)
            unRepeat(arr) {
                let hash = {};
                return arr.reduce((item, next) => {
                    if (!hash[next.uid]) {
                        hash[next.uid] = true;
                        item.push(next);
                    }
                    return item;
                }, []);
            },
            //删除选择
            deleteSelected(row, flag) {
                console.log(row)
                this.$refs.channelTable.toggleRowSelection(row, false);
            },
            // 清空选择
            handleEmptyMaterials() {
                this.$refs.channelTable.clearSelection();
            },
            handleSizeChange(val) {
                this.queryData.pageSize = val;
                if (this.check) {
                    this.tableData = this.dialogFeedbackData.slice(0, this.queryData.pageSize);
                } else {
                    this.getAgreementList(this.queryData);
                }
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.queryData.page = val;
                if (this.check) {
                    let pageNum = (this.queryData.page - 1) * this.queryData.pageSize;
                    this.tableData = this.dialogFeedbackData.slice(pageNum, pageNum + this.queryData.pageSize);
                } else {
                    this.getAgreementList(this.queryData);
                }
                console.log(`当前页: ${val}`);
            }
        },
        mounted() {
        }
    };
</script>

<style lang="scss">
    .agreement-dialog {
    }
</style>