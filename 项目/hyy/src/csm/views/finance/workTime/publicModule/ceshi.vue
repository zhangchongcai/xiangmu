<template>
  <div>
    <span>交易渠道/代理商</span>
    <el-input v-model="workName" @focus="openAgencyDialog"></el-input>
    <!-- 弹窗 -->
    <getAgency ref="agency" @changeCurrentPage="changeCurrentPage"
      @searchUser="searchUser" @chooseUser="chooseUser">
    </getAgency>
    <!-- 多选 -->
    <!-- <span class="ceshi">多选框  影厅类型：CI_HALL_TYPE</span>
    <div class="multiple_select">
      <el-select v-model="value" placeholder="请选择" popper-class="el_select" @change="changeSelect" multiple  @focus="getdealType('CI_HALL_TYPE',2)">
        <el-option v-for="item in cities" :key="item.id" :label="item.label" :value="item.label">
        </el-option>
      </el-select>
    </div> -->

    <!-- 交易单类型：MER_INTERFACE_STORE_BILL_SUBJECT
    交易类型(含会员)：POS_SALE_BILL_BILL_TYPE_HAS_MEMBER
    交易类型(不包含会员)：POS_SALE_BILL_BILL_TYPE_NO_MEMBER
    操作类型：POS_AUTHORIZATION_OPERATION_TYPE
    影厅类型：CI_HALL_TYPE
    渠道：POS_CHANNEL_TYPE
    销售类型：POS_SALE_TYPE -->
    <!-- 交易类型(含会员)-->
    <span>交易类型(含会员)</span>
    <el-select v-model="value1" placeholder="请选择" @focus="getdealType('POS_SALE_BILL_BILL_TYPE_HAS_MEMBER',0)">
      <el-option label="全部" value=""></el-option>
      <el-option v-for="(item,index) in options[0]" :key="index" :label="item.keyName" :value="item.id">
      </el-option>
    </el-select>
    <!-- 交易类型(不包含会员) -->
    <span>交易类型(不包含会员)</span>
    <el-select v-model="value2" placeholder="请选择" @focus="getdealType('POS_SALE_BILL_BILL_TYPE_NO_MEMBER',1)">
      <el-option label="全部" value=""></el-option>
      <el-option v-for="(item,index) in options[1]" :key="1+index" :label="item.keyName" :value="item.id">
      </el-option>
    </el-select>
    <!-- 影厅类型 -->
    <span>影厅类型</span>
    <div class="multiple_select">
      <el-select v-model="value3" placeholder="请选择" @focus="getdealType('CI_HALL_TYPE',2)" multiple
        @change="changeSelect">
        <!-- <el-option label="全部" value=""></el-option> -->
        <el-option v-for="(item,index) in options[2]" :key="2+index" :label="item.keyName" :value="item.keyName">
        </el-option>
      </el-select>
    </div>
    <!-- 渠道 -->
    <span>渠道</span>
    <el-select v-model="value4" placeholder="请选择" @focus="getdealType('POS_CHANNEL_TYPE',3)">
      <el-option label="全部" value=""></el-option>
      <el-option v-for="(item,index) in options[3]" :key="3+index" :label="item.keyName" :value="item.id">
      </el-option>
    </el-select>
    <!-- 销售类型 -->
    <span>销售类型</span>
    <el-select v-model="value5" placeholder="请选择" @focus="getdealType('POS_SALE_TYPE',4)">
      <el-option label="全部" value=""></el-option>
      <el-option v-for="(item,index) in options[4]" :key="4+index" :label="item.keyName" :value="item.id">
      </el-option>
    </el-select>
    <span>影院单选</span>
    <el-input v-model="cinemaName" @focus="openCinema"></el-input>
    <singeCinema ref="singeCinema" @callback="callback"></singeCinema>
  </div>
</template>
<script>
  import getAgency from './getAgency'
  import singeCinema from './singeCinema'
  export default {
    components: {
      getAgency,
      singeCinema
    },
    data() {
      return {
        workName: "",
        title: "",
        page: 1,
        pageSize: 10,
        pageData: {},
        dialogTableVisible: false,
        gridData: [],
        cities: [{
          value: 'Beijing',
          label: '北京'
        }, {
          value: 'Shanghai',
          label: '上海'
        }, {
          value: 'Nanjing',
          label: '南京'
        }, {
          value: 'Chengdu',
          label: '成都'
        }, {
          value: 'Shenzhen',
          label: '深圳'
        }, {
          value: 'Guangzhou',
          label: '广州'
        }],
        value: '',
        value1: '',
        value2: '',
        value3: '',
        value4: '',
        value5: '',
        options: [
          [],
          [],
          []
        ],
        cinemaName: "",
        cinemaUID: ""
      }
    },
    methods: {
      // 打开交易渠道/代理商弹窗
      openAgencyDialog() {
        this.getData(1)
        this.$refs.agency.dialogTableVisible = true;
        this.$refs.agency.title = "交易渠道/代理商";    
      },
      openCinema() {
        this.$refs.singeCinema.opendialog = true;
      },
      callback(val) {
        console.log(val)
        this.cinemaName = val.orgName
        this.cinemaUID = val.cinemaUID
      },
      getData(page, type, name) {
        let limit = {
          cinemaUid: ['111112'],
          pageSize: this.pageSize,
          page,
          type,
          name
        };
        this.$csmList.getDitch(Object.assign({}, limit))
          .then(data => {
            console.log(data)
            if (data && data.code === 200) {
              this.gridData = data.data.list;
              this.pageData = data.data;
              // 数据的处理(将你需要的数据赋给deal-交易渠道，代理商-agent)
              this.gridData.forEach((item,index) => {
                item.deal = item.code;
                item.agent = item.name
                item.id = (this.pageData.pageNum -1) * 10 + index
              })
              this.$set(this.$refs.agency,'gridData',this.gridData);
              this.$set(this.$refs.agency,'pageData',this.pageData);
            }
          })
      },
      changeCurrentPage(val) {
        this.getData(val)
      },
      searchUser(type, name) {
        console.log(type, name)
        this.getData(1, type, name)
      },
      chooseUser(arr) {
        this.workName = '';
        arr.forEach(item => {
          this.workName += item.name + ",";
        });
        this.workName = this.workName.slice(0,this.workName.length-1)
      },
      // 改变下拉
      changeSelect(val) {
        let el = document.querySelector('.el-select__tags');
        let el_span = el.querySelector('span');
        el_span && el.removeChild(el_span);
        el.style.padding = " 0 10px";
        el.style.textOverflow = "ellipsis";
        el.textContent = String(val).replace(/,/g, "、")
      },
      getdealType(name, index) {
        this.$csmList.getMoudelData("1", 100, name)
          .then(data => {
            console.log(data, index)
            if (data && data.code === 200) {
              // 创建二维数组 添加数据
              this.$set(this.options, index, data.data.list)
            }
          })
      },

    },
    mounted() {
      console.log(this)
      // console.log(this.$refs.select_option);
      // this.options = this.getdealType();
      this.options.push(this.options.flat());

    }
  }
</script>
<style lang="scss" scoped>
  .multiple_select {
    /deep/ .el-select__tags {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
      width: 130px !important;

    }
  }

  li.selected span {
    color: #3B74FF !important;
  }
</style>