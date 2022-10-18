package com.example.application.views.main;


import com.example.application.network.VisJsEdge;
import com.example.application.network.VisJsNode;
import com.example.application.parsing.XmlObject;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.vaadin.flow.component.ClientCallable;
import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.dependency.NpmPackage;
import com.vaadin.flow.component.dependency.Uses;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.menubar.MenuBar;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.upload.Upload;
import org.json.JSONArray;
import org.json.JSONObject;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

@JsModule("./vis-js-component.ts")
@NpmPackage(value = "vis", version = "0.110.0")
@Tag("custom-tag")
@Uses(Icon.class)
@Uses(MenuBar.class)
@Uses(Upload.class)


public class VisJsComponent extends Component {

    List<VisJsNode> nodes = new ArrayList<>();
    List<VisJsEdge> edges = new ArrayList<>();

    XmlObject xmlObject;

    public VisJsComponent() throws IOException, SAXException {

        InputStream fileData = new FileInputStream("src/main/resources/xmls/usingXml.xml");
        readXml(fileData);

    }
    @ClientCallable
    private void displayNotification(String text) {
        Notification.show("Notification: " + text);
    }
    @ClientCallable
    private void fillComponentRequest(){
        try {
            fillComponent();
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
    @ClientCallable
    private void workplaceFillComponent(String nodeId){

        VisJsNode node = this.nodes.stream()
                .filter(
                        visJsNode -> visJsNode.getId().equals(Integer.parseInt(nodeId))
                )
                .collect(Collectors.toList()).get(0);

        getElement().setProperty("mnemonic", node.getMnemonic());
        getElement().setProperty("descriptor", node.getLabel());

    }
    @ClientCallable
    private void addNodesAndEdges(String nodes, String edges) {


        JSONObject jsonOfNodes = new JSONObject(nodes);
        Iterator<String> keysOfNodes = jsonOfNodes.keys();

        JSONObject jsonOfEdges = new JSONObject(edges);
        Iterator<String> keysOfEdges = jsonOfEdges.keys();

        List<VisJsNode> nodesToDownload = new ArrayList<>();
        List<VisJsEdge> edgesToDownload = new ArrayList<>();

        while (keysOfNodes.hasNext()) {
            String key = keysOfNodes.next();
            if (jsonOfNodes.get(key) instanceof JSONObject) {

                Integer id = ((JSONObject) jsonOfNodes.get(key)).getInt("id");
                Double x = ((JSONObject) jsonOfNodes.get(key)).getDouble("x");
                Double y = ((JSONObject) jsonOfNodes.get(key)).getDouble("y");
                Boolean fixed = ((JSONObject) jsonOfNodes.get(key)).getBoolean("fixed");
                Integer type = ((JSONObject) jsonOfNodes.get(key)).getInt("type");
                String mnemonic = ((JSONObject) jsonOfNodes.get(key)).getString("mnemonic");
                String label = ((JSONObject) jsonOfNodes.get(key)).getString("label");

                VisJsNode node =  new VisJsNode(id, type, label);

                node.setMnemonic(mnemonic);
                node.setXYAndFixed(x, y, fixed);

                nodesToDownload.add(node);
            }
        }

        while (keysOfEdges.hasNext()) {
            String key = keysOfEdges.next();
            if (jsonOfEdges.get(key) instanceof JSONObject) {

                Integer from = ((JSONObject) jsonOfEdges.get(key)).getInt("from");
                Integer to = ((JSONObject) jsonOfEdges.get(key)).getInt("to");


                edgesToDownload
                    .add(
                        new VisJsEdge(
                                to,
                                from,
                                "|||",
                                true
                        )
                    );
            }
        }

        try {
            xmlObject.writeToXml(nodesToDownload, edgesToDownload);
        } catch (TransformerException | ParserConfigurationException e) {
            throw new RuntimeException(e);
        }

    }


    public void fillComponent() throws JsonProcessingException {

        ObjectWriter owForEdges = new ObjectMapper().writer().withDefaultPrettyPrinter();
        ObjectWriter owForNodes = new ObjectMapper().writer().withDefaultPrettyPrinter();

        String jsonEdges = owForEdges.writeValueAsString(this.edges);
        String jsonNodes = owForNodes.writeValueAsString(this.nodes);

        getElement().executeJs("this.fillNetwork($0, $1)", jsonEdges, jsonNodes);
    }

    public void addNode(VisJsNode node, VisJsEdge connectToNodeId) throws JsonProcessingException {
        ObjectWriter owForNodes = new ObjectMapper().writer().withDefaultPrettyPrinter();
        ObjectWriter owForEdges = new ObjectMapper().writer().withDefaultPrettyPrinter();

        String jsonNode = owForNodes.writeValueAsString(node);
        String jsonEdge = owForEdges.writeValueAsString(connectToNodeId);
        getElement().executeJs("this.addEdge($0, $1, $2)", this, jsonNode, jsonEdge);
    }

    public void refresh(List<VisJsEdge> edges, List<VisJsNode> nodes) throws JsonProcessingException {
        ObjectWriter owForEdges = new ObjectMapper().writer().withDefaultPrettyPrinter();
        ObjectWriter owForNodes = new ObjectMapper().writer().withDefaultPrettyPrinter();

        String jsonEdges = owForEdges.writeValueAsString(edges);
        String jsonNodes = owForNodes.writeValueAsString(nodes);


        getElement().executeJs("this.redraw($0, $1, $2)", this, jsonEdges, jsonNodes);



    }

    public void getNodesCoordinates(){
        getElement().executeJs("this.getCoordinates($0)", this);
    }

    public void updateNode(VisJsNode node) throws JsonProcessingException {
        ObjectWriter owForNodes = new ObjectMapper().writer().withDefaultPrettyPrinter();

        String jsonNode = owForNodes.writeValueAsString(node);
        getElement().executeJs("this.updateNode($0, $1)", this, jsonNode);
    }

    public void deleteNode(VisJsNode node) throws JsonProcessingException {
        ObjectWriter owForNodes = new ObjectMapper().writer().withDefaultPrettyPrinter();

        String jsonNode = owForNodes.writeValueAsString(node);
        getElement().executeJs("this.updateNode($0, $1)", this, jsonNode);
    }

    public void readXml(InputStream fileData) throws IOException, SAXException {

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



}
