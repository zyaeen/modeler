package com.example.application.modals;

import com.example.application.network.NodeType;
import com.example.application.network.VisJsEdge;
import com.example.application.network.VisJsNode;
import com.example.application.views.main.VisJs;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextArea;
import com.vaadin.flow.component.textfield.TextField;

import java.util.ArrayList;
import java.util.List;

/**
 * todo Document type DialogManager
 */
public class DialogManager {

    private List<NodeType> nodeTypeList;
    private VisJsNode nodeToBeAdded = null;
    private VisJsEdge edgeToBeAdded = null;
    private Integer nodeToAdd;
    private VisJs visJs;
    private boolean nonTiedClosed = true;
    private VisJsNode nodeToEdit = null;
    private boolean isEditDialogClosed = true;
    private boolean isCreationDialogClosed = true;
    private TextField mnemonicEditTextFieldForAnchor = new TextField("Mnemonic");
    private TextField descriptorEditTextFieldForAnchor = new TextField("Descriptor");
    private TextArea descriptionEditTextFieldForAnchor = new TextArea("Description");
    private TextField mnemonicEditTextFieldForTie = new TextField("Mnemonic");
    private TextField descriptorEditTextFieldForTie = new TextField("Descriptor");
    private TextArea descriptionEditTextFieldForTie = new TextArea("Description");
    private TextField mnemonicEditTextFieldForAttribute = new TextField("Mnemonic");
    private TextField descriptorEditTextFieldForAttribute = new TextField("Descriptor");
    private TextArea descriptionEditTextFieldForAttribute = new TextArea("Description");

    public DialogManager(List<NodeType> nodeTypeList){
        this.nodeTypeList = nodeTypeList;
    }

    public void setNodeToEdit(VisJsNode nodeToEdit) {
        this.nodeToEdit = nodeToEdit;

        if (this.nodeToEdit.getType() == 1 || this.nodeToEdit.getType() == 3) {
            this.mnemonicEditTextFieldForAnchor.setValue(
                this.nodeToEdit.getMnemonic()
            );
            this.descriptorEditTextFieldForAnchor.setValue(
                this.nodeToEdit.getLabel()
            );
        } else if (this.nodeToEdit.getType() == 4|| this.nodeToEdit.getType() == 6)  {
            this.mnemonicEditTextFieldForAttribute.setValue(
                this.nodeToEdit.getMnemonic()
            );
            this.descriptorEditTextFieldForAttribute.setValue(
                this.nodeToEdit.getLabel()
            );
        }

    }
    public boolean getIsEditDialogClosed() {
        return this.isEditDialogClosed;
    }
    public void setIsEditDialogClosed(Boolean isEditDialogClosed){
        this.isEditDialogClosed = isEditDialogClosed;
    }
    public void setIsCreationDialogClosed(Boolean isCreationDialogClosed){
        this.isCreationDialogClosed = isCreationDialogClosed;
    }
    public boolean getIsCreationDialogClosed() {
        return this.isCreationDialogClosed;
    }
    public void setNodeToAdd(Integer nodeToAdd) {
        this.nodeToAdd = nodeToAdd;
    }
    public Dialog createCreationDialog(String windowLabel, Integer typeId){

        Dialog dialog = new Dialog();

        TextField mnemonicTextField = new TextField("Mnemonic");
        TextField descriptorTextField = new TextField("Descriptor");
        TextArea descriptionTextField = new TextArea("Description");

        ComboBox<NodeType> nodeTypeComboBox = new ComboBox<>("Select node type");

        List<NodeType> list = new ArrayList<>();

        switch (typeId) {
            case 1:
            case 3:
                for (NodeType node : nodeTypeList) {
                    if (node.getId() == 2 || node.getId() == 4 ||
                        node.getId() == 5 || node.getId() == 6) {
                        list.add(node);
                    }
                }
                break;

            case 5:
            case 2:
                for (NodeType node : nodeTypeList) {
                    if (node.getId() == 1 || node.getId() == 3) {
                        list.add(node);
                    }
                }
                break;

            case 4:
            case 6:
                for (NodeType node : nodeTypeList) {
                    if (node.getId() == 3) {
                        list.add(node);
                    }
                }
                break;

            case 7:
                for (NodeType node : nodeTypeList) {
                    if (node.getId() == 1) {
                        list.add(node);
                    }
                }
                break;

        }

        nodeTypeComboBox.setItems(list);
        nodeTypeComboBox.setItemLabelGenerator(NodeType::getLabel);

        VerticalLayout dialogLayout = new VerticalLayout();
        dialogLayout.add(
            nodeTypeComboBox,
            mnemonicTextField,
            descriptorTextField,
            descriptionTextField
        );

        nodeTypeComboBox.addValueChangeListener(
            comboBoxNodeTypeComponentValueChangeEvent -> {
                if (nodeTypeComboBox.getValue().getId() == 2 ||
                    nodeTypeComboBox.getValue().getId() == 5
                ) {
                    mnemonicTextField.setEnabled(false);
                    mnemonicTextField.setValue("     ");
                    descriptorTextField.setEnabled(false);
                    descriptorTextField.setValue("     ");
                } else {
                    mnemonicTextField.setEnabled(true);
                    descriptorTextField.setEnabled(true);
                }
            }
        );

        dialogLayout.setPadding(false);
        dialogLayout.setSpacing(false);
        dialogLayout.setAlignItems(FlexComponent.Alignment.STRETCH);
        dialogLayout.getStyle().set("width", "18rem").set("max-width", "100%");

        dialog.add(dialogLayout);

        dialog.setHeaderTitle(windowLabel);

        Button saveButton = new Button(
            "Add",
            e -> {

                this.isCreationDialogClosed = false;

                this.nodeToBeAdded = new VisJsNode(
                    nodeTypeComboBox.getValue().getId(),
                    descriptorTextField.getValue(),
                    descriptorTextField.getValue().substring(0, 3)
                );

                if (typeId != 7) {
                    this.edgeToBeAdded = new VisJsEdge(
                        Integer.valueOf(this.nodeToAdd),
                        this.nodeToBeAdded.getId(),
                        "|||",
                        true
                    );
                }
                dialog.close();
            }
        );
        saveButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        Button cancelButton = new Button("Cancel", e -> dialog.close());

        dialog.getFooter().add(cancelButton);
        dialog.getFooter().add(saveButton);

        return dialog;
    }
    public Dialog createEditDialogForAnchorNode(String windowLabel, Integer typeId){

        Dialog dialog = new Dialog();

        VerticalLayout dialogLayout = new VerticalLayout();

        dialogLayout.add(
            mnemonicEditTextFieldForAnchor,
            descriptorEditTextFieldForAnchor,
            descriptionEditTextFieldForAnchor
        );

        // Добавить для description

        dialogLayout.setPadding(false);
        dialogLayout.setSpacing(false);
        dialogLayout.setAlignItems(FlexComponent.Alignment.STRETCH);
        dialogLayout.getStyle().set("width", "18rem").set("max-width", "100%");

        dialog.add(dialogLayout);

        dialog.setHeaderTitle(windowLabel);

        Button saveButton = new Button(
            "Add",
            e -> {
                this.isEditDialogClosed = false;

                this.nodeToEdit.setLabel(descriptorEditTextFieldForAnchor.getValue());
                this.nodeToEdit.setMnemonic(mnemonicEditTextFieldForAnchor.getValue());

                // Добавить для description
                dialog.close();
            }
        );
        saveButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        Button cancelButton = new Button("Cancel", e -> dialog.close());

        dialog.getFooter().add(cancelButton);
        dialog.getFooter().add(saveButton);

        return dialog;
    }
    public Dialog createEditDialogForTie(String windowLabel, Integer typeId){


        Dialog dialog = new Dialog();

        VerticalLayout dialogLayout = new VerticalLayout();
        dialogLayout.add(
            descriptionEditTextFieldForTie
        );

        dialogLayout.setPadding(false);
        dialogLayout.setSpacing(false);
        dialogLayout.setAlignItems(FlexComponent.Alignment.STRETCH);
        dialogLayout.getStyle().set("width", "18rem").set("max-width", "100%");

        dialog.add(dialogLayout);

        dialog.setHeaderTitle(windowLabel);

        Button saveButton = new Button(
            "Add",
            e -> {
                this.isEditDialogClosed = false;

                // Добавить для description

                dialog.close();
            }
        );
        saveButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        Button cancelButton = new Button("Cancel", e -> dialog.close());

        dialog.getFooter().add(cancelButton);
        dialog.getFooter().add(saveButton);

        return dialog;
    }
    public Dialog createEditDialogForAttribute(String windowLabel, Integer typeId){


        Dialog dialog = new Dialog();

        VerticalLayout dialogLayout = new VerticalLayout();

        dialogLayout.add(
            mnemonicEditTextFieldForAttribute,
            descriptorEditTextFieldForAttribute,
            descriptionEditTextFieldForAttribute
        );

        dialogLayout.setPadding(false);
        dialogLayout.setSpacing(false);
        dialogLayout.setAlignItems(FlexComponent.Alignment.STRETCH);
        dialogLayout.getStyle().set("width", "18rem").set("max-width", "100%");

        dialog.add(dialogLayout);

        dialog.setHeaderTitle(windowLabel);

        Button saveButton = new Button(
            "Add",
            e -> {
                this.isEditDialogClosed = false;

                this.nodeToEdit.setLabel(descriptorEditTextFieldForAttribute.getValue());
                this.nodeToEdit.setMnemonic(mnemonicEditTextFieldForAttribute.getValue());

                // Добавить для description
                dialog.close();
            }
        );
        saveButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        Button cancelButton = new Button("Cancel", e -> dialog.close());

        dialog.getFooter().add(cancelButton);
        dialog.getFooter().add(saveButton);

        return dialog;
    }



    public VisJsNode getNodeToEdit() {
        return nodeToEdit;
    }

    public VisJsNode getNodeToBeAdded() {
        return nodeToBeAdded;
    }

    public VisJsEdge getEdgeToBeAdded(){
        return edgeToBeAdded;
    }

    public void setNonTiedClosed(boolean nonTiedClosed) {
        this.nonTiedClosed = nonTiedClosed;
    }

    public Boolean getNonTiedClosed(){
        return this.nonTiedClosed;
    }
}
