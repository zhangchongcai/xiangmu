import qs from 'qs'

export default {
    data() {

        return {
            commonRules: {
                valActivityName: [{
                    required: true,
                    validator: (rule, value, callback) => {
                        if (!value) {
                            return callback(new Error('活动名称不能为空'));
                        }else if(value.length>15){
                            return callback(new Error('活动名称不能超过15位字符'));
                        }
                        let params = qs.stringify({
                            id: this.activityId,
                            name: this.basicDataForm.activityName,
                            tenantId: this.basicDataForm.tenantId
                        });
                        if (value) {
                            this.$cmmList
                                .marketingValActivityName(params)
                                .then(data => {
                                    console.log(data);
                                    if (data && data.code === 200) {
                                        if (data.data == "false") {
                                            this.$message.error("活动名称已存在");
                                            callback(new Error('活动名称已存在'))
                                            return;
                                        } else {
                                            callback()
                                        }
                                    } else {
                                        callback()
                                        this.$message.error(data.msg);
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        } else {
                            callback()
                        }
                        
                    },
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {},
    created() {}
}