<template>
  <div class="add-own-rights-type">
    <!-- 内容区 - 折叠面板 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="medium" label-width="120px" label-position="left">
      <el-collapse v-model="activeNames" class="card-type-content">
        <!-- 基础设置 -->
        <el-collapse-item :title="stepData.stepList[0].name" name="1">
          <div class="card-type-basic-set">
            <el-form-item label="权益名称：" prop="equityName">
              <el-input v-model="ruleForm.equityName"></el-input>
            </el-form-item>
            <el-form-item label="权益类型：" :rules="{required:true}">
              <el-select v-model="ruleForm.equityType" placeholder="请选择" :disabled="$route.query.cardId?true:false">
                <el-option v-for="(item, index) in equityTypeList" :key="index" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="权益类别：" v-if="ruleForm.equityType == 'consumer_type'" :rules="{required:true}">
              <el-select v-model="ruleForm.equityCategory" placeholder="请选择">
                <el-option v-for="(item, index) in equityCategoryList" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="权益说明：" prop="equityRemark">
              <el-input type="textarea" resize="none" maxlength="500" :rows="3" v-model="ruleForm.equityRemark">
              </el-input>
            </el-form-item>
            <el-form-item label="icon：" prop="logoPic">
              <div style="display:flex;align-items:flex-end">
                <img v-show="this.ruleForm.logoPic" style="width:148px;height:148px" :src="this.ruleForm.logoPic" alt="">
                <div :style="this.ruleForm.logoPic?'margin-left:10px':''">
                  <el-upload style="margin-top:5px " :show-file-list="false" :action="this.$store.state.default.apiConfig.baseURL+this.$store.state.crm.imgAction" list-type="picture-card" :before-upload="beforeAvatarUpload" accept="image/*" :on-success="imgUpload" :multiple="false" name="file" :data="{type:'equity_picture'}" :headers="uploadHeaders">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </div>
              </div>
            </el-form-item>
          </div>
        </el-collapse-item>
        <!-- 会员卡权益 -->
        <el-collapse-item :title="stepData.stepList[1]?stepData.stepList[1].name:''" name="2">
          <div class="card-equity">
            <el-form-item label="商品：" prop="goods">
              <div class="select-btn" @click="handleAddEquityDialog">添加商品</div>
              <div class="equity-item-wrap">
                <div class="shangpin-one" v-for="(item, index) of ruleForm.goods" :key="index">
                  <div class="shangpin-name">{{item.goodsName}}</div>
                  <el-form-item label="发放数量" :prop="'goods.'+index" :rules="{required: true, validator: grantNumzhengshu, trigger: 'blur'}">
                    <el-input v-model="item.grantNum" style="width:100px"></el-input>
                  </el-form-item>
                  <div class="shangpin-remove" @click="handleDeleteEquity(index)">删除</div>
                </div>
              </div>

            </el-form-item>
          </div>
        </el-collapse-item>
        <el-collapse-item :title="stepData.stepList[2]?stepData.stepList[2].name:''" name="3">
          <div style="padding-left:15px">
            <el-form-item label="间隔周期与份数：" prop="grantNum" class="jiange-zhouqi-err">
              <div class="fafang-time">
                <div>
                  <el-radio v-model="ruleForm.grantType" label="grant_unlimited">不限</el-radio>
                  <el-radio v-model="ruleForm.grantType" label="grant_day">每天</el-radio>
                  <el-radio v-model="ruleForm.grantType" label="grant_week">每周</el-radio>
                  <el-radio v-model="ruleForm.grantType" label="grant_month">每月</el-radio>
                </div>
                <div class="time-input" v-show="ruleForm.grantType != 'grant_unlimited'">
                  <el-input v-model="ruleForm.grantNum"></el-input>
                </div>
                <div class="damwei" v-show="ruleForm.grantType != 'grant_unlimited'">
                  份
                </div>
              </div>
            </el-form-item>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-form-item style="textAlign:center">
        <el-button type="primary" @click="submitForm('ruleForm')" class="_el-btn-custom _member-add-edit-save-btn">保存
        </el-button>
        <el-button @click="resetForm('ruleForm')" class="_el-btn-custom">取消</el-button>
      </el-form-item>
    </el-form>
    <fixStepTool :stepData="stepData.stepList" class="_fixsteptool-member"></fixStepTool>
    <!-- 添加权益dialog -->
    <el-dialog title="商品列表" class="__equity-dialog __crm-add-other-rights-dialog" :visible.sync="equityDialog" width="896px">
      <div class="__crm-available-coupon-dialog-content-wrap _crm-card-type-dialog-wrap">
        <div class="__crm-available-coupon-dialog-content-left">
          <!-- <div class="__table-wrap"> -->
          <!-- <el-form :inline="true" :model="formData" ref="formData" class="form-data-wrap">
          <el-form-item label="权益名称：" prop="equityName">
            <el-input v-model="formData.equityName" placeholder="填写权益名称" clearable maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="权益类型：" prop="equityType">
            <el-select v-model="formData.equityType" placeholder="全部" clearable>
              <el-option v-for="item in equityTypeList" :key="item.name" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="权益类别：" prop="equityCategory" class="heightBug">
            <el-select v-model="formData.equityCategory" placeholder="全部" clearable :disabled="formData.equityType != 'consumer_type'">
              <el-option v-for="item in equityCategoryList" :key="item.name" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="btn-wrap">
            <el-button type="primary" @click="handleSearch" class="_el-btn-custom">搜索</el-button>
            <el-button @click="resetFormTable('formData')" class="_el-btn-custom">重置</el-button>
          </el-form-item>
        </el-form> -->
          <div class="__crm-available-coupon-dialog-table _m-member-table-custom">
            <el-table ref="multipleTable" :data="tableData" stripe style="width: 100%" @select="handleSelect" @select-all="handleSelect" :row-key="getRowKeys">
              <el-table-column type="selection" width="50" :reserve-selection="true">
              </el-table-column>
              <el-table-column prop="id" :formatter="emptyShow" label="商品ID" min-width="130" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="goodsName" :formatter="emptyShow" label="商品名称" min-width="110" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="merchantName" :formatter="emptyShow" label="商家名称" min-width="90" show-overflow-tooltip></el-table-column>
              <!-- <el-table-column prop="goodsAttribute" :formatter="emptyShow" label="商品属性" min-width="100"
              show-overflow-tooltip></el-table-column> -->
              <el-table-column prop="goodsType" :formatter="emptyShow" label="商品类型" min-width="90" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="inventoryNum" :formatter="emptyShow" label="库存" min-width="70" show-overflow-tooltip></el-table-column>
              <el-table-column prop="saleVolume" :formatter="emptyShow" label="发售量" min-width="70" show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </div>
          <!-- 分页 start -->
          <div class="page-wrap _equity-dialog-paginatioin">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formData.current-0" :page-size="formData.size-0" layout="prev, pager, next, jumper, sizes" :page-sizes="[20 , 50 , 100]" :total="total-0">
            </el-pagination>
          </div>
          <!-- 分页 end -->
        </div>
        <!-- </div> -->
        <div class="__crm-available-coupon-dialog-content-right">
          <div class="__content-right-wrap">
            <div class="__content-right-title">
              已选异业商品
            </div>
            <div class="__clear-btn" @click="handleEmpty">清空</div>
          </div>
          <ul class="__selected-equity-wrap _custom-selected-equity-height">
            <li class="__selected-equity-item-inner" v-for="(item, index) of multipleSelectionItem" :key="index">
              <div class="__selected-equity-name-desc">{{item.goodsName}}</div>
              <i class="el-icon-close __dialog-icon-delete" @click="dialogDeleteEquity(index)"></i>
            </li>
          </ul>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="changeEquityDialog(true)">确 定</el-button>
        <el-button size="medium" @click="changeEquityDialog(false)">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import FixStepTool from '../../../components/fix-step-tool/fix-step-tool';
import fixStepMixin from '../../../mixins/CRM/fixStepTool.js';
const weekOptions = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export default {
  name: 'addOwnrights',
  data () {
    // 输入限制正则
    var testName = /^[\u4e00-\u9fa50-9a-zA-Z\s\~\`\·\！\!\@\#\￥\%\^\……\&\*\（\）\——\-\+\=\【\】\{\}\|\、\\\：\；\:\;\“\”\‘\’\'\"\[\]\{\}\<\,\>\.\《\》\，\。\？\、\?\/\(\)\_]+$/;

    // 验异业权益卡名称
    var checkCardName = (rule, value, callback) => {
      if (!value.toString().trim()) {
        callback(new Error('请输入权益名称'));
      } else if (!testName.test(value.toString().trim())) {
        callback(new Error('输入的名称含有不合法字符'));
      } else {
        this.$crmList
          .diffEquityNameIsexist({
            name: value.toString().trim(),
            id: this.$route.query.cardId ? this.$route.query.cardId : '',
            tenantId: this.$store.state.loginUser.consumerId
          })
          .then(data => {
            if (data.isExist) {
              callback(new Error('该名称已存在，请更换其他名称'));
            } else {
              this.ruleForm.equityName = value.toString().trim();
              callback();
            }
          })
          .catch(err => console.log(err));
      }
    };
    var zhengshu = (rule, value, callback) => {
      var int = /^\d+$/;
      if (this.ruleForm.grantType != 'grant_unlimited') {
        if (!int.test(value.toString().replace(/\s/g, ''))) {
          callback(new Error('请输入整数'));
        } else if (value == 0) {
          callback(new Error('请输入正整数'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var goodsIsEmpty = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error('商品不能为空'));
      }
      callback();
    };
    return {
      uploadHeaders: {
        Authorization: this.$store.state.loginToken,
        'Cpm-User-Token': this.$store.state.loginToken
      },
      multipleSelectionItem: [], // 临时选择的自有权益
      tableData: [], // 权益列表数据
      equityDialog: false, // 权益dialog显示/隐藏
      total: 20,
      activeNames: ['1', '2', '3'],
      equityTypeList: [
        { name: '服务类', value: 'service_type' },
        { name: '消费类', value: 'consumer_type' },
        { name: '体验类', value: 'experience_type' },
        { name: '身份类', value: 'identity_type' }
      ], // 权益类型列表
      equityCategoryList: [
        // { name: "兑换码", value: "cdkey" },
        { name: '优惠券', value: 'coupons' }
      ], // 权益类别列表
      stepData: {
        stepEl: '.el-collapse-item',
        stepList: [
          {
            name: '权益信息',
            isactive: false
          },
          {
            name: '商品信息',
            isactive: false
          },
          {
            name: '权益发放规则',
            isactive: false
          }
        ]
      },
      formData: {
        equityName: '', // 权益名称
        equityType: '', // 权益类型
        equityCategory: '', // 权益类别
        goodsStatus: 'has_been_on', // 卡状态
        equityNo: '', // 权益ID
        current: 1,
        size: 20,
        tenantId: this.$store.state.loginUser.consumerId // 租户id
      },
      ruleForm: {
        tenantId: this.$store.state.loginUser.consumerId, // 租户id
        equityName: '', // 权益卡名称
        equityRemark: '', // 权益卡备注
        equityType: 'consumer_type', // 权益类型
        equityCategory: 'coupons', // 权益类别
        logoPic: '',
        isBuy: '0', // 是否需要购买 默认不需要
        goods: [],
        grantNum: '',
        grantType: 'grant_unlimited'
      },
      rules: {
        goods: [{ required: true, validator: goodsIsEmpty, trigger: 'change' }],
        grantNum: [{ required: true, validator: zhengshu, trigger: 'blur' }],
        logoPic: [
          { required: true, message: '权益icon必填', trigger: 'change' }
        ],
        equityRemark: [
          { required: true, message: '权益说明必填', trigger: 'blur' }
        ],
        equityName: [
          { max: 20, message: '长度不可超过20个字符', trigger: 'blur' },
          { required: true, validator: checkCardName, trigger: 'blur' }
        ],
        remark: [{ max: 50, message: '长度不可超过500个字符', trigger: 'blur' }]
      }
    };
  },
  components: {
    fixStepTool: FixStepTool
  },
  created () {
    this.$route.query.cardId
      ? this.getcardTypeInfo(this.$route.query.cardId)
      : console.log('添加');
  },
  mounted () { },
  mixins: [fixStepMixin],
  methods: {
    // dialog内删除已选权益
    dialogDeleteEquity (index) {
      this.multipleSelectionItem.splice(index, 1);
      this.$refs.multipleTable.clearSelection();
      this.rowMultipleChecked(this.multipleSelectionItem);
    },
    // 清空dialog内已选权益
    handleEmpty () {
      this.multipleSelectionItem = [];
      this.$refs.multipleTable.clearSelection();
    },
    // 发放数量验证
    grantNumzhengshu (rule, value, callback) {
      var int = /^\d+$/;
      if (value.grantNum == null) {
        value.grantNum = '';
      }
      if (!int.test(value.grantNum.toString().replace(/\s/g, ''))) {
        callback(new Error('请输入整数'));
      } else if (value == 0) {
        callback(new Error('请输入正整数'));
      } else {
        if (value.inventoryNum && value.grantNum - 0 > value.inventoryNum - 0) {
          callback(new Error('不能大于库存' + value.inventoryNum));
        }
        callback();
      }
    },
    // 图片拦截，格式
    beforeAvatarUpload (file) {
      const isLt200k = file.size / 1024 < 200;
      if (!isLt200k) {
        this.$message.error('图片大小不能超过 200k!');
      }
      return isLt200k;
    },
    // 图片上传返回处理
    imgUpload (response, file, fileList) {
      if (!response.data) {
        this.$message.error(response.msg);
      } else {
        this.ruleForm.logoPic = response.data.url;
        this.$message.success('上传成功!');
      }
    },
    initStepData (ruleForm) {
      var stepList = [{ name: '权益信息', isactive: false }];
      var itemOne = {};
      if (ruleForm.equityType == 'consumer_type') {
        switch (ruleForm.equityCategory) {
          case 'birthday':
            itemOne = {
              name: '权益规则-生日赠劵',
              isactive: false
            };
            break;
          case 'movie':
            itemOne = {
              name: '权益规则-影票折扣',
              isactive: false
            };
            break;
          case 'goods':
            itemOne = {
              name: '权益规则-卖品折扣',
              isactive: false
            };
            break;

          case 'voucher':
            itemOne = {
              name: '权益规则-代金券',
              isactive: false
            };
            break;
        }
        stepList.push(itemOne);
        this.$set(this.stepData.stepList, 1, itemOne);
      }
    },
    // 获取卡详情
    getcardTypeInfo (cardId) {
      this.$crmList
        .diffEquityDetail({
          diffEquityId: cardId,
          tenantId: this.$store.state.loginUser.consumerId
        })
        .then(res => {
          this.ruleForm = res;
          this.multipleSelectionItem = this.ruleForm.goods;
        });
    },

    //   提交表单
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.ruleForm));
          if (this.$route.query.cardId) {
            this.$crmList
              .diffEquityEdit(data)
              .then(res => {
                // this.loading = false;
                this.$message.success('编辑成功');
                this.$store.commit('tagNav/removeTagNav', this.$route);
                this.$router.push({
                  path: '/member/otherRights/otherRightsDetail',
                  query: {
                    equityId: this.$route.query.cardId,
                    tenantId: this.$store.state.loginUser.consumerId
                  }
                });
              })
              .catch(err => {
                // this.loading = false;
                this.$message.error('添加失败，请重试');
              });
          } else {
            this.$crmList
              .diffEquityAdd(data)
              .then(res => {
                // this.loading = false;
                this.$message.success('添加成功');
                this.$store.commit('tagNav/removeTagNav', this.$route);
                this.$router.push({
                  path: '/member/otherRights/otherRightsDetail',
                  query: {
                    equityId: res.id,
                    tenantId: this.$store.state.loginUser.consumerId
                  }
                });
              })
              .catch(err => {
                // this.loading = false;
                this.$message.error('添加失败，请重试');
              });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$store.commit('tagNav/removeTagNav', this.$route);
      this.$router.push({ path: '/member/otherRights/otherRightsList' });
    },
    getRowKeys (row) {
      return row.id;
    },
    // 数据为空格式化
    emptyShow (row, column, cellValue, index) {
      if (cellValue == null || cellValue == undefined || cellValue === '') {
        return '-';
      } else {
        return cellValue;
      }
    },
    // 单一数据toggle
    rowOneToggle (row) {
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (row.goodsId == this.multipleSelectionItem[index].goodsId) {
          this.multipleSelectionItem.splice(index, 1);
          return;
        }
      }
      this.multipleSelectionItem.push(row);
    },
    // 单一数据add
    rowOneAdde (row) {
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (row.goodsId == this.multipleSelectionItem[index].goodsId) {
          return;
        }
      }
      this.multipleSelectionItem.push(row);
    },
    // 单一数据reomove
    rowOneRemove (row) {
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (row.goodsId == this.multipleSelectionItem[index].goodsId) {
          this.multipleSelectionItem.splice(index, 1);
          return;
        }
      }
    },
    // 手动选择商品
    handleSelect (selection, row) {
      if (row) {
        this.rowOneToggle(row);
      } else {
        if (selection.length == 0) {
          for (let index = 0; index < this.tableData.length; index++) {
            const item = this.tableData[index];
            this.rowOneRemove(item);
          }
        } else {
          for (let j = 0; j < selection.length; j++) {
            const selectionItem = selection[j];
            this.rowOneAdde(selectionItem);
          }
        }
        // this.multipleSelectionItem = selection;
      }
    },
    handleSizeChange (val) {
      this.formData.size = val;
      this.search();
    },
    handleCurrentChange (val) {
      this.formData.current = val;
      this.search();
    },
    // 搜索商品
    search () {
      let params = JSON.parse(JSON.stringify(this.formData));
      this.$crmList
        .diffGoodsList(params)
        .then(data => {
          this.tableData = data.records;
          this.total = data.total;
          this.$refs.multipleTable.clearSelection();
          this.rowMultipleChecked(this.multipleSelectionItem);
          // this.loading = false;
        })
        .catch(err => {
          // this.loading = false;
        });
    },
    // 点击搜索按钮
    handleSearch () {
      this.formData.current = 1;
      this.search();
    },
    // 重置
    resetFormTalbe (formName) {
      this.$refs[formName].resetFields();
    },
    // 添加商品
    handleAddEquityDialog () {
      this.search();
      this.equityDialog = true;
    },
    // 删除商品
    handleDeleteEquity (index) {
      this.ruleForm.goods.splice(index, 1);
      this.multipleSelectionItem = new Array(...this.ruleForm.goods);
    },
    // 商品回显
    rowMultipleChecked (selectedArr) {
      if (selectedArr.length != 0) {
        for (let i = 0; i < selectedArr.length; i++) {
          for (let k = 0; k < this.tableData.length; k++) {
            if (selectedArr[i].goodsId) {
              if (selectedArr[i].goodsId == this.tableData[k].goodsId) {
                this.$refs.multipleTable.toggleRowSelection(
                  this.tableData[k],
                  true
                );
                break;
              }
            } else {
              if (selectedArr[i].id == this.tableData[k].id) {
                this.$refs.multipleTable.toggleRowSelection(
                  this.tableData[k],
                  true
                );
                break;
              }
            }
          }
        }
      }
    },
    // 点击权益dialog的确定、取消按钮
    changeEquityDialog (ok) {
      if (ok) {
        if (new Array(...this.multipleSelectionItem).length == 0) {
          this.equityDialog = true;
          this.$message.warning('请至少选择一项商品');
          return false;
        } else {
          this.equityDialog = false;
          this.ruleForm.goods = new Array(...this.multipleSelectionItem);
        }
      } else {
        this.equityDialog = false;
        this.multipleSelectionItem = new Array(...this.ruleForm.goods);
      }
    }
  }
};
</script>
<style lang="scss">
.add-own-rights-type {
  width: 100%;
  .jiange-zhouqi-err {
    .el-form-item__error {
      // left: 313px !important;
    }
  }
  .fafang-time {
    display: flex;
    justify-content: flex-start;
    margin-top: 3px;
    .time-input {
      margin-left: 20px;
      width: 100px;
      margin-right: 20px;
      input {
        width: 100px;
        height: 28px;
      }
    }
    .damwei {
      font-size: 12px;
      color: #606266;
    }
  }
  // 会员卡权益
  .card-equity {
    padding: 0 15px;
    // 选择按钮的样式
    .select-btn {
      width: 92px;
      height: 30px;
      line-height: 30px;
      background: #ffffff;
      border: 1px solid #3b74ff;
      border-radius: 4px;
      font-size: 12px;
      color: #3b74ff;
      letter-spacing: 0;
      text-align: center;
      cursor: pointer;
      margin-top: 6px;
    }
    .equity-item-wrap {
      display: flex;
      flex-wrap: wrap;
      padding-top: 10px;
      max-width: 1340px;
      .shangpin-one {
        display: flex;
        padding: 5px 0;
        margin-right: 30px;
        width: 500px;
        .shangpin-name {
          width: 100px;
          line-height: 40px;
        }
        input {
          height: 28px !important;
        }
        .shangpin-remove {
          width: 40px;
          color: #3b74ff;
          font-size: 13px;
          margin-left: 10px;
          cursor: pointer;
          line-height: 40px;
        }
      }
    }
  }
  .el-form-item__label {
    color: #666 !important;
    font-size: 12px !important;
  }
  .el-radio__label {
    font-size: 12px;
  }
  .el-input {
    font-size: 12px;
  }
  .el-checkbox__label {
    font-size: 12px;
  }
  .unit {
    font-size: 12px;
  }
  .card-type-content {
    border: 0;
    .el-input {
      width: 360px;
    }
    .el-textarea {
      width: 360px;
    }
    // .el-form-item__error {
    //   top: 12px !important;
    //   left: 380px;
    // }
    .el-form-item {
      margin-bottom: px;
    }
    //   基础设置
    .card-type-basic-set {
      padding: 0 15px;
      .el-form-item__error {
        // top: 12px !important;
        // left: 380px;
      }
    }
  }
}
// 添加商品dialog样式
.__crm-add-other-rights-dialog {
  ._equity-dialog-paginatioin {
    padding: 6px 0;
    border: 1px solid #e5e5e5;
    border-top: 0;
  }
  ._crm-card-type-dialog-wrap {
    margin-top: -5px;
    ._custom-selected-equity-height {
      height: 428px;
    }
    .el-table__body-wrapper {
      height: 410px !important;
    }
  }
  .__crm-available-coupon-search {
    .el-form-item {
      margin-bottom: 7px;
      .el-form-item__label {
        margin-left: 0;
        width: auto !important;
      }
      .el-input__inner {
        width: 160px;
        line-height: 32px;
        height: 32px;
        font-size: 12px;
      }
    }
  }
  ._custom-search-item {
    .el-form-item__label {
      text-indent: 0;
      width: auto !important;
    }
  }
  .__crm-available-coupon-dialog-content-wrap {
    display: flex;
    .__crm-available-coupon-dialog-content-left {
      width: 632px;
      .__crm-available-coupon-dialog-table {
        width: 632px;
        .has-gutter tr th {
          height: 31px;
          line-height: 31px;
        }
        .el-table__body-wrapper {
          overflow-y: auto;
          height: 352px;
          .el-table__body {
            border-collapse: collapse;
            tbody {
              tr:last-child {
                border-bottom: 1px solid #f0f0f0;
              }
            }
          }
        }
        td {
          height: 32px;
          line-height: 32px;
        }
        .is-leaf {
          padding: 0;
          border-bottom: 0;
          .cell {
            color: #333;
            height: 30px;
            line-height: 30px;
          }
        }
        .cell {
          font-size: 12px;
          padding-left: 8px;
          padding-right: 0;
          height: 32px;
          line-height: 32px;
        }
        .__crm-available-coupon-paginatioin {
          padding: 6px 0;
          border: 1px solid #e5e5e5;
          border-top: 0;
        }
      }
    }
    .__crm-available-coupon-dialog-content-right {
      width: 224px;
      border: 1px solid #e5e5e5;
      border-left: 0;
      padding: 12px 16px;
      .__content-right-wrap {
        display: flex;
        justify-content: space-between;
        padding: 0 0 12px;
        border-bottom: 1px solid #f5f5f5;
        .__content-right-title {
          font-size: 10px;
          color: #666666;
          letter-spacing: 0;
        }
        .__clear-btn {
          font-size: 12px;
          color: #3b74ff;
          letter-spacing: 0;
          cursor: pointer;
        }
      }
      .__selected-equity-wrap {
        height: 375px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        .__selected-equity-item-inner {
          padding-top: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .__selected-equity-name-desc {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-size: 12px;
            color: #666666;
          }
          .__dialog-icon-delete {
            margin-left: 14px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>

