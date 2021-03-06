// node.js

const app = getApp();
const common = require("../../../utils/template.js")

Page({

  data: {
    taid: '',
    arrdetail: '',
    topic: '',
    inHidden: 'none',
    uname: '',
    showConfirmBar: false,
    focusss: false,
  },

  onLoad: function(options) {
    let taid = options.taid;
    let uname = wx.getStorageSync('uname');
    let that = this;
    wx.request({
      url: app.globalData.backAddress + app.globalData.backPage,
      data: {
        do: "FindTopicDe",
        taid: taid,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        let topicdet = res.data.topicdet;
        let topic = res.data.topic;
        that.setData({
          arrdetail: topicdet,
          topic: topic,
          taid: taid,
          uname: uname,
        })
      }
    })
  },

  bindFormSubmit: common.throttle(function(e) {
    let detail = e.detail.value.text;
    let uid = wx.getStorageSync('uid');
    let taid = this.data.taid;
    let that = this;
    if (detail == "") {
      wx.showToast({
        title: '没有任何输入',
        icon: 'none',
        duration: 1000,
      })
      return;
    }
    wx.request({
      url: app.globalData.backAddress + app.globalData.backPage,
      data: {
        do: "FollowTalk",
        taid: taid,
        uid: uid,
        detail: detail,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.talk == "Ok") {
          wx.showToast({
            title: 'Follow成功',
            icon: 'success',
            duration: 1000,
            success: function() {
              setTimeout(function() {
                wx.redirectTo({
                  url: '../note/note?taid=' + taid,
                })
              }, 1000)
            }
          })
        } else {
          wx.showToast({
            title: 'Follow失败,请咨询开发者',
            icon: 'none',
            duration: 1000,
          })
        }
      }
    })
  },1000),

  wantIn: function() {
    this.setData({
      inHidden: 'black',
      focusss: true,
    })
  },

  outIn: function() {
    this.setData({
      inHidden: 'none',
      focusss: false,
    })
  },
})