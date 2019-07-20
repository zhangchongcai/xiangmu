//time 请传递13位的时间戳格式
export function getDaysListOfMonth(time){
    time = (new Date(time));
    let year = time.getFullYear() , 
        month = time.getMonth();
    let monthBegin = new Date(year , month ,1) , 
        monthEnd = new Date(year, month, 1).addMonths(1).addDays(-1) , 
        monthBeginTime = new Date(year, month, 1).getTime() , 
        monthEndTime = new Date(year, month, 1).addMonths(1).addDays(-1).getTime();
  
    let startDay = monthBegin.getDay() || 7 , 
        endDay = monthEnd.getDay() || 7 ;
      
    let calendarStart = (monthBegin.addDays(1 - startDay)), 
        calendarEnd    = monthEnd.addDays(7 - endDay).getTime() , 
        _calendarEnd = calendarStart.getTime() ; 
        calendarStart = calendarStart.getTime();
    let oneDay = 24 * 60 * 60 * 1000 ; 
    let daysList = [{
        label: Number((new Date(_calendarEnd)).formatDate('dd')) , 
        value: _calendarEnd,
        dayInCurrentMonth: (new Date(_calendarEnd) >= monthBeginTime && new Date(_calendarEnd)  <= monthEndTime), 
        currendDay: ((new Date(new Date().formatDate('yyyy-MM-dd 00:00:00'))).getTime() == _calendarEnd),
        // enbaleChoise:((new Date(new Date().formatDate('yyyy-MM-dd 00:00:00'))).getTime() < calendarStart
    }]
    // console.log(daysList);
    while ((_calendarEnd < calendarEnd) || (daysList.length < 42)){
        _calendarEnd += oneDay;
        daysList.push({
            label: Number((new Date(_calendarEnd)).formatDate('dd')) , 
            value: _calendarEnd,
            dayInCurrentMonth: (new Date(_calendarEnd) >= monthBeginTime && new Date(_calendarEnd) <= monthEndTime),
            currendDay: ((new Date(new Date().formatDate('yyyy-MM-dd 00:00:00'))).getTime() == _calendarEnd),
        });
    }
    daysList.forEach(item=>{
        if(item.value > (new Date(new Date().formatDate('yyyy-MM-dd 00:00:00')))){
            item.enableChoise = false;
        }else{
            item.enableChoise = true;
        }
    })
    return daysList ;
}