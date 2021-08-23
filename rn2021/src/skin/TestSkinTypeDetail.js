/**
 * @name:
 * @description:
 * @author: dragonYellow
 * @time: 2021-08-16 04:35:10
 * */
import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image
} from 'react-native';
import Buffer from 'buffer';
import {getSkinData} from "./Skin";

export default class TestSkinTypeDetail extends React.PureComponent {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      // 设置当前摄像头为后置摄像头
      skinData: []
    };
  }

  componentDidMount() {
    // this.getDate();
  }

  /**
   * image  file或string  是  图片字段，当Content-Type值为application/x-www-form-urlencoded时，
   * 则该值取值url地址；否则参考HTTP协议之multipart/form-data，文件KEY固定为image
   * detect_types  int  是  要进行检测的项目，可以是多个检测项目的detect_type的和（按位或的值）；
   * 例如：单独调用肌肤年龄测试的时候，detect_types值为1，即相应的请求则为：https://api.yimei.ai/v2/api/face/analysis/1；
   * 同时调用肌肤年龄、斑点、肤质三个测试项目时，detect_types值为：1+2+8=11，
   * 即相应的请求则为：https://api.yimei.ai/v2/api/face/analysis/11； 具体数值代表的含义，请参照第二节
   * result_type  int  否  结果类型 0-效果图 1-坐标 2-效果图和坐标 默认0
   */
  getDate() {
    const key = '421cda285420ff31440070b2d2a66db9';
    const id = 'fd6143c2c3964f3e';
    const {uri} = this.props.navigation.state.params;
    const base64Str = `${id}:${key}`;
    const authorization = new Buffer.Buffer(base64Str).toString('base64');

    let formData = new FormData();
    let time = new Date().getTime();
    let file = {uri: uri, type: 'multipart/form-data', name: `${time}.jpg`};
    formData.append("image", file);

    const detect_types = 1;

    const url = `https://api.yimei.ai/v2/api/face/analysis/${detect_types}`;


    getSkinData(url, formData, authorization, (res) => {
      if (res) {
        console.log('最终的数据', res);
        this.setState({
          skinData: [{"年龄": "361 岁"}]
        });
      }
    });

  }

  render() {
    const {time, data, imageUrlPre} = this.props.route.params;
    console.log("渲染数据：", data);

    return (
      <ScrollView style={{backgroundColor: '#FFF'}}>
        <View style={styles.oneData}>
          <Text style={styles.oneDataText}>
            {`用时:${time}`}
          </Text>
        </View>
        {
          data.map((item, index) => {
            if (!item ||
              !Object.values(item)[0] ||
              Object.prototype.toString.call(Object.values(item)[0]).slice(8, -1) == 'Array' ||
              Object.keys(item)[0] == 'undefined'
            ) {
              return null;
            }
            if (Object.values(item)[0].toString().indexOf('.jpg') != -1) {
              return (
                <View key={Object.values(item)[0]+'_'+index}>
                  <Image source={{uri: imageUrlPre + Object.values(item)[0].toString()}}
                         style={{width: 200, height: 240}}/>
                </View>
              )
            }
            return (
              <View style={[styles.oneData]} key={Object.values(item)[0]+'_'+index}>
                <Text
                  style={[styles.oneDataText, {color: Object.values(item)[0].toString().indexOf('如下') != -1 ? "#000" : '#eee000'}]}>
                  {`${Object.keys(item)[0]}:${Object.values(item)[0]}`}
                </Text>
              </View>
            );
          })
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  oneData: {
    height: 50,
    width: '100%',
    paddingLeft: 20,
    justifyContent: 'center',
    backgroundColor: '#fefefe'
  },
  oneDataText: {
    fontSize: 20
  }
});
