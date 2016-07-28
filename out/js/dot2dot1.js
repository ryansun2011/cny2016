/*
 |--------------------------------------------------------------------------
 | dot2dot.js
 |--------------------------------------------------------------------------
 |
 | 连连看 version1
 |  TODO
 |     如果连接成功需要连线（基本采用遮罩加上canvas实现）
 |     边缘可消除（最外层加一层空白包）
 | @author leeir
 | @date 20151208
 */
window.events = window.events || {};

window.events.touch = !!("ontouchstart" in document);
window.events.click = window.events.touch ? "touchstart" : "click";
window.events.eventBegan = window.events.touch ? "touchstart" : "mousedown";
window.events.eventMoved = window.events.touch ? "touchmove" : "mousemove";
window.events.eventEnded = window.events.touch ? "touchend" : "mouseup";
var timer11 = null;
  var overGame =0;
$.extend({
    utils : {
        'random' : function(start, offset){
            return Math.round(Math.random() * offset) + start;
        },
        //数组去重
        'unique' : function(array) {
            var len = array.length;
            for(var i = 0; i <= len; i++) {
                for(var j = 0; j <= len; j++) {
                    if (i !== j && array[i] == array[j]) {
                        delete array[j];
                    }
                }
            }
            return array;
        },

    }
});

!(function(){
    //depend jquery lib
    $(function(){
            //游戏的全局变量
            var count = 0, //分数
                origin = '', //起始元素的位置
                config = null,
                config_b = null,
                time = 0,
                status = {},
               
                style = {'lineColor': '#fbf5db','cvsbg': 'red'},
                extention = '';
            game = {
                //init matrix and fill icons
                'init' : function(cfg){
                    //build matrix
                    config = cfg
                    //先清空以前旧数据
                    $('#container').html('');

                    //开始自定义配置 样式相关
                    var containerStyle = {
                        'width' : (config.col * parseInt(config.blockStyle.width) + 20) + 'px',
                        'height' : (config.row * parseInt(config.blockStyle.height) + 20) + 'px'
                    };

                    $('#container').css(containerStyle);

                    // 按照行和列生成矩阵
                    var dots = [],
                        //按照个数成对生成icons
                        dotIcons = game.generateIcons(config);
                    for(i = 1; i <= config.row; i++){

                        for(j = 1; j <= config.col; j++) {
                            var iconIndex, iconElement;
                            if(i==1 || i==6 || j==1 ||j==6) {
                                iconIndex = 0;
                                iconElement = $('<div></div>');
                                iconElement.attr('data-pos', i + '-' + j);
                                iconElement.attr('data-x', j);
                                iconElement.attr('data-y', i);

                                //预留position数据 方便后面做匹配搜索
                                iconElement.addClass('block');
                                iconElement.addClass('pos-x' + j);
                                iconElement.addClass('pos-y' + i);
                                iconElement.attr('data-index', iconIndex);
                                iconElement.attr('data-index1', 0);
                                iconElement.css(config.blockStyle);

                                //默认的所有状态都置为未消除
                                status[i + '-' + j] = '0';
                                dots.push(iconElement);
                            }else{
                                var dotIcon = dotIcons.pop(),
                                iconIndex = dotIcon.iconIndex;

                                iconElement = $('<div><img src=\"'+ dotIcon.iconUrl +'\" /><span ></span></div>');
                                iconElement.attr('data-pos', i + '-' + j);
                                iconElement.attr('data-x', j);
                                iconElement.attr('data-y', i);

                                //预留position数据 方便后面做匹配搜索
                                iconElement.addClass('block');
                                iconElement.addClass('pos-x' + j);
                                iconElement.addClass('pos-y' + i);
                                iconElement.attr('data-index', iconIndex);
                                iconElement.css(config.blockStyle);
                                iconElement.children('img').css(config.imgStyle);
                                iconElement.children('span').css(config.spanStyle);

                                //默认的所有状态都置为未消除
                                status[i + '-' + j] = '1';
                                dots.push(iconElement);
                            }
                            

                            
                        }
                    }
                    dots.join('');
                    $("#container").append(dots);
                    // //加一个画布
                    // var linecvs = $('<canvas id = \"linecvs\"></canvas>');
                    // $("#container").append(linecvs);
                    // $("#linecvs").attr('width', parseInt(config.blockStyle.width) * config.row);
                    // $("#linecvs").attr('height', parseInt(config.blockStyle.height) * config.col);
                    game.createcvs();
                    // 绑定事件
                    $('.block').on(events.eventBegan, function(){
                        //clearTimeout(timer11);
                        //$('.break').hide();
                        if($(this).attr('data-index1')==0){
                            return;
                        }
                        var _that = $(this);
                        $('.block').each(function(){
                            //是否是origin
                            if($(this).hasClass('active') && _that.attr('data-pos') !== $(this).attr('data-pos')) {
                                //判断这两个是否能够匹配消除,不能直接选中这个 去除上一个样式
                                var result = game.compare($(this), _that);
                                if (result !== false) {

                                    // result = $.utils.unique(result);
                                    $(this).children('span').show();
                                    _that.children('span').show();
                                    //划线
                                    game.drawLine(result);

                                    $(this).children('img').remove();
                                    _that.children('img').remove();

                                    var _this = $(this);
                                    setTimeout(function(){
                                         _this.children('span').remove();
                                        _that.children('span').remove();
                                    }, 10);
                                   

                                    //状态置0
                                    status[$(this).attr('data-pos')] = '0';
                                    status[_that.attr('data-pos')] = '0';

                                    //消除完把所有的选中状态
                                    _that.removeClass('active');
                                    $(this).removeClass('active');

                                    //解绑点击事件
                                    _that.off('click');
                                    $(this).off('click');


                                    game.score(_that);
                                    //$('.show').eq(0).addClass('fadeOutUp');
                                    //var str = '	<div class="show animated fadeOutUp">\
                                    //    <img class="xiangyun" src="img/two/xiangyun.png" alt=""/>\
                                    //    <span class="show_word" id="show_word">'+config.icons[$(this).attr('data-index')].name+'</span>\
                                    //    </div>'
                                    //$('.seclayer').append(str);
                                    //$('#show_word').html();
                                    $('.show .show_word').eq($(this).attr('data-index')).html(config.icons[$(this).attr('data-index')].name);
                                    console.log($('.show .show_word').eq($(this).attr('data-index')).html())
;                                    $('.show').eq($(this).attr('data-index')).show().addClass('fadeOutUp');
                                    if (config.icons[$(this).attr('data-index')].addTime) {
                                        time += config.icons[$(this).attr('data-index')].addTime;
                                    }
                                    timer11=setTimeout(function(){
                                        $('.break').show();
                                    },2000)
                                    // TODO消除连线
                                    overGame++;
                                    if(overGame==8){
                                       
                                        // config.icons =  [
                                        //     {'src':'../tmp/img/three/1.png','count':5,'addTime':8,'name':'中间的好事'},
                                        //     {'src':'../tmp/img/three/2.png','count':1,'addTime':5,'name':'国外的好事'},
                                        //     {'src':'../tmp/img/three/3.png','count':2,'addTime':17,'name':'哈哈'},
                                        //     {'src':'../tmp/img/three/4.png','count':7,'addTime':19,'name':'呵呵呵呵呵'},
                                        //     {'src':'../tmp/img/three/5.png','count':8,'addTime':2,'name':'就不告诉你'},
                                        //     {'src':'../tmp/img/three/6.png','count':2,'addTime':8,'name':'你开什么玩笑'},
                                        //     {'src':'../tmp/img/three/77.png','count':9,'addTime':4,'name':'嘿嘿嘿'},
                                        //     {'src':'../tmp/img/three/8.png','count':58,'name':'猴年大吉'},
                                        //     {'src':'../tmp/img/three/9.png','count':58,'name':'猴年大吉'},
                                        //     {'src':'../tmp/img/three/10.png','count':58,'name':'猴年大吉'},
                                        //     {'src':'../tmp/img/three/11.png','count':58,'name':'猴年大吉'},
                                        //     {'src':'../tmp/img/three/12.png','count':58,'name':'猴年大吉'},
                                        //     {'src':'../tmp/img/three/13.png','count':58,'name':'猴年大吉'},
                                        //     {'src':'../tmp/img/three/14.png','count':58,'name':'猴年大吉'},
                                        //     {'src':'../tmp/img/three/15.png','count':58,'name':'猴年大吉'},
                                        //     {'src':'../tmp/img/three/16.png','count':58,'name':'猴年大吉'}
                                        //  ];
                                       setTimeout(function(){
                                           config.icons = TabImg();
                                           overGame =0;
                                           dot2dot.init(config);
                                           $('.show').hide().removeClass('fadeOutUp');
                                       },500);
                                    }
                                    //跳出循环
                                    return false;
                                } else {
                                    _that.children('span').css({'display' : 'block'});
                                    $(this).children('span').css({'display' : 'none'});
                                    $(this).removeClass('active');
                                    _that.addClass('active');
                                }
                            } else {
                                _that.children('span').css({'display' : 'block'});
                                _that.addClass('active');
                                origin = _that.attr('data-pos');

                            }
                        });
                    });
    
                },
                'createcvs' : function(){
                    //加一个画布
                    var linecvs = $('<canvas id = \"linecvs\"></canvas>');
                    $("#container").append(linecvs);
                    $("#linecvs").attr('width', parseInt(config.blockStyle.width) * config.row);
                    $("#linecvs").attr('height', parseInt(config.blockStyle.height) * config.col);
                    $("#container").append(linecvs);
                },
                'drawLine' : function(result){
                    $("#linecvs").css({'z-index':'100'});

                    var height = parseInt(config.blockStyle.height),
                        width = parseInt(config.blockStyle.width),
                        halfWidth = parseInt(config.blockStyle.width)/2,
                        halfHeight = parseInt(config.blockStyle.height)/2,
                        firstdot = result.shift();

                    //开始绘画
                    var linecvs = document.getElementById('linecvs'),
                        ctx = linecvs.getContext("2d");

                    ctx.strokeStyle = style.lineColor;
                    ctx.drawColor = style.cvsbg;
                    ctx.moveTo(firstdot[1] * width - halfWidth, firstdot[0] * height - halfHeight);

                    for(var i=0, len=result.length; i<=len; i++){
                        if (result[i]){
                            ctx.lineTo(result[i][1] * width - halfWidth, result[i][0] * height - halfHeight);
                        }
                    }
                    ctx.lineWidth = 5;
                    ctx.stroke();

                    //清画布
                    setTimeout(function(){
                        ctx.clearRect(0, 0, 500, 500);
                        $("linecvs").remove();
                        game.createcvs();
                    }, 100);

                    $("#linecvs").css({'z-index': -10000});
                },
                'generateIcons' : function(config){
                    //var needDotCount = config.row * config.col / 2,
                    var needDotCount = (config.row-2) * (config.col-2) / 2,
                        dotIcons = [];
                   
                          
                    for (var i = 0; i < needDotCount; i++) {

                         var iconIndex = i,
                            iconContent = {};
                        iconContent.iconIndex = iconIndex;
                        iconContent.iconUrl = config.icons[iconIndex]['src'];
                        //保证成对出现
                       
                        dotIcons.push(iconContent);
                        dotIcons.push(iconContent);
                    };
                    //打乱顺序再返回
                    dotIcons = dotIcons.sort(function(){return Math.random() > 0.5 ? -1 : 1});
                    return dotIcons;
                },
                //匹配元素是否相同
                'compare' : function(element1, element2){
                    // 判断状态是否已消除
                    ele1Status = status[element1.attr('data-pos')];
                    ele2Status = status[element2.attr('data-pos')];
                    if (ele1Status == '0' || ele2Status == '0') {
                        return false;
                    }
                    if (element1.attr('data-index') === element2.attr('data-index')) {
                       
                        //开始做扫描算法分析
                        return game.parsePos(element1, element2);
                    } else {
                        return false;
                    }
                },
                //计分
                'score' : function(_this){
                    count += config.icons[_this.attr('data-index')].count;
                    $('#score').html(count);
                    return count;
                },
                //核心 -分位置分析可消性
                //element 0=>y轴 1=>x轴
                'parsePos' : function(element1, element2){

                    ele1Pos = element1.attr('data-pos').split('-');
                    ele2Pos = element2.attr('data-pos').split('-');

                    //检测是否在一条直线上
                    if (game.detectLine(ele1Pos, ele2Pos)) {
                        return [ele1Pos, ele2Pos];
                    }

                    // 深度可通性检测 非一条直线上
                    return game.checkCross(ele1Pos, ele2Pos);
                },
                //检测交叉可通性
                'checkCross' : function(ele1Pos, ele2Pos) {
                    var min = {},
                        max = {};
                        min.x = Math.min(ele1Pos[1], ele2Pos[1]);
                        max.x = Math.max(ele1Pos[1], ele2Pos[1]);
                        min.y = Math.min(ele1Pos[0], ele2Pos[0]);
                        max.y = Math.max(ele1Pos[0], ele2Pos[0]);

                    var dot1Relation = game.filterLine(min, max, ele1Pos),
                        dot2Relation = game.filterLine(min, max, ele2Pos),
                        dot1Count = dot1Relation.length,
                        dot2Count = dot2Relation.length;

                    if (dot1Count == 0 && dot2Count == 0) {
                        //完全无通路直接不可能
                        return false;
                    }

                 
                    // 同一直线共通点搜索
                    var route = [];
                    for(var i = 0; i <= dot1Count; i++){
                        for(var j = 0; j <= dot2Count; j++){

                            if(dot1Count == 0){
                                var d1 = ele1Pos,
                                    d2 = dot2Relation[j];
                            } else if (dot2Count == 0) {
                                var d1 = dot1Relation[i],
                                    d2 = ele2Pos;
                            } else {
                                var d1 = dot1Relation[i],
                                    d2 = dot2Relation[j];
                            }

                            if (typeof d1 !== 'undefined' && typeof d2 !== 'undefined') {
                                //是否是同一点 若使同一点 可证 原坐标两点有共通点 则必然可通
                                if (d1.toString() == d2.toString()) {
                                    route.push(ele1Pos);
                                    route.push(d1);
                                    route.push(ele2Pos);
                                    return route;
                                }
                            }
                        }
                    }
                    // 共通点的连线可以连通
                    for(var i = 0; i <= dot1Count; i++){
                        for(var j = 0; j <= dot2Count; j++){

                            if(dot1Count == 0){
                                var d1 = ele1Pos,
                                    d2 = dot2Relation[j];
                            } else if (dot2Count == 0) {
                                var d1 = dot1Relation[i],
                                    d2 = ele2Pos;
                            } else {
                                var d1 = dot1Relation[i],
                                    d2 = dot2Relation[j];
                            }

                            if (typeof d1 !== 'undefined' && typeof d2 !== 'undefined') {
                                //并且这边两点不能在对比点阵中有相同的点
                                if (game.detectLine(d1, d2)) {
                                    route.push(ele1Pos);
                                    route.push(d1);
                                    route.push(d2);
                                    route.push(ele2Pos);
                                    return route;
                                }
                            }

                        }
                    }
                    return false;
                },
                //拿取一行或者一列做循环判断有多少置空了的元素
                'filterLine' : function(min, max, pos) {
                    var result = [];
                    $('.pos-x'+pos[1]).each(function(){
                        if (status[$(this).attr('data-pos')] == '0') {
                            var x = pos[1],
                                y = $(this).attr('data-y');
                            //检测此点是否连通与坐标点
                            if (game.detectLine(pos, [y,x])) {
                                result.push([y,x]);
                            }
                        }
                    });
                    $('.pos-y'+pos[0]).each(function(){
                        if (status[$(this).attr('data-pos')] == '0') {
                            var x = $(this).attr('data-x'),
                                y = pos[0];
                            //检测此点是否连通与坐标点
                            if (game.detectLine(pos, [y,x])) {
                                result.push([y,x]);
                            }
                        }
                    });

                    return result;
                },

                //检测直线可通性
                'detectLine' : function(dot1, dot2){
                    //Y轴在一条直线上
                    if (dot1[0] == dot2[0]) {
                        var dotmin = Math.min(dot1[1], dot2[1]),
                            dotmax = Math.max(dot1[1], dot2[1]);
                        //相邻处理
                        if ((dotmax - dotmin) == 1) return true;
                        var result = true;
                        $('.pos-y'+dot1[0]).each(function(){
                            var tmpX = $(this).attr('data-x');
                            if (dotmin < tmpX && dotmax > tmpX) {
                                if(status[$(this).attr('data-pos')] == '1') {
                                    result = false;
                                    return false;
                                }
                            }
                        });
                        return result;
                    //X轴在一条直线上
                    } else if(dot1[1] == dot2[1]) {
                        var dotmin = Math.min(dot1[0], dot2[0]),
                            dotmax = Math.max(dot1[0], dot2[0]);
                        //相邻处理
                        if ((dotmax - dotmin) == 1) return true;
                        var result = true;
                        $('.pos-x'+dot1[1]).each(function(){
                            var tmpY = $(this).attr('data-y');
                            if (dotmin < tmpY && dotmax > tmpY) {
                                if(status[$(this).attr('data-pos')] == '1') {
                                    result = false;
                                    return false;
                                }
                            }
                        });
                        return result;
                    } else {
                        //非一条直线
                        return false;
                    }
                },
            'getScore' : function(){
                return count;
            },
            'clearScore' : function(){
                count = 0;
            },
            'getAddTime' : function(){
                var tmpTime = time;
                time = 0;
                return tmpTime;

            }

            };
        window.dot2dot = game;
         function TabImg(){
                var arr = [ 
                {'src':'http://www.philips-campaign.com/cny2016/img/three/1.png','count':88,'name':'青龙报喜'},
                {'src':'http://www.philips-campaign.com/cny2016/img/three/2.png','count':88,'name':'玄武添瑞'},
                {'src':'http://www.philips-campaign.com/cny2016/img/three/3.png','count':10,'name':'焕然一新'},
                {'src':'http://www.philips-campaign.com/cny2016/img/three/4.png','count':10,'name':'健康呼吸'},
                {'src':'http://www.philips-campaign.com/cny2016/img/three/5.png','count':10,'name':'除旧迎新'},
                {'src':'http://www.philips-campaign.com/cny2016/img/three/6.png','count':10,'name':'风度翩翩'},
                {'src':'http://www.philips-campaign.com/cny2016/img/three/7.png','count':10,'name':'健康护齿'},
                {'src':'http://www.philips-campaign.com/cny2016/img/three/8.png','count':10,'name':'美丽怡人'},
                {'src':'http://www.philips-campaign.com/cny2016/img/three/9.png','count':10,'name':'潇洒自信'},
                {'src':'http://www.philips-campaign.com/cny2016/img/three/10.png','count':10,'name':'蒸蒸日上'},
                {'src':'http://www.philips-campaign.com/cny2016/img/three/11.png','count':10,'name':'精力充沛'},
                {'src':'http://www.philips-campaign.com/cny2016/img/three/12.png','count':10,'name':'神采飞扬'},
                {'src':'http://www.philips-campaign.com/cny2016/img/three/13.png','count':10,'name':'无油美味'},
                {'src':'http://www.philips-campaign.com/cny2016/img/three/14.png','count':10,'name':'魅力成双'},
                {'src':'http://www.philips-campaign.com/cny2016/img/three/15.png','count':58,'name':'猴年大吉'},
                {'src':'http://www.philips-campaign.com/cny2016/img/three/16.png','count':0,'addTime':5,'name':'福禄安康'},
                {'src':'http://www.philips-campaign.com/cny2016/img/three/17.png','count':88,'name':'白虎佑福'},
                {'src':'http://www.philips-campaign.com/cny2016/img/three/18.png','count':88,'name':'朱雀呈祥'}
            ]
             var arr1 = choseArray();
             var myArr = [];
             for(var i=0;i<arr1.length;i++){
                 myArr.push(arr[arr1[i]]);
             }
            //arr = shuffleArray(arr);
             console.log(myArr);
            return myArr;
        }

        function choseArray(){
            var arr = []
            var arr1 = [0,1,14,15,16,17];
            var arr2 = [2,3,4,5,6,7,8,9,10,11,12,13];
            arr1 = shuffleArray(arr1);
            arr2 = shuffleArray(arr2);
            for(var i =0;i<2;i++){
                arr1.push(arr2[i]);
            }
            return arr1;

        }
         function shuffleArray(arr){
            var len = arr.length;
            var newArr = [];
            for(var i=0;i<len;i++){
                var index = Math.floor(Math.random()*arr.length);
                newArr.push(arr[index]);
                arr.splice(index,1);        
            }   
            return newArr;
        }
    })
}());