$(function(){
    $.get("./json/song.json").then(function(res){
        res.forEach(function(item){
            var li = `<li>
                <a href="./player.html?id=${item.id}">
                <span class="song">${item.song}</span>
                <span class="author">${item.artist} -</span>
                <span class="record">${item.album}</span>
                <svg class="icon" aria-hidden="true">
                    <use xlink: href="#icon-play"></use>
                </svg>
                </a >
                </li>`
            $('.last ul').append($(li));
        })
       
    },function(){
        console.log('error')
    })
})