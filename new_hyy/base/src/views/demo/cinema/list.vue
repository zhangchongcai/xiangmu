<template>
  <div class="page-wrapper">
    <div class="bread">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>cinema demo</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="list-wrapper detail">
      <div>
        <!-- <span class="table-btn-mini" @click="chooseCinema()">选择影院多选</span>
        <div></div>-->
        <span class="table-btn-mini" @click="chooseCinema(1,1)">编辑影院多选1</span>
        <div>
          <el-tag size="small" v-for="tag in selectedCinemas" :key="tag.id" closable :type="tag.type">{{tag.name}}</el-tag>
        </div>
        <span class="table-btn-mini" @click="chooseCinema(2,1)">编辑影院多选2</span>
        <div>
          <el-tag size="small" v-for="tag in selectedCinemas2" :key="tag.id" closable :type="tag.type">{{tag.name}}</el-tag>
        </div>
        <span class="table-btn-mini" @click="chooseCinemaSingle()">选择影院单选</span>
        <el-tag>{{innerDataSingle}}</el-tag>
      </div>
      <div class="table">
        <el-table :data="userList" stripe style="width: 100%">
          <el-table-column prop="loginName" label="字段1"></el-table-column>
          <el-table-column prop="fullName" label="字段2"></el-table-column>
          <el-table-column prop="phone" label="字段3"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">{{scope.row.status==0?'启用':scope.row.status==1?'禁用':'离职'}}</template>
          </el-table-column>
          <el-table-column prop="organization" label="字段4">
            <template slot-scope="scope">{{scope.row.organization.name}}</template>
          </el-table-column>
          <!-- <el-table-column label="操作" width="200"> -->
          <!-- <template slot-scope="scope"> -->
          <!-- <span @click="handleClick(scope.row)" class="table-btn-mini">查看</span>
                            <span class="table-btn-mini" @click="editUser(scope.row)">编辑</span>
          <span class="table-btn-mini" @click="diaPwd(scope.row)">重置密码</span>-->
          <!-- <span class="table-btn-mini" @click="chooseCinema(scope.row)">选择影院多选</span> -->
          <!-- </template> -->
          <!-- </el-table-column> -->
        </el-table>
        <!-- footer 分页条 -->
        <div class="page-wrap">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 25, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="选择组织" :visible.sync="dialogVisible">
      <el-tree :data="orgArr" ref="tree" @node-click="handleNodeClick" node-key="code" default-expand-all :highlight-current="true" :props="defaultProps"></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <frame-multicinema :framedialogVisible="multiCinemaVisible" :whereUse="whereUse" :type="cinematype" :innerCinemaMultiData="innerData" :disabledData="disabledData" :isListprop="true" @callBack="handleCallBack" ref="frameMultiCinema">
      <div slot="footerId">
        <el-button @click="multiCinemaVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmCinemaDialog(),multiCinemaVisible = false">确 定</el-button>
      </div>
    </frame-multicinema>
    <frame-singlecinema :framedialogVisible="singleCinemaVisible" :whereUse="whereUse" :type="cinematype" :innerData="innerDataSingle" @callBackSingle="handleSingleCallBack" ref="frameSingleCinema">
      <div slot="footerId">
        <el-button @click="singleCinemaVisible= false">取 消</el-button>
        <el-button type="primary" @click="confirmCinemaSingleDialog(), singleCinemaVisible= false">确 定</el-button>
      </div>
    </frame-singlecinema>
  </div>
</template>

<script>
import { userList, resetPassword, orgList } from 'baseSrc/http/interface.js';
import frameSinglecinema from 'baseSrc/dialogs/cinemaDialog/singleCinema';
export default {
  name: 'userList',
  components: {
    frameSinglecinema
  },
  data () {
    return {
      statusArr: [
        {
          value: '0',
          label: '启用'
        },
        {
          value: '1',
          label: '禁用'
        },
        {
          value: '2',
          label: '离职'
        }
      ],
      total: 10,
      pages: 1,
      // 总数
      total: 1,
      // 当前页
      currentPage: 1,
      // 当前页数大小
      pageSize: 10,
      orgTreeList: [],
      formInline: {
        loginName: '',
        fullName: '',
        status: '',
        orgUid: '',
        orgName: ''
      },
      orgArr: [],
      userList: [],
      dialogVisible: false,
      resetVisible: false,
      // 影院复选
      multiCinemaVisible: false,
      whereUse: null,
      cinematype: 1, // 传递给 组件的调用的影院类型 属性参数
      innerData: [], // 传递给 组件的可选参数 props 参数
      selectedCinemas: [
        // 业务定义的 选中的数据1
        //  {
        //   id: 36,
        //   code: "66765",
        //   fullName: "通州万达",
        //   name: "通州万达",
        //   theatreChainId: 7,
        //   cinemaManagerId: 8,
        //   saleSystem: null,
        //   provinceCode: "",
        //   provinceName: null,
        //   cityCode: "",
        //   cityName: null,
        //   areaCode: "",
        //   areaName: null,
        //   address: "",
        //   lng: null,
        //   lat: null,
        //   openStatus: 2,
        //   openTime: null,
        //   closeTime: "2019-04-29T16:00:00.000+0000",
        //   hallCount: 0,
        //   seatCount: 0,
        //   isActive: true,
        //   operatorId: 1,
        //   operatorName: "超级管理员",
        //   isDeleted: false,
        //   extend: null,
        //   createTime: "2019-04-15T03:11:17.000+0000",
        //   updateTime: "2019-04-15T03:11:17.000+0000"
        // }
      ],
      selectedCinemas2: [
        // {
        //   //业务定义的 选中的数据2
        //   id: 18,
        //   code: "11064201",
        //   fullName: "耀莱成龙国际影城五棵松店",
        //   name: "耀莱成龙国际影城",
        //   theatreChainId: 1,
        //   cinemaManagerId: 7,
        //   saleSystem: null,
        //   provinceCode: "",
        //   provinceName: "天津市",
        //   cityCode: "",
        //   cityName: "天津市区",
        //   areaCode: "",
        //   areaName: "河东区",
        //   address: "",
        //   lng: null,
        //   lat: null,
        //   openStatus: 1,
        //   openTime: "2019-04-22T16:00:00.000+0000",
        //   closeTime: "2019-04-14T16:00:00.000+0000",
        //   hallCount: 4,
        //   seatCount: 320,
        //   isActive: true,
        //   operatorId: 1,
        //   operatorName: "超级管理员",
        //   isDeleted: false,
        //   extend: null,
        //   createTime: "2019-04-12T11:17:31.000+0000",
        //   updateTime: "2019-04-30T02:01:54.000+0000"
        // },
        // {
        //   id: 20,
        //   code: "11061601",
        //   fullName: "星美金源店",
        //   name: "星美",
        //   theatreChainId: 1,
        //   cinemaManagerId: 1,
        //   saleSystem: null,
        //   provinceCode: "110000",
        //   provinceName: "北京市",
        //   cityCode: "110100",
        //   cityName: "北京市区",
        //   areaCode: "110105",
        //   areaName: "朝阳区",
        //   address: null,
        //   lng: null,
        //   lat: null,
        //   openStatus: 1,
        //   openTime: "2019-04-12T11:20:54.000+0000",
        //   closeTime: null,
        //   hallCount: 2,
        //   seatCount: 182,
        //   isActive: true,
        //   operatorId: 1,
        //   operatorName: "超级管理员",
        //   isDeleted: false,
        //   extend: null,
        //   createTime: "2019-04-12T11:17:42.000+0000",
        //   updateTime: "2019-04-12T11:17:45.000+0000"
        // },
        // {
        //   id: 24,
        //   code: "11058801",
        //   fullName: "CGV星星国际影城",
        //   name: "CGV星星国际",
        //   theatreChainId: 1,
        //   cinemaManagerId: 1,
        //   saleSystem: null,
        //   provinceCode: "110000",
        //   provinceName: "北京市",
        //   cityCode: "110100",
        //   cityName: "北京市区",
        //   areaCode: "110105",
        //   areaName: "朝阳区",
        //   address: null,
        //   lng: null,
        //   lat: null,
        //   openStatus: 0,
        //   openTime: null,
        //   closeTime: null,
        //   hallCount: 0,
        //   seatCount: 0,
        //   isActive: true,
        //   operatorId: 1,
        //   operatorName: "超级管理员",
        //   isDeleted: false,
        //   extend: null,
        //   createTime: "2019-04-12T11:18:03.000+0000",
        //   updateTime: "2019-04-12T11:18:06.000+0000"
        // },
        // {
        //   id: 36,
        //   code: "66765",
        //   fullName: "通州万达",
        //   name: "通州万达",
        //   theatreChainId: 7,
        //   cinemaManagerId: 8,
        //   saleSystem: null,
        //   provinceCode: "",
        //   provinceName: null,
        //   cityCode: "",
        //   cityName: null,
        //   areaCode: "",
        //   areaName: null,
        //   address: "",
        //   lng: null,
        //   lat: null,
        //   openStatus: 2,
        //   openTime: null,
        //   closeTime: "2019-04-29T16:00:00.000+0000",
        //   hallCount: 0,
        //   seatCount: 0,
        //   isActive: true,
        //   operatorId: 1,
        //   operatorName: "超级管理员",
        //   isDeleted: false,
        //   extend: null,
        //   createTime: "2019-04-15T03:11:17.000+0000",
        //   updateTime: "2019-04-15T03:11:17.000+0000"
        // }
      ],
      disabledData: [
        // {
        //   id: 19,
        //   code: "11021201",
        //   fullName: "首都华融电影院",
        //   name: "首都华融",
        //   theatreChainId: 1,
        //   cinemaManagerId: 1,
        //   saleSystem: null,
        //   provinceCode: "110000",
        //   provinceName: "北京市",
        //   cityCode: "110100",
        //   cityName: "北京市区",
        //   areaCode: "110105",
        //   areaName: "朝阳区",
        //   address: null,
        //   lng: null,
        //   lat: null,
        //   openStatus: 1,
        //   openTime: "2019-04-12T11:20:56.000+0000",
        //   closeTime: null,
        //   hallCount: 5,
        //   seatCount: 412,
        //   isActive: true,
        //   operatorId: 1,
        //   operatorName: "超级管理员",
        //   isDeleted: false,
        //   extend: null,
        //   createTime: "2019-04-12T11:17:38.000+0000",
        //   updateTime: "2019-04-29T11:17:40.000+0000"
        // }
      ],
      // 影院单选 所需参数
      innerDataSingle: { id: 38 },
      singleCinemaVisible: false,
      status: '',
      defaultProps: {
        children: 'children',
        label: 'text'
      }
    };
  },
  created () {
    // this.getUserList()
  },
  methods: {
    // 影院多选
    /**
     * num  表示 本页面第几次调用 同时 可以跟选中的对象 和编辑对象进行赋值
     * cinematype 请求的影院类型
     */
    chooseCinema (num, cinematype) {
      this.whereUse = num;
      this.cinematype = cinematype;
      if (num == 1) {
        this.innerData = this.selectedCinemas;
        this.disabledData = [];
      } else if (num == 2) {
        this.innerData = this.selectedCinemas2;
        this.disabledData = this.selectedCinemas;
        // this.disabledData = [{id:18}]
      }
      setTimeout(() => {
        this.multiCinemaVisible = true;
        this.cinematype = 1;
        this.$refs.frameMultiCinema.listAuthCommCinemas();
      });
    },
    EditCinema () {
      this.innerData = [];
      setTimeout(() => {
        this.multiCinemaVisible = true;
        this.$refs.frameMultiCinema.listAuthCommCinemas();
      });
    },
    chooseCinemaSingle () {
      this.singleCinemaVisible = true;
      this.cinematype = 1;
      // this.$refs.frameSingleCinema.listAuthCommCinemas();
    },
    confirmCinemaDialog () {
      this.$refs.frameMultiCinema.confirmData();
    },
    confirmCinemaSingleDialog () {
      this.$refs.frameSingleCinema.confirmData();
    },
    handleCallBack (opt) {
      if (opt.whereUse == 1) {
        this.selectedCinemas = opt.dataList;
      } else if (opt.whereUse == 2) {
        this.selectedCinemas2 = opt.dataList;
      }
      this.multiCinemaVisible = opt.dialogVisible;
      this.whereUse = opt.whereUse;
    },
    handleSingleCallBack (opt) {
      this.innerDataSingle = opt.data;
      this.singleCinemaVisible = opt.framedialogVisible;
    },
    to () {
      this.$router.push('newUser');
    },
    editUser (val) {
      this.$router.push('editUser');
      localStorage.setItem('onlyUser', val.uid);
    },
    diaPwd (val) {
      this.resetVisible = true;
      this.uid = val.uid;
    },
    getUserList () {
      let _this = this;
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        loginName: this.formInline.loginName,
        fullName: this.formInline.fullName,
        status: this.status,
        orgUid: this.formInline.orgUid
      };
      userList(params)
        .then(ret => {
          if (ret && ret.code == 200) {
            this.userList = ret.data.rows;
            this.total = ret.data.total;
            this.formInline.loginName = this.formInline.fullName = this.formInline.status = this.formInline.orgUid = this.formInline.orgName =
              '';
          }
        })
        .catch(() => { });
    },
    handleNodeClick (val) {
      this.formInline.orgUid = val.id;
      this.formInline.orgName = val.text;
    },
    handleClick (val) {
      localStorage.setItem('usDetail_uid', val.uid);
      this.$router.push('userDetail');
    },
    onSubmit () {
      this.getUserList();
    },
    // 当前页改变
    handleCurrentChange (value) {
      this.currentPage = value;
      this.getUserList();
    },
    // 当前页数数目改变e
    handleSizeChange (value) {
      this.pageSize = value;
      this.getUserList();
    }
  }
};
</script>
<style lang="scss">
.el-input__inner {
  width: 150px;
}
.el-form-item__label {
  padding: 0;
}
.cell span {
  color: #3b74ff;
  cursor: pointer;
}
</style>
<style lang="scss" scoped>
.bread {
  width: 100%;
  height: 20px;
}

.detail {
  .companySpan {
    display: inline-block;
    width: 40px;
    height: 32px;
    border-radius: 4px;
    line-height: 40px;
    text-align: center;
    background-color: #3b74ff;
    color: #fff;
    margin-top: 4px;
    i {
      font-size: 30px;
    }
  }
  .newBuild {
    width: 100%;
    height: 60px;
    background-color: #ccc;
    border-top: #8b8b8b;
    /*display: flex;*/
    /*justify-content: space-between;*/
    /*align-items: center;*/
    /*p{*/
    /*    color: orangered;*/
    /*    margin-left: 20px;*/
    /*}*/
  }
  .table {
    width: 96%;
    margin: 30px auto;
  }
}
.window {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(204, 204, 204, 0.9);
  z-index: 1000;
  .treeBox {
    width: 500px;
    height: 400px;
    background-color: #fff;
    position: absolute;
    top: 20%;
    left: 30%;
    border-radius: 2%;
    .title {
      font-size: 20px;
      text-align: left;
      text-indent: 20px;
      line-height: 40px;
      color: #8b8b8b;
      i {
        display: inline-block;
        float: right;
        font-size: 20px;
        font-weight: bolder;
        margin: 10px;
        &:hover {
          color: red;
          font-size: 25px;
        }
      }
    }
    .border {
      width: 100%;
      height: 1px;
      background-color: #ccc;
      margin: 6px 0;
    }
    .message {
      width: 90%;
      height: 60%;
      overflow-y: scroll;
      border: 1px solid #91bbe9;
      margin: 20px auto;
    }
    .btn {
      width: 90%;
      display: flex;
      justify-content: flex-end;
      margin: 20px auto;
    }
  }
}
</style>
