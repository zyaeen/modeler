package com.example.application.network;


import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;


public class VisJsNode {

    @JsonIgnore
    static int idFromXml = 1;
//    @JsonIgnore
    public String mnemonic;
    public Integer id;
    public String label;
    public Integer type;
    public Double x;
    public Double y;
    public Boolean fixed;

    @JsonIgnore
    public List<String> tiedElements = new ArrayList<>();

    protected VisJsNode() {}

    public VisJsNode(Integer id, Integer type, String label) {
        this.id = id;
        this.label = label;
        this.type = type;
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

