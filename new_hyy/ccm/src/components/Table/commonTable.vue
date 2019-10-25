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
    <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange">

      <!-- 多选框 -->
      <el-table-column v-if="selection" type="selection" width="100">
      </el-table-column>

      <!-- 数据列 -->
      <template v-for="(item,index) in tableLabels">
        <el-table-column :key="index" v-if="item.hasTemplate" :prop="item.prop?item.prop:''" :label="item.label?item.label:''" :width="item.width?item.width:''" :fixed="item.fixed?item.fixed:''" :sortable="item.sortable?item.sortable:false">

          <template slot-scope="scope">
            {{item.formatRole(scope)}}
          </template>
        </el-table-column>
        <el-table-column :key="index" v-else :prop="item.prop?item.prop:''" :label="item.label?item.label:''" :width="item.width?item.width:''" :fixed="item.fixed?item.fixed:''"></el-table-column> -->
      </template>

      <!-- 操作列 -->
      <el-table-column :label="tableOptions.label?tableOptions.label:''" :fixed="tableOptions.fixed?tableOptions.fixed:''">
        <template slot-scope="scope">
          <el-button v-for="(btn,index) in tableOptions.options" :key="index" type="text" @click="handleButton(btn.method,scope)">{{btn.text}}</el-button>
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
  data () {
    return {

    };
  },
  created () {

  },
  methods: {
    handleButton (method, scope) {
      this.$emit('handleButton', { method: method, scope: scope });
    },
    handleSelectionChange (selectedValue) {
      this.$emit('handleSelectionChange', selectedValue);
    }
  }

};
</script>
