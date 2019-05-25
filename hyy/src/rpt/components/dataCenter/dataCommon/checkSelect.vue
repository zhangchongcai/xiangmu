<template>
  <div>
    <el-input v-model="commonValue" v-on:click.native="selectTreeEvent(1)"></el-input>

    <my-dialog
      :title="`选择${this.selectValue.queryName}`"
      :isShow="selectTreeValue"
      :dialogWidth="648"
      @handleBtnComfirmClick="confirmTreeBtn"
      @handleBtnCancelClick="cancelTreeBtn"
      @close="closeCommonDialog"
    >
      <div slot="dialog-content">
        <div class="query-condition">
          <div class="queryBtn-box" v-for="(item,index) in this.condition" :key=" `query_${index}`">
            <div class="queryBtn-box-name">{{item.label}}</div>
            <el-input v-model="item.value" v-if="item.type=='text'"></el-input>
            <el-select v-model="item.value" placeholder="请选择" v-if="item.type=='select'">
              <el-option
                v-for="kv in item.defValue"
                :key="`kv_${kv.key}`"
                :label="kv.label"
                :value="kv.key"
              ></el-option>
            </el-select>
          </div>
          <div class="queryBtn-btn">
            <button @click="getTableValue">查询</button>
          </div>
        </div>
        <el-table
          ref="multipleTable"
          :data="result"
          v-loading="loading"
          @select="select"
          @select-all="selectAll"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <template v-for="(el,index) in column">
            <el-table-column
              :key=" `col_${index}`"
              :prop="el.prop"
              :label="el.name"
              :width="index === column.length-1?'auto':'120'"
            ></el-table-column>
          </template>
        </el-table>
        <div class="block">
          <el-pagination
            background
            small
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="Pagination.currentPage"
            :page-sizes="Pagination.page_sizes"
            :page-size="Pagination.pagesize"
            layout="prev, pager, next, jumper"
            :total="Number(totalCount)"
          ></el-pagination>
        </div>
      </div>
    </my-dialog>

    <!-- <el-dialog
      :title="'选择'+this.selectValue.queryName"
      :visible.sync="selectTreeValue"
      width="50%"
      :before-close="handleClose"
      :lock-scroll="false"
      @close="closeCommonDialog"
    >
      <div class="query-condition">
        <div class="queryBtn-box" v-for="(item,index) in this.condition" :key=" `query_${index}`">
          <span class="queryBtn-box-name">{{item.label}}</span>
          <el-input v-model="item.value" v-if="item.type=='text'"></el-input>
          <el-select v-model="item.value" placeholder="请选择" v-if="item.type=='select'">
            <el-option v-for="kv in item.defValue" :key="kv.key" :label="kv.label" :value="kv.key"></el-option>
          </el-select>
        </div>
        <div class="queryBtn-btn">
          <el-button type="primary DC-query-btn" @click="getTableValue">查询</el-button>
        </div>
      </div>
      <el-table
        ref="multipleTable"
        :data="result"
        tooltip-effect="dark"
        style="width: 100%"
        v-loading="loading"
        @select="select"
        @select-all="selectAll"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <template v-for="(el,index) in column">
          <el-table-column
            :key=" `col_${index}`"
            :prop="el.prop"
            :label="el.name"
            :width="index === column.length-1?'auto':'120'"
          ></el-table-column>
        </template>
      </el-table>
      <div class="block">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="Pagination.currentPage"
          :page-sizes="Pagination.page_sizes"
          :page-size="Pagination.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelTreeBtn">取 消</el-button>
        <el-button type="primary" @click="confirmTreeBtn">确 定</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>
<script>
import datacenterBus from "../../../assets/datacenterBus.js";
import MyDialog from "./myDialog.vue"
export default {
  components: {
    MyDialog
  },
  props: {
    selectValue: {
      type: null | Object,
      default: "",
      require: true
    }
  },
  data() {
    return {
      newCommonValue: this.selectValue,
      commonValue: this.selectValue.defVALUE,
      selectTreeValue: false,
      // 表头
      column: [],
      // 查询条件
      condition: [],
      // 表头结果
      result: [],
      // 结果总数
      totalCount: "",
      Pagination: {
        //默认显示第几页
        currentPage: 1,
        //每页显示多少调数据
        pagesize: 10,
        //设置每页显示多少条
        page_sizes: [10, 20, 50, 100],
        //数据总数
        total: this.totalCount
      },
      inputValue: [],
      loading: false
    };
  },
  watch: {
    selectValue: {
      handler(newVale, oldValue) {
        console.log(newVale, oldValue);
        this.commonValue = newVale.defVALUE;
      },
      deep: true
    },
    selectTreeValue: {
      handler(newVal, oldVal) {
        if (newVal === true) {
          this.Pagination.currentPage = 1;
        }
      }
    }
  },
  methods: {
    //复选框状态改变触发事件
    select(selection, row) {
      let addData, delData;
      if (this.inputValue.length !== 0) {
        //遍历复选框所选的值，勾选时往inputValue添加，取消勾选时从inputValue删除
        for (let i = 0; i < this.inputValue.length; i++) {
          if (this.inputValue[i].name !== row.name) {
            addData = row;
          }
          if (this.inputValue[i].name === row.name) {
            delData = i;
          }
        }
        if (delData || delData == 0) {
          this.inputValue.splice(delData, 1);
        }
        if (addData && delData == undefined) {
          this.inputValue.push(addData);
        }
      } else {
        this.inputValue.push(row);
      }
    },
    selectAll(selection) {
      this.inputValue = selection;
    },
    // handleSelectionChange(valArr) {
    //   console.log('valArr', valArr);
    //   this.inputValue = valArr;
    // },
    handleSizeChange(val) {
      this.Pagination.pagesize = val;
      console.log(`每页 ${val} 条`);
    },
    //分页器页面切换
    handleCurrentChange(val) {
      //获取数据并加载默认项
      this.selectTreeEvent(val);
      console.log(`当前页: ${val}`);
    },
    changeTreeJson() {},
    getTableValue() {
      this.selectTreeEvent(1);
    },
    confirmTreeBtn() {
      let nameArr = []; //显示内容
      let valueArr = []; //提交内容
      this.inputValue.forEach(function(val) {
        nameArr.push(val.name);
        valueArr.push(val.value);
      });

      //改子组件数据变化了，应该先更新父组件的数据，再从父组件传递数据给子组件，页面数据才会同步更新
      // this.commonValue = nameArr.join(",");
      this.newCommonValue.queryColValue = valueArr.join(",");
      this.selectTreeValue = false;
      let selectData = JSON.parse(JSON.stringify(this.selectValue));
      selectData.defVALUE = nameArr.join(",");
      selectData.queryColValue = valueArr.join(",");
      console.log(selectData)
      this.$emit("changeSelectData", selectData);
    },
    cancelTreeBtn() {
      // this.commonValue = "";
      // this.newCommonValue.queryColValue = "";
      //取消只是纯粹关闭弹框，不做任何数据处理
      this.selectTreeValue = false;
    },
    closeCommonDialog: function() {
      // this.commonValue = "";
      // this.newCommonValue.queryColValue = "";
      this.selectTreeValue = false;
    },
    selectTreeEvent(val) {
      this.loading = true;
      let self = this;
      // console.log(document.getElementsByClassName('number active')[0])
      // let currentPageVal = document.getElementsByClassName('number active')[0].innerHTML;
      //因为condition的结构发生了变化，所以这里提交参数要进行修改
      var newConditionArr = [];
      for (var i = 0; i < this.condition.length; i++) {
        var newCondition = this.condition[i];
        newCondition.defValue = "";
        newConditionArr.push(newCondition);
      }
      let checkData = {
        condition: newConditionArr,
        pagingInfo: {
          startIndex: val,
          rows: self.Pagination.pagesize
        }
      };
      this.$rptList
        .getCheckBoxData(checkData, this.selectValue.interfaceURL)
        .then(function(response) {
          let data = response.data;
          self.column = data.column;
          // 查询条件
          self.condition = data.condition;

          //这里要对condition进行数据格式化
          for (var i = 0; i < self.condition.length; i++) {
            //如果是select类型，则要将defValue从字符串转换为数组
            if (self.condition[i].type == "select") {
              var kvstrArray = self.condition[i].defValue.split(",");
              var defaultValueArr = [];
              defaultValueArr.push({ key: "", label: "" });
              for (var j = 0; j < kvstrArray.length; j++) {
                var kvArray = kvstrArray[j].split(":");
                var kvObject = {};
                kvObject.key = kvArray[1];
                kvObject.label = kvArray[0];
                defaultValueArr.push(kvObject);
              }
              self.condition[i].defValue = defaultValueArr;
            }
          }

          // 表头结果
          self.result = data.result;
          // 返回总数
          self.totalCount = data.totalCount;
          Vue.nextTick(() => {
            let tableData = self.$refs.multipleTable.data;
            //点击弹框默认勾选项
            if (self.commonValue != null) {
              let commonValueArr;
              //获取选择框所选择的内容
              commonValueArr = self.commonValue.split(",");
              //弹框默认显示勾选了选择框的内容
              for (let i = 0; i < tableData.length; i++) {
                commonValueArr.forEach(element => {
                  if (tableData[i].name === element) {
                    self.$refs.multipleTable.toggleRowSelection(
                      self.$refs.multipleTable.data[i],
                      true
                    );
                  }
                });
              }
            }
            //弹框页面切换时的勾选项
            if (self.inputValue != []) {
              let commonValueArr = [];
              //获取勾选项
              self.inputValue.forEach(element => {
                commonValueArr.push(element.name);
              });
              //显示勾选了选择框的内容
              for (let i = 0; i < tableData.length; i++) {
                commonValueArr.forEach(element => {
                  if (tableData[i].name === element) {
                    self.$refs.multipleTable.toggleRowSelection(
                      self.$refs.multipleTable.data[i],
                      true
                    );
                  }
                });
              }
            }
            self.loading = false;
          });
        })
        .catch(function(error) {
          console.log(error);
        });
      self.selectTreeValue = true;
    }
  }
};
</script>


<style scoped>
.datacenter-query-ul li {
  margin-top: 0px;
}
.queryBtn {
  width: 200px;
  height: 32px;
}
.query-condition {
  margin-top: 6px;
  margin-bottom: 12px;
}
.query-condition,
.queryBtn-box {
  display: flex;
  justify-content: flex-start;
}
.queryBtn-box .el-input,
.queryBtn-box .el-select .el-input .el-input__inner {
  width: 184px !important;
}
.queryBtn-box-name {
  font-size: 12px;
  margin-right: 8px;
  color: #666666;
  text-align: right;
}
.queryBtn-btn {
  margin-left: 16px;
}
.queryBtn-btn button {
  width: 80px;
  height: 32px;
  background: #3b74ff;
  color: white;
  border: none;
  border-radius: 4px;
}
.queryBtn-btn button:hover {
  background: #0f55ff;
  cursor: pointer;
}
.el-dialog .el-table {
  padding-top: 20px;
}
.block {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 53px;
}
.el-pagination {
  margin-top: 10px;
}

.el-pagination .btn-prev:disabled,
.el-pagination .btn-next:disabled {
  color: #666666;
}

.el-pagination .el-pager li:not(.disabled).active {
  background-color: #3b74ff;
  color: #fff;
  border: none;
}

.el-pagination .btn-prev,
.el-pagination .btn-next,
.el-pagination .el-pager li {
  margin: 10px 5px;
  background-color: white;
  color: #666666;
  min-width: 30px;
  border-radius: 5px;
  border: 1px solid #bcbcbc;
}
</style>
