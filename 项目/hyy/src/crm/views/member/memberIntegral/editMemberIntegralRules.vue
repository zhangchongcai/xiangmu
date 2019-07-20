<template>
  <div class="_edit-member-integral-rules">
    <div class="bodyer">
      <el-form :inline="true" :model="formData" ref="formData" class="form-data-wrap _member-search-area-custom">
        <div class="period-validity">
          <el-form-item label="*积分有效期：" prop="validity" :rules="[{ required: true, message: '请选择积分有效期', trigger: 'blur' }]">
            <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
            <span style="padding-left:10px; font-size:12px; color:#333;">年</span>
          </el-form-item>
        </div>
        <el-collapse  v-model="activeNames" class="_edit-member-integral-content">
          <!-- 购买影票 -->
          <el-collapse-item title="购买影票" name="0" class="get-rules">
            <div class="pay-ticket-content">
              <el-form-item label="渠道：" prop="channel" :rules="[{ required: true, message: '请选择渠道', trigger: 'blur' }]">
                <!-- <el-tooltip placement="bottom" v-if="basicDataForm.tradingMerchantInput">
                    <el-input class="chooseWidth1" v-model="basicDataForm.tradingMerchantInput" readonly></el-input>
                    <div slot="content">
                        <div v-for="item in basicDataForm.tradingMerchantInput.split(',')" :key="item">{{ item }}<br/></div>
                    </div>
                </el-tooltip>    -->
                <el-button type="primary" style="font-size:12px;"  plain>选择渠道</el-button>
              <!-- <el-form-item 
                label="渠道：" 
                :prop="'memberGrowthRuleAndChannelVOList.'+ index + '.memberGrowthRuleChannelVOList'"
                :rules="{ required: true, validator: checkChannelListSelected, trigger: 'change'}" 
                class="channel-selection"
              >
                <el-checkbox :indeterminate="domain.isIndeterminateHallList" v-model="domain.checkAllHallList" @change="handleCheckAllCinemaHall($event,index)">全部渠道</el-checkbox>
                <el-checkbox-group v-model="domain.memberGrowthRuleChannelVOList" @change="handleCheckedCinemaHallsChange($event,index)">
                  <el-checkbox v-for="(channel,index) in AccessChannels" :label="channel.desc+','+channel.code" :key="index">{{channel.desc}}</el-checkbox>
                </el-checkbox-group> -->
              </el-form-item>
              <div class="label">
                <div class="label-title">
                  APP 
                 <el-button class="label-delete" type="text">删除</el-button>
                </div>
                <ul class="label-content">
                  <li class="label-content-item">
                    <span style="margin-right:8px;">会员等级</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin:8px;">至</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:24px;margin-right:8px;">支付方式</span>
                    <el-select style="margin-right:24px;" v-model="formData.channel" placeholder="请选择支付方式">
                      <el-option v-for="item in channelOptions" :key="item.code" :label="item.desc" :value="item.code"></el-option>
                    </el-select>
                    <span style="margin-right:8px;">订单每满</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">元</span>
                    <span style="margin-left:24px;margin-right:8px;">获取</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;margin-right:24px;">积分</span>
                    <br>
                    <el-checkbox v-model="checked">设置获取积分上线</el-checkbox>
                    <span style="margin-right:8px;">每订单获取上线</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">积分</span>
                    <span style="margin-left:24px;margin-right:8px;">每日上线</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">积分</span>
                    <el-button class="label-content-item-delete" type="text">删除</el-button>
                  </li>
                  <li class="label-content-item">
                    <span style="margin-right:8px;">会员等级</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin:8px;">至</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:24px;margin-right:8px;">支付方式</span>
                    <el-select style="margin-right:24px;" v-model="formData.channel" placeholder="请选择支付方式">
                      <el-option v-for="item in channelOptions" :key="item.code" :label="item.desc" :value="item.code"></el-option>
                    </el-select>
                    <span style="margin-right:8px;">订单每满</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">元</span>
                    <span style="margin-left:24px;margin-right:8px;">获取</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;margin-right:24px;">积分</span>
                    <br>
                    <el-checkbox v-model="checked">设置获取积分上线</el-checkbox>
                    <span style="margin-right:8px;">每订单获取上线</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">积分</span>
                    <span style="margin-left:24px;margin-right:8px;">每日上线</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">积分</span>
                    <el-button class="label-content-item-delete" type="text">删除</el-button>
                  </li>
                  <div class="label-add"><el-button type="text">添加</el-button></div>
                </ul>
              </div>
              <div class="label">
                <div class="label-title">
                  小程序 
                  <el-button class="label-delete" type="text">删除</el-button>
                </div>
                <ul class="label-content">
                  <li class="label-content-item">
                    <span style="margin-right:8px;">会员等级</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin:8px;">至</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:24px;margin-right:8px;">支付方式</span>
                    <el-select style="margin-right:24px;" v-model="formData.channel" placeholder="请选择支付方式">
                      <el-option v-for="item in channelOptions" :key="item.code" :label="item.desc" :value="item.code"></el-option>
                    </el-select>
                    <span style="margin-right:8px;">订单每满</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">元</span>
                    <span style="margin-left:24px;margin-right:8px;">获取</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;margin-right:24px;">积分</span>
                    <br>
                    <el-checkbox v-model="checked">设置获取积分上线</el-checkbox>
                    <span style="margin-right:8px;">每订单获取上线</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">积分</span>
                    <span style="margin-left:24px;margin-right:8px;">每日上线</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">积分</span>
                    <el-button class="label-content-item-delete" type="text">删除</el-button>
                  </li>
                  <div class="label-add"><el-button type="text">添加</el-button></div>
                </ul>
              </div>
              <div class="label">
                <div class="label-title">
                  零售POS 
                  <el-button class="label-delete" type="text">删除</el-button>
                </div>
                <ul class="label-content">
                  <li class="label-content-item">
                    <span style="margin-right:8px;">会员等级</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin:8px;">至</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:24px;margin-right:8px;">支付方式</span>
                    <el-select style="margin-right:24px;" v-model="formData.channel" placeholder="请选择支付方式">
                      <el-option v-for="item in channelOptions" :key="item.code" :label="item.desc" :value="item.code"></el-option>
                    </el-select>
                    <span style="margin-right:8px;">订单每满</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">元</span>
                    <span style="margin-left:24px;margin-right:8px;">获取</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;margin-right:24px;">积分</span>
                    <br>
                    <el-checkbox v-model="checked">设置获取积分上线</el-checkbox>
                    <span style="margin-right:8px;">每订单获取上线</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">积分</span>
                    <span style="margin-left:24px;margin-right:8px;">每日上线</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">积分</span>
                    <el-button class="label-content-item-delete" type="text">删除</el-button>
                  </li>
                  <div class="label-add"><el-button type="text">添加</el-button></div>
                </ul>
              </div>
            </div>
          </el-collapse-item>
          <!-- 购买卖品 -->
          <el-collapse-item title="购买卖品" name="1" class="get-rules">
            <div class="pay-ticket-content">
              <el-form-item label="渠道：" prop="channel" :rules="[{ required: true, message: '请选择渠道', trigger: 'blur' }]">
                <!-- <el-tooltip placement="bottom" v-if="basicDataForm.tradingMerchantInput">
                    <el-input class="chooseWidth1" v-model="basicDataForm.tradingMerchantInput" readonly></el-input>
                    <div slot="content">
                        <div v-for="item in basicDataForm.tradingMerchantInput.split(',')" :key="item">{{ item }}<br/></div>
                    </div>
                </el-tooltip>    -->
                <el-button type="primary" style="font-size:12px;" plain>选择渠道</el-button>
              </el-form-item>
              <div class="label">
                <div class="label-title">
                  APP
                  <el-button class="label-delete" type="text">删除</el-button>
                </div>
                <ul class="label-content">
                  <li class="label-content-item">
                    <span style="margin-right:8px;">会员等级</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin:8px;">至</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:24px;margin-right:8px;">支付方式</span>
                    <el-select style="margin-right:24px;" v-model="formData.channel" placeholder="请选择支付方式">
                      <el-option v-for="item in channelOptions" :key="item.code" :label="item.desc" :value="item.code"></el-option>
                    </el-select>
                    <span style="margin-right:8px;">订单每满</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">元</span>
                    <span style="margin-left:24px;margin-right:8px;">获取</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;margin-right:24px;">积分</span>
                    <br>
                    <el-checkbox v-model="checked">设置获取积分上线</el-checkbox>
                    <span style="margin-right:8px;">每订单获取上线</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">积分</span>
                    <span style="margin-left:24px;margin-right:8px;">每日上线</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">积分</span>
                    <el-button class="label-content-item-delete" type="text">删除</el-button>
                  </li>
                  <li class="label-content-item">
                    <span style="margin-right:8px;">会员等级</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin:8px;">至</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:24px;margin-right:8px;">支付方式</span>
                    <el-select style="margin-right:24px;" v-model="formData.channel" placeholder="请选择支付方式">
                      <el-option v-for="item in channelOptions" :key="item.code" :label="item.desc" :value="item.code"></el-option>
                    </el-select>
                    <span style="margin-right:8px;">订单每满</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">元</span>
                    <span style="margin-left:24px;margin-right:8px;">获取</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;margin-right:24px;">积分</span>
                    <br>
                    <el-checkbox v-model="checked">设置获取积分上线</el-checkbox>
                    <span style="margin-right:8px;">每订单获取上线</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">积分</span>
                    <span style="margin-left:24px;margin-right:8px;">每日上线</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">积分</span>
                    <el-button class="label-content-item-delete" type="text">删除</el-button>
                  </li>
                  <div class="label-add"><el-button type="text">添加</el-button></div>
                </ul>
              </div>
              <div class="label">
                <div class="label-title">
                  小程序
                  <el-button class="label-delete" type="text">删除</el-button>
                </div>
                <ul class="label-content">
                  <li class="label-content-item">
                    <span style="margin-right:8px;">会员等级</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin:8px;">至</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:24px;margin-right:8px;">支付方式</span>
                    <el-select style="margin-right:24px;" v-model="formData.channel" placeholder="请选择支付方式">
                      <el-option v-for="item in channelOptions" :key="item.code" :label="item.desc" :value="item.code"></el-option>
                    </el-select>
                    <span style="margin-right:8px;">订单每满</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">元</span>
                    <span style="margin-left:24px;margin-right:8px;">获取</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;margin-right:24px;">积分</span>
                    <br>
                    <el-checkbox v-model="checked">设置获取积分上线</el-checkbox>
                    <span style="margin-right:8px;">每订单获取上线</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">积分</span>
                    <span style="margin-left:24px;margin-right:8px;">每日上线</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">积分</span>
                    <el-button class="label-content-item-delete" type="text">删除</el-button>
                  </li>
                  <div class="label-add"><el-button type="text">添加</el-button></div>
                </ul>
              </div>
              <div class="label">
                <div class="label-title">
                  零售POS
                  <el-button class="label-delete" type="text">删除</el-button>
                </div>
                <ul class="label-content">
                  <li class="label-content-item">
                    <span style="margin-right:8px;">会员等级</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin:8px;">至</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:24px;margin-right:8px;">支付方式</span>
                    <el-select style="margin-right:24px;" v-model="formData.channel" placeholder="请选择支付方式">
                      <el-option v-for="item in channelOptions" :key="item.code" :label="item.desc" :value="item.code"></el-option>
                    </el-select>
                    <span style="margin-right:8px;">订单每满</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">元</span>
                    <span style="margin-left:24px;margin-right:8px;">获取</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;margin-right:24px;">积分</span>
                    <br>
                    <el-checkbox v-model="checked">设置获取积分上线</el-checkbox>
                    <span style="margin-right:8px;">每订单获取上线</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">积分</span>
                    <span style="margin-left:24px;margin-right:8px;">每日上线</span>
                    <el-input  v-model="formData.validity" @blur="()=>{formData.tradeChannels = formData.tradeChannels.trim()}" placeholder="请输入年" clearable></el-input>
                    <span style="margin-left:8px;">积分</span>
                    <el-button class="label-content-item-delete" type="text">删除</el-button>
                  </li>
                  <div class="label-add"><el-button type="text">添加</el-button></div>
                </ul>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <!-- 底部 -->
        <div class="footer-btn-wrap">
          <el-button type="primary" @click="submitForm('ruleForm')" class="_el-btn-custom _member-add-edit-save-btn">保存</el-button>
          <el-button @click="handleCancle" class="_el-btn-custom">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "EditMemberIntegralRules",
  data() {
    return {
      formData:{
        validity:"3",//积分有效期
        channel:"",//渠道
      },
      checked:"",
      activeNames: ["0", "1"],
      //渠道选项
      channelOptions:[
        // { code: "", desc: "全部" },
        // { code: "积分获取", desc: "积分获取" },
        // { code: "积分兑换", desc: "积分兑换" },
        // { code: "积分冲销", desc: "积分冲销" },
        // { code: "手动调整积分", desc: "手动调整积分" },
        // { code: "退积分", desc: "退积分" },
      ],
    };
  },
  methods:{
    //取消按钮
    handleCancle(){
      this.$router.push({ path: "/member/memberIntegral/rules" });
    },
    //保存按钮
    submitForm(data){

    },
  }
};
</script>
<style lang="scss" scoped>
// 编辑会员积分规则样式
._edit-member-integral-rules {
  padding:20px;
  
  .header{
    width:100%;
    border-bottom:1px solid #bcbcbc;
    color:#000;
    font-weight:bolder;
  }
  .bodyer{
    .form-data-wrap {
      .period-validity{
        margin-left: 22px;
        height: 50px;
      }
      ._edit-member-integral-content{
        .get-rules{

        }
      }
      .label{
        .label-title{
          font-weight: bolder;
          .label-delete{
            float: right;
            font-weight: normal;
            color: #3B74FF;
            font-size: 12px;
          }
        }
        .label-content{
          padding: 20px;
          margin: 10px;
          .label-content-item{
            background-color: #F5F7FA ;
            line-height: 50px;
            padding: 10px 20px;
            margin-bottom: 10px;
            .label-content-item-delete{
              float: right;
              font-weight: normal;
              color: #3B74FF;
              font-size: 12px;
            }
          }
          .el-input {
            width: 80px;
          }

        }
        .label-add{
          padding: 10px;
          width: 100%;
          font-size: 12px;
          text-align: center;
          color: #3B74FF;
          background-color: #F5F7FA;
          .el-button {
            font-size: 12px;
          }
        }
      }
     
    }
    .footer-btn-wrap{
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
