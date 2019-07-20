<template>
  <div class="org-list-wrap">
    <div class="modal-search">
         <div class="org-left">
            <div class="header-wrap">
              <div class="search-wrap">
                <span>查询组织：</span>
                <el-input size="small" placeholder="请输入查询内容" prefix-icon="el-icon-search" v-model="name"></el-input>
              </div>
              <div class="button-wrap">
                <el-button type="primary" size="small" @click="getDatas">搜索</el-button>
              </div>
            </div>
            <div class="org-sys">
              <el-tree
                   @node-click="handleNodeClick"
                   :filter-node-method="filterNode"
                    :data="dataTree"
                    node-key="id"
                    ref="tree"
                    highlight-current
                    default-expand-all
                    :expand-on-click-node="false"
                    :props="defaultProps">
              </el-tree>
            </div>
          </div>
    </div>
    <div class="confirm-cancel">
	    <el-button @click="cancel(false)">取 消</el-button>
	    <el-button type="primary" @click="chosenOneOrg()">确 定</el-button>
    </div>

  </div>
</template>
<script>
import {organizationList,listOrganizationCinema,cinemaBinding} from 'frame_cpm/http/interface.js'
export default {
  name: "addOrg",
  data() {
    return {
    name:'',
      dataTree: [],
      defaultProps: {
          children:'children',
          label:'text'
    },
    resultOneOrg:''
    };
  },
  props: ['getOneOrgChosen','dialogVisible_orgListChange'],
  watch: {
  },
  methods: {
    confirm(){
      console.log('this.orgUid:',this.orgUid)
    },
    cancel(){
        this.$emit('dialogVisible_orgListChange',false)
    },
   //获取组织结构列表
    getOrgList(){
      let self = this;
      organizationList()
        .then(ret => {
            if(ret.data){
                self.dataTree = JSON.parse(JSON.stringify(ret.data))
            }else{
                self.$message(ret.msg);
            }
        })
        .catch(() => {
          console.log('网络问题，请稍后再试')
        });
    },
    //获取组织
    handleNodeClick(data) {
        this.resultOneOrg=data
    },
     //绑定组织
    chosenOneOrg(){
      let self = this;
      this.$emit('getOneOrgChosen', self.resultOneOrg)
      this.$emit('dialogVisible_orgListChange',false)
    },
    //刷新数据
    getDatas(){
      this.$refs.tree.filter(this.name);
    },
    // 过滤数据
    filterNode(value, data) {
      if (!value) return true;
      return data.text.indexOf(value) !== -1;
    },
  },
  created() {
      this.getOrgList()
  }
};
</script>
<style lang="scss">
    .el-dialog .el-dialog__header {
        padding: 15px;
    }
  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
      background: #3B74FF !important;
      color: #fff;
  }
</style>
<style lang='scss' scoped>
.org-list-wrap {
  margin-top:-30px;
  .modal-title-wrap {
    padding: 15px 30px;
    border-bottom: 2px solid #ff9f37;
    .modal-title {
      font-size: 18px;
      font-weight: bold;
      color: #808080;
    }
    .modal-close {
      float: right;
      font-size: 16px;
      // font-weight: bold;
      color: #808080;
      line-height: 27px;
      cursor: pointer;
    }
  }
  .modal-search {
    padding: 8px 0px;
    //*********************
    .org-left{
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      padding-left: 25px;
      margin-top: 39px;
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
      }
      .org-sys{
        margin-top:24px;
        .el-tree{
          font-size: 12px;
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

      }

    }
    // *************************
    .search-wrap {
          height: 32px;
          .el-input {
            width: 188px;
          }
          .childen-search{
              display: inline-block;
              .el-input {
                width:300px;
            }
          }
          span {
            color: #666666;
            font-size: 12px;
          }
          .el-textarea{
              width: 376px;
          }
          .el-textarea__inner{
              min-height: 66px;
          }
    }
    .addOrg-wrap{
        padding-left: 44px;
    }
    .plian{
      padding-right:30px;
      margin-top:12px;
    }
    .plian2{
      display: inline-block;
      padding-right:20px;
      margin-top:12px;
      margin-left: 62px
    }

  }
  // footer样式
  .role-detail-footer {
    text-align: center;
    margin: 30px auto;
  }
  .confirm-cancel{
    width: 100%;
      margin-bottom: 20px;
    text-align: center;
      .el-button--default{
        display: inline-block;
        border: 1px solid #BCBCBC;
        color: #666666
      }
    }
}
</style>
