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
    <el-table :data="tableData" stripe border style="width: 100%" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName">

      <!-- 多选框 -->
      <el-table-column v-if="selection" type="selection" width="100">
      </el-table-column>

      <!-- 数据列 -->

      <template v-for="(item,index) in tableLabels">
        <el-table-column :key="index" v-if="item.hasTemplate" :prop="item.prop?item.prop:''" :label="item.label?item.label:''" :width="item.width?item.width:''" :fixed="item.fixed?item.fixed:false" :sortable="item.sortable?item.sortable:false">
          <template slot-scope="scope" v-if="item.formatRole">
            <template v-if="item.prop=='processList'">
              <!-- 审批流程 -->
              <span style="font-size: 12px;color: #333333;float: left;">开始</span>
              <span class="line" style="">
                <span class="line-content"></span>
              </span>
              <template v-for="(items,indexs) in scope.row.processList">
                <span :key="indexs">
                  <span class="round">
                    <span class="round-number">{{indexs+1}}</span>
                  </span>
                  <span class="line">
                    <span class="line-content"></span>
                  </span>
                </span>
              </template>
              <span style="font-size: 12px;color: #333333;float: left;">结束</span>
            </template>
            <template v-else>
              <!-- 颜色 -->
              <div v-if="item.prop=='statusRespons'&&scope.row.statusRespons==1" style="font-size:12px;color:#739BFF;">
                {{item.formatRole(scope)}}
              </div>
              <div v-else-if="item.prop=='statusRespons'&&scope.row.statusRespons==2" style="font-size:12px;color:#2DBC2D;">
                {{item.formatRole(scope)}}
              </div>
              <div v-else-if="item.prop=='statusRespons'&&scope.row.statusRespons==3" style="font-size:12px;color:#F33430;">
                {{item.formatRole(scope)}}
              </div>
              <template v-else>
                {{item.formatRole(scope)}}
              </template>
            </template>
          </template>

        </el-table-column>
        <el-table-column :key="index" v-else :prop="item.prop?item.prop:''" :label="item.label?item.label:''" :width="item.width?item.width:''" :fixed="item.fixed?item.fixed:false"></el-table-column>
      </template>

      <!-- 操作列 -->
      <el-table-column :label="tableOptions.label?tableOptions.label:''" :fixed="tableOptions.fixed?tableOptions.fixed:false" :width="tableOptions.width?tableOptions.width:''">
        <template slot-scope="scope">
          <div v-if="tableOptions.options.length<=3">
            <span v-for="(btn,index) in options" :key="index">
              <el-button v-if="btn.condition(scope)" type="text" @click="handleButton(btn.method,scope)">{{btn.text}}</el-button>
            </span>
          </div>
          <div v-else>
            <span v-for="(btn,index) in options" :key="index">
              <el-button v-if="btn.condition(scope)" type="text" @click="handleButton(btn.method,scope)">{{btn.text}}</el-button>
            </span>
            <el-dropdown trigger="click" @command="handleCommand">
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
  components: {},
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
  data () {
    return {
      options: [],
      moreOptions: [],
    }
  },
  created () {
    if (this.tableOptions && this.tableOptions.options) {
      if (this.tableOptions.options.length > 4) {
        this.options = this.tableOptions.options.slice(0, 4);
        this.moreOptions = this.tableOptions.options.slice(4, this.tableOptions.options.length);
      } else {
        this.options = this.tableOptions.options;
      }
    }
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex / 2 === 0) {
        return 'success-row';
      } else {
        return '';
      }

    },
    handleButton (method, scope) {
      this.$emit('handleButton', { method: method, scope: scope });
    },
    handleSelectionChange (selectedValue) {
      this.$emit('handleSelectionChange', selectedValue);
    },
    handleCommand (command) {
      this.$emit('handleButton', { method: command.method, scope: command.scope });
    },
    composeValue (item, scope) {
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
.button {
  display: inline-block;
}
.round {
  border-radius: 50%;
  height: 20px;
  width: 20px;
  display: inline-block;
  vertical-align: top;
  border: 2px solid #bcbcbc;
  float: left;
  .round-number {
    display: block;
    color: #bcbcbc;
    height: 20px;
    line-height: 20px;
    text-align: center;
    font-size: 12px;
    font-weight: bold;
    margin-top: -1px;
    margin-left: -1px;
  }
}
.line {
  font-size: 12px;
  color: #bcbcbc;
  margin: 0 8px;
  float: left;
  .line-content {
    margin: 11px 0px;
    display: block;
    width: 40px;
    height: 1px;
    background-color: #bcbcbc;
  }
}
</style>