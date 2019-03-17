var board = JXG.JSXGraph.initBoard('box', { boundingbox: [-10, 10, 10, -10], axis: true });
var b = JXG.JSXGraph.initBoard('box', { boundingbox: [-5, 2, 5, -2] });
var p1 = b.createElement('point', [-1, 0], { name: 'A', size: 4, face: 'o', fillColor: "yellow", strokeColor: "yellow" });
var p2 = b.createElement('point', [-1, -1], { name: 'B', size: 4, face: 'o', fillColor: 'yellow', strokeColor: "yellow" });
var ci3 = b.create('circle', [p1, p2],
    { strokeWidth: 1, fillColor: '#603CBA', fillOpacity: function () { return p2.X() * 0.25; } });
