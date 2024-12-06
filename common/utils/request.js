const BASE_URL = 'http://api.bookhome.com'; 
const request = (url, options) => 
{
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`,
      method: options.method || 'POST',
      data: options.data || {},
      success: (res) => {
        if (res.statusCode === 200) {
          // 响应拦截器：全局处理成功逻辑
          if(res.data.status){
            resolve(res.data);
          }else{
            wx.showToast({
              title: res.data.msg || '请求错误',
              icon: 'none'
            });
            reject(res);
          }
        } else {
          wx.showToast({
            title: res.data.message || '请求错误',
            icon: 'none'
          });
          reject(res);
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络异常，请稍后再试',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
};

// 封装GET方法
const get = (url, data = {}) => {
  return request(url, {
    method: 'GET',
    data
  });
};

// 封装POST方法
const post = (url, data = {}) => {
  return request(url, {
    method: 'POST',
    data
  });
};

// 导出方法
module.exports = {
  request,
  get,
  post
};