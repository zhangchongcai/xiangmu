<template>
<div class="page-wrapper page-justsee-message-channel page-justsee-basecenema-edit">
    <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>短信管理</el-breadcrumb-item>
            <el-breadcrumb-item>创建短信模板</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="clearboth"></div>
             <!--基本信息-->
             <section class="film-base-page">
                 <el-form ref="messageTemplate" :model="messageTemplate" :rules="rules" label-width="110px" label-position="right" label-height='60px'>
                   <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="短信场景：" prop="sceneCode">
                            <el-select v-model="messageTemplate.sceneCode"  filterable placeholder="请选择" @change="templateFunc" class="mini-select-size">
                                <el-option
                                v-for="item in sceneCodes"
                                :key="item.sceneCode"
                                :label="item.sceneName"
                                :value="item.sceneCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                 <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="场景变量：" prop="seceneParam">
                            <!-- <el-radio-group v-model="messageTemplate.seceneParam">
                                <el-radio-button label="卡号"></el-radio-button>
                                <el-radio-button label="金额"></el-radio-button>
                                <el-radio-button label="取票码"></el-radio-button>
                            </el-radio-group> -->
                            <div class="scene-btn" v-for="item in messageTemplate.seceneParam" :key="item.id">{{item.paramName}}</div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="模板内容：" prop="content">
                        <el-input type="textarea" v-model="messageTemplate.content" :disabled="isJustSee" placeholder="请选择短信场景" @change="templateTextareaFunc" @blur="templateTextareaFunc"></el-input>
                         <div class="template-box">
                           <div class="left">开头定义签名，【】区分，2-20个字符</div>
                           <div class="right">字数：<span style="color:#f00;">{{messageTemplate.content.length}}</span>/67 条数：1</div>
                        </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                      
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="示例：" prop="description">
                            <!-- <el-input type="textarea" v-model="messageTemplate.description" :disabled="isJustSee"></el-input> -->
                            <div class="template-demo-text">
                                <!-- 【大地电影】购买成功，卡号：6669769,支付金额35元！ -->
                                {{tempalteShowText}}
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>  
                 <el-row :gutter="20">
                    <el-col :span="12" v-if="!isJustSee && isModify">
                        <el-form-item label="测试手机号：" prop="description">
                            <el-input  v-model="messageTemplate.phone" style="width:70%;"></el-input>
                            <el-button @click="sendMessage" style="margin-left:12px;">发送测试短信</el-button>
                            <div class="contentMsg">{{contentMsg}}</div>
                        </el-form-item>
                    </el-col>
                </el-row>  
                
                </el-form>
                <div class="btn" style="margin:20px auto; text-align:center;">
                    <el-button @click="out"  v-if="!isJustSee">取消</el-button>
                    <el-button type="primary" v-if="!isModify && !isJustSee" @click="submitForm('messageTemplate',false)">保存</el-button>
                    <!-- 修改调用接口 -->
                    <el-button type="primary" v-if="isModify && !isJustSee"  @click="submitForm('messageTemplate',true)">保存</el-button>
                    <el-button @click="out"  v-if="isJustSee">返回</el-button>
                </div>
             </section>

</div>
</template>

<script>
import { createSmsChannel, updateSmsTemplate, querySmsScene,sendSingleMsg, createSmsTemplate} from 'src/frame_cpm/http/interface'
// import {provs,allCity} from './cityData.js';
    export default {
        data(){
            return{
               listLoading:false,
               tableKey:1,
               sceneCodes:[],
               isModify:false,
               sendDebouce:false,
               isJustSee:false,
               checkList: ['选中且禁用','复选框 A'],
               nameslist:[],
               seceneParam:'',
               contentMsg:'',
               tempalteShowText:'',
               messageTemplate:{
                   sceneName:null,
                   sceneCode:'',
                   templateName:'',
                   templateCode:'',
                   seceneParam:null,
                   content:'',
                   status:1,
               },
               rules:{
                   sceneCode:[
                       {required: true ,message:'请填写短信场景', trigger: 'blur'},
                   ],
                   seceneParam:[
                       {required: true ,message:'请填写场景CODE', trigger: 'blur'},
                   ],
                   msgMaxLength:[
                       {required: true ,message:'请填写通道字符数', trigger: 'blur'},
                   ]
               },
            }    
        },
        methods:{
            handleClick(tab, event) {
                console.log(tab, event);
            },
            sendMessage(){
                this.sendDebouce = true;
                if(this.messageTemplate.phone && this.messageTemplate.phone.length==11){
                    let postObj ={
                        mobile:this.messageTemplate.phone,
                        content:this.messageTemplate.content
                    }
                    sendSingleMsg(postObj)
                    .then( ret => {
                        if (ret.result) {
                            this.success(ret.msg)
                            this.contentMsg = ret.msg
                        } else {
                            this.error(ret.msg)
                        }
                    }).catch( err => {
                        console.log(err)
                    })
                }
            },
            closeDialog(){
                this.dialogFormVisible = false
            },
            //修改保存
            submitForm(formName,boolean) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let messageTemplateBase = this.messageTemplate;
                        delete messageTemplateBase.seceneParam
                        if(!boolean){
                            // 创建调用接口
                        createSmsTemplate(messageTemplateBase)
                        .then( ret => {
                            if (ret.result) {
                                this.success('创建短信模板成功')
                                this.$router.go(-1)
                            } else {
                                this.error('创建短信模板失败')
                            }
                        }).catch( err => {
                            console.log(err)
                        })
                        }else{
                        // 修改调用接口
                        messageTemplateBase.id = this.$route.query.id
                        updateSmsTemplate(messageTemplateBase)
                        .then( ret => {
                            if (ret.result) {
                                this.success('修改短信模板成功')
                                this.$router.go(-1)
                            } else {
                                this.error(ret.msg)
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
            
            //获取模板详情
            getInfo(){
                // let idCache = this.$route.query.id;
                // this.$filmApi.filmGet({id:idCache})
                // .then((ret)=> {
                //   if(ret.code === 200){
                //       this.filmBase = ret.data
                //       this.filmEditions=ret.data.filmEdition.split(',')
                //       this.filmLanguages=ret.data.filmLanguage.split(',')
                //       this.filmTypes=ret.data.filmType.split(',')
                //       this.nameslist = ret.data.name.split(',')
                //       this.uploadValue = ret.data.mainPoster
                //   }
                // })
                // .catch(function (error) {
                //     console.log(error);
                // });
            },
            querySmsScene() {
                // this.listQuery.sortName = 'id'
                // this.listQuery.sort = false
                let postObj = {};
                querySmsScene(postObj).then(ret => {
                    this.sceneCodes = ret.data.data;
                    if(this.$route.query.isModify){
                        let currentPageObj = JSON.parse(localStorage.getItem('templatedetail'))
                        this.messageTemplate.sceneCode = currentPageObj.sceneCode
                        let itemScene =  this.sceneCodes.filter(item=>item.sceneCode == currentPageObj.sceneCode)
                        this.messageTemplate.seceneParam  = itemScene && itemScene[0] && itemScene[0].paramList
                        let paramCurrentUse = itemScene && itemScene[0] && itemScene[0].paramList
                        let templateInfo = '【大地电影】购买成功，'
                        let templatetext = '【大地电影】购买成功，'
                        for(let i=0;i<paramCurrentUse.length;i++){
                            templateInfo += paramCurrentUse[i].paramName +':' +'{'
                            templateInfo += paramCurrentUse[i].paramCode +'},';
                            templatetext+= paramCurrentUse[i].paramName +':'
                            templatetext += paramCurrentUse[i].sample;
                        }
                        this.messageTemplate.content = templateInfo
                        this.tempalteShowText = templatetext
                        }
                
                    // let templateInfo1 = '【大地电影】购买成功，卡号：{CardCode},支付金额{Money}元！'
                    // let templatetext = '【大地电影】购买成功，卡号：6669769,支付金额35元！'
                    
                });
            },
            //获取联动城市方法

            //取消退出
            out(){
                this.$router.push("/sys/message/messageTemplate")
            },
            templateTextareaFunc(){
                var matchHuaKuoHao = /\{(.+?)\}/g; // {} 花括号，大括号
                let content = this.messageTemplate.content;
                let matchValue= content.match(matchHuaKuoHao)
                console.log(matchValue,1)
                let tempalteShowText = this.tempalteShowText
                let hasnotHuakuohao = []
                for(let i=0;i<matchValue.length; i++){
                    var astring = matchValue[i].slice(1,matchValue[i].length-1)
                    hasnotHuakuohao.push(astring)
                }
                 let hasnotHuakuohaoSample = []
                 let seceneParamLoop = this.messageTemplate.seceneParam
                // for(let k = 0; k<seceneParamLoop.length;k++){
                //     for(let j=0;j<matchValue.length; j++){
                //         var astring = matchValue[j].slice(1,matchValue[j].length-1)
                //         if(seceneParamLoop[k].paramCode == hasnotHuakuohao[j]){
                //             hasnotHuakuohaoSample.push(seceneParamLoop[k].sample)
                //             content.replace(matchValue[k], seceneParamLoop[k].sample)
                //         }
                //     }
                // }
                console.log(hasnotHuakuohaoSample)
                
               if(matchValue.length == 1){
                   var content1 =  content.replace(matchValue[0], seceneParamLoop[0].sample)
                   this.tempalteShowText = content1
               }else if (matchValue.length == 2){
                   var content1 =   content.replace(matchValue[0], seceneParamLoop[0].sample)
                   var content2 =   content1.replace(matchValue[1], seceneParamLoop[1].sample)
                   this.tempalteShowText = content2
               }else if (matchValue.length == 3){
                   var content1 =   content.replace(matchValue[0], seceneParamLoop[0].sample)
                   var content2 =   content1.replace(matchValue[1], seceneParamLoop[1].sample)
                   var content3 =   content1.replace(matchValue[2], seceneParamLoop[2].sample)
                   this.tempalteShowText = content3
               }else if (matchValue.length == 4){
                   var content1 =   content.replace(matchValue[0], seceneParamLoop[0].sample)
                   var content2 =   content1.replace(matchValue[1], seceneParamLoop[1].sample)
                   var content3 =   content1.replace(matchValue[2], seceneParamLoop[2].sample)
                   var content4 =   content1.replace(matchValue[3], seceneParamLoop[3].sample)
                   this.tempalteShowText = content4
               }else if (matchValue.length == 5){
                   var content1 =   content.replace(matchValue[0], seceneParamLoop[0].sample)
                   var content2 =   content1.replace(matchValue[1], seceneParamLoop[1].sample)
                   var content3 =   content1.replace(matchValue[2], seceneParamLoop[2].sample)
                   var content4 =   content1.replace(matchValue[3], seceneParamLoop[3].sample)
                   var content5 =   content1.replace(matchValue[4], seceneParamLoop[4].sample)
                   this.tempalteShowText = content5
               }else if (matchValue.length == 6){
                  var content1 =   content.replace(matchValue[0], seceneParamLoop[0].sample)
                   var content2 =   content1.replace(matchValue[1], seceneParamLoop[1].sample)
                   var content3 =   content1.replace(matchValue[2], seceneParamLoop[2].sample)
                   var content4 =   content1.replace(matchValue[3], seceneParamLoop[3].sample)
                   var content5 =   content1.replace(matchValue[4], seceneParamLoop[4].sample)
                   var content6 =   content1.replace(matchValue[5], seceneParamLoop[5].sample)
                   this.tempalteShowText = content6
               }else if (matchValue.length == 7){
                   var content1 =   content.replace(matchValue[0], seceneParamLoop[0].sample)
                   var content2 =   content1.replace(matchValue[1], seceneParamLoop[1].sample)
                   var content3 =   content1.replace(matchValue[2], seceneParamLoop[2].sample)
                   var content4 =   content1.replace(matchValue[3], seceneParamLoop[3].sample)
                   var content5 =   content1.replace(matchValue[4], seceneParamLoop[4].sample)
                   var content6 =   content1.replace(matchValue[5], seceneParamLoop[5].sample)
                   var content7 =   content1.replace(matchValue[6], seceneParamLoop[6].sample)
                   this.tempalteShowText = content7
               }else if (matchValue.length == 8){
                   var content1 =   content.replace(matchValue[0], seceneParamLoop[0].sample)
                   var content2 =   content1.replace(matchValue[1], seceneParamLoop[1].sample)
                   var content3 =   content1.replace(matchValue[2], seceneParamLoop[2].sample)
                   var content4 =   content1.replace(matchValue[3], seceneParamLoop[3].sample)
                   var content5 =   content1.replace(matchValue[4], seceneParamLoop[4].sample)
                   var content6 =   content1.replace(matchValue[5], seceneParamLoop[5].sample)
                   var content7 =   content1.replace(matchValue[6], seceneParamLoop[6].sample)
                   var content8 =   content1.replace(matchValue[7], seceneParamLoop[7].sample)
                   this.tempalteShowText = content8
               }
                
            },
            templateFunc(obj){
                console.log(obj)
                let itemScene =  this.sceneCodes.filter(item=>item.sceneCode == obj)
                this.messageTemplate.seceneParam  = itemScene && itemScene[0] && itemScene[0].paramList
                console.log(itemScene[0])
                this.messageTemplate.sceneName = itemScene && itemScene[0] && itemScene[0].sceneName
                this.messageTemplate.sceneCode = itemScene && itemScene[0] && itemScene[0].sceneCode
                this.messageTemplate.templateName = itemScene && itemScene[0] && itemScene[0].sceneName
                this.messageTemplate.templateCode = itemScene && itemScene[0] && itemScene[0].sceneCode
                let paramCurrentUse = itemScene && itemScene[0] && itemScene[0].paramList
                    // let templateInfo1 = '【大地电影】购买成功，卡号：{CardCode},支付金额{Money}元！'
                    // let templatetext = '【大地电影】购买成功，卡号：6669769,支付金额35元！'
                     let templateInfo = '【大地电影】购买成功，'
                     let templatetext = '【大地电影】购买成功，'
                    for(let i=0;i<paramCurrentUse.length;i++){
                      templateInfo += paramCurrentUse[i].paramName +':' +'{'
                      templateInfo += paramCurrentUse[i].paramCode +'}';
                      templatetext += paramCurrentUse[i].paramName +':'
                      templatetext += paramCurrentUse[i].sample;
                    }
                    this.messageTemplate.content = templateInfo
                    this.tempalteShowText = templatetext
            },
            unique(arr){
            　　var newArr = [arr[0]];
            　　 for(var i=1;i<arr.length;i++){
            　　　　if(newArr.indexOf(arr[i]) == -1){
                    　　 newArr.push(arr[i]);
                　　  }
                    }
                return newArr;
            },
            addContact(){
                let abc = this.$refs
                //    this.tableData.push({contract:'',telephone:'', job:'' ,email:''}) 
                if(this.$refs.tableDataRef){
                    // this.$refs.tableDataRef.clearValidate()
                }
                this.dialogFormVisible = true
            }
        },
        created(){
            this.isModify = (this.$route.query.isModify=='true' || this.$route.query.isModify==true)?true:false
            this.isJustSee  = (this.$route.query.isJustSee=='true' || this.$route.query.isJustSee==true)?true:false
            if(this.isModify){
                this.getInfo();
            }
            this.querySmsScene()
        
        },
    }
</script>
<style lang="scss">
    .page-justsee-message-channel{
        .just-see-checkbox{
            span{
                margin-right:6px;
            }
        }
        .el-date-editor.is-disabled .el-icon-date{
            display: none;
        }
        .el-textarea.is-disabled .el-textarea__inner{
             border-color:transparent;
            background-color:transparent;
            cursor: text;
            color: #808080;
            border: 0 none;
            padding-top:10px;
        }
        .el-checkbox{
            margin-left: 0;
            margin-right: 30px;
        }
        .el-input.is-disabled .el-input__inner{
            border-color:transparent;
            background-color:transparent;
            cursor: text;
            color: #808080;
            padding: 0;
            border: 0 none;
            &:link{
                border:none
            }
            &:visited{
                border:none
            }
            &:hover{
                border:none
            }
            &:active{
                border:none
            }
        }
        .normal-text{
            color: #808080;
            padding: 0;
        }
        .el-input__suffix{
            display: none;
        }
        .el-form-item__content{
            color: #808080;
        }
    }
</style>   
<style  lang='scss' scoped>
    .film-base-page{
        .el-row {
            &:last-child {
            margin-bottom: 0;
            }
        }
        .el-form-item.margin-bottom0{
            margin-bottom: 0;
        }
        .el-form-item{
             margin-bottom: 12px;
        }
        .el-col {
            border-radius: 4px;
        }
        .bg-purple-dark {
            background: #99a9bf;
        }
        .bg-purple {
            background: #d3dce6;
        }
        .bg-purple-light {
            background: #e5e9f2;
        }
        .grid-content {
            border-radius: 4px;
            min-height: 36px;
        }
        .row-bg {
            padding: 10px 0;
            background-color: #f9fafc;
        }
        .el-table .cell span.table-btn-mini {
            color: #3B74FF;
            cursor: pointer;
            margin-right: 6px;
        }
    }
    .template-box{
        .left{
            float: left;
        }
        .right{
            float:right;
        }
    }
    .template-demo-text{
        border: 1px solid #ccc;
        border-radius: 4px;
        padding-bottom: 8px;
        min-height: 32px;
    }
    .scene-btn{
        float: left;
        margin-right:6px;
    }
</style>
