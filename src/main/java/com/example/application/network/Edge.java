package com.example.application.network;

import java.util.HashMap;
import java.util.Map;

public class Edge {
    public Integer nodeFrom;
    public Integer nodeTo;

    public Edge(Integer nodeFrom, Integer nodeTo){
        this.nodeFrom = nodeFrom;
        this.nodeTo = nodeTo;
    }

    public Map<String, Integer> getMap(){
        Map<String, Integer> map = new HashMap<>();
        map.put("from", this.nodeFrom);
        map.put("to", this.nodeTo);
        return map;
    }
}
