<template>
  <div>
    <div class="pageTitle">取票</div>
    <div class="contentLayer">
      <div class="itemLayer" v-for="(item,index) in data" :key="index">
        <div class="tableLayer">
          <div class="tableHeader">
            <div class="tableInfo">
              <span class="tableHeaderTitle">{{item.title}}</span>
              <span class="tableStateType">{{item.flag ? '已取' : '未取'}}</span>
              <!-- <span class="tip">本柜台不提供电视谝，请移步到柜台！</span> -->
            </div>
            <div class="buttoms"> <el-button   :disabled="item.type ==2 && item.flag==1" type="primary" size="mini" @click="onItem(item.type)" >{{item.type==1 ? item.flag ? '重打印':'打印' : '取货'}}</el-button></div>
          </div>
          <el-table
              :data="item.type == 1 ? tableData : tableData2"
              :show-header="false"
              style="width: 100%"
              :row-class-name="rowClassName">
              <el-table-column
                label="Date"
                prop="str">
              </el-table-column>
            </el-table>
        </div>
      </div>
      <div class="footButtomLayer">
        <div class="paginationLayer">
          <span class="previous"><i class="iconfont iconxiangshangzhankaixiaojiantou"></i></span>
          <span class="paginationInfo"></span>
          <span class="next"><i class="iconfont iconxiangxiazhankaixiaojiantou"></i></span>
        </div>
        <el-button size="medium" class="closeButtom" @click="$router.go(-1)">关闭</el-button>
      </div>
    </div>
    
  </div>
</template>

<script>
import 'assets/css/table.scss'
import { posticketGetTicket,posticketPrintTicket,posticketTicketPrintNotify,posticketGetGoods } from 'http/apis'
import  app  from 'src/http/app'
import {mapState} from 'vuex';
export default {
  data(){
    return{
      tableData: [],
      search: '',
      data:[

      ],
      tableData2:[],
      saleBillUid:'',
      ticketUids: [],
      flag : true,
      goodReforData:[],
      loading:null,
    }
  },
  mounted(){
    this.getData();
    // this.getPrintTicket();
  },
  computed:{
    ...mapState({
      configData : state => state.config.configData
    })
  },
  methods: {
      async getData(){
        this.data = []  
        this.tableData=[] 
        this.tableData2 = [];
        const val = this.$route.query.val
        const data = await posticketGetTicket({
          getCode:val
        })
        console.log(data)
        if(data.code != 200){
          this.$message.error(data.msg);
          return
        }
        if(data.data.movieTicketReturn){
          this.saleBillUid = data.data.saleBillUid
          let movieData = {
            title:'电影',
            flag:data.data.movieTicketReturn.getFlag,
            type:1,
          };
          const { showDay, showTime, hall, name, seat, week } = data.data.movieTicketReturn;
          let showDayArr = showDay.split('-');
          let showTimeArr = showTime.split(':');
          let weekday = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
          let day = weekday[new Date(parseInt(week)).getDay()];
          this.tableData.push(...[
              {
              str:`${name} | ${showDayArr[0]}年${showDayArr[1]}月${showDayArr[2]}日 ${day} | ${hall} ${showTimeArr[0]}:${showTimeArr[1]}`
              },
              {
                str:seat.join('、')
              }
          ])
          this.data.push(movieData);
        }
        if(data.data.posSaleGoodsReturn.goodsList.length){
          this.goodReforData = data.data.posSaleGoodsReturn.goodsList;
          let { getFlag ,goodsList } = data.data.posSaleGoodsReturn;
          let goodsDate = {
            title:'卖品',
            flag:getFlag,
            type:2,
          }
          this.tableData2.push(...goodsList.map((item)=>{
             return {
               str : `${item.goodsName} x ${item.count}`
             }
          }))
          this.data.push(goodsDate);
        }
        

      },
      async getPrintTicket(){
        const val = this.$route.query.val
        const data = await posticketPrintTicket({
          getCode : val
        })
        if(data.code != 200) return this.$message.error(data.msg)
        this.ticketUids = [];
        this.loading = this.$loading({
          lock: true,
          text: '打印中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.printTicket(data.data,data.data.length,this.reforPrintTicket)
        // this.printTicket(this.printData,this.printData.length,()=>{console.log(123)})
      },
      rowClassName({row, rowIndex}){
        let className = rowIndex%2 ? 'posRowOdd' : 'posRowEven';
        return className;

      },
      async reforPrintTicket(){
        let obj = {
          salesUid : this.saleBillUid,
          ticketUid : this.ticketUids,
          state : this.flag ? 1 : 0,
          reason : this.flag ? '打印成功' : '打印失败',
          authAccount : '',
          is_reprint : this.data[0].flag,
        }
        this.flag ?  this.$message.success('打印成功！') : this.$$message.error('打印失败！')
        const prIntData = await posticketTicketPrintNotify(obj)
        this.getData()
      },
      printTicket(dataArr,length,callback){
        app.printTicket('film_print',dataArr[length-1],this.configData,(res)=>{
            console.log(res)
            this.ticketUids.push(dataArr[length-1].ticket_element[0].movieTicketUid)
            if(res[0] !== 0){
              this.flag = false;
            }
            if(length -1 === 0){
              this.loading.close()
              callback()
            }else{
              this.printTicket(dataArr,length-1,callback)
            }
          })
      },
      async printGood(){
        const data = await posticketGetGoods(this.goodReforData)
        if(data.code != 200) return this.$message.error(data.msg)
        this.$message.success('取货成功！')
        this.getData()
      },
      onItem(type){
        if(type == 1){
          this.getPrintTicket()
        }else{
          this.printGood()
        }
      },

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
.itemLayer{
  margin-top: 2.6vh;
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
.contentInfoLayer{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2vh;
  .videoInfo{
    font-size: $font-size14;
    color:#333;
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
  .price{
    font-size: $font-size14;
    span{
      color:#FF8618;
    }
  }
}
.footButtomLayer{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 3.6vh;
  .closeButtom {
    position: absolute;
    right: 2vw;
    top: -1vh;
  }
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
.paginationLayer{
  display: flex;
  justify-content: center;
  align-items: center;
  &>span{
    display: block;
  }
  .paginationInfo{
    font-size: $font-size12;
    margin: 0 2.5vw;
  }
  .previous,.next{
    font-size: $font-size12;
    border:1px solid;
    @include font-and-border-color();
    padding: 0.7vh 1.4vw;
  }
}
.tableHeader{
  padding: 0.4vh 10px;
  @include table-head-bgcolor();
  display: flex;
  justify-content: space-between;
  align-items: center;
  .tableInfo{
    &>span{
      display: inline-block;
    }
    .tableHeaderTitle{
      font-weight: 600;
      font-size: $font-size14;
    }
    .tableStateType{
      padding: 0 5px;
      border-radius: 25px;
      background: #FC6421;
      color:#fff;
      font-size :$font-size12;
      margin-left: 0.5vw;
      margin-right: 2vw;
    }
    .tip{
      color:#FC6421;
      font-size :$font-size12;
    }
  }
}
</style>





  