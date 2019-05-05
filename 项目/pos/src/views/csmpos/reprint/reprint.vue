<template>
    <div>
        <div class="pageTitle">重打印影票</div>
        <div class="contentLayer">
            <div class="queryDateForm">
                <div class="search-wrap">
                    <span>票卷编号：</span>
                    <el-input  type="text" v-model="code" placeholder="请输入" size="medium"></el-input>  
                </div>
                <div class="search-wrap">
                    <span>销售单号：</span>
                    <el-input  type="text" v-model="code" placeholder="请输入" size="medium"></el-input>  
                </div>
                <div class="search-wrap">
                    <span>收银员：</span>
                    <el-input  type="text" v-model="code" placeholder="请输入" size="medium"></el-input>  
                </div>
                <el-button size="medium" type="primary" style="margin-left:26px" @click="handerCheck">查询</el-button>
                <div class="time-way">
                    <span>支付方式：</span>
                    <el-radio-group v-model="time">
                        <el-radio :label="30">近30分钟</el-radio>
                        <el-radio :label="60">近一个小时</el-radio>
                        <el-radio :label="120">近2个小时</el-radio>
                        <el-radio :label="0">不限</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="tableLayer" v-show="1">
                <el-table
                ref="multipleTable"
                :data="tableData3"
                tooltip-effect="dark"
                style="width: 100%"
                header-cell-class-name="posTableHead"
                :row-class-name="rowClassName"
                >
                <el-table-column prop="billCode" label="交易单号" ></el-table-column>
                <el-table-column prop="type"  label="交易类型" ></el-table-column>
                <el-table-column prop="man" label="收银员" ></el-table-column>
                <el-table-column prop="money" label="金额（元）" ></el-table-column>
                <el-table-column prop="time" label="交易时间" ></el-table-column>
                <el-table-column prop="end" label="终端" ></el-table-column>
                <el-table-column  label="操作" width="90">
                    <template slot-scope="scope">
                    <span class="operation" @click="handerCheck">查看</span> 
                    <!-- <el-tag type="'success'" close-transition  style="cursor:pointer;" @click="handerCheck">查看</el-tag> -->
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
            <div class="tableLayer" v-show="0">
                <el-table
                ref="multipleTable"
                :data="tableData4"
                tooltip-effect="dark"
                style="width: 100%"
                header-cell-class-name="posTableHead"
                :row-class-name="rowClassName"
                >
                <el-table-column prop="billCode" label="场次信息" ></el-table-column>
                <el-table-column prop="type"  label="座位号" ></el-table-column>
                <el-table-column prop="man" label="电影票编码" ></el-table-column>
                <el-table-column prop="money" label="交易日期" ></el-table-column>
                <el-table-column prop="time" label="操作人" ></el-table-column>
                <el-table-column  label="操作" width="90">
                    <template slot-scope="scope">
                    <!-- <span style="color:#3B74FF;border:1px solid;padding:2px;font-size:$font-size12">重打印</span>  -->
                    <el-tag type="'success'" close-transition>重打印</el-tag>
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
            <div style="text-align:right;margin-top:2vh">
                <el-button type="primary" plain="" @click="back">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import 'assets/css/table.scss'
import labelInput from 'components/labelInput/index'
import dateInput from 'components/dateInput/index'
export default {
    components:{
        labelInput,
        dateInput,
    },
    data(){
        return{
            code:1,
            time:30,
            searchTime:'',
            tableData3: [
                {
                billCode:'465891232132132134464',
                tyle : '消费',
                man : '系统收银员',
                moeny: '120.00',
                time:'2018-10-23 16:16:24',
                end:10056
                },
                {
                billCode:'465891232132132134464',
                tyle : '消费',
                man : '系统收银员',
                moeny: '120.00',
                time:'2018-10-23 16:16:24',
                end:10056
                },
                {
                billCode:'465891232132132134464',
                tyle : '消费',
                man : '系统收银员',
                moeny: '120.00',
                time:'2018-10-23 16:16:24',
                end:10056
                },
                {
                billCode:'465891232132132134464',
                tyle : '消费',
                man : '系统收银员',
                moeny: '120.00',
                time:'2018-10-23 16:16:24',
                end:10056
                },
                {
                billCode:'465891232132132134464',
                tyle : '消费',
                man : '系统收银员',
                moeny: '120.00',
                time:'2018-10-23 16:16:24',
                end:10056
                },
            ],
            tableData4: [
                {
                billCode:'465891232132132134464',
                tyle : '消费',
                man : '系统收银员',
                moeny: '120.00',
                time:'2018-10-23 16:16:24',
                end:10056
                },
                {
                billCode:'465891232132132134464',
                tyle : '消费',
                man : '系统收银员',
                moeny: '120.00',
                time:'2018-10-23 16:16:24',
                end:10056
                },
                {
                billCode:'465891232132132134464',
                tyle : '消费',
                man : '系统收银员',
                moeny: '120.00',
                time:'2018-10-23 16:16:24',
                end:10056
                },
                {
                billCode:'465891232132132134464',
                tyle : '消费',
                man : '系统收银员',
                moeny: '120.00',
                time:'2018-10-23 16:16:24',
                end:10056
                },
                {
                billCode:'465891232132132134464',
                tyle : '消费',
                man : '系统收银员',
                moeny: '120.00',
                time:'2018-10-23 16:16:24',
                end:10056
                },
            ],
            
        }
    },
    mounted(){

    },
    
    methods: {
        removeTableButtom(){
        },
        rowClassName({row, rowIndex}){
        let className = rowIndex%2 ? 'posRowOdd' : 'posRowEven';
        return className;

      },
        search() {},

        handerCheck() {
            console.log("12221")
            this.$router.push({
                name:'printcheck'
            })
        },
        back() {
            this.$router.go(-1)
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
    padding: 0 1vw
}
.queryDateForm{
    margin: 5vh 0;
}
.operation{
    display: inline-block;
    width: 3.9vw;
    height: 3.4vh;
    font-size: $font-size12;
    text-align: center;
    line-height: 3.9vh;
    border-radius: 2px;
    color:#3B74FF;
    cursor: pointer;
    border:1px solid;
}
.search-wrap {
    display: inline-block;
    height: 32px;
    margin-left: 3%;
    .el-input {
      width: 19.5vw;
    }
    span {
      color: #666666;
      font-size: 12px;
    }
}
.search-wrap:first-child{
    margin-left: 0;
}
.time-way{
    margin-top: 4vh;
    display: flex;
    span {
        color: #666666;
        font-size: 12px;
        margin-right: 8px;
    }
    .el-checkbox-group{
        display: inline-block;
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
    float: right;
  padding: 1.2vh 2vw;
  color:$font-color3;
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

  
}
</style>





  