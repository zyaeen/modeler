package com.example.application.views.main;

import com.example.application.network.*;
import com.example.application.parsing.XmlObject;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.component.upload.Upload;
import com.vaadin.flow.component.upload.receivers.MultiFileMemoryBuffer;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.RequestHandler;
import com.vaadin.flow.server.VaadinRequest;
import com.vaadin.flow.server.VaadinResponse;
import com.vaadin.flow.server.VaadinSession;
import org.apache.commons.io.IOUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@PageTitle("Main")
@Route(value = "")
public class MainView extends VerticalLayout {

    private TextField nodeIdField;
    private TextField edgeLabel;

    private List<VisJsEdge> edges = new ArrayList<>();;
    private VisJs visJs;
    private List<VisJsNode> nodes = new ArrayList<>();

    private List<NodeType> nodeTypes = new ArrayList<>();

    private Boolean uploadFromFile = false;

    private Integer lastIndex;

    @Autowired
    public MainView(NodeRepository nodeRepository, EdgeRepository edgeRepository, NodeTypeRepository nodeTypeRepository) throws JsonProcessingException {


        Iterable<NodeType> iterableNodeTypes = nodeTypeRepository.findAll();
        iterableNodeTypes.forEach(nodeTypes::add);

        ComboBox<NodeType> select = new ComboBox<>("Select node type");
        select.setItems(nodeTypes);
        select.setItemLabelGenerator(NodeType::getLabel);

        Iterable<VisJsEdge> iterableEdges = edgeRepository.findAll();
        iterableEdges.forEach(edges::add);

        Iterable<VisJsNode> iterator = nodeRepository.findAll();
        iterator.forEach(nodes::add);

        lastIndex = nodes.stream().max(Comparator.comparing(VisJsNode::getId)).get().getId();

        ComboBox<VisJsNode> connectToNode = new ComboBox<>("Connect to");
        connectToNode.setEnabled(false);

        ComboBox<Boolean> edgeType = new ComboBox<>("Connection multiplicity");
        edgeType.setItems(true, false);
        edgeType.setItemLabelGenerator(item -> item ? "Many" : "One");

        select.addValueChangeListener(
            comboBoxNodeTypeComponentValueChangeEvent -> {
                NodeType type = null;
                type = comboBoxNodeTypeComponentValueChangeEvent.getValue();

                if (type != null) {
                    List<VisJsNode> list = new ArrayList<>();
                    Integer typeId = type.getType();

                    switch (typeId) {
                        case 1:
                        case 3:
                            for (VisJsNode node : nodes) {
                                if (node.getType() != 1 && node.getType() != 3) {
                                    list.add(node);
                                }
                            }
                            break;
                        default:
                            for (VisJsNode node : nodes) {
                                if (node.getType() != 2 && node.getType() != 4 && node.getType() != 6 && node.getType() != 5) {
                                    list.add(node);
                                }
                            }
                            break;
                    }
                    connectToNode.setItems(list);
                    connectToNode.setItemLabelGenerator(VisJsNode::getLabel);
                    connectToNode.setEnabled(true);
                } else {
                    connectToNode.setEnabled(false);
                }

            }
        );

        visJs = new VisJs(edges, nodes);
        Button addButton = new Button("Add node");

        Button loadDataToXml = new Button("Load data to XML");
        loadDataToXml.setEnabled(false);

        nodeIdField = new TextField("Node label:");
        edgeLabel = new TextField("Connection name");

        MultiFileMemoryBuffer multiFileMemoryBuffer = new MultiFileMemoryBuffer();
        Upload multiFileUpload = new Upload(multiFileMemoryBuffer);

        multiFileUpload.addSucceededListener(event -> {
            // Determine which file was uploaded
            String fileName = event.getFileName();

            // Get input stream specifically for the finished file
            InputStream fileData = multiFileMemoryBuffer.getInputStream(fileName);
            long contentLength = event.getContentLength();
            String mimeType = event.getMIMEType();

            XmlObject xmlObject = new XmlObject(fileData);
            xmlObject.getKnots();
            xmlObject.getAnchors();
            xmlObject.getTies();
//            System.out.println(xmlObject.knotList);
//            System.out.println(xmlObject.anchorList);
//            System.out.println(xmlObject.attributeList);
//            System.out.println(xmlObject.tieList);
//            System.out.println("---------");
//            System.out.println(xmlObject.edgeList);

            edges = new ArrayList<>();
            nodes = new ArrayList<>();

            edges.addAll(xmlObject.edgeList);
            nodes.addAll(xmlObject.knotList);
            nodes.addAll(xmlObject.anchorList);
            nodes.addAll(xmlObject.attributeList);
            nodes.addAll(xmlObject.tieList);

            try {
                visJs.refresh(edges, nodes);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }

            uploadFromFile = true;

            loadDataToXml.setEnabled(true);

            // Do something with the file data
            // processFile(fileData, fileName, contentLength, mimeType);
        });

        addButton.addClickListener(
            click -> {
                try {
                    addNode(
                        nodeIdField.getValue(),
                        connectToNode.getValue().getId().toString(),
                        edgeLabel.getValue(),
                        edgeType.getValue(),
                        select.getValue(),
                        nodeRepository,
                        edgeRepository
                    );
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
            }
        );
        loadDataToXml.addClickListener(
            buttonClickEvent -> {
                getNodesCoordinates();
                VaadinSession.getCurrent().addRequestHandler(
                    (
                        new RequestHandler() {
                            @Override
                            public boolean handleRequest(VaadinSession session,
                                VaadinRequest request,
                                VaadinResponse response)
                                throws IOException {
                                if ("/download".equals(request.getPathInfo())) {
                                    response.setContentType("text/plain");
                                    response.getWriter().append(
                                        "Here's some dynamically generated content.\n");
                                    response.getWriter().format(Locale.ENGLISH,
                                        "Time: %Tc\n", new Date());

                                    String theString = IOUtils.toString(request.getInputStream(), StandardCharsets.UTF_8);
                                    JSONObject jsonObject = new JSONObject(theString);
                                    Iterator<String> keys = jsonObject.keys();

                                    while (keys.hasNext()){
                                        String key = keys.next();
                                        if (jsonObject.get(key) instanceof JSONObject) {
                                            int index = nodes.indexOf(
                                                nodes.stream().filter(
                                                    visJsNode -> visJsNode.getId() == ((JSONObject) jsonObject.get(key)).get("id")
                                                ).collect(Collectors.toList()).get(0)
                                            );
                                            nodes.get(index).setXYAndFixed(
                                                Double.parseDouble(((JSONObject) jsonObject.get(key)).get("x").toString()),
                                                Double.parseDouble(((JSONObject) jsonObject.get(key)).get("y").toString()),
                                                Boolean.parseBoolean(((JSONObject) jsonObject.get(key)).get("fixed").toString())
                                            );
                                        }
                                    }

                                    return true;
                                } else
                                    return false;
                            }
                        })
                );
            }
        );
        add(
            visJs,
            new HorizontalLayout(
                select,
                connectToNode,
                nodeIdField,
                edgeLabel,
                edgeType
                ),
            addButton,
            new HorizontalLayout(
                multiFileUpload,
                loadDataToXml
            )
        );
    }
    public void getNodesCoordinates(){
        visJs.getNodesCoordinates();
    }
    public void addNode(
        String nodeId,
        String connectTo,
        String edgeLabel,
        Boolean edgeType,
        NodeType type,
        NodeRepository nodeRepository,
        EdgeRepository edgeRepository) throws JsonProcessingException {

        VisJsNode newNode;

        if (!uploadFromFile) {
            lastIndex++;
            newNode = new VisJsNode(lastIndex, type.getType(), nodeId);
        } else {
            newNode = new VisJsNode(type.getType(), nodeId);
        }

        VisJsEdge newEdge = new VisJsEdge(
            newNode.getId(),
            Integer.parseInt(connectTo),
            edgeLabel,
            edgeType
        );

        if (!uploadFromFile)
        {
            nodeRepository.save(newNode);
            edgeRepository.save(newEdge);
        }

        nodes.add(newNode);
        edges.add(newEdge);
        visJs.addNode(newNode, newEdge);

        System.out.println(nodes);
        System.out.println(edges);

    }


}
