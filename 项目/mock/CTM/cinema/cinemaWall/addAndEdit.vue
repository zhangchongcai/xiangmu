<template>
    <div id="edit">
        <div>
            <!-- <p class="head" ref="head" >修改影厅</p> -->
            
            <div class="body">
                <el-form ref="jsonData" :model="jsonData" :rules="rules"
                label-width="150px" size="mini" inline-message
                hide-required-asterisk="true"
                >
                    
                <el-form-item label="影厅名称：" style="width:600px" 
                    prop="name"
                >
                    <el-input v-model.trim="jsonData.name"></el-input>
                </el-form-item>
                <el-form-item label="影厅别名：" style="width:600px" 
                    prop="aliases"
                >
                    <el-input v-model="jsonData.aliases"></el-input>
                </el-form-item>
                <el-form-item label="显示排序：" style="width:600px"
                    prop="seq"
                >
                    <el-input   v-model="jsonData.seq" maxlength="2 "></el-input>
                </el-form-item>
                <el-form-item label="座位数：">
                    <span class="num">500(系统自动计算)</span>
                    <el-button type="info" style="margin-left:32px">座位图设计</el-button>
                </el-form-item>
                <el-form-item label="影厅类型："
                prop="type">
                    <el-select v-model="jsonData.type" placeholder="==请选择==">
                    <el-option :label="item.keyDesc" :value="item.keyDesc" v-for="(item,ind) in movieType" :key="ind"></el-option>
                    </el-select>
                    
                </el-form-item>
                <el-form-item label="状态： ">
                    <el-radio-group v-model="jsonData.status">
                    <el-radio :label="1">有效</el-radio>
                    <el-radio :label="0">无效</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- <el-form-item label="是否启用增值服务：" prop="isOnAddFee">
                    <el-radio-group v-model="jsonData.isOnAddFee"
                    @change="isOnAddFee"
                    >
                    <el-radio :label="1" >是</el-radio>
                    <el-radio :label="0" >否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="增值服务费：" prop="addFeeType"
                aria-disabled="false">
                    <el-select v-model="jsonData.addFeeType" placeholder="==请选择类型=="
                    :disabled='zengZhifuWU_feiyong_status'
                    >
                    <el-option label="固定金额"   :value="1">固定金额</el-option>
                    <el-option label="票价百分比" :value="2">票价百分比</el-option>
                    </el-select>
                     <div v-if='jsonData.addFeeType=="1"&&jsonData.isOnAddFee=="1"' style="display:inline-block">
                        <el-form-item label="" 
                            prop="amount"
                        >
                            <el-input   v-model="jsonData.amount"></el-input>
                            <span style="margin-left:5px">元</span>
                        </el-form-item>
                        
                    </div>
                    <div v-if='jsonData.addFeeType=="2"&&jsonData.isOnAddFee=="1"' style="display:inline-block">
                        <el-form-item label="" 
                            prop="percentage"
                        >
                            <el-input   v-model="jsonData.percentage"></el-input>
                            <span style="margin-left:5px">%</span>

                        </el-form-item>
                    </div>

                </el-form-item> -->
                <el-form-item label="专售座位设置：" >
                    <el-radio-group v-model="jsonData.monopoly" @change="zhuanshou_change">
                    <el-radio :label="1">应用</el-radio>
                    <el-radio :label="0">不应用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <hr>
                <div style="text-align:left;paading-right:20px;">
                    <el-form-item size="large">
                        <el-button type="primary" @click="submitForm('jsonData')" v-if="this.hallUid">确定</el-button>
                        <el-button type="primary" @click="submitForm('jsonData')" v-else>立即创建</el-button>
                        <el-button @click="out">取消</el-button>
                    </el-form-item>
                </div>
                
                </el-form>
            </div>
        </div>
        
    </div>
</template>
<script>
import axios from 'axios';
import qs from 'qs';
export default {
    name:"MotaiKuan",
    data(){
        //表单正则规则
        let wallName=(rule,value,callback)=>{

            let reg=/[0-9a-zA-Z]{4,9}/
            if(!value){
                callback(new Error('不能为空！'))
                return
            }
            var data = {
                uid :this.$route.query.uid,
                name:(this.jsonData.name).trim(),
                cinemaUid:this.$route.query.cinemaUid
            }
            this.$api.nameExsit(data)
                .then(function (data) {
                    if (data && data.code === 200) {
                        if(data.data){
                            callback(new Error('名称已存在'))
                        }else{callback()}
                    }
                    
                })
                .catch(function (error) {
                    console.log(error);
                });
        };
        let aliases = (rule,value,callback) => {
            if(!value) {
                callback(new Error('不能为空！'))
                return
            }
            var params = {
                aliases : this.jsonData.aliases,
                cinemaUid : this.$route.query.cinemaUid,
                uid : this.$route.query.uid,
            }
            this.$api.aliasesExsit(params)
            .then(data => {
                if(data && data.code ===200) {
                    if(data.data) {
                        callback(new Error('别名已存在'))
                    }else{callback()}
                }
            }).catch(function (error) {
                    console.log(error);
                });
        };
        let paixu=(rule,value,callback)=>{
                // let reg=/^[0-9]{0,2}$/
                if(!value) {
                    callback(new Error('不能为空！'))
                    return
                }
                var data = {
                    uid :this.$route.query.uid,
                    seq:Number(this.jsonData.seq),
                    cinemaUid:this.$route.query.cinemaUid
                }
                this.$api.seqExsit(data)
                .then(function (data) {
                    if (data && data.code === 200) {
                        console.log(data)
                        if(data.data){
                            callback(new Error('排序已存在'))
                        }else{callback()}
                    }
                    
                })
                .catch(function (error) {
                    console.log(error);
                });    
                
            };
        let moviType=(rule,value,callback)=>{
            if(!value){callback(new Error('不能为空'))
            }else{
                callback();
            }
        };
        let addFeeType=(rule,value,callback)=> {
            if(this.jsonData.isOnAddFee=="1"){
                if(!value)
                {
                    console.log(value)
                    callback(new Error('请选择增值服务费类型'))
                }else{
                    callback();
                }
            }else{
                callback();
            }
        }
        let amount=(rule,value,callback)=> {
            if(!value){callback(new Error('请填写费用'));
            }else if(Number(value)>100000||(String(value).indexOf(".") != -1 && String(value).substring(String(value).indexOf("."),String(value).length).length>3)){
                callback(new Error('请填输入小于五位的数字,且小数不超过2位'));
            }else {
                callback();
            }
        };
        let percentage=(rule,value,callback)=>{
            if(!value){callback(new Error('请填写费用'));
            }else if(Number(value)<=0||Number(value)>100||(value.indexOf(".") != -1 && value.substring(value.indexOf("."),value.length).length>3)){
                callback(new Error('请填输入百分比在0<数值<=100范围,且小数不超过2位'));
            }else {
                callback();
            }
        };

         return {
            zengZhifuWU_feiyong_status:false,
            movieType:'',
            hallUid : null,
            //表单数据
            jsonData: {
                name:'',
                aliases:'', //别名
                seq:'', //排序
                type:'', //影厅类型
                status:1, //是否状态
                isOnAddFee:1, //是否启用增值服务1-是，0-否
                addFeeType:0, //增值服务方式，1-固定，2-百分比，0-不用
                percentage:0,//增值百分比
                amount:0,    //增值服务费用
                monopoly:1,
            },
            //默认正则规则
            rules: {
                name: [
                    // { required: true, message: '请输入影厅名称', trigger: 'blur' },
                    { validator:wallName,trigger: 'blur'},
                ],
                aliases: [
                    { validator:aliases,  trigger:'blur'}
                ],
                seq: [
                    // { type: 'number', message: '序号必须为数字值'},
                    { validator:paixu,  trigger:'blur'}
                ],
                type:[
                    { validator:moviType,  trigger:'change'}
                ],
                addFeeType:[
                    { validator:addFeeType , trigger:'change'}
                ],
                amount:[
                    {validator:amount,trigger:'blur'}
                ],
                percentage:[
                    {validator:percentage,trigger:'blur'}
                ]
            },
        }
    },
 
    methods:{
        //是否启用增值服务
        isOnAddFee(valid) {
            if(this.jsonData.isOnAddFee==1) {
                this.zengZhifuWU_feiyong_status=false
                this.rules.addFeeType
                this.jsonData.addFeeType=1;
            }else{
                this.zengZhifuWU_feiyong_status=true
                this.jsonData.amount=0;
                this.jsonData.percentage=0;
                this.jsonData.addFeeType='';
                if(!valid) {
                    this.$refs['jsonData'].validate((valid) => {
                        if (valid) {} else {return false;}
                    });
                }
                
                
            }
        },
        zhuanshou_change(val) {
            console.log(val)
        },
        //取消
        out() {
            this.$router.go(-1);
        },
        //修改提交
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                console.log(valid)
            if (valid) {
                this.jsonData.amount = this.jsonData.percentage? 0:this.jsonData.amount;
                this.jsonData.percentage = this.jsonData.amount? 0:this.jsonData.percentage;
                //修改
                if(this.hallUid) {
                    console.log('修改')
                    let jsonData ={"jsonData":JSON.stringify(this.jsonData)} 
                    jsonData =  qs.stringify(jsonData)
                    this.$api.updataCiHall(jsonData).then( data => {
                        if (data && data.code === 200) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1000,
                                onClose: () => {
                                    this.$router.go(-1)
                                }
                            })
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                }else{   //新建
                    console.log('新建')
                    this.jsonData.cinemaUid=this.$route.query.cinemaUid;
                    this.$api.addCiHall(this.jsonData)
                    .then( data => {
                        if (data && data.code === 200) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 500,
                                onClose: () => {
                                    this.$router.go(-1)
                                }
                            })
                        } else {
                        }
                    }).catch( err => {
                        console.log(err)
                    })
                
                }
            } else {
                return false;
            }
            });
      },
      //获得影厅信息
      getCiHall(hallUid) {
          console.log(hallUid)
          var hallUid = {hallUid:hallUid}
          this.$api.getCiHallByUid(hallUid).then( data => {
                if (data && data.code === 200) {
                    var data = data.data;
                    this.jsonData =JSON.parse(JSON.stringify(data)) ;
                    console.log(this.jsonData)
                } else {
                }
            }).catch( err => {
                console.log(err)
            })
      },
      //获得影厅类型
      getmovieType() {
          this.$api.cinemagetByName('?name=CI_HALL_TYPE').then( data => {
            if (data && data.code === 200) {
                this.movieType = data.data;
            } else {
            }
            }).catch( err => {
                console.log(err)
            })
      }
    
        
    },
    created() {
        this.getmovieType();
        let hallUid = this.hallUid = this.$route.query.uid;
        if(hallUid){
            this.getCiHall(hallUid);
        }
    }
    
}
</script>
<style lang="scss" type="text/css" >
        #edit .el-breadcrumb  {
            margin: 30px 0 20px 30px;
        }
        .under-line{width: 100%;height: 1px; background: #ebeef5}
  
         #edit .body{
            padding: 20px;
        }
        //标题
        #edit .head{
            font-size:14px;
            height:35px;
            line-height: 35px;
            text-indent: 10px;
            background:skyblue;
            color: white;
            cursor:pointer;
        }
        #edit .num{
            text-align: left
        }
        #edit .el-input--mini{
            width: 300px;
            .el-input__inner{height: 32px;}
        }
        #edit .el-form-item__content{height: 32px;}
        #edit .el-form-item__error{
            margin-left: 8px
        }
</style>


