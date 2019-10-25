<template>
  <div class="_member-tags-list">
    <el-form :inline="true" :model="formData" ref="formData" class="form-data-wrap _member-search-area-custom">
      <el-form-item label="标签名称：" prop="labelName">
        <el-input v-model="formData.labelName" @blur="()=>{formData.labelName = formData.labelName.trim()}" placeholder="填写标签名称" clearable></el-input>
      </el-form-item>
      <el-form-item class="btn-wrap">
        <el-button type="primary" @click="handleSearch" class="_el-btn-custom">搜索</el-button>
        <el-button @click="resetForm('formData')" plain class="_el-btn-custom _member-custom-ghost-button">重置
        </el-button>
      </el-form-item>
    </el-form>
    <div class="_btn-option-wrap">
      <el-button plain class="_el-btn-custom _member-custom-ghost-button" @click="handleAddMemberTags">新建会员标签
      </el-button>
      <el-button plain class="_el-btn-custom _member-custom-ghost-button" @click="handleSendingInterval">发送间隔设置
      </el-button>
      <el-button plain class="_el-btn-custom _member-custom-ghost-button" @click="handleMsgListDetail">查看短信发送详情
      </el-button>
    </div>
    <div class="member-tags-table _m-member-table-custom">
      <el-table :data="tableData" stripe style="width: 100%" :empty-text="tipMessage">
        <el-table-column prop="labelName" label="标签名称" min-width="120" :formatter="formateEmpty" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="labelRules" label="筛选条件" min-width="120" :formatter="formateEmpty" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button @click="handleScreen(scope.row.labelRules)" type="text" size="small" class="operation-button">查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="135" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.createTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column prop="numberPeople" label="人数" min-width="120" :formatter="formateEmpty" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="_calculate-number-people" v-if='scope.row.numberPeople == null || scope.row.numberPeople == undefined'>
              <div class="_calculate-desc">计算中...</div>
              <el-tooltip class="item" effect="dark" :visible-arrow="false" content="请稍后手动刷新页面查看计算结果" placement="right-start">
                <i class="iconfont icon-danchuang-tishi _calculating-tip"></i>
              </el-tooltip>
            </div>
            <div v-else>{{scope.row.numberPeople}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="percent" label="人数占比" min-width="120" :formatter="formateEmpty" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="_calculate-number-people" v-if='scope.row.percent == null || scope.row.percent == undefined'>
              <div class="_calculate-desc">计算中...</div>
              <el-tooltip class="item" effect="dark" :visible-arrow="false" content="请稍后手动刷新页面查看计算结果" placement="right-start">
                <i class="iconfont icon-danchuang-tishi _calculating-tip"></i>
              </el-tooltip>
            </div>
            <div v-else>{{scope.row.percent}}%</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="185">
          <template slot-scope="scope">
            <el-button @click="handleSendMsg(scope.row)" :disabled='scope.row.numberPeople == null || scope.row.numberPeople == undefined || scope.row.numberPeople == 0 || scope.row.percent == null || scope.row.percent == undefined || scope.row.percent == 0' type="text" size="small" class="operation-button">发短信
            </el-button>
            <el-button @click="handleEditTags(scope.row)" type="text" size="small" class="operation-button">编辑
            </el-button>
            <el-button @click="handleDeleteTag(scope.row)" type="text" size="small" class="operation-button">删除
            </el-button>
            <el-button disabled @click="handleStartMarket(scope.row)" type="text" size="small" class="operation-button">
              发起营销</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="posVisible" label="是否在POS上显示" min-width="120">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.posVisible" :active-value="1" :inactive-value="0" @change="handleIsShowPos($event,scope.row)">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 start -->
    <div class="page-wrap">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formData.current-0" :page-size="formData.size-0" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[20 , 50 , 100]" :total="total-0"></el-pagination>
    </div>
    <!-- 分页 end -->
    <!--  查看筛选条件的dialog -->
    <el-dialog title="筛选条件" class="__screen-dialog" :visible.sync="screenDialog" width="576px">
      <screenDetailDialog :screenData="screenData" />
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="screenDialog = false" class="_el-btn-custom">关闭</el-button>
      </span>
    </el-dialog>
    <!--  发送间隔设置的dialog -->
    <el-dialog title="时间间隔设置" class="__time-interval-dialog" :visible.sync="timeIntervalDialog">
      <el-form :model="timeIntervalData" ref="timeIntervalData" class="_time-interval-dialog-form-data-wrap">
        <el-tooltip class="item" effect="dark" :visible-arrow="false" content="设置同一手机号接收多条短信之间的间隔时间" placement="right-start">
          <i class="iconfont icon-danchuang-tishi _tags-tip"></i>
        </el-tooltip>
        <el-form-item label="用户接受短信间隔时间：" class="_time-interval-lable" prop="timeSpan" :rules="{
                          required: true, validator: checkIntervalTime, trigger: 'blur'
                        }">
          <el-input v-model="timeIntervalData.timeSpan" class="__time-interval-input" placeholder="请填写间隔时间" clearable>
          </el-input>
          <span class="_time-interval-unit">
            天</span>
        </el-form-item>
        <el-form-item class="btn-wrap">
          <el-button type="primary" size="medium" @click="handleSureTimeIntervsl('timeIntervalData')" class="_el-btn-custom _member-add-edit-save-btn">确定</el-button>
          <el-button size="medium" @click="timeIntervalDialog = false" class="_el-btn-custom">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--  发送短信的dialog -->
    <el-dialog title="发送短信" class="__send-msg-dialog" :visible.sync="sendMsgDialog" @close="handleSendMsgDialogClose" width="576px">
      <el-form :model="sendMsgData" ref="sendMsgData" class="_send-msg-dialog-form-data-wrap">
        <el-form-item label="短信内容：" class="_send-msg-lable" prop="content" :rules="[{ max: 70, message: '长度不可超过70个字符', trigger: 'blur' },{required: true, validator: checkMsgContent, trigger: 'blur'}]">
          <el-input type="textarea" :class="isPreview?'_send-msg-textarea':''" resize="none" :rows="7" placeholder="请输入" v-model="sendMsgData.content" :readonly="isPreview?true:false">
          </el-input>
        </el-form-item>
        <el-form-item class="btn-wrap">
          <template v-if="!isPreview">
            <el-button type="primary" size="medium" @click="handlePreviewMsg('sendMsgData')" class="_el-btn-custom _member-add-edit-save-btn">预览</el-button>
            <el-button size="medium" @click="handleCanclePreviewMsg" class="_el-btn-custom">取消</el-button>
          </template>
          <template v-if="isPreview">
            <el-button type="primary" size="medium" @click="handleSureSendMsg" class="_el-btn-custom _member-add-edit-save-btn">确认发送</el-button>
            <el-button size="medium" @click="isPreview = false" class="_el-btn-custom">重新编辑</el-button>
          </template>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 删除标签的dialog -->
    <el-dialog title="" :visible.sync="deleteLabelDialog" width="320px" :show-close="false" class="_member-tip-dialog-custom-style">
      <i class="iconfont icon-danchuang-tishi _member-tip-dialog-icon"></i>
      <span class="_member-tip-dialog-desc">确定要删除 {{deleteLabelInfo.labelName}} 吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSureDeleteLabel" class="_el-btn-custom _member-add-edit-save-btn">确定
        </el-button>
        <el-button @click="deleteLabelDialog = false" class="_el-btn-custom _member-add-edit-save-btn">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import screenDetailDialog from '../components/screenDetailDialog';
export default {
  name: 'memberTags',
  data () {
    return {
      deleteLabelDialog: false, // 删除标签的dialog
      deleteLabelInfo: '', // 要删除的标签的信息
      isPreview: false, // 是否预览模式
      sendMsgDialog: false, // 发短信弹窗是否显示
      timeIntervalDialog: false, // 设置时间间隔弹窗
      screenDialog: false, // 筛选弹层是否显示
      screenData: '', // 筛选条件
      tipMessage: '',
      tableData: [],
      total: 20,
      formData: {
        labelName: '', // 标签名称
        current: 1,
        size: 20,
        tenantId: this.$store.state.loginUser.consumerId // 租户id
      },
      // 时间间隔设置
      timeIntervalData: {
        timeSpan: 0,
        tenantId: this.$store.state.loginUser.consumerId // 租户id
      },
      // 发送短信内容
      sendMsgData: {
        content: '', // 短信内容
        labelId: '', // 标签id
        tenantId: this.$store.state.loginUser.consumerId // 租户id
      }
    };
  },
  components: {
    screenDetailDialog
  },
  mounted () {
    this.search();
  },
  // activated() {
  //   // this.search();
  // },
  methods: {
    search () {
      let params = JSON.parse(JSON.stringify(this.formData));
      this.tipMessage = '数据加载中...';
      this.$crmList
        .labelListPage(params)
        .then(data => {
          if (data.total == 0 || data == null) {
            this.tipMessage = '暂无数据';
          }
          this.tableData = data.records;
          this.total = data.total;
        })
        .catch(err => {
          if (err && err.msg) {
            this.tipMessage = err.msg;
          } else {
            this.tipMessage = '系统繁忙，请稍后重试！';
          }
        });
    },
    //   搜索
    handleSearch () {
      this.formData.current = 1;
      this.search();
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    handleAddMemberTags () {
      this.$router.push({ path: '/member/memberTags/add' });
    },
    // 发送时间间隔
    handleSendingInterval () {
      this.$crmList
        .getMessageTimeSpan({
          tenantId: this.$store.state.loginUser.consumerId
        })
        .then(res => {
          this.timeIntervalData.timeSpan = res;
        })
        .catch(err => {
          console.log(err);
        });
      this.timeIntervalDialog = true;
    },
    // 时间间隔弹窗点击确定
    handleSureTimeIntervsl (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.timeIntervalDialog = false;
          let params = JSON.parse(JSON.stringify(this.timeIntervalData));
          this.$crmList
            .editMessageTimeSpan(params)
            .then(res => {
              this.$message.success('时间间隔设置成功');
            })
            .catch(err => {
              this.$message.error('时间间隔设置失败，请重试');
              console.log(err);
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 验证时间间隔
    checkIntervalTime (rule, value, callback) {
      if (value == null) {
        value = '';
      }
      if (value.toString().replace(/\s/g, '') == '') {
        callback(new Error('请输入数字'));
      }
      if (value.toString().replace(/\s/g, '') == 0) {
        callback();
      }
      if (!/^[0-9]\d*$/.test(value.toString().replace(/\s/g, ''))) {
        callback(new Error('请输入整数'));
      }
      if (value.toString().replace(/\s/g, '') * 1 > 99999999) {
        callback(new Error('最多不能超过8位数字'));
      } else {
        callback();
      }
    },
    // 点击发短信操作按钮
    handleSendMsg (scope) {
      this.sendMsgDialog = true;
      this.sendMsgData.labelId = scope.id;
    },
    // 发送短信内容验证
    checkMsgContent (rule, value, callback) {
      // 输入限制正则
      var testName = /^[\u4e00-\u9fa50-9a-zA-Z\s\~\`\·\！\!\@\#\￥\%\^\……\&\*\（\）\——\-\+\=\【\】\{\}\|\、\\\：\；\:\;\“\”\‘\’\'\"\[\]\{\}\<\,\>\.\《\》\，\。\？\、\?\/\(\)\_]+$/;

      if (value == null) {
        value = '';
      }
      if (value.toString().replace(/\s/g, '') == '') {
        callback(new Error('短信内容不能为空'));
      } else if (!testName.test(value.toString().trim())) {
        callback(new Error('输入的短信含有不合法字符'));
      } else {
        callback();
      }
    },
    // 点击发送短信预览按钮
    handlePreviewMsg (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isPreview = true;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 取消预览或点击弹窗的叉号
    handleCanclePreviewMsg () {
      this.sendMsgDialog = false;
      // this.$refs["sendMsgData"].clearValidate()
    },
    // 发送短信的弹窗关闭时的回调
    handleSendMsgDialogClose () {
      this.isPreview = false;
      this.$refs['sendMsgData'].clearValidate();
    },
    // 确认发送短信
    handleSureSendMsg () {
      this.sendMsgDialog = false;
      let params = JSON.parse(JSON.stringify(this.sendMsgData));
      this.$crmList
        .sendLabelMessage(params)
        .then(res => {
          if (res) {
            this.$message.success('操作成功,请稍后查看短信发送结果');
            this.sendMsgData.content = '';
          } else {
            this.$message.warning('该标签内没有对应的会员');
          }
        })
        .catch(err => {
          this.$message.error('操作失败，请重试');
          console.log(err);
        });
    },
    // 查看短信发送详情
    handleMsgListDetail () {
      this.$router.push({ path: '/member/memberTags/msgDetailList' });
    },
    // 查看筛选条件
    handleScreen (scope) {
      this.screenDialog = true;
      this.$set(this, 'screenData', scope);
    },
    // 编辑标签
    handleEditTags (scope) {
      this.$router.push({
        path: '/member/memberTags/edit',
        query: { labelId: scope.id }
      });
    },
    // 点击删除标签按钮
    handleDeleteTag (scope) {
      this.deleteLabelDialog = true;
      this.deleteLabelInfo = scope;
    },
    // 确定删除标签
    handleSureDeleteLabel () {
      this.deleteLabelDialog = false;
      let data = {
        isDel: 1,
        id: this.deleteLabelInfo.id, // 标签id
        tenantId: this.$store.state.loginUser.consumerId // 租户id
      };
      this.$crmList
        .labelEdit(data)
        .then(() => {
          if (data) {
            this.search();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        })
        .catch(err => console.log(err));
    },
    // 发起营销
    handleStartMarket (scope) {
      console.log('发起营销功能暂未上线');
    },
    // 是否在POS上显示
    handleIsShowPos (status, scope) {
      let data = {
        posVisible: status,
        id: scope.id, // 标签id
        tenantId: this.$store.state.loginUser.consumerId // 租户id
      };
      this.$crmList
        .labelEdit(data)
        .then(() => {
          if (data) {
            this.search();
            if (status) {
              this.$message({
                type: 'success',
                message: '该标签将在POS上显示!'
              });
            } else {
              this.$message({
                type: 'success',
                message: '该标签将不在POS上显示!'
              });
            }
          }
        })
        .catch(err => {
          console.log(err);
          this.search();
          this.$message.error('操作失败，请重试！');
        });
    },
    handleSizeChange (val) {
      this.formData.size = val;
      this.search();
    },
    handleCurrentChange (val) {
      this.formData.current = val;
      this.search();
    },
    formateEmpty (row, column, cellValue, index) {
      if (cellValue == null || cellValue == undefined || cellValue === '') {
        return '-';
      } else {
        return cellValue;
      }
    }
  },
  filters: {
    formatCreateTime: function (value) {
      if (value) {
        return new Date(value.replace(/-/g, '/')).formatDate(
          'yyyy-MM-dd hh:mm:ss'
        );
      } else {
        return '-';
      }
    }
  }
};
</script>
<style lang="scss">
._member-tags-list {
  ._btn-option-wrap {
    font-size: 12px;
    padding: 6px 0;
    text-align: right;
    .add-button-custom {
      font-size: 12px;
      //   width: 96px;
      // padding: 8px 10px;
    }
  }
  .member-tags-table {
    .operation-button span {
      font-size: 12px;
    }
    ._calculate-number-people {
      display: flex;
      ._calculate-desc {
        margin-right: 10px;
      }
      ._calculating-tip {
        font-size: 14px;
        position: relative;
        top: -2px;
      }
    }
  }
}
// 筛选条件的dialog
.__screen-dialog {
  .el-dialog__header {
    padding: 10px 20px;
  }
  .el-dialog__body {
    padding: 0px 20px;
  }
  .el-dialog__footer {
    text-align: center;
  }
  .el-dialog__headerbtn {
    top: 13px;
  }
}
// 设置时间间隔的dialog
.__time-interval-dialog {
  .el-dialog {
    width: 448px;
  }
  .el-dialog__header {
    padding: 10px 20px;
  }
  .el-dialog__body {
    padding: 0px 20px;
    position: relative;
  }
  .el-dialog__footer {
    text-align: center;
  }
  .el-dialog__headerbtn {
    top: 13px;
  }
  ._time-interval-dialog-form-data-wrap {
    padding: 15px 50px;
    ._tags-tip {
      font-size: 14px;
      color: #333333;
      position: absolute;
      top: -30px;
      left: 110px;
    }
    ._time-interval-lable {
      width: 345px;
      text-align: center;
      margin: 0 auto 22px;
      .__time-interval-input {
        width: 145px;
        height: 32px;
      }
      ._time-interval-unit {
        margin-left: 5px;
        font-size: 12px;
        color: #666666;
      }
    }
    .btn-wrap {
      text-align: center;
      padding: 0 0 20px;
      margin-bottom: 0;
    }
  }
}
// 发送短信的dialog
.__send-msg-dialog {
  .el-dialog__header {
    padding: 10px 20px;
  }
  .el-dialog__body {
    padding: 0px 20px;
    position: relative;
  }
  .el-dialog__footer {
    text-align: center;
  }
  .el-dialog__headerbtn {
    top: 13px;
  }
  ._send-msg-dialog-form-data-wrap {
    padding: 10px 50px;
    .el-form-item {
      margin-bottom: 0;
    }
    .btn-wrap {
      margin: 15px auto 0;
      text-align: center;
      padding-bottom: 15px;
    }
    ._send-msg-textarea {
      border-color: #fff;
      .el-textarea__inner {
        border-color: #fff;
      }
    }
  }
}
</style>
