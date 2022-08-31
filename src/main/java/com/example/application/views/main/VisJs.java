package com.example.application.views.main;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.dependency.NpmPackage;

import java.util.List;
import java.util.Map;

@JsModule("./visjs-test.js")
@NpmPackage(value = "vis", version = "0.110.0")
@Tag("canvas")
public class VisJs extends Component {

    public VisJs(List<Map<String, Integer>> edges, List<Map<String, Object>> nodes) throws JsonProcessingException {
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        String jsonEdges = ow.writeValueAsString(edges);
        String jsonNodes = ow.writeValueAsString(nodes);
        getElement().executeJs("window.initThree($0, $1, $2)", this, jsonEdges, jsonNodes);
    }

    public void addNode(Integer nodeId, Integer connectToNodeId) {
        getElement().executeJs("window.addEdge($0, $1, $2)", this, nodeId, connectToNodeId);
    }
}
