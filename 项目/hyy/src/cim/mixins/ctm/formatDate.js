export default {
    
    methods: {
        // 根据时间戳转yyyy-MM-dd
        getDate(timestamp) {
            let date = new Date(timestamp)
            let Y = date.getFullYear()
            let M = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
            let D = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
            return Y + '-' + M + '-' + D
        },
        // 获取当前周的日期范围 ['yyyy-MM-dd', 'yyyy-MM-dd']
        getCurrentWeekDate() {
            let currenTime = new Date()
            let startPlanDate = Date.parse(currenTime) - ((currenTime.getDay() ? (currenTime.getDay() - 1) : 6)*24*60*60*1000)
            let endPlanDate = Date.parse(currenTime) + (currenTime.getDay() ? (7 - currenTime.getDay()) : 0)*24*60*60*1000
            return [this.getDate(startPlanDate), this.getDate(endPlanDate)]
        },
        // 获取起始日期为今日范围为一周的日期范围 ['yyyy-MM-dd', 'yyyy-MM-dd']
        getFutureWeekDate() {
            let startPlanDate = Date.parse(new Date())
            let endPlanDate = startPlanDate + 6*24*60*60*1000
            return [this.getDate(startPlanDate), this.getDate(endPlanDate)]
        }
    }
}