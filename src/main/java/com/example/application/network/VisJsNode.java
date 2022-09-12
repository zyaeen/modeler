package com.example.application.network;


import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
@Table(name = "NODE")
public class VisJsNode {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "node_id_generator")
    @SequenceGenerator(name = "node_id_generator", sequenceName = "sq_node_id", allocationSize = 1)
    @JsonIgnore
    public long node_Id;

    @JsonIgnore
    @Transient
    static int idFromXml = 1;

    @JsonIgnore
    @Transient
    public String mnemonic;

    public Integer id;
    public String label;

    @Column(name="TYPE_ID")
    public Integer type;

    @Transient
    public Double x;
    @Transient
    public Double y;
    @Transient
    public Boolean fixed;

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

    public VisJsNode(Integer type, String label) {
        this.id = idFromXml++;
        this.mnemonic = label.toUpperCase().substring(0,3);
        this.label = label;
        this.type = type;
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
            ", x, y: " + this.x.toString() +", " + this.y.toString() + ", fixed: " + this.fixed.toString();
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


}

