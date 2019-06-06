<template>
  <div>
    <div class="pageTitle">验票</div>
    <div class="contentLayer">
      <div class="queryDateForm">
        <div class="fromInput"><el-input v-model="value" placeholder="扫描或输入影票编号/影票信息码" size="medium"></el-input></div>
        <el-button type="primary" size="medium" @click="getDate">查询</el-button>
        <el-button size="medium" @click="empty">清空</el-button>
      </div>
      <div class="tableLayer">
        <div class="ItemLayer">
          <div class="item">
            <span class="labelSpan">电影票编号:</span>
            <span class="keySpan">{{data.cinemaTicketCode}}</span>
          </div>
          <div class="item">
            <span class="labelSpan">影票状态：</span>
            <span class="keySpan">{{data.ticketStatus}}</span>
          </div>
          <div class="item">
            <span class="labelSpan">影厅：</span>
            <span class="keySpan">{{data.hallName}}</span>
          </div>
          <div class="item">
            <span class="labelSpan">座位：</span>
            <span class="keySpan">{{data.seatRow}}排{{data.seatColumn}}号</span>
          </div>
          <div class="item">
            <span class="labelSpan">影片：</span>
            <span class="keySpan">{{data.movieName}}</span>
          </div>
          <div class="item">
            <span class="labelSpan">放映日期：</span>
            <span class="keySpan">{{data.planDate}}</span>
          </div>
          <div class="item">
            <span class="labelSpan">座类：</span>
            <span class="keySpan">{{seatTypes[data.seatType] || ''}}</span>
          </div>
          <div class="item">
            <span class="labelSpan">票类：</span>
            <span class="keySpan">{{data.ticketTypeName}}</span>
          </div>
          <div class="item">
            <span class="labelSpan">票价（元）：</span>
            <span class="keySpan">{{data.ticketPrice}}</span>
          </div>
          <div class="item">
            <span class="labelSpan">售票渠道：</span>
            <span class="keySpan">{{data.channelName || '无'}}</span>
          </div>
          <div class="item">
            <span class="labelSpan">代售服务费（元）：</span>
            <span class="keySpan">{{data.servicePrice}}</span>
          </div>
          <div class="item">
            <span class="labelSpan">增值服务费（元）：</span>
            <span class="keySpan">{{data.addPrice}}</span>
          </div>
          
        </div>
      </div>
      <div class="footButtomLayer">
        <el-button size="medium" @click="$router.go(-1)">返回</el-button>
      </div>
    </div>
    
  </div>
</template>

<script>
import { movieTicketCheck } from 'http/apis'
export default {
  data(){
    return{
      value: '',
      seatTypes:['单人座','情侣座','三人座','残疾人座','按摩椅座','儿童座'],
      data:{}
    }
  },
  mounted(){
  },
  
  methods: {
    async getDate(){
      if(!this.value) return this.$message.warning('输入影票编号/影票信息码！');
      const data = await movieTicketCheck({
        cinemaTicketCode: this.value
      })
      if(data.code == 200){
        this.data = data.data
      }else{
        this.$message.error(data.msg);
      }
    },
    empty(){
      this.value = '';
      this.data = {};
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
}
.select{
  width: 30vw;
}
.fromInput{
  width: 32.3vw;
  display: inline-block;
}
.tableLayer{
  border:1px solid #D9E4FF;
  .tableBtn{
    border:1px solid;
    padding: 2px 5px;
    @include font-and-border-color()
  }
  .ItemLayer{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .item{
      width: 50%;
      box-sizing: border-box;
      padding: 1.4vh 1.4vw;
      span{
        display: inline-block;
        font-size: 1.3vw;
      }
      .labelSpan{
        width: 13vw;
        color:$font-color6;
      }
      .keySpan{
        color:$font-color3;
      }
      &:nth-child(4n-1){
        background: #F0F0F0;
      }  
      &:nth-child(4n){
        background: #F0F0F0;
      }  
    }
  }

}
.footButtomLayer{
  position: fixed;
  left: 2vw;
  right: 2vw;
  bottom: 2.6vh;
  text-align: right;
}
</style>





  