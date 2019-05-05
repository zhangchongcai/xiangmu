<template>
  <div>
    <div class="pageTitle">场次留座查询</div>
    <div class="contentLayer">
      <div class="queryDateForm">
        <el-select v-model="value" placeholder="请选择请选择请选择请选" class="select" size="medium">
            <el-option
            v-for="item in options"
            
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <v-select>
          <el-select v-model="value" placeholder="请选择请选择请选择请选" class="select" size="medium">
              <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
          </el-select>
        </v-select>
        <v-select>
          <el-select v-model="value" placeholder="请选择" size="medium">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </v-select>
        
        <div class="fromInput"><el-input v-model="input" placeholder="请输入内容" size="medium"></el-input></div>
        <el-button type="primary" size="medium">查询</el-button>
        <el-button size="medium">清空</el-button>
      </div>
      <div class="contentInfoLayer">
        <div class="videoInfo">大大的却而亲仁群若群胆子大大吃着吃着</div>
        <div>
          <el-button size="medium">清空</el-button>
          <el-button size="medium">清空</el-button>
          <el-button size="medium">清空</el-button>
        </div>
      </div>
      <div class="tableLayer">
        <el-table
          ref="multipleTable"
          :data="tableData3"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          header-cell-class-name="posTableHead"
          :row-class-name="rowClassName"
          >
          <el-table-column prop="id" label="订单编号" width="150"  show-overflow-tooltip></el-table-column>
          <el-table-column
            label="订单详情">
            <template slot-scope="scope">
              <div  class="orderCell">
                <div class="text">{{scope.row.order}}</div>
                <div class="tableBtn" >更多</div>
                <div class="texthidden">{{scope.row.order}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="number" label="手机号/会员卡号" width="130"></el-table-column>
          <el-table-column prop="time" label="解锁时间" width="80"></el-table-column>
          <el-table-column prop="money" label="总额(元)" width="80"></el-table-column>
          <el-table-column
            label="留作说明">
            <template slot-scope="scope">
              <div class="orderCell">
                <div class="texthidden">{{scope.row.tip}}</div>
                <div class="text">{{scope.row.tip}}</div>
                <div class="tableBtn">更多</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="admin" label="操作员" width="70"></el-table-column>
          <el-table-column
            type="selection"
            width="40">
          </el-table-column>
          <div slot="append" class="tableFoot">
            <div class="paginationLayer">
              <div class="paginationInfo">共10条记录 1/2</div>
              <div class="paginaButtoms">
                <span class="previous">&lt;</span>
                <span class="next">&gt;</span>
              </div>
            </div>
            <div class="price">已选订单金额：<span><b>500.00</b>元</span></div>
          </div>
        </el-table>
      </div>
      <div class="footButtomLayer">
        <el-button size="medium" @click="$router.go(-1)">关闭</el-button>
      </div>
    </div>
    
  </div>
</template>

<script>
import 'assets/css/table.scss'
import vSelect from 'components/select/index'
export default {
  components:{
    vSelect
  },
  data(){
    return{
      options: [{
        value: '选项1',
        label: '黄金糕'
        }, {
        value: '选项2',
        label: '双皮奶'
        }, {
        value: '选项3',
        label: '蚵仔煎'
        }, {
        value: '选项4',
        label: '龙须面'
        }, {
        value: '选项5',
        label: '北京烤鸭'
        }],
      value: '',
      tableData3: [
        {
          id:'L2215786540000',
          order:'共10张 9排1座 9排1座 9排1座 9排1座 9排1座 9排1座 9排1座',
          number:'18011972208',
          time:'至10：00',
          money:'135.00',
          tip:'这是一些流言具体是什么我也不知道的留言信息',
          admin:'李四'
        },
        {
          id:'L2215786540000',
          order:'共10张 9排1座 9排1座 9排1座 9排1座 9排1座 9排1座 9排1座',
          number:'18011972208',
          time:'至10：00',
          money:'135.00',
          tip:'这是一些流言具体是什么我也不知道的留言信息',
          admin:'李四'
        },
        {
          id:'L2215786540000',
          order:'共10张 9排1座 9排1座 9排1座 9排1座 9排1座 9排1座 9排1座',
          number:'18011972208',
          time:'至10：00',
          money:'135.00',
          tip:'这是一些流言具体是什么我也不知道的留言信息',
          admin:'李四'
        },
        {
          id:'L2215786540000',
          order:'共10张 9排1座 9排1座 9排1座 9排1座 9排',
          number:'18011972208',
          time:'至10：00',
          money:'135.00',
          tip:'这是一些流言具体是什么我也不知道的留言信息',
          admin:'李四'
        },
        {
          id:'L2215786540000',
          order:'共10张 9排1座 9排1座 9排1',
          number:'18011972208',
          time:'至10：00',
          money:'135.00',
          tip:'这是一些流言具体是什么我也不知道的留言信息',
          admin:'李四'
        },
        {
          id:'L2215786540000',
          order:'共10张 9排1座 9排',
          number:'18011972208',
          time:'至10：00',
          money:'135.00',
          tip:'这是一些流言具体是什么我也不知道的留言信息',
          admin:'李四'
        },
        {
          id:'L2215786540000',
          order:'共10张 9排1座 9排',
          number:'18011972208',
          time:'至10：00',
          money:'135.00',
          tip:'这是一些流言sss',
          admin:'李四'
        },
        {
          id:'L2215786540000',
          order:'共10张 9排1座 9排',
          number:'18011972208',
          time:'至10：00',
          money:'135.00',
          tip:'',
          admin:'李四'
        },
        {
          id:'L2215786540000',
          order:'共10张 9排1座 9排',
          number:'18011972208',
          time:'至10：00',
          money:'135.00',
          tip:'这是一些流言具体是什么我也不知道的留言信息',
          admin:'李四'
        },
        
      ],
        multipleSelection: []
    }
  },
  mounted(){
    // this.fn(0,this.tableData3.length)
    this.$nextTick(()=>{
      this.removeTableButtom()
    })
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
        padding: 1vh 1.8vw;
        border:1px solid #BCBCBC ;
        color:#BCBCBC ;
        border-radius: 0.2vw;
        padding: 0.5vh 1.8vw;
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
  margin-top: 3.9vw;
  text-align: right;
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
</style>





  