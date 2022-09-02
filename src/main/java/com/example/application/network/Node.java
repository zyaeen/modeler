package com.example.application.network;


import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
@Table(name = "NODE")
public class Node {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "node_id_generator")
    @SequenceGenerator(name = "node_id_generator", sequenceName = "sq_node_id", allocationSize = 1)
    @JsonIgnore
    public long node_Id;
    public Integer id;
    public String label;

    @Column(name="TYPE_ID")
    public Integer type;

    protected Node() {}

    public Node(Integer id, Integer type) {
        this.id = id;
        this.label = "Node " + id.toString();
        this.type = type;

    }

    public String getLabel(){
        return this.label;
    }

}

