<template>
    <div class="pageLayer">
        <div class="pageTitle">重打印影票</div>
        <div class="contentLayer">
            <div class="queryDateForm">
                <div class="search-wrap">
                    <span>影票编号：</span>
                    <el-input  type="text" v-model="ticketCode" placeholder="请输入影票编号" size="medium"></el-input>  
                </div>
                <div class="search-wrap">
                    <span>销售单号：</span>
                    <el-input  type="text" v-model="saleBillCode" placeholder="请输入销售单号" size="medium"></el-input>  
                </div>
                <div class="search-wrap">
                    <span>收银员：</span>
                    <el-input  type="text" v-model="checker" placeholder="请输入收银员" size="medium"></el-input>  
                </div>
                <el-button size="medium" type="primary" style="margin-left:26px" @click="search">查询</el-button>
                <div class="time-way">
                    <span>交易时间：</span>
                    <el-radio-group v-model="status">
                        <el-radio :label="0">近30分钟</el-radio>
                        <el-radio :label="1">近一个小时</el-radio>
                        <el-radio :label="2">近2个小时</el-radio>
                        <el-radio :label="3">不限</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="tableLayer" v-show="0">
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
            <div class="tableLayer" v-show="1">
                <el-table
                ref="multipleTable"
                :data="tableData4"
                tooltip-effect="dark"
                style="width: 100%"
                header-cell-class-name="posTableHead"
                :row-class-name="rowClassName"
                >
                <el-table-column prop="info" label="场次信息" ></el-table-column>
                <el-table-column prop="seatStr"  label="座位号" width="100" ></el-table-column>
                <el-table-column prop="cinemaTicketCode" label="电影票编码" width="180"></el-table-column>
                <el-table-column prop="payTime" label="交易日期" width="180"></el-table-column>
                <el-table-column prop="userName" label="操作人" width="120"></el-table-column>
                <el-table-column  label="操作" width="90">
                    <template slot-scope="scope">
                    <!-- <span style="color:#3B74FF;border:1px solid;padding:2px;font-size:$font-size12">重打印</span>  -->
                    <el-button size="mini" @click="getPrintTicket(scope.$index)">{{scope.row.printCount > 0 ? '重打印' : '打印'}}</el-button>
                    </template>
                </el-table-column>
                <div slot="append" class="tableFoot" v-if="totalNum">
                    <div class="paginationLayer">
                    <div class="paginationInfo">共{{totalNum}}条记录 {{current}}/{{totalPage}}</div>
                    <div class="paginaButtoms">
                        <el-button size="mini" :disabled="current==1" @click="current--" >&lt;</el-button>
                        <el-button size="mini" :disabled="current == totalPage" @click="current++">&gt;</el-button>
                    </div>
                    </div>
                </div>
                </el-table>
            </div>
        </div>
        <div style="text-align:right;margin:2vh 1vw">
            <el-button type="primary" plain="" @click="back">返回</el-button>
        </div>
    </div>
</template>

<script>
import 'assets/css/table.scss'
import labelInput from 'components/labelInput/index'
import dateInput from 'components/dateInput/index'
import { posticketGetRep ,posticketPrintTicket,posticketTicketPrintNotify,} from 'http/apis'
import  app  from 'src/http/app'
import {mapState} from 'vuex';
export default {
    components:{
        labelInput,
        dateInput,
    },
    data(){
        return{
            saleBillCode: '',
            checker: '',
            ticketCode: '',
            status: 0,
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
            tableData4: [],
            flag : true,
            ticketActiveIndex:'',
            saleBillUid:'',
            ticketUids:[],
            pageSize:7,
            totalNum:0,
            current:1,
            totalPage:0,
            
        }
    },
    mounted(){

    },
    computed:{
        ...mapState({
        configData : state => state.config.configData
        })
    },
    methods: {
        removeTableButtom(){
        },
        rowClassName({row, rowIndex}){
        let className = rowIndex%2 ? 'posRowOdd' : 'posRowEven';
        return className;

        },
        search(){
            if(!this.ticketCode && !this.saleBillCode) return this.$message.warning('请输入影票编号或销售单号！');
            this.getShadowTicketData();

        },
        async getShadowTicketData(){
            const {  ticketCode, checker, saleBillCode, status,pageSize,current} = this
            const data = await posticketGetRep({
                ticketCode,
                checker,
                saleBillCode,
                status,
                size:pageSize,
                start:current
            })
            if(data.code !== 200) return this.$$message.error(data.msg);
            this.current = data.data.current;
            this.totalPage = data.data.pages;
            this.totalNum = data.data.total;
            this.tableData4 = data.data.records.map((item) => {
                item.info = `${item.hallName} ${item.movieName} ${item.showTime}`;
                item.seatStr = `${item.seatRow}排${item.seatColumn}号`
                return item
            });
            console.log(data)
        },
        async getPrintTicket(index){
            this.ticketActiveIndex = index
            const data = await posticketPrintTicket({
            getCode : this.tableData4[this.ticketActiveIndex].getCode,
            uid: `${this.tableData4[this.ticketActiveIndex].saleBillUid};${this.tableData4[this.ticketActiveIndex].cinemaTicketCode}`,
            })
            if(data.code != 200) return this.$message.error(data.msg)
            this.ticketUids = [];
            this.printTicket(data.data,data.data.length,this.reforPrintTicket)
            // this.printTicket(this.printData,this.printData.length,()=>{console.log(123)})
        },
        printTicket(dataArr,length,callback){
            app.printTicket('film_print',dataArr[length-1],this.configData,(res)=>{
                console.log(res)
                this.ticketUids.push(dataArr[length-1].ticket_element[0].movieTicketUid)
                if(res[0] !== 0){
                this.flag = false;
                }
                if(length -1 === 0){
                callback()
                }else{
                this.printTicket(dataArr,length-1,callback)
                }
            })
        },
        async reforPrintTicket(){
            let obj = {
            salesUid : this.tableData4[this.ticketActiveIndex].saleBillUid,
            ticketUid : this.ticketUids,
            state : this.flag ? 1 : 0,
            reason : this.flag ? '打印成功' : '打印失败',
            authAccount : '',
            is_reprint : this.tableData4[this.ticketActiveIndex].flag,
            }
            this.flag ?  this.$message.success('打印成功！') : this.$$message.error('打印失败！')
            const prIntData = await posticketTicketPrintNotify(obj)
            this.search()
        },
        handerCheck() {
            this.$router.push({
                name:'printcheck'
            })
        },
        back() {
            this.$router.go(-1)
        }
    },
    watch:{
        current(newVal){
            this.search();
        }
    }
}
</script>

<style lang="scss" scoped>
.pageLayer{
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
    padding: 0 1vw;
    flex:1;
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
        margin-left: 2vw;
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





  