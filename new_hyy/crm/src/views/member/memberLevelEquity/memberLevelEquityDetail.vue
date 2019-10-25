<template>
  <div class="_member-level-equity-detail">
    <div class="edit-btn" v-if="!showType">
      <el-button type="primary" @click="handleEdit">编辑</el-button>
    </div>
    <div class="member-level-equity" v-for="(item,parentIndex) in levelList" :key="item.id+parentIndex">
      <div class="level-header">
        <!-- <img class="header-img" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" alt=""> -->
        <span class="header-title">{{item.levelName}}</span>
      </div>
      <div class="level-bodyer">
        <!-- 自营权益 -->
        <div style="margin-bottom:8px;" v-if="item.levelEquitys && item.levelEquitys.lenght!=0">
          <div class="bodyer-title">
            自营权益
          </div>
          <div class="bodyer-content">
            <ul class="block">
              <li class="block-item" v-for="(items,index) in item.levelEquitys" :key="items.equity.id+index">
                <el-button v-if="showType" type="danger" class="block-icon-delete" icon="el-icon-remove" @click="deleteItem(parentIndex,index)" circle></el-button>
                <img class="block-img" :src="items.equity.logoPic" alt="" @click="handlePreviewEquity(items.equity.id)">
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
                <el-button v-if="showType" type="danger" class="block-icon-delete" icon="el-icon-remove" @click="deleteItem(parentIndex,index)" circle></el-button>
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
      <el-button type="primary" :disabled="btnDisabled" @click="handleCommit" class="_el-btn-custom _member-add-edit-save-btn">保存</el-button>
      <el-button :disabled="btnDisabled" @click="handleCancle" class="_el-btn-custom">取消</el-button>
    </div>
    <!-- 添加权益dialog -->
    <el-dialog title="自有权益" class="__equity-dialog" :visible.sync="equityDialog" width="896px">
      <div class="__table-wrap">
        <el-form :inline="true" :model="formData" ref="formData" class="form-data-wrap">
          <el-form-item label="权益名称：" prop="equityName">
            <el-input v-model="formData.equityName" placeholder="填写权益名称" clearable maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="权益类型：" prop="equityType">
            <el-select v-model="formData.equityType" placeholder="全部" clearable>
              <el-option v-for="item in equityTypeList" :key="item.name" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="权益类别：" prop="equityCategory" class="heightBug">
            <el-select v-model="formData.equityCategory" placeholder="全部" clearable :disabled="formData.equityType != 'consumer_type'">
              <el-option v-for="item in equityCategoryList" :key="item.name" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="btn-wrap">
            <el-button type="primary" @click="handleSearch" class="_el-btn-custom">搜索</el-button>
            <el-button @click="resetForm('formData')" plain class="_el-btn-custom _member-custom-ghost-button">重置
            </el-button>
          </el-form-item>
        </el-form>
        <div class="member-list-table _m-member-table-custom">
          <el-table ref="multipleTable" :data="tableData" stripe style="width: 100%" @select="handleSelect" @select-all="handleSelect" :row-key="getRowKeys">
            <el-table-column type="selection" width="55" :reserve-selection="true">
            </el-table-column>
            <el-table-column prop="equityName" :formatter="emptyShow" label="权益名称" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="equityTypeName" :formatter="emptyShow" label="权益类型" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="equityCategoryName" :formatter="equityCategoryNameShow" label="权益类别" min-width="100" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
        <!-- 分页 start -->
        <div class="page-wrap" style="padding:0">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formData.current-0" :page-size="formData.size-0" layout="prev, pager, next, jumper, sizes" :page-sizes="[20 , 50 , 100]" :total="total-0"></el-pagination>
        </div>
        <!-- 分页 end -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeEquityDialog(true)" class="_el-btn-custom _member-add-edit-save-btn">确定
        </el-button>
        <el-button @click="changeEquityDialog(false)" class="_el-btn-custom">取消</el-button>
      </span>
    </el-dialog>
    <!--  权益相同时的dialog -->
    <el-dialog class="__equity-dialog" :visible.sync="sameCategoryDialog">
      <div style="text-align:center;">
        {{`最多只可选择一条“${sameCategory}”权益，无法保存`}}
        <!-- 请仔细检查，避免会员在<span style="font-size:22px;">同一场次可享受多种价格权益</span>的情况发生<br /><br />
        若出现此情况，则默认<span style="color:red;">享受最低折扣（全部优惠中的最高价格）</span> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="handleSureSameEquity" class="_el-btn-custom _member-add-edit-save-btn">确定</el-button> -->
        <el-button @click="sameCategoryDialog = false" class="_el-btn-custom">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 权益详情dialog -->
    <el-dialog title="权益详情" class="__equity-dialog" :visible.sync="previewDialog" width="896px">
      <div style="overflow:auto;height:480px">
        <OwnershipDetail :equityID="equityId" :isShow="false"></OwnershipDetail>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="previewDialog = false" class="_el-btn-custom">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import OwnershipDetail from '../components/OwnershipDetail';
export default {
  name: 'EditMemberLevelEquity',
  components: {
    OwnershipDetail
  },
  data () {
    return {
      previewDialog: false,
      equityId: '',
      showType: false, // 页面显示状态是否可以编辑
      btnDisabled: true, // 是否可以操作按钮
      tenantId: this.$store.state.loginUser.consumerId,
      levelList: [],
      checkData: [],
      editData: [],
      parentIndex: 0,
      equityDialog: false, // 自益权益弹窗显示
      sameCategory: '', // 相同类别的权益文字
      sameCategoryDialog: false, // 相同类别的权益弹窗显示
      tableData: [], // 权益列表数据
      total: 20,
      // 添加权益的dialog
      formData: {
        equityName: '', // 权益名称
        equityType: '', // 权益类型
        equityCategory: '', // 权益类别
        status: 'start', // 卡状态
        equityNo: '', // 权益ID
        current: 1,
        size: 20,
        tenantId: this.$store.state.loginUser.consumerId // 租户id
      },
      // 权益类型列表
      equityTypeList: [
        { name: '服务类', value: 'service_type' },
        { name: '消费类', value: 'consumer_type' },
        { name: '体验类', value: 'experience_type' },
        { name: '身份类', value: 'identity_type' }
      ],
      // 权益类别列表
      equityCategoryList: [
        { name: '影票折扣', value: 'movie' },
        { name: '卖品折扣', value: 'goods' },
        { name: '生日赠券', value: 'birthday' },
        { name: '代金券', value: 'voucher' }
      ],
      multipleSelectionItem: [], // 临时选择的自有权益
      equityList: []
    };
  },
  created () {
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
      handler (newVal, oldVal) {
        if (newVal) {
          this.search();
        }
      }
    }
  },
  methods: {
    // 预览权益
    handlePreviewEquity (id) {
      this.$set(this, 'equityId', id);
      this.previewDialog = true;
    },
    // 获取显示页面状态
    getShowType () {
      // 编辑页面显示
      // if(this.showType){
      //   // this.levelList=this.editData
      //   this.getLevelEquityList()
      // }else{//查看页面显示
      //   // this.levelList=this.checkData
      //   this.getLevelEquityList()
      // }
      console.log('this.$route.path', this.$route.path);
      // if(this.$route.path=="/member/memberLevelEquity/edit"){
      //   this.showType=true
      // }
      // if(this.$route.path=="/member/memberLevelEquity/detail"){
      //   this.showType=false
      // }
      this.getLevelEquityList();
    },
    // 编辑
    handleEdit () {
      // this.showType=true
      // this.$store.commit("tagNav/removeTagNav", this.$route);
      this.$router.push({
        path: '/member/memberLevelEquity/edit'
      });
    },
    // 取消
    handleCancle () {
      // this.showType=false
      this.$store.commit('tagNav/removeTagNav', this.$route);
      this.$router.push({
        path: '/member/memberLevelEquity/detail'
      });
    },
    // 保存
    handleCommit () {
      console.log('levelList', this.levelList);
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
      console.log('listCommitParams', JSON.stringify(listCommitParams));
      this.submitForm(listCommitParams);
    },
    // 查看是否存在相同类别的权益
    repeatArray (arr) {
      var temp = []; // 一个新的临时数组
      var repeatArr = []; // 重复的数组
      for (var i = 0; i < arr.length; i++) {
        console.log('arr[i].equityType', arr[i].equityType);
        if (arr[i].equityType == 'consumer_type') {
          if (
            arr[i].equityCategory == 'goods' ||
            arr[i].equityCategory == 'movie'
          ) {
            if (temp.indexOf(arr[i].equityCategory + arr[i].levelId) == -1) {
              temp.push(arr[i].equityCategory + arr[i].levelId);
            } else if (
              temp.indexOf(arr[i].equityCategory + arr[i].levelId) != -1 &&
              arr[i].equityCategory != null
            ) {
              repeatArr.push(arr[i].equityCategory);
            }
          }
        }
      }
      console.log('repeatArr', repeatArr);
      return repeatArr;
    },
    uniq (array) {
      var sameArr = [];
      for (var i = 0; i < array.length; i++) {
        // 如果当前数组的第i项在当前数组中第一次出现的位置是i，才存入数组；否则代表是重复的
        if (array.indexOf(array[i]) == i) {
          sameArr.push(array[i]);
        }
      }
      return sameArr;
    },
    // 提交表单前的校验
    submitForm (listCommitParams) {
      var val = listCommitParams;
      if (this.repeatArray(val).length > 0) {
        this.sameCategoryDialog = true; // 开启弹窗
        this.sameCategory = this.uniq(this.repeatArray(val)).join('、');
        if (this.sameCategory == 'movie') {
          this.sameCategory = '影票折扣';
        }
        if (this.sameCategory == 'goods') {
          this.sameCategory = '卖品折扣';
        }
        if (this.sameCategory == 'movie、goods') {
          this.sameCategory = '影票折扣、卖品折扣';
        }
        console.log('sameCategory', this.sameCategory);
      } else {
        // 发起请求
        this.handleSureSameEquity({ list: listCommitParams });
      }
    },
    // 点击搜索按钮
    handleSearch () {
      this.formData.current = 1;
      this.search();
    },
    handleSizeChange (val) {
      this.formData.size = val;
      this.search();
    },
    handleCurrentChange (val) {
      this.formData.current = val;
      this.search();
    },
    // 相同权益dialog点击确定时
    handleSureSameEquity (params) {
      this.$crmList
        .addLevelEquity(params)
        .then(data => {
          this.$message({
            message: '保存成功',
            type: 'success',
            duration: 1500
          });
          // this.showType=false
          // this.$store.commit("tagNav/removeTagNav", this.$route);
          this.$router.push({
            path: '/member/memberLevelEquity/detail'
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 数据为空格式化
    emptyShow (row, column, cellValue, index) {
      if (cellValue == null || cellValue == undefined || cellValue === '') {
        return '-';
      } else {
        return cellValue;
      }
    },
    getRowKeys (row) {
      return row.id;
    },
    // 搜索自有权益
    search () {
      let params = JSON.parse(JSON.stringify(this.formData));
      this.$crmList
        .getEquityList(params)
        .then(data => {
          if (data) {
            this.tableData = data.records || [];
            this.total = data.total || 0;
            this.$refs.multipleTable.clearSelection();
            console.log('clearSelection');
            console.log('tableData', this.tableData);
            console.log(
              'this.multipleSelectionItem',
              this.multipleSelectionItem
            );
            this.rowMultipleChecked(this.multipleSelectionItem);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 权益回显
    rowMultipleChecked (selectedArr) {
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
    // 手动选择权益
    handleSelect (selection, row) {
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
      console.log('sldfkjsfjsa');
    },
    // 单一数据toggle
    rowOneToggle (row) {
      console.log('0000000000');
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (row.id == this.multipleSelectionItem[index].equity.id) {
          console.log('delete', this.multipleSelectionItem[index]);
          this.multipleSelectionItem.splice(index, 1);
          return;
        }
      }
      this.multipleSelectionItem.push({ equity: row });
      console.log('multipleSelectionItem', this.multipleSelectionItem);
    },
    // 单一数据add
    rowOneAdde (row) {
      console.log('1111111111');
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (row.id == this.multipleSelectionItem[index].equity.id) {
          return;
        }
      }
      console.log('22222222222');
      this.multipleSelectionItem.push({ equity: row });
    },
    // 单一数据reomove
    rowOneRemove (row) {
      console.log('33333333');
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (row.id == this.multipleSelectionItem[index].equity.id) {
          this.multipleSelectionItem.splice(index, 1);
          return;
        }
      }
    },
    // 点击权益dialog的确定、取消按钮
    changeEquityDialog (ok) {
      this.equityDialog = false;
      if (ok) {
        this.equityList = new Array(...this.multipleSelectionItem);
        this.levelList[this.parentIndex].levelEquitys = [];
        this.equityList.forEach(item => {
          this.levelList[this.parentIndex].levelEquitys.push(item);
        });
        this.btnDisabled = false; // 按钮可以点击
      } else {
        this.multipleSelectionItem = new Array(...this.equityList);
      }
      console.log('multipleSelectionItem', this.multipleSelectionItem);
      console.log('equityList', this.equityList);
      console.log('levelList', this.levelList);
    },
    // 过滤权益类别
    equityCategoryNameShow (row, column, cellValue, index) {
      if (row.equityType != 'consumer_type') {
        return '-';
      } else {
        return cellValue || "-";
      }
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    // 删除
    deleteItem (parentIndex, index) {
      this.btnDisabled = false; // 按钮可以点击
      this.levelList[parentIndex].levelEquitys.splice(index, 1);
    },
    // 添加权益（打开弹窗）
    handleAddEquityDialog (parentIndex, item) {
      let levelEquitys = JSON.parse(JSON.stringify(item));
      this.equityList = [];
      this.multipleSelectionItem = levelEquitys.length == 0 ? [] : levelEquitys;
      this.equityDialog = true;
      this.parentIndex = parentIndex;
      console.log('levelEquitys', levelEquitys);
      // 回显
      // this.search()
    },
    // 获取会员等级权益列表
    getLevelEquityList () {
      console.log('获取会员等级权益列表getLevelEquityList');
      let params = {
        tenantId: this.tenantId
      };
      this.$crmList
        .levelEquityList(params)
        .then(data => {
          if (data) {
            this.levelList = data;
            console.log('levelList', data);
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
          .block-item {
            float: left;
            position: relative;
            margin-left: 50px;
            width: 100px;
            min-height: 78px;
            // background-color: #000;
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
              cursor: pointer;
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
  // 自有权益dialog样式
  .__equity-dialog {
    .el-dialog__header {
      padding: 10px 20px;
    }
    .el-dialog__body {
      padding: 0px 20px;
    }
    .el-dialog__footer {
      text-align: center;
    }
    .__table-wrap {
      border-top: 1px solid #f5f5f5;
      padding-top: 10px;
      .el-form-item {
        margin: 0 5px 5px 0;
      }
      .heightBug input {
        height: 32px !important;
      }
    }
  }
}
</style>