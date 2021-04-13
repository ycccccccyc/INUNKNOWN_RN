import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

const STYLENET_URL =
  'https://cdn.jsdelivr.net/gh/ycccccccyc/CDN@1.1/saved_model_style_js/model.json';
const TRANSFORMNET_URL =
  'https://cdn.jsdelivr.net/gh/ycccccccyc/CDN@1.1/saved_model_transformer_separable_js/model.json';

export class StyleTranfer {
  constructor() {
    this.styleNet = null;
    this.transformNet = null;
  }

  async init() {
    console.log('initing...');
    await Promise.all([this.loadStyleModel(), this.loadTransformerModel()]);
    console.log('models loaded.');
    await this.warmup();
  }

  async loadStyleModel() {
    if (this.styleNet == null) {
      console.log('loading stylenet...')
      this.styleNet = 
        await tf.loadGraphModel(STYLENET_URL)
        .catch((err) => {console.log(err)})
      console.log('stylenet loaded');
    }
  }

  async loadTransformerModel() {
    if (this.transformNet == null) {
      console.log('loading transformnet...')
      this.transformNet = 
        await tf.loadGraphModel(TRANSFORMNET_URL)
        .catch((err) => {console.log(err)})
      console.log('transform loaded');
    }
  }

  async warmup() {
    // Also warmup
    let input = tf.randomNormal([320, 240, 3]);
    const res = this.stylize(input, input);
    await res.data();
    tf.dispose([input, res]);
  }

  /**
   * This function returns style bottleneck features for
   * the given image.
   *
   * @param style Style image to get 100D bottleneck features for
  */
  predictStyleParameters(styleImage) {
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
  produceStylized(contentImage, bottleneck) {
    return tf.tidy(() => {
      if (this.transformNet == null) {
        throw new Error('Transformnet not loaded');
      }
      const input = contentImage.toFloat().div(tf.scalar(255)).expandDims();
      const image = this.transformNet.predict([input, bottleneck]);
      return image.mul(255).squeeze();
    });
  }

  stylize(styleImage, contentImage) {
    const start = Date.now();
    console.log(styleImage.shape, contentImage.shape);
    const styleRepresentation = this.predictStyleParameters(styleImage);
    const stylized = this.produceStylized(contentImage, styleRepresentation);
    tf.dispose([styleRepresentation]);
    const end = Date.now();
    console.log('stylization scheduled', end - start);
    return stylized;
  }
}
