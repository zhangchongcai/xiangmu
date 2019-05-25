<template>
  <div class="member-moreSelectOneWarp">
    <div class="more-choose" @click="showDialog" v-show="dataListAll.length > 3">
      更多
    </div>
    <div class="nowarp">
      <div 
        :class="item.member_active?'select-one nowarp-One select-active' : 'select-one nowarp-One' " 
        v-for="(item,index) in dataList"
        :key="index" @click="clickSelectOne(index)">
        <div class="name" v-text="name?item[name]:item.acticityName"> </div>
        <div class="icon">
          <label :for="'lableID'+index" class="lable-icon" style="position:absolute;z-index:5">
            <i data-v-6018a2e2="" class="selectIcon iconfont iconyuanxingxialajiantou"></i>
          </label>
          <el-popover placement="bottom" trigger="click" :visible-arrow="false" :content="remark?item[remark]:item.acticityName">
            <el-button :id="'lableID'+index" slot="reference" class="icon-btn">

            </el-button>
          </el-popover>
        </div>
      </div>
    </div>
    <dialogWarp :dialogVisible.sync="dialogTableVisible" name="更多充值优惠活动">
      <div class="morecontent">
        <div :class="item.memberwarp_active?'select-one nowarp-One select-active' : 'select-one nowarp-One' " v-for="(item,index) in dataListOther"
          :key="item.id" 
          @click="clickSelectWarpOne(index)">
          <div class="name" v-text="name?item[name]:item.acticityName"> </div>
          <div class="icon">
            <label :for="'lablewarID'+index" class="lable-icon" style="position:absolute;z-index:5">
              <i data-v-6018a2e2="" class="selectIcon iconfont iconyuanxingxialajiantou"></i>
            </label>
            <el-popover placement="bottom" trigger="click" :visible-arrow="false" :content="remark?item[remark]:item.acticityName">
              <el-button :id="'lablewarID'+index" slot="reference" class="icon-btn">

              </el-button>
            </el-popover>
          </div>
        </div>
        <div class="isok">
          <el-row>
            <el-col :span="22">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="dataTotal"
                :page-size="9"
                @current-change='handleCurrentChange'
                style="text-align:center">
              </el-pagination>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" @click="subOk">确定</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </dialogWarp>
  </div>
</template>
<script>
import dialogWarp from "./dialogWarp";
export default {
  components: {
    dialogWarp
  },
  data() {
    return {
      index: -1,
      warpIndex: -1,
      dialogTableVisible: false,
      dataList: [],//也面显示3个
      dataListOther: [],//更多
      selectItem: "",
      dataTotal:0,
      cuttingList:[],//切割数据存放
    };
  },
  props: {
    remark: {
      type: String
    },
    name: {
      type: String
    },
    dataListAll:{
      type:Array
    }
  },
  created() {
    this.getThree();
  },
  methods: {
    getThree() {
      var array = this.dataListAll;
      var dataList = [];
      var dataListOther = [];
      for (let index = 0; index < array.length; index++) {
        if (index < 3) {
          dataList.push(array[index]);
        } else {
          dataListOther.push(array[index]);
        }
      }
      this.dataList = dataList;
      this.cuttingDate(dataListOther)
    },
    cuttingDate(dataListOther){
        //数据分割
        this.dataTotal = dataListOther.length; //获取总条数
        for(let i = 0;i < dataListOther.length; i+=9){
          this.cuttingList.push(dataListOther.slice(i,i+9))
        }
        this.handleCurrentChange(1)
    },
    //当前页
    handleCurrentChange(val){
      console.log(val);
      this.dataListOther = this.cuttingList[val-1];
    },
    reset() {
      this.$set(this.dataList[this.index], "member_active", false);
      if (this.dataList[3]) {
        this.$set(this.dataList[3], "member_active", false);
      }
      this.$set(this.dataListOther[this.warpIndex], "memberwarp_active", false);
    },
    showDialog() {
      this.dialogTableVisible = true;
    },
    clearDataActive(arr, str) {
      arr.map(item => {
        delete item[str];
        return item;
      });
      return arr;
    },
    //3-4选一
    clickSelectOne(newindex) {
      console.log(this.index, newindex);
      if (this.index === newindex) {
        this.index = "";
        this.$set(this.dataList[newindex], "member_active", false);
        this.$set(this.dataList[newindex], "memberwarp_active", false);
        this.$emit("selectData", this.dataList[this.index]);
      } else {
        if (this.dataList[this.index]) {
          this.$set(this.dataList[this.index], "member_active", false);
        }
        this.$set(this.dataList[newindex], "memberwarp_active", true);
        this.$set(this.dataList[newindex], "member_active", true);
        this.$emit("selectData", this.dataList[newindex]);
        this.index = newindex;
      }
      if(newindex != 3 && this.dataList[3]){
        this.$set(this.dataListOther[this.warpIndex], "memberwarp_active", false);
      }
    },
    //弹出层选一
    clickSelectWarpOne(index) {
      if (this.warpIndex === index) {
        this.warpIndex = "";
        this.$set(this.dataListOther[index], "memberwarp_active", false);
        this.selectItem = "";
      } else {
        this.$set(this.dataListOther[index], "memberwarp_active", true);
        if (this.dataListOther[this.warpIndex]) {
          this.$set(
            this.dataListOther[this.warpIndex],
            "memberwarp_active",
            false
          );
        }
        this.selectItem = this.dataListOther[index];
        this.warpIndex = index;
      }
    },
    //弹出层确认  更新对象 暴露信息
    subOk() {
      if (!this.selectItem) {
        if (this.dataList[3]) {
          this.$set(this.dataList[3], "member_active", false);
        }
        this.$emit("selectData", this.selectItem);
        this.dialogTableVisible = false;
      } else {
        if (this.dataList[this.index]) {
          this.$set(this.dataList[this.index], "member_active", false);
        }
        this.index = 3;
        this.selectItem.member_active = true;
        this.dataList[3] = this.selectItem;
        this.$emit("selectData", this.selectItem);
        this.dialogTableVisible = false;
      }
      this.selectItem = ''
    }
  }
};
</script>
<style lang="scss" scope>
.el-popover {
  background: #e8eeff;
  margin-top: 4px !important;
  margin-left: -2px !important;
  width: 27.3vw;
  box-sizing: border-box;
  padding: 1vw 1vw 2.3vw 1vw;
}
.member-moreSelectOneWarp {
  overflow: hidden;
  position: relative;
  width: 94.5vw;
  padding-bottom: 3px;
  .morecontent {
    margin: 0 auto;
    overflow: hidden;
    width: 86vw;
    position: relative;
    padding-bottom: 6vh;
    .isok {
      width:100%;
      position: absolute;
      right: 1vw;
      bottom: 0;
    }
  }
  .more-choose {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
    height: 4.9;
    width: 7.8vw;
    margin-top: 1.3vh;
    background: #ffffff;
    border: 1px solid #3559af;
    border-radius: 2px;
    line-height: 5vh;
    text-align: center;
    color: #3559af;
    font-size: $font-size14;
  }
  .nowarp {
    position: relative;
  }
  .nowarp-One:not(:nth-of-type(3n + 1)) {
    margin-left: 1.6vw;
  }
  .select-one {
    cursor: pointer;
    float: left;
    width: 27.3vw;
    height: 5.2vh;
    position: relative;
    margin-top: 1.3vh;
    // border: 1px solid #3b74ff;
    border-radius: 3px;
    .name {
      position: absolute;
      width: 27.3vw;
      height: 5.2vh;
      left: 0;
      top: 0;
      z-index: 2;
      line-height: 5.2vh;
      text-indent: 1vw;
      border-radius: 3px;
      color: #333;
    }
    .icon {
      position: absolute;
      width: 27.3vw;
      height: 5.2vh;
      left: 0;
      top: 0;
      .iconyuanxingxialajiantou {
        font-size: $font-size16;
        color: #3559af;
      }
      .iconyuanxingxialajiantou:before {
        content: "\E64D";
      }
      .icon-btn {
        position: absolute;
        width: 27.3vw;
        height: 5.2vh;
        left: 0;
        top: 0;
      }
      .lable-icon {
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 0;
        height: 5.2vh;
        width: 2vw;
        line-height: 5.2vh;
      }
    }
  }
  .select-active {
    .name {
      background: #3559af;
      color: #ffffff;
    }
    .icon {
      .iconyuanxingxialajiantou {
        color: #ffffff;
      }
    }
  }
}
</style>


