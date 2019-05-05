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
          <div>张三</div>
        </el-form-item>
        <el-form-item label="会员等级：">
          <div>金卡</div>
        </el-form-item>
        <el-form-item label="积分余额：">
          <div>3100</div>
        </el-form-item>
        <el-form-item label="账户余额：" label-width="82px" :style="{ width:'100%' }">
          <div>500元<span :style="{color:'#999999',marginLeft:'10px'}">(基本余额450.00元 赠送余额:50.00元)</span></div>
        </el-form-item>
      </el-form>
      <h1>补发新卡</h1>
      <el-form ref="query" :model="query" class="Form" label-width="97px">
        <el-form-item label="新会员卡号：" >
          <el-input v-model="query.number" size="medium" :style="{width:'23vw'}"></el-input>
          <el-button size="medium"  class="innerButton">读卡</el-button>
        </el-form-item>
        <el-form-item label="新消费密码：">
          <el-input v-model="query.number" size="medium" :style="{width:'23vw'}"></el-input>
          <el-button size="medium"  >启动密码输入</el-button>
        </el-form-item>
        <el-form-item label="补卡工本费：">
          <el-input v-model="query.number" size="medium" :style="{width:'23vw'}"></el-input>
          <el-button size="medium"  class="innerButton">授权修改</el-button>
        </el-form-item>
        <el-form-item label="账户余额："  :style="{ width:'100%' }">
          <el-radio v-model="type" label="1">现金</el-radio>
          <el-radio v-model="type" label="2">银行卡</el-radio>
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
        
      },
      type:'1',
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
    .Form{
      display: flex;
      flex-wrap: wrap;
      .el-form-item{
        width: 50%;
        button{
          margin-left: 1vw;
        }
        .innerButton{
          width: 6.1vw;
          box-sizing: border-box;
          padding: 10px 0;
          text-align: center;
        }
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


 

