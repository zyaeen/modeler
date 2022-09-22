import {DataSet, Network} from "vis";

class VisJsTest {
    init(element, edges, nodes) {

        this.element = element;
        var _this = this;

        this.draw(element, edges, nodes);

        this.container = document.getElementById("customId");

        document.addEventListener('contextmenu', event => event.preventDefault());

        var options = {};
        this.network = new Network(this.container, this.data, options);
        var historicalAttributes = this.historicalAttributes;
        var historicalTies = this.historicalTies;
        var step;
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
        this.network.on( 'oncontext', function(properties) {

            var a = this.getNodeAt(properties.pointer.DOM);
            var b = this.getEdgeAt(properties.pointer.DOM)

            if (b != null){

            }

            const url = 'http://localhost:8080/down';

            if (a != null){
                try {
                    const response =  fetch(url, {
                        method: 'POST', // или 'PUT'
                        body: a.toString(), // данные могут быть 'строкой' или {объектом}!
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const json = response;
                    console.log('Успех:', json);
                } catch (error) {
                    console.error('Ошибка:', error);
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

    draw(element, edges, nodes){
        this.loadedNodes = JSON.parse(nodes);
        this.historicalAttributes = [];
        this.historicalTies = [];

        this.checked = [];

        var step;
        for (step = 0; step < this.loadedNodes.length; step++) {
            this.loadedNodes[step] = this.fillNode(this.loadedNodes[step]);
        }

        this.nodes = new DataSet(this.loadedNodes);

        this.loadedEdges = JSON.parse(edges);
        for (step = 0; step < this.loadedEdges.length; step++) {
            this.loadedEdges[step] = this.fillEdge(this.loadedEdges[step]);
        }

        this.edges = new DataSet(this.loadedEdges);

        this.data = {
            nodes: this.nodes,
            edges: this.edges,
        };
    }

    redraw(element, edges, nodes) {

        this.draw(element, edges, nodes);

        this.network.body.data.edges.clear();
        this.network.body.data.nodes.clear();

        this.network.body.data.edges.update(
          this.loadedEdges
        );
        this.network.body.data.nodes.update(
          this.loadedNodes
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

        if (node != null){
            node = this.fillNode(node);
        }
        if (edge != null){
            edge = this.fillEdge(edge);
        }
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
            console.log('Успех:', response);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }
    updateNode(element, node){
        var node = JSON.parse(node);
        try {
            this.network.body.data.nodes.update(node)
        } catch (err) {
            console.log(err);
        }
    }
    deleteNode(element, node){
        var node = JSON.parse(node);
        try {
            this.network.body.data.nodes.update(node)
        } catch (err) {
            console.log(err);
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

window.updateNode = function (element, node){
    tt.updateNode(element, node)
}

window.deleteNode = function (element, node){
    tt.deleteNode(element, node)
}