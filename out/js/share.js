// JavaScript Document
var shareData = {
	title: '飞利浦恭贺新春，让你好运连连',
	desc: '',
	link: 'http://www.philips-campaign.com/cny2016/out/index.html',
	imgUrl: 'http://www.philips-campaign.com/cny2016/img/one/kk.jpg',
	success: function (res) {
		//_hmt.push(['_trackPageview', '/share_end']);
		//location.href="shareEnd.html";
	},
	cancel: function (res) {

	},
	fail: function (res) {

	}
}
var shareData2 = {
	title: "飞利浦恭贺新春，让你好运连连",
	desc: shareData.desc,
	link: 'http://www.philips-campaign.com/cny2016/out/index.html',
	imgUrl: 'http://www.philips-campaign.com/cny2016/img/one/kk.jpg',
	success: shareData.success,
	cancel: shareData.cancel,
	fail: shareData.fail
}

$.ajax({
	url:"http://uniqueevents.sinaapp.com/wx/getJsAPIA.php?callback=?",
	dataType:"jsonp",
	data:{
		url:location.href
	}
}).done(function(data) {
	//_hmt.push(['_trackPageview', '/share_end']);
	if(data) {
		var res = data.result;
		if(res == 1) {
			  wx.config({
				debug: false,
				appId: data.appId,
				timestamp: data.timestamp,
				nonceStr: data.nonceStr,
				signature: data.signature,
				jsApiList: [
					'checkJsApi',
					'onMenuShareTimeline',
					'onMenuShareAppMessage',
					'onMenuShareQQ',
					'onMenuShareWeibo'
				]
			});

			wx.ready(function () {
				wx.onMenuShareAppMessage(shareData);
				wx.onMenuShareTimeline(shareData2);
			});
		} else {
			//self.showError(data.msg);
		}
	}
}).always(function() {
	
});