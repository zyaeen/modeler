package com.example.application.network;


import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "EDGE")
public class VisJsEdge {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "edge_id_generator")
    @SequenceGenerator(name = "edge_id_generator", sequenceName = "sq_edge_id", allocationSize = 1)
    @JsonIgnore
    public long id;

    @Transient
    static int edgeId = 1;

    @Column(name = "From_Node")
    public Integer from;
    @Column(name="To_Node")
    public Integer to;

    @Transient
    public String label;

    @Transient
//    @JsonIgnore
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
