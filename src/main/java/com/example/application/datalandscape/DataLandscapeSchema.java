package com.example.application.datalandscape;


import com.example.application.schema.Schema;

import java.io.File;
import java.util.Map;
import java.util.TreeMap;

public class DataLandscapeSchema {
    private String name;
    private Schema schema;

    public String getName() {
        return name;
    }

    public Map<String, StorageAlias> getStorageAliasMap() {
        return storageAliasMap;
    }

    public Map<String, DomainSchema> getDomainSchemaMap() {
        return domainSchemaMap;
    }

    public DomainsSchema getDomainsSchemaPair() {
        return domainsSchema;
    }

    private TreeMap<String, StorageAlias> storageAliasMap = new TreeMap<>();
    private TreeMap<String, DomainSchema> domainSchemaMap = new TreeMap<>();
    private DomainsSchema domainsSchema;

    public DataLandscapeSchema(String name,
                               File storageAliasXML,
                               Map<String,File> domainSchemaXMLs
                               ) {
        this.name = name;
        for (Map.Entry<String,File> me: domainSchemaXMLs.entrySet()) {
                domainSchemaMap.put(me.getKey(),
                        new DomainSchema(me.getValue()));
        }
    }
}
