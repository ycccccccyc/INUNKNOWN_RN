// 预存全局变量
import { Dimensions, Platform } from 'react-native';

global.gStyler = null;

global.gWidth = Dimensions.get('window').width;
global.gHeight = Dimensions.get('window').height;

global.gContentIfResize = false;
global.gContentResizeRatio = '1.00';     // 内容图缩小
global.gCompress = 0.75;            // 压缩率
