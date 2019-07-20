<template>
  <div class="_edit-membership-level">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="medium" label-width="120px" label-position="right">
      <el-form-item label="等级定级周期：" prop="rankCycle" class="_edit-membership-level-head">
        <div class="level-cycle">
          <el-input v-model="ruleForm.rankCycle" placeholder="请输入"></el-input>
          <span class="unit-desc">个月</span>
          <div class="cycle-tips">注：每日1点进行会员升级调整，定级周期内最后一月月末1点进行会员降级调整，修改会员等级后，新等级将在次日1点生效。</div>
        </div>
      </el-form-item>

      <!-- 内容区 -->
      <el-collapse v-model="activeNames" class="_edit-membership-level-content">
        <!-- 会员等级 -->
        <el-collapse-item title="会员等级" name="0">
          <div class="member-level-title">
            <div class="level-explain">等级编号数字越大级别越高</div>
            <div class="add-btn" @click="handleAddLevel"><i class="el-icon-circle-plus-outline"></i> 添加会员等级</div>
          </div>
          <div class="_m-member-table-custom _membership-level-table">
            <el-table :data="ruleForm.memberLevelRuleVOList" stripe border style="width: 100%">
              <el-table-column prop="levelNo" label="会员等级编号" min-width="100">
                <template slot-scope="scope">
                  <span class="index-wrap">{{scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <el-table-column label="会员等级名称" min-width="120">
                <template slot-scope="scope">
                  <el-form-item :prop="'memberLevelRuleVOList.'+ scope.$index" :rules="rules.levelName"
                    class="_custom-el-item">
                    <el-input v-model="scope.row.levelName" class="level-name"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="保级升级规则" min-width="550">
                <template slot-scope="scope">
                  <span v-if="scope.$index + 1 == '1'" class="ordinary">
                    当前等级为最低，无法添加升级规则
                  </span>
                  <el-form-item v-else :prop="'memberLevelRuleVOList.'+ scope.$index" :rules="rules.growth"
                    class="_custom-el-item">
                    <span class="no-ordinary">
                      升级标准：定级周期内成长值达到
                      <el-input v-model="scope.row.levelupGrowth" class="levelup-growth"></el-input>点;
                      保级标准：定级周期内成长值达到
                      <el-input v-model="scope.row.saveGrowth" class="save-growth"></el-input>点
                    </span>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="50" fixed="right">
                <template slot-scope="scope">
                  <el-button @click="handleDelete(scope)" v-if="scope.$index != 0" type="text" size="small"
                    class="delete-btn">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <!-- 基础信息 -->
        <el-collapse-item title="基础信息" name="1" class="basic-info">
          <el-form-item label="成长值名称：" prop="growthName">
            <el-input v-model="ruleForm.growthName" placeholder="请输入" class="growth-name"></el-input>
          </el-form-item>
        </el-collapse-item>
        <!-- 成长值获取规则 -->
        <el-collapse-item title="成长值获取规则" name="2" class="get-rules">
          <div class="growth-value-options" v-for="(domain, index) in ruleForm.memberGrowthRuleAndChannelVOList"
            :key="index">
            <span class="remove-growth-value" v-if="ruleForm.memberGrowthRuleAndChannelVOList.length > 1"
              @click="removeGrowthValue(index,domain)">
              <i class="iconfont icon-neiye-danchuangquxiao" style="fontSize:12px" />
            </span>
            <el-form-item label="获取渠道："
              :prop="'memberGrowthRuleAndChannelVOList.'+ index + '.memberGrowthRuleChannelVOList'" :rules="{
                          required: true, validator: checkChannelListSelected, trigger: 'change'
                        }" class="channel-selection">
              <el-checkbox :indeterminate="domain.isIndeterminateHallList" v-model="domain.checkAllHallList"
                @change="handleCheckAllCinemaHall($event,index)">全部渠道</el-checkbox>
              <el-checkbox-group v-model="domain.memberGrowthRuleChannelVOList"
                @change="handleCheckedCinemaHallsChange($event,index)">
                <el-checkbox v-for="(channel,index) in AccessChannels" :label="channel.desc+','+channel.code"
                  :key="index">{{channel.desc}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="获取规则：" :rules="{
                          required: true, message: ' ', trigger: 'change'
                        }" class="rules-selection">
              <!-- <div> -->
              <div class="rules-item" v-for="(item, ruleIndex) of domain.memberGrowthRuleVOList" :key="ruleIndex">
                <div class="rules-title" :style="`visibility:${ruleIndex==0?'visible':'hidden'}`">{{item.getType
                  == '0'?'消费类：':'服务类：'}}</div>
                <!-- 购买影票 -->
                <div class="buy-ticket">
                  <el-form-item :prop="'memberGrowthRuleAndChannelVOList.'+ index + '.memberGrowthRuleVOList'" :rules="{
                          required: true, validator: checkeIsChecked, trigger: 'change'
                        }" style="width:90px">
                    <el-checkbox v-model="item.checked">{{item.goodsType == '0'?'购买影票':'购买卖品'}}</el-checkbox>
                  </el-form-item>
                  <el-select v-model="item.goodsWay" placeholder="请选择" :disabled="!item.checked">
                    <el-option v-for="item in buyMethods" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <span class="_member-level-rules-desc">每消费1{{item.goodsWay == '0'?'元':'次'}}，获取</span>
                  <el-form-item
                    :prop="'memberGrowthRuleAndChannelVOList.'+ index + '.memberGrowthRuleVOList.'+ ruleIndex" :rules="{
                          required: true, validator: checkeveryFullGrowth, trigger: 'blur'
                        }">
                    <el-input v-model="item.everyFullGrowth" :disabled="!item.checked" placeholder="请输入"
                      class="growth-num"></el-input>
                  </el-form-item>
                  <span class="_member-level-rules-desc">成长值，每天上限</span>
                  <el-form-item
                    :prop="'memberGrowthRuleAndChannelVOList.'+ index + '.memberGrowthRuleVOList.'+ ruleIndex" :rules="{
                          required: false, validator: checkeveryDayUpper, trigger: 'blur'
                        }">
                    <el-input v-model="item.everyDayUpper" :disabled="!item.checked" placeholder="请输入"
                      class="growth-num"></el-input>
                  </el-form-item>
                  <span class="_member-level-rules-desc">成长值</span>
                </div>
              </div>
              <!-- </div> -->
            </el-form-item>
          </div>
          <span class="add-growth-value-btn" @click="handleAddGrowthValue"><i class="el-icon-circle-plus-outline"></i>
            添加规则</span>
        </el-collapse-item>
      </el-collapse>
      <!-- 按钮区域 -->
      <div class="footer-btn-wrap">
        <el-button type="primary" @click="submitForm('ruleForm')" class="_el-btn-custom _member-add-edit-save-btn">保存
        </el-button>
        <el-button @click="handleCancle" class="_el-btn-custom">取消</el-button>
      </div>
    </el-form>
    <fixStepTool :stepData="stepData.stepList" class="_fixsteptool-member"></fixStepTool>
    <!--  权益相同时的dialog -->
    <el-dialog title="" class="__equity-dialog" :visible.sync="sameCategoryDialog">
      <div style="text-align:center;margin:40px 0;">
        {{`此成长值获取规则内包含同为“${sameChannel}”的获取渠道`}}<br /><br />
        请仔细检查，避免选择重复的获取渠道
      </div>
      <el-button slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="sameCategoryDialog = false"
          class="_el-btn-custom  _member-add-edit-save-btn">确 定</el-button>
        <el-button size="medium" @click="sameCategoryDialog = false" class="_el-btn-custom">取 消</el-button>
      </el-button>
    </el-dialog>
    <!-- 删除的dialog -->
    <el-dialog title="" :visible.sync="deleteDialog" width="320px" :show-close="false"
      class="_member-tip-dialog-custom-style">
      <i class="iconfont icon-danchuang-tishi _member-tip-dialog-icon"></i>
      <span class="_member-tip-dialog-desc">
        是否删除"{{deleteInfo.levelName}}"等级？<br />删除操作不可恢复，该等级会员将会降级，相关权益将被删除，请谨慎操作
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSureDelete" class="_el-btn-custom _member-add-edit-save-btn">确定
        </el-button>
        <el-button @click="deleteDialog = false" class="_el-btn-custom _member-add-edit-save-btn">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import FixStepTool from "../../../components/fix-step-tool/fix-step-tool";
import fixStepMixin from "../../../mixins/CRM/fixStepTool.js";
export default {
  name: "EditMembershipLevel",
  data() {
    // 输入限制正则
    var testName = /^[\u4e00-\u9fa50-9a-zA-Z\s\~\`\·\！\!\@\#\￥\%\^\……\&\*\（\）\——\-\+\=\【\】\{\}\|\、\\\：\；\:\;\“\”\‘\’\'\"\[\]\{\}\<\,\>\.\《\》\，\。\？\、\?\/\(\)\_]+$/;

    // 验证会员等级名称
    var checkLevelName = (rule, value, callback) => {
      // 校验会员等级名称是否重复
      function isRepeat(val, arr) {
        var repeatArr = [];
        for (var i = 0; i < arr.length; i++) {
          if (val == arr[i].levelName) {
            repeatArr.push(arr[i].levelName);
          }
        }
        if (repeatArr.length > 1) {
          return true;
        } else {
          return false;
        }
      }
      if (!value.levelName.toString().trim()) {
        callback(new Error("请输入会员等级名称"));
      } else if (value.levelName.toString().trim().length * 1 > 20) {
        callback(new Error("长度不可超过20个字符"));
      } else if (!testName.test(value.levelName.toString().trim())) {
        callback(new Error("输入的名称含有不合法字符"));
      } else if (
        isRepeat(
          value.levelName.toString().trim(),
          this.ruleForm.memberLevelRuleVOList
        )
      ) {
        callback(new Error("等级名称不可重复"));
      } else {
        this.ruleForm[rule.field] = value.levelName.toString().trim();
        callback();
      }
    };
    // 校验升级，保级标准
    var checkGrowth = (rule, value, callback) => {
      // 校验不同级别间成长值范围
      function gradeComparison(val, arr) {
        for (var i = 0; i < arr.length; i++) {
          if (val.levelNo == arr[i].levelNo) {
            // 有低一级保级标准
            if (arr[i - 1].saveGrowth != "") {
              if (
                val.levelupGrowth.toString().trim() * 1 <=
                arr[i - 1].saveGrowth
              ) {
                return "1"; //升级标准小于低级的保级标准
              } else if (
                val.levelupGrowth.toString().trim() * 1 <=
                arr[i - 1].levelupGrowth
              ) {
                return "2"; //升级标准小于低级的升级标准
              }
            }
            // 没有低一级保级标准
            if (arr[i - 1].saveGrowth == "") {
              if (
                val.levelupGrowth.toString().trim() * 1 <=
                arr[i - 1].levelupGrowth
              ) {
                return "2"; //升级标准小于低级的升级标准
              }
            }
            // 有高一级保级标准
            if (arr[i + 1] && arr[i + 1].saveGrowth != "") {
              if (
                val.levelupGrowth.toString().trim() * 1 >=
                arr[i + 1].saveGrowth
              ) {
                return "3"; //升级标准大于高级的保级标准
              }
              if (
                arr[i + 1].saveGrowth &&
                val.saveGrowth.toString().trim() * 1 >= arr[i + 1].saveGrowth
              ) {
                return "5"; //保级标准大于高级的保级标准
              }
            }
            // 有高一级升级标准
            if (arr[i + 1] && arr[i + 1].levelupGrowth != "") {
              if (
                val.levelupGrowth.toString().trim() * 1 >=
                arr[i + 1].levelupGrowth
              ) {
                return "4"; //升级标准大于高级的升级标准
              }
              if (
                val.saveGrowth.toString().trim() * 1 >=
                arr[i + 1].levelupGrowth
              ) {
                return "6"; //保级标准大于高级的升级标准
              }
            }
          }
        }
      }
      if (value.levelupGrowth == null) {
        value.levelupGrowth = "";
      }
      if (value.saveGrowth == null) {
        value.saveGrowth = "";
      }

      if (
        value.levelupGrowth.toString().trim() &&
        value.saveGrowth.toString().trim()
      ) {
        if (
          !/^[1-9]\d*$/.test(value.levelupGrowth.toString().replace(/\s/g, ""))
        ) {
          callback(new Error("保级标准必须为正整数"));
        }
        if (
          gradeComparison(value, this.ruleForm.memberLevelRuleVOList) == "1"
        ) {
          callback(new Error("升级标准必须大于低等级的保级标准"));
        }
        if (
          gradeComparison(value, this.ruleForm.memberLevelRuleVOList) == "2"
        ) {
          callback(new Error("升级标准必须大于低等级的升级标准"));
        }
        if (
          gradeComparison(value, this.ruleForm.memberLevelRuleVOList) == "3"
        ) {
          callback(new Error("升级标准必须小于高等级的保级标准"));
        }
        if (
          gradeComparison(value, this.ruleForm.memberLevelRuleVOList) == "4"
        ) {
          callback(new Error("升级标准必须小于高等级的升级标准"));
        }
        if (
          gradeComparison(value, this.ruleForm.memberLevelRuleVOList) == "5"
        ) {
          callback(new Error("保级标准必须小于高等级的保级标准"));
        }
        if (
          gradeComparison(value, this.ruleForm.memberLevelRuleVOList) == "6"
        ) {
          callback(new Error("保级标准必须小于高等级的升级标准"));
        }
        if (
          value.levelupGrowth.toString().trim() * 1 >=
          value.saveGrowth.toString().trim() * 1
        ) {
          callback(new Error("升级标准必须小于保级标准"));
        } else {
          callback();
        }
      } else {
        if (!value.levelupGrowth.toString().trim()) {
          callback(new Error("升级标准必填，保级标准选填"));
        }
        if (
          !/^[1-9]\d*$/.test(value.levelupGrowth.toString().replace(/\s/g, ""))
        ) {
          callback(new Error("升级标准必须为正整数"));
        }
        if (
          gradeComparison(value, this.ruleForm.memberLevelRuleVOList) == "1"
        ) {
          callback(new Error("升级标准必须大于低等级的保级标准"));
        }
        if (
          gradeComparison(value, this.ruleForm.memberLevelRuleVOList) == "2"
        ) {
          callback(new Error("升级标准必须大于低等级的升级标准"));
        }
        if (
          gradeComparison(value, this.ruleForm.memberLevelRuleVOList) == "3"
        ) {
          callback(new Error("升级标准必须小于高等级的保级标准"));
        }
        if (
          gradeComparison(value, this.ruleForm.memberLevelRuleVOList) == "4"
        ) {
          callback(new Error("升级标准必须小于高等级的升级标准"));
        }
        if (
          gradeComparison(value, this.ruleForm.memberLevelRuleVOList) == "5"
        ) {
          callback(new Error("保级标准必须小于高等级的保级标准"));
        }
        if (
          gradeComparison(value, this.ruleForm.memberLevelRuleVOList) == "6"
        ) {
          callback(new Error("保级标准必须小于高等级的升级标准"));
        } else {
          callback();
        }
      }
    };

    // 验证成长值名称
    var checkGrowthName = (rule, value, callback) => {
      if (!value.toString().trim()) {
        callback(new Error("请输入成长值名称"));
      } else if (!testName.test(value.toString().trim())) {
        callback(new Error("输入的名称含有不合法字符"));
      } else {
        this.ruleForm[rule.field] = value.toString().trim();
        callback();
      }
    };
    // 验证等级定级周期
    var checkRankCycle = (rule, value, callback) => {
      if (value.toString().replace(/\s/g, "") == "") {
        callback(new Error("请输入数字"));
      }
      if (!/^[1-9]\d*$/.test(value.toString().replace(/\s/g, ""))) {
        callback(new Error("请输入正整数"));
      } else {
        callback();
      }
    };

    return {
      deleteDialog: false, //删除的dialog
      deleteInfo: "", //将要删除等级的信息
      sameCategoryDialog: false, // 相同的可售渠道的dialog显示/隐藏
      sameChannel: "", //相同的可售渠道
      id: "",
      AccessChannels: [],
      buyMethods: [
        {
          value: "0",
          label: "按金额"
        },
        {
          value: "1",
          label: "按次数"
        }
      ],
      stepData: {
        stepEl: ".el-collapse-item",
        stepList: [
          {
            name: "会员等级",
            isactive: false
          },
          {
            name: "基础信息",
            isactive: false
          },
          {
            name: "成长值获取规则",
            isactive: false
          }
        ]
      },
      ruleForm: {
        tenantId: this.$store.state.loginUser.consumerId,
        rankCycle: "",
        memberLevelRuleVOList: [
          {
            levelNo: "1",
            levelName: "普通会员",
            levelupGrowth: "0",
            saveGrowth: "0"
          }
        ],
        growthName: "",
        // 会员成长值规则和渠道
        memberGrowthRuleAndChannelVOList: [
          {
            // 获取渠道列表
            memberGrowthRuleChannelVOList: [
              // {
              //   channelName: "",
              //   channelNo: ""
              // }
            ],
            // 成长值规则列表
            memberGrowthRuleVOList: [
              {
                everyDayUpper: "",
                everyFullGrowth: "",
                getType: "0",
                goodsType: "0",
                goodsWay: "0",
                checked: false
              },
              {
                everyDayUpper: "",
                everyFullGrowth: "",
                getType: "0",
                goodsType: "1",
                goodsWay: "0",
                checked: false
              }
            ],
            isIndeterminateHallList: false,
            checkAllHallList: false
          }
        ]
      },
      rules: {
        levelName: [
          { required: true, validator: checkLevelName, trigger: "blur" }
        ],
        growth: [{ required: false, validator: checkGrowth, trigger: "blur" }],
        rankCycle: [
          { required: true, validator: checkRankCycle, trigger: "blur" }
        ],
        growthName: [
          { max: 20, message: "长度不可超过20个字符", trigger: "blur" },
          { required: true, validator: checkGrowthName, trigger: "blur" }
        ]
      },
      activeNames: ["0", "1", "2"]
    };
  },
  mounted() {
    this.$crmList
      .channelList({ tenantId: this.$store.state.loginUser.consumerId })
      .then(res => {
        this.AccessChannels = res;
        if (this.$route.query.id) {
          // 请求详情数据
          this.$crmList
            .getLevelDetail({
              tenantId: this.$store.state.loginUser.consumerId
            })
            .then(res => {
              // this.ruleForm = res;
              this.id = res.id;
              this.$set(this, "ruleForm", this.initRuleformData(res));
              // }
            })
            .catch(err => {
              console.log(err);
            });
        }
      })
      .catch(err => {
        console.log(err);
        if (this.$route.query.id) {
          // 请求详情数据
          this.$crmList
            .getLevelDetail({
              tenantId: this.$store.state.loginUser.consumerId
            })
            .then(res => {
              // this.ruleForm = res;
              this.id = res.id;
              this.$set(this, "ruleForm", this.initRuleformData(res));
              // }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
  },
  mixins: [fixStepMixin],
  components: {
    fixStepTool: FixStepTool
  },
  methods: {
    // 初始化获取渠道
    initRuleformData(copyRes) {
      var data = copyRes;
      var wrapArr = data.memberGrowthRuleAndChannelVOList;
      if (wrapArr == null || wrapArr.length == 0) {
        wrapArr = [
          {
            // 获取渠道列表
            memberGrowthRuleChannelVOList: this.AccessChannels,
            // 成长值规则列表
            memberGrowthRuleVOList: [
              {
                everyDayUpper: "",
                everyFullGrowth: "",
                getType: "0",
                goodsType: "0",
                goodsWay: "0",
                checked: false
              },
              {
                everyDayUpper: "",
                everyFullGrowth: "",
                getType: "0",
                goodsType: "1",
                goodsWay: "0",
                checked: false
              }
            ],
            isIndeterminateHallList: false,
            checkAllHallList: false
          }
        ];
      }
      for (var i = 0; i < wrapArr.length; i++) {
        // 初始化购买类型的选中状态 及 所选项
        if (wrapArr[i].memberGrowthRuleVOList.length == 0) {
          wrapArr[i].memberGrowthRuleVOList = [
            {
              everyDayUpper: "",
              everyFullGrowth: "",
              getType: "0",
              goodsType: "0",
              goodsWay: "0",
              checked: false
            },
            {
              everyDayUpper: "",
              everyFullGrowth: "",
              getType: "0",
              goodsType: "1",
              goodsWay: "0",
              checked: false
            }
          ];
        }
        if (wrapArr[i].memberGrowthRuleVOList.length == 1) {
          for (var j = 0; j < wrapArr[i].memberGrowthRuleVOList.length; j++) {
            wrapArr[i].memberGrowthRuleVOList[j].checked = true;
            if (
              wrapArr[i].memberGrowthRuleVOList[j].goodsType == "0" &&
              wrapArr[i].memberGrowthRuleVOList.length == 1
            ) {
              wrapArr[i].memberGrowthRuleVOList.push({
                everyDayUpper: "",
                everyFullGrowth: "",
                getType: "0",
                goodsType: "1",
                goodsWay: "0",
                checked: false
              });
              this.$set(wrapArr[i].memberGrowthRuleVOList[0], "checked", true);
            }
            if (
              wrapArr[i].memberGrowthRuleVOList[j].goodsType == "1" &&
              wrapArr[i].memberGrowthRuleVOList.length == 1
            ) {
              wrapArr[i].memberGrowthRuleVOList.unshift({
                everyDayUpper: "",
                everyFullGrowth: "",
                getType: "0",
                goodsType: "1",
                goodsWay: "0",
                checked: false
              });
              this.$set(wrapArr[i].memberGrowthRuleVOList[1], "checked", true);
            }
          }
        }
        if (wrapArr[i].memberGrowthRuleVOList.length == 2) {
          for (var j = 0; j < wrapArr[i].memberGrowthRuleVOList.length; j++) {
            if (wrapArr[i].memberGrowthRuleVOList[j].everyFullGrowth) {
              this.$set(wrapArr[i].memberGrowthRuleVOList[j], "checked", true);
            } else {
              this.$set(wrapArr[i].memberGrowthRuleVOList[j], "checked", false);
            }
          }
        }
        // 控制渠道的全选按钮的状态
        var checkedCount = wrapArr[i].memberGrowthRuleChannelVOList.length;
        wrapArr[i].checkAllHallList =
          checkedCount === this.AccessChannels.length;
        wrapArr[i].isIndeterminateHallList =
          checkedCount > 0 && checkedCount < this.AccessChannels.length;
        // 回显选中的渠道
        wrapArr[i].memberGrowthRuleChannelVOList = wrapArr[
          i
        ].memberGrowthRuleChannelVOList.map(item => {
          return item.channelName + "," + item.channelNo;
        });
      }
      return data;
    },
    // 校验获取渠道
    checkChannelListSelected(rule, value, callback) {
      if (!value.length) {
        callback(new Error("请选择获取渠道"));
      } else {
        callback();
      }
    },
    // 校验获取规则
    checkeIsChecked(rule, value, callback) {
      if (!value[0].checked && !value[1].checked) {
        callback(new Error("至少选择一条规则"));
      } else {
        callback();
      }
    },
    // 校验获取成长值
    checkeveryFullGrowth(rule, value, callback) {
      if (value.checked) {
        if (value.everyFullGrowth == null) {
          value.everyFullGrowth = "";
        }
        if (value.everyFullGrowth.toString().replace(/\s/g, "") == "") {
          callback(new Error("请填写获取成长值"));
        }
        if (
          !/^[1-9]\d*$/.test(
            value.everyFullGrowth.toString().replace(/\s/g, "")
          )
        ) {
          callback(new Error("请输入正整数"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 校验成长值上限
    checkeveryDayUpper(rule, value, callback) {
      if (value.checked) {
        if (value.everyDayUpper == null) {
          value.everyDayUpper = "";
        }
        if (value.everyDayUpper.toString().replace(/\s/g, "") == "") {
          callback();
        }
        if (
          !/^[1-9]\d*$/.test(value.everyDayUpper.toString().replace(/\s/g, ""))
        ) {
          callback(new Error("请输入正整数"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 添加会员等级
    handleAddLevel() {
      var length = this.ruleForm.memberLevelRuleVOList.length;
      this.ruleForm.memberLevelRuleVOList.push({
        levelNo: length,
        levelName: "",
        levelupGrowth: "",
        saveGrowth: ""
      });
      for (var i = 0; i < this.ruleForm.memberLevelRuleVOList.length; i++) {
        if (this.ruleForm.memberLevelRuleVOList.length >= 1) {
          this.ruleForm.memberLevelRuleVOList[0].levelupGrowth = 0;
          this.ruleForm.memberLevelRuleVOList[0].saveGrowth = 0;
        }
        this.ruleForm.memberLevelRuleVOList[i].levelNo = i + 1;
      }
    },
    // 删除会员等级
    handleDelete(scope) {
      this.deleteDialog = true;
      this.deleteInfo = scope.row;

      // this.$confirm(
      //   `是否删除"${
      //     scope.row.levelName
      //   }"等级？<br/>删除操作不可恢复，该等级会员将会降级，<br/>相关权益将被删除，请谨慎操作`,
      //   "提示",
      //   {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning",
      //     dangerouslyUseHTMLString: true
      //   }
      // )
      //   .then(() => {
      //     this.ruleForm.memberLevelRuleVOList.splice(scope.$index, 1);
      //   })
      //   .catch(() => {
      //     return false;
      //   });
    },
    // 确认删除等级
    handleSureDelete() {
      this.deleteDialog = false;
      this.ruleForm.memberLevelRuleVOList.splice(this.deleteInfo.$index, 1);
    },
    // 点击全选按钮
    handleCheckAllCinemaHall(val, index) {
      this.ruleForm.memberGrowthRuleAndChannelVOList[
        index
      ].memberGrowthRuleChannelVOList = val
        ? this.AccessChannels.map(item => {
            return item.desc + "," + item.code;
          })
        : [];
      this.ruleForm.memberGrowthRuleAndChannelVOList[
        index
      ].isIndeterminateHallList = false;
    },
    // 单独点击多选框
    handleCheckedCinemaHallsChange(value, index) {
      let checkedCount = value.length;
      this.ruleForm.memberGrowthRuleAndChannelVOList[index].checkAllHallList =
        checkedCount === this.AccessChannels.length;
      this.ruleForm.memberGrowthRuleAndChannelVOList[
        index
      ].isIndeterminateHallList =
        checkedCount > 0 && checkedCount < this.AccessChannels.length;
    },
    // 添加规则
    handleAddGrowthValue() {
      this.ruleForm.memberGrowthRuleAndChannelVOList.push({
        // 获取渠道列表
        memberGrowthRuleChannelVOList: [
          // {
          //   channelName: "",
          //   channelNo: ""
          // }
        ],
        // 成长值规则列表
        memberGrowthRuleVOList: [
          {
            everyDayUpper: "",
            everyFullGrowth: "",
            getType: "0",
            goodsType: "0",
            goodsWay: "0",
            checked: true
          },
          {
            everyDayUpper: "",
            everyFullGrowth: "",
            getType: "0",
            goodsType: "1",
            goodsWay: "0",
            checked: true
          }
        ],
        isIndeterminateHallList: false,
        checkAllHallList: false
      });
    },
    // 删除成长值
    removeGrowthValue(index, domain) {
      this.ruleForm.memberGrowthRuleAndChannelVOList.splice(index, 1);
    },
    // 处理获取渠道
    formatChannel(data) {
      var data = JSON.parse(JSON.stringify(data));
      var wrapArr = data.memberGrowthRuleAndChannelVOList;
      // 查看可售渠道是否有重叠
      // 拼接所有数组
      var totalChannel = [];
      var temp = []; //一个新的临时数组
      var repeatArr = []; // 重复的数组
      var sameArr = []; //最终的相同渠道名的数组
      for (var i = 0; i < wrapArr.length; i++) {
        totalChannel = totalChannel.concat(
          wrapArr[i].memberGrowthRuleChannelVOList
        );
      }
      // 数组去重
      for (var i = 0; i < totalChannel.length; i++) {
        if (temp.indexOf(totalChannel[i]) == -1) {
          temp.push(totalChannel[i]);
        } else if (
          temp.indexOf(totalChannel[i]) != -1 &&
          repeatArr.indexOf(totalChannel[i]) == -1
        ) {
          repeatArr.push(totalChannel[i]);
        }
      }
      // 提出重复数组中的渠道名称
      if (repeatArr.length > 0) {
        for (var i = 0; i < repeatArr.length; i++) {
          sameArr.push(repeatArr[i].split(",")[0]);
        }
        this.sameChannel = sameArr.join(",");
        this.sameCategoryDialog = true;
        return false;
      } else {
        for (var i = 0; i < wrapArr.length; i++) {
          wrapArr[i].memberGrowthRuleChannelVOList = wrapArr[
            i
          ].memberGrowthRuleChannelVOList.map(item => {
            return {
              channelName: item.split(",")[0],
              channelNo: item.split(",")[1]
            };
          });
        }
        for (var k = 0; k < wrapArr.length; k++) {
          var innerArr = wrapArr[k].memberGrowthRuleVOList;
          for (var j = 0; j < innerArr.length; j++) {
            if (!innerArr[j].checked) {
              innerArr[j].everyDayUpper = "";
              innerArr[j].everyFullGrowth = "";
            }
          }
        }
        // 处理等级id
        for (var i = 0; i < data.memberLevelRuleVOList.length; i++) {
          if (data.memberLevelRuleVOList.length >= 1) {
            data.memberLevelRuleVOList[0].levelupGrowth = 0;
            data.memberLevelRuleVOList[0].saveGrowth = 0;
          }
          data.memberLevelRuleVOList[i].levelNo = i + 1;
        }
        this.$crmList
          .editMemberLevel(data)
          .then(data => {
            if (data) {
              this.$message.success("保存成功");
              this.$router.push({ path: "/member/membershipLevel/detail" });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.formatChannel(this.ruleForm);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 取消提交
    handleCancle() {
      this.$router.push({ path: "/member/membershipLevel/detail" });
    }
  }
};
</script>
<style lang="scss">
._edit-membership-level {
  ._edit-membership-level-head {
    background: #f5f5f5;
    height: 64px;
    line-height: 64px;
    padding: 0 24px;
    font-size: 12px;
    color: #666666;
    letter-spacing: 0;
    .el-form-item__label,
    .el-form-item__content {
      line-height: 64px;
    }
    .level-cycle {
      display: flex;
      .lable {
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
      }
      .el-input {
        width: 80px;
      }
      .unit-desc {
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
        margin-left: 8px;
      }
      .cycle-tips {
        font-size: 12px;
        color: #3b74ff;
        letter-spacing: 0;
        margin-left: 24px;
      }
    }
    .el-form-item__error {
      top: 47px;
    }
  }
  ._edit-membership-level-content {
    width: 80%;
    margin-top: 20px;
    border: 0;
    .el-form-item__label {
      font-size: 12px;
    }
    .member-level-title {
      display: flex;
      justify-content: space-between;
      padding-bottom: 5px;
      .level-explain {
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
      }
      .add-btn {
        font-size: 12px;
        color: #3b74ff;
        letter-spacing: 0;
        cursor: pointer;
      }
    }
    // table表格内错误提示信息的样式自定义
    ._membership-level-table {
      tbody {
        tr {
          td:nth-child(2) {
            .cell {
              overflow: visible;
              white-space: nowrap;
              min-width: 50px;
              .el-form-item__error {
                background: rgba(51, 51, 51, 0.8);
                border-radius: 4px;
                font-size: 12px;
                color: #ffffff;
                text-align: left;
                line-height: 17px;
                padding: 4px 6px;
                z-index: 1;
                top: 7px;
                left: 120px;
              }
              .el-form-item__error:before {
                content: "";
                width: 0px;
                height: 0px;
                border-top: 6px solid transparent;
                border-bottom: 6px solid transparent;
                border-right: 6px solid #555;
                position: absolute;
                top: 7px;
                left: -6px;
              }
            }
          }
          td:nth-child(3) {
            .cell {
              overflow: visible;
              white-space: nowrap;
              min-width: 50px;
              .el-form-item__error {
                background: rgba(51, 51, 51, 0.8);
                border-radius: 4px;
                font-size: 12px;
                color: #ffffff;
                text-align: left;
                line-height: 17px;
                padding: 4px 6px;
                z-index: 1;
                top: 7px;
                left: 280px;
              }
              .el-form-item__error:before {
                content: "";
                width: 0px;
                height: 0px;
                border-top: 6px solid transparent;
                border-bottom: 6px solid transparent;
                border-right: 6px solid #555;
                position: absolute;
                top: 7px;
                left: -6px;
              }
            }
          }
        }
      }
    }
    // table内样式
    .index-wrap {
      display: inline-block;
      width: 12px;
      height: 12px;
      text-align: center;
      line-height: 12px;
      border-radius: 50%;
      border: 1px solid #333;
      color: #333;
    }
    ._custom-el-item {
      .el-form-item__content {
        margin-left: 0 !important;
      }
      .level-name {
        font-size: 12px;
        color: #333;
        .el-input__inner {
          height: 20px;
          line-height: 20px;
        }
      }
    }

    .no-ordinary,
    .ordinary {
      font-size: 12px;
      color: #333;
      .levelup-growth,
      .save-growth {
        width: 80px;
        margin: 0 6px;
        .el-input__inner {
          height: 20px;
          line-height: 20px;
        }
      }
    }
    .delete-btn {
      span {
        font-size: 12px;
      }
    }
    // 基础信息
    .basic-info {
      .el-form-item {
        margin-bottom: 0;
        .growth-name {
          width: 300px;
        }
      }
    }
    // 获取成长值规则
    .get-rules {
      .growth-value-options {
        background: #f5f5f5;
        border-radius: 4px;
        padding: 5px 0 20px 0;
        margin-bottom: 15px;
        .el-form-item__label {
          width: 108px !important;
        }
        .remove-growth-value {
          position: relative;
          left: 98%;
          cursor: pointer;
          color: #666;
        }
        .channel-selection {
          margin-bottom: 0;
          .el-form-item__content {
            display: flex;
          }
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
        .rules-selection {
          margin-bottom: 0;
          .rules-item {
            display: flex;
            // flex-wrap: wrap;
            .rules-title {
              width: 50px;
              font-size: 12px;
              font-weight: bold;
              color: #666666;
              letter-spacing: 0;
              display: inline-block;
              flex-shrink: 0;
            }
            .buy-ticket {
              display: flex;
              flex-wrap: wrap;
              font-size: 12px;
              color: #666666;
              .el-select {
                width: 124px;
              }
              .el-checkbox__label {
                font-size: 12px;
              }
              .growth-num {
                width: 124px;
              }
              ._member-level-rules-desc {
                font-size: 12px;
                color: #666666;
                margin-left: 8px;
                margin-right: 8px;
              }
            }
          }
          .rules-item:nth-child(2) {
            margin-top: 20px;
          }
        }
      }
      .add-growth-value-btn {
        font-size: 12px;
        color: #3b74ff;
        letter-spacing: 0;
        cursor: pointer;
      }
    }
  }
  // 底部按钮样式
  .footer-btn-wrap {
    margin: 20px 0 30px 0;
    text-align: center;
    .el-button {
      width: 80px;
      padding: 8px 20px;
    }
  }
}
// 相同获取渠道的dialog样式
.__equity-dialog {
  .el-dialog__header {
    padding: 10px 20px;
  }
  .el-dialog__body {
    padding: 0px 20px;
  }
  .el-dialog__footer {
    text-align: center;
  }
}
</style>