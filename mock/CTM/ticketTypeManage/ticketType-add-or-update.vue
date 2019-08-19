<template>
<div>
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>票类管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{dataForm.uid ? '修改' : '新建'}}票类</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="200px" class="common-form">
      <el-form-item label="票类名称" prop="name" v-if="dataForm.name!='成人票'&&dataForm.name!='团体票'&&dataForm.name!='学生票'">
        <el-input v-model="dataForm.name" placeholder="请输入票类名称"></el-input>
      </el-form-item>
      <el-form-item label="票类名称" prop="name" v-else>
        <el-input v-model="dataForm.name" placeholder="请输入票类名称" disabled></el-input>
      </el-form-item>
      <el-form-item label="票类顺序" prop="seq">
        <el-input v-model="dataForm.seq" placeholder="请输入票类顺序" maxlength="10"></el-input>
      </el-form-item>
      <!-- <el-form-item label="影厅区域加价是否有效" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">无效</el-radio>
          <el-radio :label="1">有效</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="是否允许打折" size="mini" prop="isDiscount">
        <el-radio-group v-model="dataForm.isDiscount">
          <el-radio :label="1">否</el-radio>
          <el-radio :label="0">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="适用影院范围" size="mini" prop="useRange">
        <el-radio-group v-model="dataForm.useRange">
          <el-radio :label="1">适用全部影院</el-radio>
          <el-radio :label="0">适用指定影院</el-radio>
        </el-radio-group>
        <GroupMultiSelectCinema v-if="dataForm.useRange==0" :cinemaUid="cinemaUids" selectionMode="single" @cinemaChanged="cinemaChangedHandler"/>
      </el-form-item>
      <el-form-item style="margin-left:100px;">
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        <el-button @click='returnList()'>返回</el-button>
      </el-form-item>
    </el-form>
  <!-- <choose-simple v-if="chooseSimpleShow" ref="chooseSimple" @return="close"></choose-simple> -->
</div>
</template>
<script>
// import ChooseSimple from './chooseSimple'
import GroupMultiSelectCinema from "src/components/GroupMultiSelectCinema/GroupMultiSelectCinema";
  export default {
    // components: {
    //   ChooseSimple
    // },
    components: {GroupMultiSelectCinema},
    data () {
      let checkNum = (rule, value, callback) => {
        let reg = /^\d{1,2}$/
        if (!reg.test(value)) {
          callback(new Error('请输入0到99的整数，且字符不超过两个'))
        } else {
          callback()
        }
      }
      return {
        cinemaUids:'',
        dataForm: {
          name: '',
          seq: '',
          isDiscount: 1,
          useRange: 1,
          cinemaNames: [],
          cinemaUids: [],
          cinemaIds:[]
        },
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
      }
    },
    created() {
      // this.load();
    },
    methods: {
      cinemaChangedHandler(uidArray){
        this.dataForm.cinemaUids = uidArray;
      },
      init (row) {
        if (row) {
          // this.dataForm = row
          this.dataForm.uid = row.uid || 0
          this.$api.tickettypeView(row.uid).then( data => {
            console.log('tickettypeView')
              console.log(data)
              if (data && data.code === 200) {
                this.dataForm = data.data
                // console.log(data.data.cinemaNames)
                console.log(this.dataForm.cinemaUids)
                if(this.dataForm.cinemaUids!=null){
                  this.cinemaUids = this.dataForm.cinemaUids.join(',')
                }
                if(this.dataForm.useRange==1){
                  this.dataForm.cinemaNames=[]
                  this.dataForm.cinemaUids=[]
                  this.dataForm.cinemaIds=[]
                }
                
              } else {
                this.$message.error(data.msg)
              }

          }).catch( err => {
              console.log(err)
          })
        } else{
          this.dataForm = {
            name: '',
            seq: '',
            isDiscount: 1,
            useRange: 1,
            cinemaNames: [],
            cinemaUids: [],
            cinemaIds:[]
          }
        }
      },
      // close () {
      //   this.chooseSimpleShow = false
      // },
      returnList () {
        this.$emit('refreshDataList')
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataForm.seq = parseInt(this.dataForm.seq)
            // console.log(this.dataForm.id)
            // console.log(this.dataForm.cinemaUids)
            if(this.dataForm.useRange==0&&this.dataForm.cinemaUids.length==0){
              this.$message.error('请选择影院')
              return ;
            }
            // 去除名称空格
            this.dataForm.name = this.dataForm.name.replace(/\s*/g,"");
            if(this.dataForm.id){
              this.$api.tickettypeUpdate(this.dataForm).then( data => {
                // console.log(data)
                if (data && data.code === 200) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.$emit('refreshDataList')
                    }
                  })
                } else {
                  this.$message.error(data.msg)
                }

              }).catch( err => {
                  console.log(err)
              })
            }else{
              this.$api.tickettypeAdd(this.dataForm).then( data => {
                // console.log(data)
                if (data && data.code === 200) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.$emit('refreshDataList')
                    }
                  })
                } else {
                  this.$message.error(data.msg)
                }

              }).catch( err => {
                  console.log(err)
              })
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .breadcrumb {
    margin: 30px 0 50px 30px;
  }
  .el-input{
    width: 50%;
  }
  .el-input.el-input--suffix{
    width: 100%;
  }
  .chooseCinema{
    padding:8px 10px;
    margin-left: 3px;
  }
</style>
