<template>
  <div class="search-wrap">
    <el-row>
      <el-col :span="7">
        <div class="search-item" style="padding-left:0px;">
          <span class="label">{{orgMap(orgType)}}:</span>
          {{orgName}}
        </div>
      </el-col>
      <el-col :span="10">
        <div class="search-item">
          <span class="label">日期选择:</span>
          <el-date-picker class="tickets-date" v-model="time" type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeTime">
          </el-date-picker>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="search-item">
          <span class="label">票券类型:</span>
          <el-select v-model="type" @change="changeType" clearable>
            <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="7">
        <div class="search-item" style="padding-left:0px;">
          <span class="label">票券状态:</span>
          <el-select v-model="status" @change="changeStatus" clearable>
            <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="search-item">
          <span class="label">票券名称:</span>
          <el-input style="display:inline-block;width:280px" v-model="name" placeholder="请输入内容" @blur="changeName"></el-input>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="search-item">
          <el-button type="primary" @click="search">查询</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- <el-form :inline="true">
            <el-row>
                <el-col :span="7">
                    <el-form-item :label="orgMap(orgType)+' :'">
                        <span style="font-size:12px">{{orgName}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="日期选择 :">
                        <el-date-picker 
                            class="tickets-date"
                            v-model="time" 
                            type="daterange" 
                            range-separator="~"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="changeTime">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="票券类型 :">
                        <el-select v-model="type" @change="changeType" clearable>
                            <el-option v-for="item in options1"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="7">
                    <el-form-item label="票券状态 :"  class="margin_b0">
                        <el-select v-model="status" @change="changeStatus" clearable>
                            <el-option v-for="item in options2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="票券名称 :" class="margin_b0">
                        <el-input  style="display:inline-block;width:280px" v-model="name" placeholder="请输入内容" @blur="changeName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label=""  class="margin_b0">
                        <el-button  type="primary" @click="search">查询</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form> -->
  </div>
</template>
<script>
export default {
  props: ['orgType', 'orgName', 'pageNo', 'pageSize'],
  data () {
    return {
      time: [this.$moment(new Date()).add(-1, 'month').format('YYYY-MM-DD'), this.$moment(new Date()).format('YYYY-MM-DD')],
      startTime: this.$moment(new Date()).add(-1, 'month').format('YYYY-MM-DD'),
      endTime: this.$moment(new Date()).format('YYYY-MM-DD'),
      type: null,
      status: null,
      name: null,
      options1: [
        {
          value: 0,
          label: '兑换券'
        },
        {
          value: 1,
          label: '代金券'
        },
        {
          value: 2,
          label: '优惠券'
        }
        // {
        //   value: 3,
        //   label: "礼品卡"
        // }
      ],
      options2: [
        {
          value: 0,
          label: '未提交'
        },
        {
          value: 1,
          label: '新建'
        },
        {
          value: 2,
          label: '已激活'
        },
        {
          value: 3,
          label: '已停用'
        },
        {
          value: 4,
          label: '已作废'
        },
        {
          value: 5,
          label: '已过期'
        },
        {
          value: 6,
          label: '已删除'
        },
        {
          value: 7,
          label: '验证中'
        },
        {
          value: 8,
          label: '验证不通过'
        }
      ]
    };
  },
  methods: {
    orgMap (type) {
      let obj = {
        'group': '总部',
        'city': '区域',
        'cinema': '影院'
      };
      return obj[type];
    },
    // 改变时间
    changeTime (option) {
      if (option) {
        this.startTime = this.$moment(option[0]).format('YYYY-MM-DD');
        this.endTime = this.$moment(option[1]).format('YYYY-MM-DD');
      } else {
        this.startTime = null;
        this.endTime = null;
      }
      this.$emit('changeTime', this.startTime, this.endTime);
    },
    changeType () {
      this.$emit('changeType', this.type);
    },
    changeStatus () {
      this.$emit('changeStatus', this.status);
    },
    changeName () {
      this.$emit('changeName', this.name);
    },
    search () {
      let params = {
        columnType: 'ticket_create_time',
        seq: 'DESC',
        ticketType: this.type,
        detailType: 1,
        ticketName: this.name,
        ticketStatus: this.status,
        startDate: this.startTime,
        endDate: this.endTime,
        pageNo: 1,
        pageSize: 15
      };
      this.$emit('search', params);
    }
  }
};
</script>

