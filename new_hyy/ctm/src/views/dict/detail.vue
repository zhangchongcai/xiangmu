<template>
  <div class="page-wrapper">
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right"  class="bread-crumb">
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>字典设置</el-breadcrumb-item>
        <el-breadcrumb-item>{{dictTitle}}</el-breadcrumb-item>
     </el-breadcrumb> -->
    <div class="list-wrapper">
      <el-form :inline="true" class="search-box" :model="dictForm" :rules="rules" ref="dictForm" label-position="right" label-width="84px">
        <el-form-item label="类型编码：" prop="dicCode">
          <el-input v-model.trim="dictForm.dicCode" placeholder="数据值:" :disabled="isJustSee || isEdit" v-if="!isJustSee && !isEdit"></el-input>
          <span v-else class="dict-text">{{dictForm.dicCode}}</span>
        </el-form-item>
        <el-form-item label="类型名称：" prop="dictName">
          <el-input v-model.trim="dictForm.dicName" placeholder="名称:" :disabled="isJustSee || isEdit" v-if="!isJustSee && !isEdit"></el-input>
          <span v-else class="dict-text">{{dictForm.dicName}}</span>
        </el-form-item>
        <el-form-item label="描述：" prop="keyDesc">
          <el-input type="textarea" v-model.trim="dictForm.keyDesc" style="height: 32px; width:180px;" rows="1" resize="none" placeholder="描述:" :disabled="isJustSee || isEdit" v-if="!isJustSee && !isEdit"></el-input>
          <span v-else class="dict-text">{{dictForm.keyDesc}}</span>
        </el-form-item>
      </el-form>
      <div style="display:flex; justify-content:space-between;">
        <div style="float:left;">
          <!-- <el-input style="width: 200px;" placeholder="请根据名称或编码进行模糊搜索" v-model="form.name">
        </el-input>-->
        </div>
        <div style="float:right;margin-top:8px;" v-if="!isJustSee">
          <!-- <el-button type="primary" size="mini">查询</el-button> -->
          <el-button type="primary" size="mini" @click="plusItems" style="margin-bottom:10px;">增加</el-button>
        </div>
      </div>
      <div class="customer-list">
        <el-table size="mini" ref="planTable" :data="list" key="planTable" stripe fit highlight-current-row class="plan-table" style="width: 100%">
          <!--<el-table-column type="index" width="50" label="序号" align="center" fixed/>-->
          <el-table-column label="属性编码" prop="keyCode" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.keyCode}}</span>
            </template>
          </el-table-column>
          <el-table-column label="属性名称" prop="keyName" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.keyName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述" prop="keyDesc" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.keyDesc}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="delFlag" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.delFlag | statusFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" v-if="!isJustSee">
            <template slot-scope="scope">
              <span class="table-btn-mini" @click="modifyInlineData(scope.row,scope.$index)">修改</span>
              <span class="table-btn-mini" v-if="scope.row.delFlag == 1" @click="enableBtn(scope.row)">启用</span>
              <span class="table-btn-mini" v-if="scope.row.delFlag == 0" @click="disableBtn(scope.row)">禁用</span>
              <!-- <span class="table-btn-mini" @click="removePlanData(scope.$index)">删除</span> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="btn" style="margin:20px auto; text-align:center;" v-if="!isJustSee">
          <el-button type="primary" v-if="dialogStatus=='create'" @click="saveDict('dictForm',1)">保存</el-button>
          <el-button type="primary" v-else @click="saveDict('dictForm',2)">修改</el-button>
          <el-button @click="quxiao">取消</el-button>
        </div>
        <div class="btn" style="margin:20px auto; text-align:center;" v-else>
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
      <el-form :inline="false" :model="itemform" :rules="rules" ref="itemform" label-position="right" label-width="110px">
        <el-form-item label="属性编码" prop="keyCode">
          <el-input v-model.trim="itemform.keyCode" placeholder :disabled="this.dialogStatus== 'update'"></el-input>
        </el-form-item>
        <el-form-item label="属性名称" prop="keyName">
          <el-input v-model.trim="itemform.keyName" placeholder></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="keyDesc">
          <el-input v-model.trim="itemform.keyDesc" placeholder></el-input>
        </el-form-item>
        <el-form-item label="启用状态" prop="delFlag">
          <el-select v-model="itemform.delFlag" filterable placeholder="请选择" clearable>
            <el-option label="启用" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDialog('itemform')">确 定</el-button>
        <el-button @click="cancel('itemform')">取 消</el-button>
        <!-- <el-button type="primary" @click="closeDialog('itemform',1)" icon="el-icon-check">修 改</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getDicKeyByCode, dictionaryUpdate, dictionaryStatus } from '../../http/interface';
import { baseInterface } from 'base';
const { queryDictList, saveDict, queryDictPropertyList, updateDictProperty, updateDictPropertyStatus } = baseInterface;
export default {
  name: 'dictDetail',
  data () {
    let propertyUnique = (rule, value, callback) => {
      let alphaNum = /^[a-zA-Z0-9]*$/;
      // if (this.propertyCodeSet.length && this.propertyCodeSet.includes(value)) {
      //   callback(new Error('属性编码重复'));
      // } else
      if (!alphaNum.test(value)) {
        callback(new Error('只能输入字母或数字'));
      } else if (value.length > 20) {
        callback(new Error('请输入20个以内字符'));
      } else {
        callback();
      }
    };
    let maxNumLength200 = (rule, value, callback) => {
      if (!!value && value != '' && value.length > 200) {
        callback(new Error('请输入200个以内字符'));
      } else {
        callback();
      }
    };
    let maxLength20 = (rule, value, callback) => {
      if (!!value && value != '' && value.length > 20) {
        callback(new Error('请输入20个以内字符'));
      } else {
        callback();
      }
    };
    let maxNumLength20 = (rule, value, callback) => {
      if (!!value && value != '' && value.length > 20) {
        callback(new Error('请输入20个以内数字'));
      } else {
        callback();
      }
    };
    let especialCode = (rule, value, callback) => {
      let regEn = /[`~!@#$%^&*()_+\+<>?:"{},.\/;'[\]]/g,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/g;
      if (regEn.test(value) || regCn.test(value)) {
        callback(new Error('名称不能包含特殊字符'));
      } else {
        callback();
      }
    };
    let isNormalNameCheck = (rule, value, callback) => {
      var reg = /^[\u4e00-\u9fa50-9a-zA-Z\s\~\`\·\！\!\@\#\￥\%\^\……\&\*\（\）\——\-\+\=\【\】\{\}\|\、\\\：\；\:\;\“\”\‘\’\'\"\[\]\{\}\<\,\>\.\《\》\，\。\？\、\?\/\(\)\_]+$/;
      if (!reg.test(value)) {
        callback(new Error('名称不能包含特殊字符'));
      } else {
        callback();
      }
    };
    return {
      isEdit: false,
      dictTitle: '字典修改',
      form: {},
      list: [],
      isJustSee: false,
      dialogFormVisible: false,
      dialogStatus: 'create',
      textMap: {
        update: '编辑字典项',
        create: '创建字典项'
      },
      modifyIndex: null,
      detailStatus: '',
      tableData: [],
      propertyCodeSet: null,
      itemform: {
        id: null,
        dicCode: '',
        keyCode: '',
        keyName: '',
        keyDesc: '',
        delFlag: '0'
      },
      rules: {
        keyCode: [
          { required: true, message: '请输入属性编码', trigger: 'blur' },
          { validator: propertyUnique, trigger: 'blur' }
        ],
        keyName: [
          { required: true, message: '请输入属性名称', trigger: 'blur' },
          { validator: isNormalNameCheck, trigger: 'blur' },
          { validator: maxLength20, trigger: 'blur' }
        ],
        keyDesc: [
          { validator: maxNumLength200, trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态名称', trigger: 'blur' }
        ]
      },
      dictForm: {
        dicCode: '',
        dicName: '',
        keyDesc: ''
      }
    };
  },
  created () {
    this.isEdit = !!((this.$route.query.isEdit == true || this.$route.query.isEdit == 'true'));
    this.isJustSee = !!((this.$route.query.isJustSee == true || this.$route.query.isJustSee == 'true'));
    if (this.isEdit) {
      // this.dialogStatus = "update";
      this.dictTitle = '修改字典';
      this.dictForm.dicCode = this.$route.query.dicCode;
      this.dictForm.dicName = this.$route.query.dicName;
      this.dictForm.dicDesc = this.$route.query.dicDesc;
      this.dialogStatus = 'update';
      this.getList();
      if (this.isJustSee) {
        this.dictTitle = '查看字典';
      }
    } else {
      this.dictTitle = '新建字典';
      // this.dialogStatus = "create";
    }
  },
  methods: {
    getList () {
      this.listLoading = true;
      // this.listQuery.sortName = 'id'
      // this.listQuery.sort = false
      let postObj = {};
      postObj.dicCode = this.$route.query.dicCode;
      // postObj.propertyCode = ''
      // postObj.propertyName = ''
      // postObj.status = 1
      getDicKeyByCode(postObj).then(ret => {
        this.list = ret.data;
        this.total = ret.totalCount;
        this.listLoading = false;
        this.propertyCodeSet = ret.data.map(item => item.keyCode);
      });
    },
    plusItems () {
      // this.dictitemsForm.tableData.push([])
      this.dialogStatus = 'create';
      console.log(this.dialogStatus);
      if (this.$refs.itemform) {
        this.$refs.itemform.clearValidate();
      }
      this.resetItemform();
      this.dialogFormVisible = true;
    },
    resetItemform () {
      this.itemform = {
        dicCode: '',
        keyCode: '',
        keyName: '',
        keyDesc: '',
        delFlag: '0'
      };
    },
    removePlanData (index) {
      this.dictitemsForm.tableData.splice(index, 1);
    },
    enableBtn (obj) {
      let operObj = obj;
      dictionaryStatus({
        id: operObj.id,
        delFlag: 0
      })
        .then((ret) => {
          if (ret && ret.code == 200) {
            this.getList();
            this.success('启用成功');
          } else {
            this.error('启用失败');
          }
        })
        .catch(() => {
          this.error(ret.msg); // '禁用失败'
        });
    },
    disableBtn (obj) {
      let operObj = JSON.parse(JSON.stringify(obj));
      operObj.keyDesc = operObj.keyDesc ? operObj.keyDesc : '';
      delete operObj.updateTime;
      delete operObj.operator;
      this.$confirm(
        '确认禁用后将不可用，是否继续禁用?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '再想想',
          type: 'warning'
        }
      ).then(() => {
        operObj.delFlag = 1;
        dictionaryStatus({
          id: operObj.id,
          delFlag: 1
        })
          .then((ret) => {
            if (ret && ret.code == 200) {
              this.getList();
              this.success('禁用成功');
            } else {
              this.error('禁用失败');
            }
          })
          .catch(() => {
            this.error(ret.msg); // '禁用失败'
          });
      });
    },
    modifyInlineData (data, rindex) {
      if (this.$refs.itemform) {
        this.$refs.itemform.clearValidate();
      }
      this.dialogFormVisible = true;
      this.itemform = data;
      this.itemform.isModify = true;
      this.modifyIndex = rindex;
      this.itemform.delFlag = data.delFlag.toString();
      this.dialogStatus = 'update';
    },
    closeDialog (formName, num) {
      const set = this.$refs;
      let _this = this;
      set[formName].validate(valid => {
        if (valid) {
          // 属性code
          let propertiesCodesSets = _this.list.map(item => item.keyCode);
          let isCodeChongfu = 0;
          for (let i = 0; i < propertiesCodesSets.length; i++) {
            if (propertiesCodesSets[i] == _this.itemform.keyCode) {
              isCodeChongfu++;
            }
          }
          if (isCodeChongfu > 0 && !_this.itemform.isModify) {
            this.error('属性编码重复。');
            return;
          }
          let propertiesSets = _this.list.map(item => item.keyName);
          let isChongfu = 0;
          for (let i = 0; i < propertiesSets.length; i++) {
            if (propertiesSets[i] == _this.itemform.keyName) {
              isChongfu++;
            }
          }
          if (isChongfu > 0 && !_this.itemform.isModify) {
            this.error('属性名称重复。');
            return;
          }

          // if(_this.list.every(item=>item.propertyName == )){
          //   this.error('属性名称重复。')
          //   return;
          // }
          let adf = _this.itemform;
          if (!_this.itemform.id && _this.dialogStatus != 'update') {
            _this.list.push(_this.itemform);
          }
          if (_this.dialogStatus == 'update') {
            _this.list[_this.modifyIndex] = _this.itemform;
          }
          _this.dialogFormVisible = false;
          _this.itemform = {};
          console.log(this.dialogStatus);
        }
      });
    },
    updateItem (formName, num) {
      if (num == 1) {

      }
    },
    cancel () {
      this.dialogFormVisible = false;
    },
    // createDict(formName,type) {
    //   this.saveDict
    // },
    // updateDict(formName,type) {

    // },
    quxiao () {
      this.$store.commit('tagNav/removeTagNav', this.$route);
      this.$router.push('index');
    },
    saveDict (formName, type) {
      let _this = this;
      const set = this.$refs;
      const isEdit = this.$route.query.isEdit;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.list.forEach(item => {
            this.$set(item, 'dicCode', this.$route.query.dicCode);
            this.$delete(item, 'tenantId');
            this.$delete(item, 'updateTime');
          });
          dictionaryUpdate(this.list).then(ret => {
            if (ret.code == 200) {
              this.success('修改成功');
              this.$store.commit('tagNav/removeTagNav', this.$route);
              this.$router.push('index');
            } else {
              this.error(ret.msg);
            }
          });
        } else {
          return false;
        }
      });
    }
  },
  filters: {
    statusFormat (param) {
      if (status == 0) {
        return '启用';
      } else if (status == 1) {
        return '禁用';
      }
    }
  }
};
</script>

<style scoped>
.page-wrapper {
  padding: 0 14px 0 14px;
}
.dict-text {
  color: #c0c4cc;
  font-size: 13.33px;
}
.list-wrapper {
  /* width: calc(100% - 42px); */
  /* padding:20px; */
  margin-top: 10px;
  margin-bottom: 8px;
  /* border: 1px solid #ccc; */
}
.search-box {
  padding: 24px;
  padding-bottom: 6px;
  background: #f5f5f5;
}
.bread-crumb {
  margin-top: 8px;
  margin-bottom: 8px;
}
.search-box {
  padding: 24px;
  padding-bottom: 6px;
  background: #f5f5f5;
}
.bread-crumb {
  margin-top: 8px;
  margin-bottom: 8px;
}
</style>