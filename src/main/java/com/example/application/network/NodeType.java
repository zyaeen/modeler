package com.example.application.network;


import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
@Table(name = "NODE_TYPE")
public class NodeType {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "node_type_id_generator")
    @SequenceGenerator(name = "node_type_id_generator", sequenceName = "sq_node_type_id", allocationSize = 1)
    @JsonIgnore
    public Integer id;
    public String label;

    protected NodeType() {}

    public String getLabel(){
        return this.label;
    }
    public Integer getId(){
        return this.id;
    }

}

