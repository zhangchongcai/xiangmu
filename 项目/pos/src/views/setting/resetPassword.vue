<template>
  <div class="innerlayer">
    <div class="content">
      <el-form ref="query" class="queryForm" :model="query" label-width="115px">
        <el-form-item label="会员卡/手机号：">
          <div :style="{width:'33vw',marginRight:'10px',display:'inline-block',position:'relative'}">
            <el-input v-model="query.number" size="medium" ></el-input>
            <div class="inputTip">
              <span>*</span>录入完成请按回车键
            </div>
          </div>
          <el-button type="primary"  size="medium" @click="dialogVisible=true">读卡</el-button>
          <el-button size="medium" @click="test">高级查询</el-button>
        </el-form-item>
      </el-form>
      <h1>会员资料</h1>
      <el-form ref="query" :model="query" class="dataForm" label-width="100px">
        <el-form-item label="姓名：" label-width="55px">
          <div class="text">张三</div>
        </el-form-item>
        <el-form-item label="身份证号：">
          <div class="text">44022919949404154</div>
        </el-form-item>
        <el-form-item label="手机号码：">
          <div class="text">18011972208</div>
        </el-form-item>
        <el-form-item label="生日：" label-width="55px">
          <div class="text">1990-10-10</div>
        </el-form-item>
        <el-form-item label="电子邮箱：">
          <div class="text">1042593640@qq.com</div>
        </el-form-item>
        <el-form-item label="性别：" >
          <div class="text">女</div>
        </el-form-item>
      </el-form>
      <h1>修改密码</h1>
      <el-form ref="query" :model="query" label-width="96px">
        <el-form-item label="新消费密码：">
          <div :style="{width:'23.4vw',marginRight:'10px',display:'inline-block',position:'relative'}">
            <el-input v-model="query.number" placeholder="等待输入密码" size="medium" ></el-input>
          </div>
          <el-button size="medium">启动密码输入</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="footButtomLayer">
      <el-button size="medium" @click="$router.go(-1)">返回</el-button>
      <el-button size="medium" type="primary" >确定</el-button>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="42%"
      :show-close="false"
      :before-close="handleClose">
      <div class="doalogCanten">
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="'#icondengdaikehushurumima'"></use>
        </svg>
        <div @click="dialogVisible=false">等待客户输入密码......</div>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { testApi } from  'http/apis';
export default {
 
  data(){
    return{
      query:{
        number:''
      },
      data:{
        sex:'1',
        
      },
      dialogVisible:false,
    }
  },
  methods:{
     handleClose(done) {
      return
      done();
    },
    async test(){
      const data = await testApi({a:1})
    }
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
.inputTip{
  position: absolute;
  font-size: 12px;
  color:#666;
  span{
    color:#F33430 
  }
}
.queryForm{
  margin-bottom: 5vh;
}
.doalogCanten{
  text-align: center;
  .icon{
    font-size: 6vw;
  }
  div{
    margin:2.5vh 0;
    font-size: 1.3vw;
  }
}
</style>


 

