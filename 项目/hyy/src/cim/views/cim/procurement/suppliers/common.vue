<template>
  <div class="content supplires-common">
<!--    <div class="breadcrumb">-->
<!--      <el-breadcrumb separator-class="el-icon-arrow-right">-->
<!--        <el-breadcrumb-item>采购管理</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item :to="{ path: '/retail/procurement/suppliers/list' }">供应商管理</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item>{{typeText}}供应商</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->
    <div class="tittle"></div>
    <el-form
      :inline="true"
      ref="ruleForm"
      :model="queryData"
      label-position="left"
      label-width="100px"
      label-suffix="："
    >
      <el-collapse  v-model="activeNames">
        <!-- 基础信息 start-->
        <el-collapse-item title="基础信息" name="1">
          <div>
            <el-row>
              <el-col :span="8">
                <el-form-item
                        label="供应商编码"
                        prop="code"
                        :rules="[{ required:  routeQuery.type==3 ? false : true, message: '供应商编码不能为空',trigger:  ['blur', 'change']  }, {pattern:/^[0-9a-zA-Z_-]{6}$/,message: '请输入6位英文字母或数字!'}]"
                >
                  <span v-if="routeQuery.type==3">{{queryData.code}}</span>
                  <el-input
                          v-else
                          placeholder="请输入"
                          prop="shorthandCode"
                          :disabled="routeQuery.type==2  ? true: false"
                          class="basic-input"
                          v-model="queryData.code"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                        label="供应商名称"
                        prop="name"
                        :rules="[{ required:  routeQuery.type==3 ? false : true, message: '供应商名称不能为空',trigger: 'change' }]"
                >
                  <span v-if="routeQuery.type==3">{{queryData.name}}</span>
                  <el-input v-else placeholder="请输入" class="basic-input" v-model="queryData.name"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="状态" prop="status">
                  <span v-if="routeQuery.type==3">{{queryData.status == 1 ? '启用':'停用'}}</span>
                  <el-radio-group v-else v-model="queryData.status">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0">停用</el-radio>
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
                        :rules="[{ required:  routeQuery.type==3 ? false : true, message: '联系人不能为空',trigger: 'change' }]"
                >
                  <span v-if="routeQuery.type==3">{{queryData.linkman}}</span>
                  <el-input placeholder="请输入" v-else class="basic-input" v-model="queryData.linkman"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                        prop="tel"
                        label="联系电话"
                        :rules="[{ required:  routeQuery.type==3 ? false : true, message: '联系电话不能为空',trigger: 'change' }]"
                >
                  <span v-if="routeQuery.type==3">{{queryData.tel}}</span>
                  <el-input v-else placeholder="请输入" class="basic-input" v-model="queryData.tel"></el-input>
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
                        prop="cooperationTime"
                        label="合作时间"
                        class="cooperation-time"
                        :rules="[{ required:  routeQuery.type==3 ? false : true, message: '合作时间不能为空',trigger: 'change' }]"
                >
                  <span v-if="routeQuery.type==3">{{queryData.startTime +'至' + queryData.endTime}}</span>
                  <el-date-picker
                          v-else
                          class="basic-input"
                          v-model="queryData.cooperationTime"
                          type="datetimerange"
                          format="yyyy-MM-dd HH:mm"
                          value-format="yyyy-MM-dd HH:mm"
                          placeholder="选择日期"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
      </div>
        </el-collapse-item>
        <!-- 基础信息 end-->

        <!-- 财务信息 start-->
        <el-collapse-item title="财务信息" name="2">
          <div>
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
                  <el-input placeholder="请输入" type="number" v-else class="basic-input"
                            v-model="queryData.bunesRate"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <!-- 财务信息 end-->

        <!-- 地理信息 start-->
        <el-collapse-item title="地理信息" name="3">
          <div>
            <el-row>
              <el-col :span="8">
                <el-form-item
                        prop="provinceId"
                        :error="areaError"
                        label="区域"
                        :rules="[{ required:  routeQuery.type==3 ? false : true, message: '区域不能为空',trigger: 'change' }]"
                >
                  <span v-if="routeQuery.type==3">{{queryData.provinceName+queryData.cityName+queryData.countyName}}</span>
                  <div v-else>
                    <el-select
                            v-model="queryData.provinceId"
                            @change="handleProvinceChange"
                            placeholder="请选择省份"
                            class="area-select"
                    >
                      <el-option
                              v-for="item in provinceRegion"
                              :key="item.areaCode"
                              :label="item.areaName"
                              :value="item.areaCode"
                      ></el-option>
                    </el-select>
                    <el-select
                            v-model="queryData.cityId"
                            @change="handleCityChange"
                            placeholder="请选择市"
                            class="area-select"
                    >
                      <el-option
                              v-for="item in cityRegion"
                              :key="item.areaCode"
                              :label="item.areaName"
                              :value="item.areaCode"
                      ></el-option>
                    </el-select>
                    <el-select v-model="queryData.countyId" placeholder="请选择县区" class="area-select">
                      <el-option
                              v-for="item in countyRegion"
                              :key="item.areaCode"
                              :label="item.areaName"
                              :value="item.areaCode"
                      ></el-option>
                    </el-select>
                  </div>
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
        </el-collapse-item>
        <!-- 地理信息 end-->
      </el-collapse>
      <div class="submit-box" v-if="routeQuery.type!=3">
        <el-button type="primary" @click="handleSubmit">保 存</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
      <div v-else class="submit-box">
        <el-button @click="handleCancel">关 闭</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  import mixin from "cim/mixins/cim/paginationConfig.js";
  import applyStores from "cim/components/applyStores/applyStores.vue";
  import applyChannel from "cim/components/applyChannel/applyChannel.vue";
  import {letterAndNumReg} from "cim/util/reg.js";

  console.log(letterAndNumReg)
  export default {
  mixins: [mixin],
  data() {
    return {
      //查询数据
      queryData: {
        //基础信息
        code: "", //供应商编码
        name: "", //供应商名称
        status: 1, //状态
        taxRegisterNum: "", //税务登记号
        linkman: "", //联系人
        tel: "", //联系电话
        email: "", //电子邮箱
        fax: "", //传真
        cooperationTime: [], //合作时间
        startTime: "",
        endTime: "",
        openAccountBank: "", //开户行
        bankAccount: "", //银行账户
        bunesRate: "", //返点率
        provinceId: "", //省
        cityId: "", //市
        countyId: "", //区
        zipCode: "", //邮编
        address: "" //详细地址
      },
      provinceRegion: [], //国家区域
      cityRegion: [], //市区域
      countyRegion: [], //区区域
      areaList: [],
      props: {
        value: "areaCode",
        label: "areaName"
      },
      areaError: '',
      activeNames:['1','2','3']
    };
  },
  activated() {

  },
  mounted() {
    this.init();
    console.log(this.routeMerData);
  },

  methods: {
    init() {
      this.onQuery();
    },
    // 查询
    onQuery() {
      if (this.routeQuery.type == 1) {
        this.supplierGetAreaList({areaCode: "000000"});
      } else if (this.routeQuery.type == 2) {
        this.supplierGetAreaList({areaCode: "000000"});
        this.supplierAdminSelectSupplierEntity({uid: this.routeMerData.uid});
      } else {
        this.supplierAdminSelectSupplierEntity({ uid: this.routeMerData.uid });
      }
      let lastLevel = this.typeText+'供应商';
      this.$route.meta.title = lastLevel;
      this.$store.commit('getLevel',lastLevel);

    },
    // 新建供应商
    supplierAdminAddSupplier(param) {
      this.$cimList.procurement
        .supplierAdminAddSupplier(param)
        .then(resData => {
          if (resData.code == 200) {
            this.$message({
              type: "success",
              message: "新建成功!"
            });
            this.handleCancel();
          } else {
            this.$message({
              message: resData.msg
            });
          }
        });
    },
    // 修改供应商
    supplierAdminUpdateSupplier(param) {
      this.$cimList.procurement
        .supplierAdminUpdateSupplier(param)
        .then(resData => {
          if (resData.code == 200) {
            this.$message({
              type: "success",
              message: "修改成功!"
            });
            this.handleCancel();
          } else {
            this.$message({
              type: "error",
              message: resData.msg
            });
          }
        });
    },
    // 查看供应商
    supplierAdminSelectSupplierEntity(param) {
      this.$cimList.procurement
        .supplierAdminSelectSupplierEntity(param)
        .then(resData => {
          if (resData.code == 200) {
            this.queryData = resData.data;
            this.queryData.cooperationTime = [
              this.queryData.startTime,
              this.queryData.endTime
            ];
            if (this.queryData.provinceId) {
              this.supplierGetAreaList({areaCode: this.queryData.provinceId}, "province");
            }
            if (this.queryData.cityId) {
              this.supplierGetAreaList({areaCode: this.queryData.cityId}, "city");
            }
          }
        });
    },
    // 省改变
    handleProvinceChange(value) {
      this.queryData.cityId = '';
      this.queryData.countyId = '';
      this.supplierGetAreaList({ areaCode: value }, "province");
    },
    // 市改变
    handleCityChange(value) {
      this.queryData.countyId = '';
      this.supplierGetAreaList({ areaCode: value }, "city");
    },
    // 获取区域
    supplierGetAreaList(param, type) {
      this.$cimList.procurement.supplierGetAreaList(param).then(resData => {
        if (resData.code == 200) {
          // debugger
          if (param.areaCode == "000000") {
            //省
            this.provinceRegion = resData.data;
          } else {
            if (type == "province") {
              //市
              this.cityRegion = resData.data;
            } else {
              //区
              this.countyRegion = resData.data;
            }
          }
        }
      });
    },
    // //提交
    handleSubmit() {
      console.log(this.queryData);
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (!this.queryData.cityId) {
            this.$refs.ruleForm.fields[12].error = "请选择市"
            return false
          }
          if (!this.queryData.countyId) {
            this.$refs.ruleForm.fields[12].error = "请选择县区"
            return false
          }
          this.queryData.startTime = this.queryData.cooperationTime[0];
          this.queryData.endTime = this.queryData.cooperationTime[1];
          if (this.routeQuery.type == 1) {
            //新建
            this.supplierAdminAddSupplier(this.queryData);
          } else if (this.routeQuery.type == 2) {
            //修改
            this.supplierAdminUpdateSupplier(this.queryData);
          }
        } else {
          return false;
        }
      });
    },

    //
    handleCancel() {
      this.$store.commit("tagNav/removeTagNav", {
        name: this.$route.name,
        path: this.$route.path,
        title: this.$route.meta.title,
        query: this.$route.query
      })
      this.$router.push({
        path: "/retail/procurement/suppliers/list",
      });
    },
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
          return "编辑";
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
.supplires-common{
  .area-select {
    width: 120px;
  }
  .el-form-item__content{
    .basic-input .el-input__inner{
      width: 300px;
    }
  }
}

</style>