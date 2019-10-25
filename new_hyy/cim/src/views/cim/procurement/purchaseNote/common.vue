<template>
  <div class="content purchase-note-common">
    <!--        <div class="breadcrumb">-->
    <!--            <el-breadcrumb separator-class="el-icon-arrow-right">-->
    <!--                <el-breadcrumb-item>采购管理</el-breadcrumb-item>-->
    <!--                <el-breadcrumb-item :to="{ path: '/retail/procurement/purchaseNote/list' }">采购单管理</el-breadcrumb-item>-->
    <!--                <el-breadcrumb-item>{{typeText}}采购单</el-breadcrumb-item>-->
    <!--            </el-breadcrumb>-->
    <!--        </div>-->
    <div class="tittle"></div>
    <el-form :inline="true" ref="ruleForm" :model="queryData" label-position="left" label-width="100px" label-suffix="：">
      <el-collapse v-model="activeNames">
        <!-- 基础信息 start-->
        <el-collapse-item title="基础信息" name="1">
          <div>
            <el-row>
              <el-col :span="8">
                <el-form-item label="采购单号">
                  <span>{{queryData.billCode}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="采购门店" class="select-input" prop="cinemaName" :rules="[{ required: routeQuery.type==3 ? false : true, message: '采购门店不能为空',trigger: 'change' }]">
                  <span v-if="routeQuery.type==3">{{queryData.cinemaName}}</span>
                  <div v-else>
                    <el-input v-model="queryData.cinemaName" clearable :disabled="routeQuery.type==1 ? false:true" @focus="handleDialogEvent('refCinemalDialog')" @clear="onCinemalSumit()" placeholder="请选择门店"></el-input>
                    <el-button type="primary" plain @click="handleDialogEvent('refCinemalDialog')" v-if="routeQuery.type==1">选择</el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label-width="100px" label="协议名称" class="select-input" prop="agreementUid" v-if="(routeQuery.type==3)">
                  <span v-if="queryData.agreementUid">
                    {{queryData.agreementName}}
                  </span>
                  <span v-else>
                    未启用
                  </span>
                </el-form-item>
                <el-form-item v-else label-width="100px" class="select-input" prop="agreementUid">
                  <el-checkbox solt="label" v-model="isOpenAgreement" @change="changeOpenAgreement" :disabled="routeQuery.type==1 ? false : true">
                    启用采购协议
                  </el-checkbox>
                  <span>
                    <span v-if="isOpenAgreement">
                      <el-input v-model="queryData.agreementName" clearable @focus="handleDialogEvent('refAgreementDialog')" @clear="onAgreementSumit()" :disabled="routeQuery.type==1 ? false : true" placeholder="请选择采购协议"></el-input>
                      <el-button type="primary" :disabled="routeQuery.type==1 ? false : true" plain @click="handleDialogEvent('refAgreementDialog')">选择</el-button>
                    </span>
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供应商名称" class="select-input" prop="supName" :rules="[{ required: routeQuery.type==3 ? false : true, message: '供应商名称不能为空',trigger: 'change' }]">
                  <div v-if="queryData.billType==1">
                    {{queryData.supName}}
                  </div>
                  <div v-else>
                    <span v-if="routeQuery.type==3">{{queryData.supName}}</span>
                    <div v-else>
                      <el-input :disabled="routeQuery.type==1 ? false:true" v-model="queryData.supName" clearable @clear="onSupplierSumit()" @focus="handleDialogEvent('refSuppliersDialog')" placeholder="请选择供应商"></el-input>
                      <el-button type="primary" plain @click="handleDialogEvent('refSuppliersDialog')" v-if="routeQuery.type==1">选择</el-button>
                    </div>
                  </div>

                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="queryData.agreementCode">
              <el-col :span="8">
                <el-form-item label="协议编码" prop="code">
                  <span>{{queryData.agreementCode}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="有效期">
                  <span>{{queryData.startTime}} 至 {{queryData.stopTime}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="routeQuery.type!=1">
              <el-col :span="8" v-if="queryData.billVoTime">
                <el-form-item label="制单日期">
                  <span>{{queryData.billVoTime}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="queryData.billUserName">
                <el-form-item label="制单员">
                  <span>{{queryData.billUserName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="routeQuery.type!=1">
              <el-col :span="8">
                <el-form-item label="单据状态">
                  <span>{{formatStatus}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="审核状态">
                  <span>{{approvalStart(1)}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <!-- 基础信息 end-->

        <!-- 商品清单 start-->
        <el-collapse-item title="商品清单" name="2">
          <div>
            <div class="text-right" v-if="routeQuery.type==1 && queryData.billType!=1">
              <el-button @click="handleAddGood" type="primary" plain>添加商品</el-button>
            </div>
            <el-table :data="queryData.purchaseBillDetailVoList" stripe>
              <el-table-column v-for="item in tableColumn" :key="item.key" :prop="item.key" :label="item.label" :formatter="item.formatter">
                <template slot-scope="{row}" name="header">
                  <div v-if="routeQuery.type!=3">
                    <div v-if="item.edit && item.edit(row)">
                      <el-input size="small" type="number" :value="row[item.key]" @input="inputEvent($event,row,item.key)"></el-input>
                    </div>
                    <div v-else-if="item.selsect">
                      <el-select v-model="row[item.key]" :disabled="(!queryData.agreementUid && routeQuery.type==1) ? false:true">
                        <el-option :key="unitItem.id" :label="unitItem.name" :value="unitItem.unitUid" v-for="unitItem in row.purUnitVoList"></el-option>
                      </el-select>
                    </div>
                    <div v-else>
                      <span>{{calculateCost(row,item)}}</span>
                    </div>
                  </div>
                  <div v-else>
                    <div v-if="item.selsect">
                      <el-select v-model="row[item.key]" disabled>
                        <el-option :key="unitItem.id" :label="unitItem.name" :value="unitItem.unitUid" v-for="unitItem in row.purUnitVoList"></el-option>
                      </el-select>
                    </div>
                    <span v-else>{{calculateCost(row,item)}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" style="width:180px;" v-if="routeQuery.type!=3">
                <template slot-scope="{row,$index}">
                  <el-button type="text" size="small" @click.stop="handleOperateEvent(row,$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="remark" label-width="60px" label="备注">
                  <span v-if="routeQuery.type==3">{{queryData.remark}}</span>
                  <el-input type="textarea" placeholder="请输入" v-else class="remark-input" v-model="queryData.remark"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <!-- 商品清单 end-->

        <!--  审批流程-->
        <el-collapse-item title="审批流程" name="3" v-if="routeQuery.type==3">
          <el-form-item label="审批流程名称" label-width="110px">
            <span>采购单审核</span>
          </el-form-item>
          <el-steps :space="200" :active="approvalActive" finish-status="success">
            <el-step :title="approvalStart()"></el-step>
            <el-step :title="item.auditMan" :key="item.auditTime" v-for="item in queryData.reviewRecordList"></el-step>
            <el-step title="结束" v-if="queryData.approvalStatus==2"></el-step>
          </el-steps>
        </el-collapse-item>
        <!--  审批记录-->
        <el-collapse-item title="审批记录" name="4" v-if="routeQuery.type==3">
          <div>
            <el-table :data="queryData.reviewRecordList" stripe>
              <el-table-column v-for="item in reviewRecordTableColumn" :key="item.key" :prop="item.key" :label="item.label" :formatter="item.formatter">
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>

      <!-- 选择影院弹窗 -->
      <cinemal-dialog ref="refCinemalDialog" title="选择门店" @onSumit="onCinemalSumit" :dialogFeedbackData="[{cinemaUid:queryData.cinemaUid,cinemaName:queryData.cinemaName}]"></cinemal-dialog>

      <!-- 选择采购协议 -->
      <agreement-dialog ref="refAgreementDialog" @onSumit="onAgreementSumit"></agreement-dialog>

      <!-- 选择供应商弹窗 -->
      <suppliers-dialog ref="refSuppliersDialog" @onSumit="onSupplierSumit"></suppliers-dialog>
      <!-- 选择商品 -->
      <selected-goods :dialogVisible.sync="selectedGoodsDialogVisible" :cinemaUid="queryData.cinemaUid" :merType="'1,5'" canSale="-1" @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"></selected-goods>
      <el-dialog title="提示" :visible.sync="proceedUpdateDialog" width="30%">
        <span>{{proceedUpdateMessage}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleProceedUpdate">确 定</el-button>
          <el-button @click="proceedUpdateDialog = false">取 消</el-button>
        </span>
      </el-dialog>

      <div class="submit-box" v-if="routeQuery.type!=3">
        <el-button type="primary" @click="handleSubmit('1')" :loading="submitLoading">保存并提交</el-button>
        <el-button v-if="queryData.status!=2" type="primary" @click="handleSubmit('0')" :loading="submitLoading">保存为草稿</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
      <div v-else class="submit-box">
        <el-button @click="handleCancel">关 闭</el-button>
      </div>
    </el-form>
    <!--        <fixStepTool :stepData="stepData.stepList"></fixStepTool>-->
  </div>
</template>

<script>
import mixin from 'cimSrc/mixins/cim/paginationConfig.js';
import cinemalDialog from 'cimSrc/components/cinemalDialog/cinemaDialog.vue';
import suppliersDialog from 'cimSrc/components/suppliersDialog/suppliersDialog.vue';
import selectedGoods from 'cimSrc/dialogs/cimSelectedGoods/index.vue';
import agreementDialog from 'cimSrc/components/agreementDialog/agreementDialog.vue';

// import fixStepTool from "ctm/components/fix-step-tool/fix-step-tool";
// import fixStepMixin from "ctm/mixins/fixStepTool";

const { fixStepTool, fixStepToolMixin } = requireModule('base');

export default {
  name: 'common',
  mixins: [mixin, fixStepToolMixin],
  data () {
    return {
      // 交互部分数据
      stepData: {
        stepEl: '.el-collapse-item',
        stepList: [
          {
            name: '基础信息',
            isactive: false
          },
          {
            name: '商品清单',
            isactive: false
          }
        ]
      },
      selectedGoodsDialogVisible: false,
      // 查询数据
      queryData: {
        // 基础信息
        billCode: '', // 采购单号
        cinemaUid: '', // 门店id
        cinemaName: '', // 门店名称
        billType: '0', // 单据类型,0无协议,1有协议
        agreementCode: '', //	协议编码
        agreementName: '', // 协议名称
        agreementUid: '', //	协议uid
        purchaseBillDetailVoList: [], // 采购商品明细集合
        supName: '', // 供应商名称
        supUid: '', // 供应商id
        isReview: 1, // 是否需要审核,0不需要,1需要
        remark: '', // 备注
        status: 1,
        tag: '' // 保存标志,0草稿,1保存并提交
      },
      isOpenAgreement: false,
      total: 0,
      reviewRecordTableColumn: [
        {
          label: '审核时间',
          key: 'auditTime'
        },
        {
          label: '审核人',
          key: 'auditMan'
        },
        {
          label: '审核结果',
          key: 'arditResult'
        },
        {
          label: '审核意见',
          key: 'auditOpinion'
        }
      ],
      computAmount: '',
      submitLoading: false,
      activeNames: ['1', '2', '3', '4'],
      proceedUpdateDialog: false, // 采购数量超过库存数弹窗
      isProceedUpdate: false,
      proceedUpdateMessage: ''
    };
  },
  created () {

  },
  beforeCreate () {
    // let lastLevel = this.typeText+'采购单';
    // this.$route.meta.title = lastLevel;
    // console.log(this.$route);
  },
  mounted () {
    this.init();
  },

  methods: {
    init () {
      if (this.routeQuery.type == 1) {
        this.purchaseCode();
      } else {
        this.purchaseGet({ billCode: this.routeMerData.billCode });
      }

      // let lastLevel = this.typeText+'采购单';
      // this.$route.meta.title = lastLevel;
      // this.$store.commit('getLevel',lastLevel);
    },
    // 生成采购编码
    purchaseCode (param) {
      this.$cimList.procurement.purchaseCode(param).then(resData => {
        if (resData.code == 200) {
          this.queryData.billCode = resData.data;
        }
      });
    },
    // 添加采购单商品明细
    purchasePurchaseMer (param) {
      this.$cimList.procurement.purchasePurchaseMer(param).then(resData => {
        if (resData.code == 200) {
          this.queryData.purchaseBillDetailVoList.push(...resData.data.map(item => {
            item.merUid = item.uid;
            item.baseUnitUid = item.unitUid;
            if (item.purCount === undefined) {
              item.purCount = null;
            }
            if (item.purPrice === undefined) {
              item.purPrice = null;
            }
            if (item.amount === undefined) {
              item.amount = null;
            }
            return item;
          }));
          this.queryData.purchaseBillDetailVoList = this.unRepeat(this.queryData.purchaseBillDetailVoList);
        } else {
          this.$message({
            message: resData.msg
          });
        }
      }).catch((resData) => {
        this.$message({
          message: resData.message
        });
      });
    },
    // 新增采购单
    purchaseSave (param) {
      this.submitLoading = true;
      this.$cimList.procurement.purchaseSave(param).then(resData => {
        this.submitLoading = false;
        if (resData.code == 200) {
          this.$message({
            type: 'success',
            message: '新建成功!'
          });
          this.handleCancel();
        } else {
          if (resData.code == 20005) {
            this.proceedUpdateDialog = true;
            this.proceedUpdateMessage = resData.msg;
          } else {
            this.$message({
              message: resData.message
            });
          }
        }
        this.isProceedUpdate = false;
      }).catch(() => {
        this.submitLoading = false;
      });
    },
    // 修改采购单
    purchaseUpdate (param) {
      this.submitLoading = true;
      this.$cimList.procurement.purchaseUpdate(param).then(resData => {
        this.submitLoading = false;
        if (resData.code == 200) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
          this.handleCancel();
        } else {
          if (resData.code == 20005) {
            this.proceedUpdateDialog = true;
            this.proceedUpdateMessage = resData.msg;
          } else {
            this.$message({
              message: resData.msg
            });
          }
        }
      }).catch(() => {
        this.submitLoading = false;
      });
    },
    // 查看采购单
    purchaseGet (param) {
      this.$cimList.procurement.purchaseGet(param).then(resData => {
        if (resData.code == 200) {
          this.queryData = resData.data;
          if (this.queryData.agreementUid) {
            this.isOpenAgreement = true;
          }
        } else {
          this.$message({
            message: resData.msg
          });
        }
        this.isProceedUpdate = false;
      }).catch(() => {

      });
    },
    handleAddGood () {
      if (!this.queryData.cinemaUid) {
        this.$message({
          message: '请先选择一个门店!'
        });
        return;
      }
      this.selectedGoodsDialogVisible = true;
    },
    handleOperateEvent (row, index) {
      this.$confirm("<i class='el-icon-circle-close'></i><span>确定删除吗?</span>", {
        customClass: 'retail-style',
        dangerouslyUseHTMLString: true,
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        center: true
      })
        .then(() => {
          this.queryData.purchaseBillDetailVoList = this.queryData.purchaseBillDetailVoList.filter(
            (item, listIndex) => {
              return listIndex != index;
            }
          );
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
        .catch(() => {
        });
    },
    handleProceedUpdate () {
      this.isProceedUpdate = true;
      this.handleSubmit(this.queryData.isReview);
    },
    //
    handleSubmit (type) {
      // 0草稿,1保存并提交
      this.queryData.tag = type;
      this.queryData.isReview = type;
      this.queryData.finishTime = '';
      this.queryData.beginTime = '';
      // console.log(this.queryData);
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if (this.isOpenAgreement && !this.queryData.agreementCode) {
            this.$message({
              message: '请选择采购协议!'
            });
            return;
          }
          if (this.queryData.purchaseBillDetailVoList.length == 0) {
            this.$message({
              message: '请添加一个商品!'
            });
            return;
          }
          let purchaseList = this.queryData.purchaseBillDetailVoList.map((item) => {
            // 是否继续修改标志,0表示第一次请求,安全库存判断,1继续修改(超过安全库存也继续)
            if (this.isProceedUpdate) {
              item.isProceedUpdate = 1;
            } else {
              item.isProceedUpdate = 0;
            }
            return item;
          });
          let flag = true;
          for (let item of purchaseList) {
            if (typeof (item.amount) === 'number') {
              item.amount = item.amount.toString();
            }
            if (!item.purUnitUid) {
              this.$message('请选择采购单位!');
              flag = false;
              break;
            }
            if (!item.purCount) {
              this.$message('请填写采购数量!');
              flag = false;
              break;
            } else {
              if (item.purCount <= 0) {
                this.$message('采购数量必须大于0!');
                flag = false;
                break;
              }
            }

            if (!item.purPrice) {
              this.$message('请填写采购成本!');
              flag = false;
              break;
            } else {
              if (item.purPrice < 0) {
                this.$message('采购成本不能小于0!');
                flag = false;
                break;
              }
            }

            if (!item.taxRate) {
              this.$message('请填写税率!');
              flag = false;
              break;
            } else {
              if (item.taxRate < 0) {
                this.$message('税率不能小于0!');
                flag = false;
                break;
              }
            }

            if (!item.amount) {
              this.$message('请写含税金额!');
              flag = false;
              break;
            } else {
              if (item.amount < 0) {
                this.$message('含税金额不能小于0!');
                flag = false;
                break;
              }
            }
          }
          if (flag) {
            if (this.routeQuery.type == 1) {
              this.purchaseSave(this.queryData);
            } else {
              this.purchaseUpdate(this.queryData);
            }
          }
        } else {
          this.$message('带*号的为必填项，请填写');
          return false;
        }
      });
    },
    //
    handleCancel () {
      this.$store.commit('tagNav/removeTagNav', {
        name: this.$route.name,
        path: this.$route.path,
        title: this.$route.meta.title,
        query: this.$route.query
      });
      this.$router.push({
        path: '/retail/procurement/purchaseNote/list'
      });
    },
    handleDialogEvent (name) {
      this.$refs[name].handleDialog(true);
    },
    selectedGoodsDialogCallBack (value) {
      // console.log(value);
      if (value.btnType == 1) {
        if (value.data.length > 0) {
          this.purchasePurchaseMer({ flag: 0, purchaseMerVoList: value.data });
        } else {

        }
      } else {
      }
    },
    // 去重
    unRepeat (arr) {
      let hash = {};
      return arr.reduce((item, next) => {
        if (!hash[next.skuUid]) {
          hash[next.skuUid] = true;
          item.push(next);
        }
        return item;
      }, []);
    },
    // 选泽门店回调
    onCinemalSumit (val = [], type) {
      // console.log(val," 选泽门店回调",type);
      if (val.length > 0) {
        if (type == 'default') {
          if (val.length == 1) {
            this.setCinema(val);
          }
        } else {
          this.setCinema(val);
        }
      } else {
        this.setCinema();
      }
    },
    setCinema (val = []) {
      if (val.length > 0) {
        this.queryData.cinemaName = val[0].cinemaName || val[0].name;
        this.queryData.cinemaUid = val[0].cinemaUid || val[0].uid;
      } else {
        this.queryData.cinemaName = '';
        this.queryData.cinemaUid = '';
      }
    },
    changeOpenAgreement (value) {
      this.onAgreementSumit([]);
    },
    // 选泽采购协议
    onAgreementSumit (val = []) {
      if (val.length > 0) {
        this.queryData.billType = '1';
        this.queryData.supUid = val[0].supUid;
        this.queryData.supName = val[0].supName;
        this.queryData.agreementCode = val[0].code;
        this.queryData.agreementName = val[0].name;
        this.queryData.agreementUid = val[0].uid;
        this.queryData.startTime = val[0].beginTime;
        this.queryData.stopTime = val[0].finishTime;
        this.agreementGet({ uid: val[0].uid });
      } else {
        this.queryData.billType = '0';
        this.queryData.supUid = '';
        this.queryData.supName = '';
        this.queryData.agreementCode = '';
        this.queryData.agreementName = '';
        this.queryData.agreementUid = '';
        this.queryData.startTime = '';
        this.queryData.stopTime = '';
        this.queryData.purchaseBillDetailVoList = [];
      }
      this.$refs['ruleForm'].clearValidate(['supName']);
      // console.log(this.queryData);
    },
    // 查看协议单
    agreementGet (param) {
      this.$cimList.procurement.agreementGet(param).then(resData => {
        if (resData.code == 200) {
          this.queryData.purchaseBillDetailVoList = resData.data.agreementDetailList.map(item => {
            if (item.purCount === undefined) {
              item.purCount = null;
            }
            if (item.purPrice === undefined) {
              item.purPrice = null;
            }
            if (!item.amount === undefined) {
              item.amount = null;
            }
            if (typeof item.taxRate === 'number') {
              item.taxRate = item.taxRate.toString();
            }
            return item;
          });
        }
      });
    },
    // 选泽供应商回调
    onSupplierSumit (val = []) {
      if (val.length > 0) {
        this.queryData.supName = val[0].supplierName;
        this.queryData.supUid = val[0].uid;
      } else {
        this.queryData.supName = '';
        this.queryData.uid = '';
      }
      // console.log(this.queryData);
    },
    inputEvent (value, row, key) {
      // console.log(value,row,key)
      if (key == 'purCount') {
        row[key] = value.replace(/^(.*\..{2}).*$/, '$1');
      } else {
        row[key] = value.replace(/^(.*\..{4}).*$/, '$1');
      }
      if (key == 'purCount' || key == 'purPrice') {
        row.amount = (row.purCount * row.purPrice).toFixed(4);
      }
      if (key == 'amount') {
        if (row.amount && row.purCount) {
          row.purPrice = (row.amount / row.purCount).toFixed(4);
        }
      }
    },
    // 计算成本
    calculateCost (row, item) {
      // console.log(row.purPrice,row.taxRate)
      if (typeof row.purPrice === 'number') {
        row.purPrice = row.purPrice.toFixed(4).toString();
      }
      if (typeof row.amount === 'number') {
        row.amount = row.amount.toFixed(4).toString();
      }
      if (typeof row.taxRate === 'number') {
        row.taxRate = row.taxRate.toString();
      }
      let tempExcludingTaxAmount = row.amount / (1 + row.taxRate / 100);
      switch (item.key) {
        case 'excludingTaxAmount':
          // 不含税金额=含税金额/(1+税率)
          return row[item.key] = tempExcludingTaxAmount.toFixed(4);
          break;
        case 'excludingTaxCost':
          // 不含税采购成本=采购成本/(1+税率)
          return row[item.key] = (row.purPrice / (1 + row.taxRate / 100)).toFixed(4);
          break;
        case 'taxAmount':
          // 税额=不含税金额*税率
          return row[item.key] = (tempExcludingTaxAmount * row.taxRate / 100).toFixed(4);
          break;
        default:
          return row[item.key];
      }
    },
    approvalStart (type) {
      let result = '';
      switch (this.queryData.approvalStatus) {
        case 0:
          result = '未审核';
          break;
        case 1:
          result = '待审核';
          break;
        case 2:
          if (type == 1) {
            result = '审核通过';
          } else {
            result = '开始';
          }
          break;
        case 3:
          result = '审核不通过';
          break;
        case 4:
          result = '无需审核';
          break;
      }
      return result;
    }
  },
  computed: {
    routeQuery () {
      return this.$route.query;
    },
    routeMerData () {
      if (this.$route.query.data) {
        return JSON.parse(this.$route.query.data);
      } else {
        return {};
      }
    },
    typeText () {
      // 1新建，2修改，3查看
      switch (this.routeQuery.type) {
        case '1':
          return '新建';
          break;
        case '2':
          return '编辑';
          break;
        case '3':
          return '查看';
          break;
      }
    },
    formatStatus () {
      let result = '';
      switch (this.queryData.status) {
        case 1:
          result = '未提交';
          break;
        case 2:
          result = '已提交';
          break;
        case 3:
          result = '部分入库';
          break;
        case 4:
          result = '全部入库';
          break;
      }
      return result;
    },
    // 表格表头
    tableColumn () {
      return [
        {
          label: '商品名称',
          key: 'skuName'
        },
        {
          label: 'SKU编码',
          key: 'skuCode'
        },
        {
          label: '商品规格',
          key: 'merSpec'
        },
        {
          label: '采购单位',
          key: 'purUnitUid',
          selsect: true
        },
        {
          label: '采购数量',
          key: 'purCount',
          edit: row => {
            return true;
          }
        },
        {
          label: '采购成本(元)',
          key: 'purPrice',
          edit: row => {
            if (this.routeQuery.type == 1) {
              if (this.queryData.billType == 1) {
                return false;
              } else {
                return true;
              }
            } else {
              return false;
            }
          }
        },
        {
          label: '税率(%)',
          key: 'taxRate',
          edit: row => {
            if (this.routeQuery.type == 1) {
              if (this.queryData.billType == 1) {
                return false;
              } else {
                return true;
              }
            } else {
              return false;
            }
          }
        },
        {
          label: '含税金额(元)',
          key: 'amount',
          edit: row => {
            if (this.routeQuery.type == 1) {
              if (this.queryData.billType == 1) {
                return false;
              } else {
                return true;
              }
            } else {
              return false;
            }
          }
        },
        {
          label: '不含税采购成本(元)',
          key: 'excludingTaxCost'
        },
        {
          label: '不含税金额(元)',
          key: 'excludingTaxAmount'
        },
        {
          label: '税额(元)',
          key: 'taxAmount'
        }
      ];
    },
    approvalActive () {
      let result = 0;
      switch (this.queryData.approvalStatus) {
        case 0:
          result = 1;
          break;
        case 1:
          result = 1;
          break;
        case 2:
          result = this.queryData.reviewRecordList.length + 2;
          break;
        case 3:
          result = this.queryData.reviewRecordList.length + 2;
          break;
        case 4:
          result = 1;
          break;
      }
      return result;
    }
  },
  components: {
    cinemalDialog,
    suppliersDialog,
    agreementDialog,
    selectedGoods,
    fixStepTool
  }
};
</script>

<style lang="scss">
@import "../../../../assets/css/common.scss";
@import "../../../../assets/css/element-common.scss";
.purchase-note-common {
  .text-right {
    float: right;
    margin-bottom: 20px;
  }
}
</style>
