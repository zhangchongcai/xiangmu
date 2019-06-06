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
      <div  class="itemStr"><span @click="toDay" class="today">今天</span><span @click="onDate" class="dateText">{{dateStr}}</span><span>{{getDay}}</span></div>
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


