import { formateSearch ,selectOption} from '../../util/utils';

const pageData = {};
pageData.columnData = [
    { prop: 'cinemaName', label: '适用影院' },
]

pageData.formateSearchData = formateSearch(pageData.columnData)

export default pageData