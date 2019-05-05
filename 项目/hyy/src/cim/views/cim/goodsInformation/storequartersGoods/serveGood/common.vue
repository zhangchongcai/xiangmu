<template>
  <div class="content">
    <div class="tittle">新建服务商品</div>
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
              <span>HC201903241023</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              prop="tername"
              label="商品分类"
              :rules="[{ required: true, message: '商品分类不能为空',trigger: 'change' }]"
            >
              <el-input placeholder class="basic-input" v-model="queryData.tername"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="速记代码">
              <el-input placeholder class="basic-input"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="商品名称"
              :rules="[{ required: true, message: '商品名称不能为空',trigger: 'change' }]"
            >
              <el-input placeholder class="basic-input"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售别名">
              <el-input placeholder class="basic-input"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品规格">
              <el-input placeholder class="basic-input"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌">
              <el-select v-model="value" placeholder="请选择" class="basic-input">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
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
              <el-select v-model="value" placeholder="请选择" class="basic-input">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="good-img-col">
            <el-form-item label="商品图片" class="good-img-form-item">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
              >
                <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar"> -->
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <div class="el-upload__tip" slot="tip">(请上传500kb以内的JPG/PNG文件，建议图片规格：150*150px)</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="包装条码">
              <el-input class="basic-input"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品描述">
               <el-input class="basic-input" type="textarea" :rows="4"></el-input>
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
              <el-input class="price-inp"></el-input>&nbsp;&nbsp;元
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售状态">
              <el-radio-group v-model="radio">
                <el-radio :label="1">允许</el-radio>
                <el-radio :label="0">禁止</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="putaway-timer">
          <el-col :span="8">
            <el-form-item label="上架时间">
              <el-date-picker class="date-picker" v-model="value1" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下架时间">
              <el-date-picker class="date-picker" v-model="value1" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="适用门店">
              <apply-stores
                title="适用门店"
                :defaultSelected="1"
                :radios="applyStoresRadios"
                @onCheckedNodes="handleStoresCheckedNodes"
              ></apply-stores>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="适用渠道">
              <apply-channel
                title="适用渠道"
                :defaultSelected="0"
                :radios="applyChannelRadios"
                @onCheckedNodes="handleChannelCheckedNodes"
              ></apply-channel>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label-width="160px" label="是否只允许套餐内售卖">
              <el-radio-group v-model="radio4">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
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
import mixin from "cim/mixins/cim/paginationConfig.js";
import applyStores from "cim/components/applyStores/applyStores.vue";
import applyChannel from "cim/components/applyChannel/applyChannel.vue";

export default {
  mixins: [mixin],
  data() {
    return {
      radio: 1,
      radio1: 1,
      radio2: 1,
      radio3: 1,
      radio4: 1,
      value1: 1,
      value: "",
      //查询数据
      queryData: {
        cinemaUid: "",
        tername: "",
        code: "",
        status: "",
        mac: "",
        ip: "",
        page: 1,
        pageSize: 10
      },
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
          key: 0
        },
        {
          label: "指定门店",
          key: 1,
          name: "中大影院,客村影院",
          value: [
            {
              id: 9,
              name: "中大影院"
            },
            {
              id: 10,
              name: "客村影院"
            }
          ]
        },
        {
          label: "排除门店",
          key: 2,
          name: "大学城影院",
          value: [
            {
              id: 5,
              name: "大学城影院"
            }
          ]
        }
      ],
      applyChannelRadios: [
        {
          label: "全部渠道",
          key: 0
        },
        {
          label: "指定渠道",
          key: 1,
          name: "渠道一,渠道二",
          value: [
            {
              id: 9,
              name: "渠道一"
            },
            {
              id: 10,
              name: "渠道二"
            }
          ]
        }
      ]
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.setCheckedKys(this.applyStoresRadios);
      this.setCheckedKys(this.applyChannelRadios);
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
    // 查询
    onQuery() {
      // console.log(this.queryData);
    },

    handleSubmit() {
      // console.log(this.queryData);
    },

    // 修改
    terminalUpdate(param) {
      this.$api.terminalUpdate(param).then(resData => {
        if (resData.code == 200) {
          this.onQuery();
        }
      });
    },
    //确定选择适用门店
    handleStoresCheckedNodes(value) {
      this.checkedNodes(this.applyStoresRadios, value);
    },
    //确定选择适用渠道
    handleChannelCheckedNodes(value) {
      this.checkedNodes(this.applyChannelRadios, value);
    },
    checkedNodes(radios, value) {
      console.log(radios);
      console.log(value);
      radios.forEach(item => {
        if (item.key == value.type) {
          item.value = value.data;
          item.name = value.data
            .map(valueItem => {
              return valueItem.label;
            })
            .join(",");
          item.checkedKys = value.data.map(valueItem => {
            return valueItem.id;
          });
        }
      });
    }
  },
  components: {
    applyStores,
    applyChannel
  }
};
</script>

<style lang="scss">
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
  width: 140px;
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
.good-img-col {
  position: relative;
  .good-img-form-item {
    position: absolute;
  }
}
</style>