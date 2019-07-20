<template>
  <div class="cinemaList">
    <!-- 面包屑 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>班次收银管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: 'list' }">班次收银管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: 'close' }">清机结算</el-breadcrumb-item>
    </el-breadcrumb> -->
    <div class="searchAdition">
      <p class="div_title"><i class="el-icon-arrow-down">基础信息</i></p>
      <el-form :inline="true" size="small" label-width="100px">
        <el-row :gutter="24" style="height:32px;">
          <el-col :span="7">
            <el-form-item label="订单编号:">
              <span>{{dataTotal.timeCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="收银员:">
              <span>{{dataTotal.workerName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="班次起始时间:">
              <span>{{dataTotal.workStartTime}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="21">
          <el-col :span="7">
            <el-form-item label="备用金:">
              <span>{{dataTotal.preAmount}}元</span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="票纸编号:">
              <span>{{dataTotal.tpCodeStart}}-{{dataTotal.tpCodeEnd}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 领用记录 -->
    <div class="table_div tb-edit">
      <p class="div_title">
        <i class="el-icon-arrow-down">领用记录</i>
      </p>
      <el-table :data="goodList" style="width: 100%;" @cell-click="handleCellClick">
        <el-table-column prop="thingName" label="领用物品">
        </el-table-column>
        <el-table-column prop="thingCount" label="领用数量">
        </el-table-column>
        <el-table-column prop="retThingCount" label="退还数量" :render-header="renderHeader">
          <template slot-scope="scope">
            <div class="input-box">
              <el-input size="small" @blur="handleInputBlur" v-model="scope.row.retThingCount" @input.native="retThing(scope.row,scope)"></el-input>
            </div>
            <span class="span-box">{{scope.row.retThingCount}}</span>
          </template>

        </el-table-column>
        <el-table-column prop="remain" label="售出数量">
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="200" :render-header="renderHeader">
          <template slot-scope="scope">
            <div class="input-box" >
              <el-input size="small" @blur="handleInputBlur" v-model="scope.row.remark"></el-input>
            </div>
            <span  class="span-box">{{scope.row.remark}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 班次收银登记 -->

    <div class="table_div">
      <p class="div_title">
        <i class="el-icon-arrow-down">班次收银登记</i>
      </p>
      <div class="searchAdition">
        <el-form :inline="true" size="small">
          <el-row :gutter="24" style="height:32px;">
            <el-col :span="5">
              <el-form-item label="抽钞累计:">
                <span>{{dataTotal.extractAmount}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="清机交付现金（含备用金）:" class="add_word" required>
                <el-input v-model.number="clearMoney"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="银行卡合计:" class="add_word" required>
                <el-input v-model.number="bandCardTotal"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <p class="total-money">总共：{{totalMoney}}元</p>
        </el-form>
      </div>
    </div>
    <!-- 底部 -->
    <div style="height:80px;background:transparent;"></div>
    <div class="bottom-handler-tool">
      <div class="btn-area">
        <el-button type="primary" @click="nextClear">下一步</el-button>
        <el-button @click="$router.push('list')">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  // let onlyNumber = function (e) {
  //   e.target.value = e.target.value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
  //   e.target.value = e.target.value.replace(/^\./g, ""); //验证第一个字符是数字而不是.
  //   e.target.value = e.target.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的.
  //   e.target.value = e.target.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", "."); //只允许输入一个小数点
  //   e.target.value = e.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
  // }
  export default {
    data() {
      return {
        dataTotal: {}, //总数据
        goodList: [], //领用记录
        inputShow: false,
        spanShow: true,
        bandCardTotal: "",
        clearMoney: "",
        totalMoney: ""
      }
    },
    methods: {
      getDetail() {
        let limit = {
          workTimeUid: this.$route.query.uid
        };
        this.$csmList.clearOne(Object.assign({}, limit))
          .then(data => {
            console.log(data)
            if (data && data.code === 200) {
              this.dataTotal = data.data
              this.goodList = data.data.timeGetThings
              this.totalMoney = Number(this.dataTotal.extractAmount).toFixed(2)
            }
          })
      },
      cancelFun() {

      },
      //单元格点击后，显示input，并让input 获取焦点
      handleCellClick (row, column, cell, event) {
        this.handleInputBlur()
        try {
          cell.firstElementChild.firstElementChild.style.setProperty('display', 'block', 'important');
          cell.firstElementChild.lastElementChild.style.setProperty('display','none','important')
          // console.log(cell.firstElementChild.lastElementChild)
        } catch (error) {
         
        }
      },
      //input框失去焦点事件 当 input 失去焦点 时,input 切换为 span
      handleInputBlur() {
        let elementList = document.querySelectorAll(".tb-edit .input-box")
          elementList.forEach(el => {
            el.style.setProperty('display', 'none');
            el.nextElementSibling.style.setProperty('display','block')
        });
      },
      // render 事件
      renderHeader(h, {
        column
      }) { // h即为cerateElement的简写，具体可看vue官方文档
        return h(
          'div',
          [
            h('span', column.label),
            h('i', {
              class: 'el-icon-edit-outline',
              style: 'color:#909399;margin-left:5px;'
            })
          ],
        );
      },
      retThing(row,scope){
        // console.log(scope.column.id)
        // let el = document.querySelectorAll(`.${scope.column.id}`)
        // console.log(el)
        let reg = /^[+]{0,1}(\d+)$/g;
        if(reg.test(row.retThingCount) && Number(row.retThingCount)<=Number(row.thingCount)){
          row.remain = Number(row.thingCount) - Number(row.retThingCount)
        }else{
          this.$message.error('只能填入小于或等于领取数量的正整数');
          row.retThingCount = ""
        }
      },
      // 清机结算 （第二步）
      nextClear() {
        let limit = {
          uid: this.$route.query.uid,
          clearMoney:this.clearMoney,
          bandCardTotal:this.bandCardTotal,
        };
        let timeGetThings = this.goodList
        this.$csmList.clearTwo(Object.assign({}, limit,{timeGetThings}))
          .then(data => {
            console.log(data)
            if (data && data.code === 200) {
              this.$router.push({
                path:'detail',
                query:{
                  parentPage:'clear',
                  uid: this.$route.query.uid,
                  timeCode:this.$route.query.timeCode
                }
              })
            }else{
              this.$message({
                type: 'error',
                message: `{data.data}`
              });
            }
          })
      },
    },
    
    watch: {
      clearMoney() {
        this.totalMoney = Number(this.dataTotal.extractAmount) + Number(this.clearMoney) + Number(this.bandCardTotal)
        this.totalMoney = this.totalMoney.toFixed(2)
      },
      bandCardTotal() {
        this.totalMoney = Number(this.dataTotal.extractAmount) + Number(this.clearMoney) + Number(this.bandCardTotal)
        this.totalMoney = this.totalMoney.toFixed(2)
      },
      retThingCount(){
        console.log(111)
        // this.remain = Number(this.goodList.thingCount)  -  Number(this.retThingCount)
        // console.log(this.remain,this.goodList)
      }
    },
    created() {
      console.log(this.$route.query.uid)
      this.getDetail();
    }
  };
</script>
<style lang="scss" scoped>
  .el-table .cell {
    width: 100%;
    height: 100%;

  }

  .tb-edit .input-box {
    display: none;
    width: 100%;
    height: 23px;

    /deep/ .el-input__inner {
      font-size: 14px;
      border: none;
      outline: none;
    }
  }

  // 去除标签高度
  /deep/ .el-table th div {
    line-height: 23px;
    height: 23px;
  }

  .span-box {
    // display: none;
    width: 100%;
    height: 100%;
  }

  //  提示信息
  .el-form {
    box-sizing: border-box;
    overflow: hidden;

    .el-row {
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }

  .add_word {
    &::after {
      content: '元';
      display: inline-block;
      margin-left: 5px;
      font-size: 14px
    }
  }

  // title 
  .table_div,
  .searchAdition {
    margin-bottom: 20px;
  }

  .div_title {
    padding: 1em;
    // overflow: hidden;
    line-height: 32px;

    .title_btn {
      padding: 8px 12px;
      float: right;
      margin-right: 12px;
      // width: 88px;
      height: 32px;

      span {
        font-size: 12px;
      }
    }

    &::after {
      content: '';
      display: block;
      clear: both;
    }

    &::before {
      content: '';
      display: inline-block;
      width: 2px;
      height: 10px;
      background-color: rgb(25, 40, 80);
      margin-right: 10px;
    }

    // border-left: 2px rgb(25, 40, 80) solid;
    .el-icon-arrow-down:before {
      margin-right: 5px;
    }
  }

  // 基础信息
  .el-form-item__label,
  .el-form-item__content span {
    font-size: 12px;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  // 设置表单增删的长度
  .content {
    // .el-input {
    //   width: 192px;
    // }

    .like_ul {
      padding: 8px 8px 0;
    }

    .el-form-item {
      margin: 0;
    }
  }

  //设置折叠框箭头和位置
  .el-collapse-item__arrow {
    margin: 0 8px 0;
    // transform: rotate(-90deg);
  }

  .el-collapse-item__header {
    display: inline-block;
    border-bottom: none;
    position: relative;
    padding: 7px 0;
    font-size: 14px;
    color: #333;

    &::after {
      left: 0;
      bottom: 0;
      width: 968px;
      height: 1px;
      content: "";
      position: absolute;
      background-color: #ebeef5;
      z-index: 1;
    }
  }

  .like-lable {
    color: #606266;
    padding: 0 12px 0 0;
    width: 100px;
    box-sizing: border-box;
    white-space: nowrap;
    text-align: right;
  }

  .search-time {
    display: flex;
  }

  .el-input--suffix {
    width: 177px;
  }

  .search-btn {
    margin-left: 30px;
  }

  .total-money {
    text-align: right;
    padding-right: 200px;
    font-size: 16px;
    font-weight: 600;
    margin-top: 3em;
  }

  // 底部
  .bottom-handler-tool {
    height: 64px;
    width: 100%;
    // position: fixed;
    // z-index: 999;
    bottom: 0;
    right: 0;
    background-color: #f5f5f5;

    .btn-area {
      width: 500px;
      margin: 0 auto;
      height: 64px;
      text-align: center;
      padding-top: 16px;
      box-sizing: border-box;
    }
  }
</style>