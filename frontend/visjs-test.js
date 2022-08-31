import {DataSet, Network} from "vis";

class VisJsTest {
    init(element, edges, nodes) {
        this.element = element;

        this.nodes = new DataSet(JSON.parse(nodes));
        this.edges = new DataSet(JSON.parse(edges));

        this.container = document.getElementById("outlet");
        this.data = {
            nodes: this.nodes,
            edges: this.edges,
        };
        var options = {};
        this.network = new Network(this.container, this.data, options);
    }
    addEdge(newNodeId, newEdge){
        console.log("тут");
        try {
            this.network.body.data.nodes.add([{id: newNodeId, label: "Node " + newNodeId.toString()}])
        } catch (err) {
            console.log(err);
        }
        try {
            this.network.body.data.edges.add([{from: newNodeId, to: newEdge}])
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