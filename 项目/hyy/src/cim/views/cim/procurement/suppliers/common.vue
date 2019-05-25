<template>
  <div class="content">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to @click.native="handleCancel">采购管理</el-breadcrumb-item>
        <el-breadcrumb-item to>供应商管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{typeText}}合成品</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tittle"></div>
    <el-form
      :inline="true"
      ref="ruleForm"
      :model="queryData"
      label-position="left"
      label-width="100px"
      label-suffix=":"
    >
      <!-- 基础信息 start-->
      <div>
        <div class="sub-tittle">基础信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="供应商编码"
              prop="code"
              :rules="[{ required: true, message: '供应商编码不能为空',trigger: 'change' }]"
            >
              <el-input
                placeholder="请输入"
                prop="shorthandCode"
                class="basic-input"
                v-model="queryData.code"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="供应商名称"
              prop="name"
              :rules="[{ required: true, message: '供应商名称不能为空',trigger: 'change' }]"
            >
              <el-input placeholder="请输入" class="basic-input" v-model="queryData.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <span v-if="routeQuery.type==3">{{queryData.status == 1 ? '启用':'停用'}}</span>
              <el-radio-group v-else v-model="queryData.status">
                <el-radio label="1">启用</el-radio>
                <el-radio label="0">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="税务登记号" prop="taxRegisterNum">
              <span v-if="routeQuery.type==3">{{queryData.taxRegisterNum}}</span>
              <el-input
                placeholder="请输入"
                class="basic-input"
                v-else
                v-model="queryData.taxRegisterNum"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              prop="linkman"
              label="联系人"
              :rules="[{ required: true, message: '联系人不能为空',trigger: 'change' }]"
            >
              <span v-if="routeQuery.type==3">{{queryData.linkman}}</span>
              <el-input placeholder="请输入" v-else class="basic-input" v-model="queryData.linkman"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              prop="tel"
              label="联系电话"
              :rules="[{ required: true, message: '联系电话不能为空',trigger: 'change' }]"
            >
              <span v-if="routeQuery.type==3">{{queryData.tel}}</span>
              <el-input placeholder="请输入" class="basic-input" v-model="queryData.tel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="email" label="电子邮箱">
              <span v-if="routeQuery.type==3">{{queryData.email}}</span>
              <el-input placeholder="请输入" v-else class="basic-input" v-model="queryData.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="fax" label="传真">
              <span v-if="routeQuery.type==3">{{queryData.fax}}</span>
              <el-input placeholder="请输入" v-else class="basic-input" v-model="queryData.fax"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              prop="cooperation"
              label="合作时间"
              :rules="[{ required: true, message: '商品名称不能为空',trigger: 'blue' }]"
            >
              <el-date-picker
                class="basic-input"
                v-model="queryData.cooperation"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 基础信息 end-->

      <!-- 财务信息 start-->
      <div>
        <div class="sub-tittle">财务信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="openAccountBank" label="开户行">
              <span v-if="routeQuery.type==3">{{queryData.openAccountBank}}</span>
              <el-input
                placeholder="请输入"
                v-else
                class="basic-input"
                v-model="queryData.openAccountBank"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="bankAccount" label="银行账号">
              <span v-if="routeQuery.type==3">{{queryData.bankAccount}}</span>
              <el-input
                placeholder="请输入"
                v-else
                class="basic-input"
                v-model="queryData.bankAccount"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="bunesRate" label="返点率">
              <span v-if="routeQuery.type==3">{{queryData.bunesRate}}</span>
              <el-input placeholder="请输入" v-else class="basic-input" v-model="queryData.bunesRate"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 财务信息 end-->

      <!-- 地理信息 start-->
      <div>
        <div class="sub-tittle">地理信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item
              prop="region"
              label="区域"
              :rules="[{ required: true, message: '区域不能为空',trigger: 'change' }]"
            >
              <el-cascader
                class="basic-input"
                :options="areaList"
                v-model="queryData.region"
                @change="handleItemChange"
                :props="props"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="zipCode" label="邮编">
              <span v-if="routeQuery.type==3">{{queryData.zipCode}}</span>
              <el-input placeholder="请输入" v-else class="basic-input" v-model="queryData.zipCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="address" label="详细地址">
              <span v-if="routeQuery.type==3">{{queryData.address}}</span>
              <el-input placeholder="请输入" v-else class="basic-input" v-model="queryData.address"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 地理信息 end-->
      <div class="submit-box">
        <el-button type="primary" @click="handleSubmit">保 存</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import qs from "qs";
import moment from "moment";
import mixin from "cim/mixins/cim/paginationConfig.js";
import applyStores from "cim/components/applyStores/applyStores.vue";
import applyChannel from "cim/components/applyChannel/applyChannel.vue";

export default {
  mixins: [mixin],
  data() {
    return {
      //查询数据
      queryData: {
        //基础信息
        type: "2", //商品类型：2-合成品
        code: "GYS01", //供应商编码
        name: "供应商01", //供应商名称
        status: "1", //状态
        taxRegisterNum: "1213231", //税务登记号
        linkman: "联系人1", //联系人
        tel: "112", //联系电话
        email: "981029@qq.com", //电子邮箱
        fax: "传真", //传真
        cooperation: ["2019-05-06", "2019-05-07"], //合作时间
        openAccountBank: "广州银行", //开户行
        bankAccount: "b3221341", //银行账户
        bunesRate: "92%", //返点率
        region: ["guangdong", "guagzhou", "tianhe"], //区域
        zipCode: "2313", //邮编
        address: "海珠区中大" //详细地址
      },
      areaList: [
        // {
        //   label: "广东省",
        //   value: "guangdong",
        //   cities: [
        //     {
        //       label: "广州市",
        //       value: "guagzhou",
        //       cities: [
        //         {
        //           label: "天河区",
        //           value: "tianhe"
        //         }
        //       ]
        //     }
        //   ]
        // },
        // {
        //   label: "浙江省",
        //   value: "zhejiang",
        //   cities: [
        //     {
        //       label: "金华市",
        //       value: "jinhua",
        //       // cities: []
        //     }
        //   ]
        // }
      ],

      props: {
        value: "areaCode",
        label: "areaName"
        // children: "children"
      }
    };
  },
  mounted() {
    this.init();
    console.log(this.routeMerData);
  },

  methods: {
    init() {
      this.supplierGetAreaList({ areaCode: "000000" });
    },
    // 查询
    onQuery() {
      // console.log(this.materialQueryData);
    },
    // 新建供应商
    supplierAdminAddSupplier(param) {
      this.$cimList.procurement
        .supplierAdminAddSupplier(param)
        .then(resData => {
          if (resData.code == 200) {
          }
        });
    },
    // 获取区域
    supplierGetAreaList(param) {
      this.$cimList.procurement.supplierGetAreaList(param).then(resData => {
        if (resData.code == 200) {
          // debugger
          this.areaList = resData.data;
          this.areaList = this.areaList.map(item => {
            if (item.areaCode == param.parentCode) {
              item.children = [...item];
            }
            return item;
          });
          this.areaList = resData.data;
        }
      });
    },

    handleItemChange(val) {
      console.log("active item:", val);
      this.supplierGetAreaList({ areaCode: val[0] });
      // setTimeout(_ => {
      //   if (val.indexOf("江苏") > -1 && !this.options2[0].cities.length) {
      //     this.options2[0].cities = [
      //       {
      //         label: "南京"
      //       }
      //     ];
      //   } else if (
      //     val.indexOf("浙江") > -1 &&
      //     !this.options2[1].cities.length
      //   ) {
      //     this.options2[1].cities = [
      //       {
      //         label: "杭州"
      //       }
      //     ];
      //   }
      // }, 300);
    },
    //
    handleSubmit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          alert("submit!");
          this.supplierAdminAddSupplier(this.queryData);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //
    handleCancel() {},
    saleCinemaType(type) {
      switch (type) {
        case "0":
          return "指定门店";
          break;
        case "1":
          return "全部门店";
          break;
        case "2":
          return "排除门店";
          break;
      }
    }
  },
  computed: {
    routeQuery() {
      return this.$route.query;
    },
    routeMerData() {
      if (this.$route.query.data) {
        return JSON.parse(this.$route.query.data);
      } else {
        return {};
      }
    },
    typeText() {
      //1新建，2修改，3查看
      switch (this.routeQuery.type) {
        // 单品
        case "1":
          return "新建";
          break;
        // 财务
        case "2":
          return "修改";
          break;
        // 合成品
        case "3":
          return "查看";
          break;
      }
    }
  },
  components: {
    applyStores,
    applyChannel
  }
};
</script>

<style lang="scss">
@import "../../../../assets/css/common.scss";
@import "../../../../assets/css/element-common.scss";
.basic-input {
  min-width: 250px;
}

.putaway-timer {
  .el-form-item__content {
    min-width: 150px;
  }
}

.recipe-box {
  margin: 30px 0;
}
.recipe-tittle-box {
  margin: 10px 0;
}
.recipe-tittle {
  line-height: 40px;
  text-align: center;
  font-size: 20px;
}
.change-dialog {
  .el-form-item__content {
    width: 60%;
  }
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 180px;
}
.delete-recipe-group {
  font-size: 20px;
}
.recipe-name-inp {
  width: 200px;
}
.price-inp {
  width: 100px;
}
.content {
  padding: 20px;
  .el-form-item {
    // margin-bottom: 10;
  }
}
.tittle {
  font-weight: 900;
  font-size: 18px;
}
.sub-tittle {
  height: 40px;
  line-height: 40px;
  width: 100%;
  background: #f5f5f5;
  margin-top: 10px;
  margin-bottom: 10px;
}
.submit-box {
  margin-top: 50px;
  text-align: center;
}
.table-box {
  margin-top: 10px;
}
.both-edit-inp {
  width: 60px;
}
.breadcrumb {
  margin-bottom: 30px;
}
.text-right {
  text-align: right;
}
.endTime-input {
  width: 110px;
}
.empty-box {
  padding: 10px;
  .selected-content {
    margin-top: 6px;
  }
  .el-button {
    padding-left: 0;
    padding-right: 0;
  }
  .empty-content {
    height: 300px;
    overflow-y: auto;
    li {
      margin-top: 5px;
    }
  }
  .el-tag {
    width: 100%;
  }
  .el-tag .el-icon-close {
    float: right;
    top: 4px;
  }
}
</style>