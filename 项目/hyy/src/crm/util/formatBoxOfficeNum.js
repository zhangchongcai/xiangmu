export default function formatBoxOfficeNum(number) {
    /* 格式化票房数据
     * 1.保留两位小数  2.千分位分割   3.票房过亿单位用亿表示   4.票房没过亿单位用万表示 */
    if (number == null || number == 0 || number == '') return "-";
    if (number >= 100000000) {
        return `${(number / 100000000)
                    .toFixed(0)
                    .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")} 亿`;
    } else {
        return `${(number / 10000)
                    .toFixed(0)
                    .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")} 万`;
    }
}