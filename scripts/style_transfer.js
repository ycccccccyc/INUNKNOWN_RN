import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

const STYLENET_URL =
  'https://cdn.jsdelivr.net/gh/ycccccccyc/INUNKNOWN_RN@2.0/assets/models/saved_model_style_js/model.json';
const TRANSFORMNET_URL =
  'https://cdn.jsdelivr.net/gh/ycccccccyc/INUNKNOWN_RN@2.0/assets/models/saved_model_transformer_separable_js/model.json';
const HIGHSTYLENET_URL = 
  'https://cdn.jsdelivr.net/gh/ycccccccyc/INUNKNOWN_RN@2.0/assets/models/saved_model_style_inception_js/model.json';
const HIGHTRANSFORMNET_URL =
  'https://cdn.jsdelivr.net/gh/ycccccccyc/INUNKNOWN_RN@2.0/assets/models/saved_model_transformer_js/model.json';

export class StyleTranfer {
  constructor(props) {
    this.styleNet = null;
    this.transformNet = null;
    this.styleNetNormal = null;
    this.transformNetNormal = null;
    this.styleNetHigh = null;
    this.transformNetHigh = null;
    this.selection = [1, 1];
  }

  async init() {
    console.log('initing...');
    await Promise.all([this.loadStyleModel(), this.loadTransformerModel()]);
    console.log('basic models loaded.');
    this.useModels({styleNet: 1, transformNet: 1});
    this.loadStyleModelHigh();
    this.loadTransformerModelHigh();
    await this.warmup();
  }

  useModels(obj) {
    console.log('切换模型', obj)
    const sType = obj.styleNet || null;
    const tType = obj.transformNet || null;
    if (sType) {
      this.styleNet = sType > 1 ? this.styleNetHigh : this.styleNetNormal;
      this.selection[0] = sType;
      console.log('当前使用styleNet：' + sType)
    }
    if (tType) {
      this.transformNet = tType > 1 ? this.transformNetHigh : this.transformNetNormal;
      this.selection[1] = tType;
      console.log('当前使用transformNet：' + tType)
    }
  }

  async loadStyleModelHigh() {
    if (this.styleNetHigh == null) {
      console.log('loading high quality stylenet...')
      this.styleNetHigh =
        await tf.loadGraphModel(HIGHSTYLENET_URL)
          .catch((err) => {console.log(err)})
      console.log('high quality stylenet loaded');
    }
  }

  async loadStyleModel() {
    if (this.styleNetNormal == null) {
      console.log('loading stylenet...')
      this.styleNetNormal = 
        await tf.loadGraphModel(STYLENET_URL)
        .catch((err) => {console.log(err)})
      console.log('stylenet loaded');
    }
  }

  async loadTransformerModelHigh() {
    if (this.transformNetHigh == null) {
      console.log('loading high quality transformnet...')
      this.transformNetHigh = 
        await tf.loadGraphModel(HIGHTRANSFORMNET_URL)
        .catch((err) => {console.log(err)})
      console.log('high quality transform net loaded');
    }
  }

  async loadTransformerModel() {
    if (this.transformNetNormal == null) {
      console.log('loading transformnet...')
      this.transformNetNormal = 
        await tf.loadGraphModel(TRANSFORMNET_URL)
        .catch((err) => {console.log(err)})
      console.log('transform net loaded');
    }
  }

  async warmup() {
    // Also warmup
    // let input = tf.randomNormal([320, 240, 3]);
    // const res = await this.stylize(input, input);
    // await res.data();
    // tf.dispose([input, res]);
  }

  /**
   * This function returns style bottleneck features for
   * the given image.
   *
   * @param style Style image to get 100D bottleneck features for
  */
  async predictStyleParameters(styleImage) {
    return tf.tidy(() => {
      if (this.styleNet == null) {
        throw new Error('Stylenet not loaded');
      }
      return this.styleNet.predict(
          styleImage.toFloat().div(tf.scalar(255)).expandDims());
    });
  }

  /**
   * This function stylizes the content image given the bottleneck
   * features. It returns a tf.Tensor3D containing the stylized image.
   *
   * @param content Content image to stylize
   * @param bottleneck Bottleneck features for the style to use
   */
  async produceStylized(contentImage, bottleneck) {
    return tf.tidy(() => {
      if (this.transformNet == null) {
        throw new Error('Transformnet not loaded');
      }
      const input = contentImage.toFloat().div(tf.scalar(255)).expandDims();
      const image = this.transformNet.predict([input, bottleneck]);
      return image.mul(255).squeeze();
    });
  }

  async stylize(styleImage, contentImage, styleRatio) {
    const start = Date.now();
    console.log(styleImage.shape, contentImage.shape);
    let styleRepresentation = await this.predictStyleParameters(styleImage);

    // 程度化处理
    if (styleRatio && styleRatio !== 1.0) {
      await tf.nextFrame();
      const identityBottleneck = await tf.tidy(() => {
        return this.styleNet.predict(contentImage.toFloat().div(tf.scalar(255)).expandDims());
      })
      const styleBottleneck = styleRepresentation;
      styleRepresentation = await tf.tidy(() => {
        const styleBottleneckScaled = styleBottleneck.mul(tf.scalar(styleRatio));
        console.log(typeof(styleBottleneckScaled))
        const identityBottleneckScaled = identityBottleneck.mul(tf.scalar(1.0-styleRatio));
        return styleBottleneckScaled.add(identityBottleneckScaled)
      })
      styleBottleneck.dispose();
      identityBottleneck.dispose();
    }

    await tf.nextFrame();
    const stylized = await this.produceStylized(contentImage, styleRepresentation);
    tf.dispose([styleRepresentation]);
    const end = Date.now();
    console.log('stylization scheduled', end - start);
    return stylized;
  }


  async combine(styleList, contentImage, ratioList) {
    const start = Date.now();

    // 程度化处理
    const identityBottleneck = await tf.tidy(() => {
      return this.styleNet.predict(contentImage.toFloat().div(tf.scalar(255)).expandDims());
    })

    const ratioSum = ratioList.reduce((prev, next, index, ratioList) => {
      return prev + next;
    })
    let tempSum = 0;
    let bottleneckList = [];
    let castRatioList = [];
    for (let i = 0; i < ratioList.length; i++) {
      const bottleneck = await this.predictStyleParameters(styleList[i]);
      bottleneckList.push(bottleneck);

      if (i === ratioList.length - 1) {
        castRatioList[i] = 1 - tempSum;
      } else {
        const ratio = parseFloat((ratioList[i] / ratioSum * 0.8).toFixed(1));
        castRatioList[i] = ratio
        tempSum += ratio;
      }
    }

    console.log('比风格例：' + castRatioList);
    let combinedBottleneck = identityBottleneck.mul(tf.scalar(0.2));
    for (let i = 0; i < bottleneckList.length; i++) {
      const scaledBottleneck = bottleneckList[i].mul(tf.scalar(castRatioList[i]));
      combinedBottleneck.add(scaledBottleneck);
    }

    // const combinedStyle = await tf.tidy(() => {
    //   return combinedBottleneck
    // })
    const stylized = await this.produceStylized(contentImage, combinedBottleneck);
    tf.dispose([combinedBottleneck, combinedBottleneck, bottleneckList]);
    const end = Date.now();
    console.log('stylization combining scheduled', end - start);
    return stylized;
  }
}
