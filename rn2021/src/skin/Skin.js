import {
  appearance,
  age,
  blackhead,
  dark_circle,
  defeat_rank,
  moisture,
  pockmark,
  pore,
  roughness,
  skin_type,
  wrinkle,
  features,
  spot
} from '../models'

const skin = {
  appearance,
  age,
  blackhead,
  dark_circle,
  defeat_rank,
  moisture,
  pockmark,
  pore,
  roughness,
  skin_type,
  wrinkle,
  features,
  spot
};

export const specialKey = '面部特征';

function skinVal(type, name, val) {
  switch (type) {
    case 'features':
      return val > 0.5 ? skin[type][name] : `${skin[type][name]}:无该特征`;
      break;
    case 'age':
    case 'appearance':
      return val + skin[type][name];
      break;
    default:
      return skin[type][name]
      break;
  }
}

function skinValArr(keyWord, type, obj) {
  let arr = [];
  let sex = 1;
  let newObj = {};

  for (let key in obj) {
    console.log("数据类型——————————————————", Object.prototype.toString.call(obj[key]).slice(8, -1))
    if (Object.prototype.toString.call(obj[key]).slice(8, -1) === 'Object') {
      newObj = Object.assign(newObj, obj[key])
    } else {
      newObj[key] = obj[key]
    }
  }

  console.log("新的数据————————————", newObj)
  for (let key in newObj) {

    if ([keyWord] == specialKey) {

      if (key == 'male' || key == 'female') {

        if (sex == 2) {
          arr.push(null);
        } else {
          let val = newObj['male'] > newObj['female'] ? "男性" : '女性';
          arr.push({'性别': val});
          sex = 2;
        }

      } else {
        let newKey = skinVal(type, key, newObj[key])
        arr.push({[newKey]: newObj[key]});
      }

    } else {
      let newKey = skinVal(type, key, newObj[key]);
      arr.push({[newKey]: newObj[key]});
    }

  }

  return arr;
}

/**
 * des:数据处理
 * data：是服务器获取的数据
 * arr：每项是{key,type},其中key是例如显示在UI的文案，比如年龄，type是数据的类型，比如是age
 */
export function skinDataDeal(data, arr) {
  let skinArr = [];
  let key, type;
  for (let i = 0; i < arr.length; i++) {

    key = Object.keys(arr[i])[0];
    type = Object.values(arr[i])[0];

    skinArr = skinArr.concat({[key]: '如下：'});

    if (data[type]) {
      const partArr = skinValArr(key, type, data[type]);
      console.log(partArr)
      skinArr = skinArr.concat(partArr);
    }
  }

  console.log('数据处理：：', skinArr);
  return skinArr;
}

export function getSkinData(url, formData, authorization, callBack) {
  const headers = {
    "Content-Type": "multipart/form-data",
    'Authorization': `Basic ${authorization}`,
    "Connection": "keep-alive",
    "Accept": "application/json"
  };

  console.log(headers);

  fetch(url, {
    method: 'POST',
    headers: headers,
    body: formData
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const keyArr = [
        {"颜值": 'appearance'},
        {'年龄': 'age'},
        {'黑头': 'blackhead'},
        {'黑眼圈': 'dark_circle'},
        {'水分': 'moisture'},
        {'痘痘': 'pockmark'},
        {'毛孔': 'pore'},
        {'粗糙度': 'roughness'},
        {'肤质': 'skin_type'},
        {'皱纹': 'wrinkle'},
        {[specialKey]: 'features'},
        {'斑点': 'spot'},
        {'击败人数': 'defeat_rank'},
      ]
      const arr = skinDataDeal(data, keyArr);
      callBack && callBack(arr);
    })
    .catch((e) => {
      console.log(e);
      callBack && callBack(null);
    });
}

