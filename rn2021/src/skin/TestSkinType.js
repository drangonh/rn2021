/**
 * @name:
 * @description:
 * @author: dragonYellow
 * @time: 2021-08-16 04:26:13
 * */
import * as React from 'react';
import {
  TouchableHighlight,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Buffer from "buffer";
import {getSkinData} from "./Skin";
import Spinner from 'react-native-spinkit'

export default class TestSkinType extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 设置当前摄像头为后置摄像头
      cameraType: RNCamera.Constants.Type.back,
      isVisible: false
    };
  }


  // 扫描二维码
  _onBarCodeRead(e) {
    // data: string;
    // rawData?: string;
    // type: keyof BarCodeType;
    // bounds:
    // For iOS use `{ origin: Point<string>, size: Size<string> }`
    // For Android use `{ width: number, height: number, origin: Array<Point<string>> }`
    console.log(e);
  }

  componentDidMount() {
    fetch('https://api.wrdan.com/hitokoto')
      .then(res => res.json())
      .then(data => {
        console.log('数据：：：', data);
      })
      .catch(e => {
        console.log('数据', e);
      })
    ;
  }

  // 切换摄像头方向     undefined is not an object (evaluating 'state.cameraType')
  _switchCamera() {
    this.setState({
      cameraType: (this.state.cameraType === RNCamera.Constants.Type.back) ?
        RNCamera.Constants.Type.front : RNCamera.Constants.Type.back
    });
  }

  // 拍摄照片
  _takePicture() {
    this.refs.camera.takePictureAsync().then((response) => {
      console.log("response.uri:", response);
      this.setState({
        isVisible: true
      }, () => this.getDate(response.uri));
    }).catch(((error) => {
      console.log(`error:${error}`);
    }));
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
  getDate(uri) {
    const key = '421cda285420ff31440070b2d2a66db9';
    const id = 'fd6143c2c3964f3e';
    const base64Str = `${id}:${key}`;
    const authorization = new Buffer.Buffer(base64Str).toString('base64');

    let formData = new FormData();
    let time = new Date().getTime();
    let file = {uri: uri, type: 'multipart/form-data', name: `${time}.jpg`};
    formData.append("image", file);

    const detect_types = 1;

    const url = `https://api.yimei.ai/v2/api/face/analysis/${detect_types}`;

    let t = new Date().getTime();
    getSkinData(url, formData, authorization, (res) => {
      this.setState({
        isVisible: false
      });
      if (res) {
        let t1 = new Date().getTime();

        alert(JSON.stringify(res))
        // this.props.navigation.navigate('TestSkinTypeDetail', {
        //   uri: uri,
        //   data: res,
        //   time: (t1 - t)
        // });
      }
    });

    // console.log("______111", this);

  }

  render() {
    const {isVisible} = this.state;
    return (
      <RNCamera
        ref="camera"
        style={styles.container}
        onBarCodeRead={this._onBarCodeRead.bind(this)}
        type={this.state.cameraType}
      >
        <Spinner style={styles.spinner} isVisible={isVisible} size={100} type={'Circle'} color={"#FFFFFF"}/>

        <View style={styles.btnContainer}>
          <TouchableHighlight
            disabled={isVisible}
            style={styles.btn}
            onPress={this._switchCamera.bind(this)}>
            <Text style={styles.switch}>切换</Text>
          </TouchableHighlight>

          <TouchableHighlight
            disabled={isVisible}
            style={styles.btn}
            onPress={this._takePicture.bind(this)}>
            <Text style={styles.picture}>拍照</Text>
          </TouchableHighlight>
        </View>

      </RNCamera>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'relative'
  },
  btnContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  btn: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  switch: {
    textAlign: 'center',
    fontSize: 20,
    color: 'red'
  },
  picture: {
    textAlign: 'center',
    fontSize: 20,
    color: 'red'
  },
  spinner: {
    marginBottom: 0,
  }
});
