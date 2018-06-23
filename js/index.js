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
$(function(){
    $('.tab').on('click',function(e){
        let index = $(e.target).index();
        console.log(e.target)
        e.preventDefault();
        $(e.target).addClass('active')
                   .siblings().removeClass('active')
        $('.sorts').trigger('change',index)
    })
    $('.sorts').on('change',function(e,index){
        if(index===1 && !($('.sorts li').eq(1).attr('data-confirm')==="yes")){
            $.get('./json/song.json').then(function(res){
                res.forEach(function(item){
                    let li = `<li>
                <a href="./player.html?id=${item.id}">
                <span class="song">${item.song}</span>
                <span class="author">${item.artist} -</span>
                <span class="record">${item.album}</span>
                <svg class="icon" aria-hidden="true">
                    <use xlink: href="#icon-play"></use>
                </svg>
                </a >
                </li>`
                    $('.hot ul').append(li)
                })
                
                
                $('.sorts li').eq(1).attr('data-confirm',"yes")
            })
        }
        $('.sorts').children().eq(index).css({display:"block"})
                              .siblings().css({display:'none'})
    })
})
var timer;
$(function(){
    function search(song){
        return new Promise((resolve,reject) => {
            $.get('./json/song.json').then(function(res){
                let result = res.filter(function(item){
                    return item.song.toLowerCase().indexOf(song)>-1 ? true : false
                })
                resolve(result);
            })
        })
    }
    $('input').on('input',function(){
        var text = $('input').val();
        if(text){
        if(timer){clearTimeout(timer)}
        timer = setTimeout(function(){
            $('.search .show a').remove();
            $('.show').text('');
            search(text).then(function(result){
                if(!result[0]){$('.show').append($("<p>没有符合查询的结果</p>"));return;}
                $('.show').text('')
                result.forEach(function(item){
                    const p = `<a href="./player.html?id=${item.id}">
                               <span class="song">${item.song}</span>
                               </a>`;
                    console.log(p)
                    $('.search .show').append($(p))
                })
            })
        },500)
        }else {
            $('.show').text('');
            $('.search .show p').remove();
        }
    })
})
