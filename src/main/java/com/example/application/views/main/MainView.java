package com.example.application.views.main;


import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;

import org.springframework.beans.factory.annotation.Autowired;
import org.xml.sax.SAXException;


import java.io.*;


@PageTitle("Main")
@Route(value = "")
public class MainView extends VerticalLayout {


    private VisJsComponent visJsComponent;


    @Autowired
    public MainView()
            throws IOException, SAXException {

        visJsComponent = new VisJsComponent();


        add(
                visJsComponent
        );
    }



}
