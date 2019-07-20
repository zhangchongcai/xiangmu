<template>
  <div class="tree-ccm-dialog">
    <el-dialog title="选择商品分类" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false">
      <div class="tree-content">
        <el-tree
            :data="merClassArr"
            default-expand-all
            node-key="seq"
            ref="tree"
            :props="defaultProps"
            :render-content="renderContent"
            @node-click="handleNodeClick" 
            :close-on-click-modal="false"
        ></el-tree>
      </div>
      <div class="btn-area" slot="footer" >
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="chooseUser" style="margin-right:22px;">确定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import {cusList} from "frame_cpm/http/interface.js"
  export default {
    props: {
      customerType:{
        default:''
      }
    },
    data() {
      return {
        dialogVisible:false,
        merClassArr:[],
        defaultProps: {
            children: "children",
            label: "name"
        },
        selectItem:'',
        activeUid:'22',
      }
    },
    methods: {
        //树的重新构建
        renderContent(h, { node, data, store }) {
          console.log(data)
            const _this = this;
            if(data.children && data.children.length){
              return(
                <div>
                  {data.name}
                </div>
              )
            }else{
              return (
                  <div class="grounp-radio">
                    <label class="choose-box">
                      <input type="radio"  id={`input${data.uid}`} class="input_Class" ref={`${data.uid}`}
                      onClick={()=>{this.handleSelft(node,data,data.uid)}}/>
                    </label>
                    {data.name}
                  </div>
                )
              
            }
        },
        handleSelft(node,data,id) {
          let radioArr = document.querySelectorAll('.grounp-radio input')
          for(var i=0;i<radioArr.length;i++){
            if(radioArr[i].id == 'input'+ data.uid){
              continue
            }
            radioArr[i].checked = false
          }
          node.checked  =  true
        },
        handleNodeClick(item) {
          console.log(item)
          if(item.children && item.children.length) {
            console.log('有chidren')
            return
          }
          let radioArr = document.querySelectorAll('.grounp-radio input')
          for(var i=0;i<radioArr.length;i++){
            if(radioArr[i].id == 'input'+item.uid){
              let seft = document.querySelector(`#input${item.uid}`)
              seft.setAttribute("checked",'checked')
              seft.checked = true
              this.selectItem = item 
              continue
            }
            radioArr[i].checked = false
          }
        },
        // 确定选择
        chooseUser() {
            console.log('选择：',this.selectItem)
            this.$emit("merClassSingleCallBack", this.selectItem);
            this.dialogVisible = false;
        },
        //打开弹窗
        openDialog(val){
            this.dialogVisible=val
            this.searchData()
        },
        // 查询
        searchData(uid) {
            let proClass = { uid: uid };
            this.$cimList.getCategoryTrees(proClass).then(res => {
            if (res.code === 200) {
                let merClassData = [];
                merClassData.push(res.data);
                this.merClassArr = JSON.parse(JSON.stringify(merClassData));
                console.log(this.merClassArr);
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
  .tree-ccm-dialog{
    .film-top{
        position: relative;
        margin-left:8px;
    }
    .el-dialog {
        .el-dialog__body{
          padding: 20px 15px;
          width: 90%;
          margin: auto;
          border-top:1px solid #ccc;
          border-bottom:1px solid #ccc;
        }
    }
    .tree-content{
      height: 380px;
      overflow: auto;
    }
    .grounp-radio{
      margin-left: 5px;
    }
    .el-tree-node__expand-icon.is-leaf{
      display: none
    }
    .pagation,.btn-area{
      padding-top: 10px;
      text-align: center
    }

    .grounp-radio{
      .choose-box{
        padding-left:10px;
        position:relative;
        display:inline-block;
        height:40px;
        line-height:40px;
      }
      .choose-box input[type="radio"]::before{
          content:'';
          display:inline-block;
          width:12px;
          height:12px;
          border-radius:50%;
          border:1px solid #DCDFE6;
          background: #FFFFFF;
          margin-right:15px;
          position:absolute;
          top:13px;
          left:0;
      }
      .choose-box input[type="radio"]:checked::before{
          background-clip: content-box;
          background-color: white;
          border:5px solid #3B74FF;
          width:0px;
          height:0px;
          padding:2px;
      }
      .choose-box input[type="radio"]{
          width:0;
          height:0;
      }
    }
}

</style>