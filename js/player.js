$(function(){
	const id = location.search.match(/id=(\d*)/)[1];
	$.get('./json/song.json').done(function (res) {
		const matching = res.filter(function (item){
			return (item.id === id)
		})[0];
		const song = new Audio(matching.src)
		$('.record').attr('src',matching.img);
		$('.bg').css({
			"background-image":"url("+matching.img+")"
		})
		
		song.play();
		song.autoplay = true;
		song.isPlayed = true;
		$('.discs').on("click", function () {
			if (song.isPlayed) {
				song.pause();
				song.isPlayed = false;
				$('.lighter').css({
					animationPlayState: "paused"
				})
				$('.record').css({
					animationPlayState: "paused"
				})
				$('.icon').addClass('active');
			} else {
				song.play();
				song.isPlayed = true;
				$('.lighter').css({
					animationPlayState: "running"
				})
				$('.record').css({
					animationPlayState: "running"
				})
				$('.icon').removeClass('active')
			}
		})
		function addLyric(obj){
			let lyric = obj.lyric.split('↵');
			let reg = /\[(\d\d:\d\d).+\](.+)/;
			lyric = lyric.map(function (item) {
				let matches = item.match(reg);
				if (matches) {
					return { time: matches[1], lyric: matches[2] }
				}
			})
			let p = '';
			lyric.forEach(function (item) {
				if (!item) return;
				p += `<p data-time=${item.time}>${item.lyric}</p>`
			})
			$('.lyrics').append(p)
		}
		addLyric(matching);
		function addzero(num){
			return num<10 ? "0" + num  : num + ""
		}
		function moveLrc(){
			const time = ~~song.currentTime;
			const realTime = addzero(~~(time/60)) + ":" + addzero(time%60);
			const plists = $('.lyrics p')
			for(var i=0;i<plists.length;i++){
				let dataTime = plists.eq(i).attr('data-time');
				let nextdataTime = plists.eq(i+1).attr('data-time')
				if(nextdataTime&&(realTime>=dataTime&&realTime<nextdataTime)){
					plists.css({
						transform: "translateY(-"+5*(i-1)+"vh)"
					})
					plists.css({
						color: "#aaa"
					})
					plists.eq(i).css({
						color: "#fff"
					})
					break;
				}
			}
		}
		setInterval(moveLrc,1000)
	})
	
	
})
