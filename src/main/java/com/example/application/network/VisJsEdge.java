package com.example.application.network;


import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

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
    @JsonIgnore
    public Boolean edgeType;

    protected VisJsEdge() {}

    public VisJsEdge(Integer from, Integer to) {
        this.from = from;
        this.to = to;
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
}
