MathJax.Hub.Queue(['Typeset', MathJax.Hub]);

(function () {
	var func = function (f) {
		this.func = f.bind(this);
		this.n = arguments[1] || 1;
	}

	var funcs = [];
	funcs.push(
		new func(function (x) {
			return Math.pow(x, this.n) - Math.pow(x, this.n + 1);
		})
	);
	funcs.push(
		new func(function (x) {
			return Math.pow(x, this.n) - Math.pow(x, 2*this.n);
		})
	);

	funcs[0].options = {
		left: 0,
		right: 1,
		accuracy: 4000
	};
	funcs[1].options = {
		left: 0,
		right: 1,
		accuracy: 10000
	};

	var plot;
	var controls = [];
	(function initPlot() {
		plot = new Skeleton('plot3d_main', {
		    left: 0,
		    right: 1.01,
		    top: 0.3,
		    bottom: -0.01,
		    width: 600,
		    height: 450
		});

		var slider1 = $('#controls1 .slider')
		.noUiSlider({
			start: [ 1 ],
			step: 1,
			range: {
				'min': [ 1 ],
				'max': [ 250 ]
			}
		})
		.on({
			slide: function () {
				var val = slider1.val();
				val = +val.slice(0, val.length - 3);
				text1.text('Номер члена последовательности: ' + val);
				funcs[0].n = val;
				setPlot(0);
			}
		});

		var text1 = $('#controls1 p');

		var slider2 = $('#controls2 .slider')
		.noUiSlider({
			start: [ 1 ],
			step: 1,
			range: {
				'min': [ 1 ],
				'max': [ 5000 ]
			}
		})
		.on({
			slide: function () {
				var val = slider2.val();
				val = +val.slice(0, val.length - 3);
				text2.text('Номер члена последовательности: ' + val);
				funcs[1].n = val;
				setPlot(1);
			}
		});

		var text2 = $('#controls2 p');

	}());

	var setPlot = function (number) {
        plot.removeAll();

/*		plot.plot.pure.left = 0;
		plot.plot.pure.right = 1.01;
		plot.plot.pure.top = 0.3;
        plot.plot.pure.bottom = -0.01;
        plot.update();*/

        var func = funcs[number];
        var f = plot.addFunc(func.func, func.options);
	}

	var updateProblem = function () {
		var getProblemById = function (id) {
			return problems.filter(function (pr) {
                return pr.id === id;
            })[0];
		}

		var hideAllBut = function (container, visible) {
	        var children = container.children;

	        for (var i = 0; i < children.length; i++) {
	            children[i].style.display = 'none';
	        }

	        visible.style.display = 'block';
    	};

		var problem = getProblemById(sel.container.getAttribute('value'));
		var problemId = sel.container.getAttribute('value');
			
		hideAllBut(
			document.getElementById('solution1'), 
        	document.getElementById('solution-' + problemId)
        );

        setPlot(+problemId[problemId.length - 1] - 1);
	}



	var sel = new eulerface.Select(document.getElementById('sel1'));
	sel.addOption(document.getElementById('opt-la-1'), 'la-1');
	sel.addOption(document.getElementById('opt-la-2'), 'la-2');

	sel.container.addEventListener('change', updateProblem);


	updateProblem();
}());