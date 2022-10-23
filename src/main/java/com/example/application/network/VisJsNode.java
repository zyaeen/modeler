package com.example.application.network;


import com.example.application.schema.Anchor;
import com.example.application.schema.Attribute;
import com.example.application.schema.Knot;
import com.example.application.schema.Tie;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;


public class VisJsNode {

    @JsonIgnore
    static int idFromXml = 1;

    @JsonIgnore
    static int tieId = 1;

//    @JsonIgnore
    public String mnemonic;
    public Integer id;
    public String label;
    public Integer type;
    public Double x = 700.;
    public Double y = 700.;
    public Boolean fixed = false;
    public String description;
    public Boolean isHistorical = null;

    @JsonIgnore
    public List<String> tiedElements = new ArrayList<>();

    protected VisJsNode() {}

    public VisJsNode(Integer id, Integer type, String label) {
        this.id = id;
        this.label = label;
        this.type = type;
    }

    public VisJsNode(String mnemonic, String descriptor, String description){

        this.mnemonic = mnemonic;
        this.label = descriptor;
        this.description = description;

    }

    public VisJsNode(Anchor anchor){
//        this.id = idFromXml++;
        this.type = 1;
        this.mnemonic = anchor.getMnemonic();
        this.label = anchor.getDescriptor();
        this.description = anchor.getDescription();
        if(anchor.getLayout() != null){
            this.x = anchor.getLayout().getX();
            this.y = anchor.getLayout().getY();
            this.fixed = anchor.getLayout().isFixed();
        }
    }
    public VisJsNode(Anchor anchor, Attribute attribute){
//        this.id = idFromXml++;
        this.mnemonic = anchor.getMnemonic() + "_" + attribute.getMnemonic();
        this.label = attribute.getDescriptor();
        this.description = attribute.getDescription();
        if(attribute.getLayout() != null){
            this.x = attribute.getLayout().getX();
            this.y = attribute.getLayout().getY();
            this.fixed = attribute.getLayout().isFixed();
        }
        this.type = 4;
        if (attribute.getTimeRange() != null){
            this.type = 6;
            this.isHistorical = true;
        }

    }
    public VisJsNode(Knot knot){
//        this.id = idFromXml++;
        this.type = 3;
        this.mnemonic = knot.getMnemonic();
        this.label = knot.getDescriptor();
        this.description = knot.getDescription();
        if(knot.getLayout() != null){
            this.x = knot.getLayout().getX();
            this.y = knot.getLayout().getY();
            this.fixed = knot.getLayout().isFixed();
        }
    }
    public VisJsNode(Tie tie){
        this.id = tieId;
        this.description = tie.getDescription();
        if(tie.getLayout() != null){
            this.x = tie.getLayout().getX();
            this.y = tie.getLayout().getY();
            this.fixed = tie.getLayout().isFixed();
        }
        this.type = 2;
        if (tie.getTimeRange() != null){
            this.type = 5;
            this.isHistorical = true;
        }
        tieId++;
    }


    public VisJsNode(Integer type, String label, String mnemonic, Double x, Double y, Boolean fixed) {
        this.id = idFromXml++;
        this.mnemonic = mnemonic;
        this.label = label;
        this.type = type;
        this.x = x;
        this.y = y;
        this.fixed = fixed;
    }

    public VisJsNode(Integer type, String descriptor, String mnemonic) {
        this.id = idFromXml++;
        this.mnemonic = mnemonic;
        this.label = descriptor;
        this.type = type;
        this.x = 700.;
        this.y = 700.;
        this.fixed = false;
    }

    public String getLabel(){
        return this.label;
    }

    public Integer getType(){
        return this.type;
    }

    public String toString() {
        return "ID: " + this.id + ", TYPE: " + this.type +
            ", MNE: " + this.mnemonic + ", label: " + this.label +
            (this.x == null ? "" : ", x, y: " + this.x.toString() +", " + this.y.toString() + ", fixed: " + this.fixed.toString());
    }

    public String getMnemonic(){
        return this.mnemonic;
    }

    public Integer getId(){
        return this.id;
    }


    public void setXYAndFixed(Double x, Double y, Boolean fixed){
        this.x = x;
        this.y = y;
        this.fixed = fixed;
    }

    public void setMnemonic(String mnemonic) {
        this.mnemonic = mnemonic;
    }
    public void setLabel(String label) {
        this.label = label;
    }

    public Double getX(){
        return this.x;
    }
    public Double getY(){
        return this.y;
    }
    public Boolean getFixed(){
        return this.fixed;
    }
    public void fillTies(String nodeMnemonic){
        tiedElements.add(nodeMnemonic);
    }

}

