package com.example.application.network;


import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
@Table(name = "EDGE")
public class Edge {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "edge_id_generator")
    @SequenceGenerator(name = "edge_id_generator", sequenceName = "sq_edge_id", allocationSize = 1)
    @JsonIgnore
    public long id;

    @Column(name = "From_Node")
    public Integer from;
    @Column(name="To_Node")
    public Integer to;

    protected Edge() {}

    public Edge(Integer from, Integer to) {
        this.from = from;
        this.to = to;
    }

}
