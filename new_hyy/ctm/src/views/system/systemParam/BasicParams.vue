<template>
  <div class="basic-params">
    <div class="component">
      <el-form :rules="rules" :model="data" ref="formData" size="small" inline label-width="200px">
        <!-- 1.:rules="[{ required: true, message: '专资比例不能为空',trigger: 'change'}]"
                 2.:rules="[{ required: true, message: '税率不能为空',trigger: 'change'}]"
             -->
        <el-collapse v-model="activeNames">
          <el-collapse-item title="影票" name="ticket">
            <el-form-item label="影片放映结束：" prop="basicParams.refuse_get_ticket_time">
              <el-input v-model="data.basicParams.refuse_get_ticket_time"></el-input>
              <span class="suffix">分钟后，柜台、取票机等不允许取票</span>
            </el-form-item>
            <el-form-item label="影片开场：" prop="basicParams.refuse_sale_ticket_time">
              <el-input v-model="data.basicParams.refuse_sale_ticket_time"></el-input>
              <span class="suffix">分钟后，柜台不允许售票</span>
            </el-form-item>

            <el-form-item label="柜台每单限购的座位数：" prop="basicParams.max_sale_seat_num">
              <el-input v-model="data.basicParams.max_sale_seat_num"></el-input>
              <span class="suffix">个</span>
            </el-form-item>
            <div v-for="(item,ind) in data.specialCapitalRatioList" :key="ind+100">
              <el-form-item :label="'专资比例'+item.seq+'：'" :prop="'specialCapitalRatioList.'+ind+'.paramValue'" :rules="[{validator:checkNapercentageTestme}]">
                <el-input size="small" v-model="item.paramValue"></el-input>
                <span> % ，</span>
                <div style="display:inline-block">
                  <span>日期</span>
                  <el-date-picker v-model="item.startTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                    sty
                  </el-date-picker>
                  至
                  <el-date-picker v-model="item.endTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                  </el-date-picker>

                </div>
                <span class="delete" @click="deleSpecialCap(ind)" v-if="ind>0">删除</span>
                <span class="add" @click="addSpecialCap()" v-if="ind==data.specialCapitalRatioList.length-1"><i class="iconfont icon-neiye-tianjia-"></i>添加</span>
                <span v-if="ind==0">（专项资金=票房*转资比例,专资比例默认是5%）</span>
              </el-form-item>
            </div>
            <div v-for="(item,ind) in data.taxRateList" :key="ind">
              <el-form-item :label="'税率'+ item.seq +'：'" :prop="'taxRateList.'+ind+'.paramValue'" :rules="[{validator:checkNapercentageTestme}]">
                <el-input size="small" v-model="item.paramValue"></el-input>
                <span> % ，</span>
                <div style="display:inline-block">
                  <span>日期</span>
                  <el-date-picker v-model="item.startTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                  </el-date-picker>
                  至
                  <el-date-picker v-model="item.endTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                  </el-date-picker>
                </div>
                <span class="delete" @click="deletaxRate(ind)" v-if="ind>0">删除</span>
                <span class="add" @click="addtaxRate()" v-if="ind==data.taxRateList.length-1">
                  <i class="iconfont icon-neiye-tianjia-"></i>添加</span>
                <span v-if="ind==0">（税金及附加=票房*税率,税率默认是3.262%）</span>
              </el-form-item>
            </div>
          </el-collapse-item>
          <!-- <el-collapse-item title="卖品" name="saleGoods">    
                    <el-form-item label="申购/采购/赠送入库和采购退货中的供应商是否必填："  >
                        <el-radio-group v-model="data.basicParams.merdise_supplier_can_update">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="套餐小票是否打印组成明细："  >
                        <el-radio-group v-model="data.basicParams.is_print_combo_item_detail">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="申购/采购入库商品单价是否允许修改："  >
                        <el-radio-group v-model="data.basicParams.merdise_price_can_update">
                            <el-radio label="1">是</el-radio>
                                <el-select v-model="data.basicParams.merdise_price_type_select" v-if="data.basicParams.merdise_price_can_update=='1'">
                                    <el-option label="含税单价" value="2"></el-option>
                                    <el-option label="不含税单价" value="1"></el-option>
                                </el-select>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="库存成本核算模式："  >
                        <el-radio-group v-model="data.basicParams.in_stock_by_rate">
                            <el-radio label="0"> 不含税入库 </el-radio>
                            <el-radio label="1"> 含税入库 </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-collapse-item> -->
          <el-collapse-item title="交易" name="trade">
            <!-- <el-form-item label="零售终端票券交付方式：	"  style="display:inline-block" >
                        <el-select v-model="data.basicParams.ticket_delivery_ctrl" @change="ticket_delivery_ctrl">
                            <el-option label="指定" value="1"></el-option>
                            <el-option label="前台选择" value="0"></el-option>
                        </el-select>
                        <div v-if="data.basicParams.ticket_delivery_ctrl==1" class="ticket_deliver_mode" >
                            <el-checkbox-group v-model="data.basicParams.ticket_delivery_mode">
                                <el-checkbox label="sms" defualt>发短信</el-checkbox>
                                <el-checkbox label="print" >打印票券</el-checkbox>
                                <el-checkbox label="mcard" >绑到会员卡</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div v-else class="ticket_deliver_mode">
                            <span>默认方式为</span>
                            <el-select v-model="data.basicParams.ticket_delivery_mode" placeholder="请选择" >
                                <el-option value="sms"   label="发短信"></el-option>
                                <el-option value="print" label="打印票券"></el-option>
                                <el-option value="mcard" label="打印票券"></el-option>
                            </el-select>
                        </div>
                    </el-form-item>
                    <el-form-item label="交易完成后打印备餐/取餐凭证：" >
                        <el-select v-model="data.basicParams.is_use_other_MealPre" placeholder="请选择">
                            <el-option label="不打印"       value="0"></el-option>
                            <el-option label="都打印"       value="1"></el-option>
                            <el-option label="打印取餐凭证"  value="2"></el-option>
                            <el-option label="打印备餐凭证"  value="3"></el-option>
                        </el-select>
                    </el-form-item> -->
            <el-form-item label="是否允许混合支付：">
              <el-radio-group v-model="data.basicParams.is_full_pay">
                {{data.basicParams.is_full_pay}}
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
              <p class="description">(控制前台一笔订单是否允许采用多种支付方式进行混合支付)</p>
            </el-form-item>
            <!-- <el-form-item label="刷卡后允许其他支付方式支付：" >
                        <el-select v-model="data.basicParams.is_use_other_pay" placeholder="请选择">
                            <el-option label="不允许" value="0"></el-option>
                            <el-option label="仅积分卡允许" value="2"></el-option>
                            <el-option label="所有卡允许" value="1"></el-option>
                        </el-select>
                        <p class="description">(会员刷卡支付时,是否允许其他支付方式支付)</p>
                    </el-form-item> -->
            <el-form-item label="是否允许快速结算：">
              <el-radio-group v-model="data.basicParams.allow_fast_checkout">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
              <p class="description">(允许快速结算，则收银员支付界面只需要点击快速结算按钮就可以完成收银)</p>
            </el-form-item>
            <el-form-item label="收银员售卖前必须做上班登记：">
              <el-radio-group v-model="data.basicParams.force_ready_money">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="跨营业日未清机不允许登录系统：">
              <el-radio-group v-model="data.basicParams.force_clear">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="清机过程，是否允许再次登录：">
              <el-radio-group v-model="data.basicParams.is_not_end_sale">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
              <p class="description">(清机过程中，产生的交易会记录登记在下一笔上班登记单中)</p>
            </el-form-item>
            <el-form-item label="启用营销活动匹配功能：">
              <el-radio-group v-model="data.basicParams.use_marketing_activities">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="不可售商品是否允许积分兑换：" >
                        <el-radio-group v-model="data.basicParams.nosale_integral_exch_yn">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="会员服务是否显示读卡："  >
                        <el-radio-group v-model="data.basicParams.mem_service_display_readcard">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="交易过程需打印凭证：" class="checkGround">
                        <el-checkbox-group v-model="data.basicParams.print_credential_set">
                        <el-checkbox label="hyzc" name="types">会员开卡交易凭证</el-checkbox>
                        <el-checkbox label="hycz" name="types">会员充值交易凭证</el-checkbox>
                        <el-checkbox label="hyzx" name="types">会员注销交易凭证</el-checkbox>
                        <el-checkbox label="hybk" name="types">会员补卡交易凭证</el-checkbox>
                        <el-checkbox label="sjhk" name="types">升级换卡交易凭证</el-checkbox>
                        <el-checkbox label="hyzf" name="types">会员支付凭证</el-checkbox>
                        <el-checkbox label="xfjy" name="types">销售交易凭证</el-checkbox>
                        <el-checkbox label="tkjy" name="types">退货交易凭证</el-checkbox>
                        <el-checkbox label="cxpz" name="types">充值冲销凭证</el-checkbox>
                        <el-checkbox label="ptef" name="types">抽钞凭证</el-checkbox>
                        <el-checkbox label="jfsj" name="types">积分升级</el-checkbox>
                        <el-checkbox label="wxzf" name="types">微信支付宝银联凭证</el-checkbox>
                        <el-checkbox label="wxgx" name="types">余额结转凭证</el-checkbox>
                        <el-checkbox label="mejh" name="types">会员激活凭证</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="副屏广告图片切换时间：" prop="basicParams.img_swich_time">
                        <el-input v-model="data.basicParams.img_swich_time"></el-input>
                        <span class="suffix">秒</span>
                    </el-form-item>
                    <el-form-item label="副屏广告图片是否随时播放："  >
                        <el-radio-group v-model="data.basicParams.is_disorder_swich_img">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="零售终端操作授权验证方式：">
                        <el-radio-group v-model="data.basicParams.user_verify_author_mode">
                            <el-radio label="0">用户名密码方式</el-radio>
                            <el-radio label="1">用户刷卡方式</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="零售终端需授权的操作：" class="checkGround">
                        <el-checkbox-group v-model="data.basicParams.need_verify_author_func">
                        <el-checkbox label="gtk" name="types">取货(重打影票)</el-checkbox>
                        <el-checkbox label="kmny" name="types">开钱箱</el-checkbox>
                        <el-checkbox label="cdtk" name="types">重打印</el-checkbox>
                        <el-checkbox label="bdtk" name="types">补登票</el-checkbox>
                        <el-checkbox label="ttk" name="types">退票</el-checkbox>
                        <el-checkbox label="hycx" name="types">充值冲销</el-checkbox>
                        <el-checkbox label="fmem" name="types">查询会员资料</el-checkbox>
                        <el-checkbox label="umen" name="types">修改会员资料</el-checkbox>
                        <el-checkbox label="umpass" name="types">修改会员密码</el-checkbox>
                        <el-checkbox label="rmpass" name="types">重置会员密码</el-checkbox>
                        <el-checkbox label="qqqd" name="types">前区清点</el-checkbox>
                        <el-checkbox label="handsel" name="types">赠送</el-checkbox>
                        <el-checkbox label="reportloss" name="types">报损</el-checkbox>
                        <el-checkbox label="jfsj" name="types">积分升级</el-checkbox>
                        <el-checkbox label="ttat" name="types">余额结转</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item> -->

          </el-collapse-item>
        </el-collapse>
        <!-- <div>
                <el-form-item label="采购预估采用计算单位：	"  >
                    <el-radio-group v-model="data.basicParams.purchasing_forecasting_unit">
                        <el-radio label="1">采用单品千元用量(默认)</el-radio>
                        <el-radio label="2">采用单品万元用量</el-radio>
                    </el-radio-group>
                </el-form-item>
                
                <el-form-item label="会员激活工本费是否允许柜台修改："  >
                    <el-radio-group v-model="data.basicParams.mem_active_fee_swich">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="会员会员开卡信息必填控制："  >
                    <el-radio-group v-model="data.basicParams.mem_info_required">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="编排放映计划是否判断总部售价限制："  >
                    <el-radio-group v-model="data.basicParams.is_center_sale_price_limit">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="编排放映计划是否判断总部排片指标："  >
                    <el-radio-group v-model="data.basicParams.is_center_sale_percent_limit">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="编排放映计划是否自动匹配价格方案："  >
                    <el-radio-group v-model="data.basicParams.is_defaul_apply_pricingschema">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>

                

                <el-form-item label="盘盈入库模式："  >
                    <el-radio-group v-model="data.basicParams.panying_entry_pattern">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>

                

                <el-form-item label="卖品销售交易凭证打印数量：" >
                    <el-select v-model="data.basicParams.goods_credential_print_num" >
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                        <el-option label="3" value="3"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="升级换卡是否验证会员余额：" >
                    <el-radio-group v-model="data.basicParams.is_validate_member_balance">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>

                

                <div class="title"> 卖品前区设置 </div>
                <el-form-item label="卖品前区管理："  >
                    <el-radio-group v-model="data.basicParams.is_active_prozone_store">
                        <el-radio label="1">启用</el-radio>
                        <el-radio label="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div v-if="data.basicParams.is_active_prozone_store==1">
                    <el-form-item label="前区清点是否允许调整实际数量："  >
                        <el-radio-group v-model="data.basicParams.is_active_prozone_check_modify">
                            <el-radio label="1">允许</el-radio>
                            <el-radio label="0">不允许</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="前区库存不足是否允许继续销售："  >
                        <el-radio-group v-model="data.basicParams.is_allow_prozone_store_negate">
                            <el-radio label="1">允许</el-radio>
                            <el-radio label="0">不允许</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
                <div class="title">抽钞</div>
                <el-form-item label="班次首次抽钞的浮动金额："  prop="basicParams.extract_fund_float_amount^">
                    <el-input v-model="data.basicParams.extract_fund_float_amount"></el-input>
                    <span class="suffix">元</span>
                </el-form-item>
                <div class="title">前台授权</div>
            </div> -->

      </el-form>
    </div>
    <el-row class="footer">
      <el-button type="primary" @click="saveBasicParam" style="width:80px;height:32px;"><span style="color:#FFFFFF">修改</span> </el-button>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    applicableObj: { type: String, default: '111111' }
  },
  data () {
    var time = (rule, value, callback) => {
      console.log(value, '---');
      if (value <= 0) {
        return callback(new Error('副屏广告图片切换时间必须大于0'));
      } else {
        callback();
      }
    };
    return {
      activeNames: ['ticket', 'saleGoods', 'trade'],
      data: {
        basicParams: {
          ticket_delivery_ctrl: '0',
          ticket_delivery_mode: 'sms'
        },
        specialCapitalRatioList: [],
        taxRateList: []
      },
      rules: {
        'basicParams.refuse_get_ticket_time': [
          { required: true, message: '请输入时间', trigger: 'blur' },
          {}
        ],
        'basicParams.refuse_sale_ticket_time': [
          { required: true, message: '请输入时间', trigger: 'blur' }
        ],
        'basicParams.max_sale_seat_num': [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        'basicParams.ticket_delivery_mode': [
          { required: true, message: '请输入零售终端票券交付方式', trigger: 'change' }
        ],
        'basicParams.img_swich_time': [
          { required: true, message: '请输入确切时间', trigger: 'blur' },
          { validator: time, trigger: 'blur' }
        ],
        'basicParams.extract_fund_float_amount': [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
        'basicParams.extract_fund_float_amount': [
          { required: true, message: '请输入浮动金额', trigger: 'blur' }
        ]
      }
    };
  },
  watch: {
    applicableObj (news, olds) {
      this.initData();
    }
  },
  methods: {
    /* 正则校验  */
    checkNapercentageTestme (rules, value, callback) {
      console.log('好好好', value);
      let regExp = /^([0-9]{1,2}$)|(^[0-9]{1,2}\.[0-9]{1,3}$)|100$|100.00$/;
      if (value == '') {
        return callback();
      } else if (!regExp.test(value)) {
        new callback(new Error('最大输入两位正整数，三位小数'));
      }
      return callback();
    },
    // 专资比例 添加
    deleSpecialCap (val) {
      this.data.specialCapitalRatioList.splice(val, 1);
    },
    addSpecialCap () {
      let data = {
        startTime: '',
        endTime: '',
        paramValue: ''
      };
      let { specialCapitalRatioList } = this.data;
      data.seq = specialCapitalRatioList.length + 1;
      specialCapitalRatioList.push(data);
    },
    // 税率 添加
    addtaxRate () {
      let { taxRateList } = this.data;
      let data = {
        startTime: '',
        endTime: '',
        paramValue: ''
      };
      data.seq = taxRateList.length + 1;
      taxRateList.push(data);
    },
    deletaxRate (val) {
      console.log(val);
      this.data.taxRateList.splice(val, 1);
    },
    // 保存
    saveBasicParam () {
      this.data.applicableObj = this.applicableObj;
      this.data.paramType = 0;
      console.log(this.data);
      this.$refs['formData'].validate((valid) => {
        if (!valid) return;
        let _data = JSON.parse(JSON.stringify(this.data));
        // 专资比例
        let specialCapitalRatioList = this.data.specialCapitalRatioList;
        for (var i = 0; i < specialCapitalRatioList.length; i++) {
          if (specialCapitalRatioList[i].paramValue) {
            if (specialCapitalRatioList[i].startTime > specialCapitalRatioList[i].endTime) {
              return this.$message.error('专资比例，结束时间必须大于开始时间');
            }
            if (!specialCapitalRatioList[i].startTime || !specialCapitalRatioList[i].endTime) {
              return this.$message.error('专资比例，请填写时间');
            }
          }
        }
        // 税率
        let taxRateList = this.data.taxRateList;
        for (var i = 0; i < taxRateList.length; i++) {
          if (taxRateList[i].paramValue) {
            if (taxRateList[i].startTime > taxRateList[i].endTime) {
              return this.$message.error('税率，结束时间必须大于开始时间');
            }
            if (!taxRateList[i].startTime || !taxRateList[i].endTime) {
              return this.$message.error('税率，请填写时间');
            }
          }
        }
        // 如果默认不填写  回传空数组
        if (specialCapitalRatioList.length == 1 && !specialCapitalRatioList[0].paramValue) {
          _data.specialCapitalRatioList = [];
        }
        if (taxRateList.length == 1 && !taxRateList[0].paramValue) {
          _data.taxRateList = [];
        }
        if (this.data.basicParams.ticket_delivery_ctrl == '1' && !this.data.basicParams.ticket_delivery_mode.length) {
          return this.$message.error('填写指定零售终端票券交付方式');
        }
        // 保存请求
        this.$ctmList.systemParamSaveBasic(_data).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.initData();
              }
            });
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            });
          }
        });
      });
    },
    /**
     *  @param  value 1 -指定 0-前台选择
     */
    ticket_delivery_ctrl (value) {
      if (value == '1') {
        this.data.basicParams.ticket_delivery_mode = ['sms', 'print', 'mcard'];
      } else {
        this.data.basicParams.ticket_delivery_mode = 'sms';
      }
    },
    // 初始化查询
    initData () {
      let data = {
        'paramType': 2,
        'applicableObj': this.applicableObj,
        'settingType': 1
      };
      this.$ctmList.systemParamLoad(data).then(res => {
        if (res.code = 200) {
          let { data } = res;
          this.data = data;
          // 默认参数
          if (data.basicParams.ticket_delivery_ctrl == 0) {
            data.basicParams.ticket_delivery_mode = data.basicParams.ticket_delivery_mode[0];
          }
          data.basicParams.ticket_delivery_ctrl = data.basicParams.ticket_delivery_ctrl || '0';
          data.basicParams.ticket_delivery_mode = data.basicParams.ticket_delivery_mode || 'sms';
          this.interfaceParamList = data.interfaceParamList;

          data.basicParams.print_credential_set = data.basicParams.print_credential_set || ['hyzc'];
          // 零售终端票券交付方式1 为数组，0为字符串
          if (this.data.taxRateList.length == 0) {
            let data = {
              startTime: '',
              endTime: '',
              paramValue: '',
              seq: 1
            };
            this.data.taxRateList = [];
            this.data.taxRateList.push(data);
          }
          if (this.data.specialCapitalRatioList.length == 0) {
            let data = {
              startTime: '',
              endTime: '',
              paramValue: '',
              seq: 1
            };
            this.data.specialCapitalRatioList.push(data);
          }
          console.log('响应参数。。。。。。。。:', this.data);
        } else {
          let type = 'error';
          let message = res.msg ? res.msg : '查询失败';
          this.$message({
            type,
            message,
            duration: 1000
          });
        }
      });
    }
  },
  created () {
    this.initData();
    console.log(this.applicationCache);
  }
};
</script>
<style lang="scss">
.basic-params {
  padding-bottom: 50px;
  .description {
    color: #666;
    font-size: 12px;
  }
  span {
    color: #666;
    font-size: 12px;
  }
  display: flex;
  height: 100%;
  flex-direction: column;
  .component {
    flex: 1;
    .el-collapse,
    .el-collapse-item__content {
      padding-bottom: 0;
    }
  }
  .footer {
    position: fixed;
    left: 400px;
    right: 10px;
    bottom: 0px;
    height: 40px;
    padding-bottom: 10px;
    z-index: 99;
    background: #fff;
  }
  .el-form-item--small .el-form-item__label {
    text-align: right;
  }
  .el-form--inline .el-form-item {
    display: block;
  }
  .el-input--small {
    width: 70px;
  }
  .el-input--suffix {
    width: 150px;
    display: inline-block;
  }
  .suffix {
    margin-left: 10px;
    color: #666;
  }
  .checkGround .el-checkbox-group {
    width: 600px;
    .el-checkbox {
      width: 150px;
    }
  }
  .ticket_deliver_mode {
    display: inline-block;
    .el-checkbox-group .el-checkbox {
      width: 70px;
    }
  }
  .icon-neiye-tianjia-,
  .add,
  .delete {
    color: #3b74ff;
  }
  .el-input--suffix {
    width: 130px;
    font-size: 12px;
  }
  .el-collapse-item__header {
    display: flex;
    justify-content: flex-end;
    flex-direction: row-reverse;
  }
  .el-collapse-item__header::after {
    display: none;
  }
  .el-collapse-item__wrap {
    padding-top: 0;
  }
}
</style>

