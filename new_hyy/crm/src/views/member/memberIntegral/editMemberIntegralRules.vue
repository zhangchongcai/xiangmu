<template>
  <div class="_edit-member-integral-rules">
    <div class="bodyer">
      <el-form :inline="true" :model="formData" ref="formData" class="form-data-wrap">
        <div class="period-validity">
          <el-form-item label="积分有效期：" prop="validityYear" :rules="rules.validityYear">
            <el-input style="width:192px;" v-model="formData.validityYear" placeholder="请输入年" clearable></el-input>
            <span style="padding-left:10px; font-size:12px; color:#333;">年</span>
          </el-form-item>
        </div>
        <el-collapse v-model="activeNames" class="_edit-member-integral-content">
          <!-- 购买影票 -->
          <el-collapse-item title="购买影票" name="0" class="get-rules">
            <div class="pay-ticket-content">
              <!-- 渠道： -->
              <el-form-item label="渠道：" :rules="{ required: true, validator: checkChannelListSelected, trigger: 'change'}" class="channel-selection" prop="ticketChannelObj.checkedAccessChannels">
                <el-checkbox :indeterminate="formData.ticketChannelObj.isIndeterminate" v-model="formData.ticketChannelObj.checkAll" @change="handleCheckAllTicket($event)">全部渠道</el-checkbox>
                <el-checkbox-group v-model="formData.ticketChannelObj.checkedAccessChannels" @change="handleCheckedTicketChange($event)">
                  <el-checkbox v-for="channel in formData.ticketChannelObj.checkedAccessChannelsOptions" :label="channel" :key="channel" @change="handleCheckSingleTicket($event,channel)">{{channel}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <!-- 内容 -->
              <div class="label" v-for="(item,key) in formData.ticket" :key="key">
                <template v-if="formData.ticketChannelObj.checkedAccessChannels.indexOf(key)!=-1">
                  <div class="label-title">
                    {{key}}
                    <el-button class="label-delete" type="text" @click="deleteRegion('ticket',key)">删除</el-button>
                  </div>
                  <ul class="label-content">
                    <template v-for="(childItem,childIndex) in item">
                      <li class="label-content-item" v-if="!childItem.isDelete" :key="childItem.id">
                        <span style="margin-right:8px;">会员等级</span>
                        <el-form-item class="form-inline" :rules="rules.memberLevelLower" :prop="'ticket.'+key+'.'+childIndex">
                          <el-input v-model="childItem.memberLevelLower" clearable></el-input>
                        </el-form-item>
                        <span style="margin:8px;">至</span>
                        <el-form-item class="form-inline" :rules="rules.memberLevelUpper" :prop="'ticket.'+key+'.'+childIndex">
                          <el-input style="margin-right:24px;" v-model="childItem.memberLevelUpper" clearable>
                          </el-input>
                        </el-form-item>
                        <!-- <span style="margin-right:8px;">支付方式</span>
                        <el-form-item class="form-inline-other" :rules="rules.payType" :prop="'ticket.'+key+'.'+childIndex+'.payType'">
                          <el-select style="margin-right:24px;" v-model="childItem.payType" placeholder="请选择支付方式">
                            <el-option v-for="item in payTypeOptions" :key="item.code" :label="item.desc" :value="item.code"></el-option>
                          </el-select>
                        </el-form-item> -->
                        <span style="margin-right:8px;">订单每满</span>
                        <el-form-item class="form-inline" :rules="rules.money" :prop="'ticket.'+key+'.'+childIndex+'.everyFullOrder'">
                          <el-input v-model="childItem.everyFullOrder" clearable></el-input>
                        </el-form-item>
                        <span style="margin-left:8px;">元</span>
                        <span style="margin-left:24px;margin-right:8px;">获取</span>
                        <el-form-item class="form-inline" :rules="rules.Integral" :prop="'ticket.'+key+'.'+childIndex+'.everyFullIntegral'">
                          <el-input v-model="childItem.everyFullIntegral" clearable></el-input>
                        </el-form-item>
                        <span style="margin-left:8px;margin-right:24px;">积分</span>
                        <el-form-item class="form-inline-other" :prop="'ticket.'+key+'.'+childIndex+'.integralUpper'">
                          <el-checkbox v-model="childItem.integralUpper">设置获取积分上限</el-checkbox>
                        </el-form-item>
                        <template v-if="childItem.integralUpper">
                          <span style="margin-left:24px;margin-right:8px;">每订单获取上限</span>
                          <el-form-item class="form-inline" :rules="rules.Integral" :prop="'ticket.'+key+'.'+childIndex+'.everyOrderUpper'">
                            <el-input v-model="childItem.everyOrderUpper" clearable></el-input>
                          </el-form-item>
                          <span style="margin-left:8px;">积分</span>
                          <br>
                          <!-- <span style="margin-left:24px;margin-right:8px;">每日上限</span> -->
                          <span style="margin-right:8px;">每日上限</span>
                          <el-form-item class="form-inline" :rules="rules.Integral" :prop="'ticket.'+key+'.'+childIndex+'.everyDayUpper'">
                            <el-input v-model="childItem.everyDayUpper" clearable></el-input>
                          </el-form-item>
                          <span style="margin-left:8px;">积分</span>
                        </template>
                        <el-button class="label-content-item-delete" type="text" v-if="showDeleteBtn(item)" @click="deleteItem('ticket',key,childIndex)">删除</el-button>
                      </li>
                    </template>
                    <div class="label-add">
                      <el-button type="text" @click="addItem('ticket',key)">添加</el-button>
                    </div>
                  </ul>
                </template>
              </div>
            </div>
          </el-collapse-item>
          <!-- 购买卖品 -->
          <el-collapse-item title="购买卖品" name="1" class="get-rules">
            <div class="pay-ticket-content">
              <!-- 渠道： -->
              <el-form-item label="渠道：" :rules="{ required: true, validator: checkChannelListSelected, trigger: 'change'}" class="channel-selection" prop="goodsChannelObj.checkedAccessChannels">
                <el-checkbox :indeterminate="formData.goodsChannelObj.isIndeterminate" v-model="formData.goodsChannelObj.checkAll" @change="handleCheckAllGoods($event)">全部渠道</el-checkbox>
                <el-checkbox-group v-model="formData.goodsChannelObj.checkedAccessChannels" @change="handleCheckedGoodsChange($event)">
                  <el-checkbox v-for="channel in formData.goodsChannelObj.checkedAccessChannelsOptions" :label="channel" :key="channel" @change="handleCheckSingleGoods($event,channel)">{{channel}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <!-- 内容 -->
              <div class="label" v-for="(item,key) in formData.goods" :key="key">
                <template v-if="formData.goodsChannelObj.checkedAccessChannels.indexOf(key)!=-1">
                  <div class="label-title">
                    {{key}}
                    <el-button class="label-delete" type="text" @click="deleteRegion('goods',key)">删除</el-button>
                  </div>
                  <ul class="label-content">
                    <template v-for="(childItem,childIndex) in item">
                      <li class="label-content-item" v-if="!childItem.isDelete" :key="childItem.id">
                        <span style="margin-right:8px;">会员等级</span>
                        <el-form-item class="form-inline" :rules="rules.memberLevelLower" :prop="'goods.'+key+'.'+childIndex">
                          <el-input v-model="childItem.memberLevelLower" clearable></el-input>
                        </el-form-item>
                        <span style="margin:8px;">至</span>
                        <el-form-item class="form-inline" :rules="rules.memberLevelUpper" :prop="'goods.'+key+'.'+childIndex">
                          <el-input style="margin-right:24px;" v-model="childItem.memberLevelUpper" clearable>
                          </el-input>
                        </el-form-item>
                        <!-- <span style="margin-right:8px;">支付方式</span>
                        <el-form-item class="form-inline-other" :rules="rules.payType" :prop="'goods.'+key+'.'+childIndex+'.payType'">
                          <el-select style="margin-right:24px;" v-model="childItem.payType" placeholder="请选择支付方式">
                            <el-option v-for="item in payTypeOptions" :key="item.code" :label="item.desc" :value="item.code"></el-option>
                          </el-select>
                        </el-form-item> -->
                        <span style="margin-right:8px;">订单每满</span>
                        <el-form-item class="form-inline" :rules="rules.money" :prop="'goods.'+key+'.'+childIndex+'.everyFullOrder'">
                          <el-input v-model="childItem.everyFullOrder" clearable></el-input>
                        </el-form-item>
                        <span style="margin-left:8px;">元</span>
                        <span style="margin-left:24px;margin-right:8px;">获取</span>
                        <el-form-item class="form-inline" :rules="rules.Integral" :prop="'goods.'+key+'.'+childIndex+'.everyFullIntegral'">
                          <el-input v-model="childItem.everyFullIntegral" clearable></el-input>
                        </el-form-item>
                        <span style="margin-left:8px;margin-right:24px;">积分</span>
                        <el-form-item class="form-inline-other" :prop="'goods.'+key+'.'+childIndex+'.integralUpper'">
                          <el-checkbox v-model="childItem.integralUpper">设置获取积分上限</el-checkbox>
                        </el-form-item>
                        <template v-if="childItem.integralUpper">
                          <span style="margin-left:24px;margin-right:8px;">每订单获取上限</span>
                          <el-form-item class="form-inline" :rules="rules.Integral" :prop="'goods.'+key+'.'+childIndex+'.everyOrderUpper'">
                            <el-input v-model="childItem.everyOrderUpper" clearable></el-input>
                          </el-form-item>
                          <span style="margin-left:8px;">积分</span>
                          <br>
                          <!-- <span style="margin-left:24px;margin-right:8px;">每日上限</span> -->
                          <span style="margin-right:8px;">每日上限</span>
                          <el-form-item class="form-inline" :rules="rules.Integral" :prop="'goods.'+key+'.'+childIndex+'.everyDayUpper'">
                            <el-input v-model="childItem.everyDayUpper" clearable></el-input>
                          </el-form-item>
                          <span style="margin-left:8px;">积分</span>
                        </template>
                        <el-button class="label-content-item-delete" type="text" v-if="showDeleteBtn(item)" @click="deleteItem('goods',key,childIndex)">删除</el-button>
                      </li>
                    </template>
                    <div class="label-add">
                      <el-button type="text" @click="addItem('goods',key)">添加</el-button>
                    </div>
                  </ul>
                </template>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <!-- 底部 -->
        <div class="footer-btn-wrap">
          <el-button type="primary" @click="submitForm('formData')" class="_el-btn-custom _member-add-edit-save-btn">保存
          </el-button>
          <el-button @click="handleCancle" class="_el-btn-custom">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'EditMemberIntegralRules',
  data () {
    return {
      // 渲染、验证数据
      formData: {
        validity: '3', // 积分有效期
        ticketChannel: '', // 影票渠道
        goodsChannel: '', // 卖品渠道
        tenantId: this.$store.state.loginUser.consumerId, // 租户id
        ticket: {}, // 购买影票渲染对象
        goods: {}, // 购买卖品渲染对象
        validityYear: '0', // 积分有效期
        // 影票渠道
        ticketChannelObj: {
          checkedAccessChannelsOptions: [], // 全部渠道选项
          checkAll: false, // 全选
          isIndeterminate: true,
          checkedAccessChannels: [] // 已选择的渠道
        },
        // 卖品渠道
        goodsChannelObj: {
          checkedAccessChannelsOptions: [], // 全部渠道选项
          checkAll: false, // 全选
          isIndeterminate: true,
          checkedAccessChannels: [] // 已选择的渠道
        },
        allChannelObj: [] // 全部渠道
      },
      // 提交数据
      commitParams: {
        tenantId: '',
        validityYear: '',
        ruleDetailList: []
      },
      memberLevelRange: 0, // 会员等级验证范围
      tenantId: this.$store.state.loginUser.consumerId, // 租户id
      activeNames: ['0', '1'], // 开启关闭伸缩项
      // 支付方式
      payTypeOptions: [
        { code: 'all', desc: '全部' },
        { code: 'wxmicropay', desc: '微信支付码付款' },
        { code: 'cash', desc: '现金' },
        { code: 'alimicropay', desc: '支付宝支付码付款' },
        { code: 'membercard', desc: '会员卡付款' }
      ],
      // 点击添加数据项
      addItemData: {
        // id:0,//id
        memberLevelLower: 0, // 会员等级下线值
        memberLevelUpper: 0, // 会员等级上限值
        payType: 'all', // 支付方式
        everyFullOrder: 0, // 订单每满N元
        everyFullIntegral: 0, // 获取N积分
        integralUpper: true, // 设置获取积分上限：为1时everyOrderUpper和everyDayUpper这2个参数不能为空
        everyOrderUpper: 0, // 每订单获取上限N积分
        everyDayUpper: 0, // 每日上限N积分
        isDelete: 0, // 删除标识 0:未删除 1:已删除
        channelNo: '', // 渠道编号
        channelName: '', // 渠道名称
        integralWayType: 'gain', // 积分规则类型
        integralExchangeType: '', // 积分兑换类型：ticket、goods
        cinemaId: '', // 影院id
        cinemaName: '', // 影院名称
        tenantId: this.$store.state.loginUser.consumerId + '' // 租户id
      },
      // 验证规则
      rules: {
        // 积分有效期
        validityYear: [
          {
            required: true,
            trigger: 'blur',
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('积分有效期不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
              } else if (value > 999) {
                return callback(new TypeError('超出范围'));
              }
              return callback();
            }
          }
        ],
        // 会员等级上限
        memberLevelUpper: [
          {
            required: true,
            trigger: 'blur',
            validator: (rules, value, callback) => {
              if (value.memberLevelUpper == '0' || !value.memberLevelUpper) {
                return callback(new Error('等级上限不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value.memberLevelUpper)) {
                return callback(new TypeError('请输入正整数'));
              }
              if (value.memberLevelUpper > this.memberLevelRange) {
                return callback(new TypeError('超出会员等级范围'));
              }
              if (value.memberLevelLower > value.memberLevelUpper) {
                return callback(new Error('下限不能大于上限'));
              }
              return callback();
            }
          }
        ],
        // 会员等级下限
        memberLevelLower: [
          {
            required: true,
            trigger: 'blur',
            validator: (rules, value, callback) => {
              if (value.memberLevelLower == '0' || !value.memberLevelLower) {
                return callback(new Error('等级下限不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value.memberLevelLower)) {
                return callback(new TypeError('请输入正整数'));
              }
              if (value.memberLevelLower > this.memberLevelRange) {
                return callback(new TypeError('超出会员等级范围'));
              }
              // if(value.memberLevelLower > value.memberLevelUpper){
              //   return callback(new Error('下限不能大于上限'));
              // }
              return callback();
            }
          }
        ],
        // 金钱：订单每满N元
        money: [
          {
            required: true,
            trigger: 'blur',
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('价钱不能为空'));
              }
              return callback();
            }
          }
        ],
        // 积分：获取N积分、每订单获取上限N积分、每日上限N积分
        Integral: [
          {
            required: true,
            trigger: 'blur',
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('积分不能为空'));
              }
              return callback();
            }
          }
        ],
        // 支付方式
        payType: [
          {
            required: true,
            trigger: 'blur',
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('支付方式不能为空'));
              }
              return callback();
            }
          }
        ]
      }
    };
  },
  async mounted () {
    await this.channelList();
    await this.getMemberLevelList();
    // this.resetFormDataRenderData(JSON.parse(JSON.stringify(this.data)))
    this.getIntegralRulesList();
  },
  methods: {
    // 获取会员等级列表
    async getMemberLevelList () {
      let params = {
        tenantId: this.tenantId
      };
      await this.$crmList
        .getLevelDetail(params)
        .then(data => {
          if (data) {
            if (data.memberLevelRuleVOList) {
              this.memberLevelRange = data.memberLevelRuleVOList.length;
            } else {
              this.$message({
                message: '获取会员等级失败',
                type: 'warn',
                duration: 1500
              });
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 是否显示删除按钮(当只剩最后一条规则不显示删除按钮)
    showDeleteBtn (item) {
      let count = 0; // 记录是否至少有一条状态不为删除的规则
      item.forEach(el => {
        if (el.isDelete != 1) {
          count++;
        }
      });

      if (count == 1) {
        return false;
      } else {
        return true;
      }
    },
    // 取消按钮
    handleCancle () {
      this.$store.commit('tagNav/removeTagNav', this.$route);
      this.$router.push({ path: '/member/memberIntegral/rules' });
    },
    // 渠道选择规则
    checkChannelListSelected (rule, value, callback) {
      if (!value.length) {
        console.log('请选择获取渠道', value);
        callback(new Error('请选择获取渠道'));
      } else {
        console.log('请选择获取渠道', value);
        callback();
      }
    },
    // 影票-监听变化
    handleCheckedTicketChange (value) {
      let checkedCount = value.length;
      this.formData.ticketChannelObj.checkAll =
        checkedCount ===
        this.formData.ticketChannelObj.checkedAccessChannelsOptions.length;
      this.formData.ticketChannelObj.isIndeterminate =
        checkedCount > 0 &&
        checkedCount <
        this.formData.ticketChannelObj.checkedAccessChannelsOptions.length;
    },
    // 卖品-监听变化
    handleCheckedGoodsChange (value) {
      let checkedCount = value.length;
      this.formData.goodsChannelObj.checkAll =
        checkedCount ===
        this.formData.goodsChannelObj.checkedAccessChannelsOptions.length;
      this.formData.goodsChannelObj.isIndeterminate =
        checkedCount > 0 &&
        checkedCount <
        this.formData.goodsChannelObj.checkedAccessChannelsOptions.length;
    },
    // 影票-单选按钮
    handleCheckSingleTicket (val, channel) {
      if (!val) {
        // 子模块全部删除
        this.formData.ticket[channel].forEach(item => {
          item.isDelete = 1;
        });
      } else {
        // 如果有至少一条规则会默认显示，如果没有直接添加一条规则
        this.addItem('ticket', channel);
      }
    },
    // 卖品-单选按钮
    handleCheckSingleGoods (val, channel) {
      if (!val) {
        // 子模块全部删除
        this.formData.goods[channel].forEach(item => {
          item.isDelete = 1;
        });
      } else {
        // 如果有至少一条规则会默认显示，如果没有直接添加一条规则
        this.addItem('goods', channel);
      }
    },
    // 影票-全选按钮
    handleCheckAllTicket (val) {
      this.formData.ticketChannelObj.checkedAccessChannels = val
        ? JSON.parse(
          JSON.stringify(
            this.formData.ticketChannelObj.checkedAccessChannelsOptions
          )
        )
        : [];
      this.formData.ticketChannelObj.isIndeterminate = false;
      if (!val) {
        // 全部模块删除
        for (let key in this.formData.ticket) {
          this.formData.ticket[key].forEach(el => {
            el.isDelete = 1;
          });
        }
      } else {
        // 如果至少有一条规则就不添加规则，如果一条规则都没有那就添加规则
        for (let keys in this.formData.ticket) {
          let count = 0; // 记录是否有没有一条状态不为删除的规则
          this.formData.ticket[keys].forEach(el => {
            if (el.isDelete != 1) {
              count++;
            }
          });
          if (count == 0) {
            this.addItem('ticket', keys);
          }
        }
      }
    },
    // 卖品-全选按钮
    handleCheckAllGoods (val) {
      this.formData.goodsChannelObj.checkedAccessChannels = val
        ? JSON.parse(
          JSON.stringify(
            this.formData.goodsChannelObj.checkedAccessChannelsOptions
          )
        )
        : [];
      this.formData.goodsChannelObj.isIndeterminate = false;
      if (!val) {
        // 全部模块删除
        for (let key in this.formData.goods) {
          this.formData.goods[key].forEach(el => {
            el.isDelete = 1;
          });
        }
      } else {
        // 如果至少有一条规则就不添加规则，如果一条规则都没有那就添加规则
        for (let keys in this.formData.goods) {
          let count = 0; // 记录是否有没有一条状态不为删除的规则
          this.formData.goods[keys].forEach(el => {
            if (el.isDelete != 1) {
              count++;
            }
          });
          if (count == 0) {
            this.addItem('goods', keys);
          }
        }
      }
    },
    // 获取渠道列表
    async channelList () {
      let params = {
        tenantId: this.tenantId
      };
      await this.$crmList
        .channelList(params)
        .then(res => {
          if (res) {
            res.forEach(element => {
              this.formData.ticketChannelObj.checkedAccessChannelsOptions.push(
                element.desc
              );
              this.formData.goodsChannelObj.checkedAccessChannelsOptions.push(
                element.desc
              );
            });
            this.formData.allChannelObj = JSON.parse(JSON.stringify(res));
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取积分创建规则列表
    getIntegralRulesList () {
      let params = {
        tenantId: this.tenantId
      };
      this.$crmList
        .getIntegralRulesList(params)
        .then(res => {
          if (res) {
            this.resetFormDataRenderData(JSON.parse(JSON.stringify(res)));
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 组装列表渲染数据
    resetFormDataRenderData (data) {
      let ticket = {};
      let goods = {};
      let validityYear = data.validityYear;
      // 购买影票
      data.ticket.forEach(item => {
        for (let key in item) {
          item[key].forEach(el => {
            if (el.integralUpper == 1) {
              el.integralUpper = true;
            }
            if (el.integralUpper == 0) {
              el.integralUpper = false;
            }
          });
          if (item[key].length != 0) {
            this.formData.ticketChannelObj.checkedAccessChannels.push(key);
          }
          ticket[key] = item[key];
        }
      });
      // 购买卖品
      data.goods.forEach(item => {
        for (let key in item) {
          item[key].forEach(el => {
            if (el.integralUpper == 1) {
              el.integralUpper = true;
            }
            if (el.integralUpper == 0) {
              el.integralUpper = false;
            }
          });
          if (item[key].length != 0) {
            this.formData.goodsChannelObj.checkedAccessChannels.push(key);
          }
          goods[key] = item[key];
        }
      });

      this.formData.ticket = ticket;
      this.formData.goods = goods;
      this.formData.validityYear = validityYear;

      if (
        this.formData.goodsChannelObj.checkedAccessChannels.length ==
        this.formData.allChannelObj.length
      ) {
        this.formData.goodsChannelObj.checkAll = true;
      }
      if (
        this.formData.ticketChannelObj.checkedAccessChannels.length ==
        this.formData.allChannelObj.length
      ) {
        this.formData.ticketChannelObj.checkAll = true;
      }
    },
    // 删除每块
    deleteRegion (target, key) {
      this.formData[`${target}ChannelObj`].checkedAccessChannels.forEach(
        (item, index) => {
          if (key == item) {
            this.formData[`${target}ChannelObj`].checkedAccessChannels.splice(
              index,
              1
            );
          }
        }
      );
      // 全部模块清除时取消全选
      if (
        this.formData[`${target}ChannelObj`].checkedAccessChannels.length == 0
      ) {
        this.formData[`${target}ChannelObj`].isIndeterminate = false;
        this.formData[`${target}ChannelObj`].checkAll = false;
      } else {
        this.formData[`${target}ChannelObj`].isIndeterminate = true;
      }

      // 子模块全部删除
      this.formData[target][key].forEach(item => {
        item.isDelete = 1;
      });
    },
    // 删除每条
    deleteItem (target, key, childIndex) {
      this.formData[target][key][childIndex].isDelete = 1;
    },
    // 添加每条
    addItem (target, key) {
      // this.addItemData.id=Math.random()
      let addData = JSON.parse(JSON.stringify(this.addItemData));
      addData.integralExchangeType = target;
      addData.channelName = key;
      this.formData.allChannelObj.forEach(item => {
        if (item.desc == key) {
          addData.channelNo = item.code;
        }
      });
      this.formData[target][key].push(addData);
    },
    // 组装提交保存数据
    resetFormDataCommitData (data) {
      for (let key in data) {
        data[key].forEach(item => {
          if (!item.id && item.isDelete == 1) {
          } else {
            let obj = {};
            obj.channelName = item.channelName;
            obj.channelNo = item.channelNo;
            obj.cinemaId = item.cinemaId || '';
            obj.cinemaName = item.cinemaName || '';
            obj.everyDayUpper = item.everyDayUpper;
            obj.everyFullIntegral = item.everyFullIntegral;
            obj.everyFullOrder = item.everyFullOrder;
            obj.everyOrderUpper = item.everyOrderUpper;
            obj.integralExchangeType = item.integralExchangeType;
            obj.integralUpper = item.integralUpper;
            obj.integralWayType = item.integralWayType;
            obj.isDelete = item.isDelete;
            obj.memberLevelLower = item.memberLevelLower;
            obj.memberLevelUpper = item.memberLevelUpper;
            obj.payType = item.payType;
            obj.tenantId = item.tenantId;
            if (item.id) obj.id = item.id;
            if (item.integralUpper == true) obj.integralUpper = 1;
            if (item.integralUpper == false) obj.integralUpper = 0;
            this.commitParams.ruleDetailList.push(obj);
          }
        });
      }
    },
    // 验证是否有空数据项存在（暂时不会出现这种情况）
    validFormDataCommitData () {
      let hasCountFlag = 0;
      this.commitParams.ruleDetailList.forEach(item => {
        if (item.isDelete != 1) {
          hasCountFlag++;
        }
      });
      if (hasCountFlag) {
        return true;
      } else {
        return false;
      }
    },
    // 保存按钮
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 清空上次提交
          (this.commitParams = {
            tenantId: '',
            validityYear: '',
            ruleDetailList: []
          }),
            // 组装提交保存数据
            this.resetFormDataCommitData(this.formData.ticket);
          this.resetFormDataCommitData(this.formData.goods);
          this.commitParams.tenantId = this.tenantId;
          this.commitParams.validityYear = this.formData.validityYear - 0;

          // 验证提交的数组上否为空（暂时不会出现这种情况）
          if (!this.validFormDataCommitData()) {
            this.$message({
              message: '请填写规则',
              type: 'warn',
              duration: 1500
            });
            return false;
          }
          // 请求提交
          this.commitIntegralRulesList(this.commitParams);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 提交表单数据
    commitIntegralRulesList (params) {
      this.$crmList
        .commitIntegralRulesList(params)
        .then(res => {
          this.$message({
            message: '保存成功',
            type: 'success',
            duration: 1500
          });
          this.$store.commit('tagNav/removeTagNav', this.$route);
          this.$router.push({
            path: '/member/memberIntegral/rules'
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
// 编辑会员积分规则样式
._edit-member-integral-rules {
  // padding: 20px;

  .header {
    width: 100%;
    border-bottom: 1px solid #bcbcbc;
    color: #000;
    font-weight: bolder;
  }
  .bodyer {
    .form-data-wrap {
      .channel-selection {
        margin-bottom: 0;
        width: 100%;
        .el-checkbox,
        .el-checkbox-group {
          .el-checkbox__label {
            font-size: 12px;
          }
        }
        .el-form-item__error {
          top: 27px;
        }
      }
      .period-validity {
        height: 60px;
        display: flex;
        align-items: center;
        background: #f5f5f5;
        padding: 0 20px;
        .el-form-item {
          margin-bottom: 0;
        }
      }
      .label {
        .label-title {
          font-weight: bolder;
          .label-delete {
            float: right;
            font-weight: normal;
            color: #3b74ff;
            font-size: 12px;
          }
        }
        .label-content {
          padding: 20px;
          margin: 10px;
          .label-content-item {
            background-color: #f5f7fa;
            line-height: 55px;
            padding: 10px 20px;
            margin-bottom: 10px;
            .el-input {
              width: 100px !important;
              margin-top: 4px;
            }
            .el-input__inner {
              width: 100px !important;
            }
            .label-content-item-delete {
              float: right;
              font-weight: normal;
              color: #3b74ff;
              font-size: 12px;
            }
          }
          .el-input {
            width: 80px !important;
            margin-top: 4px;
          }
          .el-input__inner {
            width: 80px !important;
          }
          .form-inline {
            // width:80px;
            margin-right: 0px !important;
            margin-bottom: 0px !important;
            vertical-align: middle;
          }
          .form-inline-other {
            margin-right: 0px !important;
            margin-bottom: 0px !important;
            vertical-align: middle;
            .el-select {
              margin-top: 3.5px;
            }
            .el-checkbox {
              margin-top: 5.5px;
            }
          }
          .el-form-item {
            .el-input__inner {
              width: 80px !important;
            }
          }
        }
        .label-add {
          padding: 10px;
          width: 100%;
          font-size: 12px;
          text-align: center;
          color: #3b74ff;
          background-color: #f5f7fa;
          .el-button {
            font-size: 12px;
          }
        }
      }
    }
    .footer-btn-wrap {
      margin: 20px 0 30px 0;
      text-align: center;
      .el-button {
        width: 80px;
        padding: 8px 20px;
      }
    }
  }
}
</style>
