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
              <span class="tip">本柜台不提供电视谝，请移步到柜台！</span>
            </div>
            <div class="buttoms"> <el-button type="primary" size="mini" >{{item.flag ? '重打印':'打印'}}</el-button></div>
          </div>
          <el-table
              :data="item.type == 1 ? tableData : []"
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
          <span class="previous">上一页</span>
          <span class="paginationInfo">1/2</span>
          <span class="next">下一页</span>
        </div>
        <el-button size="medium" class="closeButtom" @click="$router.go(-1)">关闭</el-button>
      </div>
    </div>
    
  </div>
</template>

<script>
import 'assets/css/table.scss'
import { posticketGetTicket } from 'http/apis'
export default {
  data(){
    return{
      tableData: [],
        search: '',
        data:[

        ]
    }
  },
  mounted(){
    // this.$nextTick(()=>{
    //   this.removeTableButtom()
    // })
    this.getData();
  },
  
  methods: {
      async getData(){
        const val = this.$route.query.val
        const data = await posticketGetTicket({
          getCode:886
        })
        console.log(data)
        if(data.code != 200){
          this.$message.error(data.msg);
          return
        }
        let movieData = {
          title:'电影',
          flag:data.data.getFlag,
          type:1,
        };
        const { showDay, showTime, hall, name, seat, week } = data.data;
        let showDayArr = showDay.split('-');
        let showTimeArr = showTime.split(':');
        
        this.tableData.push(...[
            {
            str:`${name} | ${showDayArr[0]}年${showDayArr[1]}月${showDayArr[2]}日 ${week} | ${hall} ${showTimeArr[0]}:${showTimeArr[1]}`
            },
            {
              str:seat.join('、')
            }
        ])
        this.data.push(movieData);
        

      },
      rowClassName({row, rowIndex}){
        let className = rowIndex%2 ? 'posRowOdd' : 'posRowEven';
        return className;

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





  