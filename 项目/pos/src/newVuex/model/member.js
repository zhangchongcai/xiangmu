import * as TYPES from '../types'
import axios from "src/http/http";
import {memeberApi} from 'http/memberApi'
// import { stat } from 'fs';
export default {
    state : {
        cardNo:'',//查看是否选中卡片号
        phoneNum:'',//手机号
        cardState:'',//选中卡片状态
        numberType:'', //按下enter 判断输入的是手机号还是卡号
        cardTypeCode:'',//卡类型  储值卡 联名卡(cobranded_card)  权益卡(equity_card)
        memberCardInfo:null, //会员卡信息  修改资料时使用
        getOrderList:null,//获取到的交易列表
        memberId:'',
        loading:false,
        isshow:false,//是否获取到数据，如果没有数据则不显示
        show:false,//密码输入等待弹框
        pageLoading:false,//全局数据加载loading
        cardNoOrphoneNumState:false,//判断输入的卡号或手机号是否正确
        makeUpPrice:'',//补卡手续费
        cancellationFees:''//注销手续费
    },
    mutations : {
        handleHttp:function(state,{res,router}){
            let resInfo = res.data;
            Vue.prototype.$message({
                message: resInfo.msg,
                type: "success",
                onClose: () => {
                    router.push({
                        path: "/member"
                    });
                }
            });
        },
        getInfoHandle:function(state,res){
            state.pageLoading = false;
            let resInfo = res.data;
            if (!resInfo.data) {
                Vue.prototype.$message.warning(resInfo.msg);
                state.isshow = false;
                return;
            }
            state.isshow = true;
            state.memberCardInfo = resInfo.data;
        },
        getListHandle(state,res){
            state.loading = false;
            if(res.data.code === 200 && res.data.data){
                state.getOrderList = res.data.data;
            }else {
                Vue.prototype.error(res.data.msg);
            }
        },
        getViladateInfo(state,res){
            Vue.prototype.$message({
                message:'发送成功，请注意查收',
                type:'success'
            })
        },
        cardPolicy(state,res){
            state.makeUpPrice = res.makeUpPrice;
            state.cancellationFees = res.cancellationFees;
        }
    },
    actions:{
        // submit 提交接口
        handleHttp:function({commit},{url,data,router}){
            return new Promise((reslove,reject)=>{
                axios.post(url,Vue.prototype.$sign({...data})).then(function(res){
                    if (res.data.code == 200 && res.data.msg === '操作成功') {
                        commit('handleHttp',{res,router})
                        reslove(res.data)
                    }else{
                        Vue.prototype.error(res.data.msg);
                        reject(res.data)
                    }
                }).catch(err=>{
                    reject(err)
                })
            })
        },
        //获取card信息
        getInfo:function({commit},{url,params}){
            axios.get(url,Vue.prototype.$sign({...params})).then(res=>{
                commit('getInfoHandle',res)
            })
        },
        //获取交易记录
        getOrderList:function({commit},{url,params}){
            axios.get(url,Vue.prototype.$sign({...params})).then(res => {
                commit('getListHandle',res)
            }).catch(err=>{
                Vue.prototype.error(err.response.data)
                console.log(err)
            })
        },
        //发送验证码
        sendViladate:function({commit},data){
            return new Promise((reslove,reject)=>{
                axios.get(memeberApi.sendMsg['url'],Vue.prototype.$sign({...data})).then(res => {
                    if(res.data.code === 200 && res.data.msg === '操作成功'){
                        commit('getViladateInfo',res);
                        reslove(res)
                    }else{
                        Vue.prototype.error(res.data.msg)
                    }
                }).catch(err=>{
                    console.log(err)
                    Vue.prototype.error('验证码发送失败');
                    reject(err)
                })
            })
        },
        //查询卡政策
        cardPolicy:function({commit},data){
            return new Promise((reslove,reject)=>{
                axios.get(memeberApi.applyCardNoInfo['url'],Vue.prototype.$sign({...data})).then(res=>{
                    if(res.data.code === 200){
                        commit('cardPolicy',res.data.data);
                        reslove(res.data)
                    }else{
                        Vue.prototype.error(res.data.msg);
                    }
                }).catch(err=>{
                    Vue.prototype.error(err)
                })
            })
        }
    }
    
}