    //app.Plotter1 = app.Plotter({});
    var plot = Plotter("plot");
    //раскомментируйте эту строчку, если нужен второй график
    //var plot2 = Plotter(id2);

    function testfunc() {

        //****************************ГЛОБАЛЬНЫЕ_ПЕРЕМЕННЫЕ**************************************
        var leftborder = -10; //левая граница графика
        var rightborder = 10;//правая граница графика
        function func(x) { }; //текущая функция
        var funcgraph = {};//текущий график
        function funcdiff(x) { };//текущая производная
        var funcdiffgraph = plot.addFunc(function(x){return -2*x*Math.exp(-x*x);});


        //*************************ПОЛЕЗНЫЕ_ДИСКРЕТНЫЕ_ФУНКЦИИ*************************
        function factorial(n) {
            if (n == 1 || n == 0) {
                return 1;
            }
            else {
                return factorial(n - 1) * n;
            }
        }

        function C(n, k) {
            return factorial(n) / (factorial(k) * factorial(n - k));
        }

        //так же Math.sin  и Math.log


        function Koshi_example(x) {
            if (x == 0)
            {
                return 0;
            }
            return Math.exp(-1 / x / x);
        }


        //*****************************ИНТЕРФЕЙС-КНОПКИ********************************
        //Исследуемые функции
        
        controls.addButton(function () {//кнопка функции
            if (funcdiffgraph) { plot.removeFunc(funcdiffgraph); }
            counter = 0;
            if (funcgraph) { plot.removeFunc(funcgraph); }
            leftborder = undefined;
            rightborder = undefined;
            funcgraph = plot.addFunc(Koshi_example, leftborder, rightborder);
            func = Koshi_example;
        }, "\\(e^{- \\frac{1}{x^2}}\\)");
        //*****************************ДИФФЕРЕНЦИРОВАНИЕ_ФУНКЦИЙ********************************
        function testf(x)//тестовая функция
        {
            return x * x / 2;
        }
        
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
        function dcountKoshi() {
            return function (x) {
                var res = 0;
                for (var i = 0; i < q; ++i) {
                    res += TableKoshi[q-1][i][0] * (Math.pow(x, TableKoshi[q-1][i][1]));
                }
                res *= Koshi_example(x);
                return res;
            }
        }


    //***************************************ДИФФЕРЕНЦИРОВАНИЕ_ИНТЕРФЕЙС*********************************************************************
    var counter = 0;//счетчик текущей производной



    Controls.addButton(function () {
        if (counter >= 0) {
            counter++;
            if (counter > 1) {
                plot.removeFunc(funcdiffgraph);
                dStepKoshi();
            }
            funcdiff = dcountKoshi();
            funcdiffgraph = plot.addFunc(dcountKoshi(), leftborder, rightborder, { color: 1, width: 2 });
        }
    }, "\\(f^{(n)}\\)");//кнопка аналитической производной

    Controls.addButton(function () {
        if (counter == 1) {
            counter--;
            plot.removeFunc(funcdiffgraph);
        }
        else if (counter > 1) {
            counter--;
            plot.removeFunc(funcdiffgraph);
            dStepBackKoshi();
            funcdiff = dcountKoshi();
            funcdiffgraph = plot.addFunc(dcountKoshi(), leftborder, rightborder, { color: 1, width: 2 });
        }

    }, "\\(f^{(n-1)}\\)");//кнопка аналитической производной


}


    testfunc();
