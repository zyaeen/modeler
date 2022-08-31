package com.example.application.views.main;

import com.example.application.network.Edge;
import com.example.application.network.Node;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@PageTitle("Main")
@Route(value = "")
public class MainView extends VerticalLayout {

    private TextField nodeIdField;
    private TextField connectToNodeField;

    private List<Map<String, Integer>> edges;
    private VisJs visJs;
    private List<Map<String, Object>> nodes;

    public MainView() throws JsonProcessingException {

        edges = new ArrayList<>(Arrays.asList(
                new Edge(1, 3).getMap(),
                new Edge(1, 2).getMap(),
                new Edge(2, 4).getMap(),
                new Edge(2, 5).getMap(),
                new Edge(3, 3).getMap()
        ));
        nodes = new ArrayList<>(Arrays.asList(
                new Node(1).getMap(),
                new Node(2).getMap(),
                new Node(3).getMap(),
                new Node(4).getMap(),
                new Node(5).getMap()
        ));
        visJs = new VisJs(edges, nodes);
        Button addButton = new Button("Add node");

        nodeIdField = new TextField("Node ID:");
        connectToNodeField = new TextField("Connect to:");
        addButton.addClickListener(click -> addNode(nodeIdField.getValue(), connectToNodeField.getValue()));
        add(visJs, new HorizontalLayout(nodeIdField, connectToNodeField), addButton);
    }

    public void addNode(String nodeId, String connectTo) {


        Node newNode = new Node(Integer.parseInt(nodeId));
        Edge newEdge = new Edge(Integer.parseInt(nodeId), Integer.parseInt(connectTo));

        nodes.add(newNode.getMap());
        edges.add(newEdge.getMap());
        visJs.addNode(Integer.parseInt(nodeId), Integer.parseInt(connectTo));
    }


}
