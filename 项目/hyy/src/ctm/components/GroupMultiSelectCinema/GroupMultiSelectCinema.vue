<template>
  <div style="display:inline-block;margin-left:20px" class="ticketType">
    <el-input style="width:192px;" :value="selectedCinemaNameArray.join(',')" readonly placeholder="请输入" @focus="inputFocus"></el-input>
    <el-button type="primary" @click="selectedCinemaShow = true" style="margin-left:10px" v-if="selectedCinemaNameArray.length">编辑</el-button>
    <el-dialog
      title="选择影院"
      :close-on-click-modal="false"
      :visible.sync="selectedCinemaShow"
      append-to-body>
      <el-form :inline="true" :model="cinemaForm">
        <el-form-item style="margin-top: -6px;">
          影院名称:
        </el-form-item>
        <el-form-item style="margin-top: -6px;">
          <el-input v-model="cinemaForm.name" placeholder="请输入内容" clearable></el-input>
        </el-form-item>
        <el-form-item style="margin-top: -6px;">
          <el-button type="primary" @click="btnSearchClickHandler">搜索</el-button>
        </el-form-item>
      </el-form>
      <div class="content-three" style="height:350px;overflow:auto">
        <el-tree
          :data="cinemaTreeArray"
          :props="cinemaListTreeProps"
          :default-expand-all="true"
          :default-checked-keys="selectedCinemaUidArray"
          node-key="uid"
          show-checkbox
          check-on-click-node
          ref="tree"
          @check-change="checkboxChangeHandler">
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="btnOKClickHandler()">确定</el-button>
        <el-button @click="selectedCinemaShow = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  /**
   * 集团多选影院弹出框
   * 使用说明：
   * <GroupMultiSelectCinema :cinemaUid="dataForm.cinemaUids.join(',')" @cinemaChanged="cinemaChangedHandler"/>
   * :cinemaUid 绑定影院UID，多个以,符号分隔
   * @cinemaChanged（uidArray, nameArray） 绑定选择事件，参数uidArray为影院UID列表，nameArray名称列表
   */
  import $ from 'jquery';

  export default {
    name: "GroupMultiSelectCinema",
    props: ['cinemaUid','cinemaNames'],
    data() {
      return {
        selectedCinemaShow: false,
        selectedCinemaUidArray: [],
        selectedCinemaNameArray:[],
        uidArr:[],
        cinemaForm: {
          name: ''
        },
        cinemaTreeArray: [],
        cinemaListTreeProps: {
          label: 'name',
          children: 'children'
        }
      };
    },
    methods: {
      /**
       * 编辑弹框显示隐藏事件
       */
      inputFocus(){
        this.selectedCinemaShow = true
      },
      /**
       * 复选框选择事件处理
       **/
      checkboxChangeHandler: function (data, checked, indeterminate) {
        // console.log(data)
        // console.log(checked)
        // if ($.trim(data.cinema) != 'true') {
        //   return;
        // }
        //     let uidArr = this.uidArr
        //     let selectedCinemaNameArray = this.selectedCinemaNameArray
        // if (checked) {
        //     if(uidArr.indexOf(data.uid)>-1){
        //       console.log(uidArr.indexOf(data.uid))
        //       uidArr.push(data.uid);
        //     }
        //     if(!selectedCinemaNameArray.indexOf(data.name)>-1){
        //       selectedCinemaNameArray.push(data.name);
        //     }
        // } else {
        //   this.uidArr = this.selectedCinemaUidArray.filter(function (uid) {
        //     return $.trim(uid) != $.trim(data.uid);
        //   });
        //   this.selectedCinemaNameArray = this.selectedCinemaNameArray.filter(function (name) {
        //     return $.trim(name) != $.trim(data.name);
        //   });
        // }
      },
      /**
       * 确定事件处理
       **/
      btnOKClickHandler: function () {
        let uidArr = this.uidArr = []
        let selectedCinemaNameArray = this.selectedCinemaNameArray = []
        let checkedData = this.$refs.tree.getCheckedNodes();
        console.log(checkedData)
        checkedData.forEach(element => {
          uidArr.push(element.uid)
          selectedCinemaNameArray.push(element.name)
        });
    
        this.selectedCinemaShow = false;
        this.$emit('cinemaChanged', uidArr, selectedCinemaNameArray);
      },
      /**
       * 搜索事件处理, 查询影院树数据
       **/
      btnSearchClickHandler() {
        this.selectedCinemaUidArray = [];
        this.selectedCinemaNameArray = [];
        this.queryCinemaTree();
      },
      /**
       * 查询影院树数据
       **/
      queryCinemaTree() {
        this.$ctmList.getCinemaTree({name: $.trim(this.cinemaForm.name)}).then(json => {
          if (json.code === 200) {
            this.setDefaultSelectedCinema([json.data]);
            this.cinemaTreeArray = [json.data];
          } else {
            this.cinemaTreeArray = [];
            this.$message.error(json.msg);
          }
        });
      },
      /**
       * 设置默认选择的影院
       * @param cinemaArray
       */
      setDefaultSelectedCinema(cinemaArray) {
        if (!$.isArray(this.selectedCinemaUidArray) || this.selectedCinemaUidArray.length <= 0) {
          return;
        }

        function recursionSetCinema(allArray, uidArray, nameArray) {
          if (!$.isArray(allArray)) {
            return;
          }
          $.each(allArray, function (index, item) {
            if ($.inArray($.trim(item.uid), uidArray) != -1) {
              nameArray.push(item.name);
            }
            recursionSetCinema(item.children, uidArray, nameArray);
          });
        }

        recursionSetCinema(cinemaArray, this.selectedCinemaUidArray, this.selectedCinemaNameArray);
      }
    },
    created: function () {
      if ($.trim(this.cinemaUid) != '') {
        this.uidArr=this.selectedCinemaUidArray = $.trim(this.cinemaUid).split(',');
        this.selectedCinemaNameArray = $.trim(this.cinemaNames).split(',');
        console.log(this.selectedCinemaNameArray)
        console.log(this.selectedCinemaUidArray)
      }
    },
    mounted: function () {
      this.queryCinemaTree();
    }
  }
</script>

<style lang="scss">
  .ticketType{
    .el-dialog {
      width: 448px;
      height: 576px;
    }
    .el-dialog__header{
      margin-left: 20px;
      margin-right: 20px;
      padding-left: 0;
      border-bottom-style: solid;
      border-bottom-width: 1px;
      border-bottom-color: #E5E5E5;
    }
    .content-three{
      height: 340px;
      overflow: auto;
    }
    .el-dialog__footer {
      text-align: center;
      padding-top: 15px;
      border-top-style: solid;
      border-top-width: 1px;
      border-top-color: #E5E5E5;
    }
  }
</style>