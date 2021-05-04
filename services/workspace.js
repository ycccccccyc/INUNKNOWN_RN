import fetch from './fetch';

const getStyleList = async (data = {}) => {
  const res = await fetch('/wildapi/workspace/styleList', data);
  if (+res.code === 0) {
    return res;
  } else {
    return {
      code: res.code,
      msg: res.msg,
      data: {}
    }
  }
};

export default {
  getStyleList
}
