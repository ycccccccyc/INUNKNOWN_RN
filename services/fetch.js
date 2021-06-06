import React, {Component} from 'react';

let interceptors_req = [], interceptors_res = [];
const host = '192.168.1.107';
const serviceport = '3000';

function custom_fetch (input, init = {}) {
  if (!init.method) {
    init.method = 'GET'
  }

  interceptors_req.forEach(interceptors => {
    init = interceptors(init);
  })

  return new Promise((resolve, reject) => {
    const url = 'http://' + host + ':' + serviceport + input;
    fetch(url, init).then(res => {
      interceptors_res.forEach(interceptors => {
        res = interceptors(res);
      })
      return res.json();
    }).then(res => {
      resolve(res);
    })
    .catch(err => {
      reject(err);
    })
  })
}

custom_fetch.interceptors = {
  request: {
    use: (cb) => {
      interceptors_req.push(cb);
    }
  },
  response: {
    use: (cb) => {
      interceptors_res.push(cb);
    }
  }
}

custom_fetch.interceptors.request.use(async (config) => {
  // 处理请求之前的配置
  if (config.method === 'post') {
    if (config.headers['Content-Type'] !== 'multipart/form-data') {
      config.data = {
        ...config.data
      };
    }
  } else if (config.method === 'get') {
    config.params = {
      ...config.params
    };
  }
  return config;
});

custom_fetch.interceptors.response.use((response) => {
  response.status = +response.status;
  if (response.status !== 200) {
    console.log('fetch unknown error');
  }
  return response;
}, (error) => {
  if (!error.response) {
    console.log('fetch unknown error');
  } else {
    const status = error.response.status;
    console.log('Status Code Error: Code = ' + status);
  }
  return {
    code: undefined,
    data: undefined
  }
});

export default custom_fetch;
