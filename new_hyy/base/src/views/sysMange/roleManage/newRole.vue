<template>
  <div class="content-wrapper">
    <div class="form-wrapper">
      <el-form ref="prole" :model="prole" :rules="rules" :inline="true" label-width="94px">
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model.trim="prole.name" placeholder="" :disabled="isJustSee"></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="status" v-auth="'system_roleManage_enableDisabling'">
          <el-radio-group v-model="prole.status" :disabled="isJustSee">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述：" prop="remark">
          <el-input v-model="prole.remark" :disabled="isJustSee"></el-input>
        </el-form-item>
        <el-form-item style="width:100%" label="权限设置：" prop="resource">
          <div class="role-tree" style="border:1px solid #ccc; padding:10px;">
            <div v-if="loading" style="text-align: center;color:#606266">
              <i class="el-icon-loading"></i>
              <span>加载中</span>
            </div>
            <el-tree v-else :data="data5" node-key="id" ref="tree" :props="defaultProps" default-expand-all :show-checkbox="isShowCheckbox" :expand-on-click-node="false" :default-checked-keys='ids' @check-change="handleCheckChange">
              <span class="custom-tree-node" slot-scope="{ node, data }" :class="{'menuType':data.menuType == 5}">
                <span>
                  {{ node.label }}
                </span>
              </span>
            </el-tree>
          </div>
        </el-form-item>
        <el-form-item style="width:100%;text-align: center">
          <el-button type="primary" @click="confirmRole('prole',false)" v-if="isSee">保存</el-button>
          <el-button @click="out" v-if="isSee">取消</el-button>
          <el-button @click="out" type="primary" v-else>返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { addRole, roleMenuTree, editRole, roleListTree } from 'baseSrc/http/interface.js';
import mixins from '../../../mixins/cacheMixin.js';
export default {
  name: 'newRole',
  mixins: [mixins.cacheMixin],
  data () {
    let resource = (rule, value, callback) => {
      if (this.prole.resource.length == 0) {
        callback(new Error('请勾选权限控制'));
      } else {
        callback();
      }
    };
    let loginName = (rule, value, callback) => {
      let nameReg = /^[\u4E00-\u9FA5A-Za-z0-9`~!@#$%^&*()_+<>?:"{},.【】\\/;\-'[\]\s\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]{1,20}$/;
      if (!value) {
        return callback(new Error('角色名称不能为空'));
      } else {
        if (!nameReg.test(value)) {
          callback(new Error('请输入字母、数字或者汉字，长度在20个字符以内'));
        } else {
          callback();
        }
      }
    };
    let remark = (rule, value, callback) => {
      let nameReg = /^[\u4E00-\u9FA5A-Za-z0-9\s\·\~\！\@\#\￥\%\……\&\*\（\）\——\-\+\=\【\】\{\}\、\|\；\‘\’\：\“\”\《\》\？\，\。\、\`\~\!\#\$\%\^\&\*\(\)\_\[\]{\}\\\|\;\'\'\:\"\"\,\.\/\<\>\?]{1,100}$/;
      if (value) {
        if (!nameReg.test(value)) {
          callback(new Error('请输入字母、数字或者汉字，长度在100个字符以内'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      cacheField: ['prole'],
      isJustSee: false,
      isSee: true,
      isEdit: false,
      isShowCheckbox: true,
      level: '新建角色',
      id: null,
      data5: [],
      prole: {
        name: null,
        status: '1',
        remark: null,
        resource: []
      },
      rules: {
        name: [
          { validator: loginName, required: true, trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择角色状态', trigger: 'blur' }
        ],
        remark: [
          { validator: remark, trigger: 'blur' }
        ],
        resource: [
          { required: true, validator: resource, trigger: 'blur' }
        ]

      },
      currentPage: 1,
      total: '' || 1,
      size: 10,
      pages: '' || 1,
      name: '',
      multipleSelection: [],
      postObj: {
        menuName: null,
        productCode: null, // 系统类型 1 后端，2 POS，3 APP
        productVersion: null,
        parentId: null
      },
      treeData: [],
      defaultProps: {
        children: 'submenu',
        label: 'menuName'
      },
      ids: [],
      loading: true
    };
  },
  created () {
    this.getMenu();
    this.isEdit = this.$route.query.isEdit ? true : false;
    this.isJustSee = this.$route.query.isJustSee ? true : false;
    this.level = this.$route.name;
  },
  mounted () {
    if (this.isEdit) {
      this.isSee = true;
      this.isJustSee = false;
      this.prole = JSON.parse(localStorage.getItem('roleEdit'));
      this.prole.status = this.prole.status.toString();
      this.getData(this.$route.query.roleUid);
    } else if (this.isJustSee) {
      this.isSee = this.isEdit = false;
      this.prole = JSON.parse(localStorage.getItem('roleEdit'));
      this.prole.status = this.prole.status.toString();
      this.getData(this.$route.query.roleUid);
    } else {
      this.isSee = true;
      this.isJustSee = this.isEdit = false;
    }
  },
  methods: {
    changeCss () {
      let menuType = document.getElementsByClassName('menuType');
      console.log(menuType);
      /* for (var i = 0; i < levelName.length; i++) {
         console.log(11111111)
         // cssFloat 兼容 ie6-8  styleFloat 兼容ie9及标准浏览器
         levelName[i].parentNode.style.cssFloat = 'left' // 最底层的节点，包括多选框和名字都让他左浮动
         levelName[i].parentNode.style.styleFloat = 'left'
       } */
    },
    getMenu () {
      roleListTree().then(ret => {
        if (ret && ret.code == 200) {
          this.loading = false;
          this.data5 = ret.data;
          // this.changeCss()
          if (this.isJustSee) {
            this.formateTree(this.data5, node => node.id != false);
          }
        } else {
          this.error(ret.msg);
        }
      }).catch(() => {
        this.error('网络出错，请稍后再试');
      });
    },
    handleCheckChange (data, checked, indeterminate) {

    },
    formateTree (nodes, predicate) {
      // 如果已经没有节点了，结束递归
      if (!(nodes && nodes.length)) {
        return [];
      }
      const newChildren = [];
      for (const node of nodes) {
        if (predicate(node)) {
          node.disabled = true;
          // 如果节点符合条件，直接加入新的节点集
          newChildren.push(node);
          node.submenu = this.formateTree(node.submenu, predicate);
        } else {
          node.disabled = true;
          // 如果当前节点不符合条件，递归过滤子节点，
          // 把符合条件的子节点提升上来，并入新节点集
          newChildren.push(...this.formateTree(node.children, predicate));
        }
      }
      return newChildren;
    },
    confirmRole (formName) {
      let _this = this;
      let postObj = this.prole;
      let roleArr = this.$refs.tree.getCheckedNodes();
      let resourceArr = [];
      roleArr.forEach(item => {
        resourceArr.push(item.resourceId);
      });
      this.prole.resource = resourceArr;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            editRole({ 'role': postObj, 'resourceIds': resourceArr }).then(ret => {
              if (ret.result) {
                this.$refs[formName].clearValidate();
                _this.success('修改成功');
                this.$store.commit('tagNav/removeTagNav', this.$route);
                this.$router.go(-1);
                this.prole = {};
              } else {
                _this.error(ret.msg);
              }
            }).catch(() => {

            });
          } else {
            addRole({ 'role': postObj, 'resourceIds': resourceArr }).then(ret => {
              if (ret.result) {
                this.$refs[formName].clearValidate();
                _this.success('新建成功');
                this.$store.commit('tagNav/removeTagNav', this.$route);
                this.$router.go(-1);
                this.prole = {};
              } else {
                _this.error(ret.msg);
              }
            }).catch(() => {

            });
          }
        } else {
          return false;
        }
      });
    },
    getData (data) {
      let _this = this;
      roleMenuTree(data).then(ret => {
        if (ret && ret.code == 200) {
          this.ids = ret.data.productMenuIds;
          this.$refs.tree.setCheckedKeys(this.ids);
        }
      }).catch(() => {
      });
    },
    getCheckedNodes () {
      this.flag = false;
      this.form.orgUid = this.$refs.tree.getCheckedNodes()[0].text;
    },
    out () {
      this.$store.commit('tagNav/removeTagNav', this.$route);
      this.$router.go(-1);
      this.prole = {};
    }
  }
};
</script>
<style lang="scss">
.role-tree {
  .el-tree-node__content:hover {
    background-color: #3b74ff !important;
    color: #ffffff;
  }
}
</style>
<style lang="scss" scoped>
.content-wrapper {
  height: 100%;
  .el-tree {
    max-height: 500px;
    overflow-y: scroll;
    /* .custom-tree-node {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 12px;
                padding-right: 8px;
                .org-button-wrap {
                    span {
                        font-size: 12px;
                    }
                }
            }*/
  }
}
</style>
