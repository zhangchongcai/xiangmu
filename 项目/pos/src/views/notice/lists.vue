<template>
  <div class="layer">
    <div class="pageTitle">广电通知</div>
    <div class="contentLayer">
      <div class="tableLayer">
        <el-table
          ref="multipleTable"
          :data="tableData3"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          header-cell-class-name="posTableHead"
          :row-class-name="rowClassName"
          :show-header="false"
          >
          <el-table-column prop="title" label="订单编号" ></el-table-column>
          <el-table-column prop="time" label="总额(元)" width="150"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footButtomLayer">
      <el-button size="medium" @click="$router.go(-1)">返回</el-button>
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
      value: '',
      tableData3: [
       {
         title:'广电通知停播节目 不得以任何形式复播',
         time:'2018-10-10'
       },
       {
         title:'广电通知停播节目 不得以任何形式复播',
         time:'2018-10-10'
       },
       {
         title:'广电通知停播节目 不得以任何形式复播',
         time:'2018-10-10'
       },
       {
         title:'广电通知停播节目 不得以任何形式复播',
         time:'2018-10-10'
       },
       {
         title:'广电通知停播节目 不得以任何形式复播',
         time:'2018-10-10'
       },
       {
         title:'广电通知停播节目 不得以任何形式复播',
         time:'2018-10-10'
       }
        
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
.layer{
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.pageTitle{
  font-size: $font-size16;
  @include bg_color($background-color-theme);
  padding: 1.3vh 3vw;
  color:$font-color-white
}
.contentLayer{
  padding: 2vh 2vw;
  flex: 1;
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
  padding: 1.3vh 3vw;
  text-align: right;
}

</style>





  