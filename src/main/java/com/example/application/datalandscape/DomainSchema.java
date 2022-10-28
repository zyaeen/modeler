package com.example.application.datalandscape;

import com.example.application.network.VisJsEdge;
import com.example.application.network.VisJsNode;
import com.example.application.schema.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.JAXBElement;
import jakarta.xml.bind.JAXBException;
import jakarta.xml.bind.Unmarshaller;

import java.io.File;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class DomainSchema {
    public Schema getSchema() {
        return schema;
    }
    Schema schema;

    public DomainSchema(InputStream schemaXML) {
        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(Schema.class);
            Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
            JAXBElement<Schema> e =  (JAXBElement<Schema> )unmarshaller.unmarshal(schemaXML);
            schema = e.getValue();
        } catch (JAXBException e) {
            throw new RuntimeException(e);
        }
    }


    public String getAnchors () throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(schema.getAnchor());
    }
    public String getTies () throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(schema.getTie());
    }
    public String getKnots () throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(schema.getKnot());
    }
}
