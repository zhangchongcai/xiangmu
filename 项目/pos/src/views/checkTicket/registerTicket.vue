<template>
  <div class="pageLayer">
    <div class="pageTitle">补登票</div>
    <div class="contentLayer">
      <div class="queryDateForm">
        <date-input :style="{width:'30vw',}" v-model="date" @change="dateChange"></date-input>
        <v-select>
          <el-select v-model="value" placeholder="请选择电影" class="select" size="medium" @change="subValue=''">
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
          <el-select v-model="subValue" placeholder="请选择场次" size="medium" @change="getTabelDate">
            <template v-if="value!==''">
              <el-option
              v-for="(item,index) in options[value].arr_plan_list"
              :key="index"
              :label="item.label"
              :value="item.value">
              </el-option>
            </template>
          </el-select>
        </v-select>
        <label-input label="影票单价：" type="number" v-model="moviePrice" placeholder="请输入影票单价" inputW="17.5vw" unit="元"></label-input>
        <label-input label="增值服务费(单张)：" type="number"  labelW="11.5vw"  v-model="servicePrice"  inputW="17.5vw" placeholder="请输入增值服务费(单张)" ></label-input>
        <label-input label="影票数量：" type="number"  v-model="movieNum" placeholder="请输入影票数量"  inputW="17.5vw"></label-input>
        <label-input label="现金支付：" type="number"  v-model="cashPay" placeholder="请输入现金支付" unit="元" inputW="17.5vw"></label-input>
        <label-input label="银联支付：" type="number"  labelW="11.5vw" v-model="bankPay" placeholder="请输入银联" inputW="17.5vw"></label-input>
        <div class="priceItem"><span>单价总计：</span><b>{{unitPrice}}元</b></div>
        <div class="priceItem"><span>总价：</span><b>{{totalPrice}}元</b></div>
        <el-button size="medium" @click="addItem">添加</el-button>
      </div>
      <div class="tableLayer">
        <el-table
          ref="multipleTable"
          :data="tableData3"
          tooltip-effect="dark"
          style="width: 100%"
          header-cell-class-name="posTableHead"
          :row-class-name="rowClassName"
          max-height="580"
          >
          <el-table-column prop="price" label="影票单价(元)" width="100"></el-table-column>
          <el-table-column prop="addFee"  label="增值服务费(张/元)" width="140"></el-table-column>
          <el-table-column prop="total" label="单价合计(元)" width="120"></el-table-column>
          <el-table-column prop="count" label="数量" width="60"></el-table-column>
          <el-table-column prop="payStr" label="支付" ></el-table-column>
          <el-table-column prop="totalPrice" label="合计(元)" width="80"></el-table-column>
          <el-table-column prop="reportStatus" label="上报状态" width="80"></el-table-column>
          <el-table-column prop="applyStatusStr" label="受理状态" width="120" ></el-table-column>
          <el-table-column  label="操作" width="50">
            <template slot-scope="scope">
              <i v-if="scope.row.planUid" class="iconfont iconshanchu" :class="!scope.row.planUid ? 'invalid' : ''" @click="delItem(scope.row.planUid ? true:false,scope.$index)"></i> 
            </template>
          </el-table-column>
          <div slot="append" class="tableFoot">
            <div class="paginationLayer">
            </div>
            <div class="price">总计：<span><b>{{tableTotalPrice}}</b>元</span></div>
          </div>
        </el-table>
      </div>
    </div>
    <div class="footButtomLayer">
      <el-button size="medium" @click="$router.go(-1)">关闭</el-button>
      <el-button size="medium" type="primary" @click="refer" :loading="loading">上报补登</el-button>
    </div>
    <el-dialog title="操作提示" :visible.sync="visible" width="30%">
      <div class="dialogContent">
        <span class="iconLayer"><i class="iconfont " :class="dialogType? 'icontishichenggongtubiao' : 'icontishigantanhao'"></i></span> 
        <span>{{dialogStr}}</span>
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
import { saleBillAppendSaleQuerySessionUnSalable,saleBillAppendGetAppendedInfo,saleBillAppendSave } from 'http/apis'
export default {
  components:{
    vSelect,
    labelInput,
    dateInput,
  },
  data(){
    return{
      date:new Date(),
      options: [],
      value: '',
      subValue:'',
      num:'',
      visible:false,
      dialogType:0, //
      dialogStr:'',
      moviePrice:'',
      servicePrice:'',
      movieNum:'',
      cashPay:0,
      bankPay:0,
      tableData3: [],
      multipleSelection: [],
      applyStatusStrs:['','不需要审核','未受理','受理成功','受理中','受理失败'],
      loading:false,
    }
  },
  computed:{
    unitPrice(){
      let moviePrice = this.moviePrice ? this.moviePrice : 0;
      let servicePrice = this.servicePrice ? this.servicePrice : 0
      return Number( Number(moviePrice)  + Number(servicePrice) ).toFixed(2)
    },
    totalPrice(){
      let num = this.movieNum ? this.movieNum : 1
      return (this.unitPrice * Number(num)).toFixed(2);
    },
    tableTotalPrice(){
      let num = 0;
      this.tableData3.map((item,index)=>{
        num += Number(item.totalPrice)
      })
      return num.toFixed(2)
    },
    dateStr(){
      return `${this.date.getFullYear()}-${this.date.getMonth()+1 >9 ?this.date.getMonth()+1:'0'+(this.date.getMonth()+1)}-${this.date.getDate() >9 ? this.date.getDate():'0'+this.date.getDate()}`
    }
  },
  async mounted(){
    await this.getSelectData()
    // await this.getTabelDate()
  },
  
  methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      async getSelectData(){
        const data = await saleBillAppendSaleQuerySessionUnSalable({
          date:this.dateStr,
        })
        if(data.code == 200){
          data.data.map((item,index)=>{
            item.label = item.name+'('+item.language+'/'+item.play_effect+')';
            item.value = index
            item.arr_plan_list.map((subItem,subIndex)=>{
              subItem.label = subItem.hall_name+subItem.show_time.split(' ')[1]
              subItem.value = subIndex;
            })
          })
          
          this.options = data.data
        }else{
          this.$message.error(data.msg);
        }
      },
      async getTabelDate(){
        const data = await saleBillAppendGetAppendedInfo({
          planCode:this.options[this.value].arr_plan_list[this.subValue].plan_code
        })
        if(data.code !=200){
          return this.$message.error(data.msg);
        }
        data.data.map((item,index)=>{
          item.totalPrice = (Number(item.total) * item.count).toFixed(2);
          item.applyStatusStr = this.applyStatusStrs[item.applyStatus];
          item.payStr = `现金${item.cashPay}元 银联${item.bankCardPay}元`
        })
        this.tableData3 = data.data;
      },
      dateChange(date){
        this.value = '';
        this.subValue = '';
        this.getSelectData();
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
      dialogOpen(type,str){
        this.dialogType=0;
        this.dialogStr = str;
        this.visible=true
      },
      addItem(){
        if(this.subValue === '') return this.dialogOpen(0,'请选择场次！');
        if(!this.moviePrice || !this.servicePrice || !this.movieNum) return this.dialogOpen(0,'请输入影票单价，增值服务费(单张)以及影票数量！');
        if(this.cashPay=== '' || !this.bankPay ==='') return this.dialogOpen(0,'请输入现金，银联支付金额！');
        if(Number(this.cashPay)+Number(this.bankPay) != this.totalPrice) return this.dialogOpen(0,'现金、银联与总价不一致！')
        const min_price = this.options[this.value].arr_plan_list[this.subValue].min_price
        if(this.moviePrice < min_price) return this.dialogOpen(0,`票价不能低于${min_price}`)
        if(this.moviePrice > 999.99) return this.dialogOpen(0,`票价不能大于999.99元`)
        if(this.servicePrice > 999.99) return this.dialogOpen(0,`增值服务费不能大于999.99元`)
        let obj = {
          price:Number(this.moviePrice).toFixed(2),
          addFee:Number(this.servicePrice).toFixed(2),
          total:this.unitPrice,
          count:this.movieNum,
          payStr:`现金${this.cashPay?this.cashPay:0}元 银联${this.bankPay?this.bankPay:0}元`,
          bankCardPay:this.bankPay,
          cashPay:this.cashPay,
          totalPrice:this.totalPrice,
          reportStatus:'未上报',
          applyStatusStr:this.applyStatusStrs[2],
          mac:'01',
          planUid:this.options[this.value].arr_plan_list[this.subValue].id,
          authorizationPeopleUid:'2222'
        };
        this.tableData3.push(obj);
        this.dialogOpen(1,'添加成功！')
        this.moviePrice = '';
        this.servicePrice= '';
        this.movieNum = '';
        this.cashPay = 0;
        this.bankPay = 0;
      },
      async refer(){
        let referArr = this.tableData3.filter( item => item.planUid )
        if(!referArr.length) return this.$message.warning('请先添加上报影票!');
        this.loading = true
        const data = await saleBillAppendSave(referArr)
        this.loading = false
        if(data.code != 200) return this.$message.error(data.msg);
        this.getTabelDate();
        this.$message.success(data.msg);
      },
      delItem(type,index){
        if(type){
          this.tableData3.splice(index,1);
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
  .priceItem{
    
    margin-right: 3vw;
    span{
      font-size: 13px;
    }
    b{
      color:#FF8618;
      font-size: 13px;
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
    font-size: 14px;
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
.invalid{
  color:#666;
}
.pageLayer{
  display: flex;
  flex-direction: column;
  height: 100vh;
  .contentLayer{
    flex: 1;
  }
  .footButtomLayer{
    padding: 1.5vh 2vw;
  }
}
</style>





  