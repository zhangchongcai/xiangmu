<template>
  <div>
    <div class="searchAdition">
      <el-form :inline="true" class="demo-form-inline search-form" size="small" label-width="100px">
        <el-row :gutter="0" style="height:32px;margin:0;">
          <el-col :span="7">
            <el-form-item label="单据编号:">
              <span>{{information.timeCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="收银员:">
              <span>{{information.workerName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="班次起始时间:">
              <span>{{information.workStartTime}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备用金:" required>
          <el-input v-model="preAmount" placeholder="请输入备用金" ref="preAmount">
          </el-input>
          <div class="mytooltip" v-show="isError">{{tipsWord}}</div>
        </el-form-item>
      </el-form>
    </div>
    <div class="content">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="会员卡领用记录" name="1">
          <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="105px" :inline="true" label-position="left">
            <div v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.key" class="like_ul">
              <el-form-item :prop="'domains.' + index + '.thingName'" label="会员卡政策：">
                <el-input v-model="domain.thingName" disabled></el-input>
                <el-button @click="openVipDialog(index)" style="border:1px solid #3B74FF;color: #3B74FF;width:80px;height:32px;margin-top:-2px;">选择</el-button>
              </el-form-item>
              <el-form-item label="领用数量：" :prop="'domains.' + index + '.thingCount'">
                <el-input v-model="domain.thingCount"></el-input>
              </el-form-item>
              <el-button type="text" style="padding:12px 10px;" @click.prevent="removeDomain(domain)" v-show="isShow1">
                删除</el-button>
            </div>
            <div class="add-time-btn">
              <el-button type="text" style="padding:0 6px 0 24px;" @click="addDomain">
                <i class="el-icon-circle-plus-outline"></i>
                <!-- <i class="iconfont icon-neiye-tianjia"></i> -->
                添加
              </el-button>
            </div>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="其他物品领用记录" name="2">
          <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="105px" :inline="true" label-position="left">
            <div v-for="(domain, index) in dynamicValidateForm.domains2" :key="domain.key" class="like_ul">
              <el-form-item :prop="'domains2.' + index + '.thingName'" label="物品类型：">
                <el-input v-model="domain.thingName" disabled></el-input>
                <el-button @click="openOtherDialog(index)" style="border:1px solid #3B74FF;color: #3B74FF;width:80px;height:32px;margin-top:-2px;">选择</el-button>
              </el-form-item>
              <el-form-item :label="'领用数量：'" :prop="'domains2.' + index + '.thingCount'">
                <el-input v-model="domain.thingCount"></el-input>
              </el-form-item>
              <el-button type="text" style="padding:12px 10px;" @click.prevent="removeDomain2(domain)" v-show="isShow2">
                删除</el-button>
            </div>
            <div class="add-time-btn">
              <el-button type="text" style="padding:0 6px 0 24px;" @click="addDomain2">
                <i class="el-icon-circle-plus-outline"></i>
                添加
              </el-button>
            </div>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <div style="height:80px;background:transparent;"></div>
      <div class="bottom-handler-tool">
        <div class="btn-area">
          <el-button type="primary" @click="addIssue">追加领用</el-button>
          <el-button @click="$router.go(-1)">取消</el-button>
        </div>
      </div>
    </div>

    <!-- 弹窗 -->
    <myDialog ref="myDialog" :title="title" :dialogTableVisible.sync="dialogTableVisible" :isVip="isVip" :isOther="isOther" :pageData="pageData" :gridData="gridData" @chooseuUserName='chooseuUserName' @changeDialogTableVisible="changeDialogTableVisible" @changeCurrentPage="changeCurrentPage">
    </myDialog>
  </div>
</template>

<script type="text/javascript">
import myDialog from "../public/dialog.vue";
export default {
  components: {
    myDialog
  },
  data () {
    return {
      // 控制弹窗
      dialogTableVisible: false,
      title: "",
      isVip: false,
      isOther: false,
      gridData: [],
      pageData: {},
      index: 0,
      // 控制打开下拉窗
      activeNames: ["1", "2"],
      information: {
      }, // 基本信息
      preAmount: "",
      dynamicValidateForm: {
        domains: [{
          thingName: '',
          thingCode: '',
          thingCount: ''
        }],
        domains2: [{
          thingName: '',
          thingCode: '',
          thingCount: ''
        }]
      },
      // 控制删除显示 
      isShow1: false,
      isShow2: false,
      vipGridData: [],
      otherGridData: [],
      tipsWord: "输入有误，请重新输入",
      isError: false,
      otherThings: [],
      vipsEmpty: true,
      othersThings: true,
      //分页
      pageData: {},
      pageSize: 10,
      current: 1
    };
  },
  methods: {
    // 获取vip
    getVip (current) {
      let limit = {
        current,
        size: this.pageSize,
        cinemaUid: this.$route.query.cinemaUid
      };
      this.$csmList.getVip(limit)
        .then(data => {
          console.log(data)
          if (data && data.code === 200) {
            this.vipGridData = data.data.records;
            this.gridData = this.vipGridData;
            this.$refs.myDialog.pageData = data.data
          }
        })
    },
    // 获取其它物品领用记录
    getOtherthing (current) {
      let limit = {
        current,
        size: this.pageSize,
        cinemaUid: this.$route.query.cinemaUid
      };
      this.$csmList.getOtherthing(limit)
        .then(data => {
          console.log(data)
          if (data && data.code === 200) {
            this.otherGridData = data.data.records;
            this.gridData = this.otherGridData;
            this.$refs.myDialog.pageData = data.data
          }
        })
    },
    // 追加领用接口
    addIssue () {
      if (!this.preAmount) {
        this.$message("请输入备用金")
        return;
      }
      let limit = {
        preAmount: this.preAmount,
        uid: this.$route.query.uid,
      };
      let vipsData = JSON.parse(JSON.stringify(this.dynamicValidateForm.domains.slice(0)));
      let otherThingsData = JSON.parse(JSON.stringify(this.dynamicValidateForm.domains2.slice(0)));
      let vips = [];
      let otherThings = [];
      console.log(vips, otherThings)
      vipsData.forEach((obj, index) => {
        let a = Array.from(Object.values(obj)).every(item => {
          console.log(item == "")
          return item == ""
        })  // 全空
        let b = Array.from(Object.values(obj)).every(item => {
          console.log(item != "")
          return item !== ""
        }) // 全都不是空
        obj.empty = a
        obj.fill = b
      });
      let c = vipsData.every(item => {
        return item.empty === true
      })

      for (let i = 0; i < vipsData.length; i++) {
        let obj = vipsData[i]
        if (c) {
          vips = []
        } else {
          if (!obj.empty && obj.fill) {
            vips.push(obj)
          } else if (!obj.empty && !obj.fill) {
            return this.$alert('请填写完整的会员卡领用情况', '错误提示', {
              confirmButtonText: '确定',
            });
          }
        }
      }
      otherThingsData.forEach((obj, index) => {
        let d = Array.from(Object.values(obj)).every(item => {
          return item === ""
        })
        let e = Array.from(Object.values(obj)).every(item => {
          console.log(item != "")
          return item !== ""
        }) // 全都不是空
        obj.empty = d
        obj.fill = e
      });
      let f = otherThingsData.every(item => {
        return item.empty === true
      })
      // console.log(d)
      for (let i = 0; i < otherThingsData.length; i++) {
        let obj = otherThingsData[i]
        if (f) {
          otherThings = []
        } else {
          if (!obj.empty && obj.fill) {
            otherThings.push(obj)
          } else if (!obj.empty && !obj.fill) {
            return this.$alert('请填写完整的其他物品领用情况', '错误提示', {
              confirmButtonText: '确定',
            });
          }
        }
      }
      this.$csmList.addIssue(Object.assign({}, limit, { vips }, { otherThings }))
        .then(data => {
          console.log(data)
          if (data && data.code === 200) {
            this.$alert('追加成功', '追加领用', {
              confirmButtonText: '确定',
              callback: action => {
                this.$router.go(-1)
              }
            });
          }
        })
    },
    // 会员卡领用记录
    removeDomain (item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
      this.isShow1 = this.dynamicValidateForm.domains.length > 1 ? true : false
    },
    addDomain () {
      this.dynamicValidateForm.domains.push({
        thingName: '',
        thingCode: '',
        thingCount: ''
      });
      this.isShow1 = this.dynamicValidateForm.domains.length > 1 ? true : false
      console.log(this.dynamicValidateForm.domains)
    },

    // 其他物品领用记录
    removeDomain2 (item) {
      var index = this.dynamicValidateForm.domains2.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains2.splice(index, 1)
      }
      this.isShow2 = this.dynamicValidateForm.domains2.length > 1 ? true : false
    },
    addDomain2 () {
      this.dynamicValidateForm.domains2.push({
        thingName: '',
        thingCode: '',
        thingCount: ''
      });
      this.isShow2 = this.dynamicValidateForm.domains2.length > 1 ? true : false
      console.log(this.dynamicValidateForm.domains2)
    },
    checknum (val, index) {
      let el = document.querySelectorAll(".vips .el-input");
      const reg = /^[1-9]+\d*$/;
      console.log(el[2 * index + 1].firstElementChild)
      el[2 * index + 1].nextElementSibling.style.left = "207px"
      if (reg.test(val)) {
        // 正确
        el[2 * index + 1].firstElementChild.style.borderColor = "#3B74FF";
        el[2 * index + 1].nextElementSibling.style.display = "none"
      } else {
        el[2 * index + 1].firstElementChild.style.borderColor = "#F33430";
        el[2 * index + 1].nextElementSibling.style.display = "block"
      }
      console.log(val, index)
    },
    // 会员卡领用记录
    openVipDialog (index) {
      this.getVip(this.current);
      this.index = index;
      this.dialogTableVisible = true;
      this.title = "会员卡领用";
      this.isVip = true;
      this.isOther = false;
      this.gridData = this.vipGridData;
      this.pageData = this.vipPageData
    },
    // 其他物品领用记录
    openOtherDialog (index) {
      this.getOtherthing(this.current);
      this.index = index;
      this.dialogTableVisible = true;
      this.title = "其他物品领用记录";
      this.isOther = true;
      this.isVip = false;
      this.gridData = this.otherGridData;
      this.pageData = this.otherPageData
    },
    chooseuUserName (val, code) {
      if (this.isVip) {
        this.dynamicValidateForm.domains[this.index].thingName = val
        this.dynamicValidateForm.domains[this.index].thingCode = code
      } else if (this.isOther) {
        this.dynamicValidateForm.domains2[this.index].thingName = val
        this.dynamicValidateForm.domains2[this.index].thingCode = code
      }
    },
    changeDialogTableVisible (val) {
      this.dialogTableVisible = val;
    },
    changeCurrentPage (val) {
      console.log(val)
      this.isVip && this.getVip(val)
      this.isOther && this.getOtherthing(val)

    },
  },
  watch: {
    // preAmount(val){
    //   const reg=/^[0-9]+\d*$/;
    //   // console.log(reg.test(val),val)
    //   this.isError = reg.test(val)?false:true
    // },
    // isError(val){
    //   console.log(val)
    //   const el = this.$refs["preAmount"].$refs.input
    //   el.style.borderColor = val?"#F33430":"#3B74FF";
    // },
    // dynamicValidateForm: {
    //   handler(newName, oldName) {
    //     console.log(newName,oldName);
    //   },
    //   deep: true
    // }
  },
  created () {
    // console.log(false !== '');
    this.information = this.$route.query
    this.getVip();
    this.getOtherthing();
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-row {
  margin: 0;
}
/deep/ .el-form-item__label,
/deep/ .el-form-item__content {
  font-size: 12px;
  line-height: 32px;
}
// 设置表单增删的长度
.content {
  box-sizing: border-box;
  overflow: hidden;

  /deep/ .el-input__inner {
    width: 192px;
  }

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

// 清除.el-form-item的长度限制
.el-form-item {
  width: auto;
  height: 32px;
  // /deep/ .el-input__inner{
  //   width: 176px;
  // }
}
.tip_div {
  border: 1px solid #1989fa;
  height: 10px;
  display: block;
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
  width: 176px;
}

.search-btn {
  margin-left: 30px;
}

// 底部
.bottom-handler-tool {
  height: 64px;
  width: 100%;
  // position: fixed;
  // z-index: 999;
  bottom: 0;
  right: 0;
  // background-color: #f5f5f5;

  .btn-area {
    width: 500px;
    margin: 0 auto;
    height: 64px;
    text-align: center;
    padding-top: 16px;
    box-sizing: border-box;
  }
}
// 错误提示
// .mytooltip{
//   z-index: 99;
//   width: 130px;
//   background-color:rgba(51, 51, 51, 0.8);
//   border-radius: 4px;
//   font-family: MicrosoftYaHei;
//   font-size: 12px;
//   color: #FFFFFF;
//   text-align: left;
//   line-height: 14px;
//   padding: 9px 16px;
//   position: absolute;
//   top: 0px;
//   left: 192px;
//   transition: all  1s linear;
//   &::before{
//     display: inline-block;
//     content: "";
//     position: absolute;
//     width:0;
//     height:0;
//     border-top:7px solid transparent;
//     border-bottom:7px solid transparent;
//     border-right:8px solid rgba(51, 51,51, 0.8);
//     top: 9px;
//     left: -8px;
//   }
// }
</style>
<style lang="scss" scoped>
/deep/ .el-form-item__label {
  color: #666;
}
.el-button--default.is-disabled {
  background: #f5f5f5;
  border: 1px solid #bcbcbc;
  border-radius: 4px;
  text-align: left;
}
.cinemaList {
  box-sizing: border-box;
  width: 100%;
  min-width: 1000px;
  overflow: hidden;
  /deep/ .el-collapse-item__content {
    padding-bottom: 0;
  }
  .search-form {
    padding: 12px 24px 0;
    .el-form-item {
      color: #666;
      margin-bottom: 24px;
    }
  }
}

.demo-form-inline {
  .el-input {
    width: 300px;
  }
}
// 设置表单增删的长度
.like_ul {
  padding: 0 8px 16px;

  .el-input {
    width: 192px;
  }

  .el-form-item {
    margin: 0;
  }
  /deep/ .el-form-item__label {
    padding-left: 20px;
    color: #666;
    width: 105px;
  }
}

/deep/ .el-collapse-item__header {
  // 修改折叠
  height: 24px;
  line-height: 24px;

  &::after {
    height: 0;
  }

  .el-collapse-item__arrow {
    //设置折叠框箭头和位置
    // margin: 0 8px 0;
    float: left;
    line-height: 24px;
    // transform: rotate(-90deg);
  }
}
.el-collapse-item__content {
  padding-bottom: 0;
}

// 清除.el-form-item的长度限制
.el-form-item {
  width: auto;
}

.el-date-table td span {
  border-radius: 0;
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

// 底部
.bottom-handler-tool {
  height: 64px;
  width: 100%;
  // position: fixed;
  z-index: 999;
  bottom: 0;
  right: 0;
  // background-color: #f5f5f5;

  .btn-area {
    width: 500px;
    margin: 0 auto;
    height: 64px;
    text-align: center;
    padding-top: 16px;
    box-sizing: border-box;
  }
}
.el-button {
  height: 32px;
  min-width: 80px;
}
//
/deep/ .el-pagination.is-background .el-pager li {
  margin: 0 1px;
}
</style>