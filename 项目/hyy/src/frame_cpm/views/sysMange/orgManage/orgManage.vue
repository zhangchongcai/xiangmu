<template>
    <div class="content-wrapper">
        <!--<el-aside width="48%" style="background: red;height: 100%">
            <div class="header-wrap">
                <div class="search-wrap">
                    <span class="span">查询组织：</span>
                    <el-input clearable size="small" placeholder="请输入查询内容" prefix-icon="el-icon-search" v-model="filterText"></el-input>
                    <el-button type="primary" size="mini" @click="getDatas">搜索</el-button>
                </div>
                <el-button style="margin-right:10px" type="primary" size="mini" @click="addNewOrgFun()" v-auth="'system_orgManage_add'">新建组织</el-button>
            </div>
            <div class="org-sys">
                <el-tree
                        :data="dataTree"
                        node-key="id"
                        ref="tree"
                        default-expand-all
                        highlight-current
                        :filter-node-method="filterNode"
                        :expand-on-click-node="false"
                        :props="defaultProps">
                        <span class="custom-tree-node" slot-scope="{ node, data }" @click="getListOrganizationCinema(data)">
                          <span>
                            {{data.text}}
                          </span>
                          <span class="org-button-wrap">
                            <el-button
                                    v-auth="'system_orgManage_add'"
                                    type="text"
                                    size="mini"
                                    @click="() => append(node,data)">
                              新建下级
                            </el-button>
                            <el-button
                                    v-auth="'systemo_rgeManage_update'"
                                    type="text"
                                    size="mini"
                                    @click="() => edit(node, data)"
                            >
                              编辑
                            </el-button>
                            <el-button
                                    v-auth="'system_orgeManage_remove'"
                                    v-if="node.level!=1"
                                    type="text"
                                    size="mini"
                                    @click="() => remove(node, data)">
                              删除
                            </el-button>
                          </span>
                        </span>
                </el-tree>
            </div>
        </el-aside>
        <el-main>
            <div class="header-btn">
                <el-button type="primary" plain @click="removeRelationGroup" v-auth="'system_orgeManage_removeBind'">批量解绑</el-button>
                <el-button type="primary" plain @click="addRelationOpen()" v-auth="'system_orgeManage_bindCinema'">绑定影院</el-button>
            </div>
            <div class="org-right">
                <el-table
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
                            width="100"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button
                                    v-auth="'system_orgeManage_removeBind'"
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
        </el-main>-->
        <el-row :gutter="20">
            <el-col :span="12"><div class="grid-content bg-purple">
                <div class="header-wrap">
                    <div class="search-wrap">
                        <span class="span">查询组织：</span>
                        <el-input clearable size="small" placeholder="请输入查询内容" prefix-icon="el-icon-search" v-model="filterText"></el-input>
                        <el-button type="primary" size="mini" @click="getDatas">搜索</el-button>
                    </div>
                    <el-button style="margin-right:10px" type="primary" size="mini" @click="addNewOrgFun()" v-auth="'system_orgManage_add'">新建组织</el-button>
                </div>
                <div class="org-sys" style="height:1000px">
                    <el-tree
                            :data="dataTree"
                            node-key="id"
                            ref="tree"
                            default-expand-all
                            highlight-current
                            :filter-node-method="filterNode"
                            :expand-on-click-node="false"
                            :props="defaultProps">
                        <span class="custom-tree-node" slot-scope="{ node, data }" @click="getListOrganizationCinema(data)">
                          <span>
                            {{data.text}}
                          </span>
                          <span class="org-button-wrap">
                            <el-button
                                    v-auth="'system_orgManage_add'"
                                    type="text"
                                    size="mini"
                                    @click="() => append(node,data)">
                              新建下级
                            </el-button>
                            <el-button
                                    v-auth="'systemo_rgeManage_update'"
                                    type="text"
                                    size="mini"
                                    @click="() => edit(node, data)"
                            >
                              编辑
                            </el-button>
                            <el-button
                                    v-auth="'system_orgeManage_remove'"
                                    v-if="node.level!=1"
                                    type="text"
                                    size="mini"
                                    @click="() => remove(node, data)">
                              删除
                            </el-button>
                          </span>
                        </span>
                    </el-tree>
                </div>
            </div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple-light">
                <div class="header-btn">
                    <el-button type="primary" plain @click="removeRelationGroup" v-auth="'system_orgeManage_removeBind'">批量解绑</el-button>
                    <el-button type="primary" plain @click="addRelationOpen()" v-auth="'system_orgeManage_bindCinema'">绑定影院</el-button>
                </div>
                <div class="org-right">
                    <el-table
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
                                width="100"
                                show-overflow-tooltip>
                            <template slot-scope="scope">
                                <el-button
                                        v-auth="'system_orgeManage_removeBind'"
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
            </div></el-col>
        </el-row>
        <el-dialog
          :visible.sync="dialogVisible_cinemaList"
          width='60%'
          height="100%"
          :show-close='false'
          title="绑定影院"
        >
          <cinema-list
                  ref="cinema"
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
          <add-org @openOrgListFun='openOrgListFun' @bigName="bigName" :chosenOneOrg='chosenOneOrg' @dialogVisible_addorgChange='dialogVisible_addorgChange' @getOrgList='getOrgList'  />
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
import mixins from '../../../mixins/cacheMixin.js'
  export default {
    name: "orgMange",
    mixins: [mixins.cacheMixin],
    data(){
      return{
        cacheField: ["filterText",'tableData','currentPage','pageSize'],
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
        currentPage:  0,
        total: 0,
        pageSize: 10,
        pages: "" || 1,
        name:'',
        multipleSelection:[],
        dialogVisible_cinemaList:false,
        tableData: [],
        orgUid:'',
        orgName: '',
        cinemaIds: [],
        tenantLicenseList:[],
        cinemaList:[],
        all:'',
        pageNum:''
      }
    },
    components:{
      'cinema-list':cinemaListComponent,
      'add-org':addOrg,
      'org-list':orgList,
      'add-next-org':addNextOrg,
      'edit-next-org':editNextOrg
    },
    activated() {

    },
    created(){
      this.getOrgList()
      // this.getCinemaList()
    },
    methods:{
      hide(val) {
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
      },
    //新建组织结构-总
      addNewOrgFun(){
        this.dialogVisible_addorg =!this.dialogVisible_addorg
      },
      dialogVisible_addorgChange(val){
        this.dialogVisible_addorg=val
      },
      bigName(){
        this.chosenOneOrg = ''
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
        console.log(val)
        this.dialogVisible_editNextOrg = val
      },
      //删除当前级别
      remove(node, data) {
        // const parent = node.parent;
        let self = this
        let params ={
          uid: data.id,
        }
        this.$confirm('此操作将永久删除该组织, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
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
            .catch(() => {
              self.$message('网络繁忙，稍等再试');
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
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
        this.flag = true
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
                self.tableData = ret.data.rows;
                self.currentPage = ret.data.pageNum
                self.total = ret.data.total
                self.pageSize = ret.data.pageSize
            }else{
                self.$message(ret.msg);
            }

          })
          .catch(() => {
            self.$message('网络繁忙，稍等再试');
          });
      },

      //某组织结构绑定影院
      addRelationOpen(){
        let self = this;
        if(this.flag) {
          this.dialogVisible_cinemaList = true
          setTimeout(()=>{
            this.$refs.cinema.search()
          },0)
        }else{
          self.$message('请先选择组织');
          return
        }
      },
      //组织解绑影院
      removeRelation(index,row) {
        let self = this;
        let arr = []
        arr.push(row.id)
        let data ={
          uid:self.orgUid,
          cinemaIds: arr
        }
        this.$confirm(
          `是否确认解绑?`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '再想想',
            type: 'warning'
          }
        ).then(() => {
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
            .catch(() => {
              this.error('网络出错，请稍后再试')
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消解绑'
          });
        })
      },
      removeRelationGroup() {
        if(this.cinemaIds.length!=0){
          let self = this;
          let data ={
            uid:self.orgUid,
            cinemaIds:this.cinemaIds
          }
          this.$confirm(
            `是否确认批量解绑?`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '再想想',
              type: 'warning'
            }
          ).then(() => {
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

              }).catch(() => {
              this.error('网络出错，请稍后再试')
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消解绑'
            });
          });
        }else{
          this.$message({
            type: 'info',
            message: '请选择需要解绑的影院！'
          });
        }
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
<style lang="scss">
    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
        background: #3B74FF !important;
        color: #fff;
    }
    .el-tree-node__content:hover {
        background-color: #3B74FF !important;
        color: #ffffff;
    }
</style>

<style lang="scss" scoped>
  .content-wrapper {
    overflow-x: hidden;
    height: 100%;
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

      .el-row {
          margin-bottom: 20px;
          &:last-child {
              margin-bottom: 0;
          }
      }
      .el-col {
          border-radius: 4px;
      }
      .bg-purple {
          background:#f0f0f0;
      }
      .bg-purple-light {
          /*background: #e5e9f2;*/
      }
          .grid-content {
          .header-wrap{
              width: 100%;
              padding-top: 20px;
              padding-bottom: 20px;
              display: flex;
              flex-wrap: nowrap;
              .search-wrap {
                  height: 35px;
                  .span{
                      color: #606266;
                      font-size: 14px;
                      margin-left: 10px;
                  }
                  .el-input {
                      width: 50%;
                  }
                  span {
                      font-size: 12px;
                  }
              }
              .el-button--primary{
                  width:80px;
                  height: 30px;
                  padding-top:7px;
                  span{
                      font-size: 12px;
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
          .el-tree{
              background-color: #f0f0f0;
              .custom-tree-node{
                  flex: 1;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  font-size: 14px;
                  padding-right: 8px;
                  .org-button-wrap{
                      .el-button{
                          padding: 0;
                          margin-right: 10px;
                          margin-left: 0px;
                          color:#f0f0f0;
                      }
                      span{
                          font-size: 12px;
                      }
                  }
              }
          }
          .header-btn{
              display: flex;
              justify-content: flex-end;
              margin: 10px 0;
          }
          /*.org-right{
              .el-table {
                   border:0 !important;
              }
          }*/

      }
  }

</style>
