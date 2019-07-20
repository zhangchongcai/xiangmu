<template>
<div class="auditView">
    <el-form :model="dataForm" label-width="200px" class="common-form">
      <el-form-item label="任务编号：">
        <!-- <el-input v-model="dataForm.activityName"></el-input> -->
        <span class="span-text">{{dataForm.activityName}}123</span>
      </el-form-item>
      <el-form-item label="创建时间：">
        <span class="span-text">{{dataForm.activityName}}123</span>
      </el-form-item>
      <el-form-item label="审批状态：">
        <span class="span-text">{{dataForm.activityName}}123</span>
      </el-form-item>
      <el-form-item label="单据类型：">
        <span class="span-text">{{dataForm.activityName}}123</span>
      </el-form-item>
      <el-form-item label="申请人：">
        <span class="span-text">{{dataForm.activityName}}123</span>
      </el-form-item>
      <el-form-item label="申请人单位：">
        <span class="span-text">{{dataForm.activityName}}123</span>
      </el-form-item>
      <el-form-item label="业务单据号：">
        <span class="span-text">{{dataForm.activityName}}123</span>
      </el-form-item>
      <el-form-item label="单据名称：">
        <span class="span-text">{{dataForm.activityName}}123</span>
      </el-form-item>
      <el-form-item style="margin-left:100px;">
        <el-button @click='returnList()'>返回</el-button>
      </el-form-item>
    </el-form>
</div>
</template>
<script>
  export default {
    components: {},
    data () {
      return {
        dataForm: {

        }
      }
    },
    created() {
    },
    methods: {
      init () {
        // this.$cmmList.marketingAuditView().then( data => {
        //     console.log(data)
        //     if (data && data.code === 200) {
        //       this.dataForm = data.data
        //     } else {
        //       this.$message.error(data.msg)
        //     }

        // }).catch( err => {
        //     console.log(err)
        // })
      },
      returnList () {
        this.$emit('refreshDataList')
      }
    }
  }
</script>

<style lang="scss" scoped>
.auditView{
  .breadcrumb {
    margin: 30px 0 50px 30px;
  }
  .el-input{
    .el-input.el-input--suffix{
      width: 100%;
    }
  }
  .span-text{
    font-size: 14px;
    color: #808080;
  }
}
</style>
