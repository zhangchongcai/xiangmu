<template>
  <div class="_member-level-equity-detail">
    <div class="edit-btn" v-if="!showType">
      <el-button type="primary" @click="handleEdit" plain>编辑</el-button>
    </div>
    <div class="member-level-equity" v-for="(item,parentIndex) in levelList" :key="item.id+parentIndex">
      <div class="level-header">
        <!-- <img class="header-img" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" alt=""> -->
        <span class="header-title">{{item.levelName}}</span>
      </div>
      <div class="level-bodyer">
        <!-- 自有权益 -->
        <div style="margin-bottom:8px;" v-if="item.levelEquitys && item.levelEquitys.lenght!=0">
          <div class="bodyer-title">
            自有权益
          </div>
          <div class="bodyer-content">
            <ul class="block">
              <li class="block-item" v-for="(items,index) in item.levelEquitys" :key="items.equity.id+index">
                <el-button v-if="showType" type="danger" class="block-icon-delete" icon="el-icon-remove"
                  @click="deleteItem(parentIndex,index)" circle></el-button>
                <img class="block-img" :src="items.equity.logoPic" alt="">
                <div class="block-word">{{items.equity.equityName}}</div>
              </li>
              <div class="block-item" v-if="showType">
                <el-button class="block-icon-btn" @click="handleAddEquityDialog(parentIndex,item.levelEquitys)">+
                </el-button>
                <div class="block-word ">添加</div>
              </div>
            </ul>
          </div>
        </div>
        <!-- 异益权益 -->
        <div v-if="item.otherRightlist && item.otherRightlist.lenght!=0">
          <div class="bodyer-title">
            异益权益
          </div>
          <div class="bodyer-content">
            <ul class="block">
              <li class="block-item" v-for="(items,index) in item.otherRightlist" :key="items.equity.equityName+index">
                <el-button v-if="showType" type="danger" class="block-icon-delete" icon="el-icon-remove"
                  @click="deleteItem(parentIndex,index)" circle></el-button>
                <img class="block-img" :src="items.equity.logoPic" alt="">
                <div class="block-word">{{items.equity.equityName}}</div>
              </li>
              <div class="block-item" v-if="showType">
                <el-button class="block-icon-btn" @click="handleAddEquityDialog(parentIndex)">+</el-button>
                <div class="block-word ">添加</div>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部 -->
    <div class="footer-btn-wrap" v-if="showType">
      <el-button type="primary" :disabled="btnDisabled" @click="handleCommit"
        class="_el-btn-custom _member-add-edit-save-btn">保存</el-button>
      <el-button @click="handleCancle" class="_el-btn-custom">取消</el-button>
    </div>
    <!-- 添加权益dialog -->
    <el-dialog title="自有权益" class="__equity-dialog" :visible.sync="equityDialog" width="896px">
      <div class="__table-wrap">
        <el-form :inline="true" :model="formData" ref="formData" class="__dialog-table-form">
          <el-form-item label="权益名称" prop="equityName">
            <el-input v-model="formData.equityName" placeholder="填写权益名称" clearable maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="权益类型" prop="equityType">
            <el-select v-model="formData.equityType" placeholder="全部" clearable @change="handleChangeEquityType">
              <el-option v-for="item in equityTypeList" :key="item.name" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="权益类别" prop="equityCategory" class="heightBug">
            <el-select v-model="formData.equityCategory" placeholder="全部" clearable
              :disabled="formData.equityType != 'consumer_type'" @clear="handleClearCategory">
              <el-option v-for="item in equityCategoryList" :key="item.name" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="btn-wrap">
            <el-button type="primary" @click="handleSearch" class="_el-btn-custom">搜索</el-button>
            <!-- <el-button @click="resetForm('formData')" plain class="_el-btn-custom _member-custom-ghost-button">重置
            </el-button> -->
          </el-form-item>
        </el-form>
        <div class="__equity-dialog-content-wrap">
          <div class="__equity-dialog-content-left">
            <div class="__equity-dialog-table _m-member-table-custom">
              <el-table ref="multipleTable" :data="tableData" stripe style="width: 100%" @select="handleSelect"
                @select-all="handleSelect" :row-key="getRowKeys">
                <el-table-column type="selection" width="55" :reserve-selection="true">
                </el-table-column>
                <el-table-column prop="equityName" :formatter="emptyShow" label="权益名称" min-width="120"
                  show-overflow-tooltip></el-table-column>
                <el-table-column prop="equityTypeName" :formatter="emptyShow" label="权益类型" min-width="120"
                  show-overflow-tooltip></el-table-column>
                <el-table-column prop="equityCategoryName" :formatter="equityCategoryNameShow" label="权益类别"
                  min-width="100" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
            <!-- 分页 start -->
            <div class="page-wrap _equity-dialog-paginatioin">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="formData.current-0" :page-size="formData.size-0"
                layout="total, prev, pager, next, jumper" :page-sizes="[20 , 50 , 100]" :total="total-0">
              </el-pagination>
            </div>
            <!-- 分页 end -->
          </div>
          <div class="__equity-dialog-content-right">
            <div class="__content-right-wrap">
              <div class="__content-right-title">
                已选权益
              </div>
              <div class="__clear-btn" @click="handleEmpty">清空</div>
            </div>
            <ul class="__selected-equity-wrap">
              <li class="__selected-equity-item-inner" v-for="(item, index) of multipleSelectionItem" :key="index">
                <div class="__selected-equity-name-desc">{{item.equity.equityName}}</div>
                <i class="el-icon-close __dialog-icon-delete" @click="dialogDeleteEquity(index)"></i>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeEquityDialog(true)" class="_el-btn-custom _member-add-edit-save-btn">确定
        </el-button>
        <el-button @click="changeEquityDialog(false)" class="_el-btn-custom">取消</el-button>
      </span>
    </el-dialog>
    <!--  权益相同时的dialog -->
    <el-dialog class="__same-equity-dialog __equity-dialog" :visible.sync="sameCategoryDialog">
      <div class="__same-equity-desc">
        {{`最多只可选择一条“${sameCategory}”权益，无法保存`}}
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="handleSureSameEquity" class="_el-btn-custom _member-add-edit-save-btn">确定</el-button> -->
        <el-button @click="sameCategoryDialog = false" class="_el-btn-custom">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "EditMemberLevelEquity",
  components: {},
  data() {
    return {
      showType: true, //页面显示状态是否可以编辑
      btnDisabled: true, //是否可以操作按钮
      tenantId: this.$store.state.loginUser.consumerId,
      levelList: [],
      checkData: [],
      editData: [],
      parentIndex: 0,
      equityDialog: false, //自益权益弹窗显示
      sameCategory: "", //相同类别的权益文字
      sameCategoryDialog: false, //相同类别的权益弹窗显示
      tableData: [], // 权益列表数据
      total: 20,
      // 添加权益的dialog
      formData: {
        equalOrNot: true, //需要结果等于equityCategory还是不等于
        equityName: "", //权益名称
        equityType: "", //权益类型
        equityCategory: "", //权益类别
        status: "start", //卡状态
        equityNo: "", //权益ID
        current: 1,
        size: 20,
        tenantId: this.$store.state.loginUser.consumerId //租户id
      },
      //权益类型列表
      equityTypeList: [
        { name: "服务类", value: "service_type" },
        { name: "消费类", value: "consumer_type" },
        { name: "体验类", value: "experience_type" },
        { name: "身份类", value: "identity_type" }
      ],
      //权益类别列表
      equityCategoryList: [
        { name: "影票折扣", value: "movie" },
        { name: "卖品折扣", value: "goods" },
        { name: "生日赠券", value: "birthday" },
        { name: "代金券", value: "voucher" }
      ],
      multipleSelectionItem: [], //临时选择的自有权益
      equityList: []
    };
  },
  created() {
    this.getShowType();
  },
  watch: {
    // showType:{
    //   deep:true,
    //   handler(newVal,oldVal){
    //     this.getShowType()
    //   }
    // },
    equityDialog: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal) {
          this.search();
        }
      }
    }
  },
  methods: {
    // 清空权益类别时的回调
    handleClearCategory() {
      this.$set(this.formData, "equityCategory", "");
    },
    // 改变权益类型时的回调
    handleChangeEquityType(val) {
      if (val != "consumer_type") {
        this.$set(this.formData, "equityCategory", "");
      }
    },
    // dialog内删除已选权益
    dialogDeleteEquity(index) {
      this.multipleSelectionItem.splice(index, 1);
      this.$refs.multipleTable.clearSelection();
      this.rowMultipleChecked(this.multipleSelectionItem);
    },
    // 清空dialog内已选权益
    handleEmpty() {
      this.multipleSelectionItem = [];
      this.$refs.multipleTable.clearSelection();
    },
    //获取显示页面状态
    getShowType() {
      //编辑页面显示
      // if(this.showType){
      //   // this.levelList=this.editData
      //   this.getLevelEquityList()
      // }else{//查看页面显示
      //   // this.levelList=this.checkData
      //   this.getLevelEquityList()
      // }
      console.log("this.$route.path", this.$route.path);
      // if(this.$route.path=="/member/memberLevelEquity/edit"){
      //   this.showType=true
      // }
      // if(this.$route.path=="/member/memberLevelEquity/detail"){
      //   this.showType=false
      // }
      this.getLevelEquityList();
    },
    //编辑
    handleEdit() {
      // this.showType=true
      // this.$store.commit("tagNav/removeTagNav", this.$route);
      this.$router.push({
        path: "/member/memberLevelEquity/edit"
      });
    },
    //取消
    handleCancle() {
      // this.showType=false
      this.$store.commit("tagNav/removeTagNav", this.$route);
      this.$router.push({
        path: "/member/memberLevelEquity/detail"
      });
    },
    //保存
    handleCommit() {
      // this.showType=false
      // this.handleSureSameEquity()
      let listCommitParams = [];
      this.levelList.forEach(item => {
        if (item.levelEquitys) {
          item.levelEquitys.forEach(el => {
            let objCommitParams = {
              equityCategory: el.equity.equityCategory,
              equityId: el.equity.id,
              equityName: el.equity.equityName,
              equityType: el.equity.equityType,
              levelId: item.id,
              levelName: item.levelName,
              levelNo: item.levelNo,
              tenantId: this.tenantId
            };
            listCommitParams.push(objCommitParams);
          });
        }
      });
      this.submitForm(listCommitParams);
    },
    // 查看是否存在相同类别的权益
    repeatArray(arr) {
      var temp = []; //一个新的临时数组
      var repeatArr = []; // 重复的数组
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].equityType == "consumer_type") {
          //消费类全部不能重复
          // if (arr[i].equityCategory == "goods" || arr[i].equityCategory == "movie") {
          if (temp.indexOf(arr[i].equityCategory + arr[i].levelId) == -1) {
            temp.push(arr[i].equityCategory + arr[i].levelId);
          } else if (
            temp.indexOf(arr[i].equityCategory + arr[i].levelId) != -1 &&
            arr[i].equityCategory != null
          ) {
            repeatArr.push(arr[i].equityCategory);
          }
          // }
        }
      }

      return repeatArr;
    },
    uniq(array) {
      var sameArr = [];
      for (var i = 0; i < array.length; i++) {
        //如果当前数组的第i项在当前数组中第一次出现的位置是i，才存入数组；否则代表是重复的
        if (array.indexOf(array[i]) == i) {
          sameArr.push(array[i]);
        }
      }
      //替换中文提示重复
      if (sameArr.length != 0) {
        for (let i = 0; i < sameArr.length; i++) {
          if (sameArr[i] == "goods") sameArr[i] = "卖品折扣";
          if (sameArr[i] == "movie") sameArr[i] = "影票折扣";
          if (sameArr[i] == "birthday") sameArr[i] = "生日赠券";
          if (sameArr[i] == "voucher") sameArr[i] = "代金券";
        }
      }
      return sameArr;
    },
    // 提交表单前的校验
    submitForm(listCommitParams) {
      var val = listCommitParams;
      if (this.repeatArray(val).length > 0) {
        this.sameCategoryDialog = true; //开启弹窗
        this.sameCategory = this.uniq(this.repeatArray(val)).join("、");
      } else {
        //发起请求
        this.handleSureSameEquity({ list: listCommitParams });
      }
    },
    // 点击搜索按钮
    handleSearch() {
      this.formData.current = 1;
      this.search();
    },
    handleSizeChange(val) {
      this.formData.size = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.formData.current = val;
      this.search();
    },
    // 相同权益dialog点击确定时
    handleSureSameEquity(params) {
      this.$crmList
        .addLevelEquity(params)
        .then(data => {
          this.$message({
            message: "保存成功",
            type: "success",
            duration: 1500
          });
          // this.showType=false
          this.$store.commit("tagNav/removeTagNav", this.$route);
          this.$router.push({
            path: "/member/memberLevelEquity/detail"
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    //数据为空格式化
    emptyShow(row, column, cellValue, index) {
      return cellValue ? cellValue : "-";
    },
    getRowKeys(row) {
      return row.id;
    },
    // 搜索自有权益
    search() {
      let params = JSON.parse(JSON.stringify(this.formData));
      if (params.equityCategory == "") {
        params.equalOrNot = false;
        params.equityCategory = "time_card";
      } else {
        params.equalOrNot = true;
      }
      this.$crmList
        .getEquityList(params)
        .then(data => {
          if (data) {
            this.tableData = data.records || [];
            this.total = data.total || 0;
            this.$refs.multipleTable.clearSelection();
            this.rowMultipleChecked(this.multipleSelectionItem);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 权益回显
    rowMultipleChecked(selectedArr) {
      if (selectedArr.length != 0) {
        for (let i = 0; i < selectedArr.length; i++) {
          for (let k = 0; k < this.tableData.length; k++) {
            if (selectedArr[i].equity.id == this.tableData[k].id) {
              this.$refs.multipleTable.toggleRowSelection(
                this.tableData[k],
                true
              );
              break;
            }
          }
        }
      }
    },
    //手动选择权益
    handleSelect(selection, row) {
      if (row) {
        this.rowOneToggle(row);
      } else {
        if (selection.length == 0) {
          for (let index = 0; index < this.tableData.length; index++) {
            const item = this.tableData[index];
            this.rowOneRemove(item);
          }
        } else {
          for (let j = 0; j < selection.length; j++) {
            const selectionItem = selection[j];
            this.rowOneAdde(selectionItem);
          }
        }
      }
    },
    //单一数据toggle
    rowOneToggle(row) {
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (row.id == this.multipleSelectionItem[index].equity.id) {
          this.multipleSelectionItem.splice(index, 1);
          return;
        }
      }
      this.multipleSelectionItem.push({ equity: row });
    },
    //单一数据add
    rowOneAdde(row) {
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (row.id == this.multipleSelectionItem[index].equity.id) {
          return;
        }
      }
      this.multipleSelectionItem.push({ equity: row });
    },
    //单一数据reomove
    rowOneRemove(row) {
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (row.id == this.multipleSelectionItem[index].equity.id) {
          this.multipleSelectionItem.splice(index, 1);
          return;
        }
      }
    },
    // 点击权益dialog的确定、取消按钮
    changeEquityDialog(ok) {
      if (ok) {
        if (new Array(...this.multipleSelectionItem).length == 0) {
          this.equityDialog = true;
          this.$message.warning("请至少选择一项权益");
          return false;
        } else {
          this.equityDialog = false;
          this.equityList = new Array(...this.multipleSelectionItem);
          this.levelList[this.parentIndex].levelEquitys = [];
          this.equityList.forEach(item => {
            this.levelList[this.parentIndex].levelEquitys.push(item);
          });
          this.btnDisabled = false; //按钮可以点击
        }
      } else {
        this.equityDialog = false;
        this.multipleSelectionItem = new Array(...this.equityList);
      }
    },
    // 过滤权益类别
    equityCategoryNameShow(row, column, cellValue, index) {
      if (row.equityType != "consumer_type") {
        return "-";
      } else {
        return cellValue ? cellValue : "-";
      }
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //删除
    deleteItem(parentIndex, index) {
      this.btnDisabled = false; //按钮可以点击
      this.levelList[parentIndex].levelEquitys.splice(index, 1);
    },
    //添加权益（打开弹窗）
    handleAddEquityDialog(parentIndex, item) {
      let levelEquitys = JSON.parse(JSON.stringify(item));
      this.equityList = [];
      this.multipleSelectionItem = levelEquitys.length == 0 ? [] : levelEquitys;
      this.equityDialog = true;
      this.parentIndex = parentIndex;
      //回显
      // this.search()
    },
    //获取会员等级权益列表
    getLevelEquityList() {
      let params = {
        tenantId: this.tenantId
      };
      this.$crmList
        .levelEquityList(params)
        .then(data => {
          if (data) {
            this.levelList = data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
//编辑会员等级权益样式
._member-level-equity-detail {
  .edit-btn {
    width: 100%;
    overflow: hidden;
    .el-button {
      float: right;
    }
  }
  .member-level-equity {
    margin-top: 32px;
    .level-header {
      margin-bottom: 8px;
      .header-img {
        display: inline-block;
        width: 44px;
        height: 44px;
        vertical-align: middle;
        text-align: center;
        margin-right: 12px;
      }
      .header-title {
        display: inline-block;
        vertical-align: middle;
        font-family: PingFangSC-Semibold;
        font-size: 12px;
        color: #333333;
        letter-spacing: 0;
        font-weight: bold;
      }
    }
    .level-bodyer {
      width: 100%;
      min-height: 159px;
      background-color: #f5f7fa;
      overflow: hidden;
      padding: 24px;
      .bodyer-title {
        font-family: MicrosoftYaHei;
        font-size: 12px;
        color: #333333;
        margin-bottom: 13px;
      }
      .bodyer-content {
        .block {
          width: 100%;
          overflow: hidden;
          text-align: center;
          display: flex;
          flex-wrap: wrap;
          .block-item {
            position: relative;
            width: 100px;
            margin: 6px 10px 10px 50px;
            .block-icon-delete {
              position: absolute;
              top: 0;
              right: 0;
              // font-size: 14px;
            }
            .block-img {
              display: inline-block;
              width: 36px;
              height: 36px;
              vertical-align: middle;
              margin-bottom: 14px;
            }
            .el-button.is-circle {
              padding: 0;
            }
            .block-icon-btn {
              display: inline-block;
              width: 36px;
              height: 36px;
              font-family: MicrosoftYaHei;
              font-size: 22px;
              color: #666666;
              text-align: center;
              vertical-align: middle;
              margin-bottom: 14px;
              border: 1px dashed #666666;
            }
            .block-word {
              font-family: MicrosoftYaHei;
              font-size: 12px;
              color: #333333;
              text-align: center;
            }
            .el-button {
              padding: 0;
            }
          }
        }
      }
    }
  }
  .footer-btn-wrap {
    margin: 20px 0 30px 0;
    text-align: center;
    .el-button {
      width: 80px;
      padding: 8px 20px;
    }
  }
}
// 相同权益的dialog
.__same-equity-dialog {
  .el-dialog {
    width: 576px;
    height: auto !important;
    .__same-equity-desc {
      text-align: center;
      height: 238px;
      padding-top: 80px;
    }
  }
}
</style>