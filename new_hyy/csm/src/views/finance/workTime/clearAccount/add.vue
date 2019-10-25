<template>
  <div class="cinemaList">
    <div class="content">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基础信息登记" name="3">
          <el-form class="demo-form-inline search-form" size="small" label-width="100px" label-position="left">
            <el-form-item label="收银员:" required>
              <el-input v-model="searchAdition.workerName" disabled></el-input>
               <el-button @click="openworkerName"
                  style="border:1px solid #3B74FF;color: #3B74FF;width:80px;height:32px;margin-top:-2px;">选择</el-button>
            </el-form-item>
            <el-form-item label="备用金:" required>
              <el-input v-model="searchAdition.preAmount"></el-input>
            </el-form-item>
            <el-form-item label="票纸编号:">
              <el-col style="width:300px">
                <el-input v-model="searchAdition.tpCodeStart" placeholder="票纸编号"></el-input>
              </el-col>
              <el-col class="line" style="text-align:center;width:30px">-</el-col>
              <el-col style="width:300px">
                <el-input v-model="searchAdition.tpCodeEnd" placeholder="票纸编号"></el-input>
              </el-col>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="会员卡领用记录" name="1">
          <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="105px" :inline="true"
            label-position="left">
            <div v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.key" class="like_ul">
              <el-form-item :prop="'domains.' + index + '.thingName'" label="会员卡政策：">
                <el-input v-model="domain.thingName" disabled></el-input>
                <el-button @click="openVipDialog(index)"
                  style="border:1px solid #3B74FF;color: #3B74FF;width:80px;height:32px;margin-top:-2px;">选择</el-button>
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
          <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="105px" :inline="true"
            label-position="left">
            <div v-for="(domain, index) in dynamicValidateForm.domains2" :key="domain.key" class="like_ul">
              <el-form-item :prop="'domains2.' + index + '.thingName'" label="物品类型：">
                <el-input v-model="domain.thingName" disabled></el-input>
                <el-button @click="openOtherDialog(index)"
                  style="border:1px solid #3B74FF;color: #3B74FF;width:80px;height:32px;margin-top:-2px;">选择</el-button>
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
      <!-- 底部 -->
      <div style="height:80px;background:transparent;"></div>
      <div class="bottom-handler-tool">
        <div class="btn-area">
          <el-button type="primary" @click="increaseWorker">开始上班</el-button>
          <el-button @click="cancelFun" style="margin-left:32px;">取消</el-button>
        </div>
      </div>
    </div>

    <!-- 弹窗 -->
    <workerDialog ref="searchDialog" @callback="chooseWorker" @searchWorker="searchWorker"></workerDialog>
    <myDialog ref="myDialog" :title="title" :dialogTableVisible.sync="dialogTableVisible" :isVip="isVip"
      :isOther="isOther" :isTwo="isTwo" :gridData="gridData" @chooseuUserName='chooseuUserName'
      @changeDialogTableVisible="changeDialogTableVisible" @changeCurrentPage="changeCurrentPage">
    </myDialog>
  </div>
</template>
<script type="text/javascript">
  import myDialog from "../public/dialog.vue";
  import workerDialog from "../public/searchDialog"
  // import config from 'frame_cpm/http/config';
  export default {
    components: {
      myDialog,
      workerDialog
    },
    data() {
      return {
        activeNames: ["1", "2", "3"],
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
      getVip(current) {
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
      getOtherthing(current) {
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
              this.$refs.myDialog.pageData = data.data
            }
          })
      },
      // 获取收银员
      getWorker(current, userName, userAccount) {
        let limit = {
          current,
          size: this.pageSize,
          cinemaUid: this.$route.query.cinemaUid,
          userAccount,
          userName
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
      increaseWorker() {
        if (!this.searchAdition.workerName) {
          this.$message("请先选择收银员")
          return
        }
        if (!this.searchAdition.preAmount) {
          this.$message("请先填写备用金")
          return
        }
        let limit = {
          cinemaUid: this.$route.query.cinemaUid
        };
        // 这里一定要转换不然后面判断会失效
        let vipsData = JSON.parse(JSON.stringify(this.dynamicValidateForm.domains.slice(0)));
        let otherThingsData = JSON.parse(JSON.stringify(this.dynamicValidateForm.domains2.slice(0)));
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
          console.log(vips)
          for (let i = 0; i < vipsData.length; i++) {
            let obj = vipsData[i]
            if (!obj.empty && obj.fill) { // 单项全都有数据
              vips.push(obj)
            } else if (!obj.empty && !obj.fill) {
              return this.$message('请填写完整的会员卡领用情况');
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

        for (let i = 0; i < otherThingsData.length; i++) {
          let obj = otherThingsData[i]
          if (f) {
            otherThings = []
          } else {
            if (!obj.empty && obj.fill) {
              otherThings.push(obj)
            } else if (!obj.empty && !obj.fill) {
              return this.$message('请填写完整的其他物品领用情况');
            }
          }
        }
        console.log(otherThings, vips)
        this.$csmList.increaseWorker(Object.assign({}, limit, this.searchAdition, {
            otherThings
          }, {
            vips
          }))
          .then(data => {
            console.log(data)
            if (data && data.code === 200) {
              this.$message('新建班次成功')
              this.$router.push("list")
            } else {
              console.log(this.dynamicValidateForm.domains.slice(0))
              this.$message(`${data.msg}`);
            }
          })
      },
      // 会员卡领用记录
      removeDomain(item) {
        var index = this.dynamicValidateForm.domains.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1)
        }
        this.isShow1 = this.dynamicValidateForm.domains.length > 1 ? true : false
      },
      addDomain() {
        this.dynamicValidateForm.domains.push({
          thingName: '',
          thingCode: '',
          thingCount: ''
        });
        this.isShow1 = this.dynamicValidateForm.domains.length > 1 ? true : false
        console.log(this.dynamicValidateForm.domains)
      },

      // 其他物品领用记录
      removeDomain2(item) {
        var index = this.dynamicValidateForm.domains2.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.domains2.splice(index, 1)
        }
        this.isShow2 = this.dynamicValidateForm.domains2.length > 1 ? true : false
      },
      addDomain2() {
        this.dynamicValidateForm.domains2.push({
          thingName: '',
          thingCode: '',
          thingCount: ''
        });
        this.isShow2 = this.dynamicValidateForm.domains2.length > 1 ? true : false
        console.log(this.dynamicValidateForm.domains2)
      },
      chooseuUserName(val, code, uid) {
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
      openWorker(event) {
        event.srcElement.blur()
        if (!this.cinemaName) {
          this.$alert('请先选择影院', '提示', {
            confirmButtonText: '确定',
            callback: () => {}
          })
        } else {
          this.getWorker()
          this.$refs.searchDialog.dialogTableVisible = true;
          this.$refs.searchDialog.title = "查找收银员";
          this.$refs.searchDialog.showWhich = "worker";
        }
      },
      //  返回值
      chooseWorker(obj) {
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
      searchWorker(current, userName, userAccount) {
        console.log(current, userName, userAccount)
        this.getWorker(current, userName, userAccount)
      },
      // 收银员
      openworkerName(index) {
        this.getWorker()
        this.$refs.searchDialog.dialogTableVisible = true;
        this.$refs.searchDialog.title = "查找收银员";
        this.$refs.searchDialog.showWhich = "worker";
      },
      // 会员卡领用记录
      openVipDialog(index) {
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
      openOtherDialog(index) {
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
      changeDialogTableVisible(val) {
        this.dialogTableVisible = val;
      },
      changeCurrentPage(val) {
        this.isTwo && this.getWorker(val);
        this.isVip && this.getVip(val)
        this.isOther && this.getOtherthing(val)

      },
      cancelFun() {
        this.$router.push({
          path: "list"
        })
      }
    },
    created() {
      this.getWorker()
    },

  };
</script>
<style lang="scss" scoped>
  /deep/ .el-form-item__label {
    color: #666;
  }

  .el-button--default.is-disabled {
    background: #F5F5F5;
    border: 1px solid #BCBCBC;
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
    margin: 0 1px
  }
</style>