package com.example.application.datalandscape;

import com.example.application.schema.Schema;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
//import jakarta.xml.bind.JAXBContext;
//import jakarta.xml.bind.JAXBElement;
//import jakarta.xml.bind.JAXBException;
//import jakarta.xml.bind.Unmarshaller;
//import org.leandi.schema.Schema;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.File;

public class DomainSchema {
    public Schema getSchema() {
        return schema;
    }
    Schema schema;
    public DomainSchema(File schemaXML) {
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
}
