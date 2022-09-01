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

@PageTitle("Main")
@Route(value = "")
public class MainView extends VerticalLayout {

    private TextField nodeIdField;
    private TextField connectToNodeField;

    private List<Edge> edges;
    private VisJs visJs;
    private List<Node> nodes;

    public MainView() throws JsonProcessingException {

        edges = new ArrayList<>(Arrays.asList(
                new Edge(1, 3),
                new Edge(1, 2),
                new Edge(2, 4),
                new Edge(2, 5),
                new Edge(3, 3)
        ));
        nodes = new ArrayList<>(Arrays.asList(
                new Node(1),
                new Node(2),
                new Node(3),
                new Node(4),
                new Node(5)
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

        nodes.add(newNode);
        edges.add(newEdge);
        visJs.addNode(Integer.parseInt(nodeId), Integer.parseInt(connectTo));
    }


}
