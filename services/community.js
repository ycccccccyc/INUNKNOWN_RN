// 一些零散的个人信息

import fetch from './fetch';

const getBaseUserInfo = async (data = {}) => {
  const res = await fetch('/wildapi/community/myBaseInfo', data);
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

const getCommunityImageList = async (data = {}) => {
  const res = await fetch('/wildapi/community/communityImageList', data);
  if (+res.code === 0) {
    return res;
  } else {
    return {
      code: res.code,
      msg: res.msg,
      data: {}
    }
  }
}

export default {
  getBaseUserInfo,
  getCommunityImageList
}
