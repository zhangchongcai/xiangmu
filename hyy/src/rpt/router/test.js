let array1 = [5, 0, 0, 0, 0, 3, 0, 0, 6, 0, 0, 0, 0, 0, 1];

let array2 = [5, 0, 0, 0, 0, 1, 9, 0, 0, 0, 0, 0, 0, 0, 0];
             [5, 0, 0, 0, 0, 1, 2, 0, 7, 0, 0, 0, 0, 0, 0]

let array3 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const handleColspanData = (array1, array2) => {
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] > 1) {
      let total = 0;
      total = array2.slice(i, i + array1[i]).reduce((total, item) => total + item);
      if (total > array1[i]) {
        if (array2[i + array1[i] - 1] > 1) {
          array2[i + array1[i]] = array2[i + array1[i] - 1] - 1;
          array2[i + array1[i] - 1] = 1;
        }
        if (array2[i + array1[i] - 1] == 0) {
          let index = i + array1[i] - 1;
          if (array2[index] < 1) {
            // array2[i] = array1[i];
            // array2[index] -= array1[i];
            for (let j = index; j >= 0; j--) {
              if (array2[j] > 1) {
                array2[index+1] = array2[j] - (index - j + 1);
                array2[j] = index - j + 1;
                break;
              }
            }
          }
          if (array2[index] > 1) {
            for (let j = index; j > 0; j--) {
              if (array2[j] > 1) {
                array2[i + array1[i]] = array2[j] - (index - j + 1);
                array2[j] = index - j + 1;
                break;
              }
            }
          }
        }
      }
      if (total < array1[i]) {
        if (array2[i] < 1) {
          let index = i;
          let initIndex;
          let count = 0;
          for (let j = index; j >= 0; j--) {
            if (array2[j] > 1) {
              initIndex = j;
              count++;
              break;
            }
          }
          let lastIndex = i + array1[i] - 1;
          for (let j = lastIndex; j >= initIndex; j--) {
            array2[j] = array1[j];
          }
          array2[lastIndex+1] = array2[initIndex] - count;
        }
      }
    }
    if (array1[i] == 1) {
      if (array2[i] > 1) {
        array2[i+1] = array2[i] - 1;
        array2[i] = 1;
        // let index = i;
        // let lastIndex = i + array2[i];
        // for (let j = index; j < lastIndex; j++) {
        //   array2[j] = array1[j];
        // }
      }
    }
  }
}

handleColspanData(array1, array2);
// handleColspanData(array2, array3);