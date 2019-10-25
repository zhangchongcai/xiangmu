<template>
  <div class="reset-target-dialog">
    <el-dialog title="卖品规则修改" :visible="show" :before-close="handleClose" :close-on-click-modal="false">
      <div class="content" v-if="info && info.name">
        <el-form ref="updateRef" label-width="140px" label-position="right" class="reset-form" :model="info" :rules="rules">
          <el-form-item label="品类ID:" class="reset-form-input" prop="uid">
            <el-input size="small" v-model="info.uid" disabled></el-input>
          </el-form-item>
          <el-form-item label="品类名称:" class="reset-form-input" prop="name">
            <el-input size="small" v-model="info.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="最低库存周转天数:" class="reset-form-input" prop="minInventoryDay">
            <el-input v-model="info.minInventoryDay" size="small" type="number" :min="0" :max="999"></el-input>
          </el-form-item>
          <el-form-item label="最高库存周转天数:" class="reset-form-input" prop="maxInventoryDay">
            <el-input v-model="info.maxInventoryDay" size="small" type="number" :min="0" :max="999"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer">
        <el-button type="primary" size="small" @click="sure">确认</el-button>
        <el-button size="small" @click="handleClose"> 取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    const validateMin = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('不能为空值'));
      } else if (this.info.maxInventoryDay) {
        if (value * 1 > this.info.maxInventoryDay * 1) {
          callback(new Error('不能大于最高周转天数'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const validateMax = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('不能为空值'));
      } else if (this.info.minInventoryDay) {
        if (value * 1 < this.info.minInventoryDay * 1) {
          callback(new Error('不能小于最低周转天数'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      show: false,
      info: null,
      rules: {
        uid: [{ required: true }],
        name: [{ required: true }],
        minInventoryDay: [{
          required: true,
          message: '请输入最低库存周转天数'
        }, {
          validator: validateMin
        }
        ],
        maxInventoryDay: [
          {
            required: true,
            message: '请输入最高库存周转天数'
          }, {
            validator: validateMax
          }
        ]
      }
    };
  },

  methods: {
    sure () {
      this.$refs.updateRef.validate(valid => {
        if (valid) {
          this.$emit('updateApi', this.info);
        }
      });
    },
    handleClose () {
      this.info = null;
      this.show = false;
    }
  }
};
</script>



