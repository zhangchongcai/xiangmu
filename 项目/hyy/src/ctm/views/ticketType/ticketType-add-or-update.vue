<template>
<div class="ticketType">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"  class="common-form">
      <el-form-item label="票类名称:" prop="name" v-if="dataForm.name!='成人票'&&dataForm.name!='团体票'&&dataForm.name!='学生票'">
        <el-input v-model="dataForm.name" placeholder="请输入票类名称"></el-input>
      </el-form-item>
      <el-form-item label="票类名称:" prop="name" v-else>
        <el-input v-model="dataForm.name" placeholder="请输入票类名称" disabled></el-input>
      </el-form-item>
      <el-form-item label="票类顺序:" prop="seq">
        <el-input v-model="dataForm.seq" placeholder="请输入票类顺序" maxlength="10"></el-input>
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
        <!-- 选择影院弹窗 -->
        <GroupMultiSelectCinema v-if="dataForm.useRange==0" 
        :cinemaUid="dataForm.cinemaUids.join(',')" 
        :cinemaNames ="dataForm.cinemaNames.join(',')"
        selectionMode="single" 
        @cinemaChanged="cinemaChangedHandler"
        />
      </el-form-item>
      <el-form-item class="footer" style="text-align:center">
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        <el-button @click='returnList()'>返回</el-button>
      </el-form-item>
    </el-form>
  <!-- <choose-simple v-if="chooseSimpleShow" ref="chooseSimple" @return="close"></choose-simple> -->
</div>
</template>
<script>
// import ChooseSimple from './chooseSimple'
import GroupMultiSelectCinema from "ctm/components/GroupMultiSelectCinema/GroupMultiSelectCinema";
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
          this.$ctmList.tickettypeView(row.uid).then( data => {
            console.log('tickettypeView')
              console.log(data)
              if (data && data.code === 200) {
                this.dataForm = data.data
                if(!this.dataForm.cinemaUids){this.dataForm.cinemaUids=[]}
                // console.log(data.data.cinemaNames)
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

            if(this.dataForm.id){
              this.$ctmList.tickettypeUpdate(this.dataForm).then( data => {
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
              this.$ctmList.tickettypeAdd(this.dataForm).then( data => {
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
.ticketType{
  .el-input{
    width: 35%;
    margin-left: 20px;
  }
  .ticketType{
    .el-form-item{
      margin-bottom: 8px;
    }
    .footer{
      margin: 0 auto;
      text-align: center;
    }
  }
  .el-input.el-input--suffix{
    width: 100%;
  }
  .chooseCinema{
    padding:8px 10px;
    margin-left: 3px;
  }
}
</style>
