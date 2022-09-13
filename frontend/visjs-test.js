import {DataSet, Network} from "vis";

class VisJsTest {
    init(element, edges, nodes) {
        this.element = element;

        var loadedNodes = JSON.parse(nodes);
        this.historicalAttributes = [];
        this.historicalTies = [];

        var _this = this;

        var step;
        for (step = 0; step < loadedNodes.length; step++) {
            loadedNodes[step] = this.fillNode(loadedNodes[step]);
        }

        this.nodes = new DataSet(loadedNodes);

        var loadedEdges = JSON.parse(edges);
        for (step = 0; step < loadedEdges.length; step++) {
            loadedEdges[step] = this.fillEdge(loadedEdges[step]);
        }

        this.edges = new DataSet(loadedEdges);


        this.container = document.getElementById("outlet");

        this.checked = [];

        this.data = {
            nodes: this.nodes,
            edges: this.edges,
        };
        var options = {};
        this.network = new Network(this.container, this.data, options);
        var historicalAttributes = this.historicalAttributes;
        var historicalTies = this.historicalTies;
        this.network.on("afterDrawing", function (ctx) {
            for (step = 0; step < _this.historicalAttributes.length; step++) {
                var nodePosition = this.getPositions([_this.historicalAttributes[step]]);
                ctx.strokeStyle = '#f66';
                ctx.lineWidth = 2;
                ctx.circle(nodePosition[_this.historicalAttributes[step]].x, nodePosition[_this.historicalAttributes[step]].y, 15);
                ctx.stroke();
            }

            for (step = 0; step < _this.historicalTies.length; step++) {
                var nodePosition = this.getPositions([_this.historicalTies[step]]);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.diamond(nodePosition[_this.historicalTies[step]].x, nodePosition[_this.historicalTies[step]].y, 20);
                ctx.stroke();

            }
            for (step = 0; step < _this.checked.length; step++) {
                var nodePosition = this.getPositions([_this.checked[step]]);
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 4;
                ctx.circle(nodePosition[_this.checked[step]].x, nodePosition[_this.checked[step]].y, 2);
                ctx.stroke();

            }
        })
        this.network.on( 'doubleClick', function(properties) {
            var ids = properties.nodes;
            if (ids.length > 0) {
                if (_this.checked.includes(ids[0])) {
                    var node = this.body.data.nodes._data[ids[0]];
                    node["fixed"] = false;
                    this.body.data.nodes.update(node);
                    const index = _this.checked.indexOf(ids[0]);
                    _this.checked.splice(index, 1);
                } else {
                    _this.checked.push(ids[0]);
                    var node = this.body.data.nodes._data[ids[0]];
                    node["fixed"] = true;
                    var pos = this.getPositions([ids[0]]);
                    node["x"] = pos[ids[0]].x;
                    node["y"] = pos[ids[0]].y;
                    this.body.data.nodes.update(node);
                }
            }
        });
        this.network.on('dragStart', function(properties) {
            var ids = properties.nodes;
            if (ids.length > 0) {
                var node = this.body.data.nodes._data[ids[0]];
                node["fixed"] = false;
                var pos = this.getPositions([ids[0]]);
                node["x"] = pos[ids[0]].x;
                node["y"] = pos[ids[0]].y;
                this.body.data.nodes.update(node);
            }
        });
        this.network.on('dragEnd', function(properties) {
            var ids = properties.nodes;

            if (ids.length > 0) {
                if (_this.checked.includes(ids[0])) {
                    var node = this.body.data.nodes._data[ids[0]];
                    node["fixed"] = true;
                    var pos = this.getPositions([ids[0]]);
                    node["x"] = pos[ids[0]].x;
                    node["y"] = pos[ids[0]].y;
                    this.body.data.nodes.update(node);
                }
            }
        });
    }

    redraw(element, edges, nodes) {

        var loadedNodes = JSON.parse(nodes);
        this.historicalAttributes = [];
        this.historicalTies = [];

        this.checked = [];

        var step;
        for (step = 0; step < loadedNodes.length; step++) {
            loadedNodes[step] = this.fillNode(loadedNodes[step]);
        }

        this.nodes = new DataSet(loadedNodes);

        var loadedEdges = JSON.parse(edges);
        for (step = 0; step < loadedEdges.length; step++) {
            loadedEdges[step] = this.fillEdge(loadedEdges[step]);
        }

        this.edges = new DataSet(loadedEdges);

        this.data = {
            nodes: this.nodes,
            edges: this.edges,
        };

        this.network.body.data.edges.clear();
        this.network.body.data.nodes.clear();


        this.network.body.data.edges.update(
          loadedEdges
        );
        this.network.body.data.nodes.update(
          loadedNodes
        );
    }

    fillEdge(edge){
        edge['color'] = {'color': "#000000"};
        return edge;
    }
    fillNode(node){
        switch (node["type"]){
            case 1: {
                node["color"] = "#f66";
                node["shape"] = "square";
                break
            }
            case 2:{
                node["color"] =  {
                    border: "#c0c0c0",
                    background: '#c0c0c0'
                };
                node["shape"] = "diamond";
                break
            }
            case 3: {
                node["color"] = {
                    border: "#f66",
                    background: '#ffffff'
                };
                node["borderWidth"] = 2;
                node["shape"] = "square";
                node["scaling"] =  {
                    label: {
                        enabled: true,
                        min: 50,
                        max: 50
                    }
                };
                break
            }
            case 4: {
                node["color"] = {
                    border: "#f66",
                    background: '#ffffff'
                };
                node["borderWidth"] = 2;
                node["shape"] = "dot";
                break
            }
            case 5: {
                node["color"] = {
                    border: "#c0c0c0",
                    background: '#c0c0c0'
                };
                node["borderWidth"] = 2;
                node["shape"] = "diamond";
                node["scaling"] =  {
                    label: {
                        enabled: true,
                        min: 50,
                        max: 50
                    }
                };
                this.historicalTies.push(node["id"])
                break
            }
            case 6: {
                node["color"] = {
                    border: "#f66",
                    background: '#ffffff'
                };
                node["borderWidth"] = 2;
                node["shape"] = "dot";
                this.historicalAttributes.push(node["id"]);
                break
            }
        }
        if (node["fixed"] === true) {
            this.checked.push(node["id"]);
        }
        return node;
    }

    addEdge(newNode, newEdge){

        var node = JSON.parse(newNode);
        var edge = JSON.parse(newEdge);

        node = this.fillNode(node);
        edge = this.fillEdge(edge)
        try {
            this.network.body.data.nodes.update(node)
        } catch (err) {
            console.log(err);
        }
        try {
            this.network.body.data.edges.update(edge)
        } catch (err) {
            console.log(err);
        }
    }
    getCoordinates(element){

        const url = 'http://localhost:8080/download';

        try {
            const response =  fetch(url, {
                method: 'POST', // или 'PUT'
                body: JSON.stringify(this.network.body.data.nodes._data), // данные могут быть 'строкой' или {объектом}!
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(this.network.body.data.nodes)
            const json = response;
            console.log('Успех:', json);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

}

const tt = new VisJsTest();


window.initThree = function(element, edges, nodes) {
    tt.init(element, edges, nodes);
};

window.addEdge = function (element, newNodeId, nodeToConnectId){
    tt.addEdge(newNodeId, nodeToConnectId);
}

window.redraw = function(element, edges, nodes) {
    tt.redraw(element, edges, nodes);
};

window.getCoordinates = function(element) {
    tt.getCoordinates(element);
};