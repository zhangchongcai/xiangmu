<template>
    <div class="setting">
        <div class="contents-container">
              <div class="items">
                  <span>影票打印机:</span>
                  <div class="selector-box">
                   <!-- film_print  -->
                    <v-select>
                      <el-select @change="filmPrintHandleChange" v-model="filmPrintValue" placeholder="请选择" class="el-select-width" size="medium">
                        <el-option
                          v-for="item in options.film_print"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name"
                        >
                        </el-option>
                      </el-select>
                    </v-select>
                  </div>
              </div>
              <div class="items-right paddingRight20">
                 <span>读卡器:</span>
                 <div class="selector-box">
                   <!-- card_reader  -->
                    <v-select>
                      <el-select @change="cardReaderHandleChange" v-model="cardReaderValue" placeholder="请选择" class="el-select-width" size="medium">
                        <el-option
                          v-for="item in options.card_reader"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name"
                        >
                        </el-option>
                      </el-select>
                    </v-select>
                 </div>
             </div>
             <div class="items-right ">
                 <span>票券打印机:</span>
                  <div class="selector-box">
                    <!-- coupon_print  -->
                    <v-select>
                      <el-select @change="couponPrintHandleChange" v-model="couponPrintValue" placeholder="请选择" class="el-select-width" size="medium">
                        <el-option
                          v-for="item in options.coupon_print"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name"
                        >
                        </el-option>
                      </el-select>
                    </v-select>
                 </div>
             </div>
            <div class="items paddingRight20">
              <span>小票打印机:</span>
              <div class="selector-box">
                <!-- bill_print -->
                <v-select>
                  <el-select @change="billPrintHandleChange" v-model="billPrintValue" placeholder="请选择" class="el-select-width" size="medium">
                    <el-option
                      v-for="item in options.bill_print"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"
                    >
                    </el-option>
                  </el-select>
                </v-select>
              </div>
             </div>

             <div class="items">
                  <span>钱箱接口:</span>
                  <div class="selector-box">
                    <!-- cash_box  -->
                    <v-select>
                      <el-select @change="cashBoxHandleChange" v-model="cashBoxValue" placeholder="请选择" class="el-select-width" size="medium">
                        <el-option
                          v-for="item in options.cash_box"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name"
                        >
                        </el-option>
                      </el-select>
                    </v-select>
                  </div>
             </div>
            <div class="items-right paddingRight20">
                 <span>密码键盘:</span>
                 <div class="selector-box">
                  <!-- keyboard  -->
                  <v-select>
                    <el-select @change="keyboardHandleChange" v-model="keyboardValue" placeholder="请选择" class="el-select-width" size="medium">
                      <el-option
                        v-for="item in options.keyboard"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name"
                      >
                      </el-option>
                    </el-select>
                  </v-select>
                 </div>
             </div>
             <div class="items">
                 <span>银行卡支付对接银联POS机类型:</span>
                 <div class="selector-box">
                   <!-- pos_type  -->
                    <v-select>
                      <el-select @change="posTypeHandleChange" v-model="posTypeValue" placeholder="请选择" class="el-select-width" size="medium">
                        <el-option
                          v-for="item in options.pos_type"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name"
                        >
                        </el-option>
                      </el-select>
                    </v-select>
                 </div>
             </div>

             <div class="items paddingRight20">
                 <span>POS机客显类型:</span>
                 <div class="selector-box">
                   <!-- pos_show_type  -->
                    <v-select>
                      <el-select @change="posShowTypeHandleChange"  v-model="posShowTypeValue" placeholder="请选择" class="el-select-width" size="medium">
                        <el-option
                          v-for="item in options.pos_show_type"
                          :key="item.name"
                          :label="item.name"
                          :value="item.name"
                        >
                        </el-option>
                      </el-select>
                    </v-select>
                 </div>
             </div>

             <div class="items">
                 <span>影票打印机偏移坐标:</span>
                 <div class="selector-box coord">
                     <span style="margin-right: 4px">x</span>
                     <el-input class="coord-input" type="tel" @change="xNumHandleChange" v-model="xNum" placeholder="请输入内容"></el-input>
                     <span style="margin-left: 4px;">像素</span>
                     <span style="margin-right: 4px; margin-left: 10px">y</span>
                     <el-input class="coord-input" type="tel" @change="yNumHandleChange" v-model="yNum" placeholder="请输入内容"></el-input>
                     <span style="margin-left: 4px;">像素</span>
                 </div>
             </div>
             <div class="items width100Item">
                 <span>终端售卖商品范围:</span>
                 <div class="selector-box">
                    <el-radio-group v-model="options.counter_type_value">
                      <el-radio label="movie">影票</el-radio>
                      <el-radio label="goods">小卖</el-radio>
                      <el-radio label="both">全部</el-radio>
                    </el-radio-group>
                 </div>
             </div>
             <div class="items width100Item">
                 <span>售卖卖品是否直接出库:</span>
                 <div class="selector-box" :style="{flex:1}">
                    <el-radio-group  @change="saleGoodsPrintTypeChange"
                    v-model="saleGoodsPrintType">
                      <el-radio :label="1">直接出库（不打印取货凭证）</el-radio>
                      <el-radio :label="0">不出库（打印取货凭证）</el-radio>
                    </el-radio-group>
                 </div>
             </div>
             <div class="items width100Item">
                 <span>是否启用虚拟键盘输入:</span>
                 <div class="selector-box">
                    <el-radio-group @change="keyboardValueChange" v-model="fictitiousKeyboardValue">
                      <el-radio :label="0">否</el-radio>
                      <el-radio :label="1">是</el-radio>
                    </el-radio-group>
                 </div>
             </div>

             
             

             
        </div>
        <div class="setting-footer">
            <button class="setting-btn" @click="close">取消</button>
            <button class="setting-btn setting-confirm" @click="writeTerminalParameter()">确定</button>
        </div>
    </div>
</template>

<script>
import vSelect from "components/select/index";
import * as TYPES from '../../../newVuex/types'
import { VM_LOGIN_SET_MENU } from 'types/vmOnType'
import util from "../../../http/app";
export default {
  data() {
    return {
      checked:false,
      options:{},
      xNum: 0,
      yNum: 0,
      filmPrintValue: "",
      billPrintValue: "",
      cashBoxValue: "",
      couponPrintValue: "",
      cardReaderValue: "",
      keyboardValue: "",
      posTypeValue:"",
      posShowTypeValue:"",
      counterTypeValue:"movie",
      saleGoodsPrintType:0,
      fictitiousKeyboardValue:0,
    };
  },
  components: {
    vSelect
  },
  methods: {
    //电影打印机监听下拉框值的变动
    filmPrintHandleChange(newVal) {
      for (let i = 0; i < this.options.film_print.length; i++) {
        if (this.options.film_print[i].name == newVal) {
          this.options.film_print[i].selected = true;
        } else {
          this.options.film_print[i].selected = false;
        }
      }
    },
    //小票打印机监听下拉框值的变动
    billPrintHandleChange(newVal) {
      for (let i = 0; i < this.options.bill_print.length; i++) {
        if (this.options.bill_print[i].name == newVal) {
          this.options.bill_print[i].selected = true;
        } else {
          this.options.bill_print[i].selected = false;
        }
      }
    },
    //钱箱监听下拉框值的变动
    cashBoxHandleChange(newVal) {
      for (let i = 0; i < this.options.cash_box.length; i++) {
        if (this.options.cash_box[i].name == newVal) {
          this.options.cash_box[i].selected = true;
        } else {
          this.options.cash_box[i].selected = false;
        }
      }
    },
    //票券打印机监听下拉框值的变动
    couponPrintHandleChange(newVal) {
      for (let i = 0; i < this.options.coupon_print.length; i++) {
        if (this.options.coupon_print[i].name == newVal) {
          this.options.coupon_print[i].selected = true;
        } else {
          this.options.coupon_print[i].selected = false;
        }
      }
    },
    //读卡器监听下拉框值的变动
    cardReaderHandleChange(newVal)  {
      for (let i = 0; i < this.options.card_reader.length; i++) {
        if (this.options.card_reader[i].name == newVal) {
          this.options.card_reader[i].selected = true;
        } else {
          this.options.card_reader[i].selected = false;
        }
      }
    },
    //密码键盘监听下拉框值得变动
    keyboardHandleChange(newVal) {
      for (let i = 0; i < this.options.keyboard.length; i++) {
        if (this.options.keyboard[i].name == newVal) {
          this.options.keyboard[i].selected = true;
        } else {
          this.options.keyboard[i].selected = false;
        }
      }
    },
    //终端售卖商品范围的变动
    counterTypeHandleChange(newVal) {
      for (let i = 0; i < this.options.counter_type.length; i++) {
        if (this.options.counter_type[i].code == newVal) {
          this.options.counter_type[i].selected = true;
        } else {
          this.options.counter_type[i].selected = false;
        }
      }
    },
    //POS机客显类型监听下拉框值的变动
    posShowTypeHandleChange(newVal){      
      for (let i = 0; i < this.options.pos_show_type.length; i++) {
        if (this.options.pos_show_type[i].name == newVal) {
          this.options.pos_show_type[i].selected = true;
        } else {
          this.options.pos_show_type[i].selected = false;
        }
      }
    },
    //银行卡支付对接银联POS机类型监听下拉框值的变动
    posTypeHandleChange(newVal){
      for (let i = 0; i < this.options.pos_type.length; i++) {
        if (this.options.pos_type[i].name == newVal) {
          this.options.pos_type[i].selected = true;
        } else {
          this.options.pos_type[i].selected = false;
        }
      }
    },
    //打印机打印偏移坐标监听值x的变动
    xNumHandleChange(newVal){
      this.options.film_print_offset.x = newVal;
    },
    //打印机打印偏移坐标监听值y的变动
    yNumHandleChange(newVal){
      this.options.film_print_offset.y = newVal;
    },
    saleGoodsPrintTypeChange(newVal){
      this.options.sale_goods_print_type = newVal
    },
    keyboardValueChange(newVal){
      this.options.fictitious_keyboard = newVal
    },
    close(){
      let globalAppState = JSON.parse(localStorage.getItem('globalAppState')) 
      if(!globalAppState) {
        if(['both','movie'].includes(this.options.counter_type_value)){
                this.$router.push({path: '/home'})
          }else{
              this.$router.push({path: '/home/goods/cellgoods'})
          }
          return
      }
      if( this.$store.getters.configData.isSetting) {
        if(['both','movie'].includes(this.options.counter_type_value)){
                this.$router.push({path: '/home'})
          }else{
              this.$router.push({path: '/home/goods/cellgoods'})
          }
      }
    },
    //读取终端参数配置的回调
    readTerminalParameterFunc() {
      //电影打印机默认选中
      if(this.options.film_print){
        this.options.film_print.forEach(element => {
          if (element.selected) {
            this.filmPrintValue = element.name;
          }
        });
      }
      //小票打印机默认选中
      if(this.options.bill_print){
        this.options.bill_print.forEach(element => {
          if (element.selected) {
            this.billPrintValue = element.name;
          }
        });
      }
      //票券打印机默认选中
      if(this.options.coupon_print){
        this.options.coupon_print.forEach(element => {
          if (element.selected) {
            this.couponPrintValue = element.name;
          }
        });
      }
      //钱箱默认选中
      if(this.options.cash_box){
        this.options.cash_box.forEach(element => {
          if (element.selected) {
            this.cashBoxValue = element.name;
          }
        });
      }
      //读卡器默认选中
      if(this.options.card_reader){
        this.options.card_reader.forEach(element => {
          if (element.selected) {
            this.cardReaderValue = element.name;
          }
        });
      }
      //密码键盘默认选中
      if(this.options.keyboard){
        this.options.keyboard.forEach(element => {
          if (element.selected) {
            this.keyboardValue = element.name;
          }
        });
      }
      //终端售卖商品范围选中
      if(this.options.counter_type){
        this.options.counter_type.forEach(element => {
          if (element.selected) {
            this.counterTypeValue = element.code;
          }
        });
      }
      //银行卡支付对接银联POS机类型选中
      if(this.options.pos_type){
        this.options.pos_type.forEach(element => {
          if (element.selected) {
            this.posTypeValue = element.name;
          }
        });
      }else {
        this.options.pos_type = [
                                    {
                                      code : '2',
                                      name : '不对接',
                                      selected : false
                                    },
                                        {
                                          code : '0',
                                      name : '快钱POS机',
                                      selected : false
                                      },
                                      {
                                          code : '1',
                                      name : '杉德POS机',
                                      selected : false
                                      }
                                ];
      }
      //POS机客显类型选中
      if(this.options.pos_show_type){
        this.options.pos_show_type.forEach(element => {
          if (element.selected) {
            this.posShowTypeValue = element.name;
          }
        });
      }else {
        this.options.pos_show_type = [
                                        {
                                          code : ' ',
                                        name : '无客显',
                                        selected : false
                                        },
                                        {
                                          code : 'ZHONGQI',
                                        name : '中崎',
                                        selected : false
                                        },
                                        {
                                          code : 'XINGQIAO',
                                        name : '星乔',
                                        selected : false
                                        }
                                      ];
      }
      //打印偏移量
      if(this.options.film_print_offset) {
        this.xNum = this.options.film_print_offset.x;
        this.yNum = this.options.film_print_offset.y;
      }
      console.log(this.options);
      // 售卖卖品是否直接出库:
      this.saleGoodsPrintType = this.options.sale_goods_print_type;
      this.fictitiousKeyboardValue = this.options.fictitious_keyboard;
    },
    //写入终端参数配置
    writeTerminalParameter() {
      if(!this.filmPrintValue) return this.$message.error('请选择影票打印机！')
      if(!this.cardReaderValue) return this.$message.error('请选择读卡器！')
      if(!this.couponPrintValue) return this.$message.error('请选择票券打印机！')
      if(!this.billPrintValue) return this.$message.error('请选择小票打印机！')
      if(!this.cashBoxValue) return this.$message.error('请选择钱箱接口！')
      if(!this.keyboardValue) return this.$message.error('请选择密码键盘！')
      // if(!this.posTypeValue) return this.$message.error('请选择银联POS机类型！')
      // if(!this.posShowTypeValue) return this.$message.error('请选择POS机客显类型！')
      if(this.xNum === '') return this.$message.error('请输入影票打印机偏移x坐标！')
      if(this.yNum === '') return this.$message.error('请输入影票打印机偏移y坐标！')
      this.options.isSetting = true
      util.writeTerminalParameter(
        this.options,
        (args)=>{
         if(typeof(args)=="string"){
            alert(args)
            return
          }else if(args[0]=="-1"){
            alert("读卡失败！"+args[1])
            return
          }else{
            this.$store.commit(TYPES.SET_CONFIG_DATA, JSON.parse(JSON.stringify(this.options)));
            this.$message.success('保存成功');
            this.$vm.$emit(VM_LOGIN_SET_MENU)
            if(['both','movie'].includes(this.options.counter_type_value)){
                  this.$router.push({path: '/home'})
              }else{
                  this.$router.push({path: '/home/goods/cellgoods'})
              }
          }
        }
      );
    }
  },
  mounted() {
    // this.options=this.$store.state.config.configData
    //深拷贝
    this.options = JSON.parse(JSON.stringify(this.$store.getters.configData))
    this.readTerminalParameterFunc();
  }
};
</script>

<style lang="scss" scoped>
.setting {
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  font-size: $font-size13 !important;
  color: $font-color6;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .setting-header {
    position: position;
    top: 0;
    left: 0;
    width: 100vw;
    height: 6.3vh;
    box-sizing: border-box;
    padding: 0 30px;
    @include bg_color($themeColor);
    display: flex;
    align-items: center;
    color: $font-color-white;
    font-size: $font-size16;
  }

  .contents-container {
    width: 100vw;
    display: flex;
    flex-wrap: wrap;
    padding: 30px 0px;
    box-sizing: border-box;
    flex: 1;
    align-content: start;
    
    .left {
      flex: 0 0 50%;
      box-sizing: border-box;
      padding: 5.4vw 2vw;
      display: flex;
      flex-direction: column;
    }

    .right {
      flex: 0 0 50%;
      box-sizing: border-box;
      padding: 5.4vw 3.4vw;
      display: flex;
      flex-direction: column;
    }

    .items-right {
      display: flex;
      width: 50%;
      align-items: center;
      justify-content: flex-end;
      margin-bottom: 20px;
      & > span{
        width: calc(50vw - 29.3vw - 6px);
        text-align: right;
      }
    }

    .items {
      display: flex;
      width: 50%;
      align-items: center;
      justify-content: flex-end;
      margin-bottom: 20px;
      & > span{
        width: calc(50vw - 29.3vw - 6px);
        text-align: right;
      }
    }
    .paddingRight20{
      box-sizing: border-box;
      padding-right: 20px;
    }
    .width100Item{
      width: 100%;
      justify-content: flex-start;
    }
    .selector-box {
      width: 29.3vw;
      min-width: 29.3vw;
      height: 5.2vh;
      //    border: 1px solid #dedede;
      margin-left: 6px;
      display: flex;
      align-items: center;

      .el-select-width {
        width: 29.3vw;
      }

      .coord-input {
        width: 9.4vw;
        height: 5.2vh;
      }
    }
    
  }

  .setting-footer {
    position: position;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 6.8vh;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .setting-btn {
      width: 7.8vw;
      height: 4.2vh;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      border-radius: 2px;
      border: 1px solid $btn-background-color-theme;
      background: #ffffff;
      color: $font-color-blue;
    }

    .setting-confirm {
      background: $btn-background-color-theme;
      color: $font-color-white;
      margin: 0 20px;
    }
  }
}
</style>
