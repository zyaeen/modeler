package com.example.application.parsing;

import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * todo Document type LayoutProperties
 */
public class LayoutProperties {

    public Double x;

    public Double y;

    public Boolean fixed;

    public LayoutProperties(Node node){
        NodeList nodeListLayout = ((Element) node).getElementsByTagName("layout");
        this.x = Double.parseDouble(nodeListLayout.item(0).getAttributes().getNamedItem("x").getNodeValue());
        this.y = Double.parseDouble(nodeListLayout.item(0).getAttributes().getNamedItem("y").getNodeValue());
        this.fixed = Boolean.parseBoolean(nodeListLayout.item(0).getAttributes().getNamedItem("fixed").getNodeValue());
    }

    public Double getY() {
        return y;
    }

    public Double getX() {
        return x;
    }

    public Boolean getFixed() {
        return fixed;
    }
}
