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
    <div>
        <el-table :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange"  :row-class-name="tableRowClassName">

            <!-- 多选框 -->
            <el-table-column  v-if="selection"
                    type="selection"
                    width="100">
            </el-table-column>

            <!-- 数据列 -->
            
            <template v-for="(item,index) in tableLabels" >
                <el-table-column :key="index" v-if="item.hasTemplate" 
                :prop="item.prop?item.prop:''" 
                :label="item.label?item.label:''" 
                :width="item.width?item.width:''" 
                :fixed="item.fixed?item.fixed:''"
                :sortable ="item.sortable?item.sortable:false">
                    <template slot-scope="scope" v-if="item.formatRole">
                        <template  v-if="item.prop=='processList'">
                            <el-steps :space="100"  align-center>
                                <el-step :title="''+(indexs+1)" v-for="(items,indexs) in scope.row.processList"></el-step>
                            </el-steps>
                        </template>
                        <template  v-else>
                            {{item.formatRole(scope)}}
                        </template>
                    </template>
                   
                     
                </el-table-column>
                <el-table-column :key="index" v-else :prop="item.prop?item.prop:''" :label="item.label?item.label:''" :width="item.width?item.width:''" :fixed="item.fixed?item.fixed:''"></el-table-column>
            </template>

            <!-- 操作列 -->
            <el-table-column  :label="tableOptions.label?tableOptions.label:''"  :fixed="tableOptions.fixed?tableOptions.fixed:''">
                <template slot-scope="scope">
                    <div v-if="tableOptions.options.length<=3">
                        <span v-for="(btn,index) in options" :key="index">
                            <el-button v-if="btn.condition(scope)"  type="text" @click="handleButton(btn.method,scope)">{{btn.text}}</el-button>
                            <!-- <check class="button" v-if="btn.condition(scope)" :contentText="btn.text"></check> -->
                        </span>
                    </div>
                    <div v-else>
                        <span v-for="(btn,index) in options" :key="index">
                            <el-button v-if="btn.condition(scope)"  type="text" @click="handleButton(btn.method,scope)">{{btn.text}}</el-button>
                        </span>
                        <el-dropdown trigger="click" @command="handleCommand">
                            <span class="el-dropdown-link">
                                更多<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown" >
                                <el-dropdown-item v-for="(op,index) in moreOptions" v-if="op.condition(scope)" :key='index'  :command="composeValue(op,scope)">{{op.text}}</el-dropdown-item>
                            </el-dropdown-menu>                            
                        </el-dropdown>
                    </div>
                    
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
import check from "../../views/workflow/normalApproval/check"
export default {
    name:'commonTable',
    components:{
        check
    },
    props: {
        /* 表格数据 */
        tableData: { 
            required: true,
            type: Array,
            default:[]
        },
        /* 数据列 */
        tableLabels: {
            required: true,
            type: Array,
            default:[]
        },
        /* 操作列 */
        tableOptions: { 
            required: true,
            type: Object,
            default:{}
        },
         /* 是否可以多选 */
        selection:{ 
            required: false,
            type: Boolean,
            default:false
        }
        
    },
    data() {
        return {
            options:[],
            moreOptions:[],
        }
    },
    created() {
        if(this.tableOptions && this.tableOptions.options){
            if(this.tableOptions.options.length>4){
                this.options = this.tableOptions.options.slice(0,4);
                this.moreOptions = this.tableOptions.options.slice(4,this.tableOptions.options.length);
            }else{
                this.options = this.tableOptions.options;
            }
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            if (rowIndex/2 === 0) {
                return 'success-row';
            } else{
                return '';
            }
            
        },
        handleButton(method,scope){
            this.$emit('handleButton',{method:method,scope:scope});
        },
        handleSelectionChange(selectedValue){
            this.$emit('handleSelectionChange',selectedValue);
        },
        handleCommand(command){
            this.$emit('handleButton',{method:command.method,scope:command.scope});
        },
        composeValue(item,scope) {
            return {
                'method': item.method,
                'scope': scope
            }
        }
    }

}
</script>

<style lang="scss" scoped>
  .el-table .success-row {
    background: #f0f9eb;
  }
  .button{
      display: inline-block;
  }
</style>