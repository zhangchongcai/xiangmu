<template>
  <div class="cinemaInfo">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基础信息" name="1" margi>
        <el-row :gutter="5">
          <el-col :span="9">
            <el-col :span="6" class="name m-l-17">影院编码：</el-col>
            <el-col :span="16">{{cinemaData.code}}</el-col>
          </el-col>
          <el-col :span="9">
            <div class="row-item">
              <el-col :span="6">联系人手机：</el-col>
              <el-col :span="16">{{cinemaData.mphone}}</el-col>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="9">
            <el-col :span="6" class="m-l-17">影院名称：</el-col>
            <el-col :span="16">{{cinemaData.name}}</el-col>
          </el-col>
          <el-col :span="9">
            <div class="row-item">
              <el-col :span="6">联系人固话：</el-col>
              <el-col :span="16">{{cinemaData.tphone}}</el-col>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="9">
            <el-col :span="6" class="m-l-17">内部管理编号：</el-col>
            <el-col :span="16">{{cinemaData.mgCode}}</el-col>
          </el-col>
          <el-col :span="9">
            <div class="row-item">
              <el-col :span="6">影院邮编：</el-col>
              <el-col :span="16">{{cinemaData.postcode}}</el-col>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="9">
            <el-col :span="6" class="m-l-17">开业时间：</el-col>
            <el-col :span="16">{{cinemaData.openTime}}</el-col>
          </el-col>
          <el-col :span="9">
            <div class="row-item">
              <el-col :span="6">影院传真：</el-col>
              <el-col :span="16">{{cinemaData.fax}}</el-col>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="9">
            <el-col :span="6" class="m-l-17">公司名称：</el-col>
            <el-col :span="16">{{cinemaData.company}}</el-col>
          </el-col>
          <el-col :span="9">
            <div class="row-item">
              <el-col :span="6">影院邮箱：</el-col>
              <el-col :span="16">{{cinemaData.email}}</el-col>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="9">
            <el-col :span="6" class="m-l-17">所属影院：</el-col>
            <el-col :span="16">{{cinemaData.cinemas}}</el-col>
          </el-col>
          <el-col :span="9">
            <div class="row-item">
              <el-col :span="6">所属城市：</el-col>
              <el-col :span="16">{{cinemaData.areaName}}</el-col>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="9">
            <el-col :span="6" class="m-l-17">影院联系人：</el-col>
            <el-col :span="16">{{cinemaData.contactMan}}</el-col>
          </el-col>
          <el-col :span="9">
            <div class="row-item">
              <el-col :span="6">影院地址：</el-col>
              <el-col :span="18">{{cinemaData.address}}</el-col>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="9">
            <el-col :span="6" class="m-l-17">状态：</el-col>
            <el-col :span="16">{{cinemaData.status==1?'营业':'测试'}}</el-col>
          </el-col>
          <el-col :span="9">
            <el-col :span="6">影院许可证号：</el-col>
            <el-col :span="16">{{cinemaData.licenseKey}}</el-col>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="9">
            <el-col :span="6" class="m-l-17">影院介绍：</el-col>
            <el-col :span="16">{{cinemaData.intro}}</el-col>
          </el-col>

        </el-row>
      </el-collapse-item>
      <div class="line" v-if="activeNames != 1"></div>
    </el-collapse>
    <div class="footer">
      <el-button type="primary" @click="edit" style="margin-right:14px;width:80px;height:32px;font-size:12px">编辑</el-button>
      <el-button plain @click="goBack" style="width:80px;height:32px;font-size:12px">返回</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      status: false,
      provs: [],
      citys: [],
      selectProv: '',
      selectCity: '',
      uid: '', //  影院id
      showUsbDialog: false,
      usbArray: [],
      defualtUsbcode: {
        label: 'usbKeyCode',
        children: 'children'
      },
      activeNames: ['1'], // 折叠框
      cinemaData: {
        address: '', // 地址  *
        area: {      // 地区  *
          ccode: '',
          cname: '',
          pcode: '',
          pname: ''
        },
        cinemas: '',     // 所属影线
        code: '',        // 影院编码
        company: '',     // 公司名称
        contactMan: '', // 影院联系人
        email: '',       // 影院邮箱
        fax: '',         // 影院传真
        intro: '',       // 影院介绍
        mgCode: '',      // 内部管理编码 *
        mphone: '',      // 联系人手机号码 *
        name: '',        // 影院名称  *
        openTime: '',    // 开业时间
        orgCode: '',     // 所属组织编号  *
        postcode: '',    // 影院编码
        status: '1',      // 影院状态，1营业，2测试
        tphone: ''      // 联系人固定电话

      }
    };
  },
  methods: {
    getInfo () {
      this.$ctmList.cinemaGetInfo(this.$route.query.uid).then((response) => {
        // 城市名字分割
        let data = response.data.cinemaInfo;// 获得数据
        this.cinemaData = data;
        this.cinemaData.usbkey = data.usbkey ? data.usbkey : '';
        this.status = data.status == 1;
        this.cinemaData.status = Number(data.status);
      })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 返回
    goBack () {
      this.$router.push({
        path: '/ticket/cinema/list'
      });
    },
    // 修改
    edit () {
      this.$router.push({
        path: '/ticket/cinema/edit',
        query: { uid: this.$route.query.uid }
      });
    }
  },
  created () {
    this.getInfo();
  }

};
</script>
<style lang="scss">
.footer {
  text-align: center;
}
.cinemaInfo {
  .el-col {
    font-size: 12px;
    height: 26px;
    color: #666;
  }
  .el-col-6 {
    color: #666;
  }
  .el-col-10,
  .el-col-16 {
    color: #666;
  }
  .el-collapse-item__header::after {
    display: none;
  }
  .line {
    background: #ebeef5;
    height: 1px;
    width: 100%;
    margin-bottom: 10px;
  }
  .el-collapse-item__wrap {
    padding: 0;
  }
  .el-collapse {
    padding: 0;
  }
  .el-collapse-item__header {
    display: flex;
    justify-content: flex-end;
    flex-direction: row-reverse;
  }
  .el-collapse-item__header::after {
    display: none;
  }
  .el-collapse-item__arrow {
    margin: 0 8px 0px 0;
  }
}
</style>


