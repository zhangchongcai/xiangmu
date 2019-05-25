<template>
  <div class="content">
    <div class="tittle">{{typeText}}服务商品</div>
    <el-form
      :inline="true"
      :model="queryData"
      label-position="left"
      label-width="85px"
      label-suffix=":"
    >
      <!-- 基础信息 start-->
      <div class="basic-box">
        <div class="sub-tittle">基础信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品类型">
              <span>服务商品</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品编码">
              <span>{{queryData.code}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="className" label="商品分类">
              <span>{{queryData.className}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="速记代码">
              <span v-if="routeQuery.type==3">{{queryData.shorthandCode}}</span>
              <el-input v-else placeholder class="basic-input" v-model="queryData.shorthandCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="商品名称"
              :rules="[{ required: true, message: '商品名称不能为空',trigger: 'change' }]"
            >
              <span v-if="routeQuery.type==3">{{queryData.name}}</span>
              <el-input v-else placeholder class="basic-input" v-model="queryData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售别名">
              <span v-if="routeQuery.type==3">{{queryData.aliasName}}</span>
              <el-input v-else placeholder class="basic-input" v-model="queryData.aliasName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品规格">
              <span v-if="routeQuery.type==3">{{queryData.spec}}</span>
              <el-input v-else placeholder class="basic-input" v-model="queryData.spec"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌">
              <span v-if="routeQuery.type==3">{{queryData.brandName}}</span>
              <el-select v-else v-model="queryData.brandUid" placeholder="请选择" class="basic-input">
                <el-option
                  v-for="item in brandOptions"
                  :key="item.uid"
                  :label="item.name"
                  :value="item.uid"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="基本单位"
              :rules="[{ required: true, message: '基本单位不能为空',trigger: 'change' }]"
            >
              <span v-if="routeQuery.type==3">{{queryData.unitName}}</span>
              <el-select v-else v-model="queryData.unitUid" placeholder="请选择" class="basic-input">
                <el-option
                  v-for="item in unitOptions"
                  :key="item.uid"
                  :label="item.unitName"
                  :value="item.uid"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="good-img-col">
            <el-form-item prop="imgUrl" label="商品图片" class="good-img-form-item">
              <img class="upload-img" v-if="routeQuery.type==3" :src="queryData.imgUrl" alt>
              <el-upload
                v-else
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
              >
                <img v-if="queryData.imgUrl" :src="queryData.imgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div class="el-upload__tip" slot="tip">(请上传500kb以内的JPG/PNG文件，建议图片规格：150*150px)</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="包装条码">
              <span v-if="routeQuery.type==3">{{queryData.barCode}}</span>
              <el-input class="basic-input" v-else v-model="queryData.barCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品描述">
              <span v-if="routeQuery.type==3">{{queryData.remark}}</span>
              <el-input
                v-else
                class="basic-input"
                v-model="queryData.remark"
                type="textarea"
                :rows="4"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 基础信息 end-->

      <!-- 销售信息 start-->
      <div class="basic-box">
        <div class="sub-tittle">销售信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="售价">
              <span v-if="routeQuery.type==3">{{queryData.price}}</span>
              <el-input class="price-inp" v-else v-model="queryData.price"></el-input>&nbsp;&nbsp;元
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售状态">
              <span v-if="routeQuery.type==3">{{queryData.canSale == 1 ? '允许':'禁止'}}</span>
              <el-radio-group v-else v-model="queryData.canSale">
                <el-radio label="1">允许</el-radio>
                <el-radio label="0">禁止</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="putaway-timer">
          <el-col :span="8">
            <el-form-item prop="upTime" label="上架时间">
              <span v-if="routeQuery.type==3">{{queryData.upTime}}</span>
              <el-date-picker
                v-else
                class="date-picker"
                v-model="queryData.upTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="downTime" label="下架时间">
              <span
                v-if="routeQuery.type==3"
              >{{queryData.downTime ? queryData.downTime : '不限制'}}</span>
              <div v-else>
                <el-select v-model="queryData.downTimeType" placeholder="请选择" class="endTime-input">
                  <el-option key="0" label="不限制" value="0"></el-option>
                  <el-option key="1" label="指定时间" value="1"></el-option>
                </el-select>
                <el-date-picker
                  v-if="queryData.downTimeType==1"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                  class="date-picker"
                  v-model="queryData.downTime"
                  type="datetime"
                  placeholder="选择日期"
                ></el-date-picker>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="适用门店">
              <apply-stores
                title="适用门店"
                :defaultSelected="queryData.saleCinema"
                :radios="applyStoresRadios"
                @onCheckedNodes="handleStoresCheckedNodes"
              ></apply-stores>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="适用渠道">
              <apply-channel
                title="适用渠道"
                :defaultSelected="queryData.saleChannel"
                :radios="applyChannelRadios"
                @onCheckedNodes="handleChannelCheckedNodes"
              ></apply-channel>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label-width="160px" label="是否只允许套餐内售卖">
              <span v-if="routeQuery.type==3">{{queryData.canSale == 1 ? '允许':'禁止'}}</span>
              <el-radio-group v-else v-model="queryData.isSaleAsSetMeal">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 销售信息 end-->
      <div class="submit-box">
        <el-button type="primary" @click="handleSubmit">确定</el-button>
        <el-button>取消</el-button>
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
        type: "3", //商品类型：3-服务商品
        uid: "", //总部商品id
        cinemaSkuUid: "", //门店商品id 修改时候需要
        // cinemaSkuUid: "7286a0e8-d8e2-44f2-873b-5a83880a480b", //门店商品id
        code: "", //商品编码
        classUid: "", //商品分类
        className: "",
        shorthandCode: "", //速记代码
        name: "", //商品名称
        aliasName: "", //销售别名
        spec: "", //商品规格
        unitUid: "", //基本单位
        brandUid: "", //品牌
        remark: "", //商品描述
        barCode: "", //包装条码
        imgUrl:
          "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1306880214,1632905597&fm=26&gp=0.jpg", //商品图片
        //销售信息
        price: "", //价格
        canSale: "1", //销售状态
        upTime: moment().format("YYYY-MM-DD HH:mm"), //上架时间
        downTimeType: "0", //下架时间类型
        downTime: "", //下架时间
        saleCinema: "1", //适用门店 1全部门店 0指定门店 2排除门店
        cinemaEntityList: [],
        saleChannel: "1", //适用渠道 1全部渠道 0指定渠道
        channelEntityList: [],
        isSaleAsSetMeal: "1", //是否只允许套餐内售卖
        salePlace: "1" //销售地点 1全部 0指定 门店
      },
      unitOptions: [], //基本单位
      brandOptions: [], //品牌
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      applyStoresRadios: [
        {
          label: "全部门店",
          type: "1"
        },
        {
          label: "指定门店",
          type: "0",
          name: "中大影院,客村影院",
          value: [
            {
              id: 9,
              label: "中大影院"
            },
            {
              id: 10,
              label: "客村影院"
            }
          ]
        },
        {
          label: "排除门店",
          type: "2",
          name: "大学城影院",
          value: [
            {
              id: 5,
              label: "大学城影院"
            }
          ]
        }
      ],
      applyChannelRadios: [
        {
          label: "全部渠道",
          type: "1"
        },
        {
          label: "指定渠道",
          type: "0",
          name: "渠道一,渠道二",
          value: [
            {
              id: 9,
              label: "渠道一"
            },
            {
              id: 10,
              label: "渠道二"
            }
          ]
        }
      ]
    };
  },
  mounted() {
    this.queryData.uid = this.routeMerData.uid;
    this.queryData.code = this.routeMerData.proCode;
    this.queryData.className = this.routeMerData.uidname;
    this.queryData.classUid = this.routeMerData.uid;
    this.init();
    console.log(this.queryData);
    console.log(this.routeMerData);
  },
  methods: {
    init() {
      this.setCheckedKys(this.applyStoresRadios);
      this.setCheckedKys(this.applyChannelRadios);
      // 修改和查询
      if (this.routeQuery.type == 1) {
        // this.synproFindUnitList({ merClassUid: this.queryData.uid });
        // this.synproFindUnitList({ classUid: "1" });
        // this.classBrandQuery({ classUid: "1" });
      } else {
        this.synproFindUnitList({ classUid: this.queryData.uid });
        this.classBrandQuery({ classUid: this.queryData.uid });
        this.cinemaServiceGoodsQuery({
          uid: this.queryData.uid
        });
      }

      // this.cinemaServiceGoodsQuery({
      //   uid: "7626ed20-4df6-4ce1-80d0-88a6a7a48e3d"
      // });
    },
    setCheckedKys(radios) {
      radios.forEach(item => {
        if (item.value) {
          item.checkedKys = item.value.map(valueItem => {
            return valueItem.id;
          });
        }
      });
    },
    // 获取基本单位
    synproFindUnitList(param) {
      this.$cimList
        .queryUnit(param)
        .then(resData => {
          if (resData.code == 200) {
            this.unitOptions = resData.data.list;
          }
        })
        .catch(err => {});
    },
    // 获取品牌列表
    classBrandQuery(param) {
      this.$cimList
        .findBrandList(param)
        .then(resData => {
          if (resData.code == 200) {
            this.brandOptions = resData.data.list;
          }
        })
        .catch(err => {});
    },
    // 查询
    onQuery() {
      // console.log(this.queryData);
    },

    handleSubmit() {
      console.log(this.queryData);
      if (this.routeQuery.type == 1) {
        this.merServiceGoodsSave(this.queryData);
      } else if (this.routeQuery.type == 2) {
        this.cinemaServiceGoodsUpdate(this.queryData);
      } else if (this.routeQuery.type == 3) {
        //查看
      }

      // this.cinemaServiceGoodsUpdate(this.queryData);
    },

    // 总部新建
    merServiceGoodsSave(param) {
      this.$cimList.headquartersGoods
        .merServiceGoodsSave(param)
        .then(resData => {
          if (resData.code == 200) {
            this.$message("成功");
          } else {
            this.$message(resData.msg);
          }
        });
    },
    // 门店查看服务商品
    cinemaServiceGoodsQuery(param) {
      this.$cimList.storequartersGoods
        .cinemaServiceGoodsQuery(param)
        .then(resData => {
          if (resData.code == 200) {
            this.queryData = resData.data;
            if (this.queryData.canSale != null) {
              this.queryData.canSale = this.queryData.canSale.toString();
            }
            if (this.queryData.isSaleAsSetMeal != null) {
              this.queryData.isSaleAsSetMeal = this.queryData.isSaleAsSetMeal.toString();
            }
            if (this.queryData.saleChannel != null) {
              this.queryData.saleChannel = this.queryData.saleChannel.toString();
            }
            if (this.queryData.saleCinema != null) {
              this.queryData.saleCinema = this.queryData.saleCinema.toString();
              // if (this.queryData.saleCinema) {
              //   this.applyStoresRadios;
              // }
            }

            if (this.queryData.downTime) {
              this.queryData.downTimeType = "1";
            } else {
              this.queryData.downTimeType = "0";
            }
          }
        });
    },
    // 门店修改
    cinemaServiceGoodsUpdate(param) {
      this.$cimList.storequartersGoods
        .cinemaServiceGoodsUpdate(param)
        .then(resData => {
          if (resData.code == 200) {
            this.$message("成功");
          } else {
            this.$message(resData.msg);
          }
        });
    },
    //确定选择适用门店
    handleStoresCheckedNodes(checkedValue) {
      this.checkedNodes(this.applyStoresRadios, checkedValue);
    },
    //确定选择适用渠道
    handleChannelCheckedNodes(checkedValue) {
      this.checkedNodes(this.applyChannelRadios, checkedValue);
    },
    checkedNodes(radios, checkedValue) {
      // console.log(radios);
      console.log(checkedValue);
      radios.forEach(item => {
        if (item.type == checkedValue.type) {
          if (checkedValue.value) {
            item.value = checkedValue.value;
            item.name = checkedValue.value
              .map(valueItem => {
                return valueItem.label;
              })
              .join(",");
            item.checkedKys = checkedValue.value.map(valueItem => {
              return valueItem.id;
            });
          }
        }
      });
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
        // 套餐
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
@import "../../../../../assets/css/element-common.scss";
@import "../../../../../assets/css/common.scss";
.basic-input {
  min-width: 250px;
}

.putaway-timer {
  .el-form-item__content {
    min-width: 150px;
  }
}
.basic-box {
  padding: 20px 0;
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
.endTime-input {
  width: 110px;
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
.good-img-col {
  position: relative;
  .good-img-form-item {
    position: absolute;
  }
}
</style>