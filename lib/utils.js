const decryptData = (appId, sessionKey, encryptedData, iv) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://api.nagu.cc/wxapp/decrypt',
      method: 'POST',
      success: (res) => {
        console.log(res);
      }
    });
  });
}

module.exports = {
  decryptData,
};