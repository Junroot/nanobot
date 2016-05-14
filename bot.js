console.log('The bot is starting');

var Twit = require('twit');

var config = require('./config');
var T = new Twit(config);
//마지막 정규 트윗 시간
var ritt = Date.now();
//마지막 정규 트윗 내용
var riti = 0;

var stream = T.stream('user');

stream.on('tweet', tweetEvent);

function tweetEvent(eventMsg)
{
	var replyto = eventMsg.in_reply_to_screen_name;
	var text = eventMsg.text;
	var from = eventMsg.user.screen_name;
	var newtweet;

	console.log(eventMsg);

	if (text.search("@_nano_bot")!=-1)
	{
		if (text.search("점심")!=-1)
		{
			var lunch = [
			'편의점 도시락',
			'컵라면',
			'알촌',
			'학식',
			'카모메',
			'와와',
			'도스마스'];
			var i = Math.floor(Math.random() * lunch.length);
			newtweet = '@' + from + ' ' +lunch[i] + ' 어떠세요?';
		}
		else if (text.search("저녁")!=-1)
		{
			var dinner = [
			'비야',
			'니뽕내뽕',
			'아비꼬',
			'카모메',
			'돈까스 공장',
			'행운 돈까스',
			'일락'];
			var i = Math.floor(Math.random() * dinner.length);
			newtweet = '@' + from + ' ' +dinner[i] + ' 어떠세요?';
		}
		else
		{
			return;
		}
		var status_str = eventMsg.id_str;

		mention(newtweet,status_str);
	}
}

setInterval(act, 4000);

function act() {
	if (Date.now()-ritt >= 1000*60*60)	iterativetweet();
	
};

function iterativetweet()
{
	var itv = [
	'테스트 입니다!',
	'안녕하세요! 루트님의 나노입니다!',
	'혹시 필요하신거 있으세요?',
	'좀 더 평범한 게 좋다구요!',
	'이 태엽은 절대 제가 로봇이라 있는게 아니에요!!'];
	tweet(itv[riti]);
	riti = riti+1;
	riti = riti%itv.length;
	ritt = Date.now();
}

function tweet(par)
{
	var t = {
		status: par
	}
	console.log("try to tweet \""+par+"\"");
	T.post('statuses/update', t, td);

	function td(err, data, response) {
		if (err) { 
			console.log("tweet error");
		}
	};
};

function mention(par, status_str)
{
	var t = {
		in_reply_to_status_id: status_str,
		status: par
	}
	console.log("try to tweet \""+par+"\"");
	T.post('statuses/update', t, td);

	function td(err, data, response) {
		if (err) { 
			console.log("tweet error");
		}
	};
}