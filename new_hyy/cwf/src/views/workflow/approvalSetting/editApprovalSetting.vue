<template>
  <div class="cwf_editApprovalSetting">
    <el-form :rules="rules" ref="ruleForm" :model="formData">
      <!-- 审批流程信息 -->
      <div class="editApprovalSetting-header">
        <div class="header-item">
          <div class="header-item-name">审批流程名称：</div>
          <div class="header-item-content">
            <el-form-item prop="name">
              <el-input placeholder="请输入内容" v-model="formData.name" clearable></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="header-item">
          <div class="header-item-name">审批节点数：</div>
          <div class="header-item-content">
            <el-form-item prop="noteNum">
              <el-select class="setting-noteNum" v-model="formData.noteNum" placeholder="请选择" @change="changeNoteNum" :disabled="type=='edit'?true:false">
                <el-option v-for="item in noteNumUpper" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </div>
      <!-- 节点审批设置 -->
      <el-collapse v-model="activeNames" class="collapse-style">
        <el-collapse-item title="节点审批设置" name="1">
          <div class="editApprovalSetting-item-left">
            <div class="items"><span class="circle"></span><span class="words">开始</span></div>
            <div class="line"></div>
            <!-- 开始节点 -->
            <template v-for="(item,index) in formData.processList">
              <div :key="index">
                <div class="items" style="margin:3px 0;">
                  <span class="round">
                    <span class="round-number">{{index+1}}</span>
                  </span>
                  <span class="words">审批人：</span>
                </div>
                <div class="line"></div>
              </div>
            </template>
            <!-- 结束节点 -->
            <div class="items"><span class="circle"></span><span class="words">结束</span></div>
          </div>
          <div class="editApprovalSetting-item-right">
            <div class="content-first"></div>
            <template v-for="(item,index) in formData.processList">
              <div class="content" :key="index">
                <el-form-item :prop="'processList.'+index+'.assigneeName'" :rules="rules.user">
                  <el-input :class="{'setting-user':true, 'setting-user-value':!item.assigneeName}" placeholder="请选择审批人" v-model="item.assigneeName" readonly></el-input>
                  <i class="el-icon-close close-btn" @click="clearInputValue(index,$event)" v-show="item.assigneeName"></i>
                  <el-button class="select-btn" type="primary" plain @click="showUserHandler(index,$event)">选择用户</el-button>
                  <el-button class="select-btn" type="primary" plain @click="showRoleHandler(index,$event)">选择角色</el-button>
                  <div class="tip">同一审批节点，只能选择一种类型审批</div>
                </el-form-item>
              </div>
            </template>
            <div class="content-last"></div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <!-- 弹窗 -->
      <userAndRoleDialog v-if="showSelectBox" :showSelectWindow="showSelectBox" @closeSelcetWindow="closeSelcetWindow" :windowType="windowType" @submitData="submitDataRes" :reviewList="reviewList"></userAndRoleDialog>
      <!-- 底部按钮 -->
      <div class="footer">
        <el-button type="primary" @click="commitSetting('ruleForm')">确 定</el-button>
        <el-button @click="closeBack">取 消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import userAndRoleDialog from "./userAndRoleDialog"
export default {
  components: {
    userAndRoleDialog
  },
  data () {
    return {
      type: this.$route.query.type || "",//页面状态
      spId: this.$route.query.spId || "",//id
      noteNumUpper: 4,//审批节点数上限
      formData: {
        name: "",
        noteNum: 1,
        processList: [{
          assigneeId: "",
          assigneeName: "",
          assigneeType: 0,
          nextNoteNum: null,
          noteNum: 1,
          tenantId: this.$store.state.loginUser.consumerId || ""
        }],
        tenantId: this.$store.state.loginUser.consumerId || "", //商户id
      },
      activeNames: ['1'],
      tenantId: this.$store.state.loginUser.consumerId || "", //商户id
      currentItemIndex: 0,
      windowType: "",
      showSelectBox: false,
      showSelectWindow: false,
      reviewList: [],//回显传入参数列表
      rules: {
        //审批流程名称
        name: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
              let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
              if (!value.trim()) {
                callback(new Error('请输入审批流程名称'))
              } else {
                if (regEn.test(value) || regCn.test(value)) {
                  callback(new Error('只能输入字母、数字、汉字，不允许输入特殊字符'))
                } else {
                  callback()
                }
              }
            }
          },
          {
            min: 0,
            max: 15,
            message: '长度在 1 到 15 个字符',
            trigger: 'blur'
          }
        ],
        //审批节点数
        noteNum: [
          {
            required: true,
            message: '请选择审批节点数',
            trigger: 'blur',
          },
        ],
        //审批人
        user: [
          {
            required: true,
            message: '请选择审批人',
            trigger: 'change',
          },
        ],

      },
    }
  },
  created () {
    this.showpageType()
  },
  methods: {
    //根据id获取审批流程详情
    findSpById () {
      let params = {
        spId: this.spId
      }
      this.$cwfList.findSpById(params).then(data => {
        if (data && data.code === 200 && data.flag == 1) {
          let reviewData = data.data
          //编辑时的回显
          this.formData.noteNum = reviewData.noteNum
          this.formData.name = reviewData.name
          this.formData.processList = []
          reviewData.processList.forEach(element => {
            this.formData.processList.push({
              assigneeId: element.assigneeId,
              assigneeName: element.assigneeName,
              assigneeType: element.assigneeType,
              processId: element.processId,
            })
          });
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
    //关闭返回
    closeBack () {
      this.$store.commit("tagNav/removeTagNav", this.$route);
      this.$router.push({
        path: "/workflow/approvalSetting"
      })
    },
    //区分页面类型
    showpageType () {
      if (this.type == "edit") {
        this.findSpById()
      }
      if (this.type == "add") {

      }
    },
    //重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    //提交审批流程
    commitSetting (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("success")
          console.log(this.formData)
          if (this.type == "edit") {
            this.formData.id = this.spId//spId
            this.editApprovalProcess(this.formData)
          }
          if (this.type == "add") {
            this.formData.status = 0//新建流程状态 开启0 关闭1 
            this.addApprovalProcess(this.formData)
          }
        } else {
          return false;
        }
      });
    },
    //新建审批流程
    addApprovalProcess (params) {
      this.$cwfList.addApprovalProcess(params).then(data => {
        if (data && data.code === 200 && data.flag == 1) {
          this.closeBack()
          this.$message({
            message: "新增成功",
            type: "success",
            duration: 1000
          });
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
    //编辑审批流程
    editApprovalProcess (params) {
      console.log(JSON.stringify(params))
      this.$cwfList.editApprovalProcess(params).then(data => {
        if (data && data.code === 200 && data.flag == 1) {
          this.closeBack()
          this.$message({
            message: "编辑成功",
            type: "success",
            duration: 1000
          });
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
    //选择用户弹窗
    showUserHandler (index) {
      console.log(index)
      this.currentItemIndex = index
      this.windowType = '选择用户'
      this.reviewList = []
      // 回显
      if (this.formData.processList[index].assigneeType == 0) {
        if (this.formData.processList[index].assigneeName && this.formData.processList[index].assigneeId) {
          this.formData.processList[index].assigneeId.split(',').map((item) => { this.reviewList.push({ uid: item, fullName: "", reviewFlag: "review" }) });
          this.formData.processList[index].assigneeName.split(',').map((item, i) => { this.reviewList[i].fullName = item });
        }
      } else {
        this.reviewList = []
      }
      this.showSelectBox = true
    },
    //选择角色弹窗
    showRoleHandler (index) {
      console.log(index)
      this.currentItemIndex = index
      this.windowType = '选择角色'
      this.reviewList = []
      // 回显
      if (this.formData.processList[index].assigneeType == 1) {
        if (this.formData.processList[index].assigneeName && this.formData.processList[index].assigneeId) {
          this.formData.processList[index].assigneeId.split(',').map((item) => { this.reviewList.push({ uid: item, name: "", reviewFlag: "review" }) });
          this.formData.processList[index].assigneeName.split(',').map((item, i) => { this.reviewList[i].name = item });
        }
      } else {
        this.reviewList = []
      }
      this.showSelectBox = true
    },
    //清除输入框内容
    clearInputValue (index) {
      this.formData.processList[index].assigneeName = ""
    },
    //关闭弹窗事件
    closeSelcetWindow () {
      console.log("closeSelcetWindow")
      this.showSelectBox = false
    },
    //弹窗回调事件
    submitDataRes (strdData) {
      console.log("strdData", strdData)
      this.formData.processList[this.currentItemIndex].assigneeId = strdData.assigneeId
      this.formData.processList[this.currentItemIndex].assigneeName = strdData.assigneeName
      this.formData.processList[this.currentItemIndex].assigneeType = strdData.assigneeType
    },
    //监听
    changeNoteNum (value) {
      console.log(value)
      this.formData.noteNum = value
      let list = []
      let nextNoteNum = ""
      for (var i = 0; i < value; i++) {
        if (value <= nextNoteNum) {
          nextNoteNum = null
        } else {
          nextNoteNum = i + 2
        }
        list.push({
          assigneeId: "",
          assigneeName: "",
          assigneeType: 0,
          nextNoteNum: nextNoteNum,
          noteNum: i + 1,
          tenantId: this.tenantId
        })
      }
      this.formData.processList = list
      console.log(this.addParams)
    },
  },


}
</script>

<style lang="scss" scoped>
.cwf_editApprovalSetting {
  .collapse-style {
    width: 100%;
    border: 0;
    position: relative;
  }
  .editApprovalSetting-header {
    width: 100%;
    height: 60px;
    line-height: 60px;
    overflow: hidden;
    margin-top: 10px;
    padding-left: 20px;
    font-size: 12px;
    .header-item {
      float: left;
      margin-right: 64px;
      .header-item-name {
        display: inline-block;
        float: left;
        height: 40px;
        line-height: 40px;
        color: #666;
      }
      .header-item-content {
        min-width: 300px;
        display: inline-block;
        float: left;
        width: 100px;
        height: 32px;
        line-height: 32px;
        color: #2a2a2a;
        .setting-noteNum {
          width: 300px;
        }
      }
    }
  }
  .editApprovalSetting-item-left {
    position: absolute;
    width: 95px;
    min-height: 600px;
    float: left;
    overflow: hidden;
    padding: 15px 0px 15px 20px;
    box-sizing: border-box;
    .items {
      width: 80px;
      overflow: hidden;
      height: 20px;
      line-height: 20px;
      box-sizing: border-box;
      .circle {
        float: left;
        display: block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #bcbcbc;
        vertical-align: middle;
        margin: 4px 0;
        margin-right: 14px;
        margin-left: 4px;
      }
      .words {
        float: left;
        display: block;
        color: #666;
      }
      .round {
        border-radius: 50%;
        height: 20px;
        width: 20px;
        display: inline-block;
        vertical-align: top;
        border: 2px solid #bcbcbc;
        float: left;
        margin-right: 10px;
        .round-number {
          display: block;
          color: #bcbcbc;
          height: 20px;
          line-height: 20px;
          text-align: center;
          font-size: 12px;
          font-weight: bold;
          margin-top: -1px;
          margin-left: -1px;
        }
      }
    }
    .line {
      width: 80px;
      height: 72px;
      border-left: 1px solid #bcbcbc;
      margin-left: 10px;
    }
  }
  .editApprovalSetting-item-right {
    float: left;
    overflow: hidden;
    min-height: 600px;
    padding: 15px 100px 15px 100px;
    box-sizing: border-box;
    .content-first {
      height: 83px;
    }
    .content-last {
      height: 95px;
    }
    .content {
      overflow: hidden;
      box-sizing: border-box;
      position: relative;

      height: 86px;
      line-height: 22px;

      margin-bottom: 12px;
      padding-left: 50px;

      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: normal; /*规定段落中的文本不进行换行 */
      word-break: break-all;

      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      .setting-user {
        width: 300px;
        float: left;
        /deep/ .el-input__inner {
          padding-right: 30px !important;
        }
      }
      .setting-user-value {
        /deep/ .el-input__inner {
          background-color: #f5f5f5 !important;
        }
      }
      .close-btn {
        position: absolute;
        top: 12px;
        left: 275px;
        font-size: 16px;
        font-weight: bolder;
        color: #3b74ff;
      }
      .select-btn {
        width: 80px;
        float: left;
        height: 32px;
        // line-height: 32;
        padding: 0;
        margin: 5px 0px 5px 8px;
        font-family: MicrosoftYaHei;
        font-size: 12px;
        text-align: center;
      }
      .tip {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #999999;
        height: 20px;
        margin-top: 40px;
        line-height: 20px;
        // padding-left: 20px;
      }
    }
  }
  .footer {
    text-align: center;
    margin: 24px 0;
    .el-button {
      width: 80px;
      height: 32px;
      padding: 0;
      margin: 0px;
      text-align: center;
      line-height: 32px;
      margin-right: 32px;
    }
  }
}
</style>
