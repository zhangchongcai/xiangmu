<template>
   <el-dialog title="影院选择" :visible.sync="opendialog" width="448px" 
      :lock-scroll="false">
       <el-tree :data="data" node-key="id" default-expand-all :expand-on-click-node="false"
        :render-content="renderContent" v-loading="this.loading"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmSelect">确 定</el-button>
        <el-button @click="opendialog=false">取 消</el-button>
      </span>
    </el-dialog>
</template>
<script>
  //转换后台json结构为element可用的结构
  function changeTreeJson(valArr) {
    let newValArr = [];
    valArr.forEach(function (val) {
      let treeNode = {};
      treeNode.cinemaUID = val.id;
      treeNode.orgName =
        val.children != null ?
        val.orgName :
        val.fullName != null ?
        val.fullName :
        val.orgName;
      if (val.children != null) {
        let childrenArr = changeTreeJson(val.children);
        treeNode.children = childrenArr;
      }
      newValArr.push(treeNode);
    });
    return newValArr;
  }
  export default {
    data() {
      return {
        data:'',
        opendialog:false,
        loading: false,
        chooseItem:{}
      }
    },

    methods: {
      getCurrentNode(val){
        this.chooseItem = val || {};
        // console.log(this.chooseItem)
      },
      confirmSelect(){
        let a = JSON.stringify(this.chooseItem)
        if(a == '{}'){
            this.$confirm('您尚未选择影院是否退出', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(()=> this.opendialog = false)  
            .catch(()=> this.opendialog = true)
        }else{
          this.opendialog = false;
          // console.log(this.$store.state.csm)
          this.$store.commit("csmChangeCinemaUid",this.chooseItem.cinemaUID)
          this.$emit("callback",this.chooseItem)
        }
      },
      selectTreeEvent() {
        // let self = this;
        //只请求一次数据
        if (this.data.length <= 0) {
          //加载旋转圈圈
          this.loading = true;
          //调用api，展示影院树
          let limit = {
             
              type: 2,
              pageSize: 1000,
              pageNum: 1
          }
          this.$csmList
            .getCinemaByParam(Object.assign({},limit))
            .then(data => {
              const treeValue = data.data;
              this.data = changeTreeJson(treeValue.rows);
              this.$emit("firstCinema",this.data[6])
              Vue.nextTick( ()=>{
                  setTimeout(() => {
                    this.loading = false;
                  }, 1000);
              });
            })
            .catch(msg => {
              console.log(msg);
            });
        }
      },
      renderContent(h, { node, data, store }) {
        // console.log(node, data, store)
        if(node.childNodes.length == 0 && data.cinemaUID){
          return (
            <span class="custom-tree-node">
              <input type="radio"  name="isSelect" value={data.cinemaUID}  on-change={()=> this.getCurrentNode(data)} />
              <span> {data.orgName}</span>
            </span>);
        }else{
          return (
            <span class="custom-tree-node">
              <span>{data.orgName}</span>
            </span>);
        }
      }
    },
    mounted(){
      this.selectTreeEvent()
    }
    
  };
</script>
<style lang="scss" scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
   /deep/ .el-dialog{
    .el-dialog__header{
      padding: 16px 20px 12px;
      &::after{
        display: block;
        content: "";
        width:408px !important;
        height: 1px;
        margin-top: 5px;
        background-color: #E5E5E5;
      }
      .el-dialog__close{
        font-size: 18px;
      }
    }
    .el-dialog__body{
      height: 460px;
      overflow-y: scroll;
      padding: 0 20px;
      .el-tree-node__label{
        font-size: 12px;
        color: #666666;   
      }
    }
    .el-dialog__footer{
      padding: 0 0 12px;
      &::before{
        display: block;
        content: "";
        width:448px;
        height: 1px;
        margin-bottom: 12px;
        background-color: #E5E5E5;
      }
    }
    button{
      span{
        font-size: 12px;
      }
    }
  }
</style>