console.log('The bot is starting');

var Twit = require('twit');

var config = require('./config');
var T = new Twit(config);
//마지막 정규 트윗 시간
var ritt = Date.now();
//마지막 정규 트윗 내용
var riti = 0;
//스트림 시작
var stream = T.stream('user');

stream.on('tweet', tweetEvent);

tweet("나노봇v2를 실행합니다!");

function tweetEvent(eventMsg)
{
	var replyto = eventMsg.in_reply_to_screen_name;
	var text = eventMsg.text;
	var from = eventMsg.user.screen_name;
	var newtweet;

	console.log(eventMsg);
	//멘션이 올 경우
	if (text.substr(0,2) != "RT" && text.search("@_nano_bot")!=-1)
	{
		if (text.search("안녕")!=-1)
		{
			var name = eventMsg.user.name.split('@');
			newtweet = '@' + from + ' ' + name[0] + '님 안녕하세요!';
		}
		//랜덤 선택 기능
		else if (text.search("선택")!=-1)
		{
			var select = text.split(' ');
			if (select.length > 2)
			{
				var removelist = ['@_nano_bot','해줘','줘','중','중에','선택','선택해','선택해줘'];
				if (select[1].search('나노야')!=-1)	select.splice(1,1);
				select.splice(select.length-1,1);
				for (var i = 0;i < select.length;++i)
				{
					for (var j = 0;j < removelist.length;++j)
					{
						//removelist 에 있는 단어가 있으면 삭제
						if (select[i]==removelist[j])
						{
							console.log("지운다");
							select.splice(i,1);
							--i;
						}	
					}
				}
				var i = Math.floor(Math.random() * select.length);
				newtweet = '@' + from + ' ' + select[i] + ' 어떠세요?';
			}
			else
			{
				return;
			}
		}
		//점심 선택 기능
		else if (text.search("점심")!=-1)
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
		//저녁 선택 기능
		else if (text.search("저녁")!=-1)
		{
			var dinner = [
			'비야',
			'니뽕내뽕',
			'아비꼬',
			'카모메',
			'돈까스 공장',
			'행운 돈까스',
			'일락',
			'떡볶이'];
			var i = Math.floor(Math.random() * dinner.length);
			newtweet = '@' + from + ' ' +dinner[i] + ' 어떠세요?';
		}
		else if (text.search("♡")!=-1)
		{
			newtweet = '@' + from + ' ><♡';
		}
		else if (text.search("나노야")!=-1)
		{
			newtweet = '@' + from + ' 부르셨어요?';
		}
		else
		{
			writeFile("newdb.txt",from+" : "+text);
			return;
		}
		var status_str = eventMsg.id_str;

		mention(newtweet,status_str);
	}
}
//정규 트윗
setInterval(act, 4000);

function act() {
	if (Date.now()-ritt >= 1000*60*60)	iterativetweet();
	
};

function iterativetweet()
{
	var itv = [
	'안녕하세요! 루트님의 나노입니다!',
	'나노에게는 여러가지 기능이 있어요! 어떤게 있는지는 비밀이랍니다!',
	'오늘 장은 뭘 살까?',
	'어어라 태엽이 빠졌다;;',
	'엄지 발가락에 어째서 1GB USB가... 8ㅅ8',
	'이상한 기능 달지 말아주세요!',
	'혹시 필요하신거 있으세요?',
	'좀 더 평범한 게 좋다구요!',
	'이 태엽은 절대 제가 로봇이라 있는게 아니에요!!',
	'나노는 말을 많이 걸어 줄수록 똑똑해진답니다!'];
	tweet(itv[riti]);
	riti = riti+1;
	riti = riti%itv.length;
	ritt = Date.now();
}
//트윗 함수
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
//멘션 함수
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

function writeFile(name,msg)
{
	var fs = require('fs');
	fs.open('./'+name, 'a+', function(err, fd) {
		if(err) throw err;
		var buf = new Buffer(msg+'\n');
		fs.write(fd, buf, 0, buf.length, null, function(err, written, buffer) {
			if(err) throw err;
			console.log(err, written, buffer);
			fs.close(fd, function() {
		    console.log("The file was saved!"); 
			});
		});
	});
}