var c = new PlotContainer('plot');





var plotter = c.addPlot({left: -2, right: 2, top: 1, bottom: -1, width:$(document).width()*0.9 , zoom: false, accuracy: 10000});

var controls = new app.Controls(c.addEmptyDiv());

var ButtonOn = controls.newButton(ButtonStepOn, "f^{(n)}");

var ButtonBack = controls.newButton(ButtonStepBack, "f^{(n-1)}");

ButtonOn.className = "formulae-katex";
ButtonBack.className = "formulae-katex";

var diff_counter_text = controls.addText("Порядок производной: ");

var katex_dump;





var diff_counter = controls._initOutput();


diff_counter.value = 0;


function Koshi(x)
{
	if(x == 0)
	{
		return 0;
	}
	else
	{
		return Math.exp(-1/x/x);
	}
}

var current_graph = plotter.addFunc(Koshi, {
	color: 1
});



var funcdiff;
var funcdiffgraph;

var counter = 0;


var TableKoshi = [[[2,-3]]];
var level = 1;
var q = 1;
function dStepKoshi() {
    if (q < level) {
        ++q;
        return;
    }
    var x;
    var y;
    var dump = new Array(level + 1);
    for (var i = 0; i < level + 1; ++i) {
        dump[i] = [0, 0];
    }
    TableKoshi.push(dump);
    for (var j = 0; j < level; ++j) {
        x = TableKoshi[level-1][j][0];
        y = TableKoshi[level-1][j][1];
        TableKoshi[level][j][0] += x * y;
        TableKoshi[level][j][1] += y - 1;
        //TableKoshi[level][j] = [x * y + dump[0], y - 1 + dump[1]];
        TableKoshi[level][j + 1][0] = 2 * x;
    }
    TableKoshi[level][level][1] = y - 3;
    //TableKoshi.push(dump);
    level++;
    q++;
}
function dStepBackKoshi() {
    if(q > 1)
    {
        --q;
        return;
    }
}


var eps = Math.pow(10,-10);
var eps0 = Math.pow(10,-4);

function dcountKoshi() {
    return function (x) {
        var res = 0;
        var resstep = 0;
        for (var i = 0; i < q; ++i) {
        	resstep = TableKoshi[q-1][i][0] * (Math.pow(x, TableKoshi[q-1][i][1]))
        	/*if(isNaN(resstep))
        	{
        		return 0;
        	}*/
            res += resstep;
        }
        res *= Koshi(x);
        if(isNaN(res))
        {
        	return 0;
       	}
        return res;
    }
}

function ButtonStepBack() {
    if (counter == 1) {
        counter--;
        plotter.remove(funcdiffgraph);
    }
    else if (counter > 1) {
        counter--;
        plotter.remove(funcdiffgraph);
        dStepBackKoshi();
        funcdiff = dcountKoshi();
        funcdiffgraph = plotter.addFunc(dcountKoshi());
        funcdiffgraph.setColor(3);
    }
    diff_counter.value = counter;
}



function ButtonStepOn(){
    if (counter >= 0) {
        counter++;
        if (counter > 1) {
            plotter.remove(funcdiffgraph);
            dStepKoshi();
        }
        funcdiff = dcountKoshi();
        funcdiffgraph = plotter.addFunc(dcountKoshi());
        funcdiffgraph.setColor(3);
        diff_counter.value = counter;
    }
}
    
