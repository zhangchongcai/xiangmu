<template>
    <el-upload
        class="avatar-uploader"
        ref="upload"
        :action="uploadHttpConfig"
        :headers="uploadHeaders"
        :before-upload="beforeAvatarUpload"
        :on-success="successAvatarUpload"
        :data="reqData"
    >
        <img v-if="queryData.imgUrl" :src="queryData.imgUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <div class="el-upload__tip" slot="tip" v-if="type == 'img'">(请上传500kb以内的JPG/PNG文件，建议图片规格：150*150px)</div>
    </el-upload>

</template>
<script>
    import httpConfig from "cim/http/config.js";

    export default {
        props: {
            //上传类型 img：图片 accessory：附件
            type: {
                type: String,
                default: 'img',
                required: false
            },
            url: {
                type: String,
                default: '',
                required: false
            },
        },
        created() {

        },
        data() {
            return {
                queryData: {
                    imgUrl: this.url
                }
            }
        },
        watch:{
            url(){
                this.queryData.imgUrl = this.url
            }    
        },
        methods: {
            //图片上传前回调
            beforeAvatarUpload(file) {
                if (file.size / 1024 >= 500) {
                    this.$message.error('文件过大，不能超过500KB')
                    return false
                }
            },
            //图片上传成功回调
            successAvatarUpload(response, file, fileList) {
                console.log(response, file, fileList)
                this.$refs.upload.clearFiles();
                if (response.code == 200) {
                    this.queryData.imgUrl = response.data;
                    this.$emit("on-success",this.queryData.imgUrl)
                } else {
                    this.$message.error(response.data.msg)
                }
            },
        },
        computed: {
            uploadHttpConfig() {
                return `${httpConfig.baseURL}/upload/goodsImg`
            },
            uploadHeaders() {
                return {"Cpm-User-Token": localStorage.getItem('token')}
            },
            reqData(){
                if(this.type == "accessory"){
                    return {module : 'AGREEMENT'}
                }else{
                    return {module : 'goods'}
                }
            }
        }
    };
</script>
<style lang="scss">
  .el-upload__tip{
      color: #999;
  }
</style>
