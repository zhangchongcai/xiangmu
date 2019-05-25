<template>
  <div class="innerlayer">
    <div class="content">
      <el-form ref="query" :model="query" class="queryForm" label-width="115px">
        <el-form-item label="会员卡/手机号：">
          <el-input v-model="query.number" size="medium" :style="{width:'33vw',marginRight:'10px'}"></el-input>
          <el-button type="primary"  size="medium">读卡</el-button>
          <el-button size="medium">高级查询</el-button>
          <el-button size="medium">启动密码输入</el-button>
        </el-form-item>
      </el-form>
      <h1>会员资料</h1>
      <el-form ref="query" :model="query" class="dataForm" label-width="100px">
        <el-form-item label="姓名：" label-width="55px">
          <el-input v-model="query.number" size="medium" :style="{width:'17.7vw'}"></el-input>
        </el-form-item>
        <el-form-item label="身份证号：">
          <el-input v-model="query.number" size="medium" :style="{width:'17.7vw'}"></el-input>
        </el-form-item>
        <el-form-item label="手机号码："
        :rules="[
                { required: true, message: '请输入手机号码', trigger: 'change' },
              ]">
          <el-input v-model="query.number" size="medium" :style="{width:'17.7vw'}"></el-input>
        </el-form-item>
        <el-form-item label="生日：" label-width="55px">
          <el-input v-model="query.number" size="medium" :style="{width:'17.7vw'}"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱：">
          <el-input v-model="query.number" size="medium" :style="{width:'17.7vw'}"></el-input>
        </el-form-item>
        <el-form-item label="性别：" 
        :rules="[
                { required: true, message: '请选择性别', trigger: 'change' },
              ]">
          <el-radio v-model="data.sex" label="1">男</el-radio>
          <el-radio v-model="data.sex" label="2">女</el-radio>
        </el-form-item>
      </el-form>
    </div>
    <div class="footButtomLayer">
      <el-button size="medium" @click="$router.go(-1)">返回</el-button>
      <el-button size="medium" type="primary" >确定</el-button>
    </div>
  </div>
</template>
<script>
export default {
 
  data(){
    return{
      query:{
        number:''
      },
      data:{
        sex:'1',
      }
    }
  },
  methods:{
    
  }
}
</script>

<style lang="scss" scoped>
.innerlayer{
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  .content{
    h1{
      margin-bottom: 22px;
    }
    .dataForm{
        display: flex;
        flex-wrap: wrap;
      .el-form-item{
        width: 33%;
      }
    }
  }
}
.content{
  flex: 1
}
.footButtomLayer{
  padding: 1.3vh 0;
  text-align: right;
}
.queryForm{
  margin-bottom: 5vh;
}
</style>


 

