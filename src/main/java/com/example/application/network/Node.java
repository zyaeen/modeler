package com.example.application.network;


import java.util.HashMap;
import java.util.Map;

public class Node {
    public Integer id;

    public Node(Integer id){
        this.id = id;
    }
    public Map<String, Object> getMap(){
        Map<String, Object> map = new HashMap<>();
        map.put("id", this.id);
        map.put("label", "Node " + this.id.toString());
        return map;
    }
}
