<template>
    <div class="page-wrapper">
        <div class="bread">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>film demo</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <span class="table-btn-mini" @click="chooseFilmSingle()">选择影院单选</span>
            <el-tag>{{innerFilmDataSingle.feedBack}}</el-tag>
            <span class="table-btn-mini" @click="chooseFilm(2,1)">编辑影院多选2</span>
            <div>
                <el-tag
                    size="small"
                    v-for="tag in selectedCinemas2"
                    :key="tag.id"
                    closable
                    :type="tag.type"
                >{{tag.name}}</el-tag>
            </div>
        </div>
        <div class="list-wrapper detail">
            <div class="table">
                <el-table
                        :data="userList"
                        stripe
                        style="width: 100%">
                    <el-table-column
                            prop="loginName"
                            label="字段1"

                            >
                    </el-table-column>
                    <el-table-column
                            prop="fullName"
                            label="字段2"

                           >
                    </el-table-column>
                    <el-table-column
                            prop="phone"
                            label="字段3"

                            >
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        label="状态"

                    >
                        <template slot-scope="scope">{{scope.row.status==0?'启用':scope.row.status==1?'禁用':'离职'}}</template>
                    </el-table-column>
                    <el-table-column
                        prop="organization"
                        label="字段4"

                    >
                        <template slot-scope="scope">{{scope.row.organization.name}}</template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <!-- <span @click="handleClick(scope.row)" class="table-btn-mini">查看</span>
                            <span class="table-btn-mini" @click="editUser(scope.row)">编辑</span>
                            <span class="table-btn-mini" @click="diaPwd(scope.row)">重置密码</span> -->
                            <span class="table-btn-mini" @click="chooseFilm(scope.row)">选择影片多选</span>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- footer 分页条 -->
                <div class="page-wrap">
                    <el-pagination
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[10, 25, 50, 100]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <el-dialog title="选择组织" :visible.sync="dialogVisible">
            <el-tree
                :data='orgArr'
                ref="tree"
                @node-click="handleNodeClick"
                node-key="code"
                default-expand-all
                :highlight-current="true"
                :props="defaultProps"
            >
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </div>
        </el-dialog>
        <framemultiFilmBase
         :innerFilmMultiData="innerFilmData" 
         :disabledData="disabledDataMultiFilm"
         :whereUse="whereUse" 
         :type="filmtype"
         @frameFilmBaseMultiCallBack="handleCallBack" 
         ref='frameMultiFilm'>
        </framemultiFilmBase>
        <!-- <div slot="footerId">
                <el-button @click="multiFilmVisible=false">取 消</el-button>
                <el-button type="primary" @click="confirmFilmDialog(),multiFilmVisible=false">确 定</el-button>
            </div> -->
        <!-- :framedialogVisible="singleFilmVisible" -->
        <frameSingleFilmBase   :innerData="innerFilmDataSingle" @frameFilmBaseSingleCallBack="frameSingleFilmBaseCallBack" ref='frameSingleFilm'>
        </frameSingleFilmBase>
        <!-- <div slot="footerId">
                <el-button @click="singleFilmVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmFilmSingleDialog(),singleFilmVisible = false">确 定</el-button>
            </div> -->
    </div>
</template>

<script>
  import {userList,resetPassword,orgList} from 'frame_cpm/http/interface.js'
  import frameSingleFilmBase from 'src/frame_cpm/dialogs/film/singleBase'
  import framemultiFilmBase from 'src/frame_cpm/dialogs/film/multiBase'
  export default {
    name: "userList",
    components:{
        frameSingleFilmBase,
        framemultiFilmBase
    },
    data() {
      return {
          frameFilmParams:{
            // 调用索引 当调用的次数多于一次的时候使用
            whereUse: null, 
            type:1, // 传递给 组件的调用的影院类型 属性参数 1 基础影片
            innerData:{"id": 38} // 需要回显选中的数据
          },
          statusArr: [{
              value: '0',
              label: '启用'
            }, {
              value: '1',
              label: '禁用'
            }, {
              value: '2',
              label: '离职'
          }],
          total: 10,
          pages: 1,
          //总数
          total:1,
          //当前页
          currentPage:1,
          //当前页数大小
          pageSize:10,
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
          // 影片复选
          multiFilmVisible: false,
          disabledDataMultiFilm:[],
          filmDatatype:2,
          innerFilmData:[],
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
          status: '',
          defaultProps: {
              children: 'children',
              label: 'text'
          },
          // 影片单选
           whereUse:null,
          filmtype:1, // 传递给 组件的调用的影院类型 属性参数
          innerFilmDataSingle:{
            indexUse:null,
            feedBack:{
               
            }
        },
          singleFilmVisible: false,
      }
    },
    created() {
        this.getUserList()
    },
    methods: {
        // 影片多选
        chooseFilm(){
            // this.multiFilmVisible = true
            this.innerFilmData = this.selectedCinemas2
            this.$refs.frameMultiFilm.toggleShowDialog(true)
            this.$refs.frameMultiFilm.listAuthCommCinemas()
        },
        closeDialogFilmDialog(){
            this.multiFilmVisible = false
        },
        confirmFilmDialog(){
            this.$refs.frameMultiFilm.confirmData()
        },
        /**
         * opt 回调对象
         * dataList 选中的数据
         * dialogVisible 窗口显示隐藏
         * whereUse 传入的 动态索引标识
        */
        handleCallBack (opt) {
            this.selectedCinemas = opt.dataList
            // this.multiFilmVisible = opt.dialogVisible;
            this.whereUse = opt.whereUse
        },
        // 影片单选
        chooseFilmSingle(){
            // this.singleFilmVisible = true
            this.$refs.frameSingleFilm.toggleShowDialog(true)
            this.$refs.frameSingleFilm.listAuthCommCinemas()
            
        },
        // closeSingleFilmDialog(){
        //     this.singleFilmVisible = false
        // },
        // confirmFilmSingleDialog(){
        //     this.$refs.frameSingleFilm.confirmData()
        //     this.singleFilmVisible = false
        // },
        frameSingleFilmBaseCallBack(opt) {
            this.innerFilmDataSingle.feedBack = opt.data
            // this.singleCinemaVisible = opt.framedialogVisible;
        },
        to() {
          this.$router.push('newUser')
        },
        editUser(val) {
            this.$router.push('editUser')
            localStorage.setItem('onlyUser',val.uid)
        },
        diaPwd(val) {
            this.resetVisible = true
            this.uid = val.uid
        },
        getUserList(){
              let _this = this;
              let params = {
                  pageNum: this.currentPage,
                  pageSize: this.pageSize,
                  loginName: this.formInline.loginName,
                  fullName: this.formInline.fullName,
                  status: this.status,
                  orgUid: this.formInline.orgUid,
              }
              userList(params)
              .then(ret => {
                if(ret && ret.code==200){
                    this.userList = ret.data.rows
                    this.total = ret.data.total
                    this.formInline.loginName = this.formInline.fullName = this.formInline.status = this.formInline.orgUid = this.formInline.orgName = ''
                }
              })
              .catch(() => {
              });
        },
        handleNodeClick(val) {
            this.formInline.orgUid = val.id
            this.formInline.orgName = val.text
        },
        handleClick(val) {
            localStorage.setItem('usDetail_uid',val.uid)
            this.$router.push('userDetail')

        },
        onSubmit() {
            this.getUserList()
        },
        //当前页改变
        handleCurrentChange(value) {
            this.currentPage = value;
            this.getUserList();
        },
        //当前页数数目改变e
        handleSizeChange(value) {
            this.pageSize = value;
            this.getUserList();
        },
    }
  }
</script>
<style lang="scss" scoped>
    .el-input__inner {
        width: 150px;
    }
    .el-form-item__label {
        padding: 0;
    }
    .cell span {
        color:#3b74ff;
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
            background-color: #3B74FF;
            color: #fff;
            margin-top: 4px;
            i{
                font-size: 30px ;
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
        top:0;
        left:0;
        bottom:0;
        right:0;
        background-color: rgba(204,204,204,0.9);
        z-index: 1000;
        .treeBox {
            width:500px;
            height:400px;
            background-color: #fff;
            position: absolute;
            top: 20%;
            left:30%;
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
                    &:hover{
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
