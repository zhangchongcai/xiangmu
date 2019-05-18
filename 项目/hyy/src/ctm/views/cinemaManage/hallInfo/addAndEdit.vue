<template>
    <div class="edit">
        <div class="breadcrumb">
            <span>影院管理</span>
            <span>></span>
            <span @click="toBack" style="color:#333;cursor:pointer"> 影院编辑</span>
            <span>></span>
            <span>{{jsonData.uid ? '修改' : '新建'}}影厅</span>
        </div>
        <div class="main">
            <el-form ref="jsonData" :model="jsonData" :rules="rules"
                size="mini" inline-message
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
                <div class="information">
                    <div style="margin-left:80px;color:#666">
                        <span class="num">{{jsonData.seatnum}}</span> <span >(系统自动计算)</span>
                        <el-button type="primary" @click="seatDesign" v-if="hallUid">座位图设计</el-button>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="影厅类型：" prop="type">
                <el-select v-model="jsonData.type" placeholder="==请选择==">
                <el-option :label="item.keyDesc" :value="item.keyCode" v-for="(item,ind) in movieType" :key="ind"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态： ">
                <el-radio-group v-model="jsonData.status">
                <el-radio :label="1">有效</el-radio>
                <el-radio :label="0">无效</el-radio>
                </el-radio-group>
            </el-form-item>
            <div style="text-align:center;paading-right:20px;">
                    <el-button type="primary" @click="submitForm('jsonData')" v-if="this.hallUid">修改</el-button>
                    <el-button type="primary" @click="submitForm('jsonData')" v-else>立即创建</el-button>
                    <el-button @click="out">取消</el-button>
            </div>
            
            </el-form>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import qs from 'qs';
export default {
    data(){
        //表单正则规则
        let wallName=(rule,value,callback)=>{
            let reg=/[0-9a-zA-Z]{4,9}/
            if(!value){
                return callback(new Error('不能为空！'))
            }
            var data = {
                uid :this.$route.query.uid,
                name:(this.jsonData.name).trim(),
                cinemaUid:this.$route.query.cinemaUid
            }
            this.$ctmList.nameExsit(data).then(function (data) {
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
            this.$ctmList.aliasesExsit(params) .then(data => {
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
                this.$ctmList.seqExsit(data)
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
        

         return {
            zengZhifuWU_feiyong_status:false,
            movieType:'',
            hallUid : null,
            cinemaUid:'',
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
            },
        }
    },
 
    methods:{
        //返回
        toBack() {
            this.$router.push({
                path:'/ticket/cinema/edit',
                query:{uid:this.cinemaUid}
            })
        },
        //取消
        out() {
            this.$router.push({
                path:'/ticket/cinema/edit',
                query:{uid:this.cinemaUid}
            })
        },
        //修改提交
        submitForm(formName) {
            if(this.jsonData.status==0&&this.jsonData.monopoly==0){
                return this.$message.error('存在放映计划，不能修改无效')
            }
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
                    this.$ctmList.updataCiHall(jsonData).then( data => {
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
                    this.$ctmList.addCiHall(this.jsonData).then( data => {
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
          this.$ctmList.getCiHallByUid(hallUid).then( data => {
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
          this.$ctmList.cinemagetByName('?name=CI_HALL_TYPE').then( data => {
            if (data && data.code === 200) {
                this.movieType = data.data;
            } else {
            }
            }).catch( err => {
                console.log(err)
            })
      },
        seatDesign(uid) {
            this.$router.push({
                path: '/ticket/cinemawall/seatdesign',
                query:{
                    hallUid:this.hallUid,
                    cinemaUid:this.cinemaUid
                }
            });
        },
    
        
    },
    created() {
        this.getmovieType();
        let hallUid = this.hallUid = this.$route.query.uid;
        this.cinemaUid = this.$route.query.cinemaUid
        if(hallUid){
            this.getCiHall(hallUid);
        }
    }
    
}
</script>
<style lang="scss">
    .edit .breadcrumb  {
        margin: 0px 0 20px 0px;
        color:  #BCBCBC;
        span{font-size: 12px;}
        span:nth-child(2){
            color: #666666;
        }
        span:last-child{
            color: #3B74FF ;
        }
    }
    .edit{
        .head{
            font-size:14px;
            height:35px;
            line-height: 35px;
            text-indent: 10px;
            color: white;
            cursor:pointer;
        }
        .information{
            width: 400px;
            text-align: left
        }
        .el-form-item--mini.el-form-item{
            margin-bottom:8px;
            label,span{font-size: 12px}
        }
        .el-input--mini{
            width: 300px;
            .el-input__inner{height: 32px;}
        }
        .el-form-item__content{height: 32px;}
        .el-form-item__error{
            margin-left: 8px
        }
        .el-form-item--mini.el-form-item{
            width: 500px;
        }
        .el-radio-group{
            margin-left: 27px;
        }
    }
</style>


