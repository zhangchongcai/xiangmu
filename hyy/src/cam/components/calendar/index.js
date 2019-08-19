import CalendarVue from './calendar.vue';
// 这里是重点
const Calendar = {
    install: function (Vue) {
        Vue.component('Calendar', CalendarVue);
    }
};

// 导出组件
export default Calendar;
