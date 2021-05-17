// 预存全局变量
import { Dimensions, Platform } from 'react-native';

global.gStyler = null;

global.gWidth = Dimensions.get('window').width;
global.gHeight = Dimensions.get('window').height;
