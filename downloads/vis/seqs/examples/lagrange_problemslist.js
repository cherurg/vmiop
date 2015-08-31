var problems = [
	{	id: 'la-1',
		eqn: 'z == x^2 + y^2',
		eqn_comp: function(x, y) {
			return x * x + y * y;
		},
		conditions: 'x + y - 2 == 0',
		intersect_type: 'explicit',
		intersection: [
			function(x) {
				return 2 - x;
			},
			function(x) {
				return 2*x*x - 4*x + 4;
			}
		],
		conditions_form: [
			function(x, y) {
				return x + y - 2;
			}
		],
		cond_type: 'explicit',
		conditions_comp: [
			function(x) {
				return 2 - x;
			}
		],
		lambda: [-2],
		extr_points: {x: [1], y: [1]},
		info:
		'<strong> Number </strong> \
		<br />Find local extremums in following conditions: \
		$$ x + y - 2 = 0 $$'
	},
	{	id: 'la-2',
		eqn: 'z == x^2 - y^2',
		eqn_comp: function(x, y) {
			return x * x - y * y;
		},
		conditions: '2*x - y - 3',
		intersect_type: 'explicit',
		intersection: [
			function(x) {
				return 2*x - 3;
			},
			function(x) {
				return (-3)*x*x + 12*x - 9;
			}
		],
		conditions_form: [
			function(x, y) {
				return 2*x - y - 3;
			}
		],
		cond_type: 'explicit',
		conditions_comp: [
			function(x) {
				return 2*x - 3;
			}
		],
		lambda: [-2],
		extr_points: {x: [2], y: [1]},
		info:
		'<strong> Number </strong> \
		<br />Find local extremums in following conditions: \
		$$ 2x - y - 3 = 0 $$'
	}
];