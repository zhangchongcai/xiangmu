<template>
  <div class="my_dialog">
    <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="mydialogTableVisible">
      <!-- 查询 -->
      <el-form label-width="" :inline="true">
        <div style="position:relative">
          <el-form-item label="影院编码:" label-width="80px" class="two_search">
            <el-input v-model="cinemaCode" style="width:152px" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="影院名称:" label-width="80px">
            <el-input v-model="cinemaName" style="width:184px" placeholder="请输入"></el-input>
          </el-form-item>
          <el-button type="primary" style="margin:4px 0;" @click="search">查询</el-button>
        </div>
      </el-form>
      <!-- 列表区域 -->
      <div class="choose_table">
        <div>
          <!-- 列表 -->
          <el-table :data="tableList" :cell-style={padding:0} :row-style={height:30} :header-cell-style={padding:0}
            ref="multipleTable" @select-all="handleSelect"  :row-key="getRowKeys"  @select="handleSelect">
            <el-table-column type="selection" width="40" :reserve-selection="true" ></el-table-column>
            <el-table-column property="code" label="影院编码" width="294"></el-table-column>
            <el-table-column property="name" label="影院名称" width="294"></el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="block">
            <el-pagination @current-change="handleCurrentChange" background :current-page.sync="pageData.pageNum"
              :page-size="pageData.size" layout="total,prev, pager, next, jumper" :total="pageData.total">
            </el-pagination>
          </div>
        </div>
        <!-- 选中内容 -->
        <div class="choose_ul">
          <p class="ul_header">
            <span>已选内容：</span>
            <span style="color: #3B74FF;cursor: pointer;" @click="clearSelection">清空</span>
          </p>
          <ul class="ul_body has-page">
            <li v-for="(item,index) in chooseItem" :key="index">
              <span>{{item.name}}</span>
              <span class="delate_span" @click="delateSpan(item)"> <i class="el-icon-close"></i></span>
            </li>
          </ul>
        </div>
      </div>
      <div style="height:12px;background:transparent;"></div>
      <!-- 底部按钮 -->
      <div class="btn-area">
        <el-button type="primary" @click="chooseCommit" style="margin-right:22px;">确定</el-button>
        <el-button @click="mydialogTableVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getCinemaList} from "cmm/http/interface.js"
export default {
  props: {
    dialogTableVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "父组件尚未传值"
    },
    // innerData:{
    //   type: Array,
    //   default:[
    //     {
    //       name:"上海自由人青浦宝龙广场",
    //       code:"31173901",
    //       reviewFlag:"review"
    //     },
    //     {
    //       name:"北京望京新天地",
    //       code:"11056701",
    //       reviewFlag:"review"
    //     },
    //     {
    //       name:"大地数字影院上海松江飞航",
    //       code:"31163701",
    //       reviewFlag:"review"
    //     },
    //     {
    //       name:"大地影院广州石碁城市广场",
    //       code:"44001161",
    //       reviewFlag:"review"
    //     },
    //   ]
    // }
  },
  data() {
    return {
      cinemaCode:"",
      cinemaName:"",
      userUid:JSON.parse(localStorage.getItem('user')).uid,
      mydialogTableVisible: this.dialogTableVisible,
      chooseItem:[],
      tableList:[],
      pageData:{
        pageNum:1,
        total:0,
        size:10,
      },
    }
  },
  watch: {
    dialogTableVisible(val) {
      this.mydialogTableVisible = val;
      this.cinemaCode = "";
      this.cinemaName = "";
      this.chooseItem = [];
      this.tableList=[]
      try{
        this.$refs.multipleTable.clearSelection();
      }catch(error){
        console.log(error)
      }
    },
  },
  methods: {
    //获取row的key值
    getRowKeys(row){
      return row.id
    },
    //查询
    search() {
      this.getCinemaList()
    },
    //获取影院列表
    getCinemaList(){
      let params={
        name:this.cinemaName,
        code: this.cinemaCode,
        pageNum: this.pageData.pageNum,
        pageSize: this.pageData.size,
        userUid:this.userUid
      }
      getCinemaList(params).then(res=>{
        if(res.data && res.code==200){
          this.tableList=res.data.rows || []
          this.pageData.total=res.data.total || 0
          this.rowMultipleChecked(this.chooseItem)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //回显
    rowMultipleChecked(selectedArr) {
      if (selectedArr.length != 0) {
        for (let i = 0; i < selectedArr.length; i++) {
          for (let k = 0; k < this.tableList.length; k++) {
            if (selectedArr[i].code == this.tableList[k].code) {
              if(selectedArr[i].reviewFlag=="review"){
                this.$refs.multipleTable.toggleRowSelection(
                  this.tableList[k],
                  true
                );
              }
              selectedArr[i]=this.tableList[k]
              break;
            }
          }
        }
      }else{
        try{
          this.$refs.multipleTable.clearSelection();
        }catch(error){
          console.log(error)
        }
      }
    },
    //手动选择
    handleSelect(selection, row) {
      if (row) {
        //点击单选
        this.rowOneToggle(row);
      } else {
        //点击全选
        if (selection.length == 0) {
          for (let index = 0; index < this.tableList.length; index++) {
            const item = this.tableList[index];
            this.rowOneRemove(item);
          }
        } else {
          for (let j = 0; j < selection.length; j++) {
            const selectionItem = selection[j];
            this.rowOneAdde(selectionItem);
          }
        }
      }
      console.log("this.choose",this.chooseItem)
    },
    //手动选择-单一数据toggle
    rowOneToggle(row) {
      for (let index = 0; index < this.chooseItem.length; index++) {
        if (row.code == this.chooseItem[index].code) {
          this.chooseItem.splice(index, 1);
          return;
        }
      }
      this.chooseItem.push(row);
    },
    //手动选择-单一数据add
    rowOneAdde(row) {
      for (let index = 0; index < this.chooseItem.length; index++) {
        if (row.code == this.chooseItem[index].code) {
          return;
        }
      }
      this.chooseItem.push(row);
    },
    //手动选择-单一数据reomove
    rowOneRemove(row) {
      for (let index = 0; index < this.chooseItem.length; index++) {
        if (row.code == this.chooseItem[index].code) {
          this.chooseItem.splice(index, 1);
          return;
        }
      }
    },
    //点击确定按钮
    chooseCommit() {
      this.$emit("callBack", this.chooseItem);
      this.mydialogTableVisible = false;
    },
    //打开弹窗
    openDialog(val,reviewList){
      //初始化页面
      this.pageData={
        pageNum:1,
        total:0,
        size:10,
      },
      //显示弹窗
      this.mydialogTableVisible=val
      //回显
      if(reviewList){
        this.chooseItem= (reviewList.length==0)? [] :JSON.parse(JSON.stringify(reviewList)) 
      }else{
        this.chooseItem=[]
      }
      //清除以前选项
      try{
        if(this.$refs.multipleTable){
          this.$refs.multipleTable.clearSelection();
        }
      }catch(error){
        console.log(error)
      }
      //请求
      this.getCinemaList()
    },
    //页面改变
    handleCurrentChange(val) {
      this.pageData.pageNum=val
      console.log(val)
      this.getCinemaList()
    },
    //删除
    delateSpan(item){
      console.log(item)
      if (item) {
        this.$refs.multipleTable.toggleRowSelection(item,false);
        for (let i=this.chooseItem.length-1;i>=0;i--) {
          if(this.chooseItem[i].code==item.code){
            this.chooseItem.splice(i,1)
            break;
          }
        }
      }
    },
    //清空
    clearSelection(){
      try{
        this.$refs.multipleTable.clearSelection();
      }catch(error){
        console.log(error)
      }
      this.chooseItem = []
    },
    
  },
}
</script>

<style lang="scss" scoped>
  @import "../../assets/dialogs.scss";
</style>