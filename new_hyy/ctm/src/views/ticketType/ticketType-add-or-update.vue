<template>
  <div class="ticket-Type">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px" class="common-form">
      <el-form-item label="票类名称:" prop="name" v-if="dataForm.name!='成人票'&&dataForm.name!='团体票'&&dataForm.name!='学生票'">
        <el-input v-model="dataForm.name" placeholder="请输入票类名称" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item label="票类名称:" prop="name" v-else>
        <el-input v-model="dataForm.name" placeholder="请输入票类名称" disabled style="width:200px"></el-input>
      </el-form-item>
      <el-form-item label="票类顺序:" prop="seq">
        <el-input v-model="dataForm.seq" placeholder="请输入票类顺序" maxlength="10" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item label="是否允许打折:" size="mini" prop="isDiscount">
        <el-radio-group v-model="dataForm.isDiscount">
          <el-radio :label="1">否</el-radio>
          <el-radio :label="0">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="适用影院范围:" size="mini" prop="useRange">
        <el-radio-group v-model="dataForm.useRange">
          <el-radio :label="1">适用全部影院</el-radio>
          <el-radio :label="0">适用指定影院</el-radio>
        </el-radio-group>

        <el-form-item style="display:inline-block;margin-left:10px" v-if="dataForm.useRange=='0'">
          <el-input class="popup-input" v-model="cinemaNameStr" readonly>
            <i slot="suffix" class="el-icon-close popup-close" @click="clearInputValue()" v-if="cinemaNameStr"></i>
          </el-input>
          <el-button type="primary" @click="inputFocus" style="margin-left:10px">选择</el-button>
        </el-form-item>
      </el-form-item>
      <div class="footer" style="text-align:center">
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        <el-button @click='returnList()'>返回</el-button>
      </div>
    </el-form>
    <!-- 选择影院弹窗 -->
    <GroupMultiSelectCinema :reviewData="huixianData" :dialogVisible.sync="dialogVisible" @frameCinemaDialogCallBack="handleRegisterCinemaCallBack" :disabledData=[] :innerCinemaMultiData='innerData'>
    </GroupMultiSelectCinema>
  </div>
</template>
<script>
import { multiCinema2 } from 'base';
export default {
  components: { GroupMultiSelectCinema: multiCinema2 },
  data () {
    let checkNum = (rule, value, callback) => {
      let reg = /^\d{1,2}$/;
      if (!reg.test(value)) {
        callback(new Error('请输入0到99的整数，且字符不超过两个'));
      } else {
        callback();
      }
    };
    return {
      cinemaNameStr: '',
      dataForm: {
        name: '',
        seq: '',
        isDiscount: 1,
        useRange: 1,
        cinemaNames: [],
        cinemaUids: [],
        cinemaIds: []
      },
      innerData: {
        type: 2
      },
      dialogVisible: false,
      huixianData: [],
      dataRule: {
        name: [
          { required: true, message: '票类名称不能为空', trigger: 'blur' },
          { max: 12, message: '票类名称不能超过12个字', trigger: 'blur' }
        ],
        seq: [
          { required: true, message: '票类顺序不能为空', trigger: 'blur' },
          { validator: checkNum, trigger: 'blur' }
        ]
      }
    };
  },
  created () {
    // this.load();
  },
  methods: {
    init (row) {
      if (row) {
        // this.dataForm = row
        this.dataForm.uid = row.uid || 0;
        this.$ctmList.tickettypeView(row.uid).then(data => {
          if (data && data.code === 200) {
            this.dataForm = data.data;
            this.cinemaNameStr = data.data.cinemaNames.join(',');
            data.data.cinemaUids.forEach(id => {
              this.huixianData.push({ id: id });
            });
            data.data.cinemaNames.forEach((name, index) => {
              this.huixianData[index]['name'] = name;
            });

            console.log(this.huixianData);
            if (!this.dataForm.cinemaUids) { this.dataForm.cinemaUids = []; }
            if (this.dataForm.useRange == 1) {
              this.dataForm.cinemaUids = [];
              this.dataForm.cinemaNames = [];
            }
          } else {
            this.$message.error(data.msg);
          }
        }).catch(err => {
          console.log(err);
        });
      } else {
        this.dataForm = {
          name: '',
          seq: '',
          isDiscount: 1,
          useRange: 1,
          cinemaUids: [],
          cinemaIds: []
        };
      }
    },
    returnList () {
      this.$emit('refreshDataList');
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dataForm.seq = parseInt(this.dataForm.seq);
          // console.log(this.dataForm.id)
          // console.log(this.dataForm.cinemaUids)
          if (this.dataForm.useRange == 0 && this.dataForm.cinemaUids.length == 0) {
            this.$message.error('请选择影院');
            return;
          }

          if (this.dataForm.id) {
            this.$ctmList.tickettypeUpdate(this.dataForm).then(data => {
              // console.log(data)
              if (data && data.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.$emit('refreshDataList');
                  }
                });
              } else {
                this.$message.error(data.msg);
              }
            }).catch(err => {
              console.log(err);
            });
          } else {
            this.$ctmList.tickettypeAdd(this.dataForm).then(data => {
              // console.log(data)
              if (data && data.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.$emit('refreshDataList');
                  }
                });
              } else {
                this.$message.error(data.msg);
              }
            }).catch(err => {
              console.log(err);
            });
          }
        }
      });
    },
    // 清空
    clearInputValue () {
      this.dataForm.cinemaUids = [];
      this.dataForm.cinemaNames = [];
      this.cinemaNameStr = '';
      console.log('清除', this.dataForm.cinemaNames);
    },
    inputFocus () {
      this.dialogVisible = true;
    },
    handleRegisterCinemaCallBack (data) {
      console.log(data);
      data = data.data;
      let value = [];
      let text = [];
      data.forEach(element => {
        value.push(element.id);
        text.push(element.name);
      });
      this.dataForm.cinemaUids = value;
      this.cinemaNameStr = text.join(',');
    }
  }
};
</script>

<style lang="scss" scoped>
.ticket-Type {
  /depp/ .el-form-item__label {
    text-align: left !important;
  }
  .ticket-Type {
    .el-form-item {
      margin-bottom: 8px;
    }
    .footer {
      margin: 0 auto;
      text-align: center;
    }
  }
  .chooseCinema {
    padding: 8px 10px;
    margin-left: 3px;
  }
}
/deep/ .popup-input {
  width: 200px;
  input {
    text-overflow: ellipsis;
    background: #f5f5f5;
    border: 1px solid #bcbcbc !important;
  }
}
.popup-input:hover .popup-close {
  display: inline-block;
}
/deep/ .popup-close {
  cursor: pointer;
  color: #3b74ff;
  font-size: 16px;
  font-weight: 500;
  font-weight: 700;
  margin-top: 9px;
  display: none;
}
/deep/ .el-button {
  width: 80px;
  height: 32px;
}
</style>

