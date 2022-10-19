package com.example.application.network;


import com.fasterxml.jackson.annotation.JsonIgnore;


public class VisJsEdge {

    @JsonIgnore
    public long id;

    static int edgeId = 1;

    public Integer from;
    public Integer to;
    public String label;
    public Boolean edgeType;

    protected VisJsEdge() {}

    public VisJsEdge(Integer from, Integer to) {
        this.from = from;
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

        this.from = from;
        this.to = to;
        this.label = label + (showType ? "" : ",  " + (edgeType ? "|||" : "|") + " ");
        this.edgeType = edgeType;
    }

    public VisJsEdge(Integer from, Integer to, String label, Boolean edgeType) {
        this.from = from;
        this.to = to;
        this.label = label + ",  " + (edgeType ? "|||" : "|") + " ";
        this.edgeType = edgeType;
    }

    public String toString() {
        return "From: " + this.from + ", to: " + this.to;
    }
    public Integer getFrom(){
        return from;
    }
    public Integer getTo(){
        return to;
    }
    public String getLabelForXml(){
        return this.label == null ? "" : this.label.split(",")[0];
    }
    public Boolean getEdgeType(){
        return this.edgeType;
    }

}
