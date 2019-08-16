import { MemberAjax } from 'http/memberApi'
import { printTicket , openCashBox } from "views/member/util/utils";
export default {
    data() {
        return {
            payTimer:null,
            centerDialogVisible:false,
            payLoading:false,
            payLoadingText:'支 付',
            payWayCode:[
              {label:'XRMB',value:'现金'},
              {label:'ALIPAY',value:'支付宝支付码付款'},
              {label:'WXPAY',value:'微信支付码付款'}
            ]
        }
    },
    methods: {
        //触发确定
        submit(vo) {
          if (!this.member.cardNo) {
            this.$message.warning("请选择一张储卡");
            return;
          }
            this.$refs["ruleForm"].validate(valid => {
            if (valid) {
                let _params = this.handleSubmit();
                if(_params.data.cost == 0 || this.allPrice == 0 || this.member.cardTypeCode === 'gift_card'){
                  this.paySubmit();
                }else if(_params.data.payWayCode === 'XRMB'){
                    openCashBox.call(this,this.config.configData)
                    this.centerDialogVisible = true;
                }else{
                  this.centerDialogVisible = true;
                }
            } else {
                console.log("error submit!!");
                return false;
            }
            });
        },
        paySubmit(){
            this.$store.dispatch("handleHttp", this.handleSubmit()).then((response)=>{
              printTicket.call(this,this.config.configData,response.data);
              this.stopPay();
              if(!!this.$route.query.perform){
                this.$store.commit('SET_VIP_INFO',response.data)
              }
            }).catch(res=>{
              if(res.code === 601){
                this.payTimer = setInterval(()=>{
                  this.payPolling(res.data)
                },2000)
              }else{
                try {
                  this.$message.error(res.msg);
                } catch (error) {
        
                }finally{
                  this.stopPay();
                }
              }
            })
        },
        //支付完成或失败 
        stopPay(){
            clearInterval(this.payTimer);
            this.centerDialogVisible = false;
        },
        //轮询支付
        payPolling(data){
            MemberAjax.getPayResult({flowNo:data,tenantId:this.tenantId}).then(res=>{
              if(res.code === 200){
                clearInterval(this.payTimer);
                this.centerDialogVisible = false;
                printTicket.call(this,this.config.configData,res.data)
                if(!!this.$route.query.perform){
                  this.$store.commit('SET_VIP_INFO',res.data)
                }
                this.$message({
                  message:'支付成功',
                  type:'success',
                  onClose: () => {
                    this.$router.push({
                      path: "/member"
                    });
                  }
                })
              }else if(res.code == -1 || res.code == 602){
                this.$message.warning(res.msg)
                this.stopPay();
              }
            }).catch(err=>{
                this.stopPay();
                this.$message.warning(err.response.data)
            })
          }
    },
    beforeDestroy(){
        this.stopPay();
    },
    watch: {
        "centerDialogVisible"(newval){
            if(!newval){
                this.stopPay();
            }
        },
        'ruleForm.barCode'(newval){
            if(/\d{18}/.test(newval.trim())){
                this.paySubmit()
            }
        },
        'member.cashBox'(newVal){
            if(newVal){
              this.paySubmit();
              this.member.cashBox = false;
            }
        }
    }
}