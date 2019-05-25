<template>
  <div class="content-wrapper">
      <div class="breadcrumb">
          <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item>系统设置</el-breadcrumb-item>
              <el-breadcrumb-item>角色管理</el-breadcrumb-item>
              <el-breadcrumb-item>{{level}}</el-breadcrumb-item>
          </el-breadcrumb>
      </div>
      <div class="org-wrap">
        <div class="form-wrapper">
            <el-form ref="prole" :model="prole" :rules="rules" label-width="90px" label-position="left" label-height='60px'>
                <div class="form-group">
                    <div class="twice-item">
                        <div class="child-item-left">
                            <el-form-item label="角色名称:" prop="name">
                                <el-input v-model.trim="prole.name" placeholder="" :disabled="isJustSee"></el-input>
                            </el-form-item>
                        </div>
                        <div class="child-item-right">
                            <el-form-item label="状态:" prop="status">
                                <el-radio-group v-model="prole.status" :disabled="isJustSee">
                                    <el-radio label="1">启用</el-radio>
                                    <el-radio label="0">禁用</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </div>
                    </div>
                    <el-form-item label="描述:" class="width100" prop="remark" style="width:100%;">
                        <el-input type="textarea" v-model="prole.remark" style="width:100%;" :disabled="isJustSee"></el-input>
                    </el-form-item>
                </div>
                <div class="btn" style="margin-top:20px;margin-bottom:20px;">
                    <el-button @click="out" v-if="isSee">取消</el-button>
                    <el-button type="primary" @click="confirmRole('prole',false)" v-if="isSee">保存</el-button>
                    <el-button @click="out" type="primary" v-else>返回</el-button>
                </div>
            </el-form>
        </div>
        <div class="role">
            <h2 class="tree-title" style="margin-bottom:6px;">权限设置</h2>
            <div class="role-tree" style="border:1px solid #ccc; padding:10px;">
                <el-tree
                  :data="data5"
                  node-key="id"
                  ref="tree"
                  :props="defaultProps"
                  default-expand-all
                  :show-checkbox="isShowCheckbox"
                  :expand-on-click-node="false"
                  :default-checked-keys='ids'
                  @check-change="handleCheckChange">
                    <span class="custom-tree-node" slot-scope="{ node, data }" :class="{'menu-zi-class':data.menuType == 2}">
                        <span>
                            <i class="iconfont" :class="{'icon-neiye-kedanjia':data.menuType == 1,'neiye-kedanjia':data.menuType == 2,'caidan':data.menuType == 3}"></i>
                            {{ node.label }}
                        </span>
                    </span>
                </el-tree>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
    import {addRole,roleMenuTree,editRole} from 'frame_cpm/http/interface.js'
    let id = 1000;
export default {
  name: "newRole",
  data() {
    const data = [];
    return {
      isJustSee:false,
      isSee:true,
      isEdit:false,
      isShowCheckbox:true,
      level: '新建角色',
      id:null,
      data5:[],
      prole:{
        name:null,
        status:'1',
        remark:null
      },
      rules:{
        name: [
            {required: true ,message:'请输入角色名称',trigger: 'blur'},
            { min: 3, max: 50, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        status: [
            {required: true ,message:'请选择角色状态', trigger: 'blur'},
        ],
      },
      currentPage: 1,
      total: "" || 1,
      size: 10,
      pages: "" || 1,
      name: "",
      multipleSelection: [],
      postObj: {
          menuName: null,
          productCode: null, // 系统类型 1 后端，2 POS，3 APP
          productVersion: null,
          parentId: null
      },
      treeData:[],
      defaultProps: {
          children: 'submenu',
          label: 'menuName'
      },
      ids: [],
    }
  },
  watch: {
    $route: {
      handler: function(newVal, oldVal){
        this.level = newVal.name
        if(newVal.query.isEdit){
          this.isSee = true
          this.isJustSee =false
          this.isEdit = Boolean(this.$route.query.isEdit)?true:false
          this.prole = JSON.parse(localStorage.getItem('roleEdit'))
          this.prole.status = this.prole.status.toString()
          this.getData(this.$route.query.roleUid)
        }else if(newVal.query.isJustSee){
          this.isSee = this.isEdit = false
          this.isJustSee = Boolean(this.$route.query.isJustSee)?true:false
          this.prole = JSON.parse(localStorage.getItem('roleEdit'))
          this.prole.status = this.prole.status.toString()
          this.getData(this.$route.query.roleUid)
        }else if(newVal.query.level){
          this.isSee = true
          this.isJustSee = this.isEdit = false
          this.prole ={
              name:null,
              status:'1',
              remark:null
          },
          this.$refs.tree.setCheckedKeys([]);
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  created(){
    this.isEdit = Boolean(this.$route.query.isEdit)?true:false
    this.isJustSee = Boolean(this.$route.query.isJustSee)?true:false
    this.data5 = JSON.parse(localStorage.getItem('leftTreeList'))
    this.level = this.$route.name
  },
  mounted() {
    if(this.isEdit){
      this.isSee = true
      this.isJustSee = false
      this.prole = JSON.parse(localStorage.getItem('roleEdit'))
      this.prole.status = this.prole.status.toString()
      this.getData(this.$route.query.roleUid)
    }else if(this.isJustSee){
      this.isSee = this.isEdit =false
      this.prole = JSON.parse(localStorage.getItem('roleEdit'))
      this.prole.status = this.prole.status.toString()
      this.getData(this.$route.query.roleUid)
    }else{
      this.isSee = true
      this.isJustSee = this.isEdit = false
    }
  },
  methods: {
    handleCheckChange(data, checked, indeterminate) {

    },
    confirmRole(formName){
        let _this = this
        let postObj = this.prole
        let roleArr = this.$refs.tree.getCheckedNodes()
        if(roleArr.length!=0) {
            let resourceArr = []
            roleArr.forEach(item=>{
                resourceArr.push(item.resourceId)
            })
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.isEdit) {
                        editRole({'role':postObj,'resourceIds':resourceArr}).then(ret => {
                            if(ret.result){
                                this.$refs[formName].clearValidate()
                                _this.success(ret.msg)
                                this.$router.go(-1)
                            }else{
                                _this.error(ret.msg)
                            }
                        }).catch((error) => {
                            _this.error(error.msg)
                        });
                    }else {
                        addRole({'role':postObj,'resourceIds':resourceArr}).then(ret => {
                            if(ret.result){
                                this.$refs[formName].clearValidate()
                                _this.success(ret.msg)
                                this.$router.go(-1)
                            }else{
                                _this.error(ret.msg)
                            }
                        }).catch(error => {
                            _this.error(error.msg)
                        });
                    }
                }else {
                    return false;
                }
            })
        }else{
            _this.error('请选择权限')
            return
        }

    },
    getData(data) {
        let _this = this;
        roleMenuTree(data).then(ret => {
            if(ret&&ret.code==200){
                this.ids = ret.data.productMenuIds
                this.$refs.tree.setCheckedKeys(this.ids);
            }
        }).catch(() => {
        });
    },
    getCheckedNodes() {
      this.flag = false
      this.form.orgUid = this.$refs.tree.getCheckedNodes()[0].text
    },
    out(){
      this.$router.go(-1)
    }
  }
};
</script>

<style  type="text/css" lang="scss" scoped>
    .content-wrapper {
        height: 100%;

        .breadcrumb {
            padding: 9px 0 9px 3px;

            .el-breadcrumb {
                span {
                    font-size: 14px;
                }
            }
        }
        .form-group{
             //  width: calc(100% - 120px);
             width:680px;
             .twice-item {
                 display: flex;
                 .child-item-left{
                     flex:0 0 360px;
                     margin-right:16px;
                 }
                 .child-item-right{
                     flex:1;
                 }
             }
         }
        .org-wrap {
            width: 100%;
            //   min-width: 1245px;
            // 左边
            .org-left {
                box-sizing: border-box;
                width: 620px;
                // width: 72%;
                height: 809px;
                // background: #f0f0f0;
                padding-left: 25px;
                padding-top: 24px;
                display: inline-block;
                .header-wrap {
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
                        .el-button--primary {
                            width: 80px;
                            height: 30px;
                            padding-top: 7px;
                            span {
                                font-size: 12px;
                            }
                        }
                    }
                    .right-offset {
                        float: right;
                        margin-right: 16px;
                        span {
                            font-size: 12px;
                            margin-left: -12px;
                            vertical-align: middle;
                            .icon-neiye-tianjia {
                                margin-right: 5px;
                                font-size: 10px;
                                margin-top: -2px;
                                display: inline-block;
                            }
                        }
                    }
                }
                .org-sys {
                    margin-top: 24px;
                    .el-tree {
                        // background: #f0f0f0;
                        font-size: 12px;
                        .el-tree-node__content {
                            .custom-tree-node {
                                width: 100%;
                                .org-button-wrap {
                                    .el-button {
                                        padding: 0;
                                        margin-right: 10px;
                                        margin-left: 0px;
                                    }
                                    display: none;
                                    float: right;
                                    span {
                                        font-size: 12px;
                                    }
                                }
                            }
                        }
                        .el-tree-node__content:hover {
                            background-color: #3b74ff;
                            .custom-tree-node {
                                color: #ffffff;
                                .org-button-wrap {
                                    display: inline-block;
                                    span {
                                        color: #ffffff;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

</style>
