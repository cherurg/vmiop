
var c = new PlotContainer('plot');




//var cases = {pointA: "f(x) = 3, x \\in [-\\pi/4, \\pi/2]", pointB: "f(x) = -x^{2}, x \\in [0,1]"};
//var Problem_switcher = controls.addSelect(cases);
//Problem_switcher.class = 'formulae-katex';

//var katex_dump;

/*$("select").each(function(){
	for(var i = 0; i < this.options.length; ++i)
	{
		//alert(this.options[i].text);
		katex_dump = this.options[i].innerHTML;
		this.options[i].innerHTML = "";
		katex.render(katex_dump, this.options[i]);
		alert(this.options[i].text);
	}
	
	//this.innerHTML = "";
	//katex.render(katex_dump, this);
});*/

var plotter = c.addPlot({left: -2*Math.PI, right: 2*Math.PI, top: 5, bottom: -1});


var switcher = 0;
var controls = new app.Controls(c.addEmptyDiv());



var Fourier_text = controls.addText("Число членов ряда Фурье: ");
var Fourier_label = controls._initInput();
Fourier_label.value = 25;

var f;

var abs = Math.abs;
var sin = Math.sin;
var cos = Math.cos;
var pi = Math.PI;
var pow = Math.pow;

function periodicConstant(x)
{
	var period = 2*pi;
	var y = x;
	if(x < 0)
	{
		period*=-1;
	}
	while(abs(y) > pi)
	{
		y -= period;
	}
	if(y > -pi/2 && y < pi/4)
	{
		return 3;
	}
	else
	{
		return 0;	
	}
}

function periodicParabola(x)
{
	var period = 1;
	var y = x;
	if(x < 0)
	{
		period *= -1;
	}
	while(abs(y -0.5) > 0.5)
	{
		y -= period;
	}
	return -pow(y,2);
}


function periodicConstantFourierSeries(n)
{
	return function(x){
		var a0 = 9/4;
		var sum = a0/2;
		var an;
		var bn;
		for(var i = 1; i <= n; ++i)
		{
			an = 3*(sin(pi*i/4) + sin(pi*i/2))/(pi*i);
			bn = 3*(cos(pi*i/2) - cos(pi*i/4))/(pi*i);
			sum += an*cos(i*x) + bn*sin(i*x);
		}
		return sum;
	}
}

function periodicParabolaFourierSeries(n)
{
	return function(x){
		var a0 = -2/3;
		var sum = a0/2;
		var an;
		var bn;
		for(var i = 1; i <= n; ++i)
		{
			an = -1/pow(pi,2)/pow(i,2);
			bn = 1/pi/i;
			sum += an*cos(2*pi*i*x) + bn*sin(2*pi*i*x);
		}
		return sum;
	}
}

var N = 25;

var f = new Array(2);
f[0] = periodicConstant;
f[1] = periodicParabola;
var F = new Array(2);
F[0] = periodicConstantFourierSeries;
F[1] = periodicParabolaFourierSeries;

var BreakArray = new Array(2);
BreakArray[0] = new Array(3*12);
var j = -6;
for(var i = 0; i < 3*12; j++)
{
	BreakArray[0][i] = -Math.PI + 2*Math.PI*j;
	i++;
	BreakArray[0][i] = -Math.PI/2 + 2*Math.PI*j;
	i++;
	BreakArray[0][i] = Math.PI/4 + 2*Math.PI*j;
	i++;
}
BreakArray[1] = new Array(12);
j = 5;
for(var i = 0; i < 12; i++)
{
	BreakArray[1][i] = i-j;
}
//BreakArray[0].sort();
//alert(BreakArray[0][0]);

var Borders = new Array(2);
Borders[0] = {left: -Math.PI -12*Math.PI, right: Math.PI/4+10*Math.PI};
Borders[1] = {left: -6, right: 5};
var function_graph = plotter.addFunc(f[switcher], {
	color: 0,
	breaks: BreakArray[switcher],
	left: Borders[switcher].left,
	right: Borders[switcher].right
});

var fourier_series_graph = plotter.addFunc(F[switcher](N), {color: 6});

function FourierRedraw()
{
	N = Fourier_label.value;
	if(fourier_series_graph != undefined)
	{
		plotter.remove(fourier_series_graph);
	}		
	fourier_series_graph = plotter.addFunc(F[switcher](N), {color: 6});
}

function SwitchA()
{
	switcher = 0;
	if(function_graph != null)
			plotter.remove(function_graph);
	function_graph = plotter.addFunc(f[switcher], {
		color: 0,
		breaks: BreakArray[switcher],
		left: Borders[switcher].left,
		right: Borders[switcher].right
	});
	if(fourier_series_graph != null)
		plotter.remove(fourier_series_graph);
	fourier_series_graph = plotter.addFunc(F[switcher](N), {color: 6});
}

function SwitchB()
{
	switcher = 1;
	if(function_graph != null)
	    plotter.remove(function_graph);
	function_graph = plotter.addFunc(f[switcher], {
		color: 0,
		breaks: BreakArray[switcher],
		left: Borders[switcher].left,
		right: Borders[switcher].right
	});
	if(fourier_series_graph != null)
		plotter.remove(fourier_series_graph);
	fourier_series_graph = plotter.addFunc(F[switcher](N), {color: 6});
	
}

var Fourier_button = controls.newButton(FourierRedraw,"Применить");

var Button1 = controls.newButton(SwitchA, "f(x) = 3, x \\in [-\\pi/4, \\pi/2]");
var Button2 = controls.newButton(SwitchB, "f(x) = \-x^{2}, x \\in [0,1]");

Button1.className = "formulae-katex";
Button2.className = "formulae-katex";


var katex_dump;



$(".formulae-katex").each(function(){
	katex_dump = this.innerHTML;
	this.innerHTML = "";
	katex.render(katex_dump, this);
});

Button1.setAttribute('style','width: '+ getComputedStyle(Button1).width);
Button2.setAttribute('style','width: '+ getComputedStyle(Button1).width);