<!--
示例
tableLabels: [
                { prop: 'batchCode',label: '批次号',width: '250'}, 
                { prop: 'createTime',label: '创建日期',width: '150',
                        hasTemplate:true, #############有需要数据转换的用hasTemplate标记
                        formatRole:(scope) => { #############formatRole做具体转换
                            return formatDate(new Date(scope.row.createTime),'yyyy-MM-dd');
                        }
                }
            ],

tableOptions:{  label:"操作",
                fixed:"right",
                options:[
                    {text:"导出",method:"exportTicketSure"}
                ]
            }

- handleSelectionChange 触发选中回调
- handleButton 触发操作列按钮回调
<commonTable 
:selection="true" 
:tableData="tableData" 
:tableLabels="tableLabels" 
:tableOptions="tableOptions" 
@handleButton="handleButton" 
@handleSelectionChange = "handleSelectionChange">
</commonTable>
-->

<template>
<div class="commonTable">
    <el-table :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange" :height="tableData.length > 10 ? 501 : 46*tableData.length+41">

        <!-- 多选框 -->
        <el-table-column v-if="selection" type="selection" width="100">
        </el-table-column>

        <!-- 数据列 -->
        <template v-for="(item,index) in tableLabels">
            <el-table-column :key="index" v-if="item.hasTemplate" :prop="item.prop?item.prop:''" :label="item.label?item.label:''" :width="item.width?item.width:''" :fixed="item.fixed?item.fixed:false" :sortable="item.sortable?item.sortable:false">

                <template slot-scope="scope" v-if="item.formatRole">
                    <div v-if="item.prop=='approvalResult'&&scope.row.approvalResult==2" style="font-size:12px;color:#739BFF;">
                        {{item.formatRole(scope)}}
                    </div>
                    <div v-else-if="item.prop=='approvalResult'&&scope.row.approvalResult==3" style="font-size:12px;color:#2DBC2D;">
                        {{item.formatRole(scope)}}
                    </div>
                    <div v-else-if="item.prop=='approvalResult'&&scope.row.approvalResult==4" style="font-size:12px;color:#F33430;">
                        {{item.formatRole(scope)}}
                    </div>
                    <template v-else>
                        {{item.formatRole(scope)}}
                    </template>
                </template>
            </el-table-column>
            <el-table-column :key="index" v-else :prop="item.prop?item.prop:''" :label="item.label?item.label:''" :width="item.width?item.width:''" :fixed="item.fixed?item.fixed:false"></el-table-column> -->
        </template>

        <!-- 操作列 -->
        <el-table-column :label="tableOptions.label?tableOptions.label:''" :fixed="tableOptions.fixed?tableOptions.fixed:false" :min-width="tableOptions.width?tableOptions.width:''">
            <template slot-scope="scope">
                <div v-if="tableOptions.options.length<=3">
                    <div v-for="(btn,index) in options" :key="index">
                        <el-button v-if="btn.condition(scope)" type="text" @click="handleButton(btn.method,scope)">{{btn.text}}</el-button>
                    </div>
                </div>
                <div v-else>
                    <span v-for="(btn,index) in options" :key="index">
                        <el-button v-if="btn.condition(scope)"  type="text" @click="handleButton(btn.method,scope)">{{btn.text}}</el-button>
                    </span>
                    <el-dropdown trigger="click" @command="handleCommand" >
                        <span class="el-dropdown-link">
                            更多<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <template v-for="(op,index) in moreOptions">
                                <el-dropdown-item v-if="op.condition(scope)" :key='index' :command="composeValue(op,scope)">{{op.text}}</el-dropdown-item>
                            </template>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>

            </template>
        </el-table-column>
    </el-table>
</div>
</template>

<script>
export default {
    name: 'commonTable',
    props: {
        /* 表格数据 */
        tableData: {
            required: true,
            type: Array,
            default: []
        },
        /* 数据列 */
        tableLabels: {
            required: true,
            type: Array,
            default: []
        },
        /* 操作列 */
        tableOptions: {
            required: true,
            type: Object,
            default: {}
        },
        /* 是否可以多选 */
        selection: {
            required: false,
            type: Boolean,
            default: false
        }

    },
    data() {
        return {
            options: [],
            moreOptions: []
        }
    },
    created() {
        console.log("this.tableOptions.options",this.tableOptions.options)
        this.handleMoreOptions()
    },
    methods: {
        //加载更多
        handleMoreOptions(){
            if (this.tableOptions && this.tableOptions.options) {
                if (this.tableOptions.options.length > 4) {
                    this.options = this.tableOptions.options.slice(0, 4);
                    this.moreOptions = this.tableOptions.options.slice(4, this.tableOptions.options.length);
                } else {
                    this.options = this.tableOptions.options;
                }
            }
        },
        handleButton(method, scope) {
            this.$emit('handleButton', {
                method: method,
                scope: scope
            });
        },
        handleSelectionChange(selectedValue) {
            this.$emit('handleSelectionChange', selectedValue);
        },
        handleCommand(command) {
            this.$emit('handleButton', {
                method: command.method,
                scope: command.scope
            });
        },
        composeValue(item, scope) {
            return {
                'method': item.method,
                'scope': scope
            }
        }
    }

}
</script>
<style lang="scss" scoped>
    /deep/.commonTable{
        .el-table__fixed-right-patch{
            background: #e7ebff !important;
        }
    }
    .el-dropdown-menu__item{
        font-size: 12px;
        color: #3B74FF;
    }
    .el-select-dropdown__item{
        font-size: 12px !important;
    }
    .primary {
        color: #409EFF;
    }
    .success {
        color: #67C23A;
    }
    .danger {
        color: #F56C6C;
    }
    .warning {
        color: #FEC107;
    }
</style>
