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
    }

    public void getKnots(){
        NodeList nodeList = this.document.getElementsByTagName("knot");
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
                localTiesList.item(i),
                tie.getId()
            );
            tieCounter++;
        }
    }
    public void getTieConnections(Node tie, int tieId){

        NodeList localAnchorList = ((Element) tie).getElementsByTagName("anchorRole");

        addToTheKnotOrAnchorList(tieId, localAnchorList, anchorList);

        NodeList localKnotList = ((Element) tie).getElementsByTagName("knotRole");

        addToTheKnotOrAnchorList(tieId, localKnotList, knotList);
    }

    public void addToTheKnotOrAnchorList(int tieId, NodeList localAnchorOrKnotList, List<VisJsNode> anchorOrKnotList) {
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
                        tieId,
                        localAnchorOrKnotList.item(i).getAttributes().getNamedItem("role").getNodeValue(),
                        Boolean.parseBoolean(localAnchorOrKnotList.item(i).getAttributes().getNamedItem("identifier").getNodeValue())
                    )
                );
            }
        }
    }



}
