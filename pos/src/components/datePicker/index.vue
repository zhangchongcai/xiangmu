<template>
  <div v-if="isShow" class="layer">
    <div class="dateLayer">
      <div class="title">{{activeObj.dateStr}}</div>
      <ul class="btnsLayer">
        <li @click="changeTime('yearUp')">&lt;&lt;</li>
        <li @click="changeTime('monthUp')">&lt;</li>
        <li>{{new Date(selectObj.time).getFullYear()+'-'+(new Date(selectObj.time).getMonth()+1)}}</li>
        <li @click="changeTime('monthNext')">&gt;</li>
        <li @click="changeTime('yearNext')">&gt;&gt;</li>
      </ul>
      <ul class="dateStr">
        <li v-for="(item) in dateStr" :key="item">{{item}}</li>
      </ul>
      <ul class="dayLayer">
        <li v-for="(item,index) in dayArr" :key="index" 
        :class="{ on :activeObj.dateStr == item.dateStr, none : !item.flag}"
        @click="changeDay(item)">{{item.day}}</li>
      </ul>
      <ul class="footLayer">
        <li class="today" @click="today">今天</li>
        <li>
          <el-button style="background: #fff;" @click="close">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </li>
      </ul>
    </div>
  </div>
</template> 
<script>
import {mapGetters, mapMutations} from 'vuex'
import {SET_CURRENT_DATE, SHOW_DATE_PICKER} from 'types'
export default {
  props:['date', 'isShow'],
  data(){
    return{
      dateStr:['日','一','二','三','四','五','六'],
      dayArr:[],
      activeObj:{},
      selectObj:{},
    }
  },
  mounted(){
    this.activeObj = this.initArrObj(this.date ? this.initTime(this.date): new Date().getTime())
    this.selectObj = this.activeObj;
    this.SET_CURRENT_DATE(this.activeObj.dateStr)
    this.initData(this.date ? this.initTime(this.date): new Date().getTime());
  },
  methods: {
    ...mapMutations([
      SET_CURRENT_DATE,
      SHOW_DATE_PICKER
    ]),
    initData(val){
      let date = val ? new Date(val) :new Date();
      let year = date.getFullYear();
      let Month = date.getMonth();
      let day = date.getDate();
      let totalDay = new Date(year,Month+1,0).getDate(); //当月总天数
      let startDay = new Date(year,Month,1).getDay(); //获取每个月1号星期几
      let endDay = new Date(year,Month,totalDay).getDay() //获取每个月最后一天星期几 //24*60*60*1000
      let timeNum =  24*60*60*1000 //一天的时间戳
      let startDayTime = new Date(year,Month,1).getTime(); //获取当前月 1号时间戳
      let endDayTime = new Date(year,Month,totalDay).getTime();
      let dateArr = [];
      if(startDay){
        for(let i = 0 ; i < startDay; i++){//添加每个月一号前面的天数
          dateArr.unshift(this.initArrObj(startDayTime-timeNum*(i+1)))
        }
      }
      for(let i = 0 ; i < totalDay ; i++){//添加天数
        let obj = this.initArrObj(startDayTime+timeNum*i)
        obj.flag = true
        dateArr.push(obj)
      }
      let endDayi = 0
      let endDayLength = 42-dateArr.length
      for(let i = endDayi ; i < endDayLength ; i++){//添加每个月最后一号的天数
        dateArr.push(this.initArrObj(endDayTime+timeNum*(endDayi+1)))
        endDayi++
      }
      this.dayArr = dateArr
      // console.log(dateArr)

    },

    //前一天
    preDate() {
      this.activeObj = this.initArrObj(this.activeObj.time - 24 * 3600 * 1000)
      this.SET_CURRENT_DATE(this.activeObj.dateStr)
    },
    // 后一天
    nextDate() {
      this.activeObj = this.initArrObj(this.activeObj.time + 24 * 3600 * 1000)
      this.SET_CURRENT_DATE(this.activeObj.dateStr)
    },

    initArrObj(time){ //传时间戳进来 格式化数据
      let obj = {};
      let date = new Date(time);
      obj.dateStr = `${date.getFullYear()}-${(date.getMonth()+1) > 9 ? date.getMonth()+1:'0'+(date.getMonth()+1) }-${date.getDate() > 9 ? date.getDate() : '0'+date.getDate()}`
      obj.day = date.getDate();
      obj.time = time;
      return obj
    },
    initTime(str){ //传时间 进来格式化成时间戳 例如 "2019-3-18"
        let timeArr = str.split('-');
        return new Date(parseInt(timeArr[0]) ,parseInt(timeArr[1])-1,parseInt(timeArr[2])).getTime()
    },
    changeTime(type){
      let selectTime = new Date(this.initTime(this.selectObj.dateStr)) 
      let time = ''
      switch(type){
        case 'yearUp' :
        time = new Date(selectTime.getFullYear()-1,selectTime.getMonth(),1)
        break;
        case 'yearNext' :
        time = new Date(selectTime.getFullYear()+1,selectTime.getMonth(),1)
        break;
        case 'monthUp':
        time = selectTime.getMonth() == 0 ? new Date(selectTime.getFullYear()-1,11,1) : new Date(selectTime.getFullYear(),selectTime.getMonth()-1,1);
        break;
        case 'monthNext':
        time = selectTime.getMonth() == 11 ? new Date(selectTime.getFullYear()+1,0,1) : new Date(selectTime.getFullYear(),selectTime.getMonth()+1,1);
        break;

      }
      this.initData(time);
      this.selectObj = this.initArrObj(time);

    },
    changeDay(item){
      if(!item.flag) return
      this.activeObj = item;
      this.selectObj = item;
    },
    today(){
      let time = new Date().getTime();
      this.initData(time);
      this.activeObj = this.initArrObj(time);
      this.selectObj = this.initArrObj(time);
    },
    close() {
      this.SHOW_DATE_PICKER()
    },
    confirm(){
      this.$emit('confirm',this.activeObj)
    }

  },
}
</script>
<style lang="scss" scoped>
.layer{
  position: fixed;
  top:0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100000;
  background: rgba(0,0,0,0.4);
  -webkit-transform: translateZ(0);
  .dateLayer{
    position: absolute;
    user-select: none;
    width: 32.8vw;
    left: 50%;
    top:50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    .title{
      @include bg_color($btn-background-color-theme);
      color:$font-color-white;
      font-size: $font-size18;
      text-align: center;
      padding: 1.8vh 0;
    }
    .btnsLayer{
      display: flex;
      justify-content: space-around;
      padding-top: 1.5vh;
      padding-bottom: 1.5vh;
      background: #fff;
      font-size: $font-size18;
    }
    .dateStr{
      display: flex;
      background: #fff;
      li{
        flex: 1;
        text-align: center;
        font-size: $font-size18;
        color:#BCBCBC ;
        padding: 1.5vh 0;
      }
    }
    .dayLayer{
      display: flex;
      background: #fff;
      flex-wrap: wrap;
      li{
        flex: 0 1 14.27%;
        text-align: center;
        font-size: $font-size18;
        color:#666 ;
        padding: 1.5vh 0;

        &:hover{
          @include bg_color($btn-background-color-theme);
          color:#fff;
          cursor: pointer;
        }
      }
      .on{
        @include bg_color($btn-background-color-theme);
        color:#fff;
      }
      .none{
        color:#BCBCBC ;
      }
    }
    .footLayer{
      display: flex;
      justify-content: space-between;
      background: #fff;
      align-items: center;
      padding: 1.5vh;
    }
  }
  .today{
    @include font_color($btn-background-color-theme);
    font-size: $font-size18;
  }
}
</style>

