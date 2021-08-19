const features = {
  '5_o_clock_shadow': '胡渣',
  arched_eyebrows: '柳叶眉',
  attractive: '有魅力',
  bags_under_eyes: '眼袋',
  bald: '秃顶',
  bangs: '刘海',
  big_lips: '大嘴唇',
  big_nose: '大鼻子',
  black_hair: '黑色的头发',
  blond_hair: '金色的头发',
  blurry: '睡眼惺松',
  brown_hair: '棕色的头发',
  bushy_eyebrows: '浓密的眉毛',
  chubby: '圆胖',
  double_chin: '双下巴',
  eyeglasses: '眼镜',
  goatee: '山羊胡子',
  gray_hair: '灰色的头发',
  heavy_makeup: '浓妆',
  high_cheekbones: '颧骨',
  male: '男性',
  female: '女性',
  mouth_slightly_open: '半张着嘴',
  mustache: '胡子',
  narrow_eyes: '小眼睛',
  no_beard: '没有胡子',
  oval_face: '瓜子脸',
  pale_skin: '白皮肤',
  pointy_nose: '尖鼻子',
  receding_hairline: '发际线后移',
  rosy_cheeks: '红润的双颊',
  sideburns: '连鬓胡子',
  smiling: '微笑',
  straight_hair: '直发',
  wavy_hair: '卷发',
  wearing_earrings: '戴着耳环',
  wearing_hat: '带着帽子',
  wearing_lipstick: '擦口红',
  wearing_necklace: '戴着项链',
  wearing_necktie: '戴着领带',
  young: '年轻'
};

const age = {
  result: ' 岁'
};

const appearance = {
  score: ' 分'
};

const skin = {
  age,
  features,
  appearance
};

export const specialKey = '面部特征';

function skinVal(type, name, val) {
  switch (type) {
    case 'features':
      return val > 0.5 ? skin[type][name] : `${ skin[type][name] }:无该特征`;
      break;
    case 'age':
    case 'appearance':
      return val + skin[type][name];
      break;
    default:
      break;
  }
}

function skinValArr(keyWord, type, obj) {
  let arr = [];
  let sex = 1;

  for (let key in obj) {

    if ([keyWord] == specialKey) {

      if (key == 'male' || key == 'female') {

        if (sex == 2) {
          arr.push(null);
        } else {
          let val = obj['male'] > obj['female'] ? "男性" : '女性';
          arr.push({ '性别': val });
          sex = 2;
        }

      } else {
        arr.push({ [key]: skinVal(type, key, obj[key]) });
      }

    } else {
      arr.push({ [keyWord]: skinVal(type, key, obj[key]) });
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

    if (data[type]) {
      const partArr = skinValArr(key, type, data[type]);
      skinArr = skinArr.concat(partArr);
    }
  }

  console.log('数据处理：：', skinArr);
  return skinArr;
}

export function getSkinData(url, formData, authorization, callBack) {
  const headers = {
    "Content-Type": "multipart/form-data",
    'Authorization': `Basic ${ authorization }`,
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
      const arr = skinDataDeal(data, [{ '年龄': 'age' }, { "颜值": 'appearance' }, { [specialKey]: 'features' }]);
      callBack && callBack(arr);
    })
    .catch((e) => {
      console.log(e);
      callBack && callBack(null);
    });
}

