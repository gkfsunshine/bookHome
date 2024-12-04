const request = (url, options) => {
  return new Promise((resolve, reject) => {
    // 请求拦截器：处理请求前逻辑
    const token = wx.getStorageSync('token');
    if (!token && url !== '/user/login') {
      wx.showToast({ title: '请先登录', icon: 'none' });
      wx.redirectTo({ url: '/pages/login/index' });
      reject({ message: '未登录' });
      return;
    }

    wx.request({
      url: `${BASE_URL}${url}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        Authorization: token || ''
      },
      success: (res) => {
        if (res.statusCode === 200) {
          // 响应拦截器：全局处理成功逻辑
          resolve(res.data);
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
          title: '网络错误',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
};

