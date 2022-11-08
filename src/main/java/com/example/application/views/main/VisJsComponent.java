package com.example.application.views.main;


import com.example.application.datalandscape.DomainSchema;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.vaadin.flow.component.ClientCallable;
import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.Tag;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.component.dependency.NpmPackage;
import com.vaadin.flow.component.dependency.Uses;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.menubar.MenuBar;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.upload.Upload;
import org.xml.sax.SAXException;


import java.io.*;

@JsModule("./vis-js-component.ts")
@NpmPackage(value = "vis-network", version = "9.1.2")
@Tag("custom-tag")
@Uses(Icon.class)
@Uses(MenuBar.class)
@Uses(Upload.class)
public class VisJsComponent extends Component {

    DomainSchema domainSchema = null;

    public VisJsComponent() throws IOException, SAXException { }
    @ClientCallable
    private void fillComponentRequest(){
        try {
//            ClassLoader classLoader = getClass().getClassLoader();
//            File file = new File(classLoader.getResource("target/classes/dossier.xml").getFile());
            InputStream inputStream = new FileInputStream("src/main/resources/dossier.xml");
            this.domainSchema = new DomainSchema(inputStream);
            sendTree();

        } catch (JsonProcessingException | FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }
    public void sendTree() throws JsonProcessingException{
        getElement().executeJs("this.getTree($0, $1, $2)", domainSchema.getAnchors(),
            domainSchema.getKnots(), domainSchema.getTies());
    }
}
