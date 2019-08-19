
export default {
    data() {
        return {
            disable:false,
            validataText:'获取验证码'
        }
    },
    methods: {
        getVilidate(){
            this.$store.dispatch('sendViladate',{phoneNumber:this.member.phoneNum,tenantId:this.tenantId,operator:this.operator})
            .then(res =>{
                let n = 60;
                this.disable = true;
                window.validateTimer = setInterval(()=>{
                    n --;
                    if(n<=0){
                        clearInterval(window.validateTimer);
                        this.validataText = '获取验证码';
                        this.disable = false;
                        return;
                    }
                    this.validataText = `${n}s后重新获取`
                },1000)
            });
        }
    },
    beforeDestroy() {
        clearInterval(window.validateTimer);
    }
}