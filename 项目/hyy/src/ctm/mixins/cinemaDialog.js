import { createDecipher } from "crypto";
import frameSinglecinema  from "ctm/components/cinema"


export default {
    components:{frameSinglecinema},
    data() {
        return{
            // 影院单选
            cinemaUid:'',
            cinemaName:'',
            innerDataSingle: { id: 38 },
            singleCinemaVisible: false,
            whereUse: null,
            cinematype: 2, // 传递给 组件的调用的影院类型 属性参数
            innerData: [], // 传递给 组件的可选参数 props 参数
            cinemaUid:null
        }
    },
    methods:{
        //弹窗方法
        confirmCinemaSingleDialog(){
            this.$refs.frameSingleCinema.confirmData()
        },
        cinemaCallback(opt) {
            console.log("这里返回数据",opt)
            this.cinemaUid = opt.data.id
            this.cinemaName= opt.data.name
        },
        cinemaDialogShow() {
        this.$refs.frameSingleCinema.openDialog()
        this.$refs.frameSingleCinema.listAuthCommCinemas();
        },
    },
    created(){}
}