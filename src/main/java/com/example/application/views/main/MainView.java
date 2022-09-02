package com.example.application.views.main;

import com.example.application.network.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

@PageTitle("Main")
@Route(value = "")
public class MainView extends VerticalLayout {

    private TextField nodeIdField;
    private TextField connectToNodeField;

    private List<Edge> edges = new ArrayList<>();;
    private VisJs visJs;
    private List<Node> nodes = new ArrayList<>();

    private List<NodeType> nodeTypes = new ArrayList<>();

    @Autowired
    public MainView(NodeRepository nodeRepository, EdgeRepository edgeRepository, NodeTypeRepository nodeTypeRepository) throws JsonProcessingException {


        Iterable<NodeType> iterableNodeTypes = nodeTypeRepository.findAll();
        iterableNodeTypes.forEach(nodeTypes::add);

        ComboBox<NodeType> select = new ComboBox<>("Select node type");
        select.setItems(nodeTypes);
        select.setItemLabelGenerator(NodeType::getLabel);

        Iterable<Edge> iterableEdges = edgeRepository.findAll();
        iterableEdges.forEach(edges::add);

        Iterable<Node> iterator = nodeRepository.findAll();
        iterator.forEach(nodes::add);

        visJs = new VisJs(edges, nodes);
        Button addButton = new Button("Add node");

        nodeIdField = new TextField("Node ID:");
        connectToNodeField = new TextField("Connect to:");
        addButton.addClickListener(
                click -> {
                    try {
                        addNode(
                                nodeIdField.getValue(),
                                connectToNodeField.getValue(),
                                select.getValue(),
                                nodeRepository,
                                edgeRepository
                        );
                    } catch (JsonProcessingException e) {
                        throw new RuntimeException(e);
                    }
                });
        add(
                visJs,
                new HorizontalLayout(
                        nodeIdField,
                        connectToNodeField,
                        select
                ),
                addButton
        );
    }

    public void addNode(
            String nodeId,
            String connectTo,
            NodeType type,
            NodeRepository nodeRepository,
            EdgeRepository edgeRepository) throws JsonProcessingException {


        Node newNode = new Node(Integer.parseInt(nodeId), type.getType());
        Edge newEdge = new Edge(Integer.parseInt(nodeId), Integer.parseInt(connectTo));

        nodeRepository.save(newNode);
        edgeRepository.save(newEdge);

        nodes.add(newNode);
        edges.add(newEdge);
        visJs.addNode(newNode, Integer.parseInt(connectTo));
    }


}
