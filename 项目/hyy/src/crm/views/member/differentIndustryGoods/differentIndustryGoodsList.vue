<template>
  <div class="_different-industry-goods-list">
    <el-form :inline="true" :model="formData" ref="formData" class="form-data-wrap _member-search-area-custom">
      <el-form-item label="商品ID：" prop="goodsNo">
        <el-input v-model="formData.goodsNo" @blur="()=>{formData.goodsNo = formData.goodsNo.trim()}" placeholder="商品ID"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="商品名称：" prop="goodsName">
        <el-input v-model="formData.goodsName" @blur="()=>{formData.goodsName = formData.goodsName.trim()}"
          placeholder="商品名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="商家名称：" prop="merchantName">
        <el-input v-model="formData.merchantName" @blur="()=>{formData.merchantName = formData.merchantName.trim()}"
          placeholder="商家名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="商品属性：" prop="goodsAttribute">
        <el-select v-model="formData.goodsAttribute" placeholder="请选择商品属性" clearable>
          <el-option v-for="item in goodsAttributeList" :key="item.code" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品类型：" prop="goodsType">
        <el-select v-model="formData.goodsType" placeholder="请选择商品类型" clearable>
          <el-option v-for="item in goodsTypeList" :key="item.commodityTypeNo" :label="item.commodityTypeName"
            :value="item.commodityTypeNo"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：" prop="goodsStatus">
        <el-select v-model="formData.goodsStatus" placeholder="全部状态" clearable>
          <el-option v-for="item in goodsStatusOptions" :key="item.code" :label="item.desc" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="btn-wrap">
        <el-button type="primary" @click="handleSearch" class="_el-btn-custom">搜索</el-button>
        <el-button @click="resetForm('formData')" plain class="_el-btn-custom _member-custom-ghost-button">重置
        </el-button>
      </el-form-item>
    </el-form>
    <div class="member-level-title">
      <el-button plain class="_el-btn-custom _member-custom-ghost-button" @click="handleAddGoods">新建</el-button>
      <el-button plain class="_el-btn-custom _member-custom-ghost-button" @click="handleGoodsType">商品类型管理</el-button>
    </div>
    <div class="member-list-table _m-member-table-custom">
      <el-table :data="tableData" stripe style="width: 100%" :empty-text="tipMessage">
        <el-table-column prop="goodsNo" label="商品ID" min-width="100" :formatter="formateEmpty" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" min-width="120" :formatter="formateEmpty" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="merchantName" label="商家名称" min-width="120" :formatter="formateEmpty"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="goodsAttributeName" label="商品属性" min-width="100" :formatter="formateEmpty"
          show-overflow-tooltip></el-table-column>
        <el-table-column prop="goodsTypeName" label="商品类型" min-width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="inventoryNum" label="库存" min-width="100" :formatter="formateEmpty" show-overflow-tooltip>
          <!-- <template slot-scope="scope">
            <span>{{ scope.row.inventoryNum | formatBoxOfficeNum}}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="saleVolume" label="发售量" min-width="100" :formatter="formateEmpty" show-overflow-tooltip>
          <!-- <template slot-scope="scope">
            <span>{{ scope.row.saleVolume | formatBoxOfficeNum }}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span
              :class="scope.row.status=='not_on'?'not_on':scope.row.status=='has_been_on'?'has_been_on':'has_been_off'"
              style="fontSize:12px;">{{scope.row.status
              | judegStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="200">
          <template slot-scope="scope">
            <el-button @click="handleGoodsDetail(scope.row)" type="text" size="small" class="operation-button">查看
            </el-button>
            <el-button @click="handleEditGoods(scope.row)" type="text" size="small" class="operation-button"
              v-if="scope.row.status=='not_on'?true:false">编辑</el-button>
            <el-button @click="handleStartStopUse('has_been_on',scope.row)" type="text" size="small"
              class="operation-button" v-if="scope.row.status=='not_on'?true:false">上架</el-button>
            <el-button @click="handleStartStopUse('has_been_off',scope.row)" type="text" size="small"
              class="operation-button" v-if="scope.row.status=='has_been_on'?true:false">下架</el-button>
            <el-button @click="handleSupplement(scope.row)" type="text" size="small" class="operation-button"
              v-if="scope.row.status=='has_been_on'?true:false">补加</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 start -->
    <div class="page-wrap">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="formData.current-0" :page-size="formData.size-0" layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[20 , 50 , 100]" :total="total-0"></el-pagination>
    </div>
    <!-- 分页 end -->
    <!-- 选择商品属性的dialog -->
    <el-dialog title="请选择商品属性" :visible.sync="goodsAttributeVisible">
      <div class="_mbmber-goods-attribute-visible">
        <div class="_member-goods-item-wrap" @click="handleCreatCoupon" @mouseover="()=>{iconStatus = 1}"
          @mouseout="()=>{iconStatus = 0}">
          <div class="_icon-wrap"><i
              :class="iconStatus==2?'iconfont icon-dianziyouhuiquan-selected':'iconfont icon-dianziyouhuiquan-normal'"
              style="font-size:80px;color:#3B74FF;" :style="iconStatus==1?'color:#0F55FF':'color:#3B74FF'"></i></div>
          <div class="_goods-item-name">电子优惠券</div>
          <div class="_goods-item-desc">（无需物流）</div>
        </div>
        <div class="_member-goods-item-wrap">
          <div class="_icon-wrap"><i class="iconfont icon-xuniqia-normal" style="font-size:80px;color:#999;"></i></div>
          <div class="_goods-item-name">虚拟卡</div>
          <div class="_goods-item-desc">（无需物流）</div>
        </div>
        <div class="_member-goods-item-wrap">
          <div class="_icon-wrap"><i class="iconfont icon-shiwushangpin-normal" style="font-size:80px;color:#999;"></i>
          </div>
          <div class="_goods-item-name">实物商品</div>
          <div class="_goods-item-desc">（需要物流）</div>
        </div>
      </div>
    </el-dialog>
    <!-- 补加商品的dialog -->
    <el-dialog title="补加电子优惠券" :visible.sync="supplementVisible" @close="closeDialog">
      <div class="_mbmber-supplement-visible">
        <div class="titcket-name">导入电子优惠券：</div>
        <div class="titcket-num">{{titcketParams.ticketNum}}</div>
        <el-upload class="upload-demo" :action="$store.state.crm.fileUploadUrl" :on-success="fileUploadSuccess"
          :show-file-list="false" :before-upload="beforeFileUpload" name="file" :headers="uploadHeaders">
          <div class="select-btn"><em>导入</em></div>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddTitcket" class="_el-btn-custom _member-add-edit-save-btn">确定
        </el-button>
        <el-button @click="supplementVisible = false" class="_el-btn-custom">取消</el-button>
      </span>
    </el-dialog>
    <!-- 上架、下架的dialog -->
    <el-dialog title="" :visible.sync="stopStartDialog" width="320px" :show-close="false"
      class="_member-tip-dialog-custom-style">
      <i class="iconfont icon-danchuang-tishi _member-tip-dialog-icon"></i>
      <span class="_member-tip-dialog-desc">确定要{{statusFlag == 'has_been_on'?'上架':'下架'}} {{stopStartInfo.goodsName}}
        吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSureChangeStatus" class="_el-btn-custom _member-add-edit-save-btn">确定
        </el-button>
        <el-button @click="stopStartDialog = false" class="_el-btn-custom _member-add-edit-save-btn">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import formatBoxOfficeNum from "../../../util/formatBoxOfficeNum.js";
export default {
  name: "DifferentIndustryGoodsList",
  data() {
    return {
      stopStartDialog: false,
      stopStartInfo: "",
      statusFlag: "",
      uploadHeaders: {
        Authorization: this.$store.state.loginToken,
        "Cpm-User-Token": this.$store.state.loginToken
      },
      titcketParams: {
        goodsId: "",
        tenantId: this.$store.state.loginUser.consumerId,
        ticketNum: 0,
        ticketPath: ""
      }, //补加优惠券参数
      iconStatus: 0,
      goodsAttributeVisible: false, //商品属性dialog
      supplementVisible: false, //补加电子优惠券dialog
      tipMessage: "",
      total: 0,
      formData: {
        goodsNo: "", //商品号
        goodsName: "", //商品名称
        merchantName: "", //商家名称
        goodsAttribute: "", //商品属性
        goodsType: "", //商品类型
        goodsStatus: "", //商品状态
        current: 1,
        size: 20,
        tenantId: this.$store.state.loginUser.consumerId //租户id
      },
      tableData: [],
      goodsAttributeList: [
        { code: "", name: "全部" },
        { code: "electronic_coupons", name: "电子优惠券" },
        { code: "virtual_card", name: "虚拟卡" },
        { code: "physical_commodity", name: "实物商品" }
      ],
      goodsTypeList: [{ commodityTypeName: "全部", commodityTypeNo: "" }],
      goodsStatusOptions: [
        { code: "", desc: "全部" },
        { code: "not_on", desc: "未上架" },
        { code: "has_been_on", desc: "已上架" },
        { code: "has_been_off", desc: "已下架" }
      ] //商品状态
    };
  },
  mounted() {
    this.search();
    this.getdiffCommodityTypeList();
  },
  // activated() {
  //   this.search();
  //   this.getdiffCommodityTypeList();
  // },
  filters: {
    // formatBoxOfficeNum(value) {
    //   return formatBoxOfficeNum(value);
    // },
    judegStatus: function(value) {
      // console.log("status=", value);
      if (value == "not_on") {
        return "未上架";
      } else if (value == "has_been_on") {
        return "已上架";
      } else if (value == "has_been_off") {
        return "已下架";
      } else {
        return "-";
      }
    }
  },
  methods: {
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleAddTitcket() {
      this.supplementVisible = false;
      if (this.titcketParams.ticketNum * 1 <= 0) {
        this.$message.warning("请上传优惠券后再点击确定");
        return false;
      } else {
        this.$crmList.diffGoodsRefill(this.titcketParams).then(res => {
          if (res.update) {
            this.search();
            this.$message.success("补加成功");
          } else {
            this.$message.error("补加失败，请重试");
          }
        });
      }
    },
    closeDialog() {
      this.titcketParams = {
        goodsId: "",
        tenantId: this.$store.state.loginUser.consumerId,
        ticketNum: 0,
        ticketPath: ""
      };
    },
    fileUploadSuccess(response, file, fileList) {
      //文件上传成功
      if (response.code == 200) {
        this.$message.success("导入成功!");
        this.titcketParams.ticketNum = response.data.num;
        this.titcketParams.ticketPath = response.data.path;
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
    // 获取商品类型
    getdiffCommodityTypeList() {
      let params = { tenantId: this.formData.tenantId };
      this.$crmList.diffCommodityTypeList(params).then(res => {
        this.$set(
          this,
          "goodsTypeList",
          this.goodsTypeList.concat(res.records)
        );
      });
    },
    search() {
      let params = JSON.parse(JSON.stringify(this.formData));
      this.tipMessage = "数据加载中...";
      this.$crmList
        .diffGoodsList(params)
        .then(data => {
          if (data.total == 0) {
            this.tipMessage = "暂无数据";
          }
          this.tableData = data.records;
          this.total = data.total;
          // this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.tipMessage = err.message;
          // this.loading = false;
        });
    },
    // 搜索
    handleSearch() {
      this.formData.current = 1;
      this.search();
    },
    // 新建商品
    handleAddGoods() {
      this.goodsAttributeVisible = true;
    },
    // 新建电子优惠券
    handleCreatCoupon() {
      this.iconStatus = 2;
      setTimeout(() => {
        this.$router.push({
          path: "/member/differentIndustryGoods/add",
          query: {
            goodsAttribute: "electronic_coupons"
          }
        });
      }, 10);
    },
    // 商品类型管理
    handleGoodsType() {
      this.$router.push({ path: "/member/otherCommodity/commodityList" });
    },
    handleSizeChange(val) {
      this.formData.size = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.formData.current = val;
      this.search();
    },
    // 查看商品
    handleGoodsDetail(scope) {
      this.$router.push({
        path: "/member/differentIndustryGoods/detail",
        query: {
          goodsId: scope.id,
          tenantId: this.$store.state.loginUser.consumerId
        }
      });
    },
    // 修改商品
    handleEditGoods(scope) {
      this.$router.push({
        path: "/member/differentIndustryGoods/edit",
        query: { goodsId: scope.id }
      });
    },
    // 上架
    handleStartStopUse(flag, scope) {
      this.stopStartDialog = true;
      this.stopStartInfo = scope;
      this.statusFlag = flag;
    },
    // 确定上架、下架
    handleSureChangeStatus() {
      this.stopStartDialog = false;
      let data = {
        status: this.statusFlag,
        id: this.stopStartInfo.id, //会员id
        tenantId: this.$store.state.loginUser.consumerId //租户id
      };
      this.$crmList
        .diffGoodsUpdateStatus(data)
        .then(() => {
          this.search();
          this.$message({
            type: "success",
            message: `${this.statusFlag == "has_been_on" ? "已上架" : "已下架"}`
          });
        })
        .catch(err => console.log(err));
    },
    // 补加
    handleSupplement(scope) {
      this.supplementVisible = true;
      this.titcketParams.goodsId = scope.id;
    },
    formateEmpty(row, column, cellValue, index) {
      return cellValue != null ? cellValue : "-";
    }
  }
};
</script>
<style lang="scss">
._different-industry-goods-list {
  .form-data-wrap {
    padding: 15px 20px 0;
    background: #f5f5f5;
    .el-form-item {
      margin-bottom: 15px;
    }
    .el-form-item__label {
      font-size: 12px;
      color: #717171;
      padding: 0 6px 0 0;
    }
    .el-date-editor .el-range-input {
      // color: #717171;
      font-size: 12px;
    }
    .el-date-editor .el-range-separator {
      font-size: 12px;
    }
    .el-date-editor--daterange.el-input__inner {
      width: 210px;
      color: #717171;
      font-size: 12px;
    }
    .el-input--suffix .el-input__inner {
      width: 125px;
      color: #717171;
      font-size: 12px;
      padding-right: 0;
    }
  }
  .member-level-title {
    display: flex;
    justify-content: flex-end;
    padding: 5px 0;
    .goods-types-button-custom {
      padding: 5px 20px;
      border: none;
      color: #739bff;
      span {
        font-size: 12px;
      }
    }
  }
  .member-list-table {
    .not_on {
      color: #739bff;
    }
    .has_been_on {
      color: #2dbc2d;
    }
    .has_been_off {
      color: #f33430;
    }
    .operation-button span {
      font-size: 12px;
    }
  }
}
// 商品属性的dialog
._mbmber-goods-attribute-visible {
  display: flex;
  justify-content: space-around;
  padding: 10px 0 20px;
  ._member-goods-item-wrap {
    text-align: center;
    cursor: pointer;
    ._icon-wrap {
      height: 88px;
    }
    ._goods-item-name {
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
      text-align: center;
      margin: 0 0 5px;
    }
    ._goods-item-desc {
      font-size: 12px;
      color: #999999;
      letter-spacing: 0;
      text-align: center;
    }
  }
  ._member-goods-item-wrap:nth-child(2) {
    cursor: not-allowed;
  }
  ._member-goods-item-wrap:nth-child(3) {
    cursor: not-allowed;
  }
}
// 补加的dialog
._mbmber-supplement-visible {
  display: flex;
  justify-content: center;
  padding: 10px 0 20px;
  align-items: center;
  .titcket-num {
    width: 84px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
}
</style>

