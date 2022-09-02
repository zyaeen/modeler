import {DataSet, Network} from "vis";

class VisJsTest {
    init(element, edges, nodes) {
        this.element = element;

        var loadedNodes = JSON.parse(nodes);
        console.log(loadedNodes);

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


        this.data = {
            nodes: this.nodes,
            edges: this.edges,
        };
        var options = {};
        this.network = new Network(this.container, this.data, options);

        // this.network.on( 'click', function(properties) {
        //     var ids = properties.nodes;
        //     console.log(ids);
        //     // var clickedNodes = this.nodes.get(ids);
        //     // console.log('clicked nodes:', clickedNodes);
        // });
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
                node["color"] = "#c0c0c0";
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
                node["shape"] = "circle";
                break
            }
        }
        return node;
    }

    addEdge(newNode, newEdge){

        var node = JSON.parse(newNode);
        console.log(node);
        node = this.fillNode(node);
        console.log(node);
        try {
            this.network.body.data.nodes.add([node])
        } catch (err) {
            console.log(err);
        }
        try {
            this.network.body.data.edges.add([{from: node['id'], to: newEdge, color: { color: "#000000"}}])
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