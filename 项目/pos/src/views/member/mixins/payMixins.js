import { MemberAjax } from 'http/memberApi'
export default {
    data() {
        return {
            payTimer:null,
            centerDialogVisible:false,
            payLoading:false,
            payLoadingText:'支 付',
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
                if(_params.data.cost == 0 || this.allPrice == 0){
                  this.paySubmit();
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
            this.$store.dispatch("handleHttp", this.handleSubmit()).catch(res=>{
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
        }
    }
}