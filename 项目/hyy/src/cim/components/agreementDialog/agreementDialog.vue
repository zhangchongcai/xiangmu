<template>
    <div>
        <el-dialog class="agreement-dialog" :width="multiple?'950px': '950px'" :title="title"
                   :visible.sync="channelDialog"
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
                            <el-table-column type="selection" width="40" reserve-selection v-if="!check"
                                             :selectable="selectable"></el-table-column>
                            <el-table-column
                                    v-for="item in tableColumn"
                                    :key="item.key"
                                    :prop="item.key"
                                    :label="item.label"
                                    :width="item.width"
                                    :formatter="item.formatter"
                            ></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="{row}">
                                    <el-button type="text" size="small" @click.stop="handleOperateEvent('1', row)">查看
                                    </el-button>
                                </template>
                            </el-table-column>
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
        <el-dialog
                class="agreement-dialog"
                title="查看采购协议"
                :visible.sync="checkProtocolDialog"
                width="800px">
            <el-form
                    :inline="true"
                    ref="ruleForm"
                    label-position="left"
                    label-suffix="："
            >
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="协议编码">
                            <span>{{agreementDetail.code}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="协议名称">
                            <span>{{agreementDetail.name}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="状态">
                            <span>{{agreementDetail.status == 1 ? '启用':'停用'}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="供应商">
                            <span>{{agreementDetail.supName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="协议类型">
                            <span>采购协议</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="附件">
                            <a target="_Blank" :href="agreementDetail.fileUrl" :download="agreementDetail.fileName"
                               v-if="agreementDetail.fileName">
                                <!--                                <span>点击下载: </span>-->
                                <span class="download">{{agreementDetail.fileName}}</span>
                            </a>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="有效期">
                            <span>{{agreementDetail.effectiveStr}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-table :data="agreementDetail.agreementDetailList" stripe>
                    <el-table-column
                            v-for="item in agreementDetailTableColumn"
                            :key="item.key"
                            :prop="item.key"
                            :label="item.label"
                            :formatter="item.formatter"
                    >
                    </el-table-column>
                </el-table>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="checkProtocolDialog = false">关 闭</el-button>
              </span>
        </el-dialog>
    </div>

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
                        key: "effectiveStr",
                        width:165
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
                // 表格表头
                agreementDetailTableColumn: [
                    {
                        label: "商品名称",
                        key: "skuName"
                    },
                    {
                        label: "SKU编码",
                        key: "skuCode"
                    },
                    {
                        label: "商品规格",
                        key: "merSpec"
                    },
                    {
                        label: "采购单位",
                        key: "purUnitName",
                    },
                    {
                        label: "采购成本(元)",
                        key: "purCostPrice",
                    },
                    {
                        label: "税率(%)",
                        key: "taxRate",
                    }
                ],
                checkProtocolDialog: false,
                agreementDetail: {},
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
                this.getAgreementList(this.queryData, "open");
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
            },
            handleOperateEvent(type, row) {
                console.log(row)
                switch (type) {
                    case "1":
                        // 查看
                        this.checkProtocolDialog = true;
                        this.purchaseGet({uid: row.uid})
                        break;
                }
            },
            // 查看协议单
            purchaseGet(param) {
                this.$cimList.procurement.agreementGet(param).then(resData => {
                    if (resData.code == 200) {
                        this.agreementDetail = resData.data;
                    }
                });
            },
            jumpPage(param = {}) {
                // this.$router.push({
                //     path: "/retail/procurement/purchaseProtocol/common",
                //     query: param,
                // });
            },
            selectable(row) {
                if (row.status == 0) {
                    return false
                } else {
                    return true
                }
            }
        },
        mounted() {
        }
    };
</script>

<style lang="scss">
    .agreement-dialog {
        .el-dialog__body{
            .download {
                color: #3B74FF;
            }
            .el-form-item{
                margin-bottom: 10px;
            }
        }
        .query-btn{
            margin-top: 5px;
        }
    }
</style>