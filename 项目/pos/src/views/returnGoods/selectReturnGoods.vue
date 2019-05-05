<template>
  <div>
    <div class="pageTitle">退货</div>
    <div class="contentLayer">
      <div class="queryDateForm">
        <date-input :style="{width:'30vw',}" v-model="date"></date-input>
        <v-select>
          <el-select v-model="value" placeholder="请选择请选择请选择请选" class="select" size="medium">
              <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >
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
        <el-button type="primary" >确 定</el-button>
        <el-button size="medium" @click="dialogOpen">添加</el-button>
      </div>
      <div class="tableLayer">
        <el-table
          ref="multipleTable"
          :data="tableData3"
          tooltip-effect="dark"
          style="width: 100%"
          header-cell-class-name="posTableHead"
          :row-class-name="rowClassName"
          >
          <el-table-column prop="id" label="订单编号" width="150"></el-table-column>
          <el-table-column prop="zw"  label="座位详情" ></el-table-column>
          <el-table-column prop="time" label="交易日期" width="150"></el-table-column>
          <el-table-column prop="num" label="总额(元)" width="80"></el-table-column>
          <el-table-column prop="admin" label="收银员" width="80"></el-table-column>
          <el-table-column  label="操作" width="140">
            <template slot-scope="scope">
              <el-button  :style="{padding:'4px 8px'}">查看</el-button>
              <el-button  :style="{padding:'4px 8px'}">退票</el-button>
            </template>
          </el-table-column>
          <div slot="append" class="tableFoot">
            <div class="paginationLayer">
              <div class="paginationInfo">共10条记录 1/2</div>
              <div class="paginaButtoms">
                <span class="previous">&lt;</span>
                <span class="next">&gt;</span>
              </div>
            </div>
          </div>
        </el-table>
      </div>
      <div class="footButtomLayer">
        <el-button size="medium" @click="$router.go(-1)">返回</el-button>
      </div>
    </div>
    <el-dialog title="操作提示" :visible.sync="visible" width="30%">
      <div class="dialogContent">
        <span class="iconLayer"><i class="iconfont " :class="dialogType"></i></span> 

        <span>这是一些文本信息这是一些文本信息这是一些文本信息这是</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import 'assets/css/table.scss'
import vSelect from 'components/select/index'
import labelInput from 'components/labelInput/index'
import dateInput from 'components/dateInput/index'
export default {
  components:{
    vSelect,
    labelInput,
    dateInput,
  },
  data(){
    return{
      date:new Date(),
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
      num:'',
      visible:false,
      dialogType:'', //icontishichenggongtubiao
      tableData3: [
        {
          id:'365236987485',
          zw:'共三张：8排7号；8排5号；8排4号',
          time:'2019-01-31 18:30',
          num:'85.00',
          pay:'现金5000.00元 银联1234.00元',
          admin:'系统',
        },
        {
          id:'365236987485',
          zw:'共三张：8排7号；8排5号；8排4号',
          time:'2019-01-31 18:30',
          num:'85.00',
          pay:'现金5000.00元 银联1234.00元',
          admin:'系统',
        },
        {
          id:'365236987485',
          zw:'共三张：8排7号；8排5号；8排4号',
          time:'2019-01-31 18:30',
          num:'85.00',
          pay:'现金5000.00元 银联1234.00元',
          admin:'系统',
        },
        {
          id:'365236987485',
          zw:'共三张：8排7号；8排5号；8排4号',
          time:'2019-01-31 18:30',
          num:'85.00',
          pay:'现金5000.00元 银联1234.00元',
          admin:'系统',
        },
        {
          id:'365236987485',
          zw:'共三张：8排7号；8排5号；8排4号',
          time:'2019-01-31 18:30',
          num:'85.00',
          pay:'现金5000.00元 银联1234.00元',
          admin:'系统',
        },
        {
          id:'365236987485',
          zw:'共三张：8排7号；8排5号；8排4号',
          time:'2019-01-31 18:30',
          num:'85.00',
          pay:'现金5000.00元 银联1234.00元',
          admin:'系统',
        },
        {
          id:'365236987485',
          zw:'共三张：8排7号；8排5号；8排4号',
          time:'2019-01-31 18:30',
          num:'85.00',
          pay:'现金5000.00元 银联1234.00元',
          admin:'系统',
        },
        {
          id:'365236987485',
          zw:'共三张：8排7号；8排5号；8排4号',
          time:'2019-01-31 18:30',
          num:'85.00',
          pay:'现金5000.00元 银联1234.00元',
          admin:'系统',
        },
        {
          id:'365236987485',
          zw:'共三张：8排7号；8排5号；8排4号',
          time:'2019-01-31 18:30',
          num:'85.00',
          pay:'现金5000.00元 银联1234.00元',
          admin:'系统',
        },
        {
          id:'365236987485',
          zw:'共三张：8排7号；8排5号；8排4号',
          time:'2019-01-31 18:30',
          num:'85.00',
          pay:'现金5000.00元 银联1234.00元',
          admin:'系统',
        },
        {
          id:'365236987485',
          zw:'共三张：8排7号；8排5号；8排4号',
          time:'2019-01-31 18:30',
          num:'85.00',
          pay:'现金5000.00元 银联1234.00元',
          admin:'系统',
        },

      ],
        multipleSelection: []
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
      dialogOpen(){
        this.dialogType='icontishigantanhao';
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
  margin-top: 2vh;
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
.iconshanchu{
  @include font_color($font-color-blue);
  font-size: 22px;
}
.priceItem {
    display: inline-block;
}
.dialogContent{
  padding: 0 15%;
  display: flex;
  span{
    display: block;
  }
  .iconLayer{
    
    .iconfont{
      @include font_color($font-color-blue);
      font-size: 2.4vw;
    }
  }
  
}
</style>





  