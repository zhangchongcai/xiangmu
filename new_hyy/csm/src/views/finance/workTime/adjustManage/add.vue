<template>
  <div class="cinemaList">
    <!-- 面包屑 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>班次收银管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: 'list' }">班次收银管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: 'add' }">上班登记</el-breadcrumb-item>
    </el-breadcrumb> -->
    <div class="searchAdition">
      <el-form :inline="true" class="demo-form-inline search-form" size="small" label-width="100px">
        <el-form-item label="收银员:">
          <el-input v-model="searchAdition.workerName" @focus="openworkerName"></el-input>
        </el-form-item>
        <el-form-item label="备用金:">
          <el-input v-model="searchAdition.preAmount"></el-input>
        </el-form-item>
        <el-form-item label="票纸编号:">
          <el-col :span="11">
            <el-input v-model="searchAdition.tpCodeStart" placeholder="票纸编号"></el-input>
          </el-col>
          <el-col class="line" :span="2" style="text-align:center">-</el-col>
          <el-col :span="11">
            <el-input v-model="searchAdition.tpCodeEnd" placeholder="票纸编号"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
    <div class="content">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="会员卡领用记录" name="1">
          <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" :inline="true">
            <div v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.key" class="like_ul">
              <el-form-item :prop="'domains.' + index + '.thingName'" label="会员等级">
                <el-input v-model="domain.thingName" @focus="openVipDialog(index)"></el-input>
              </el-form-item>
              <el-form-item :label="'领用数量'" :prop="'domains.' + index + '.thingCount'">
                <el-input v-model="domain.thingCount"></el-input>
              </el-form-item>
              <el-button type="text" style="padding:12px 10px;" @click.prevent="removeDomain(domain)" v-show="isShow1">
                删除</el-button>
            </div>
            <div class="add-time-btn">
              <el-button type="text" style="padding:0 6px 0 44px;" @click="addDomain">
                <i class="el-icon-circle-plus-outline"></i>
                <!-- <i class="iconfont icon-neiye-tianjia"></i> -->
                添加
              </el-button>
            </div>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="其他物品领用记录" name="2">
          <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" :inline="true">
            <div v-for="(domain, index) in dynamicValidateForm.domains2" :key="domain.key" class="like_ul">
              <el-form-item :prop="'domains2.' + index + '.thingName'" label="物品类型">
                <el-input v-model="domain.thingName" @focus="openOtherDialog(index)"></el-input>
              </el-form-item>
              <el-form-item :label="'领用数量'" :prop="'domains2.' + index + '.thingCount'">
                <el-input v-model="domain.thingCount"></el-input>
              </el-form-item>
              <el-button type="text" style="padding:12px 10px;" @click.prevent="removeDomain2(domain)" v-show="isShow2">
                删除</el-button>
            </div>
            <div class="add-time-btn">
              <el-button type="text" style="padding:0 6px 0 44px;" @click="addDomain2">
                <i class="el-icon-circle-plus-outline"></i>
                添加
              </el-button>
            </div>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <!-- 底部 -->
      <div style="height:80px;background:transparent;"></div>
      <div class="bottom-handler-tool">
        <div class="btn-area">
          <el-button type="primary" @click="increaseWorker">开始上班</el-button>
          <el-button @click="cancelFun">取消</el-button>
        </div>
      </div>
    </div>

    <!-- 弹窗 -->
    <workerDialog ref="searchDialog" @callback="chooseWorker" @searchWorker="searchWorker"></workerDialog>
    <myDialog :title="title" :dialogTableVisible.sync="dialogTableVisible" :isVip="isVip" :isOther="isOther" :isTwo="isTwo" :gridData="gridData" :pageData="pageData" @chooseuUserName='chooseuUserName' @changeDialogTableVisible="changeDialogTableVisible" @changeCurrentPage="changeCurrentPage">
    </myDialog>
  </div>
</template>
<script type="text/javascript">
import myDialog from "../public/dialog.vue";
import workerDialog from "../public/searchDialog"
export default {
  components: {
    myDialog,
    workerDialog
  },
  data () {
    return {
      activeNames: ["1", "2"],
      //查询条件
      searchAdition: {
        workerName: "",
        workerAccount: "",
        workerUid: "",
        preAmount: "",
        tpCodeStart: "",
        tpCodeEnd: "",
      },
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
      // 控制弹窗
      dialogTableVisible: false,
      title: "",
      isVip: false,
      isOther: false,
      isTwo: false,
      gridData: [],
      index: 0,
      workerGridData: [],
      vipGridData: [],
      otherGridData: [],
      vipPageData: {},
      otherPageData: {},
      workerPageData: {},
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
            this.vipPageData = data.data;
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
          if (data && data.code === 200) {
            this.otherGridData = data.data.records;
            this.gridData = this.otherGridData;
            this.otherPageData = data.data;
          }
        })
    },
    // 获取收银员
    getWorker (current) {
      let limit = {
        current,
        size: this.pageSize,
        cinemaUid: this.$route.query.cinemaUid
      };
      this.$csmList.getCashier(Object.assign({}, limit))
        .then(data => {
          if (data && data.code === 200) {
            this.$refs.searchDialog.gridData = data.data.records
            this.$refs.searchDialog.pageData = data.data
          }
        })
    },
    // 上班登记  
    increaseWorker () {
      let limit = {
        cinemaUid: this.$route.query.cinemaUid
      };
      let vipsData = this.dynamicValidateForm.domains.slice(0);
      let otherThingsData = this.dynamicValidateForm.domains2.slice(0);
      let vips = [];
      let otherThings = [];
      vipsData.forEach((obj, index) => {
        let a = Array.from(Object.values(obj)).every(item => {
          return item == ""
        }) // 单项全空
        let b = Array.from(Object.values(obj)).every(item => {
          return item !== ""
        }) // 单项不全空
        obj.empty = a
        obj.fill = b
      });
      let c = vipsData.every(item => {
        return item.empty === true
      }) // 数组为空
      console.log("C============" + c)
      console.log(vips)
      if (c) {
        vips = [] // 传入空数组可以提交
      } else {
        for (let i = 0; i < vips.length; i++) {
          let obj = vips[i]
          if (!obj.empty && obj.fill) {  // 单项全都有数据
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
      console.log(f)
      for (let i = 0; i < otherThings.length; i++) {
        let obj = otherThings[i]
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
      this.$csmList.increaseWorker(Object.assign({}, limit, this.searchAdition, {
        otherThings
      }, {
          vips
        }))
        .then(data => {
          console.log(data)
          if (data && data.code === 200) {
            this.$confirm('新建班次', '提示', {
              confirmButtonText: '确定',
              type: 'success'
            }).then(() => {
              this.$router.push("list")
            })
          } else {
            this.$alert(`{data.msg}`, '提示', {
              confirmButtonText: '确定',
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
    chooseuUserName (val, code, uid) {
      if (this.isVip) {
        this.dynamicValidateForm.domains[this.index].thingName = val
        this.dynamicValidateForm.domains[this.index].thingCode = code
      } else if (this.isOther) {
        this.dynamicValidateForm.domains2[this.index].thingName = val
        this.dynamicValidateForm.domains2[this.index].thingCode = code
      } else if (this.isTwo) {
        this.searchAdition.workerName = val
        this.searchAdition.workerAccount = code
        this.searchAdition.workerUid = uid
      }
    },
    // 打开收银员
    openWorker (event) {
      event.srcElement.blur()
      if (!this.cinemaName) {
        this.$alert('请先选择影院', '提示', {
          confirmButtonText: '确定',
          callback: () => { }
        })
      } else {
        this.getWorker()
        this.$refs.searchDialog.dialogTableVisible = true;
        this.$refs.searchDialog.title = "查找收银员";
        this.$refs.searchDialog.showWhich = "worker";
      }
    },
    //  返回值
    chooseWorker (obj) {
      let whichOne = this.$refs.searchDialog.showWhich;
      console.log(obj, whichOne)
      if (whichOne == "worker") {
        this.searchAdition.workerName = obj.userName
        this.searchAdition.workerUid = obj.userUid
        this.searchAdition.workerAccount = obj.userAccount
      } else if (whichOne == "creater") {
        this.searchAdition.createUserName = obj.userName
      }
    },
    searchWorker (current, userName, userAccount) {
      this.getWorker(current, userName, userAccount)
    },
    // 收银员
    openworkerName (index) {
      this.getWorker()
      this.$refs.searchDialog.dialogTableVisible = true;
      this.$refs.searchDialog.title = "查找收银员";
      this.$refs.searchDialog.showWhich = "worker";
    },
    // 会员卡领用记录
    openVipDialog (index) {
      this.getVip(this.current);
      this.index = index;
      this.dialogTableVisible = true;
      this.title = "会员卡领用";
      this.isVip = true;
      this.isOther = false;
      this.isTwo = false;
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
      this.isTwo = false;
      this.gridData = this.otherGridData;
      this.pageData = this.otherPageData
    },
    changeDialogTableVisible (val) {
      this.dialogTableVisible = val;
    },
    changeCurrentPage (val) {
      this.isTwo && this.getWorker(val);
      this.isVip && this.getVip(val)
      this.isOther && this.getOtherthing(val)

    },
    cancelFun () {
      this.$router.push({
        path: "list"
      })
    }
  },
  created () {



    console.log(this.$store.state.csm.cinemaUid)
  },

};
</script>
<style lang="scss" scoped>
.cinemaList {
  box-sizing: border-box;
  width: 100%;

  .search-form {
    background: #f5f5f5;
    padding: 12px 24px;
    margin-bottom: 10px;
    min-width: 1000px;
  }
}

// 设置表单增删的长度
.content {
  .el-input {
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