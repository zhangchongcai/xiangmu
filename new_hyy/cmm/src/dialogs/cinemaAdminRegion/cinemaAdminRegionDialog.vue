<template>
  <div class="my_dialog">
    <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="mydialogTableVisible">
      <el-form label-width="" :inline="true">
        <div style="position:relative">
          <el-form-item label="区域编码:" class="two_search">
            <el-input v-model="regionCode" style="width:152px" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="区域名称:">
            <el-input v-model="regionName" style="width:184px" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="状态:">
            <el-select v-model="regionStatus" style="width:184px">
              <el-option label="全部" value>全部</el-option>
              <el-option label="停用" value="0">停用</el-option>
              <el-option label="启用" value="1">启用</el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" style="margin:4px 0;" @click="searchUser">查询</el-button>
        </div>
      </el-form>
      <!-- highlight-current-row  -->
      <div class="choose_table">
        <div>
          <el-table :data="tableList" :cell-style={padding:0} :row-style={height:30} :header-cell-style={padding:0} ref="multipleTable" @select-all="selectAll" :row-key="getRowKeys" @selection-change="select">
            <!-- <el-table-column width="39">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.checked"></el-checkbox>
                <el-radio v-model="templateRadio" :label="scope.$index">&nbsp;</el-radio>
              </template>
            </el-table-column> -->
            <el-table-column type="selection" width="40" :reserve-selection="true"></el-table-column>
            <el-table-column property="code" label="区域编码" width="196"></el-table-column>
            <el-table-column property="placeName" label="区域名称" width="196"></el-table-column>
            <el-table-column property="status" label="状态" width="196">
              <template slot-scope="scope">
                <div class="info">
                  {{scope.row.status==0?"停用":""}}
                </div>
                <div class="success">
                  {{scope.row.status==1?"启用":""}}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="cmm-block-pagination">
            <el-pagination @current-change="handleCurrentChange" background :current-page.sync="pageData.pageNum" :page-size="pageData.size" layout="total,prev, pager, next, jumper" :total="pageData.total">
            </el-pagination>
          </div>
        </div>
        <div class="choose_ul">
          <p class="ul_header">
            <span>已选内容：</span>
            <span style="color: #3B74FF;cursor: pointer;" @click="clearSelection">清空</span>
          </p>
          <ul class="ul_body has-page">
            <li v-for="(item,index) in chooseItem" :key="index">
              <span>{{item.placeName}}</span>
              <span class="delate_span" @click="delateSpan(item)"> <i class="el-icon-close"></i></span>
            </li>
          </ul>
        </div>
      </div>
      <div style="height:12px;background:transparent;"></div>
      <div class="btn-area">
        <el-button type="primary" @click="chooseUser" style="margin-right:22px;">确定</el-button>
        <el-button @click="mydialogTableVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCinemaAdminRegionList } from "cmmSrc/http/interface.js"
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
  },
  data () {
    return {
      regionCode: "",
      regionName: "",
      regionStatus: "",
      mydialogTableVisible: this.dialogTableVisible,
      chooseItem: [],
      rows: [],
      tableList: [],
      pageData: {
        pageNum: 1,
        total: 0,
        size: 10,
      },
    }
  },
  methods: {
    //获取row的key值
    getRowKeys (row) {
      return row.id
    },
    // 点击选择数据（暂时储存的数据）
    select (selection, row) {
      if (selection && selection instanceof Array) {
        console.log(selection)
        this.chooseItem = selection;
      }
    },
    // 全选
    selectAll (selection) {
      if (selection && selection instanceof Array) {
        this.chooseItem = selection;
      }
    },
    // 确定选择
    chooseUser () {
      this.$emit("callBack", this.chooseItem);
      this.mydialogTableVisible = false;
    },
    //打开弹窗
    openDialog (val) {
      this.mydialogTableVisible = val
      this.getCinemaAdminRegionList()
    },
    // 页面改变
    handleCurrentChange (val) {
      this.pageData.pageNum = val
      console.log(val)
      this.getCinemaAdminRegionList()
    },
    // 查询
    searchUser () {
      this.getCinemaAdminRegionList()
    },
    // 删除
    delateSpan (item) {
      console.log(item)
      if (item) {
        this.$refs.multipleTable.toggleRowSelection(item);
      }
    },
    clearSelection () {
      this.$refs.multipleTable.clearSelection();
      this.chooseItem = []
    },
    //获取影院列表
    getCinemaAdminRegionList () {
      let params = {
        placeName: this.regionName,// 可空，模糊匹配，销售地点名称
        code: this.regionCode,//可空，精确匹配，销售地点编码
        pageNum: this.pageData.pageNum,//可空，默认1，当前页数
        pageSize: this.pageData.size,//可空，默认10000，每页记录数
        // cinemaUid:this.cinemaUid,//可空，精确匹配，影院UID
        status: this.regionStatus//可空，精确匹配，状态，0：停用，1：启用
      }
      getCinemaAdminRegionList(params).then(res => {
        if (res.data && res.code == 200) {
          this.tableList = res.data.list
          this.pageData.total = res.data.total
          // this.selectData()
        }

      })
    },
    selectData () {
      this.innerData.forEach(element => {
        for (let i = 0; i < this.tableList.length; i++) {
          if (element.code == this.tableList[i].code)
            this.$refs.multipleTable && this.$refs.multipleTable.toggleRowSelection(
              this.tableList[i],
              true
            );
          console.log('11')
          // this.chooseItem.push(this.tableList[i])
          // break

        }
      });
    },

  },
  watch: {
    dialogTableVisible (val) {
      this.mydialogTableVisible = val;
      this.regionCode = "";
      this.regionName = "";
      this.regionStatus = "";
      this.chooseItem = [];
      this.tableList = []
      this.$refs.multipleTable.clearSelection();
      console.log(this.rows)
    },

    mydialogTableVisible (val) {
      // this.mydialogTableVisible = val;
      // if(!val){
      //    this.cinemaCode = "";
      // this.cinemaName = "";
      // this.chooseItem = [];
      // this.tableList=[]
      // this.$refs.multipleTable.clearSelection();
      // console.log(this.rows)
      // }

      // this.$emit("changeDialogTableVisible", val)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/dialogs.scss";
</style>