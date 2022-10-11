package com.example.application.parsing;

import com.example.application.network.VisJsEdge;
import com.example.application.network.VisJsNode;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * todo Document type XmlParser
 */
public class XmlObject {

    public static int id = 1;
    public Document document = null;
    public DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
    public DocumentBuilder documentBuilder = null;
    public List<VisJsNode> knotList = new ArrayList<>();
    public List<VisJsNode> attributeList = new ArrayList<>();
    public List<VisJsNode> anchorList = new ArrayList<>();
    public List<VisJsNode> tieList = new ArrayList<>();
    public List<VisJsEdge> edgeList = new ArrayList<>();

    public Node knotXmlExample;
    public Node anchorXmlExample;
    public Node tieXmlExample;
    public Node attributeXmlExample;
    public Node rootXmlExample;

    public XmlObject(InputStream inputStream){
        try {
            this.documentBuilder = documentBuilderFactory.newDocumentBuilder();
        } catch (ParserConfigurationException e) {
            throw new RuntimeException(e);
        }
        try {
            this.document = documentBuilder.parse(inputStream);
        } catch (SAXException | IOException e) {
            throw new RuntimeException(e);
        }
        this.document.getDocumentElement().normalize();

        NodeList nodeList = this.document.getElementsByTagName("schema");
        rootXmlExample = nodeList.item(0).cloneNode(false);

    }

    public void getKnots(){
        NodeList nodeList = this.document.getElementsByTagName("knot");
        knotXmlExample = nodeList.item(0).cloneNode(true);
        for(int i = 0; i < nodeList.getLength(); i++){
            LayoutProperties layoutProperties = new LayoutProperties(nodeList.item(i));

            knotList.add(
                new VisJsNode(
                    3,
                    nodeList.item(i).getAttributes().getNamedItem("descriptor").getNodeValue(),
                    nodeList.item(i).getAttributes().getNamedItem("mnemonic").getNodeValue(),
                    layoutProperties.getX(),
                    layoutProperties.getY(),
                    layoutProperties.getFixed()
                )
            );
        }
    }
    public void getAnchors(){
        NodeList localAnchorList = this.document.getElementsByTagName("anchor");
        anchorXmlExample = localAnchorList.item(0);
        for(int i = 0; i < localAnchorList.getLength(); i++){

            LayoutProperties layoutProperties = new LayoutProperties(localAnchorList.item(i));

            VisJsNode anchorNode = new VisJsNode(
                1,
                localAnchorList.item(i).getAttributes().getNamedItem("descriptor").getNodeValue(),
                localAnchorList.item(i).getAttributes().getNamedItem("mnemonic").getNodeValue(),
                layoutProperties.getX(),
                layoutProperties.getY(),
                layoutProperties.getFixed()
            );
            anchorList.add(
                anchorNode
            );
            getAttributes(
                localAnchorList.item(i),
                anchorNode.id
            );
        }
    }
    public void getAttributes(Node anchor, int anchorId){
        NodeList localAttributeList = ((Element) anchor).getElementsByTagName("attribute");

        for(int i = 0; i < localAttributeList.getLength(); i++){

            LayoutProperties layoutProperties = new LayoutProperties(localAttributeList.item(i));

            VisJsNode attributeNode = new VisJsNode(
                localAttributeList.item(i).getAttributes().getNamedItem("timeRange") != null ? 6 : 4,
                localAttributeList.item(i).getAttributes().getNamedItem("descriptor").getNodeValue(),
                localAttributeList.item(i).getAttributes().getNamedItem("mnemonic").getNodeValue(),
                layoutProperties.getX(),
                layoutProperties.getY(),
                layoutProperties.getFixed()
            );
            attributeList.add(
                attributeNode
            );
            edgeList.add(
                new VisJsEdge(
                    anchorId,
                    attributeNode.getId()
                )
            );

            Node knotMnemonic = localAttributeList.item(i).getAttributes().getNamedItem("knotRange");

            if (knotMnemonic != null){
                   List<VisJsNode> nodesToConnect = knotList.stream().filter(
                       visJsNode ->
                           visJsNode.getMnemonic().equals(knotMnemonic.getNodeValue())
                       ).collect(Collectors.toList());
                   for (VisJsNode node : nodesToConnect){
                       edgeList.add(
                           new VisJsEdge(
                               node.getId(),
                               attributeNode.getId()
                           )
                       );
                   }
            }
        }
    }
    public void getTies(){
        int tieCounter = 1;
        NodeList localTiesList = this.document.getElementsByTagName("tie");
        tieXmlExample = localTiesList.item(0);
        for(int i = 0; i < localTiesList.getLength(); i++){

            LayoutProperties layoutProperties = new LayoutProperties(localTiesList.item(i));

            VisJsNode tie = new VisJsNode(
                localTiesList.item(i).getAttributes().getNamedItem("timeRange") != null ? 5 : 2,
                "Tie " + tieCounter,
                "TIE" + tieCounter,
                layoutProperties.getX(),
                layoutProperties.getY(),
                layoutProperties.getFixed()
            );
            tieList.add(
                tie
            );
            getTieConnections(
                tie,
                localTiesList.item(i)
            );
            tieCounter++;
        }
    }
    public void getTieConnections(VisJsNode tieNode,Node tie){

        NodeList localAnchorList = ((Element) tie).getElementsByTagName("anchorRole");

        addToTheKnotOrAnchorList(tieNode, localAnchorList, anchorList);

        NodeList localKnotList = ((Element) tie).getElementsByTagName("knotRole");

        addToTheKnotOrAnchorList(tieNode, localKnotList, knotList);
    }

    public void addToTheKnotOrAnchorList(VisJsNode tieNode, NodeList localAnchorOrKnotList, List<VisJsNode> anchorOrKnotList) {
        for(int i = 0; i < localAnchorOrKnotList.getLength(); i++){

            String mnemonic = localAnchorOrKnotList.item(i).getAttributes().getNamedItem("type").getNodeValue();

            List<VisJsNode> nodesToConnect = anchorOrKnotList.stream().filter(
                visJsNode ->
                    visJsNode.getMnemonic().equals(mnemonic)
            ).collect(Collectors.toList());

            for (VisJsNode edge : nodesToConnect){
                edgeList.add(
                    new VisJsEdge(
                        edge.getId(),
                        tieNode.getId(),
                        localAnchorOrKnotList.item(i).getAttributes().getNamedItem("role").getNodeValue(),
                        Boolean.parseBoolean(localAnchorOrKnotList.item(i).getAttributes().getNamedItem("identifier").getNodeValue())
                    )
                );
            }
        }
    }

    public void writeToXml(List<VisJsNode> nodes, List<VisJsEdge> edges)
        throws TransformerException, ParserConfigurationException {

        DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = builderFactory.newDocumentBuilder();
        Document newDocument = builder.newDocument();

        Node importedNode = newDocument.importNode(rootXmlExample, false);

        newDocument.appendChild(
            importedNode
        );


        for (VisJsNode node : nodes){
            switch (node.getType()){
                case 1:

                    Node bufferAnchorExample = newDocument.importNode(anchorXmlExample.cloneNode(true), true);
                    NodeList attributes = ((Element) bufferAnchorExample).getElementsByTagName("attribute");

                    for (int i = 0; i < attributes.getLength(); i++) {
                        bufferAnchorExample.removeChild(
                            attributes.item(i)
                        );
                    }

                    attributeXmlExample = attributes.item(0).cloneNode(true);
                    bufferAnchorExample.removeChild(attributes.item(0));

                    bufferAnchorExample.getAttributes().getNamedItem("mnemonic").setNodeValue(node.getMnemonic());
                    bufferAnchorExample.getAttributes().getNamedItem("descriptor").setNodeValue(node.getLabel());
                    ((Element) bufferAnchorExample).getElementsByTagName("layout").item(0).getAttributes().getNamedItem("x").setNodeValue(node.getX().toString());
                    ((Element) bufferAnchorExample).getElementsByTagName("layout").item(0).getAttributes().getNamedItem("y").setNodeValue(node.getY().toString());
                    ((Element) bufferAnchorExample).getElementsByTagName("layout").item(0).getAttributes().getNamedItem("fixed").setNodeValue(node.getFixed().toString());

                    importedNode.appendChild(bufferAnchorExample);

                    for (VisJsEdge edge : edges){
                        if (edge.getFrom().equals(node.getId())){

                            VisJsNode attributeNode = nodes.stream().filter(
                                visJsNode -> visJsNode.getId().equals(edge.getTo())
                            ).collect(Collectors.toList()).get(0);

                            if (!attributeNode.getType().equals(2) && !attributeNode.getType().equals(5)) {

                                Node bufferAttributeExample = newDocument.importNode(attributeXmlExample, true);

                                if (attributeNode.getType().equals(6)) {
                                    if (bufferAttributeExample.getAttributes().getNamedItem("timeRange") != null) {
                                        bufferAttributeExample.getAttributes().getNamedItem("timeRange").setNodeValue("datetime");
                                    } else {
                                        ((Element) bufferAttributeExample).setAttribute("timeRange", "datetime");
                                    }
                                }

                                bufferAttributeExample.getAttributes().getNamedItem("mnemonic").setNodeValue(attributeNode.getMnemonic());
                                bufferAttributeExample.getAttributes().getNamedItem("descriptor").setNodeValue(attributeNode.getLabel());
                                ((Element) bufferAttributeExample).getElementsByTagName("layout").item(0).getAttributes().getNamedItem("x")
                                    .setNodeValue(attributeNode.getX().toString());
                                ((Element) bufferAttributeExample).getElementsByTagName("layout").item(0).getAttributes().getNamedItem("y")
                                    .setNodeValue(attributeNode.getY().toString());
                                ((Element) bufferAttributeExample).getElementsByTagName("layout").item(0).getAttributes().getNamedItem("fixed")
                                    .setNodeValue(attributeNode.getFixed().toString());

                                for(VisJsEdge visJsEdge : edges) {
                                    if (visJsEdge.getTo().equals(attributeNode.getId()) || visJsEdge.getFrom().equals(attributeNode.getId())) {
                                        List<VisJsNode> knotNodes = nodes.stream().filter(
                                            visJsNode -> ((visJsNode.getId().equals(visJsEdge.getFrom()) || visJsNode.getId().equals(visJsEdge.getTo())) && visJsNode.getType().equals(3))
                                        ).collect(Collectors.toList());
                                        if (knotNodes.size() > 0){
                                            if (bufferAttributeExample.getAttributes().getNamedItem("knotRange") != null) {
                                                bufferAttributeExample.getAttributes().getNamedItem("knotRange").setNodeValue(knotNodes.get(0).getMnemonic());
                                            } else {
                                                ((Element) bufferAttributeExample).setAttribute("knotRange", knotNodes.get(0).getMnemonic());
                                            }
                                        }
                                    }
                                }

                                bufferAnchorExample.appendChild(bufferAttributeExample);
                            }
                        }
                    }
                    break;

                case 3:
                    Node bufferExample = newDocument.importNode(knotXmlExample.cloneNode(true), true);
                    bufferExample.getAttributes().getNamedItem("mnemonic").setNodeValue(node.getMnemonic());
                    bufferExample.getAttributes().getNamedItem("descriptor").setNodeValue(node.getLabel());
                    ((Element) bufferExample).getElementsByTagName("layout").item(0).getAttributes().getNamedItem("x").setNodeValue(node.getX().toString());
                    ((Element) bufferExample).getElementsByTagName("layout").item(0).getAttributes().getNamedItem("y").setNodeValue(node.getY().toString());
                    ((Element) bufferExample).getElementsByTagName("layout").item(0).getAttributes().getNamedItem("fixed").setNodeValue(node.getFixed().toString());
                    importedNode.appendChild(
                        bufferExample
                    );
                    break;

                case 2:
                case 5:
                    Element tie = newDocument.createElement("tie");
                    importedNode.appendChild(tie);
                    if (node.getType() == 5) {
                        tie.setAttribute("timeRange", "datetime");
                    }
                    for (VisJsEdge edge : edges){
                        if (edge.getFrom().equals(node.getId()) || edge.getTo().equals(node.getId())) {

                            Integer idOfNodeToConnect = edge.getFrom().equals(node.getId()) ? edge.getTo() : edge.getFrom();

                            VisJsNode nodeToConnect = null;

                            try {
                                nodeToConnect = nodes.stream().filter(
                                    visJsNode -> visJsNode.getId().equals(idOfNodeToConnect)
                                ).collect(Collectors.toList()).get(0);
                            } catch (Exception e){

                            }



                            Element childTag;

                            if (nodeToConnect.getType().equals(1)) {
                                childTag = newDocument.createElement("anchorRole");
                            } else {
                                childTag = newDocument.createElement("knotRole");
                            }
                            childTag.setAttribute("role", edge.getLabelForXml());
                            childTag.setAttribute("type", nodeToConnect.getMnemonic().toString());
                            childTag.setAttribute("identifier", edge.getEdgeType().toString());

                            tie.appendChild(childTag);
                        }
                    }

                    Element layout = newDocument.createElement("layout");
                    layout.setAttribute("x", node.getX().toString());
                    layout.setAttribute("y", node.getY().toString());
                    layout.setAttribute("fixed", node.getFixed().toString());

                    tie.appendChild(layout);

                    Element metadata = newDocument.createElement("metadata");
                    metadata.setAttribute("capsule", "dbo");
                    metadata.setAttribute("deletable", "false");
                    metadata.setAttribute("idempotent", "false");

                    tie.appendChild(metadata);

                    break;
                default:
                    break;
            }
        }


        newDocument.normalizeDocument();
        DOMSource source = new DOMSource(newDocument);
        TransformerFactory transformerFactory = TransformerFactory.newInstance();
        Transformer transformer = transformerFactory.newTransformer();
        StreamResult result = new StreamResult("src/main/resources/xmls/usingXml.xml");
        transformer.transform(source, result);

    }

}
