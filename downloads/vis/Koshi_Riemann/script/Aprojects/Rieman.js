var c = new PlotContainer('plot');

var iterations = 400;
var plotter = c.addPlot({left: 0, right: 1, top: iterations, bottom: 0, width:$(document).width()*0.9 , zoom: false});


//Реализация с использованием заранее сгенерированного массива 
//для 100 значений - 10 секунд (массив для 1000 значений)
//для 200 значений - 10 секунд (массив для 1000 значений)
//для 300 значений - 18 секунд (массив для 1000 значений)
//для 400 значений - 36 секунд (массив для 1000 значений)
//для 100 значений - 3 секунды (массив для 400 значений)
//для 200 значений - 9 секунды (массив для 400 значений)
//для 300 значений - 17 секунд (массив для 400 значений)
//для 400 значений - 31 секунда(массив для 400 значений)

var tmp = 1
var time = 1;
var primeid = 1;
var interval = setInterval(function() {
    (function (i) {
                    for(var q = 0; q < RiemanTable[i].length; ++q)						                                                                        plotter.addPoint(RiemanTable[i][q], i, {size: 'tiny'});
                    if(i == Eratosphen[primeid])
                    {
                        for(var j = 1; j < Eratosphen[primeid]; ++j)
                            plotter.addPoint(j/Eratosphen[primeid],Eratosphen[primeid], {size: 'tiny'});
                        primeid++;
                    }
    })(tmp);
    tmp++;
    if (tmp >= iterations)
            clearInterval(interval);
}, time);

//Реализация в лоб с алгоритмом Евклида
//для 100 значений: 2 секунды
//для 200 значений: 8 секунд
//для 300 значений: 20 секунд
//для 400 значений: 46 секунд
/*function gcd(a, b)
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


for (var i = 1; i <= iterations; i++) {
	for(var j = 1; j < i; ++j)
		if(gcd(j,i) == 1)
			plotter.addPoint(j/i, i, {size: 'small'});
}
*/