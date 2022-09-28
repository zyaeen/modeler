package com.example.application.views.main;

import com.example.application.modals.DialogManager;
import com.example.application.network.*;
import com.example.application.parsing.XmlObject;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.contextmenu.ContextMenu;
import com.vaadin.flow.component.contextmenu.MenuItem;
import com.vaadin.flow.component.contextmenu.SubMenu;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.html.Hr;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.menubar.MenuBarVariant;
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


import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@PageTitle("Main")
@Route(value = "")
public class MainView extends VerticalLayout {

    private TextField nodeLabelField;
    private TextField edgeLabel;


    private List<VisJsEdge> edges = new ArrayList<>();;
    private VisJs visJs;
    private List<VisJsNode> nodes = new ArrayList<>();
    private List<NodeType> nodeTypes = new ArrayList<>();
    private Boolean uploadFromFile = false;
    private Integer lastIndex;
    private List<VisJsNode> newNodes = new ArrayList<>();
    private List<VisJsEdge> newEdges = new ArrayList<>();;

    private UI ui;
    private String editableNodeId = null;
    private Dialog nonTieCreationDialog;
    private Dialog tieCreationDialog;
    private Dialog attributeCreationDialog;
    private Dialog creationDialog;
    private Dialog nonTieEditDialog;
    private Dialog tieEditDialog;
    private Dialog attributeEditDialog;
    private XmlObject xmlObject;
    private DialogManager dialogManager;

    @Autowired
    public MainView(NodeRepository nodeRepository, EdgeRepository edgeRepository, NodeTypeRepository nodeTypeRepository)
        throws JsonProcessingException, FileNotFoundException {

        setId("mainview");

        Iterable<NodeType> iterableNodeTypes = nodeTypeRepository.findAll();
        iterableNodeTypes.forEach(nodeTypes::add);

//        ComboBox<NodeType> selectNodeType = new ComboBox<>("Select node type");
//        selectNodeType.setItems(nodeTypes);
//        selectNodeType.setItemLabelGenerator(NodeType::getLabel);
//
//        Iterable<VisJsEdge> iterableEdges = edgeRepository.findAll();
//        iterableEdges.forEach(edges::add);
//
//        Iterable<VisJsNode> iterator = nodeRepository.findAll();
//        iterator.forEach(nodes::add);

        dialogManager = new DialogManager(nodeTypes);
        ContextMenu menu = new ContextMenu();

//        ComboBox<VisJsNode> connectToNode = new ComboBox<>("Connect to");
//        connectToNode.setEnabled(false);
//
//        nodeLabelField = new TextField("Node label:");
//        nodeLabelField.setRequired(true);
//
//        edgeLabel = new TextField("Connection name");
//        edgeLabel.setRequired(true);
//
//        ComboBox<Boolean> edgeType = new ComboBox<>("Connection multiplicity");
//        edgeType.setItems(true, false);
//        edgeType.setItemLabelGenerator(item -> item ? "Many" : "One");
//        edgeType.setValue(true);
//
//        Button addButton = new Button("Add node");

        MultiFileMemoryBuffer multiFileMemoryBuffer = new MultiFileMemoryBuffer();
        Upload multiFileUpload = new Upload(multiFileMemoryBuffer);
        multiFileUpload.setDropAllowed(false);
        Button plusButton = new Button("Load from XML");
        plusButton.addThemeVariants(ButtonVariant.LUMO_TERTIARY, ButtonVariant.LUMO_CONTRAST, ButtonVariant.MATERIAL_CONTAINED, ButtonVariant.LUMO_SMALL);
        multiFileUpload.setUploadButton(plusButton);

        Button loadDataToXml = new Button("Download to ...");
        loadDataToXml.addThemeVariants(ButtonVariant.LUMO_TERTIARY, ButtonVariant.LUMO_CONTRAST, ButtonVariant.MATERIAL_CONTAINED, ButtonVariant.LUMO_SMALL);

        nonTieCreationDialog = dialogManager.createCreationDialog("Add new node", 1);
        tieCreationDialog = dialogManager.createCreationDialog("Add new node", 2);
        attributeCreationDialog = dialogManager.createCreationDialog("Add new node", 4);


        nonTieEditDialog = dialogManager.createEditDialogForAnchorNode("Edit node", 1);
        tieEditDialog = dialogManager.createEditDialogForTie("Edit node", 2);
        attributeEditDialog = dialogManager.createEditDialogForAttribute("Edit node", 4);

        creationDialog = dialogManager.createCreationDialog("Edit node", 7);

        InputStream fileData = new FileInputStream("src/main/resources/xmls/downloaded.xml");

        readXml(fileData);

        lastIndex = nodes.stream().max(Comparator.comparing(VisJsNode::getId)).get().getId();
        visJs = new VisJs(edges, nodes);



        //        selectNodeType.addValueChangeListener(
//            comboBoxNodeTypeComponentValueChangeEvent -> {
//                NodeType type = null;
//                type = comboBoxNodeTypeComponentValueChangeEvent.getValue();
//
//                if (type != null) {
//                    List<VisJsNode> list = new ArrayList<>();
//                    Integer typeId = type.getId();
//
//                    switch (typeId) {
//                        case 1:
//                        case 3:
//                            for (VisJsNode node : nodes) {
//                                if (node.getType() != 1 && node.getType() != 3) {
//                                    list.add(node);
//                                }
//                            }
//                            break;
//                        default:
//                            for (VisJsNode node : nodes) {
//                                if (node.getType() != 2 && node.getType() != 4 && node.getType() != 6 && node.getType() != 5) {
//                                    list.add(node);
//                                }
//                            }
//                            break;
//                    }
//                    connectToNode.setItems(list);
//                    connectToNode.setItemLabelGenerator(VisJsNode::getLabel);
//                    connectToNode.setEnabled(true);
//                } else {
//                    connectToNode.setEnabled(false);
//                }
//            }
//        );

        multiFileUpload.addSucceededListener(event -> {

            String fileName = event.getFileName();

            InputStream loadedIs = multiFileMemoryBuffer.getInputStream(fileName);

            readXml(loadedIs);

            try {
                visJs.refresh(edges, nodes);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }

            menu.close();

            uploadFromFile = true;
        });

//        addButton.addClickListener(
//            click -> {
//                try {
//                    if (selectNodeType.getValue() == null || connectToNode.getValue() == null ||
//                        Objects.equals(nodeLabelField.getValue(), "") || nodeLabelField.getValue() == null ||
//                        Objects.equals(edgeLabel.getValue(), "") || edgeLabel.getValue() == null
//                    ) {
//                        Notification notification = Notification.show("Заполните первые 4 поля!!!");
//                        notification.addThemeVariants(NotificationVariant.LUMO_ERROR);
//                    } else {
//
//                        VisJsNode newNode = new VisJsNode(
//                            selectNodeType.getValue().getId(),
//                            nodeLabelField.getValue(),
//                            nodeLabelField.getValue().substring(0,3)
//                        );
//                        VisJsEdge newEdge = new VisJsEdge(
//                            connectToNode.getValue().getId(),
//                            newNode.getId(),
//                            edgeLabel.getValue(),
//                            edgeType.getValue()
//                        );
//
//                        nodes.add(newNode);
//                        newNodes.add(newNode);
//
//                        edges.add(newEdge);
//                        newEdges.add(newEdge);
//
//                        visJs.addNode(newNode, newEdge);
//
////                        addNode(
////                            selectNodeType.getValue(),
////                            nodeLabelField.getValue().substring(0,3),
////                            nodeLabelField.getValue(),
////                            "",
////                            connectToNode.getValue().getId().toString(),
////                            edgeLabel.getValue(),
////                            edgeType.getValue(),
////                            nodeRepository,
////                            edgeRepository
////                        );
//                    }
//
//                } catch (JsonProcessingException e) {
//                    throw new RuntimeException(e);
//                }
//            }
//        );

        VaadinSession.getCurrent().addRequestHandler(
            (
                (RequestHandler) (session, request, response) -> {
                    if ("/down".equals(request.getPathInfo())) {

                        editableNodeId = IOUtils.toString(request.getInputStream(), StandardCharsets.UTF_8);

                        response.setContentType("text/plain");
                        response.getWriter().append(
                            "Here's some dynamically generated content.\n");
                        response.getWriter().format(Locale.ENGLISH,
                            "Time: %Tc\n", new Date());


                        return true;
                    } else
                        return false;
                })
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

                                            Integer nodeId = ((JSONObject) jsonObject.get(key)).getInt("id");
                                            Double x = ((JSONObject) jsonObject.get(key)).getDouble("x");
                                            Double y = ((JSONObject) jsonObject.get(key)).getDouble("y");
                                            Boolean fixed = ((JSONObject) jsonObject.get(key)).getBoolean("fixed");

                                            VisJsNode node = nodes.stream().filter(
                                                visJsNode -> visJsNode.getId().equals(nodeId)
                                            ).collect(Collectors.toList()).get(0);
                                            nodes.get(nodes.indexOf(node)).setXYAndFixed(
                                                x,
                                                y,
                                                fixed
                                            );

                                            List<VisJsNode> newNodeToCompare = newNodes.stream().filter(
                                                visJsNode -> visJsNode.getId().equals(nodeId)
                                            ).collect(Collectors.toList());
                                            if (newNodeToCompare.size() > 0) {
                                                newNodes.get(newNodes.indexOf(newNodeToCompare.get(0))).setXYAndFixed(
                                                    x,
                                                    y,
                                                    fixed
                                                );
                                            }
                                        }

                                    }
                                    try {
                                        xmlObject.writeToXml(nodes, edges);
                                    } catch (TransformerException | ParserConfigurationException e) {
                                        throw new RuntimeException(e);
                                    }
                                    return true;
                                } else
                                    return false;
                            }
                        })
                );
            }
        );



        nonTieCreationDialog.addOpenedChangeListener(
          dialogCloseActionEvent ->
          {
              handleCreationDialogClosing();
          }
        );
        tieCreationDialog.addOpenedChangeListener(
            dialogCloseActionEvent ->
            {
                handleCreationDialogClosing();
            }
        );
        attributeCreationDialog.addOpenedChangeListener(
            dialogCloseActionEvent ->
            {
                handleCreationDialogClosing();
            }
        );
        creationDialog.addOpenedChangeListener(
            dialogCloseActionEvent ->
            {
                handleCreationDialogClosing();
            }
        );

        nonTieEditDialog.addOpenedChangeListener(
            dialogCloseActionEvent ->
            {
                handleEditDialogClosing();
            }
        );

        tieEditDialog.addOpenedChangeListener(
            dialogCloseActionEvent ->
            {
                handleEditDialogClosing();
            }
        );
        attributeEditDialog.addOpenedChangeListener(
            dialogCloseActionEvent ->
            {
                handleEditDialogClosing();
            }
        );

        menu.addItem("Add new node",
            menuItemClickEvent -> {

            if (editableNodeId != null) {

                Integer nodeId = Integer.valueOf(editableNodeId);
                Integer nodeType = nodes.stream().filter(
                    visJsNode -> visJsNode.getId().equals(nodeId)
                ).collect(Collectors.toList()).get(0).getType();

                dialogManager.setNodeToAdd(nodeId);

                if (nodeType == 1) {
                    nonTieCreationDialog.open();
                } else if (nodeType == 2 || nodeType == 5) {
                    tieCreationDialog.open();
                } else if (nodeType == 4|| nodeType == 6)  {
                    attributeCreationDialog.open();
                }
            } else {
                creationDialog.open();
            }
        });
        menu.addItem("Edit", menuItemClickEvent -> {
            if (editableNodeId != null) {

//                dialogManager.setIsEditDialogClosed(false);

                Integer nodeId = Integer.valueOf(editableNodeId);
                VisJsNode node = nodes.stream().filter(
                    visJsNode -> visJsNode.getId().equals(nodeId)
                ).collect(Collectors.toList()).get(0);

                dialogManager.setNodeToEdit(node);

                if (node.getType() == 1 || node.getType() == 3) {
                    nonTieEditDialog.open();
                } else if (node.getType() == 2 || node.getType() == 5) {
                    tieEditDialog.open();
                } else if (node.getType() == 4|| node.getType() == 6)  {
                    attributeEditDialog.open();
                }
            }
        });

        menu.add(new Hr());
        menu.addItem("Delete", menuItemClickEvent -> {});
        menu.add(new Hr());

        MenuItem fileItem = menu.addItem("File");
        SubMenu subMenu = fileItem.getSubMenu();

        subMenu.add(multiFileUpload);
        subMenu.add(loadDataToXml);

        menu.setTarget(visJs);

        add(
//            new HorizontalLayout(
//                selectNodeType,
//                connectToNode,
//                nodeLabelField,
//                edgeLabel,
//                edgeType
//                ),
//            addButton,
//            new HorizontalLayout(
////                multiFileUpload,
//                loadDataToXml
//            ),
            visJs
        );
        add(nonTieCreationDialog);

    }
    public void getNodesCoordinates(){
        visJs.getNodesCoordinates();
    }


    public void readXml(InputStream fileData){

        xmlObject = new XmlObject(fileData);
        xmlObject.getKnots();
        xmlObject.getAnchors();
        xmlObject.getTies();

        edges = new ArrayList<>();
        nodes = new ArrayList<>();

        edges.addAll(xmlObject.edgeList);
        nodes.addAll(xmlObject.knotList);
        nodes.addAll(xmlObject.anchorList);
        nodes.addAll(xmlObject.attributeList);
        nodes.addAll(xmlObject.tieList);
    }
    public void handleEditDialogClosing(){
        if (dialogManager.getNodeToEdit() != null && !dialogManager.getIsEditDialogClosed()) {
            List<VisJsNode> list =
                nodes.stream().filter(visJsNode -> visJsNode.getId().equals(dialogManager.getNodeToEdit().getId())).collect(Collectors.toList());
            if (list.size() == 1) {
                try {
                    nodes.set(nodes.indexOf(list.get(0)), dialogManager.getNodeToEdit());
                    visJs.updateNode(
                        nodes.get(nodes.indexOf(list.get(0)))
                    );
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }

            }
        }
        editableNodeId = null;
        dialogManager.setIsEditDialogClosed(true);
    }
    public void handleCreationDialogClosing(){
        if (dialogManager.getNodeToBeAdded() != null && !dialogManager.getIsCreationDialogClosed()) {

            List<VisJsNode> list =
                nodes.stream().filter(visJsNode -> visJsNode.getId().equals(dialogManager.getNodeToBeAdded().getId())).collect(Collectors.toList());
            if (list.size() <= 0) {
                try {
                    visJs.addNode(
                        dialogManager.getNodeToBeAdded(),
                        dialogManager.getEdgeToBeAdded()
                    );
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
                nodes.add(dialogManager.getNodeToBeAdded());
                newNodes.add(dialogManager.getNodeToBeAdded());

//                if (editableNodeId != null){
                edges.add(dialogManager.getEdgeToBeAdded());
                newEdges.add(dialogManager.getEdgeToBeAdded());
//                }

            }
        }
        editableNodeId = null;
        dialogManager.setIsCreationDialogClosed(true);
    }


//    public void addNode(
//        NodeType type,
//        String nodeMnemonic,
//        String nodeDescriptor,
//        String nodeDescription,
//        String connectTo,
//        String edgeLabel,
//        Boolean edgeType,
//        NodeRepository nodeRepository,
//        EdgeRepository edgeRepository
//    ) throws JsonProcessingException {
//
//        VisJsNode newNode;
//
//        if (!uploadFromFile) {
//            lastIndex++;
//            newNode = new VisJsNode(lastIndex, type.getId(), nodeDescriptor);
//        } else {
//            newNode = new VisJsNode(type.getId(), nodeDescriptor, nodeMnemonic);
//        }
//
//        VisJsEdge newEdge = new VisJsEdge(
//            Integer.parseInt(connectTo),
//            newNode.getId(),
//            edgeLabel,
//            edgeType
//        );
//
//        if (!uploadFromFile)
//        {
//            nodeRepository.save(newNode);
//            edgeRepository.save(newEdge);
//        }
//
//        nodes.add(newNode);
//        newNodes.add(newNode);
//        edges.add(newEdge);
//        newEdges.add(newEdge);
//        visJs.addNode(newNode, newEdge);
//    }


}
