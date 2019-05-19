<template>
  <div>
    <div class="pageTitle">充值</div>
    <div class="contentLayer">
      <div class="queryDateForm">
        <label :style="{color:'#666666'}">会员卡/手机号：</label>
        <div class="fromInput" :style="{width:'34.5vw'}">
          <el-input  type="text" placeholder="请扫描或输入影票编号/订单编号/取货码/票券编号" size="medium" width="34.5vw" @keyup.enter.native="alert(1)"></el-input>
          <div class="tip">
            <span :style="{color:'red'}">*</span><span :style="{fontSize:'12px',color:'#666666'}">录入完成请按回车键</span> 
          </div>
        </div>
        <el-button size="medium" type="primary" @click="dialogOpen('1')">读卡</el-button>
        <el-button size="medium" @click="dialogOpen('2')">高级查询</el-button>
      </div>
      <div class="orderLayer">
        <h1>订单信息</h1>
        <ul>
          <li><span>姓名：</span>张三</li>
          <li><span>会员等级：</span>金卡</li>
          <li>
            <span>账户余额：</span>500元
            <div class="tip">(基本余额450.00元 赠送余额:50.00元)</div>
          </li>
          <li><span>积分余额：</span>3200分</li>
          <li><span>注册商户：</span>测试影院</li>
        </ul>
      </div>
      <h1 :style="{marginTop:'3vh'}">会员充值</h1>
      <div class="vipRecharge">
        <activity v-model="multipleSelection"  label="冲100送5元"  infoText="这是一些text" :value="'1'" :style="{width:'25.3vw'}"></activity>
        <activity v-model="multipleSelection" label="冲100送5元"  infoText="这是一些text" :value="'2'" :style="{width:'25.3vw'}"></activity> 
        <activity v-model="multipleSelection" label="冲100送5元"  infoText="这是一些text" :value="'3'" :style="{width:'25.3vw'}"></activity>
        <el-button size="medium" :style="{marginLeft:'1vw'}" @click="visible = true">更多</el-button>   
      </div>
      <div class="priceTime">不参与活动，其他充值金额：</div>
      <div class="proceLayer">
        <div class="priceInput"><el-input v-model="price" size="medium" type="text"></el-input></div>
        <div class="priceInput" :style="{color:'#666'}">元</div>
        <div class="priceInput" :style="{marginLeft:'2vw'}">
          <div class="priceBtns">
            <div class="item on">50</div>
            <div class="item">50</div>
            <div class="item">50</div>
          </div>
        </div>
        <div class="priceInput" :style="{color:'#3B74FF'}">（单次充值限额:10.00元—999.00元）</div>
      </div>
      <div class="checkboxLayer">
        <span>支付方式：</span>
        <el-checkbox v-model="checked">备选项</el-checkbox>
        <el-checkbox v-model="checked">备选项</el-checkbox>
        <el-checkbox v-model="checked">备选项</el-checkbox>
        <el-checkbox v-model="checked">备选项</el-checkbox>
        <el-checkbox v-model="checked">备选项</el-checkbox>
        <el-checkbox v-model="checked">备选项</el-checkbox>
        <el-button size="medium" :style="{marginLeft:'1vw'}">更多</el-button>   
      </div>
      <div class="checkboxLayer">
        <span>支付模式：</span>
        <el-checkbox v-model="checked">备选项</el-checkbox>
        <el-checkbox v-model="checked">备选项</el-checkbox>
        <span :style="{color:'#666'}">支付凭证：</span><span :style="{display:'inline-block'}"><el-input v-model="price" size="medium" type="text"></el-input></span>
      </div>
      <div class="footButtomLayer">
        <el-button size="medium" @click="$router.go(-1)">取消</el-button>
        <el-button size="medium" type="primary"  >确定</el-button>
      </div>
    </div>
    <div class="model" v-if="visible">
      <div class="headbar">
        <div>更多充值优惠活动</div>
        <div @click="visible = false"><i class="iconfont iconguanbi"></i></div>
      </div>
      <div class="body">
        <activity class="modelActivity" v-model="multipleSelection"  label="冲100送5元"  infoText="这是一些text" :value="'1'"></activity>
        <activity class="modelActivity" v-model="multipleSelection"  label="冲100送5元"  infoText="这是一些text" :value="'1'"></activity>
        <activity class="modelActivity" v-model="multipleSelection"  label="冲100送5元"  infoText="这是一些text" :value="'1'"></activity>
        <activity class="modelActivity" v-model="multipleSelection"  label="冲100送5元"  infoText="这是一些text" :value="'1'"></activity>
        <activity class="modelActivity" v-model="multipleSelection"  label="冲100送5元"  infoText="这是一些text" :value="'1'"></activity>
        <activity class="modelActivity" v-model="multipleSelection"  label="冲100送5元"  infoText="这是一些text" :value="'1'"></activity>
        <activity class="modelActivity" v-model="multipleSelection"  label="冲100送5元"  infoText="这是一些text" :value="'1'"></activity>
        <activity class="modelActivity" v-model="multipleSelection"  label="冲100送5元"  infoText="这是一些text" :value="'1'"></activity>
        <activity class="modelActivity" v-model="multipleSelection"  label="冲100送5元"  infoText="这是一些text" :value="'1'"></activity>
        <activity class="modelActivity" v-model="multipleSelection"  label="冲100送5元"  infoText="这是一些text" :value="'1'"></activity>

      </div>
      <div class="footbar">
        <ul class="footItems">
          <li></li>
          <li class="conter">
            <el-button size="small" ><i class="iconfont iconzuojiantouda"></i></el-button>
            <el-button size="small" ><i class="iconfont iconyoujiantouda"></i></el-button>
          </li>
          <li class="right" >
            <el-button  @click="visible = false" size="medium" type="primary"  >确定</el-button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import 'assets/css/table.scss'
import vSelect from 'components/select/index'
import labelInput from 'components/labelInput/index'
import dateInput from 'components/dateInput/index'
import activity from 'components/activity/index'
export default {
  components:{
    vSelect,
    labelInput,
    dateInput,
    activity
  },
  data(){
    return{
      date:false,
      form:{
        name:'',
        password:'',
      },
      value: '',
      num:'',
      type:'1',
      visible:false,
      multipleSelection: [],
      a:{a:1,b:2},
      price:'',
      checked:false,
    }
  },
  mounted(){
    // this.fn(0,this.tableData3.length)
    // this.$nextTick(()=>{
    //   this.removeTableButtom()
    // })
  },
  
  methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      rowClassName({row, rowIndex}){
        let className = rowIndex%2 ? 'posRowOdd' : 'posRowEven';
        return className;

      },
      removeTableButtom(){
        let tableCells = document.querySelectorAll('.orderCell');
        for(let i = 0; i < tableCells.length; i++){
            let tableCellWidth = tableCells[i].clientWidth;
            let textWidth = tableCells[i].querySelector('.texthidden').clientWidth;
            if(textWidth <= tableCellWidth){
              tableCells[i].removeChild(tableCells[i].querySelector('.tableBtn'))
            }
        }
      },
      dialogOpen(type){
        this.type = type
        this.visible=true
      }
    },
}
</script>

<style lang="scss" scoped>
.pageTitle{
  font-size: $font-size16;
  @include bg_color($background-color-theme);
  padding: 1.3vh 3vw;
  color:$font-color-white
}
.contentLayer{
  padding: 0 2vw;
}
.queryDateForm{
  padding: 2vh 0;
  & > * {
    margin-right: 1vw;
    margin-bottom: 2vh;
  }
  & > button{
    margin-right: 0vw;
  }
  .priceItem{
    
    margin-right: 3vw;
    span{
      font-size: 1.3vw;
    }
    b{
      color:#FF8618;
      font-size: 1.3vw;
    }
  }
}
.select{
  width: 30vw;
}
.fromInput{
  width: 32.3vw;
  display: inline-block;
  position: relative;
  .tip{
    position: absolute;
  }
}
.contentInfoLayer{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2vh;
  .videoInfo{
    font-size: $font-size14;
    @include font_color($font-color-blue);
  }
}
.tableLayer{
  border:1px solid #D9E4FF;
  .tableBtn{
    border:1px solid;
    padding: 2px 5px;
    @include font-and-border-color()

  }
}
.tableFoot{
  display: flex;
  padding: 1.2vh 2vw;
  justify-content: space-between;
  color:$font-color3;
  align-items: center;
  .paginationLayer{
    display: flex;
    font-size: $font-size12;
    align-items: center;
    .paginaButtoms{
      &>span{
        display: inline-block;
        padding: 3px 15px;
        border:1px solid #BCBCBC ;
        color:#BCBCBC ;
        border-radius: 0.2vw;
        margin-left: 1.5vw;
      }
    }
  }
  .price{
    font-size: $font-size14;
    span{
      color:#FF8618;
    }
  }
}
.footButtomLayer{
  margin-top: 1vh;
  text-align: right;
  position: fixed;
  left: 0;
  right: 2vw;
  bottom: 2.6vh;
}
.orderCell{
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  .text{
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .tableBtn{
    border: 1px solid;
    padding: 2px 5px;
    color: #3B74FF;
    border-color: #3B74FF;
    width: 40px;
  }
  .texthidden{
    position: absolute;
    transform: translate(1000%);
    white-space: nowrap;
  }
}
.iconshanchu{
  @include font_color($font-color-blue);
  font-size: 22px;
}
.priceItem {
    display: inline-block;
}
.orderLayer{
  
  ul{
    display: flex;
    flex-wrap: wrap;
    li{
      width: 33.3%;
      margin-bottom: 1.5vh;
      span{
        color:$font-color6;
      }
      .tip{
        color:#999;
      }
    }
  }
}
.tag{
  border: 1px solid #FF8618;
  color:#FF8618;
  font-size: 12px;
  border-radius: 10px;
  padding: 1px 3px;
  margin-left: 10px;
}
.retunGoodsInfo{
  display: flex;
  margin-top: 1.2vh;
  &>div{
    margin-right: 3vw;
    span{
      color:$font-color6;
    }
    b{
        color:#FF8618;
    }
  }
}
h1{
  font-size: 14px;
  margin-bottom: 2.5vh;
}
.proceLayer{
  .priceInput{
    display: inline-block;
    .priceBtns {
      display: flex;
      .item {
        width: 70px;
        text-align: center;
        height: 36px;
        line-height: 36px;
        margin-right: 1vw;
        border:1px solid;
        border-radius: 2px;
        @include bd-color-and-font-color();
      }
      .on{
        @include bg_color($font-color-blue);
        color:#fff;
      }
    }   
  }
}
.priceTime{
  font-size: 13px;
  color:$font-color3;
  line-height: 35px;
}
.checkboxLayer{
  margin-top: 2.6vh;
  color:#666;
}
.model {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  .headbar {
    height: 6.9vh;
    display: flex;
    padding: 0 2.9vw;
    justify-content: space-between;
    @include bg_color($background-color-theme);
    align-items: center;
    border-radius: 0.8vw 0.8vw 0 0;
    & > div{
      font-size: 1.6vw;
      color:#fff;
    }
    .iconguanbi{
      font-size: 1.6vw;
      color:#fff;
    }
  }
  .body{
    background: #fff;
    height: calc(55.5vh - 4.2vh);
    padding: 0 5.5vw;
    .modelActivity{
      width: 25.5vw;
      margin-top: 1.6vh;
      margin-left: 0;
      margin-right: 1vw;
      &:nth-child(3n){
        margin-right: 0;
      }
    }
  }
  .footbar{
    height: 4.2vh;
    padding-top:1.2vh;
    padding-bottom: 2.5vh;
    background: #fff;
    .footItems {
      display: flex;
      justify-content: space-between;
      padding: 0 2vw;
    }
  }
}
</style>





  