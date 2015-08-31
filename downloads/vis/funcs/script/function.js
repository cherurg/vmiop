var container = new PlotContainer("plot");
var controls = new app.Controls(container.addEmptyDiv());
var plot = container.addPlot({
        left: -5,
        right: 5,
        width:1000,
height: 600}
    );

var func = plot.addFunc(function (x) {
    return Math.pow(x,2)-Math.pow(x,4);
});

var point=plot.addPoint(0, 0);

var func1 = plot.addFunc(function (x) {
    return Math.pow(0,2)-Math.pow(0,4) + (2*0-4*Math.pow(0,3))*(x-0);
});
func1.Colour(2);


var tdforwrite=document.getElementsByName("1");
tdforwrite[0].innerHTML = 'Тангенс угла наклона касательной: ' + Math.cos(0);

function changeRange (value) {
    range.setText(text + Math.round(value*100)/100);
	
    plot.remove(func1);
	plot.remove(point);
	
	point=plot.addPoint(value, Math.pow(value,2)-Math.pow(value,4));
	
    func1 = plot.addFunc(function (x) {
        return Math.pow(value,2)-Math.pow(value,4) + (2*value-4*Math.pow(value,3))*(x-value);
    });
	func1.Colour(2);

tdforwrite[0].innerHTML = 'Тангенс угла наклона касательной: ' + Math.round((2*value-4*Math.pow(value,3))*10000)/10000;
}

var text = "Абсцисса точки: ";
var range = controls.addRange(changeRange, text+ "0", -30 , 30, 0.0001, 0);



