<template>
  <div>
    <div class="pageTitle">取票</div>
    <div class="contentLayer">
      <div class="itemLayer" v-for="(item) in 2" :key="item">
        <div class="contentInfoLayer">
          <div class="videoInfo">大大的却而亲仁群若群胆子大大吃着吃着</div>
          <div>
            <el-button size="medium">取消订单</el-button>
            <el-button size="medium" @click="visible=true">延时</el-button>
            <el-button size="medium">支付清空</el-button>
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
            <el-table-column prop="id" label="订单编号" width="150" ></el-table-column>
            <el-table-column
              label="订单详情"
              >
              <template slot-scope="scope">
                <div  class="orderCell">
                  <div class="text">{{scope.row.order}}</div>
                  <div class="tableBtn" >更多</div>
                  <div class="texthidden">{{scope.row.order}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="解锁时间" width="110"></el-table-column>
            <el-table-column prop="money" label="总额(元)" width="110"></el-table-column>
            <el-table-column
              label="留作说明">
              <template slot-scope="scope">
                <div  class="orderCell">
                  <div class="text">{{scope.row.order}}</div>
                  <div class="tableBtn" >更多</div>
                  <div class="texthidden">{{scope.row.order}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="admin" label="操作员" width="90"></el-table-column>
            <el-table-column
              type="selection"
              width="40">
            </el-table-column>
            <div slot="append" class="tableFoot">
              <div class="paginationLayer">
                <!-- <div class="paginationInfo">共10条记录 1/2</div>
                <div class="paginaButtoms">
                  <span class="previous">&lt;</span>
                  <span class="next">&gt;</span>
                </div> -->
              </div>
              <div class="price">合计：<span><b>500.00</b>元</span></div>
            </div>
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
    <el-dialog title="操作提示" :visible.sync="visible" width="40%">
      <div class="dialogContent">
        <el-checkbox v-model="checked">备选项</el-checkbox>
        <el-checkbox v-model="checked">备选项</el-checkbox>
        <el-checkbox v-model="checked">备选项</el-checkbox>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import 'assets/css/table.scss'
export default {
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
        
      ],
      multipleSelection: [],
      visible:false,
      checked:'',
    }
  },
  mounted(){
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
      initData(item){
        if(item.order.length>28){
          item.orderFlag = true;
          item.orderText = item.order.substring(0,28)+'...';
        }else{
          item.orderFlag = false;
          item.orderText = item.order;
        }
        if(item.tip.length>12){
          item.tipFlag = true;
          item.tipText = item.tip.substring(0,12)+'...';
        }else{
          item.tipFlag = false;
          item.tipText = item.tip
        }
      },
      fn(i,length){
        this.initData(this.tableData3[i])
        if(i<length) this.fn(++i,length)
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
.dialogContent {
    text-align: center;
}
</style>





  