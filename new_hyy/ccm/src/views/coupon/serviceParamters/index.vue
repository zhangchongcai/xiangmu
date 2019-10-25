<template>
  <div class="coupon-serviceParamters">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基础设置" name="base">
        <el-form :model="baseConfig" ref="form">
          <ul class="base">
            <li class="flex-base" style="">
              <span><i class="zoom-keep-font">占位占位占位占位</i>批次导出次数设置：</span>
              <div class="flex-base">
                <el-radio-group v-model="baseConfig.exportNumSet.value" @change="changeExportNumSet">
                  <el-radio :label="'1'">只能一次</el-radio>
                  <el-radio :label="'2'">允许
                    <el-form-item class="base-item" prop="exportNum.value" :rules="[{validator:regNum}]">
                      <el-input v-if="baseConfig.exportNumSet.value!='2'" class="table-number-inner-width" v-model="baseConfig.exportNum.value" disabled></el-input>
                      <el-input v-else class="table-number-inner-width" v-model="baseConfig.exportNum.value"></el-input> 次
                    </el-form-item>
                  </el-radio>
                  <el-radio :label="'3'">无限制</el-radio>
                </el-radio-group>
              </div>
            </li>
            <li class="flex-base">
              <span><i class="zoom-keep-font">占位占位占位占位</i>批量打印次数设置：</span>
              <div class="flex-base">
                <el-radio-group v-model="baseConfig.printNumSet.value" @change="changePrintNumSet">
                  <el-radio :label="'1'">只能一次</el-radio>
                  <el-radio :label="'2'">允许
                    <el-form-item class="base-item" prop="printNum.value" :rules="[{validator:regNum}]">
                      <el-input v-if="baseConfig.printNumSet.value!='2'" class="table-number-inner-width" v-model="baseConfig.printNum.value" disabled></el-input>
                      <el-input v-else class="table-number-inner-width" v-model="baseConfig.printNum.value"></el-input> 次
                    </el-form-item>
                  </el-radio>
                  <el-radio :label="'3'">无限制</el-radio>
                </el-radio-group>
              </div>
            </li>
            <li class="flex-base">
              <span><i class="zoom-keep-font">占位占</i>只能选择销售本商户票券编号：</span>
              <div class="flex-base">
                <el-radio v-model="baseConfig.isSelfTicketNumber.value" :label="'1'">是</el-radio>
                <el-radio v-model="baseConfig.isSelfTicketNumber.value" :label="'2'">否</el-radio>
              </div>
            </li>
            <li class="flex-base">
              <span><i class="zoom-keep-font">占位占位占</i>已过期票券是否允许延期：</span>
              <div class="flex-base">
                <el-radio v-model="baseConfig.allowDelayTicket.value" :label="'1'">是</el-radio>
                <el-radio v-model="baseConfig.allowDelayTicket.value" :label="'2'">否</el-radio>
              </div>
            </li>
            <li class="flex-base">
              <span>是否允许不同销售单的票券混合使用：</span>
              <div class="flex-base">
                <el-radio v-model="baseConfig.allowMixTicket.value" :label="'1'">是</el-radio>
                <el-radio v-model="baseConfig.allowMixTicket.value" :label="'2'">否</el-radio>
              </div>
            </li>

            <li class="flex-base">
              <span><i class="zoom-keep-font">占位占位占</i>订单代金券使用数量限制：</span>
              <div class="flex-base">
                <el-radio-group v-model="baseConfig.ticketUseInOrderSet" @change="ticketUseInOrderChange">
                  <el-radio label="1">允许数量
                    <el-form-item class="base-item" prop="ticketUseInOrder.value" :rules="[{validator:regNum}]" style="margin-bottom:20px" v-if="baseConfig.ticketUseInOrderSet == 1">
                      <el-input v-model="baseConfig.ticketUseInOrder.value" class="table-number-inner-width"></el-input>
                    </el-form-item>
                  </el-radio>
                  <el-radio label="0">不限</el-radio>
                </el-radio-group>
              </div>
            </li>

          </ul>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <section class="flex-base flex-center">
      <el-row>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancle" style="margin-left:27px">取消</el-button>
      </el-row>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeNames: ['base', 'timeUp'],
      baseConfig: {
        /* 批量导出次数设置 1 2 3*/
        exportNumSet: {
          id: '',
          key: 'exportNumSet',
          value: 1,
        },
        exportNum: {
          id: '',
          key: 'exportNum',
          value: 0,
        },
        /* 批量打印次数设置 1 2 3 */
        printNumSet: {
          id: '',
          key: 'printNumSet',
          value: 1,
        },
        printNum: {
          id: '',
          key: 'printNum',
          value: 0,
        },
        sendMsgNum: {
          id: '',
          key: 'sendMsgNum',
          value: 0,
        },

        /* 票券短信提取方式 */
        sendMsgType: {
          id: '',
          key: 'sendMsgType',
          value: 1,
        },

        /* 只能选择销售本商户票券编号 1 2 */
        isSelfTicketNumber: {
          id: '',
          key: 'isSelfTicketNumber',
          value: 1,
        },

        /* 已过期票券是否允许延期 1 2 */
        allowDelayTicket: {
          id: '',
          key: 'allowDelayTicket',
          value: 1,
        },

        /* 是否允许不同销售单的票券混合使用 1 2*/
        allowMixTicket: {
          id: '',
          key: 'allowMixTicket',
          value: 1,
        },
        /* 订单代金券使用数量限制*/
        ticketUseInOrderSet: 1,
        ticketUseInOrder: {
          id: '',
          key: 'ticketUseInOrder',
          value: 1,
        }
      },
      //数据库请求回来的数据
      baseConfigOrigin: {
        /* 批量导出次数设置 1 2 3*/
        exportNumSet: {
          id: '',
          key: 'exportNumSet',
          value: 1,
        },
        exportNum: {
          id: '',
          key: 'exportNum',
          value: 0,
        },
        /* 批量打印次数设置 1 2 3 */
        printNumSet: {
          id: '',
          key: 'printNumSet',
          value: 1,
        },
        printNum: {
          id: '',
          key: 'printNum',
          value: 0,
        },


        sendMsgNum: {
          id: '',
          key: 'sendMsgNum',
          value: 0,
        },

        /* 票券短信提取方式 */
        sendMsgType: {
          id: '',
          key: 'sendMsgType',
          value: 1,
        },

        /* 只能选择销售本商户票券编号 1 2 */
        isSelfTicketNumber: {
          id: '',
          key: 'isSelfTicketNumber',
          value: 1,
        },

        /* 已过期票券是否允许延期 1 2 */
        allowDelayTicket: {
          id: '',
          key: 'allowDelayTicket',
          value: 1,
        },


        /* 是否允许不同销售单的票券混合使用 1 2*/
        allowMixTicket: {
          id: '',
          key: 'allowMixTicket',
          value: 1,
        },
        /* 订单代金券使用数量限制 */
        ticketUseInOrderSet: 1,
        ticketUseInOrder: {
          id: '',
          key: 'ticketUseInOrder',
          value: 1,
        }

      },
    }
  },
  created () {
    this.getBaseConfig();
  },
  methods: {
    regNum (rule, value, callback) {
      let regExp = /^[0-9]{1,2}$/
      if (!value) {
        return callback(new Error('不能为空'))
      } else if (!regExp.test(value)) {
        return callback(new Error('最多输入两位正整数'))
      }
      return callback()
    },
    getBaseConfig () {
      this.$ccmList.getBaseConfig({}).then((res) => {
        let data = res.data;
        let obj = {};
        for (let item of data) {
          let tmp = { id: item.id, key: item.name, value: item.value };
          obj[item.name] = tmp;
          if (item.name == 'sendMsgType') {
            item.value == '1' ? tmp.value = true : tmp.value = false;
          }
        }
        try {
          if (obj.ticketUseInOrder.value > 0) {
            obj['ticketUseInOrderSet'] = '1'
          } else {
            obj['ticketUseInOrderSet'] = '0'
          }
        } catch (err) {
          console.log('报错', err)
        }
        this.baseConfigOrigin = JSON.parse(JSON.stringify(obj));//保留当前页面数据
        this.baseConfig = Object.assign({}, obj);//只能对基本数据类型实现深拷贝
      });
    },

    /**
     * @function save - 保存
     */
    save () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let tmp = Object.assign({}, this.baseConfig);
          this.baseConfig.sendMsgType.value == true ? tmp.sendMsgType.value = '1' : tmp.sendMsgType.value = '2';
          this.baseConfig = JSON.parse(JSON.stringify(tmp));

          let targetArr = [];
          for (let key in this.baseConfig) {
            if (Object.prototype.toString.call(this.baseConfig[key]) === '[object Object]') {
              targetArr.push(this.baseConfig[key]);
            }
          }
          let params = targetArr;
          this.$ccmList.updateBaseConfig(params).then((data) => {
            let flag = data.flag;
            let type = "warning";
            let message = data.msg;
            if (flag == 2) {
              type = "success";
              this.getBaseConfig();
            }
            this.$message({
              type,
              message
            });
          });
        }
      })
    },

    /**
     * @function cancle - 取消
     * 
     */
    cancle () {
      this.$confirm('确定取消操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.baseConfig = JSON.parse(JSON.stringify(this.baseConfigOrigin));
      })
    },

    /* 改变导出次数设置*/
    changeExportNumSet () {
      if (this.baseConfig.exportNumSet.value != '2') {
        this.baseConfig.exportNum.value = 1;
      }
      console.log("this.baseConfig " + JSON.stringify(this.baseConfig));
      console.log("this.baseConfigOrigin " + JSON.stringify(this.baseConfigOrigin));
    },
    /* 改变打印次数设置*/
    changePrintNumSet () {
      if (this.baseConfig.printNumSet.value != '2') {
        this.baseConfig.printNum.value = 1;
      }
    },
    /* 订单代金券使用数量限制 */
    ticketUseInOrderChange (value) {
      console.log(value)
      if (value == 1) {
        this.baseConfig.ticketUseInOrder.value = 1
      } else {
        this.baseConfig.ticketUseInOrder.value = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/element-reset.scss";
.flex-base {
  align-items: baseline;
}
.base,
.timeUp {
  li {
    margin-bottom: 10px;
    span {
      color: #666;
      font: 12px;
    }
  }

  li:nth-last-of-type(1) {
    margin-bottom: unset;
  }
}

.tips-info {
  color: grey;
  font-size: 12px;
}
.coupon-serviceParamters {
  li {
    span {
      color: #666666;
      font-size: 12px;
    }
  }
}
.base {
  margin-left: 27px;
}
.base-item {
  display: inline-block;
  margin-bottom: 3px;
}
</style>

