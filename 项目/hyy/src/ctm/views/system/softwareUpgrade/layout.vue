<template>
    <div class="software">
        <aside class="aside">
            <cinemaTree v-on:choseCinema="handerChoseCinema"></cinemaTree>
        </aside>

        <main class="main">
            <table>
                <tr>
                    <td class="title">当前版本软件信息摘要：</td>
                    <td class="label">{{info.current_software_summary}}</td>
                </tr>
                <tr>
                    <td class="title">新版本软件信息摘要：</td>
                    <td class="label">{{info.new_software_summary}}</td>
                </tr>
                <tr>
                    <td class="title">新版本升级包信息摘要：</td>
                    <td class="label">{{info.pack_summary}}</td>
                </tr>
                <tr>
                    <td class="title">新软件下载地址：</td>
                    <td class="label">{{info.ftp_url}}</td>
                </tr>
                <tr>
                    <td class="title">登录用户名：</td>
                    <td class="label">{{info.ftp_username}}</td>
                </tr>
                <tr>
                    <td class="title">登录密码：</td>
                    <td class="label">{{info.ftp_password}}</td>
                </tr>
            </table>
        </main>
    </div>
</template>
<script>
import cinemaTree from 'ctm/components/SystemGetUserMenuTree'
export default {
    components:{cinemaTree},
    data(){
        return{
            cinemaUid:'',
            info:''
        }
    },
    methods:{
        handerChoseCinema(vale){
            console.log("父组件",vale)
            this.getData(vale)
        },
        getData(cinemaUid) {

            this.$ctmList.systemCinemaUiduUdate({"cinemaUid":cinemaUid}).then(res => {
                this.info = res.data
            })
        }
    },
    created() {
    }
}
</script>
<style lang="scss">
.software{
    display: flex;
    .aside{
        width: 350px;
    }
    .main{
        flex: 1;
        margin: 20px;
        tr{
            height: 30px;;
        }
        .title{
            font-size: 18px;
            color:#333;
            text-align: right;
        }
        .label{
            color: #666;
            font-size: 18px;
        }
    }

}
</style>


