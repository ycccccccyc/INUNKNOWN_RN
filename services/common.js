// 一些零散的个人信息

import fetch from './fetch';

const getBaseUserInfo = async (data = {}) => {
  const res = await fetch('/myBaseInfo', data);
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
  getBaseUserInfo
}
