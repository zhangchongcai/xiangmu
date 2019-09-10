<template>
  <div class="dateInputLayer">
    <el-date-picker
      :value="value"
      @input="changeInput"
      type="date"
      placeholder="选择日期"
      ref="date"
      class="datePicker"
      size="medium"
      @change="change"
      >
    </el-date-picker>
    <div class="dateItem">
      <div @click="yesterday"><i class="iconfont iconzuojiantouda"></i></div>
      <div  class="itemStr"><span  class="today">{{a}}</span><span @click="onDate" class="dateText">{{dateStr}}</span><span>{{getDay}}</span></div>
      <div @click="tomorrow"><i class="iconfont iconyoujiantouda"></i></div>
    </div>
  </div>
</template>
<script>
export default {
  props:['value'],
  data(){
    return{
      dayArr:['周日','周一','周二','周三','周四','周五','周六']
    }
  },
  computed:{
    dateStr(){
      let value = this.value
      return `${value.getFullYear()}.${value.getMonth()+1 > 9 ? value.getMonth()+1:'0'+(value.getMonth()+1)}.${value.getDate() > 9 ? value.getDate():'0'+value.getDate()}`
    },
    getDay(){
      return this.dayArr[this.value.getDay()]
    },
    a(){
      var date = this.value
      var year = date.getFullYear();
      var month = date.getMonth()+1;
      var day = date.getDate();
      var d1 = new Date(year+'/'+month+'/'+day);
      var dd = new Date();
      var y= dd.getFullYear();
      var m=dd.getMonth()+1;
      var d=dd.getDate();
      var d2 = new Date(y+'/'+m+'/'+d);
      var iday = parseInt(d2-d1)/1000/60/60/24;
      // console.log(iday)
      let deyStr = ''
      switch(iday){
        case 0 : deyStr = '今天'; break;
        case 1 : deyStr = '昨天'; break;
        case -1 : deyStr = '明天'; break;
        case -2 : deyStr = '后天'; break;
        default : deyStr = '' ; break;
      }
      return deyStr
      
    }
  },
  methods:{
    changeInput(event){
      this.$emit('input',event)
    },
    toDay(){
      this.$emit('input',new Date())
    },
    yesterday(){
      this.$emit('input',new Date(this.value.getTime() - 3600 * 1000 * 24))
      this.change(new Date(this.value.getTime() - 3600 * 1000 * 24))
    },
    tomorrow(){
      this.$emit('input',new Date(this.value.getTime() + 3600 * 1000 * 24))
      this.change(new Date(this.value.getTime() + 3600 * 1000 * 24))
    },
    onDate(){
      this.$refs.date.focus();
    },
    change(date){
      this.$emit('change',date)
    }
  }
}
</script>
<style lang="scss" scoped>
.dateInputLayer{
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  border:1px solid;
  @include bd-color-and-font-color();
  border-radius: 4px;
  .dateItem{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    i{
      cursor: pointer;
    }
    .itemStr{
      .today{
        cursor: pointer;
      }
      span{
        color:$font-color6;
      }
      .dateText{
        color:$font-color3;
        margin: 0 1vw;
        cursor: pointer;
      }
    }
  }
  .datePicker{
    opacity: 0;
  }
}
</style>


