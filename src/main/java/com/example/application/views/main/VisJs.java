package com.example.application.views.main;


import com.example.application.network.Edge;
import com.example.application.network.Node;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.dependency.NpmPackage;

import java.util.List;

@JsModule("./visjs-test.js")
@NpmPackage(value = "vis", version = "0.110.0")
@Tag("canvas")
public class VisJs extends Component {

    public VisJs(List<Edge> edges, List<Node> nodes) throws JsonProcessingException {
        ObjectWriter owForEdges = new ObjectMapper().writer().withDefaultPrettyPrinter();
        ObjectWriter owForNodes = new ObjectMapper().writer().withDefaultPrettyPrinter();

        String jsonEdges = owForEdges.writeValueAsString(edges);
        String jsonNodes = owForNodes.writeValueAsString(nodes);
        getElement().executeJs("window.initThree($0, $1, $2)", this, jsonEdges, jsonNodes);
    }
    public VisJs(){

    }

    public void addNode(Integer nodeId, Integer connectToNodeId) {
        getElement().executeJs("window.addEdge($0, $1, $2)", this, nodeId, connectToNodeId);
    }
}
