(function() {
	runGrafar(function() {
		grafar.config.debug = false;
        function getProblemById(id) {
            return problems.filter(function(pr) {
                return pr.id === id;
            })[0];
        };
		
		// var infoDiv = document.getElementById('info');
		// problems.forEach(function(pr) {
			// pr.div = document.createElement('div');
			// pr.div.innerHTML = pr.info;
		// });
		
		var panelMainDiv = document.getElementById('plot3d_main');
		panelMainDiv.addEventListener('mouseover', eulerface.lockScroll);
		panelMainDiv.addEventListener('mouseout', eulerface.unlockScroll);
		
		var panelCondDiv = document.getElementById('plot3d_cond');
		panelCondDiv.addEventListener('mouseover', eulerface.lockScroll);
		panelCondDiv.addEventListener('mouseout', eulerface.unlockScroll);
		
		var maxConditions = Math.max.apply(null, problems.map(function(p) {return p.conditions.length;})),
			maxLambda = Math.max.apply(null, problems.map(function(p) {return p.lambda.length;}));
			
		grafar.ui([
			{type: 'checkbox', id: 'show_cond', bind: animate},
			{type: 'label', init: 'Анимация'}
		], {container: 'options'});
		
		var pan3d_main = new grafar.Panel(document.getElementById('plot3d_main')),
			pan3d_anim = new grafar.Panel(document.getElementById('plot3d_cond'));
		
		var main_graf = new grafar.Object().pin(pan3d_main),
			main_cond = new grafar.Object().pin(pan3d_main),
			extrema_points_main = new grafar.Object().pin(pan3d_main),
			extrema_points_anim = new grafar.Object().pin(pan3d_anim),
			intersect = new grafar.Object().pin(pan3d_main),
			intersect2 = new grafar.Object().pin(pan3d_anim),
			cond_graf = [];
		for (var i = 0; i < maxLambda; i++) {
			cond_graf.push(new grafar.Object().pin(pan3d_anim));
			cond_graf[i].hide(true);
		}
		var problem,
			animate_forward = true;
			
		//updateProblem();
		
		function updateProblem() {
			problem = getProblemById(sel1.container.getAttribute('value'));
			var problemId = sel1.container.getAttribute('value');
			
			hideAllBut(
                document.getElementById('solution1'), 
                document.getElementById('solution-' + problemId));
			
			// if (infoDiv.children.length !== 0)
				// infoDiv.removeChild(infoDiv.firstChild);
			// infoDiv.appendChild(problem.div);
			// if(grafar.isExisty(window.MathJax))
				// MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
			
			pan3d_main.camera.position.set(-8, 8, 8);
			pan3d_anim.camera.position.set(-8, 8, 8);
			
			//Resetting animated panel
			for (var i = 0; i < cond_graf.length; i++) {
				cond_graf[i].reset().hide(true);
			}
			
			//Plotting Main function
			main_graf.reset()
					.constrain({what: 'x', maxlen: 50, as: grafar.seq(-5, 5, 'x')})
					.constrain({what: 'y', maxlen: 50, as: grafar.seq(-5, 5, 'y')})
					.constrain({what: 'z', using: 'x, y', as: function (data, l) {
						var x = data.x, y = data.y;
						for (var i = 0; i < l; i++) {
							data.z[i] = problem.eqn_comp(x[i], y[i]);
						}
					 }})
					 .refresh();
			main_graf.glinstances[0].object.children[0].material.color.r = 65/255;
			main_graf.glinstances[0].object.children[0].material.color.g = 105/255;
			main_graf.glinstances[0].object.children[0].material.color.b = 255/255;
			
			//Plotting starting graph for animated panel
			cond_graf[0].reset()
					.constrain({what: 'x', maxlen: 50, as: grafar.seq(-5, 5, 'x')})
					.constrain({what: 'y', maxlen: 50, as: grafar.seq(-5, 5, 'y')})
					.constrain({what: 'z', using: 'x, y', as: function (data, l) {
						var x = data.x, y = data.y;
						for (var i = 0; i < l; i++) {
							data.z[i] = problem.eqn_comp(x[i], y[i]);
						}
					 }})
					 .hide(false)
					 .refresh();
			cond_graf[0].glinstances[0].object.children[0].material.color.r = 65/255;
			cond_graf[0].glinstances[0].object.children[0].material.color.g = 105/255;
			cond_graf[0].glinstances[0].object.children[0].material.color.b = 255/255;
			
			//Plotting condition's graph
			main_cond.reset();
			if (problem.cond_type == 'explicit') {
				var cond_f = problem.conditions_comp[0];
				main_cond.constrain({what: 'z', maxlen: 50, as: grafar.seq(-10, 10, 'z')})
						.constrain({what: 'x', maxlen: 50, as: grafar.seq(-5, 5, 'x')})
						.constrain({what: 'y', using: 'x, z', as: function(data, l) {
							var x = data.x;
							for (var i = 0; i < l; i++) {
								data.y[i] = cond_f(x[i]);
							}
						}})
						.refresh();
			} else if (problem.cond_type == 'polar') {
				var cond_f = problem.conditions_comp;
				main_cond.constrain({what: 'z', maxlen: 50, as: grafar.seq(-5, 5, 'z')})
						.constrain({what: 'phi', maxlen: 50, as: grafar.seq(0, 2.408*Math.PI, 'phi')})
						.constrain({what: 'x', using: 'phi', as: function(data, l) {
							var phi = data.phi;
							for (var i = 0; i < l; i++) {
								data.x[i] = cond_f[1](phi[i]);
							}
						}})
						.constrain({what: 'y', using: 'phi', as: function(data, l) {
							var phi = data.phi;
							for (var i = 0; i < l; i++) {
								data.y[i] = cond_f[0](phi[i]);
							}
						}})
						.refresh();
			} else if (problem.cond_type == 'parametric') {
				var cond_f = problem.conditions_comp;
				main_cond.constrain({what: 'z', maxlen: 50, as: grafar.seq(-5, 5, 'z')})
						.constrain({what: 't', maxlen: 50, as: grafar.seq(-10, 10, 't')})
						.constrain({what: 'x', using: 't', as: function(data, l) {
							var t = data.t;
							for (var i = 0; i < l; i++) {
								data.x[i] = cond_f[1](t[i]);
							}
						}})
						.constrain({what: 'y', using: 't', as: function(data, l) {
							var t = data.t;
							for (var i = 0; i < l; i++) {
								data.y[i] = cond_f[0](t[i]);
							}
						}})
						.refresh();
			}
			main_cond.glinstances[0].object.children[0].material.color.r = 155/255;
			main_cond.glinstances[0].object.children[0].material.color.g = 153/255;
			main_cond.glinstances[0].object.children[0].material.color.b = 153/255;
			
			//Plotting intersection 1
			intersect.reset();
			if (problem.intersect_type == 'explicit') {
				var inter_f = problem.intersection;
				intersect.constrain({what: 'x', maxlen: 50000, as: grafar.seq(-5, 5, 'x', false, true)})
						.constrain({what: 'y', using: 'x', as: function (data, l) {
							var x = data.x;
							for (var i = 0; i < l; i++) {
								data.y[i] = inter_f[0](x[i]);
							}
						}})
						.constrain({what: 'z', using: 'x', as: function (data, l) {
							var x = data.x;
							for (var i = 0; i < l; i++) {
								data.z[i] = inter_f[1](x[i]);
							}
						}})
						.refresh();
			} else if (problem.intersect_type == 'polar') {
				var inter_f = problem.intersection;
				intersect.constrain({what: 'phi', maxlen: 5000, as: grafar.seq(0, 2*Math.PI, 'phi', false, true)})
						.constrain({what: 'x', using: 'phi', as: function(data, l) {
							var phi = data.phi;
							for (var i = 0; i < l; i++) {
								data.x[i] = inter_f[2](phi[i]);
							}
						}})
						.constrain({what: 'y', using: 'phi', as: function(data, l) {
							var phi = data.phi;
							for (var i = 0; i < l; i++) {
								data.y[i] = inter_f[0](phi[i]);
							}
						}})
						.constrain({what: 'z', using: 'x, y', as: function(data, l) {
							var x = data.x, y = data.y;
							for (var i = 0; i < l; i++) {
								data.z[i] = inter_f[1](x[i], y[i]);
							}
						}})
						.refresh();
			} else if (problem.intersect_type == 'parametric') {
				var inter_f = problem.intersection;
				intersect.constrain({what: 'z', maxlen: 50, as: grafar.seq(-5, 5, 'z')})
						.constrain({what: 't', maxlen: 100, as: grafar.seq(0, 2.408*Math.PI, 't')})
						.constrain({what: 'x', using: 't', as: function(data, l) {
							var t = data.t;
							for (var i = 0; i < l; i++) {
								data.x[i] = inter_f[2](t[i]);
							}
						}})
						.constrain({what: 'y', using: 't', as: function(data, l) {
							var t = data.t;
							for (var i = 0; i < l; i++) {
								data.y[i] = inter_f[0](t[i]);
							}
						}})
						.refresh();
			}
			intersect.glinstances[0].object.children[0].material.color.r = 255/255;
			intersect.glinstances[0].object.children[0].material.color.g = 140/255;
			intersect.glinstances[0].object.children[0].material.color.b = 0;
			intersect.glinstances[0].object.children[0].material.transparent = false;
			
			
			//Plotting intersection 2
			intersect2.reset();
			if (problem.intersect_type == 'explicit') {
				var inter_f = problem.intersection;
				intersect2.constrain({what: 'x', maxlen: 50000, as: grafar.seq(-5, 5, 'x', false, true)})
						.constrain({what: 'y', using: 'x', as: function (data, l) {
							var x = data.x;
							for (var i = 0; i < l; i++) {
								data.y[i] = inter_f[0](x[i]);
							}
						}})
						.constrain({what: 'z', using: 'x', as: function (data, l) {
							var x = data.x;
							for (var i = 0; i < l; i++) {
								data.z[i] = inter_f[1](x[i]);
							}
						}})
						.refresh();
			} else if (problem.intersect_type == 'polar') {
				var inter_f = problem.intersection;
				intersect2.constrain({what: 'phi', maxlen: 5000, as: grafar.seq(0, 2*Math.PI, 'phi', false, true)})
						.constrain({what: 'x', using: 'phi', as: function(data, l) {
							var phi = data.phi;
							for (var i = 0; i < l; i++) {
								data.x[i] = inter_f[2](phi[i]);
							}
						}})
						.constrain({what: 'y', using: 'phi', as: function(data, l) {
							var phi = data.phi;
							for (var i = 0; i < l; i++) {
								data.y[i] = inter_f[0](phi[i]);
							}
						}})
						.constrain({what: 'z', using: 'x, y', as: function(data, l) {
							var x = data.x, y = data.y;
							for (var i = 0; i < l; i++) {
								data.z[i] = inter_f[1](x[i], y[i]);
							}
						}})
						.refresh();
			} else if (problem.intersect_type == 'parametric') {
				var inter_f = problem.intersection;
				intersect2.constrain({what: 'z', maxlen: 50, as: grafar.seq(-5, 5, 'z')})
						.constrain({what: 't', maxlen: 100, as: grafar.seq(0, 2.408*Math.PI, 't')})
						.constrain({what: 'x', using: 't', as: function(data, l) {
							var t = data.t;
							for (var i = 0; i < l; i++) {
								data.x[i] = inter_f[2](t[i]);
							}
						}})
						.constrain({what: 'y', using: 't', as: function(data, l) {
							var t = data.t;
							for (var i = 0; i < l; i++) {
								data.y[i] = inter_f[0](t[i]);
							}
						}})
						.refresh();
			}
			intersect2.glinstances[0].object.children[0].material.color.r = 255/255;
			intersect2.glinstances[0].object.children[0].material.color.g = 140/255;
			intersect2.glinstances[0].object.children[0].material.color.b = 0;
			intersect2.glinstances[0].object.children[0].material.transparent = false;
			
			//Plotting Extrema points on main graph
			extrema_points_main.reset();
			var points = problem.extr_points;
			extrema_points_main.constrain({what: 'x, y', maxlen: 4, as: function(data, l) {
								var x = data.x, y = data.y;
								for (var i = 0; i < l; i++) {
									x[i] = points.x[i];
									y[i] = points.y[i];
								}
							}})
							.constrain({what: 'z', using: 'x, y', as: function (data, l) {
								var x = data.x, y = data.y;
								for (var j = 0; j < l; j++) {
									data.z[j] = problem.eqn_comp(x[j], y[j]);
								}
							}})
							.refresh();
			extrema_points_main.glinstances[0].object.children[0].visible = true;
			extrema_points_main.glinstances[0].object.children[0].material.transparent = false;
			extrema_points_main.glinstances[0].object.children[0].material.size = 20;
			extrema_points_main.glinstances[0].object.children[0].material.color.r = 255/255;
			extrema_points_main.glinstances[0].object.children[0].material.color.g = 69/255;
			extrema_points_main.glinstances[0].object.children[0].material.color.b = 0;
				
			//Plotting Extrema points on animated graph
			extrema_points_anim.reset();
			var points = problem.extr_points;
			extrema_points_anim.constrain({what: 'x, y', maxlen: 4, as: function(data, l) {
								var x = data.x, y = data.y;
								for (var i = 0; i < l; i++) {
									x[i] = points.x[i];
									y[i] = points.y[i];
								}
							}})
							.constrain({what: 'z', using: 'x, y', as: function (data, l) {
								var x = data.x, y = data.y;
								for (var j = 0; j < l; j++) {
									data.z[j] = problem.eqn_comp(x[j], y[j]);
								}
							}})
							.refresh();
			extrema_points_anim.glinstances[0].object.children[0].visible = true;
			extrema_points_anim.glinstances[0].object.children[0].material.transparent = false;
			extrema_points_anim.glinstances[0].object.children[0].material.size = 20;
			extrema_points_anim.glinstances[0].object.children[0].material.color.r = 255/255;
			extrema_points_anim.glinstances[0].object.children[0].material.color.g = 69/255;
			extrema_points_anim.glinstances[0].object.children[0].material.color.b = 0;
		}
		
		function animate() {
			lam = [];
			frame_rate = 20;
			maxLam = problem.lambda.length;
			for (var i = 0; i < maxLam; i++) {
				lam[i] = problem.lambda[i];
				if (i < cond_graf.length)
					cond_graf[i].hide(false);
			}
			
			var i = 0;
				f = problem.eqn_comp;
			function frame() {
				for (var j = 0; j < maxLam; j++) {
					cur_lmbd = lam[j];
					cond_graf[j].constrain({what: 'x', maxlen: 50, as: grafar.seq(-5, 5, 'x')})
								.constrain({what: 'y', maxlen: 50, as: grafar.seq(-5, 5, 'y')})
					cond_graf[j].constrain({what: 'z', using: 'x, y', as:
						function(data, l) {
							if (animate_forward == true) {
								for (var k = 0; k < l; k++) {
									data.z[k] = f(data.x[k], data.y[k]) + (cur_lmbd * i / frame_rate) * problem.conditions_form[0](data.x[k], data.y[k]);
								}
							} else {
								for (var k = 0; k < l; k++) {
									data.z[k] = f(data.x[k], data.y[k]) + (cur_lmbd * (frame_rate - i) / frame_rate) * problem.conditions_form[0](data.x[k], data.y[k]);
								}
							}
						}})
						.refresh();
					cond_graf[j].hide(false);
				}
				i++;
				if (i <= frame_rate)
					window.requestAnimationFrame(frame);
				else
					animate_forward = !animate_forward;
			}
			frame();
		}
		
		hideAllBut = function(container, visible) {
            var children = container.children;
            for (var i = 0; i < children.length; i++)
              children[i].style.display = 'none';
          visible.style.display = 'block';
        };
		
		sel1 = new eulerface.Select(document.getElementById('sel1')),
		
        sel1.container.addEventListener('change', updateProblem);
		
        sel1.addOption(document.getElementById('opt-la-1'), 'la-1');
        sel1.addOption(document.getElementById('opt-la-2'), 'la-2');
		// sel1.addOption(document.getElementById('opt-la-3'), 'la-3');
		// sel1.addOption(document.getElementById('opt-la-4'), 'la-4');
		sel1.addOption(document.getElementById('opt-la-5'), 'la-5');
		sel1.addOption(document.getElementById('opt-la-6'), 'la-6');
		sel1.addOption(document.getElementById('opt-la-7'), 'la-7');
		sel1.addOption(document.getElementById('opt-la-8'), 'la-8');
		sel1.addOption(document.getElementById('opt-la-9'), 'la-9');
		sel1.addOption(document.getElementById('opt-la-10'), 'la-10');
		sel1.addOption(document.getElementById('opt-la-11'), 'la-11');
	
        
        MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
	}, '../');
}());