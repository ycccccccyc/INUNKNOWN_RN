import fetch from './fetch';

const getMaterialList = async (data = {}) => {
  const res = await fetch('/wildapi/material/getMaterialList', data);
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
  getMaterialList
}
