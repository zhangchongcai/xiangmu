<template>
  <el-dialog
    title="操作提示"
    :visible.sync="dialogVisible"
    width="30%">
    <div class="alertBody">
      <div class="alertBodyLeft">
        <i class="iconfont icontishigantanhao"></i>
      </div>
      <div class="info">{{info}}</div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name:'alert',
  data(){
    return{
      dialogVisible:true,
      info:''
    }
  }
}
</script>
<style lang="scss" scoped>
.alertBody{
  display: flex;
  align-items: flex-start;
  .alertBodyLeft{
    width: 28px;
    position: relative;
    i{
      position: absolute;
      color: #3B74FF;
      font-size: 28px;
      top: -6px;
    }
  }
  .info{
    line-height: 20px;
    font-size: 13px;
    flex: 1;
  }
}
  
  
</style>

