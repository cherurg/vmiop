var c = new PlotContainer('plot');

var animationFlag = document.getElementById("check1").checked;

var animationCheckBox = document.getElementById('check1');



var plotter = c.addPlot({left: 0, right: 1, top: 0.5, bottom: 0, width:$(document).width()*0.9 , zoom: false});


var controls = new app.Controls(c.addEmptyDiv());



function gcd(a, b)
{
	if(a == 0 || b == 0)
		return a+b;
	else if(a > b)
	{
		return gcd(a%b,b);
	}
	else
	{
		return gcd(a,b%a);
	}
}
var draw_flag = 0;
var drawButton;
var zoomButton;
var zoomcounter = 0;

var inc_draw = false;
function draw_popcorn()
{
    animationFlag = document.getElementById("check1").checked;
    //if(!inc_draw)
        draw_flag++;
    var curr_flag = draw_flag;
    //if(!inc_draw)
        plotter.removeAll();
    inc_draw = false;
    //var iterations = 300;
    //var max = border;
    var start = parseInt(1/curr_scale_y);
    var iterations=zoomcounter*100+300+start;
    /*if(zoomcounter > 0)
    {
        start = 300 + (zoomcounter-1)*20;
        iterations = start+20;
    }*/
    var tmp = 1
    var time = 1
    var interval;
    var P_size = 2;
    var curr_point;
    if(!animationFlag)
    {
        for(var i = start; i <= iterations; ++i)
        {
            P_size-=2/(iterations-start);
            for(var j = 1; j/i <= 1; ++j)
            {
                if(gcd(j,i) == 1 && draw_flag == curr_flag)
                {
                    curr_point = plotter.addPoint(j/i, 1/i, {size: P_size, color: 20});
                    curr_point.setSize(P_size);
                }
            }
        }
        //inc_draw = false;
        return 0;
    }
    /*tmp = j;
        interval = setInterval(function() { 
        (function (q) {
            })(tmp);
                tmp++;
                if(tmp>=j+1)
                    clearInterval(interval);
            }, time);*/
    //for (var i = 1; i <= iterations; i++) {
    tmp = start;
    interval = setInterval(function() {
        (function(i) {
            P_size-=2/(iterations-start);
            /*if(i == 10)
                P_size = 2;
            if(i == 20)
                P_size = 1;*/
	       for(var j = 1; j < i; ++j)
                if(gcd(j,i) == 1 && draw_flag == curr_flag)
                {
                    curr_point = plotter.addPoint(j/i, 1/i, {size: P_size, color: 20});
                    curr_point.setSize(P_size);
                }
                
        })(tmp);
        tmp++;
        if(tmp >= iterations || draw_flag != curr_flag)
            clearInterval(interval);
    },time);
//}
}
var scalable = false;
var curr_scale_x = 1;
var curr_scale_y = 0.5;
function change_scale()
{
    //var setTopLeft = setTimeout(function () {
    if(scalable)
    {
        plotter.plot.y.domain([plotter.plot.pure.bottom, 0.5]);
        plotter.plot.x.domain([plotter.plot.pure.left, 1]);
        plotter.draw();
        scalable = false;
        zoomButton.innerHTML = "Приблизить";
        return;
    }
  plotter.plot.y.domain([plotter.plot.pure.bottom, 0.35]);
    plotter.plot.x.domain([plotter.plot.pure.left, 0.5]);
  plotter.draw();
    scalable = true;
    zoomButton.innerHTML = "Отдалить";
//}, 1);
    
   // c.addPlot({left: 0, right: 0.5, top: 0.35, bottom: 0, width:$(document).width()*0.9 , zoom: false});
    //draw_popcorn(iterations_zoom, 0.5);
}
function inc_scale()
{
    zoomcounter++;
    inc_draw = true;
    draw_popcorn();
    curr_scale_y *= 0.35;
    curr_scale_x *= 0.5;
    plotter.plot.y.domain([plotter.plot.pure.bottom,curr_scale_y]);
    plotter.plot.x.domain([plotter.plot.pure.left, curr_scale_x]);
    plotter.draw();
}
function dec_scale()
{
    zoomcounter--;
    curr_scale_y /= 0.35;
    curr_scale_x /= 0.5;
    plotter.plot.y.domain([plotter.plot.pure.bottom,curr_scale_y]);
    plotter.plot.x.domain([plotter.plot.pure.left, curr_scale_x]);
    plotter.draw();
}


drawButton = controls.newButton(draw_popcorn, "Рисовать");
zoomButton = controls.newButton(inc_scale, "Приблизить");
rezoomButton = controls.newButton(dec_scale, "Отдалить");
animationCheckBox.addEventListener('change', draw_popcorn);