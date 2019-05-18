<template>
  <div class="see-ownrights-card">
    <div class="owner-ship-detail">
      <!-- 内容区 - 折叠面板 -->
      <el-collapse v-model="activeNames" class="owner-ship-detail-content">
        <!-- 权益信息 -->
        <el-collapse-item title="权益信息" name="1">
          <div class="equity-info">
            <div class="item-inner"><label class="lable-name">权益名称：</label>{{detailData.equityName | filterEmpty}}</div>
            <div class="item-inner"><label class="lable-name">权益类型：</label>{{detailData.equityTypeName | filterEmpty}}</div>
            <div class="item-inner" v-if="detailData.equityType == 'consumer_type'"><label class="lable-name">权益类别：</label>{{detailData.equityCategoryName
              | filterEmpty}}</div>
            <div class="item-inner"><label class="lable-name">权益说明：</label> <span style="font-size:12px" v-html="formateRemark(detailData.equityRemark)">
              </span></div>
            <div class="item-inner-img"><label class="lable-name">icon：</label>
              <span v-if="detailData.logoPic" class="have-img">
                <img :src="detailData.logoPic" alt="icon">
              </span>
              <span v-else class="no-img">暂无图标</span>
            </div>
          </div>
        </el-collapse-item>
        <!-- 权益规则 -->
        <el-collapse-item title="权益规则" name="2">
             <div class="item-inner"><label class="lable-name">已选商品：</label>{{detailData.goods | goodsList}}</div>
        </el-collapse-item>
        <el-collapse-item title="权益发放规则" name="3">
             <div class="item-inner"><label class="lable-name">间隔周期与份数：</label>{{detailData | ruleStr}}</div>
        </el-collapse-item>
      </el-collapse>
      <div :class="detailData.equityType != 'consumer_type'?'scorll-right':''">
        <fixStepTool :stepData="stepData.stepList" class="_fixsteptool-member"></fixStepTool>
      </div>
    </div>
    <div class="detail-btn-wrap">
      <el-button class="el-btn-custom" type="primary" @click="handleStarted">启用</el-button>
      <el-button class="el-btn-custom" @click="handleCancle">确定</el-button>
    </div>
  </div>
</template>
<script>
import FixStepTool from "../../../components/fix-step-tool/fix-step-tool";
import fixStepMixin from "../../../mixins/CRM/fixStepTool.js";
import { formatRemark } from "../../../util/filterData.js";
export default {
  name: "seeOwnrightsCard",
  data() {
    return {
      detailData: {},
      equityID: this.$route.query.equityId,
      activeNames: ["1", "2", "3"],
      detailData: {
        //模拟数据
        id: "332172576178569217",
        tenantId: "1",
        equityNo: "02000102",
        equityName: "测试2",
        equityTypeName: "消费类",
        equityType: "consumer_type",
        equityCategoryName: "影票折扣",
        equityCategory: "movie",
        equityRemark: "安达市222",
        logoPic:
          "http://llyy-java.oss-cn-beijing.aliyuncs.com/equity/picture/equity_picture_20190506145450_1uod4b.png",
        status: "unstart",
        statusName: "未启用"
      },
      stepData: {
        stepEl: ".el-collapse-item",
        stepList: [
          {
            name: "权益信息",
            isactive: false
          },
          {
            name: "商品信息",
            isactive: false
          },
          {
            name: "权益发放规则",
            isactive: false
          }
        ]
      }
    };
  },
  components: {
    fixStepTool: FixStepTool
  },
  created() {
    this.getDetail();
  },
  mixins: [fixStepMixin],
  methods: {
    formateRemark(value) {
      return formatRemark(value);
    },
    handleStarted() {
      this.$confirm(`确定要启用 ${this.detailData.equityName} 吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          let data = {
            status: "start",
            id: this.detailData.id, //异业权益
            tenantId: this.$store.state.loginUser.consumerId //租户id
          };
          this.$crmList.diffEquityStatus(data).then(() => {
              this.$message({
                type: "success",
                message: "已启用!"
              });
              this.$router.push({
                path: "/member/otherRights/otherRightsList"
              });
            })
            .catch(err => console.log(err));
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消启用"
          });
        });
    },
    handleCancle() {
      this.$router.push({ path: "/member/otherRights/otherRightsList" });
    },
    getDetail() {
      let params = {
        diffEquityId: this.equityID,
        tenantId: this.$store.state.loginUser.consumerId
      };
      this.$crmList
        .getdiffEquityDetail(params)
        .then(data => {
          this.detailData = data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    equityID(ID) {
      this.getDetail(ID);
    }
  },
  filters: {
    ruleStr:function(data){
      var time1 = "";
      if(data.grantType == "grant_day"){
        time1 = "每天"
      }else  if(data.grantType == "grant_unlimited"){
        time1 = "不限"
      }else  if(data.grantType == "grant_week"){
        time1 = "每周"
      }else  if(data.grantType == "grant_month"){
        time1 = "每月"
      }
      
      return `周期:${time1} 份数 ${data.grantNum}`
    },
    goodsList:function(goods){
      var nameArr = [];
      if(!goods){
        return ""
      }
      goods.map((item,index)=>{
        nameArr.push(item.goodsName)
      })
      return nameArr.join(",")
    },
    // 空数据处理过滤器
    filterEmpty: value => {
      return value ? value : "-";
    }
  }
};
</script>
<style lang="scss">
.see-ownrights-card {
  // 面包屑
  .crumbs-wrap {
    padding: 0 0 20px 0;
    a.itemLink {
      font-weight: normal;
      color: #666666;
      cursor: pointer;
    }
  }
  .detail-btn-wrap {
    width: 100%;
    text-align: center;
  }
}
.owner-ship-detail {
  overflow: hidden;
  .scorll-right .single-step:nth-of-type(2) {
    display: none;
  }
  .is-not-show {
    display: none;
  }
  //   内容区
  .owner-ship-detail-content {
    border: 0;
    // 权益信息
    .equity-info {
      padding: 0 15px;
    }
    // 权益规则
    .equity-rules {
      .ticket-discount {
        width: 55%;
        padding: 0 15px 15px;
        border: 1px solid #f5f5f5;
        border-radius: 5px;
        margin-bottom: 15px;
      }
      .sales-discount {
        padding: 15px;
      }
      .birthday-coupons {
        padding: 15px;
        .gift-voucher-wrap {
          .cash-coupon-title {
            width: 260px;
            font-size: 12px;
            color: #333333;
            font-weight: bold;
            padding: 15px 0 0 0;
            border-bottom: 1px dashed #f5f5f5;
          }
        }
      }
    }
    .item-inner,
    .item-inner-img {
      display: flex;
      align-items: baseline;
      font-size: 12px;
      color: #666666;
      margin-top: 15px;
      .lable-name {
        width: 100px;
        display: inline-block;
        font-size: 12px;
        color: #666666;
        line-height: 1.3;
      }
    }
    .item-inner-img {
      align-items: flex-start;
      .have-img {
        display: inline-block;
        width: 148px;
        height: 148px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .no-img {
        display: inline-block;
        width: 148px;
        height: 148px;
        background: #f5f5f5;
        font-size: 12px;
        text-align: center;
        line-height: 148px;
      }
    }
  }
}
</style>

