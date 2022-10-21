package com.example.application.network;


import com.example.application.schema.Anchor;
import com.example.application.schema.Attribute;
import com.fasterxml.jackson.annotation.JsonIgnore;


public class VisJsEdge {

    @JsonIgnore
    public long id;

    static int edgeId = 1;

    public String from;
    public String to;
    public String label;
    public Boolean edgeType;

    protected VisJsEdge() {}

    public VisJsEdge(Attribute attribute, Anchor anchor){
        this.from = anchor.getMnemonic() + "_" + attribute.getMnemonic();
        this.to = attribute.getKnotRange();
    }
    public VisJsEdge(Anchor anchor, Attribute attribute){
        this.from = anchor.getMnemonic();
        this.to = anchor.getMnemonic() + "_" + attribute.getMnemonic();
    }
    public VisJsEdge(Integer from, Integer to) {
        this.from = from.toString();
        this.to = to.toString();
    }
    public VisJsEdge(Integer from, String to) {
        this.from = from.toString();
        this.to = to;
    }
    public VisJsEdge(Integer from, Integer to, String label, Boolean edgeType, Integer typeOfFirst, Integer typeOfSecond) {

        boolean showType = true;
        int multiplication = typeOfFirst * typeOfSecond;

        if (multiplication == 2 || multiplication == 5 || multiplication == 15) {
            showType = false;
        }
        if (multiplication == 6 && Math.abs(typeOfFirst - typeOfSecond) == 1) {
            showType = false;
        }

//        this.from = from;
//        this.to = to;
        this.label = label + (showType ? "" : ",  " + (edgeType ? "|||" : "|") + " ");
        this.edgeType = edgeType;
    }

    public VisJsEdge(Integer from, Integer to, String label, Boolean edgeType) {
//        this.from = from;
//        this.to = to;
        this.label = label + ",  " + (edgeType ? "|||" : "|") + " ";
        this.edgeType = edgeType;
    }

    public String toString() {
        return "From: " + this.from + ", to: " + this.to;
    }
//    public Integer getFrom(){
//        return from;
//    }
//    public Integer getTo(){
//        return to;
//    }
    public String getLabelForXml(){
        return this.label == null ? "" : this.label.split(",")[0];
    }
    public Boolean getEdgeType(){
        return this.edgeType;
    }

}
