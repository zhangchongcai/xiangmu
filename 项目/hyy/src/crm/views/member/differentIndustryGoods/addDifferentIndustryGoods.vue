<template>
  <div class="_add-different-industry-goods">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="medium" label-width="120px" label-position="left">
      <el-collapse v-model="activeNames" class="different-industry-goods-content">
        <!-- 商品信息 -->
        <el-collapse-item title="商品信息" name="1">
          <div class="goods-info">
            <el-form-item label="商家名称：" prop="merchantName">
              <el-input v-model="ruleForm.merchantName" placeholder="请输入商户名称"></el-input>
            </el-form-item>
            <el-form-item label="合同编号：" prop="pactNo">
              <el-input v-model="ruleForm.pactNo" placeholder="请输入商家合同编号"></el-input>
            </el-form-item>
            <el-form-item label="商品名称：" prop="goodsName">
              <el-input v-model="ruleForm.goodsName" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item label="商品类型：" prop="goodsType" class="balance-insufficient">
              <el-select v-model="ruleForm.goodsType" placeholder="选择商品类型">
                <el-option v-for="item in goodsTypeOptions" :key="item.commodityTypeNo" :label="item.commodityTypeName"
                  :value="item.commodityTypeNo"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="核销方式：" prop="writeOffWay" class="balance-insufficient">
              <el-select v-model="ruleForm.writeOffWay" placeholder="选择优惠券核销方式">
                <el-option label="线上获取，线上消费" value="ONLINE_ONLINE"></el-option>
                <el-option label="线上获取，线下消费" value="ONLINE_OFFLINE"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="成本价：" prop="costPrice">
              <el-input v-model="ruleForm.costPrice" placeholder="请输入单个商品的成本价"></el-input> 元
            </el-form-item>
            <el-form-item label="有效期：" class="ticket-preferential-restrictions-wrap" prop="validityType">
              <div class="ticket-preferential-restrictions-item">
                <el-radio v-model="ruleForm.validityType" label="fixed_type">固定型</el-radio>
                <el-date-picker style="width:360px" v-model="cooperationTime" :disabled="!(ruleForm.validityType == 'fixed_type')"
                  align="right" unlink-panels clearable range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                  type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
              </div>
              <div class="ticket-preferential-restrictions-item">
                <el-radio v-model="ruleForm.validityType" label="dynamic_type">动态型</el-radio>
                <el-input @input="changeTimeNum" :value="ruleForm.validityType == 'dynamic_type'?ruleForm.timeNum:''"
                  placeholder="请输入天数" :disabled="!(ruleForm.validityType == 'dynamic_type')" size="medium"></el-input>
                天
              </div>
            </el-form-item>
            <el-form-item label="上传优惠券：" prop="goodsTickets" class="goods-tickets">
              <div style="display:flex">
                <!-- <div class="titcket-num">{{ruleForm.goodsTickets | formatGoodsTickets}}</div> -->
                <div class="titcket-num">{{ruleForm.goodsTickets[0].ticketNum}}</div>
                <el-upload class="upload-demo" :action="$store.state.crm.fileUploadUrl" :on-success="fileUploadSuccess"
                  :show-file-list="false" :before-upload="beforeFileUpload" name="file" :headers="uploadHeaders">
                  <div class="select-btn"><em>导入</em></div>
                  <!-- <div class="el-upload__tip">请上传EXCEL文档</div> -->
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item label="商品说明：" prop="remark" class="remark">
              <el-input type="textarea" resize="none" :rows="5" v-model="ruleForm.remark" placeholder="请输入商品文本介绍"></el-input>
            </el-form-item>
            <el-form-item label="商品图片：" prop="imgPath" class="imgPath">
              <div style="float:left">
                <label for="imgupload">
                  <img v-show="ruleForm.imgPath" style="width:148px;height:148px" :src="ruleForm.imgPath" alt="商品图片">
                </label>
              </div>
              <div :style="ruleForm.imgPath?'float:left;margin-left:10px;margin-top:-5px;':''">
                <el-upload style="margin-top:5px " :show-file-list="false" :action="$store.state.crm.imgAction"
                  list-type="picture-card" :before-upload="beforeAvatarUpload" accept="image/*" :on-success="imgUpload"
                  :multiple="false" name="file" :data="{type:'equity_picture'}" :headers="uploadHeaders">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </el-form-item>
          </div>
        </el-collapse-item>
        <!-- 优惠券适用规则 -->
        <el-collapse-item title="优惠券适用规则" name="2">
          <div class="applicable-rules">
            <el-form-item label="可用时间：" prop="diffGoodsRule.useTime">
              <el-input v-model="ruleForm.diffGoodsRule.useTime" placeholder="请填写优惠券可用时间"></el-input>
            </el-form-item>
            <el-form-item label="使用门店：" prop="diffGoodsRule.applyStores">
              <el-input v-model="ruleForm.diffGoodsRule.applyStores" placeholder='请填写优惠券适用门店,多门店之间用英文";"隔开'></el-input>
            </el-form-item>
            <el-form-item label="预约提示：" prop="diffGoodsRule.appointmentReminder">
              <el-input v-model="ruleForm.diffGoodsRule.appointmentReminder" placeholder="请填写到店预约提醒"></el-input>
            </el-form-item>
          </div>
        </el-collapse-item>
        <!-- 库存预警 -->
        <el-collapse-item title="库存预警" name="3">
          <div class="stock-early-warning">
            <el-form-item label="剩余库存：" prop="diffGoodsWarning.warningNum">
              <el-input v-model="ruleForm.diffGoodsWarning.warningNum" placeholder="请输入剩余多少库存触发预警"></el-input>
            </el-form-item>
            <el-form-item label="预警手机号：" prop="diffGoodsWarning.warningMobileNums">
              <el-input v-model="ruleForm.diffGoodsWarning.warningMobileNums" placeholder='请输入预警手机号,多个手机号用英文";"号隔开'></el-input>
            </el-form-item>
            <el-form-item label="预警邮箱地址：" prop="diffGoodsWarning.warningEmail">
              <el-input v-model="ruleForm.diffGoodsWarning.warningEmail" placeholder='请输入预警邮箱地址,多个邮箱地址用英文";"号隔开'></el-input>
            </el-form-item>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-form-item style="textAlign:center">
        <el-button type="primary" @click="submitForm('ruleForm')" class="_el-btn-custom _member-add-edit-save-btn">保存</el-button>
        <el-button @click="handleCancle" class="_el-btn-custom">取消</el-button>
      </el-form-item>
    </el-form>
    <fixStepTool :stepData="stepData.stepList" class="_fixsteptool-member"></fixStepTool>
  </div>
</template>
<script>
import FixStepTool from "../../../components/fix-step-tool/fix-step-tool";
import fixStepMixin from "../../../mixins/CRM/fixStepTool.js";
export default {
  name: "AddDifferentIndustryGoods",
  data() {
    // 初始化有效期时间
    var start = new Date(new Date().toLocaleDateString());
    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    var oneday = 1000 * 60 * 60 * 24;
    var nextday = new Date(today - oneday - 1).addDays(+3);
    // 输入限制正则
    var testName = /^[\u4e00-\u9fa50-9a-zA-Z\s\~\`\·\！\!\@\#\￥\%\^\……\&\*\（\）\——\-\+\=\【\】\{\}\|\、\\\：\；\:\;\“\”\‘\’\'\"\[\]\{\}\<\,\>\.\《\》\，\。\？\、\?\/\(\)\_]+$/;

    // 验证商户名称
    var checkMerchantName = (rule, value, callback) => {
      if (!value.toString().trim()) {
        callback(new Error("请输入商户名称"));
      } else if (!testName.test(value.toString().trim())) {
        callback(new Error("输入的名称含有不合法字符"));
      } else {
        callback();
      }
    };
    // 验证卡政策名称
    var checkGoodsName = (rule, value, callback) => {
      if (!value.toString().trim()) {
        callback(new Error("请输入商品名称"));
      } else if (!testName.test(value.toString().trim())) {
        callback(new Error("输入的名称含有不合法字符"));
      } else {
        this.$crmList
          .goodsNameIsExist({
            goodsName: value.toString().trim(),
            goodsId: this.$route.query.goodsId ? this.$route.query.goodsId : "",
            tenantId: this.$store.state.loginUser.consumerId
          })
          .then(data => {
            if (data.isExist) {
              callback(new Error("该名称已存在，请更换其他名称"));
            } else {
              this.ruleForm.goodsName = value.toString().trim();
              callback();
            }
          })
          .catch(err => console.log(err));
      }
    };
    // 验证成本价、验证剩余库存预警
    var checkCostPrice = (rule, value, callback) => {
      if (!value) {
        value = "";
      }
      if (value.toString().replace(/\s/g, "") == "") {
        callback(new Error("请输入数字"));
      }
      if (!/^[1-9]\d*$/.test(value.toString().replace(/\s/g, ""))) {
        callback(new Error("请输入正整数"));
      }
      if (value.toString().replace(/\s/g, "") * 1 > 99999999) {
        callback(new Error("最多不能超过8位数字"));
      } else {
        callback();
      }
    };
    // 验证预警手机号
    var checkWarningPhone = (rule, value, callback) => {
      var testPhone = /^(1[3|4|5|6|7|8|9]\d{9}\;)*(1[3|4|5|6|7|8|9]\d{9})$/;
      if (value == null) {
        value == "";
      }
      if (value.toString().trim() == "") {
        callback(new Error("请输入预警手机号"));
      }
      if (!testPhone.test(value.toString().trim())) {
        callback(new Error('请输入预警手机号,多个手机号用英文";"号隔开'));
      } else {
        callback();
      }
    };
    // 校验预警邮箱
    var checkWarningEmail = (rule, value, callback) => {
      var testEmail = /^((([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6}\;))*(([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})))$/;
      if (value == null) {
        value == "";
      }
      if (value.toString().trim() == "") {
        callback(new Error("请输入预警邮箱地址"));
      }
      if (!testEmail.test(value.toString().trim())) {
        callback(new Error('请输入预警邮箱地址,多个邮箱地址用英文";"号隔开'));
      } else {
        callback();
      }
    };
    // 校验有效期
    var checkValidityType = (rule, value, callback) => {
      if (!this.ruleForm.timeNum) {
        this.ruleForm.timeNum = "";
      }
      if (!this.cooperationTime) {
        this.cooperationTime = [];
      }
      if (this.ruleForm.validityType == "fixed_type") {
        if (this.cooperationTime.length < 2) {
          callback(new Error("请选择日期"));
        } else {
          callback();
        }
      }
      if (this.ruleForm.validityType == "dynamic_type") {
        if (this.ruleForm.timeNum.toString().replace(/\s/g, "") == "") {
          callback(new Error("请输入数字"));
        }
        if (
          !/^[1-9]\d*$/.test(
            this.ruleForm.timeNum.toString().replace(/\s/g, "")
          )
        ) {
          callback(new Error("请输入正整数"));
        } else {
          callback();
        }
      }
    };
    // 校验优惠券
    var checkTicketNum = (rule, value, callback) => {
      if (value == null) {
        value = [
          {
            ticketPath: "", //文件路径
            ticketNum: 0 //优惠券张数
          }
        ];
      }
      if (value[0].ticketNum > 0) {
        callback();
      } else {
        callback(new Error("请上传优惠券"));
      }
    };

    return {
      uploadHeaders: {
        Authorization: this.$store.state.loginToken,
        "Cpm-User-Token": this.$store.state.loginToken
      },
      activeNames: ["1", "2", "3"],
      cooperationTime: [start, nextday], //初始化有效期时间
      goodsTypeOptions: [], //商品类型数组
      stepData: {
        stepEl: ".el-collapse-item",
        stepList: [
          {
            name: "商品信息",
            isactive: false
          },
          {
            name: "优惠券适用规则",
            isactive: false
          },
          {
            name: "库存预警",
            isactive: false
          }
        ]
      },
      ruleForm: {
        tenantId: this.$store.state.loginUser.consumerId,
        goodsAttribute: this.$route.query.goodsAttribute, //商品属性  electronic_coupons：电子优惠券,virtual_card：虚拟卡,physical_commodity：实物商品
        merchantName: "", //商家名称
        pactNo: "", //合同编号
        goodsName: "", //商品名称
        goodsType: "", //商品类型
        writeOffWay: "", //核销方式
        costPrice: "", //成本价
        validityType: "fixed_type", //有效期类型
        timeNum: "", //动态时间
        startTime: "", //固定时间的开始时间
        endTime: "", //固定时间的结束时间
        goodsTickets: [
          {
            ticketPath: "", //文件路径
            ticketNum: 0 //优惠券张数
          }
        ], //上传的优惠券文件地址
        remark: "", //商品说明
        imgPath: "", //商品图片地址
        diffGoodsRule: {
          //使用规则
          useTime: "", //使用时间
          applyStores: "", //适用门店
          appointmentReminder: "" //预约提示
        },
        diffGoodsWarning: {
          //预警提示
          warningNum: "", //剩余库存
          warningMobileNums: "", //提示电话
          warningEmail: "" //提示邮箱
        }
      },
      rules: {
        merchantName: [
          { max: 50, message: "长度不可超过50个字符", trigger: "blur" },
          { required: true, validator: checkMerchantName, trigger: "blur" }
        ],
        pactNo: [{ max: 30, message: "长度不可超过30个字符", trigger: "blur" }],
        goodsName: [
          { max: 30, message: "长度不可超过30个字符", trigger: "blur" },
          { required: true, validator: checkGoodsName, trigger: "blur" }
        ],
        goodsType: [
          { required: true, message: "请选择商品类型", trigger: "change" }
        ],
        writeOffWay: [
          { required: true, message: "请选择核销方式", trigger: "change" }
        ],
        costPrice: [
          { required: true, validator: checkCostPrice, trigger: "blur" }
        ],
        validityType: [
          { required: true, validator: checkValidityType, trigger: "blur" }
        ],
        goodsTickets: [
          { required: true, validator: checkTicketNum, trigger: "change" }
        ],
        remark: [
          { max: 500, message: "长度不可超过500个字符", trigger: "blur" },
          { required: false, message: "", trigger: "blur" }
        ],
        imgPath: [
          { required: true, message: "请上传商品图片", trigger: "change" }
        ],
        "diffGoodsRule.useTime": [
          { max: 30, message: "长度不可超过30个字符", trigger: "blur" }
        ],
        "diffGoodsRule.applyStores": [
          { max: 500, message: "长度不可超过500个字符", trigger: "blur" }
        ],
        "diffGoodsRule.appointmentReminder": [
          { max: 50, message: "长度不可超过50个字符", trigger: "blur" }
        ],
        "diffGoodsWarning.warningNum": [
          { required: true, validator: checkCostPrice, trigger: "blur" }
        ],
        "diffGoodsWarning.warningMobileNums": [
          { max: 500, message: "长度不可超过500个字符", trigger: "blur" },
          { required: true, validator: checkWarningPhone, trigger: "blur" }
        ],
        "diffGoodsWarning.warningEmail": [
          { max: 500, message: "长度不可超过500个字符", trigger: "blur" },
          { required: true, validator: checkWarningEmail, trigger: "blur" }
        ]
      }
    };
  },
  components: {
    fixStepTool: FixStepTool
  },
  mixins: [fixStepMixin],
  watch: {
    "ruleForm.goodsTickets": {
      handler(newVal, oldVal) {
        if (newVal[0].ticketNum > 0) {
          this.$refs["ruleForm"].clearValidate("goodsTickets");
        }
      },
      deep: true
    }
  },
  filters: {
    // 计算上传文件的总数
    // formatGoodsTickets(value) {
    //   if (value.length > 0) {
    //         var totalNum = 0
    //       for (var i = 0; i < value.length; i++) {
    //         totalNum += parseInt(value[i].ticketNum)
    //       }
    //       return totalNum
    //     }
    // }
  },
  mounted() {
    // 请求商品类型
    this.$crmList
      .diffCommodityTypeList({
        tenantId: this.$store.state.loginUser.consumerId,
        current: 1,
        size: 100
      })
      .then(res => {
        this.goodsTypeOptions = res.records;
      });
    if (this.$route.query.goodsId) {
      this.$crmList
        .diffGoodsDetail({
          tenantId: this.$store.state.loginUser.consumerId,
          goodsId: this.$route.query.goodsId
        })
        .then(res => {
          if (res.validityType == "fixed_type") {
            this.ruleForm = res;
            // this.cooperationTime = [res.startTime, res.endTime];
            this.$set(this, "cooperationTime", [
              new Date(res.startTime.replace(/-/g, "/")).formatDate(
                "yyyy-MM-dd hh:mm:ss"
              ),
              new Date(res.endTime.replace(/-/g, "/")).formatDate(
                "yyyy-MM-dd hh:mm:ss"
              )
            ]);
          } else if (res.validityType == "dynamic_type") {
            this.ruleForm = res;
          }
        });
    }
  },
  methods: {
    // 有效期
    changeTimeNum(val) {
      this.$set(this.ruleForm, "timeNum", val);
    },
    // // 上传优惠券
    // handleExceed(files, fileList) {
    //   this.$message.warning(`当前限制选择 1 个文件，请删除后继续上传`);
    // },
    fileUploadSuccess(response, file, fileList) {
      //文件上传成功
      if (response.code == 200) {
        this.$message.success("导入成功!");
        this.ruleForm.goodsTickets[0].ticketPath = response.data.path;
        this.ruleForm.goodsTickets[0].ticketNum = response.data.num;
        // this.ruleForm.goodsTickets.push({
        //   ticketPath: response.data.path,
        //   ticketNum: response.data.num
        // });
      } else {
        this.$message.error(response.msg);
      }
    },
    beforeFileUpload(file) {
      const isText = file.type === "application/vnd.ms-excel";
      const isTextComputer =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      // return isText | isTextComputer;
      if (isText | isTextComputer) {
        if (file.size > 50 * 1024 * 1024) {
          this.error("文件附件不能大于50M，请重新选择上传");
          return false;
        }
      } else {
        this.error("文件格式不正确");
        return false;
      }
    },
    // 删除文件
    removeUploadFile(file, fileList) {
      this.ruleForm.goodsTickets = [];
    },
    //图片拦截，格式
    beforeAvatarUpload(file) {},
    //图片上传返回处理
    imgUpload(response, file, fileList) {
      if (!response.data) {
        this.$message.error(response.msg);
      } else {
        this.ruleForm.imgPath = response.data.url;
      }
    },
    // 取消
    handleCancle() {
      this.$store.commit("tagNav/removeTagNav", this.$route);
      this.$router.push({ path: "/member/differentIndustryGoods/list" });
    },
    //   提交表单前的校验
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = this.ruleForm;
          if (data.validityType == "fixed_type") {
            data.startTime = new Date(
              this.cooperationTime[0].toString().replace(/-/g, "/")
            ).formatDate("yyyy-MM-dd hh:mm:ss");
            data.endTime = new Date(
              this.cooperationTime[1].toString().replace(/-/g, "/")
            ).formatDate("yyyy-MM-dd hh:mm:ss");
            data.timeNum = "";
          } else if (data.validityType == "dynamic_type") {
            data.startTime = "";
            data.endTime = "";
          }
          for (var i = 0; i < this.goodsTypeOptions.length; i++) {
            if (data.goodsType == this.goodsTypeOptions[i].commodityTypeNo) {
              data.goodsTypeName = this.goodsTypeOptions[i].commodityTypeName;
            }
          }
          if (this.$route.query.goodsId) {
            // 修改商品
            this.$crmList
              .editDiffGoods(data)
              .then(res => {
                this.$message.success("修改成功");
                this.$store.commit("tagNav/removeTagNav", this.$route);
                this.$router.push({
                  path: "/member/differentIndustryGoods/list"
                });
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            // 新建商品
            this.$crmList
              .addDiffGoods(data)
              .then(res => {
                this.$message.success("添加成功");
                this.$store.commit("tagNav/removeTagNav", this.$route);
                this.$router.push({
                  path: "/member/differentIndustryGoods/list"
                });
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss">
._add-different-industry-goods {
  width: 80%;
  .different-industry-goods-content {
    border: 0;

    .el-form--label-left .el-form-item__label {
      color: #666;
      font-size: 12px;
    }
    // .el-form-item__label {
    //   color: #666;
    //   font-size: 12px;
    // }
    .el-radio__label {
      font-size: 12px;
    }
    .el-input {
      font-size: 12px;
    }
    .unit {
      font-size: 12px;
      color: #666;
    }
    .el-input {
      width: 360px;
    }
    .el-textarea {
      width: 97%;
    }
    .el-form-item {
      margin-bottom: 22px;
    }
    // 商品信息
    .goods-info {
      padding: 0 15px;
      .el-form-item__error {
        top: 40px !important;
        // left: 380px;
      }
      .ticket-preferential-restrictions-wrap {
        .el-form-item__error {
          top: 76px !important;
          // left: 465px;
        }
      }
      .titcket-num {
        width: 84px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .upload-demo {
        display: flex;
        align-items: flex-end;
        .el-upload-list {
          margin-left: 5px;
        }
      }
      // 选择按钮的样式
      .select-btn {
        width: 92px;
        height: 30px;
        margin-left: 10px;
        line-height: 30px;
        background: #ffffff;
        border: 1px solid #3b74ff;
        border-radius: 4px;
        font-size: 12px;
        color: #3b74ff;
        letter-spacing: 0;
        text-align: center;
        cursor: pointer;
      }
      .goods-tickets {
        .el-form-item__error {
          top: 36px !important;
          // left: 200px;
        }
      }
      .remark {
        margin-top: 24px;
        margin-bottom: 22px !important;
        .el-form-item__error {
          top: 117px !important;
          left: 0px;
        }
      }
      .imgPath {
        .el-form-item__error {
          top: 155px !important;
          left: 0px;
        }
      }
    }
    // 优惠券适用规则
    .applicable-rules {
      padding: 0 15px;
      .el-form-item__error {
        top: 40px !important;
        // left: 380px;
      }
    }
    // 库存预警
    .stock-early-warning {
      padding: 0 15px;
      .el-form-item__error {
        top: 40px !important;
        // left: 380px;
      }
    }
  }
}
</style>
