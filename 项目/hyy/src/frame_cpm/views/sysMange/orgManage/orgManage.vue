<template>
    <div class="contentCenter">
      <div class="breadcrumb">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>组织结构管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
        <div class="org-wrap">
          <div class="org-left">
            <div class="header-wrap">
              <div class="search-wrap">
                <span>查询组织：</span>
                <el-input size="small" placeholder="请输入查询内容" prefix-icon="el-icon-search" v-model="filterText"></el-input>
              </div>
              <div class="button-wrap">
                <el-button type="primary" size="small" @click="getDatas">搜索</el-button>
              </div>
              <div class="button-wrap right-offset">
                <el-button type="primary" size="small" @click="addNewOrgFun()" ><i class="iconfont icon-neiye-tianjia"></i>新建组织</el-button>
              </div>
            </div>
            <div class="org-sys">
              <el-tree
                :data="dataTree"
                node-key="id"
                ref="tree"
                default-expand-all
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                :props="defaultProps">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span @click="getListOrganizationCinema(data)"><i :class="node.icon"></i>{{ data.text }}</span>
                  <span class="org-button-wrap">
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => append(node,data)">
                      新建下级
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => edit(node, data)"
                      >
                      编辑
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => remove(node, data)">
                      删除
                    </el-button>
                  </span>
                </span>
              </el-tree>
            </div>
          </div>
          <div class="org-right">
            <div class="header-wrap">
              <div class="button-wrap">
                <el-button  plain @click="removeRelationGroup">批量解绑</el-button>
              </div>
               <div class="button-wrap">
                <el-button plain @click="addRelationOpen()">绑定影院</el-button>
              </div>
            </div>
            <el-table
              style="width:100%"
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              :stripe=true
               :row-class-name="tableRowClassName"
               :header-cell-style='{"background":"#E7EBFF"}'
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
               >
              </el-table-column>
              <el-table-column
                prop="code"
                label="影院编码"
               >
              </el-table-column>
              <el-table-column
                prop="name"
                label="影院名称"
               >
              </el-table-column>
              <el-table-column
                label="操作"
                width="100px"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    @click="removeRelation(scope.$index, scope.row)"
                  >解绑</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="page-wrap">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-sizes="[10, 20, 30]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              >
              </el-pagination>
            </div>
          </div>
        </div>
        <el-dialog
          :visible.sync="dialogVisible_cinemaList"
          width="50%"
          height="100%"
          :show-close='true'
          :close-on-click-modal='false'
          title="绑定影院"
        >
          <cinema-list
                  :cinemaList="cinemaList"
                  :orgUid='orgUid'
                  :orgName="orgName"
                  @cancel="hide"
                  @getListOrganizationCinema='getListOrganizationCinema'
                  @addRelationOpen='addRelationOpen'
          />
        </el-dialog>
        <el-dialog
          :visible.sync="dialogVisible_addorg"
          width="50%"
          height="100%"
          :show-close='true'
          :close-on-click-modal='false'
          title="新建组织"
        >
          <add-org @openOrgListFun='openOrgListFun' :chosenOneOrg='chosenOneOrg' @dialogVisible_addorgChange='dialogVisible_addorgChange' @getOrgList='getOrgList'  />
           <el-dialog
            :visible.sync="dialogVisible_orgList"
            width="50%"
            height="100%"
            :show-close='true'
            :close-on-click-modal='false'
            title="选择组织"
             append-to-body
            >
              <org-list @getOneOrgChosen='getOneOrgChosen' @dialogVisible_orgListChange='dialogVisible_orgListChange'/>
          </el-dialog>
        </el-dialog>
        <el-dialog
          :visible.sync="dialogVisible_addNextOrg"
          width="50%"
          height="100%"
          :show-close='true'
          :close-on-click-modal='false'
          title="新建下级组织"
        >
          <add-next-org  @dialogVisible_appendChange='dialogVisible_appendChange' @getOrgList='getOrgList' :lastOrgData='lastOrgData' ref="addOrgNode"/>
        </el-dialog>
        <el-dialog
          :visible.sync="dialogVisible_editNextOrg"
          width="50%"
          height="100%"
          :show-close='true'
          :close-on-click-modal='false'
          title="编辑本级组织"
        >
          <edit-next-org  @dialogVisible_editNextOrgChange='dialogVisible_editNextOrgChange' @getOrgList='getOrgList' :lastOrgData='lastOrgData' :parentOrgData='parentOrgData'/>
        </el-dialog>
    </div>
</template>

<script>
import {listCinemaUnBind,organizationList,listOrganizationCinema,cinemaBinding,removeBindingCinema,editOrg,deleteOrg} from 'frame_cpm/http/interface.js'
import cinemaListComponent from "./common/cinemaList.vue";
import addOrg from "./common/addOrg.vue";
import orgList from "./common/orgList.vue"
import addNextOrg from "./common/addNextOrg.vue"
import editNextOrg from "./common/editNextOrg.vue"
 let id = 1000
  export default {
    name: "orgMange",
    data(){
      return{
        flag: false,
        filterText: '',
        dataTree: [],
        defaultProps: {
          children:'children',
          label:'text'
        },
        dialogVisible_addorg:false,
        dialogVisible_orgList:false,
        dialogVisible_addNextOrg:false,
        dialogVisible_editNextOrg:false,
        chosenOneOrg:'',
        lastOrgData:'',
        parentOrgData:'',
        // ********
        currentPage:  1,
        total: "" || 1,
        pageSize: 10,
        pages: "" || 1,
        name:'',
        multipleSelection:[],
        dialogVisible_cinemaList:false,
        cinemaList:[],
        tableData: [],
        orgUid:'',
        orgName: '',
        cinemaIds: [],
        tenantLicenseList:[]
      }
    },
    components:{
      'cinema-list':cinemaListComponent,
      'add-org':addOrg,
      'org-list':orgList,
      'add-next-org':addNextOrg,
      'edit-next-org':editNextOrg
    },
    created(){
      this.getOrgList()
      this.getCinemaList()
    },
    watch: {

    },
    methods:{
      hide(val) {
        console.log(val)
        this.dialogVisible_cinemaList = val
      },
      handleSizeChange(val) {
        let self = this;
        self.size = val;
        self.getListOrganizationCinema({});
      },
      handleCurrentChange(val) {
        let self = this;
        self.currentPage = val;
        self.getListOrganizationCinema({});
      },

    //**************** */
    //过滤数据
      filterNode(value, data) {
        if (!value) return true;
        return data.text.indexOf(value) !== -1;
      },
    //获取拾取的某个组织
      getOneOrgChosen(val){
        this.chosenOneOrg = val
        console.log(val)
      },
    //新建组织结构-总
      addNewOrgFun(){
        this.dialogVisible_addorg =!this.dialogVisible_addorg
      },
      dialogVisible_addorgChange(val){
        this.dialogVisible_addorg=val
      },
      openOrgListFun(){
         this.dialogVisible_orgList = !this.dialogVisible_orgList
      },
      dialogVisible_orgListChange(val){
        this.dialogVisible_orgList = val
      },
      //组织结构新建下级
      append(node,data) {

        this.lastOrgData = data
        this.dialogVisible_addNextOrg = !this.dialogVisible_addNextOrg
      },
      dialogVisible_appendChange(val){
        this.dialogVisible_addNextOrg=val
      },
      //编辑下级组织
      edit(node,data) {
       console.log(' const parent = data.parent;',data)
        this.parentOrgData = node.parent
        this.lastOrgData = data
        this.dialogVisible_editNextOrg = !this.dialogVisible_editNextOrg
      },
      dialogVisible_editNextOrgChange(val){
        this.dialogVisible_editNextOrg = val
      },
      //删除当前级别
      remove(node, data) {
        // const parent = node.parent;
        let self = this
        let params ={
          uid: data.id,
        }
          deleteOrg(params)
            .then(ret => {
                if(ret.code == 200){
                 self.$message({
                          message: '删除成功',
                          type: 'success'
                          });
                  self.getOrgList()
                  self.$emit('dialogVisible_addorgChange',false)

              }else{
                    self.$message({
                      message: ret.msg,
                      type: 'warning'
                    });
              }
            })
            .catch((err) => {
              self.$message('服务器繁忙，稍等再试');
            });

      },
      getDatas(){
          this.$refs.tree.filter(this.filterText);
      },
      //获取组织结构列表
      getOrgList(){
        let self = this;
          let data ={
          }
        organizationList(data)
          .then(ret => {
            // console.log(ret)
              if(ret.data){
                  self.dataTree = JSON.parse(JSON.stringify(ret.data))
              }else{
                    self.$message(ret.msg);
              }
          })
          .catch((err) => {
            self.$message(err.msg);
          });
      },
      getListOrganizationCinema(val){
        // this.dialogVisible_cinemaList = false
        this.flag = true
        console.log('val',val)
        let self = this;
        if(val.id){
          self.orgUid = val.id
          self.orgName = val.text
        }
        let data ={
          orgUid:self.orgUid?self.orgUid:val.id,
          pageNum:self.currentPage,
          pageSize:self.size,

        }
        //获得某组织结构下的影院列表
        listOrganizationCinema(data)
          .then(ret => {
              if(ret&&ret.code==200){
                // console.log('ret.data',ret.data)
                self.tableData = ret.data.rows;
                self.currentPage=ret.data.pageNum
                self.total=ret.data.total
                self.size=ret.data.pageSize
                self.pages=ret.data.pages
            }else{
                  self.$message(ret.msg);
            }

          })
          .catch((err) => {
            self.$message('服务器繁忙，稍等再试');
          });
      },
      //获取影院列表
      getCinemaList() {
        let self = this;
          let data ={
            code:"",
            name:"",
            start:'0',
            limit:'20'
          }
        listCinemaUnBind(data)
          .then(ret => {
              if(ret&&ret.code==200){
                self.cinemaList = JSON.parse(JSON.stringify(ret.data.rows))
                // this.dialogVisible_cinemaList = true
                // console.log('self.cinemaList',self.cinemaList)
            }else{
                  self.$message(ret.msg);
            }

          })
          .catch((err) => {
            self.$message('服务器繁忙，稍等再试');
          });
      },

      //某组织结构绑定影院
      addRelationOpen(){
        let self = this;
        if(this.flag) {
          this.getCinemaList()
          this.dialogVisible_cinemaList = true
        }else{
          self.$message('请先选择组织');
          return
        }
      },
      //组织解绑影院
      removeRelation(index,row) {
        console.log(row)
        let self = this;
        let arr = []
        arr.push(row.id)
        let data ={
          uid:self.orgUid,
          cinemaIds: arr
        }
        removeBindingCinema(data)
          .then(ret => {
              if(ret.code == 200){
                self.$message({
                        message: '解绑成功',
                        type: 'success'
                        });
                self.getListOrganizationCinema({})
            }else{
                  self.$message('网络繁忙，稍等再试');
            }

          })
          .catch((err) => {
            console.log('后台报错',err)
          });

      },
      removeRelationGroup() {
        let self = this;
        let data ={
          uid:self.orgUid,
          cinemaIds:this.cinemaIds
        }
        removeBindingCinema(data)
                .then(ret => {
                  if(ret.code == 200){
                    self.$message({
                      message: '解绑成功',
                      type: 'success'
                    });
                    self.getListOrganizationCinema({})
                  }else{
                    self.$message(ret.msg);
                  }

                })
                .catch((err) => {
                  console.log('后台报错',err)
                });

      },
      handleSelectionChange(val) {
        let itemArr =val
        let resultArr = []
        resultArr = itemArr.map((item,index)=>{
          return item.id
        })
        this.cinemaIds = resultArr
      },
      tableRowClassName({ row, rowIndex }) {
          if (rowIndex % 2 == 1) {
            return "warning-row";
          } else {
            return "success-row";
          }
          return "";
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ret => {
            done();
          })
          .catch(_error => {});
      }
    }
  }
</script>

<style  type="text/css" lang="scss" >
  .contentCenter {
    height: 100%;
    .breadcrumb{
      padding:9px 0 9px 3px;
      .el-breadcrumb{
        span{
          font-size: 14px;
        }
      }
    }
    .el-dialog {
      border-radius: 5px;
      overflow: hidden;
      .el-dialog__header {
        padding: 18px;
      }
      .el-dialog__body {
        padding: 10px;
      }
    }
    .org-wrap{
      /*width: 100%;*/
      height:100%;
      // 左边
      .org-left{
        box-sizing: border-box;
        width: 48%;
        height:100%;
        background: #f0f0f0 ;
        padding-left: 25px;
        padding-top:24px;
        display: inline-block;
        .header-wrap{
          .search-wrap {
            display: inline-block;
            height: 32px;
            .el-input {
              width: 226px;
            }
            span {
              color: #666666;
              font-size: 12px;
            }
          }
          .button-wrap {
            margin-left: 3px;
            display: inline-block;
            .el-button--primary{
              width:80px;
              height: 30px;
              padding-top:7px;
              span{
                font-size: 12px;
              }
            }
          }
          .right-offset{
            float: right;
            margin-right: 16px;
            span{
              font-size: 12px;
              margin-left:-12px;
              vertical-align: middle;
              .icon-neiye-tianjia{
                margin-right: 5px;
                font-size: 10px;
                margin-top:-2px ;
                display: inline-block;
              }
            }
          }
        }
        .org-sys{
          margin-top:24px;
          .el-tree{
            background:#f0f0f0 ;
            font-size: 12px;
            .el-tree-node__content{
              .custom-tree-node{
                width: 100%;
                .org-button-wrap{
                  .el-button{
                    padding: 0;
                    margin-right: 10px;
                    margin-left: 0px;
                  }
                  display: none;
                  float: right;
                  span{
                    font-size: 12px;
                  }
                }
              }
            }
            .el-tree-node__content:hover {
              background-color: #3B74FF;
              .el-tree-node__label{
                color: #ffffff
              }
              .custom-tree-node{
                color: #ffffff;
                .org-button-wrap{
                  display:inline-block;
                  span{
                    color:#ffffff;
                  }
                }
              }
            }
            .el-tree-node:focus>.el-tree-node__content {
              background-color: #3B74FF;
            }

          }

        }

      }
      // 右边
      .org-right{
        box-sizing: border-box;
        float:right;
        width: 51%;
        height: 100%;
        .header-wrap{
          float: right;
          margin-bottom: 15px;
          .button-wrap{
            display: inline-block;
            margin-left: 22px;
            .el-button--default{
              width:80px;
              height: 30px;
              padding-top:7px;
              border: 1px solid #3B74FF !important;
              color: #3B74FF !important;
              span{
                font-size: 12px;
                color: #3B74FF !important
              }
              opacity: 1;
            }
            .el-button--default:hover{
              opacity: 0.5;
            }
          }
        }
        .el-table {
          border: #f0f0f0 1px solid;
        }
        //表格
        .org-right-table{
          margin-top:24px;
          width:100%;
          .el-table .warning-row {
            background: #f0f0f0;
          }

          .el-table .success-row {
            background: #ffffff;
          }
          .handleSelectioHead {
            background: #E7EBFF;
          }
        }

      }

    }
  }

</style>
