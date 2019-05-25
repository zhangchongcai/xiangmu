<template>
  <div>
    <div class="common-header">
      <el-form
        :inline="true"
        :model="GoodsListQueryData"
        label-position="right"
        label-width="100px"
        label-suffix=":"
      >
      <el-form-item label="门店名称">
          <el-input
            v-model="GoodsListQueryData.cinemaUid"
            placeholder="请输内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input
            v-model="GoodsListQueryData.merName"
            placeholder="请输内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input
            v-model="GoodsListQueryData.merCode"
            placeholder="请输内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="sku编码">
          <el-input
            v-model="GoodsListQueryData.skuCode"
            placeholder="请输内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="速记代码">
          <el-input
            v-model="GoodsListQueryData.shorthandCode"
            placeholder="请输内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品类型">
          <el-select v-model="GoodsListQueryData.merType">
            <el-option label="全部" value></el-option>
            <el-option label="单品" value="1"></el-option>
            <el-option label="原材料" value="5"></el-option>
            <el-option label="合成品" value="2"></el-option>
            <el-option label="套餐" value="4"></el-option>
            <el-option label="服务商品" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售状态">
          <el-select v-model="GoodsListQueryData.canSale">
            <el-option label="全部" value></el-option>
            <el-option label="允许" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="query-btn-box">
          <el-button type="primary" @click="GoodsListQueryDataEvent()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="common-left">
      <el-tree
        :data="proThreedata"
        default-expand-all
        ref="proTree"
        node-key="uid"
        :props="proThreedefaultProps"
        @node-click="proThreehandleNodeClick"
      ></el-tree>
    </div>
    <div class="common-right">
      <div>
        <el-table :data="GoodsListData" stripe>
          <el-table-column
            v-for="item in GoodsListDataColumn"
            :key="item.key"
            :prop="item.key"
            :label="item.label"
            :formatter="item.formatter"
          ></el-table-column>
          <el-table-column label="操作" style="width:180px;">
            <template slot-scope="{row,$index}">
              <el-button type="text" size="small" @click.stop="proSeeEvent($index, row)">查看</el-button>
              <el-button type="text" size="small" @click.stop="proModifyEvent($index, row)">修改</el-button>
              <el-button type="text" size="small" @click.stop="proStopEvent($index, row)">停用</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-wrap">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="GoodsListQueryData.page"
            :page-sizes="[10,20,30]"
            :page-size="GoodsListQueryData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      class="change-dialog"
      :title="newProtitleArr.newProtitle"
      :visible.sync="newProDialog"
      width="600px"
    >
      <div class="newPro-box">
        <div class="tips">请先查找是否已存在相同商品，避免重复新建。或从标准商品库中选择您要的商品，添加到系统中使用。</div>
        <div class="title">商品类型：{{this.newProtitleArr.name}}</div>
        <div class="selectName">请选择商品分类</div>
        <div class="newProTree">
          <el-tree :data="proThreedata" :props="proThreedefaultProps" @node-click="addProNodeClick"></el-tree>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="newProDialog = false">取 消</el-button>
        <el-button type="primary" @click="newAddProPage(newProtitleArr.merType)">确 定</el-button>
      </span>
    </el-dialog>
    <com-bank :ComBankdialogVisible.sync="ComBankdialogVisible"></com-bank>
  </div>
</template>

<script>
import qs from "qs";
import ComBank from "./comBank/common";

export default {
  data() {
    return {
      teGetUidArr: [],
      getUidArr: [],
      newProtitleArr: {
        newProtitle: "",
        name: "",
        merType: "",
        merTypeLabel: "",
        uid: "",
        uidname: "",
        proCode: ""
      },
      newProDialog: false,
      ComBankdialogVisible: false,
      // 数结构
      proThreedata: [],
      proThreedefaultProps: {
        children: "children",
        label: "name"
      },
      // 新建状态
      statusRadio: 1,
      //查询数据
      GoodsListQueryData: {
        pageSize: 10,
        page: 1,
        merName: "",
        merCode: "",
        classUid: "",
        canSale: "",
        merType: "",
        shorthandCode: "",
        skuCode: "",
        classUid: "",
        // cinemaUid:"CM123"
        cinemaUid:""
      },
      // 数据总数
      total: 10,
      // 总部首页表格表头
      GoodsListDataColumn: [
        {
          label: "商品名称",
          key: "merName"
        },
        {
          label: "商品编码",
          key: "merCode"
        },
        {
          label: "sku编码",
          key: "skuCode"
        },
        {
          label: "类型",
          key: "merType",
          formatter(row, column, cellValue) {
            let result = "";
            switch (row.merType) {
              case "1":
                result = "单品";
                break;
              case "2":
                result = "合成品";
                break;
              case "3":
                result = "服务商品";
                break;
              case "4":
                result = "套餐";
                break;
              case "5":
                result = "原材料";
                break;
            }
            return result;
          }
        },
        {
          label: "基本单位",
          key: "unitName"
        },
        {
          label: "价格",
          key: "price"
        },
        {
          label: "状态",
          key: "canSaleType",
          formatter(row, column, cellValue) {
            let result = "";
            switch (row.canSaleType) {
              case "1":
                result = "允许";
                break;
              case "0":
                result = "禁用";
                break;
            }
            return result;
          }
        }
      ],
      // 总部首页表格数据
      GoodsListData: [],
      //新建or修改数据
      changeData: {
        status: "1",
        cinemaUid: null,
        code: "CK005",
        name: null,
        address: null
      },
      isNewBuile: true,
      changeDialog: false,
      changeRules: {
        // cinemaUid: [{ required: true, message: "请输入门店名称", trigger: "blur" }],
        // code: [{ required: true, message: "请输入仓库编码", trigger: "blur" }],
        // name: [{ required: true, message: "请输入仓库名称", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.goodsDataQueryGoodsList();
    this.selectProductClass();
  },
  methods: {
    getCheckedNodes() {
      console.log(this.$refs.tree.getCheckedNodes());
    },
    // 初始化
    init() {
      this.queryDataIfNull(this.queryData);
      this.queryStoreEvent(this.queryData);
    },
    // 新建选择分类
    newAddhandleCommand(command) {
      this.comClassSelect(command);
      this.selectProductClass();
    },
    comClassSelect(a) {
      this.newProDialog = true;
      this.newProtitleArr.newProtitle = "新建" + this.newPro(a).name;
      this.newProtitleArr.name = this.newPro(a).name;
      this.newProtitleArr.merType = a;
      this.newProtitleArr.uid = "";
      this.resCreateMerCode(this.newPro(a).erCode);
    },
    singleProPage(param) {
      this.$router.push({
        path: "comSingle",
        query: param
      });
    },
    comMaterialProPage(param) {
      this.$router.push({
        path: "comMaterial",
        query: param
      });
    },
    newPro(a) {
      switch (a) {
        case "1":
          return { name: "单品", erCode: "DP" };
          break;
        case "2":
          return { name: "合成品", erCode: "HC" };
          break;
        case "3":
          return { name: "服务商品", erCode: "FW" };
          break;
        case "4":
          return { name: "套餐", erCode: "TC" };
          break;
        case "5":
          return { name: "原材料", erCode: "YC" };
          break;
      }
    },
    newAddProPage(command) {
      if (this.newProtitleArr.uid == "") {
        // debugger
        this.newProDialog = true;
        this.$message("请选择一个分类");
      } else {
        this.newProDialog = false;
        switch (command) {
          // 单品
          case "1":
            return this.singleProPage({
              type: 1, //1新建，2修改，3查看
              data: JSON.stringify(this.newProtitleArr)
            });
            break;
          // 原材料
          case "2":
            return this.comMaterialProPage({
              type: 1, //1新建，2修改，3查看
              data: JSON.stringify(this.newProtitleArr)
            });
            break;
          // 合成品
          case "3":
            this.comPositeJump({
              type: '1', //1新建，2修改，3查看
              data: JSON.stringify(this.newProtitleArr)
            });
            break;
          // 套餐
          case "4":
            this.setMealJump({
              type: '1', //1新建，2修改，3查看
              data: JSON.stringify(this.newProtitleArr)
            });
            break;
          // 服务商品
          case "5":
            this.serveGoodJump({
              type: '1', //1新建，2修改，3查看
              data: JSON.stringify(this.newProtitleArr)
            });
            break;
        }
      }
    },
    // 新建选择商品分类事件
    addProNodeClick(data) {
      this.newProtitleArr.uid = data.uid == "0" ? "" : data.uid;
      this.newProtitleArr.uidname = data.name;
    },
    proMerTypeNodeClick(data) {
      this.newProtitleArr.merTypeLabel = data.label;
      console.log(data);
    },
    // 合成品页面跳转
    comPositeJump(param) {
      this.$router.push({
        path: "comPosite",
        query: param
      });
    },
    // 服务商品页面跳转
    serveGoodJump(param) {
      this.$router.push({
        path: "serveGood",
        query: param
      });
    },
    // 套餐页面跳转
    setMealJump(param) {
      this.$router.push({
        path: "setMeal",
        query: param
      });
    },
    handleComBank() {},
    // 查询总部首页方法d
    goodsDataQueryGoodsList() {
      let GoodsListQueryData = this.GoodsListQueryData;
      this.$cimList.storequartersGoods
        .goodsDataQueryCinemaGoodsList(GoodsListQueryData)
        .then(res => {
          if (res.code === 200) {
            this.GoodsListData = res.data.list;
            this.total = res.data.total;
          } else {
            this.error(res.msg);
          }
        })
        .catch(err => {});
    },
    // 商品编码请求
    resCreateMerCode(val) {
      let resval = {
        codeHead: val
      };
      this.$cimList.headquartersGoods
        .singleProductCreateMerCode(resval)
        .then(res => {
          if (res.code === 200) {
            this.newProtitleArr.proCode = res.data;
          } else {
            this.error(res.msg);
          }
        })
        .catch(err => {});
    },
    // 查询总部首页事件
    GoodsListQueryDataEvent() {
      this.GoodsListQueryData.classUid = "";
      this.goodsDataQueryGoodsList();
    },
    // 查询商品分类
    selectProductClass() {
      let proClass = { uid: "" };
      this.$cimList.headquartersGoods
        .setmeaLoadCategoies(proClass)
        .then(res => {
          if (res.code === 200) {
            this.proThreedata = [];
            this.proThreedata.push(res.data);
            console.log(res.data);
          } else {
            this.error(res.msg);
          }
        })
        .catch(err => {});
    },
    // 商品分类查询事件
    proThreehandleNodeClick(data) {
      this.getUidArr = [];
      let linshiGetUidArr = [];
      linshiGetUidArr.push(data);
      this.teGetUidArr = linshiGetUidArr;
      this.getUid(this.teGetUidArr);
      this.getUidArr.forEach((value, index, arr) => {
        if (value == 0) {
          arr.splice(index, 1);
        }
      });
      this.GoodsListQueryData.classUid = this.getUidArr.join(",");
      this.goodsDataQueryGoodsList();
    },
    // 获取点击的uid
    getUid(arr) {
      arr.forEach((value, index, arr) => {
        this.getUidArr.push(value.uid);
        this.getUid(value.children);
      });
    },

    // 查询
    onSubmit() {
      this.queryDataIfNull(this.queryData);
      this.queryStoreEvent(this.queryData);
    },
    // 对象属性是否为空 是改为null
    queryDataIfNull(obj) {
      for (var key in obj) {
        if (obj[key] == "") {
          obj[key] = null;
        }
      }
    },
    // 查询数据
    queryStoreEvent(data) {
      this.$api
        .queryStorehouse(data)
        .then(data => {
          let _self = this;
          if (data && data.code === 200) {
            let newdata = data.data;
            _self.tableData = newdata.list;
            _self.total = newdata.total;
            console.log(newdata);
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 新增
    saveStoreEvent(data) {
      this.$api
        .saveStorehouse(data)
        .then(data => {
          let _self = this;
          if (data && data.code === 200) {
            this.queryDataIfNull(this.queryData);
            this.queryStoreEvent(this.queryData);
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    }, // 修改
    updateStoreEvent() {
      let data = {
        status: this.changeData.status,
        cinemaUid: this.changeData.cinemaUid,
        name: this.changeData.name,
        code: this.changeData.code,
        address: this.changeData.address,
        id: this.changeData.id
      };
      this.queryDataIfNull(data);
      this.$api
        .updateStorehouse(data)
        .then(data => {
          let _self = this;
          if (data && data.code === 200) {
            _self.queryDataIfNull(_self.queryData);
            _sethis.queryStoreEvent(this.queryData);
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 修改操作
    handleModification(index, row) {
      this.changeData.status = row.status.toString();
      this.changeData.cinameUid = row.cinameUid;
      this.changeData.name = row.name;
      this.changeData.code = row.code;
      this.changeData.address = row.address;
      this.changeData.id = row.id;
      this.changeDialog = true;
      this.isNewBuile = false;
    },
    // 删除操作
    handleeDlete(index, row) {
      this.$api
        .delStorehouse(row.id)
        .then(data => {
          let _self = this;
          if (data && data.code === 200) {
            _self.queryDataIfNull(_self.queryData);
            _self.queryStoreEvent(_self.queryData);
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //确认提交修改
    handleModificationSubmit() {
      let _self = this;
      console.log(this.changeData);
      _self.$refs["changeForm"].validate(valid => {
        if (valid) {
          if (_self.isNewBuile) {
            _self.queryDataIfNull(_self.changeData);
            _self.saveStoreEvent(_self.changeData);
          } else {
            _self.updateStoreEvent();
          }
          _self.queryDataIfNull(_self.queryData);
          _self.queryStoreEvent(_self.queryData);
          _self.changeDialog = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSizeChange(val) {
      this.GoodsListQueryData.pageSize = val;
      this.goodsDataQueryGoodsList()
      this.queryStoreEvent(this.queryData);
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.GoodsListQueryData.page = val;
      this.goodsDataQueryGoodsList()
      this.queryStoreEvent(this.queryData);
      console.log(`当前页: ${val}`);
    },
    handleComBank() {
      this.ComBankdialogVisible = true;
      // this.changeData={
      //   status: "0",
      //   cinemaUid:"cuidtest0055541",
      //   code: "CK0052",
      //   name: null,
      //   address:null
      // },
      // this.changeDialog = true;
      // this.isNewBuile = true;
    },
    // 查看
    proSeeEvent(index, row) {
      console.log(row);
      //  1：单品，2：合成品，3：服务，4：套餐，5：原材料
      switch (row.merType) {
        // 单品
        case "1":
          this.singleProPage({
            type: '3',
            data: JSON.stringify(row)
          });
          break;
        // 合成品
        case "2":
         this.comPositeJump({
            type: '3',
            data: JSON.stringify(row)
          });
          break;
        // 服务商品
        case "3":
         this.serveGoodJump({
            type: '3',
            data: JSON.stringify(row)
          });
          break;
        //套餐
        case "4":
         this.setMealJump({
            type: '3',
            data: JSON.stringify(row)
          });
          break;
        // 原材料
        case "5":
           this.comMaterialProPage({
            type: '3',
            data: JSON.stringify(row)
          })
          break;
      }
    },

    // 修改
    proModifyEvent(index, row) {
       switch (row.merType) {
        // 单品
        case "1":
          this.singleProPage({
            type: '2',
            data: JSON.stringify(row)
          });
          break;
        // 合成品
        case "2":
         this.comPositeJump({
            type: '2',
            data: JSON.stringify(row)
          });
          break;
        // 服务商品
        case "3":
         this.serveGoodJump({
            type: '2',
            data: JSON.stringify(row)
          });
          break;
        //套餐
        case "4":
         this.setMealJump({
            type: '2',
            data: JSON.stringify(row)
          });
          break;
        // 原材料
        case "5":
          this.comMaterialProPage({
            type: '2',
            data: JSON.stringify(row)
          })
          break;
      }
    },
    // 停用
    proStopEvent(index, row) {
      let val = {
          uid:row.uid,
          skuCode:row.skuCode,
          skuUid:row.skuUid,
          merType:row.merType,
          canSaleType:row.canSaleType
      }
      this.$cimList.headquartersGoods
        .goodsDataUpdateMerStatusByUid(val)
        .then(res => {
          if (res.code === 200) {
            this.GoodsListData.canSaleType = res.data
            this.$message("操作成功");
            this.error(res.msg);
          }else{
            this.$message(res.msg);
          }
        })
        .catch(err => {});
    },
    // 删除
    proDelEvent(index, row) {},
    // proSwitchEvent(value) {
    //   switch (value) {
    //     // 单品
    //     case "单品":
    //       this.singleProPage({
    //         type: 3 //1新建，2修改，3查看
    //       });
    //       break;
    //     // 原材料
    //     case "原材料":
    //       this.comMaterialProPage({
    //         type: 3 //1新建，2修改，3查看
    //       });
    //       break;
    //     // 合成品
    //     case "合成品":
    //       break;
    //     // 套餐
    //     case "套餐":
    //       break;
    //     // 服务商品
    //     case "服务商品":
    //       break;
    //   }
    // }
  },
  components: {
    ComBank
  }
};
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";
.change-dialog {
  .el-form--inline .el-form-item {
    width: 100%;
  }
  .el-form-item__content {
    width: 70%;
  }
}
.bigBox .has-gutter tr th{
  background: #e7ebff !important; 
}
.el-form-item__label,.el-input__inner{
  color:#666;
}

.bigBox .has-gutter tr th{
      background: red;
}
.common-left {
  width: 200px;
  height: 100px;
  float: left;
}
.common-right {
  padding-left: 200px;
}
.newPro-box {
  .tips {
  }
  .title {
    margin: 10px 0;
    font-size: 16px;
  }
  .selectName {
    font-size: 16px;
    margin: 10px 0;
  }
  .newProTree {
    height: 330px;
    overflow: auto;
  }
}
</style>