<template>
  <div class="content-wrapper">
      <!--<div class="org-wrap">-->
        <div class="form-wrapper">
            <el-form ref="prole" :model="prole" :rules="rules" :inline="true" label-width="90px">
                <el-form-item label="角色名称:" prop="name">
                    <el-input v-model.trim="prole.name" placeholder="" :disabled="isJustSee"></el-input>
                </el-form-item>
                <el-form-item label="状态:" prop="status">
                    <el-radio-group v-model="prole.status" :disabled="isJustSee">
                        <el-radio label="1">启用</el-radio>
                        <el-radio label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="描述:" prop="remark">
                    <el-input type="textarea" v-model="prole.remark" :disabled="isJustSee"></el-input>
                </el-form-item>
                <el-form-item style="width:100%;">
                    <el-button type="primary" @click="confirmRole('prole',false)" v-if="isSee">保存</el-button>
                    <el-button @click="out" v-if="isSee">取消</el-button>
                    <el-button @click="out" type="primary" v-else>返回</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="role">
            <h2 class="tree-title" style="margin-bottom:6px;">权限设置</h2>
            <div class="role-tree" style="border:1px solid #ccc; padding:10px;">
                <div
                    v-if="loading" style="text-align: center;color:#606266"><i class="el-icon-loading"></i><span>加载中</span></div>
                <el-tree
                  v-else
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
    <!--</div>-->
  </div>
</template>

<script>
    import {addRole,roleMenuTree,editRole,roleListTree} from 'frame_cpm/http/interface.js'

export default {
  name: "newRole",
  data() {
    let loginName = (rule, value, callback) => {
      let nameReg = /^[\u4E00-\u9FA5A-Za-z0-9]{1,20}$/
      if(!value) {
        return callback(new Error('角色名称不能为空'));
      }else{
        if (!nameReg.test(value)) {
          callback(new Error('请输入字母、数字或者汉字，长度在20个字符以内'))
        } else {
          callback()
        }
      }
    }
    let remark = (rule, value, callback) => {
      let nameReg = /^[\u4E00-\u9FA5A-Za-z0-9\s\·\~\！\@\#\￥\%\……\&\*\（\）\——\-\+\=\【\】\{\}\、\|\；\‘\’\：\“\”\《\》\？\，\。\、\`\~\!\#\$\%\^\&\*\(\)\_\[\]{\}\\\|\;\'\'\:\"\"\,\.\/\<\>\?]{1,100}$/
      if(value) {
        if (!nameReg.test(value)) {
          callback(new Error('请输入字母、数字或者汉字，长度在100个字符以内'))
        } else {
          callback()
        }
      }else{
        callback();
      }
    }
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
            { validator: loginName, required: true, trigger: 'blur' },
        ],
        status: [
            {required: true ,message:'请选择角色状态', trigger: 'blur'},
        ],
        remark:[
            {validator: remark, trigger: 'blur' },
        ]
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
      loading:true
    }
  },
  created(){
    this.getMenu()
    this.isEdit = Boolean(this.$route.query.isEdit)?true:false
    this.isJustSee = Boolean(this.$route.query.isJustSee)?true:false
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
    getMenu() {
        roleListTree().then(ret=>{
          if(ret&&ret.code==200){
            this.loading = false
            this.data5 = ret.data
            if(this.isJustSee){
              this.formateTree(this.data5, node => node.id != false)
            }
          }else{
            this.error(ret.msg)
          }
        }).catch(()=>{
          this.error('网络出错，请稍后再试')
        })

    },
    handleCheckChange(data, checked, indeterminate) {

    },
    formateTree(nodes, predicate) {
      // 如果已经没有节点了，结束递归
      if (!(nodes && nodes.length)) {
        return [];
      }
      const newChildren = [];
      for (const node of nodes) {
        if (predicate(node)) {
          node.disabled = true
          // 如果节点符合条件，直接加入新的节点集
          newChildren.push(node);
          node.submenu = this.formateTree(node.submenu, predicate);
        } else {
          node.disabled = true
          // 如果当前节点不符合条件，递归过滤子节点，
          // 把符合条件的子节点提升上来，并入新节点集
          newChildren.push(...this.formateTree(node.children, predicate));
        }
      }
      return newChildren;
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
                                _this.success('修改成功')
                                this.$router.go(-1)
                            }else{
                                _this.error(ret.msg)
                            }
                        }).catch(() => {
                            _this.error('网络繁忙，请稍后再试')
                        });
                    }else {
                        addRole({'role':postObj,'resourceIds':resourceArr}).then(ret => {
                            if(ret.result){
                                this.$refs[formName].clearValidate()
                                _this.success("新建成功")
                                this.$router.go(-1)
                            }else{
                                _this.error(ret.msg)
                            }
                        }).catch(() => {
                            _this.error('网络繁忙，请稍后再试')
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
                this.$refs.tree.setCheckedKeys(this.ids)
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

<style lang="scss" scoped>
    .content-wrapper {
        height: 100%;
    }

</style>
