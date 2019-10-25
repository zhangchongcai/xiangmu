<template>
  <div class="page-wrapper page-distribution-send">
    <div class="clearboth" style="margin-top:30px;"></div>
    <!--基本信息-->
    <section class="page-distribution-content">
      <el-form ref="messageDistribution" :model="messageDistribution" :rules="rules" label-width="110px" label-position="right" label-height='60px'>
        <el-row :gutter="20" v-if="!isJustSee">
          <el-col :span="18">
            <el-form-item label="短信标题：" class="margin-bottom6" prop="batchTitle">
              <el-input v-model.trim="messageDistribution.batchTitle" style="width:480px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="!isJustSee">
          <el-col :span="18">
            <el-form-item label="手机号：" prop="mobiles">
              <el-radio-group v-model="sendType" :disabled="isModify">
                <el-radio label="1">批量</el-radio>
              </el-radio-group>
              <div>
                <el-input type="textarea" style="width:480px;" resize="none" rows="5" v-model="messageDistribution.mobiles" :disabled="isJustSee" placeholder="多个手机号多个半角逗号隔开" @blur="mobilesFunc"></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="18" class="temp-content">
            <el-form-item label="短信内容：" prop="content">
              <el-input type="textarea" style="width:480px;" resize="none" rows="5" v-model="messageDistribution.content" :disabled="isJustSee" placeholder="" @input="templateTextareaFunc" @blur="templateTextareaFunc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="false">
          <el-col :span="1"> &nbsp;</el-col>
          <el-col :span="17">
            <el-form-item label="示例：" prop="description">
              <!-- <el-input type="textarea" v-model="messageDistribution.description" :disabled="isJustSee"></el-input> -->
              <div class="template-demo-text">
                <!-- 【大地电影】购买成功，卡号：6669769,支付金额35元！ -->
                {{tempalteShowText}}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row :gutter="20" v-if="!isJustSee">
                    <el-col :span="18" >
                        <el-form-item label="测试手机号：" prop="description">
                            <el-input  v-model.trim="messageDistribution.phone" style="width:372px;"></el-input>
                            <el-button type="primary"  @click="sendMessage" style="margin-left:12px; padding:8px 8px;">发送测试短信</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>   -->

      </el-form>
      <div class="btn" style="margin:20px auto; text-align:center;">
        <el-button type="primary" v-if="!isModify && !isJustSee" @click="submitForm('messageDistribution')">确认发送</el-button>
        <!-- 修改调用接口 -->
        <el-button @click="out" v-if="!isJustSee">取消</el-button>
        <el-button @click="out" v-if="isJustSee">返回</el-button>
      </div>
    </section>

  </div>
</template>

<script>
import { querySmsRecord, querySmsTemplate, deletSmsTemplate, updateSmsTemplate, sendSameContentBatchMsg } from 'baseSrc/http/interface.js';
export default {
  name: 'messageDistributionAdd',
  data () {
    let maxlenght_100 = (rule, value, callback) => {
      if (!!value && value.length > 100) {
 callback(new Error('字符不能超出100位'));
      } else {
        callback();
      }
    };
    let valiMobiles = (rule, value, callback) => {
      let tempMobiles = value;
      // var testPhone = /^(1[3|4|5|6|7|8|9]\d{9}\,)*(1[3|4|5|6|7|8|9]\d{9})$/;
      var testPhone = /^(1[3|4|5|6|7|8|9]\d{9})*$/;
      var valdata = value.split(',');
      let isValid = true, envaildName = '', hash = {};
      for (let i = 0; i < valdata.length; i++) {
        if (testPhone.test(valdata[i]) == false) {
          isValid = false;
        }
      }
      for (var i = 0; i < valdata.length; i++) {
        if (testPhone.test(valdata[i]) == false) {
          envaildName += valdata[i] + '、'; // 手机格式正确
        } else {
          hash[valdata[i]] = true; // 手机格式不正确
        }
      }
      if (value == null) {
        value == '';
      }
      if (value.toString().trim() == '') {
        callback(new Error('请输入手机号'));
      } else if (!isValid) {
        callback(new Error(envaildName.substring(0, envaildName.length - 1) + ' 手机号格式不正确！'));
      } else if (value && value.length && value.substring(value.toString().length - 1, value.toString().length) == ',') {
        callback(new Error('最后一个手机号后面请不要以","结尾'));
      } else {
        callback();
      }
    };
    let IsRepeat = (rule, value, callback) => {
      var repeatName = '';
      var hash = {};
      var arrStr = value.split(',');
      for (var i = 0; i < arrStr.length; i++) {
        if (!hash[arrStr[i]]) {
          hash[arrStr[i]] = true; // 不重复
        } else {
          repeatName += arrStr[i] + '、'; // 重复
        }
      }
      if (repeatName != '') {
        callback(new Error(repeatName.substring(0, repeatName.length - 1) + '存在重复！'));
      } else {
        callback();
      }
    };
    // 发送短信内容验证
    let checkMsgContent = (rule, value, callback) => {
      // 输入限制正则
      var testName = /^[\u4e00-\u9fa50-9a-zA-Z\s\~\`\·\！\!\@\#\￥\%\^\……\&\*\（\）\——\-\+\=\【\】\{\}\|\、\\\：\；\:\;\“\”\‘\’\'\"\[\]\{\}\<\,\>\.\《\》\，\。\？\、\?\/\(\)\_]+$/;
      if (value == null) {
        value = '';
      }
      if (value.toString().replace(/\s/g, '') == '') {
        callback(new Error('短信内容不能为空'));
      } else if (!testName.test(value.toString().trim())) {
        callback(new Error('输入的短信含有不合法字符'));
      } else {
        callback();
      }
    };
    return {
      templateBread: '',
      sendType: '1',
      listLoading: false,
      tableKey: 1,
      sceneCodes: [],
      isModify: false,
      sendDebouce: false,
      isJustSee: false,
      seceneParam: '',
      contentMsg: '',
      tempalteShowText: '',
      messageDistribution: {
        mobiles: '',
        content: '',
        batchTitle: ''
      },
      rules: {
        batchTitle: [
          { validator: maxlenght_100, trigger: 'blur' }
        ],
        mobiles: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: valiMobiles, trigger: 'blur' },
          { validator: IsRepeat, trigger: 'blur' }
        ],
        seceneParam: [
          { required: true, message: '请先选择短信场景', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入短信内容', trigger: 'blur' },
          { validator: (rules, value, callback) => {
            if (value.length > 136) {
                return callback(new Error('短信内容字符数最多136个'));
              } else {
                callback();
              }
          },
trigger: 'blur' },
          { validator: checkMsgContent, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event);
    },
    mobilesFunc () {

    },
    seceneParamFunc (item) {
      console.log(item);
      this.messageDistribution.content = this.messageDistribution.content + '{' + item.paramCode + '}';
    },
    sendMessage () {
      this.sendDebouce = true;
      this.$refs['messageDistribution'].validate((valid) => {
        if (valid) {
          if (this.messageDistribution.phone == null || this.messageDistribution.phone == undefined || this.messageDistribution.phone == '') {
            this.error('请输入手机号');
            return;
          } else if (this.messageDistribution.phone.length != 11) {
            this.error('手机号格式不正确');
            return;
          }
          let postObj = {
            mobile: this.messageDistribution.phone,
            content: this.messageDistribution.content
          };
          // sendSingleMsg(postObj)
          // .then( ret => {
          //     if (ret.result) {
          //         this.success('发送测试短信成功')
          //         this.contentMsg = ret.msg
          //     } else {
          //         this.error(ret.msg)
          //     }
          // }).catch( err => {
          //     console.log(err)
          // })
        }
      });
    },
    closeDialog () {
      this.dialogFormVisible = false;
    },
    // 修改保存
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let messageDistributionBase = this.messageDistribution;
          // 创建调用接口
          sendSameContentBatchMsg(messageDistributionBase)
            .then(ret => {
              if (ret.result) {
                this.$store.commit('tagNav/removeTagNav', this.$route);
                this.success('短信发送成功');
                this.$router.push('/sys/message/distribution');
              } else {
                this.error(ret.msg);
              }
            }).catch(err => {
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },
    // 取消退出
    out () {
      this.$store.commit('tagNav/removeTagNav', this.$route);
      this.$router.push('/sys/message/distribution');
    },
    templateTextareaFunc () {
      var matchHuaKuoHao = /\{(.+?)\}/g; // {} 花括号，大括号
      let content = this.messageDistribution.content;
      let matchValue = content.match(matchHuaKuoHao);
      console.log(matchValue, 1);
      let tempalteShowText = this.tempalteShowText;
      let hasnotHuakuohao = [];
      if (matchValue) {
        for (let i = 0; i < matchValue.length; i++) {
          var astring = matchValue[i].slice(1, matchValue[i].length - 1);
          hasnotHuakuohao.push(astring);
        }
        let hasnotHuakuohaoSample = [];
        console.log(hasnotHuakuohaoSample);
      }
      let seceneParamLoop = this.messageDistribution.seceneParam;
    },
    templateFunc (obj) {
      console.log(obj);
      let itemScene = this.sceneCodes.filter(item => item.sceneCode == obj);
      this.messageDistribution.seceneParam = itemScene && itemScene[0] && itemScene[0].paramList;
      console.log(itemScene[0]);
      this.messageDistribution.sceneName = itemScene && itemScene[0] && itemScene[0].sceneName;
      this.messageDistribution.sceneCode = itemScene && itemScene[0] && itemScene[0].sceneCode;
      this.messageDistribution.templateName = itemScene && itemScene[0] && itemScene[0].sceneName;
      this.messageDistribution.templateCode = itemScene && itemScene[0] && itemScene[0].sceneCode;
      let paramCurrentUse = itemScene && itemScene[0] && itemScene[0].paramList;
      // let templateInfo1 = '【大地电影】购买成功，卡号：{CardCode},支付金额{Money}元！'
      // let templatetext = '【大地电影】购买成功，卡号：6669769,支付金额35元！'
      let templateInfo = '【大地电影】购买成功，';
      let templatetext = '【大地电影】购买成功，';
      for (let i = 0; i < paramCurrentUse.length; i++) {
        templateInfo += paramCurrentUse[i].paramName + ':' + '{';
        templateInfo += paramCurrentUse[i].paramCode + '}';
        templatetext += paramCurrentUse[i].paramName + ':';
        templatetext += paramCurrentUse[i].sample;
      }
      this.messageDistribution.content = templateInfo;
      this.tempalteShowText = templatetext;
    },
    unique (arr) {
      var newArr = [arr[0]];
      for (var i = 1; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) == -1) {
          newArr.push(arr[i]);
        }
      }
      return newArr;
    },
    addContact () {
      let abc = this.$refs;
      //    this.tableData.push({contract:'',telephone:'', job:'' ,email:''})
      if (this.$refs.tableDataRef) {
        // this.$refs.tableDataRef.clearValidate()
      }
      this.dialogFormVisible = true;
    }
  },
  created () {
    this.isModify = !!((this.$route.query.isModify == 'true' || this.$route.query.isModify == true));
    this.isJustSee = !!((this.$route.query.isJustSee == 'true' || this.$route.query.isJustSee == true));
    if (this.isModify) {
      if (!this.isJustSee) {
        this.templateBread = '编辑短信模板';
      }
    }
    if (!this.isModify) {
      this.templateBread = '新建短信模板';
    }
  }
};
</script>
<style lang="scss">
.page-justsee-message-channel {
  .el-form-item__label {
    font-size: 12px;
    line-height: 30px;
  }
  .el-input__inner {
    font-size: 12px;
  }
  .el-textarea__inner {
    font-size: 12px;
  }
  input::-webkit-input-placeholder {
    font-size: 12px;
  }
  input::-moz-placeholder {
    font-size: 12px;
  }
  input::-ms-input-placeholder {
    font-size: 12px;
  }
  textarea::-webkit-textarea-placeholder {
    font-size: 12px;
  }
  textarea::-webkit-textarea-placeholder {
    font-size: 12px;
  }
  textarea::-webkit-textarea-placeholder {
    font-size: 12px;
  }
  .temp-content {
    .el-textarea.is-disabled {
      .el-textarea__inner {
        border: 1px solid #bcbcbc;
      }
    }
  }
  .just-see-checkbox {
    span {
      margin-right: 6px;
    }
  }
  .el-date-editor.is-disabled .el-icon-date {
    display: none;
  }
  .el-textarea.is-disabled .el-textarea__inner {
    border-color: transparent;
    background-color: transparent;
    cursor: text;
    color: #808080;
    border: 0 none;
    padding-top: 10px;
  }
  .el-checkbox {
    margin-left: 0;
    margin-right: 30px;
  }
  .el-input.is-disabled .el-input__inner {
    border-color: transparent;
    background-color: transparent;
    cursor: text;
    color: #808080;
    padding: 0;
    border: 0 none;
    &:link {
      border: none;
    }
    &:visited {
      border: none;
    }
    &:hover {
      border: none;
    }
    &:active {
      border: none;
    }
  }
  .normal-text {
    color: #808080;
    padding: 0;
  }
  .no-anchor {
    .el-input__suffix {
      display: none;
    }
  }
  .el-form-item__content {
    color: #808080;
  }
}
</style>   
<style  lang='scss' scoped>
.page-distribution-content {
  .el-row {
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-form-item.margin-bottom0 {
    margin-bottom: 0;
  }
  .el-form-item {
    margin-bottom: 21px;
  }
  .el-form-item.margin-bottom6 {
    margin-bottom: 6px;
  }
  // .el-form-item__content, .el-form-item__label{
  //     line-height: 24px;
  // }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .el-table .cell span.table-btn-mini {
    color: #3b74ff;
    cursor: pointer;
    margin-right: 6px;
  }
  .scene-btn {
    color: #3b74ff;
    border: 1px solid #3b74ff;
    border-radius: 4px;
    padding-left: 12px;
    padding-right: 12px;
    height: 28px;
    line-height: 28px;
    font-size: 12px;
    cursor: pointer;
  }
}
.template-box {
  .left {
    float: left;
  }
  .right {
    float: right;
  }
}
.template-demo-text {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding-bottom: 8px;
  min-height: 32px;
}
.scene-btn {
  float: left;
  margin-right: 6px;
}
</style>
