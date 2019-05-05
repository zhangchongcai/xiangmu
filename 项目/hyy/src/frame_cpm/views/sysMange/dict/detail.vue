<template>
  <div class="page-wrapper">
    <d5-breadcrumb level1="系统设置" level2="字典设置" level3="字典修改"></d5-breadcrumb>
    <div class="list-wrapper">
    <el-form
      :inline="true"
      :model="dictForm"
      :rules="rules"
      ref="dictForm"
      label-position="left"
      label-width="70px"
    >
      <el-form-item label="类型编码" prop="dictCode">
        <el-input v-model="dictForm.dictCode" placeholder="数据值:" :disabled="isJustSee"></el-input>
      </el-form-item>
      <el-form-item label="类型名称" prop="dictName">
        <el-input v-model="dictForm.dictName" placeholder="名称:" :disabled="isJustSee"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="dictForm.description" placeholder="描述:" :disabled="isJustSee"></el-input>
      </el-form-item>
    </el-form>
    <div style="display:flex; justify-content:space-between;">
      <div style="float:left;">
        <!-- <el-input style="width: 200px;" placeholder="请根据名称或编码进行模糊搜索" v-model="form.name">
        </el-input>-->
      </div>
      <div style="float:right;" v-if="!isJustSee">
        <!-- <el-button type="primary" size="mini">查询</el-button> -->
        <el-button type="primary" size="mini" @click="plusItems" style="margin-bottom:10px;">增加</el-button>
      </div>
    </div>
    <div class="customer-list">
      <el-table
        size="mini"
        ref="planTable"
        :data="list"
        key="planTable"
        stripe
        fit
        highlight-current-row
        class="plan-table"
        style="width: 100%"
      >
        <!--<el-table-column type="index" width="50" label="序号" align="center" fixed/>-->
        <el-table-column label="属性编码" prop="propertyCode" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.propertyCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="属性名称" prop="telephone" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.propertyName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="job" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.description}}</span>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="email" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.seq}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="email" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.status | statusFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" v-if="!isJustSee">
          <template slot-scope="scope">
            <span class="table-btn-mini" @click="modifyInlineData(scope.row)">修改</span>
            <span class="table-btn-mini" v-if="scope.row.status == -1" @click="enableBtn(scope.row)">启用</span>
            <span class="table-btn-mini" v-if="scope.row.status == 1" @click="disableBtn(scope.row)">禁用</span>
            <!-- <span class="table-btn-mini" @click="removePlanData(scope.$index)">删除</span> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="btn" style="margin:20px auto; text-align:center;" v-if="!isJustSee">
          <el-button @click="quxiao">取消</el-button>
          <el-button type="primary" v-if="dialogStatus=='create'" @click="saveDict('dictForm',1)">保存</el-button>
          <el-button type="primary" v-else @click="saveDict('dictForm',2)">修改</el-button>
      </div>
      <div  class="btn" style="margin:20px auto; text-align:center;" v-else>
         <el-button @click="quxiao">返回</el-button>
      </div>
    </div>
    </div>
    <!-- <div  class="dialog-footer">
        <el-button type="primary" @click="cancel('form')" icon="el-icon-close">取 消</el-button>
        <el-button v-if="detailStatus=='create'" type="primary" @click="create('form')" icon="el-icon-check">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')" icon="el-icon-check">修 改</el-button>
    </div>-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form
        :inline="false"
        :model="itemform"
        :rules="rules"
        ref="itemform"
        label-position="right"
        label-width="110px"
      >
        <el-form-item label="属性编码" prop="propertyCode">
          <el-input v-model.trim="itemform.propertyCode" placeholder :disabled="this.dialogStatus== 'update'"></el-input>
        </el-form-item>
        <el-form-item label="属性名称" prop="propertyName">
          <el-input v-model.trim="itemform.propertyName" placeholder :disabled="this.dialogStatus== 'update'"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model.trim="itemform.description" placeholder></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="seq">
          <el-input v-model.trim="itemform.seq" placeholder></el-input>
        </el-form-item>
        <el-form-item label="启用状态" prop="status">
          <el-select v-model="itemform.status" filterable placeholder="请选择" clearable>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="-1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('itemform')" icon="el-icon-close">取 消</el-button>
        <el-button type="primary" @click="closeDialog('itemform')" icon="el-icon-check">确 定</el-button>
        <!-- <el-button v-else type="primary" @click="updateItem('itemform')" icon="el-icon-check">修 改</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "dictDetail",
  data() {
     let propertyUnique =(rule,value,callback)=> {
       let alphaNum = /^[a-zA-Z0-9]*$/
          if (this.propertyCodeSet.includes(value)) {
            callback(new Error('属性编码重复'));
          } else if(!alphaNum.test(value)){
             callback(new Error('只能输入字母或数字'));
          } else if(value.length<6 || value.length>40){
             callback(new Error('请输入6-20个字符'));
          }else {
            callback();
          }
        };
        let seqNum =(rule,value,callback)=> {
          let alphaNum = /^[0-9]*$/
          if(!alphaNum.test(value)){
             callback(new Error('只能输入数字'));
          }else{
            callback();
          }
        };
        let especialCode = (rule,value,callback)=> {
          let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/g,
          regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/g;
          if(!regEn.test(value) || !regCn.test(value)){
             callback(new Error('名称不能包含特殊字符'));
          }else{
            callback();
          }
        }
    return {
      form: {},
      list: [],
      isJustSee:false,
      dialogFormVisible: false,
      dialogStatus: "create",
      textMap: {
        update: "编辑字典项",
        create: "创建字典项"
      },
      detailStatus: "",
      tableData: [],
      propertyCodeSet:null,
      itemform: {
        id: null,
        dictCode: "",
        propertyCode: "",
        propertyName: "",
        description: "",
        sequence: "",
        status: '1'
      },
      rules: {
        propertyCode: [
          {required: true,  message: "属性编码必填",trigger: "blur"},
          {validator:propertyUnique,trigger:"blur"}
        ],
        propertyName: [
          {required: true,message: "属性名称必填",trigger: "blur"},
          {validator:especialCode,trigger:"blur"}
        ],
        seq:[
          {validator:seqNum,trigger: "blur"}
        ],
        status: [
          {required: true,message: "状态名称必填",trigger: "blur"}
        ],
      },
      dictForm: {
        dictCode: "",
        dictName: "",
        description: ""
      }
    };
  },
  created() {
    if (this.$route.query.isEdit) {
      // this.dialogStatus = "update";
      this.dictForm.dictCode = this.$route.query.dictCode;
      this.dictForm.dictName = this.$route.query.dictName;
      this.dictForm.description = this.$route.query.description;
    } else {
      // this.dialogStatus = "create";
    }
    this.isJustSee = Boolean(this.$route.query.isJustSee)?Boolean(this.$route.query.isJustSee):false
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      // this.listQuery.sortName = 'id'
      // this.listQuery.sort = false
      let postObj = {};
      postObj.dictCode = this.$route.query.dictCode;
      // postObj.propertyCode = ''
      // postObj.propertyName = ''
      // postObj.status = 1
      this.$api.queryDictPropertyList(postObj).then(ret => {
        this.list = ret.data;
        this.total = ret.totalCount;
        this.listLoading = false;
        this.propertyCodeSet = ret.data.map(item=>item.propertyCode)
      });
    },
    plusItems() {
      // this.dictitemsForm.tableData.push([])
      this.dialogStatus= "create"
      this.resetItemform()
      this.dialogFormVisible = true;
    },
    resetItemform(){
      this.itemform ={
        dictCode: "",
        propertyCode: "",
        propertyName: "",
        description: "",
        sequence: "",
        status: '1'
      }
    },
    removePlanData(index) {
      this.dictitemsForm.tableData.splice(index, 1);
    },
    enableBtn(obj){
        let operObj = obj
        operObj.status = 1;
        this.$dictApi.updateDictProperty(operObj)
        .then((ret) => {
          this.getList()
          this.success(ret.msg)
        })
        .catch(() => {
          this.error(ret.msg) // '禁用失败'
        })
			},
    disableBtn (obj) {
        this.$confirm(
          '确认禁用后将不可用，是否继续禁用?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '再想想',
            type: 'warning'
          }
        ).then(() => {         
          let operObj = obj
          operObj.status = -1;
          this.$dictApi.updateDictProperty(operObj)
            .then((ret) => {
              this.getList()
              this.success(ret.msg)
            })
            .catch(() => {
              this.error(ret.msg) // '禁用失败'
            })
        })
    },
    modifyInlineData(data) {
      console.log(data);
      this.dialogFormVisible = true;
      this.itemform = data;
      this.itemform.status =data.status.toString()
      this.dialogStatus = "update";
    },
    closeDialog() {
      this.dialogFormVisible = false;
      let adf = this.itemform
      if(!this.itemform.id){
          this.list.push(this.itemform);
      }
      this.itemform = {};
    },
    // createDict(formName,type) {
    //   this.saveDict
    // },
    // updateDict(formName,type) {
      
    // },
    quxiao(){
        this.$router.go(-1)
    },
    saveDict(formName,type) {
      const set = this.$refs;
      const isEdit = this.$route.query.isEdit
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.dictForm.opType ='2'
          if(type == 2){
            this.dictForm.id = this.$route.query.id
          }
          this.dictForm.properties = this.list
          let postForm = this.dictForm
          postForm.code = this.dictForm.dictCode
          postForm.name = this.dictForm.dictName
          this.$api.saveDict(this.dictForm).then(ret => {
            if(ret.result){
                this.$router.back(-1)
                this.$notify({
                    title: "成功",
                    message: "修改成功",
                    type: "success",
                    duration: 2000
                });
            }
          });
        } else {
          return false;
        }
      });
    }
  },
  filters:{
    statusFormat(param){
      switch (param){
      case '1': 
        return '启用'
        break
      case '-1':
        return '禁用'
        break
      }

    }
  }
};
</script>

<style scoped>
</style>