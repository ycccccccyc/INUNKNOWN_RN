import fetch from './fetch';

const getMyWorksList = async (data = {}) => {
  const res = await fetch('/wildapi/myPage/getMyWorksList', data);
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
  getMyWorksList
}
