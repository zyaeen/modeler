package backend.restprovider;

import com.example.application.network.VisJsEdge;
import com.example.application.network.VisJsNode;
import com.example.application.parsing.XmlObject;
import com.example.application.views.main.VisJs;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.vaadin.flow.dom.Element;
import com.vaadin.flow.spring.annotation.UIScope;
import com.vaadin.flow.spring.annotation.VaadinSessionScope;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

/**
 * todo Document type TreeStorageService
 */


@Service
public class TreeStorageService {

    List<VisJsNode> nodes = new ArrayList<>();
    List<VisJsEdge> edges = new ArrayList<>();

    VisJs visJsComponent;

    Element element;

    @Autowired
    public TreeStorageService(
        TreeStorageProperties treeStorageProperties
    )
        throws FileNotFoundException, JsonProcessingException {
        InputStream fileData = new FileInputStream(
            treeStorageProperties.getUploadDir()
        );
        parseXml(fileData);
        this.visJsComponent = new VisJs(
            this.edges,
            this.nodes,
            true
        );
        initConnection();
    }
    public void initConnection() throws JsonProcessingException {
        this.visJsComponent.initConnection();
    }
    public void setElement(Element element){
        this.element  =element;
    }
    public void parseXml(InputStream fileData){
        XmlObject xmlObject = new XmlObject(fileData);
        xmlObject.getKnots();
        xmlObject.getAnchors();
        xmlObject.getTies();

        this.edges.addAll(xmlObject.edgeList);
        this.nodes.addAll(xmlObject.knotList);
        this.nodes.addAll(xmlObject.anchorList);
        this.nodes.addAll(xmlObject.attributeList);
        this.nodes.addAll(xmlObject.tieList);
    }

    public void refreshStorage(MultipartFile file) throws Exception {

        InputStream fileData = file.getInputStream();

        this.edges = new ArrayList<>();
        this.nodes = new ArrayList<>();

        parseXml(fileData);

        this.visJsComponent.refresh(this.edges, this.nodes);

    }

    public List<VisJsEdge> getEdges() {
        return edges;
    }

    public List<VisJsNode> getNodes() {
        return nodes;
    }

    public VisJs getVisJsComponent() {
        return visJsComponent;
    }
}
