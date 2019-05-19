function createWeeks(year){
    let ONEDAY = 24 * 3600 * 1000 ;
    let startDate = new Date(year , 0 , 1) , 
        endDate = new Date(year , 11 , 31) ; 
    let firstDay = startDate.getDay() || 7  , 
        lastDay = endDate.getDay()  || 7 ;
    startDate.addDays((firstDay <= 4) ? (1 - firstDay) : (8 - firstDay));
    endDate.addDays((lastDay < 4) ? (0 - lastDay) : (7 - lastDay));
    let startTime = startDate.getTime() , 
        endTime = startTime + ONEDAY * 6;
    let weekList = [];    
    weekList.push([startTime, endTime]);
    while (endTime < endDate.getTime()) {
        startTime = endTime + ONEDAY;
        endTime = startTime + ONEDAY * 6;
        weekList.push([startTime, endTime]);
    }
    return weekList;
}


function formatDig(num) {
    return num > 9 ? '' + num : '0' + num;
}

export function getWeekData(year) {
    let list = createWeeks(year);
    let weekList = [];
    list.forEach(function(item , index){
        let start = item[0] ,
            end = item[1] , 
            itemIndex = index + 1 ; 
        let weekIndex = formatDig(itemIndex),
            weekStartText = (new Date(start)).formatDate('MM月dd日') , 
            weekEndText = (new Date(end)).formatDate('MM月dd日'),
            weekStartDate = start ,
            weekEndDate = end ,
            ifCurrentWeek = false ,  
            isActive = false ; 
        let label = weekIndex + '周 ( ' + weekStartText + '-' + weekEndText + ' )' ; 
        if ((new Date()) >= new Date(start) && (new Date()) <= new Date(end)) {
            ifCurrentWeek = true ;
        }
        weekList.push({
            weekIndex,
            label : label ,
            weekStartDate,
            weekEndDate , 
            ifCurrentWeek ,
            isActive
        });
    });
    return weekList;
}

