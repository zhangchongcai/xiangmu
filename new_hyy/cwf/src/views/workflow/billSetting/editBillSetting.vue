<template>
  <div class="cwf_editBillSetting">
    <div class="detail">
      <el-row>
        <!-- 指定组织 -->
        <el-col :span="6">
          <div class="cinema-item">
            &nbsp;&nbsp;指定组织：
            <el-tree :data="treeArr" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current :props="defaultProps" :check-strictly="false" :default-checked-keys="defaultCheckedKeys">
            </el-tree>
          </div>
        </el-col>
        <!-- 个性设置 -->
        <el-col :span="18">
          <div class="box">
            <el-row :gutter="20">
              <el-col class="box-item" :span="12" v-for="item in resetRenderData" :key="item.id">
                <template v-if="resetRenderData.length">
                  <div>
                    <div class="" style="float:left;">
                      <div class="item-title">{{item.businessName}}：</div>
                    </div>
                    <div style="float:left;">
                      <el-select v-model="optionsValue[`${item.businessNo}`]" placeholder="请选择" v-if="optionsValue" @change="change()">
                        <el-option v-for="items in item.list" :key="items.id" :label="items.name" :value="items.id">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                </template>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 底部按钮 -->
    <div class="footer">
      <el-button type="primary" class="footerBtn" v-if="type=='add'" @click="addPersonalSetting">确 定</el-button>
      <el-button type="primary" class="footerBtn" v-if="type=='edit'" @click="editPersonalSetting">确 定</el-button>
      <el-button class="footerBtn" @click="closeBack">取 消</el-button>
    </div>
  </div>
</template>
    
<script>
export default {
  data () {
    return {
      dataInfo: {},//渲染数据
      type: this.$route.query.type || "",//页面状态
      businessId: this.$route.query.businessId || "",//id
      tenantId: this.$store.state.loginUser.consumerId || "", //商户id
      userUid: this.$store.state.loginUser.uid || "", //用户组织uid
      //默认组织结构树-渲染-属性
      defaultProps: {
        children: 'subtree',
        label: 'menuName'
      },
      treeData: {},//组织结构树-渲染数据
      treeArr: [],//重组-组织结构树-渲染数据
      defaultCheckedKeys: [],//默认选中 组织结构树

      tableData: [],//个性设置-渲染数据
      resetRenderData: [],//重组-个性设置-渲染数据

      options: [],//个性设置-下拉选项
      optionsValue: {},//个性设置-下拉的选项值集合
    }
  },
  created () {
    this.showpageType()
    this.getBillNormalSetting()
  },
  methods: {
    //显示页面类型
    showpageType () {
      if (this.type == "add") {
        this.querySetHistory()
      }
      if (this.type == "edit") {
        this.findSetUpById()
      }
    },
    //业务单据审批设置-根据id获取数据详情
    findSetUpById () {
      let params = {
        businessId: this.businessId
      }
      this.$cwfList.findSetUpById(params).then(data => {
        if (data && data.code === 200) {
          this.dataInfo = data.data
          this.querySetHistory()
        } else {
          this.$message({
            message: data.msg,
            type: "warning",
            duration: 1000
          });
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //组织结构树-获取数据
    showTreeData (list) {
      let params = {
        // consumerId:805852
        userUid: this.userUid
      }
      this.$cwfList.getOrgTreeAndCinema(params).then(data => {
        // this.$cwfList.organizationList(params).then(data => {
        if (data && data.code === 200) {
          this.treeData = data.data
          // if(this.treeData.menuName=="总部") {
          //     this.treeData.disabled=true
          // }
          if (this.type == "edit") {
            this.editInitTreeData()
            this.resetTreeData(this.treeData, list)
          }
          if (this.type == "add") {
            this.resetTreeData(this.treeData, list)
          }
          this.treeArr.push(this.treeData)
          console.log("treeArr", this.treeArr)
          if (this.type == "edit") {
          }
        } else {
          this.$message({
            message: data.msg,
            type: "warning",
            duration: 1000
          });
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //通用单据设置-获取数据
    getBillNormalSetting () {
      let params = {
        global: 1,
        orginizationId: 0,
        tenantId: this.tenantId
      }
      this.$cwfList.getBillNormalSetting(params).then(data => {
        if (data && data.code === 200) {
          this.tableData = data.data.businessTypeList
          this.options = data.data.workflowList
          this.resetDataNormalSetting()
          if (this.type == "edit") {
            this.editInitNormalSettingData()
          }
        } else {
          this.$message({
            message: data.msg,
            type: "warning",
            duration: 1000
          });
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //验证是否是已经设置过的节点
    querySetHistory () {
      let params = {}
      this.$cwfList.querySetHistory(params).then(data => {
        if (data && data.code === 200 && data.flag == 1) {
          if (this.type == "add") {
            let addList = data.data || []
            this.showTreeData(addList)
          }
          if (this.type == "edit") {

            let editList = data.data || []
            let selectList = []
            if (this.dataInfo.merchantId) {
              selectList = this.dataInfo.merchantId.split(",")
            }
            if (selectList.length != 0) {
              for (let j = 0; j < selectList.length; j++) {
                for (let i = editList.length - 1; i >= 0; i--) {
                  if (editList[i] == selectList[j]) {
                    console.log(editList[i] + "--------" + selectList[j])
                    editList.splice(i, 1)
                    break;
                  }
                }
              }
            }
            console.log("editList", editList)
            this.showTreeData(editList)
          }
        } else {
          this.$message({
            message: data.msg,
            type: "warning",
            duration: 1000
          });
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //组织结构树-编辑状态-初始化-选中数据
    editInitTreeData () {
      let _this = this
      setTimeout(() => {
        _this.defaultCheckedKeys = _this.dataInfo.merchantId.split(",")
        console.log(_this.defaultCheckedKeys)
        _this.$refs.tree.setCheckedKeys(_this.defaultCheckedKeys)
      }, 100)
    },
    //组织结构树-编辑状态-重组-渲染结构（递归：比较复杂不方便页面渲染）
    resetTreeData (obj, list) {
      if (obj.subtree) {
        if (obj.cinemaInfos) {
          //一级循环
          for (let i = 0; i < obj.cinemaInfos.length; i++) {
            let items = obj.cinemaInfos[i];
            let data = {
              id: items.id,
              menuName: items.name,
              subtree: []
            }
            obj.subtree.push(data)
          }
        }
        //一级循环
        for (let j = 0; j < obj.subtree.length; j++) {
          let item = obj.subtree[j];
          //二级循环（默认禁止已经选中的节点）
          list.forEach(el => {
            if (item.id == el) {
              item.disabled = true
            }
          })
          if (item.subtree) {
            //递归
            this.resetTreeData(item, list)
          }
        }
      }
    },
    //已弃用-组织结构树-新建状态-重组-渲染结构（递归：比较复杂不方便页面渲染）
    editResetTreeData (obj, editList) {
      if (obj.subtree) {
        if (obj.cinemaInfos) {
          //一级循环
          for (let i = 0; i < obj.cinemaInfos.length; i++) {
            let items = obj.cinemaInfos[i];
            let data = {
              id: items.id,
              menuName: items.name,
              subtree: []
            }
            obj.subtree.push(data)
          }
        }
        //一级循环
        for (let j = 0; j < obj.subtree.length; j++) {
          let item = obj.subtree[j];
          //二级循环（默认禁止已经选中的节点）
          editList.forEach(el => {
            if (item.id == el) {
              item.disabled = true
            }
          })
          if (item.subtree) {
            //递归
            this.editResetTreeData(item, editList)
          }
        }
      }

    },
    //组织结构树-测试打印选中数据
    getCheckedNodes () {
      console.log(this.$refs.tree.getCheckedNodes())
    },
    //通用单据设置-新建、编辑状态-重组-渲染结构
    resetDataNormalSetting () {
      this.resetRenderData = JSON.parse(JSON.stringify(this.tableData))
      let flag = false//是否存在无需审批标记
      this.resetRenderData.forEach(item => {
        item.list = JSON.parse(JSON.stringify(this.options))
      })
      //兼容无需选项没有的情况
      this.options.forEach(item => {
        if (item.id == 2) {
          flag = true
        }
      })

      //兼容无需选项没有的情况
      if (flag) {
        this.resetRenderData.forEach(item => {
          this.optionsValue[`${item.businessNo}`] = "2"
        })
      } else {
        this.resetRenderData.forEach(item => {
          this.optionsValue[`${item.businessNo}`] = ""
        })
      }
      console.log(this.resetRenderData)
      console.log(this.optionsValue)
      // if(this.type=="edit"){
      //     this.optionsValue[`${this.dataInfo.businessTypeCode}`]=this.dataInfo.workflowBusinessId 
      // }
    },
    //通用单据设置-编辑状态-初始化-选中数据
    editInitNormalSettingData () {
      // this.optionsValue[`${this.dataInfo.businessTypeCode}`]=this.dataInfo.workflowBusinessId 
      console.log("this.options", this.options)
      this.options.forEach(item => {
        this.dataInfo.rlsList.forEach(el => {
          if (el.workflowBusinessId == item.id) {
            this.optionsValue[`${el.businessTypeCode}`] = item.id
          }
        })
      })
      console.log("getCheckedNodes", this.$refs.tree.getCheckedNodes())
    },
    //关闭返回
    closeBack () {
      this.$store.commit("tagNav/removeTagNav", this.$route);
      this.$router.push({
        path: "/workflow/billSetting",
        query: {
          page: "second"
        }
      })
    },
    //监听下拉事件
    change () {
      this.$forceUpdate()
    },
    //业务单据审批设置-新建状态-保存
    addPersonalSetting () {
      let treeData = {
        orginizationId: "",
        orginizationName: "",
      }
      let treeArray = this.$refs.tree.getCheckedNodes()


      treeArray.forEach(items => {
        console.log("items---", items)
        //判断是否是组织节点
        if (!items.uid) {
          if (!treeData.orginizationId) {
            treeData.orginizationId = items.id
          } else {
            treeData.orginizationId += ("," + items.id)
          }

          if (!treeData.orginizationName) {
            treeData.orginizationName = items.menuName
          } else {
            treeData.orginizationName += ("," + items.menuName)
          }
        }
      })

      //验证组织结构
      console.log("treeArray", treeArray)
      if (treeData.orginizationId == "") {
        this.$message({
          message: "组织下的影院不能为空",
          type: "warning",
          duration: 1500
        });
        return
      }
      console.log("tree", treeData)

      let params = {
        tenantId: this.tenantId,
        list: []
      }
      this.resetRenderData.forEach(item => {
        if (parseInt(this.optionsValue[`${item.businessNo}`])) {
          params.list.push({
            businessTypeCode: item.businessNo,//业务类型编码
            global: 1,//是否全局设置0-是 1-否
            orginizationId: treeData.orginizationId,//组织结构id
            orginizationName: treeData.orginizationName,//组织结构名称
            tenantId: this.tenantId,//租户id
            workflowBusinessId: this.optionsValue[`${item.businessNo}`],//流程方案id
          })
        }
      })
      //验证审批流程选项
      if (params.list.length == 0) {
        this.$message({
          message: "请选择审批流程选项",
          type: "warning",
          duration: 1000
        });
        return
      }
      console.log(JSON.stringify(params))

      this.$cwfList.addPersonalSetting(params).then(data => {
        if (data && data.code === 200 && data.flag == 1) {
          this.$message({
            message: "新增成功",
            type: "success",
            duration: 1000
          });
          this.closeBack()
        } else {
          this.$message({
            message: data.msg,
            type: "warning",
            duration: 1000
          });
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //业务单据审批设置-编辑状态-保存
    editPersonalSetting () {
      let treeData = {
        orginizationId: "",
        orginizationName: "",
      }
      let treeArray = this.$refs.tree.getCheckedNodes()

      treeArray.forEach(items => {
        console.log("items---", items)
        //判断是否是组织节点
        if (!items.uid) {
          if (!treeData.orginizationId) {
            treeData.orginizationId = items.id
          } else {
            treeData.orginizationId += ("," + items.id)
          }

          if (!treeData.orginizationName) {
            treeData.orginizationName = items.menuName
          } else {
            treeData.orginizationName += ("," + items.menuName)
          }
        }
      })

      //验证组织结构
      if (treeData.orginizationId == "") {
        this.$message({
          message: "组织下的影院不能为空",
          type: "warning",
          duration: 1500
        });
        return
      }

      let params = {
        tenantId: this.tenantId,
        merchantId: this.dataInfo.merchantId,
        list: []
      }
      this.resetRenderData.forEach(item => {
        if (parseInt(this.optionsValue[`${item.businessNo}`])) {
          params.list.push({
            businessTypeCode: item.businessNo,//业务类型编码
            orginizationId: treeData.orginizationId,//组织结构id
            orginizationName: treeData.orginizationName,//组织结构名称
            tenantId: this.tenantId,//租户id
            workflowBusinessId: this.optionsValue[`${item.businessNo}`] + "",//流程方案id
          })
        }

      })
      //验证审批流程选项
      if (params.list.length == 0) {
        this.$message({
          message: "请选择审批流程选项",
          type: "warning",
          duration: 1000
        });
        return
      }
      console.log(JSON.stringify(params))
      this.$cwfList.editBillSetting(params).then(data => {
        if (data && data.code === 200 && data.flag == 1) {
          this.$message({
            message: "编辑成功",
            type: "success",
            duration: 1000
          });
          this.closeBack()
        } else {
          this.$message({
            message: data.msg,
            type: "warning",
            duration: 1000
          });
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },


}
</script>

<style lang="scss" scoped>
//操作业务单据审批设置
.cwf_editBillSetting {
  .detail {
    width: 100%;
    overflow: hidden;
    margin-bottom: 60px;
    //个性设置
    .box {
      margin-bottom: 24px;
      min-height: 600px;
      // height: 715px;
      // overflow-y:scroll;
      // overflow-x:hidden;
      float: left;
      .box-item {
        margin-bottom: 24px;
        .item-title {
          font-size: 12px;
          width: 150px;
          line-height: 32px;
          height: 32px;
          text-align: left;
          padding-right: 5px;
          color: #666666;
        }
      }
    }
    //指定组织
    .cinema-item {
      min-width: 284px;
      float: left;
      // min-height: 870px;
      height: 770px;
      overflow-y: scroll;
      overflow-x: hidden;
      font-size: 12px;
      // overflow: hidden;
      background: #f5f5f5;
      margin-right: 20px;
      padding-top: 10px;
      .el-tree {
        margin-top: 10px;
      }
    }
  }
  //底部
  .footer {
    position: fixed;
    bottom: 0px;
    height: 70px;
    line-height: 70px;
    width: 90%;
    background: #ffffff;
    text-align: center;
    .el-button {
      width: 80px;
      height: 32px;
      text-align: center;
      vertical-align: middle;
      padding: 0;
      margin: 0;
      line-height: 32px;
      margin-right: 32px;
    }
  }
}
</style>
