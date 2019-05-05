<template>
<div>
    <!-- 选择创建单位 -->
    <el-dialog
      title="选择创建单位"
      :close-on-click-modal="false"
      width="45%"
      :visible.sync="chooseUnitShow">
      <!-- 查询块 -->
      <el-form :inline="true" :model="dataForm">
        <span>组织名称：</span>
        <el-form-item style="margin-top: -6px;">
          <el-input v-model="dataForm.name" placeholder="请输入您要查询的内容" clearable></el-input>
        </el-form-item>
        <el-form-item style="margin-top: -6px;">
          <el-button type="primary" @click="getSearch()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-tree
        :data="unitList"
        :props="unitListTreeProps"
        ref="unitListTree"
        :default-expand-all="true"
        :expand-on-click-node="false"
        highlight-current
        :filter-node-method="filterNode"
        @node-click="handleClick">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="chooseUnitSubmit()">确定</el-button>
        <el-button @click="chooseUnitShow = false">返回</el-button>
      </span>
    </el-dialog>
</div>
</template>
<script>
  export default {
    data () {
      return {
        chooseUnitShow: false,
        dataForm: {
          name: ''
        },
        unitName:'',
        unitList: [
          {
            id: 1,
            name: '总部',
            children: [{
              id: 2,
              name: '华南区'
            },
            {
              id: 3,
              name: '华北区',
              children: [{
                id: 5,
                name: '小白影院'
              }]
            },
            {
              id: 4,
              name: '华东区',
              children: [{
                id: 6,
                name: '佛山南海X影院2'
              }]
            }]
          }
        ],
        unitListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    created() {
      // this.getDataList()
    },
    watch: {
      'dataForm.name' (val) {
        this.$refs.unitListTree.filter(val);
      }
    },
    methods: {
      init () {
        this.chooseUnitShow = true
      },
      // 单位搜索
      getSearch () {
        this.filterNode()
      },
      filterNode(value, data, node) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      handleClick (data) {
        console.log(data)
        this.unitName = data.name
      },
      // 表单提交
      chooseUnitSubmit () {
        this.chooseUnitShow = false
        this.$emit("returnUnit", this.unitName)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-table{
    margin-bottom: 20px;
  }
  .el-dialog__body{
    .el-form-item{
      margin-top: -12px !important;
    }
  }
</style>
