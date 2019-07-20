<template>
  <div class="ccm-dialog">
    <el-dialog title="选择组织节点或影院" 
    :visible.sync="dialogVisible" 
    width="50%"
    :close-on-click-modal="false"
    >
      <el-form label-width="" :inline="true">
      </el-form>
          <div class="tree-content">
            <el-tree
                    :data='orgArr'
                    ref="tree"
                    @node-click="handleNodeClick"
                    node-key="id"
                    default-expand-all
                    :expand-on-click-node="false"
                    :highlight-current="true"
                    :props="defaultProps"
            >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                <span class="org-button">
                    <i class="el-icon-menu" v-if="data.isCinema==0||data.isCinema==null"></i>
                    <i class="el-icon-document" v-else></i>
                    {{data.text}}
                  </span>
                </span>
            </el-tree>
        </div>
      <div class="btn-area" slot="footer" >
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="chooseUser" style="margin-right:22px;">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  // import {orgList} from 'frame_cpm/http/interface.js'
  export default {
    props: {
      customerType:{
        default:''
      }
    },
    data() {
      return {
        dialogVisible:false,
        orgArr:[],
        defaultProps: {
            children: "children",
            label: "text"
        },
        selectItem:'',
        activeUid:'22',
      }
    },
    methods: {
        handleSelft(node,data,id) {
          let radioArr = document.querySelectorAll('.grounp-radio input')
          for(var i=0;i<radioArr.length;i++){
            radioArr[i].checked = false
          }
          node.checked  =  true
        },
        handleNodeClick(item) {
            console.log('点击',item)
            this.selectItem = item 
        },
        // 确定选择
        chooseUser() {
            this.$emit("cinemaCallBack", this.selectItem);
            this.dialogVisible = false;
        },
        //打开弹窗
        openDialog(val){
            this.dialogVisible=val
            this.searchData()
        },
        // 查询
        searchData(uid) {
            // orgList().then(res => {
            let params = {
              userUid:JSON.parse(localStorage.getItem('user')).uid, //商户id,
            }
            this.$ccmList.getOrgTreeAndCinema(params).then(res => {
            if (res.code === 200) {
                this.orgArr = res.data
            } else {
                this.error(res.msg);
            }
            })
            .catch(err => {});
        },
      
    },
  }
</script>

<style lang="scss">
  .ccm-dialog{
    .film-top{
        position: relative;
        margin-left:8px;
    }
    .tree-content{
      height: 400px;
      overflow: auto;
    }
    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
      background-color:#3b74ff;
      color: #fff; 
    }
    .el-dialog__header{
      .el-dialog__title{
          padding-bottom: 5px;
          width: 100%;
          display: inline-block;
          border-bottom: 1px solid #e5e5e5;
      }
    }
}

</style>