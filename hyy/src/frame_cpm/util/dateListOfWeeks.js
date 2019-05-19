function* createWeeks(year) {
    const ONE_DAY = 24 * 3600 * 1000;
    let start = new Date(year, 0, 1),
        end = new Date(year, 11, 31);
    let firstDay = start.getDay() || 7,
        lastDay = end.getDay() || 7;
    let startTime = +start,
        endTime = startTime + (7 - firstDay) * ONE_DAY,
        _endTime = end - (7 - lastDay) * ONE_DAY;
    if (firstDay == 1) { //以当年第一个周一为第一周
        yield [startTime, endTime];
    }
    startTime = endTime + ONE_DAY;
    endTime = endTime + 7 * ONE_DAY;
    while (endTime < _endTime) {
        yield [startTime, endTime];
        startTime = endTime + ONE_DAY;
        endTime = endTime + 7 * ONE_DAY;
    }
    //yield [startTime,+end];
    yield [startTime, endTime]; //最后一周为当年的最后一个周一
}

function formatDig(num) {
    return num > 9 ? '' + num : '0' + num;
}

function formatDate(mill) {
    var y = new Date(mill);
    let raws = [
        y.getFullYear(),
        formatDig(y.getMonth() + 1),
        formatDig(y.getDate()),
        //y.getDay()||7
    ];
    let format = ['-', '-', ''];
    return String.raw({
        raw: raws
    }, ...format);
}

export function getWeekData(year) {
    let index = 1;
    let list = createWeeks(year);
    let weekList = [];
    for (let i of list) {
        let start = i[0],
            end = i[1];
        let weekIndex = formatDig(index++);
        let weekStart = formatDate(start);
        let weekEnd = formatDate(end);
        let weekShortText = "第" + weekIndex + "周 " + weekStart;
        let weekText = "第" + weekIndex + "周 " + weekStart + " ~ " + weekEnd;
        let weekStartDate = start;
        let weekEndDate = end;
        weekList.push({
            weekIndex,
            weekStart,
            weekEnd,
            weekShortText,
            weekText,
            weekStartDate,
            weekEndDate
        });
    }
    return weekList;
}

