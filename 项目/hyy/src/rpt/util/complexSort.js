//根据数组中对象的属性值进行升排序
export const ascCompare = (property) => {
    return  (object1, object2) => {
        let value1 = object1[property];
        let value2 = object2[property];
        if (value1 < value2) {
            return -1;
        } else if (value1 > value2) {
            return 1;
        } else {
            return 0;
        }
    };
};

//根据数组中对象的属性值进行降排序
export const descCompare = (property) => {
    return (object1, object2) => {
        let value1 = object1[property];
        let value2 = object2[property];
        if (value1 < value2) {
            return 1;
        } else if (value1 > value2) {
            return -1;
        } else {
            return 0;
        }
    };
};
