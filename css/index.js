var eventCenter = {
	listen: function(type,handler){
		$(document).on(type,handler)
	},
	fire: function(type,data){
		$(document).trigger(type,data);
	}
}

var  footer = {
	isEnding: false,
	isBegining: true,
	isAnimating: false,
	init:function(){
		this.appendData()
		this.bind();
		$(document).ready(function(){
			$('.list:first-child').trigger('click')
		})

	},
    appendData:function(){
    	$.getJSON("//jirenguapi.applinzi.com/fm/getChannels.php").done(function(data){
	    data.channels.forEach(function(item){
	    	var html = `<div class="list" data-channel-id="${item.channel_id}">
						<div class='list-image' 
						style="background-image:url(${item.cover_small});"></div>
						<h3>${item.name}</h3></div>`;
	    	$('.catalog').append($(html));
	    })
	    $('.catalog').css({
    			width:$('.list').outerWidth(true) * (data.channels.length+1)
    		})
	    $('.list:nth-child(5)').trigger('click')
        }).error(function(){
        	console.log("occured an error")
        })
    },
    bind:function(){
    	var _this = this;
    	$('.icon-next1').on('click',function(){
    		if(_this.isAnimating){ return }
    		var listWidth = $('.list').outerWidth(true);
    	    console.log(listWidth)
    		var num = Math.floor($('.box').width()/listWidth);
    		if(-parseFloat($('.catalog').css('left')) + num * listWidth > $('.catalog').width()){
    			_this.isEnding = true;
    		} 
    		if(!_this.isEnding){
    		_this.isAnimating = true;
    		$('.catalog').animate({
    			left:'-='+num*listWidth
    		},function(){
    			_this.isAnimating = false;
    			_this.isBegining = false;
    		});
    		
    	}
    	});
    	$('.icon-previous').on('click',function(){
    		if(_this.isAnimating){ return }   		
    		if(parseFloat($('.catalog').css('left')) >=0){
    			_this.isBegining = true;
    		} 
    		var listWidth = $('.list').outerWidth(true)
    		var num = Math.floor($('.box').width()/listWidth);
    		if(!_this.isBegining){
    		_this.isAnimating = true;
    		$('.catalog').animate({
    			left:'+='+ num*listWidth
    		},function(){
    			_this.isAnimating = false;
    			_this.isEnding = false;
    		})
    	}
    	}),
    	$('.catalog').on('click','.list',function(){

    		var _this = this;
    		$(this).addClass('active')
    			   .siblings().removeClass('active');
    		eventCenter.fire("send-channel",{
    			id: $(_this).attr('data-channel-id'),
    			name:$(_this).find('h3').text()
    		})

    	})

    }
}
footer.init();
var app = {
	init:function(){
		this.bind()
		this.audio = new Audio();
		this.audio.autoplay = true;
		this.audio.onplay = function(){
			app.timer = setInterval(app.setDetail,1000)
			$('.icon-play').addClass('hide');
			$('.icon-pause').removeClass('hide')
		}
		this.audio.onpause = function(){
			clearInterval(app.setDetail,1000)
			$('.icon-pause').addClass('hide');
			$('.icon-play').removeClass('hide');
			clearInterval(app.timer)
		}
		this.audio.oncanplay = function(){
			var _this = this;			
			clearInterval(app.timer)
			app.timer = setInterval(app.setDetail,1000)
		}

	},
	bind:function(){
		var _this = this;
		eventCenter.listen('send-channel',function(e,channel){
			$('.cata').text(channel.name);
			_this.id = channel.id;
			_this.loadMusic();
		})
		$('.icon-play').on('click',()=>_this.audio.play())
		$('.icon-pause').on('click',()=>_this.audio.pause())
		$('.icon-next').on('click',function(){
			app.loadMusic();
			app.loadLyric();
		})
	},
	loadMusic:function(){
		clearInterval(app.timer)
		var _this = this;
		$.getJSON('//jirenguapi.applinzi.com/fm/getSong.php',{channel:this.id})
		 .done(function(res){
		 	var song = res.song[0];
		 	_this.sid = song.sid;
		 	if(song.title === null){
		 		app.loadMusic();
		 		return
		 	}
		 	app.audio.src = song.url;
		 	$('.aside').css("background-image",`url("${song.picture}")`);
		 	$('.back').css("background-image",`url("${song.picture}")`);
		 	$('.player h1').text(song.title);
		 	$('.detail').text(song.artist);
		 	app.loadLyric();

		 })

	},
	loadLyric:function(){
		var _this = this;
		$.getJSON('//jirenguapi.applinzi.com/fm/getLyric.php',{sid:_this.sid})
		 .done(function(obj){
		 	var lyrics = obj.lyric;
		 	var lyObj = {};
		 	lyricsArr = lyrics.split('\n');
		 	lyricsArr.forEach(function(item){
		 		var time = item.match(/\d{2}:\d{2}/g);
		 	    var text = item.replace(/\[.*\]/g,"");
		 	    lyObj[time] = text;
		 	 _this.lyricObj = lyObj;
		 	})
		 })
		 .error(function(){
		 	console.log('error')
		 })
	},
	setDetail:function(){
		var audio = app.audio;
		var time = Math.floor(audio.duration-audio.currentTime);
	    var seconds = (time%60)<10?"0"+time%60:time%60;
	    var text = `0${Math.floor(time/60)}:${seconds}`;
	    var realMinute = "0" + Math.floor(audio.currentTime/60);
	    var realSeconds = Math.floor(audio.currentTime%60);
	    realSeconds = realSeconds<10?"0"+realSeconds:realSeconds;
	    var realTime = realMinute + ':' + realSeconds;
		$('.time').text(text);
		$('.lyrics').text(app.lyricObj[realTime])
		$('.progressbar').width($('.playbar').width()*(audio.currentTime/audio.duration))
		}
}
app.init();













