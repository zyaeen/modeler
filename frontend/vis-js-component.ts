import { css, html, LitElement } from 'lit-element';
import { customElement, state,property, query  } from 'lit-element';
import '@vaadin/menu-bar';
import { MenuBarItem, MenuBarItemSelectedEvent } from '@vaadin/menu-bar';
import { applyTheme } from 'Frontend/generated/theme';
import {createTemplate} from "Frontend/getIcons";
import {Icon} from "@vaadin/icon";
import {Upload} from "@vaadin/upload";
import { DataSet, Network } from "vis";
import '@vaadin/vertical-layout';
import {PropertyValues} from "lit";
// import { Network } from "vis-network/peer/esm/vis-network";
// import { DataSet } from "vis-data/peer/esm/vis-data"


const template = createTemplate();
document.head.appendChild(template.content);

@customElement('custom-tag')
export class VisJsComponent extends LitElement {


    static get styles() {
        return css`
        [theme="text-field-width"] {
          width: 100%;
        }
        [theme="spacing-padding"] {
          padding: 15px; 
          border-style: solid; 
          border-color:  #E8EDF5; 
          border-radius: 10px;
          height: 305px;
          width: 100%;
        }
         #customId {
          padding: 0;
          height: 59vh;
          width: 98vw;
          margin: 0;
        }
        #bottomPanel {
         padding-bottom: 10px; 
         position: relative;
         align-items: end;
        }

    }
  `;
    }

    @state()
    private selectedItem?: MenuBarItem;
    @state()
    private selectedNodes = [];
    @state()
    private counter = 0;

    @property()
    private lastId = 0;


    @property()
    private selectedNode = null;

    private scale = 1;

    private anchorMenuBarItem = { id: 1, component: this.createItem('anchor-add', 'lean-di-icons', '1')};
    private attributeMenuBarItem = { id: 2, component: this.createItem('attribute-add', 'lean-di-icons', '2')}
    private composedAttributeMenuBarItem = { id: 3, component: this.createItem('attribute-composed-add', 'lean-di-icons', '2') }
    private historicalAttributeMenuBarItem = { id: 3, component: this.createItem('attribute-his-add', 'lean-di-icons', '2') }
    private tieWithAnchorMenuBarItem = { id: 3, component: this.createItem('tie-a-add', 'lean-di-icons', '2') }
    private tieMenuBarItem ={ id: 3, component: this.createItem('tie-add', 'lean-di-icons', '2') }
    private historicalTieWithAnchorMenuBarItem ={ id: 3, component: this.createItem('tie-his-a-add', 'lean-di-icons', '2') }
    private historicalTieMenuBarItem = { id: 3, component: this.createItem('tie-his-add', 'lean-di-icons', '2') }

    @state()
    public itemsForAnchorsMenuBar = [
        this.anchorMenuBarItem
    ];
    @state()
    private itemsForZoomAndSearchMenuBar = [
        { id: 1, component: this.createItem('search-plus', 'vaadin', '4')},
        { id: 2, component: this.createItem('search-minus', 'vaadin', '5')},
        { id: 3, component: this.createItem('search', 'vaadin', '6') },
        { id: 4, component: this.createItem('download', 'lumo', '7') },

    ];

    @state()
    private nodes?: any;
    @state()
    private edges?: any;
    @state()
    private loadedNodes?: any;
    @state()
    private historicalAttributes?: any;
    @state()
    private historicalTies?: any;
    @state()
    private checked?: any;
    @state()
    private loadedEdges?: any;
    @state()
    private isThis = this;
    @state()
    private host?: any;

    @property()
    private network!: Network// = this.initZaglushka();

    private $server?: VisJsComponentServerInterface;

    @property({attribute:true})
    private test?: Object;

    @property()
    private mnemonic = "";
    @property()
    private descriptor = "";
    @property()
    private description = "";
    @property()
    private mneAndDescriptorVisibility = 'hidden';
    @property()
    private DescriptionVisibility = 'hidden'
    @property()
    private CheckBoxesVisibility = 'hidden';
    @property()
    private hisCheckBoxValue : boolean = true;
    @property()
    private tieCheckBoxValue : boolean = false;
    @property()
    private checkBoxValues = []

    render() {
        return html`
            <div style="position: absolute; z-index: 1; background-color: transparent;">
                <vaadin-horizontal-layout style="width: 100%;">
                    <vaadin-vertical-layout style="width: 50vw">
                        <vaadin-menu-bar
                                .items="${this.itemsForAnchorsMenuBar}"
                                @item-selected="${this.itemSelected}"
                                theme="icon"
                                style=" background-color: hsla(0, 0%, 100%, 0.3);"
                        >
                        </vaadin-menu-bar>
                    </vaadin-vertical-layout>
                    <vaadin-vertical-layout style="width: 48vw; align-items: flex-end">
                        <vaadin-menu-bar
                                .items="${this.itemsForZoomAndSearchMenuBar}"
                                @item-selected="${this.itemSelected}"
                                theme="icon"
                                style=" background-color: hsla(0, 0%, 100%, 0.3);"
                        >
                        </vaadin-menu-bar>
                    </vaadin-vertical-layout>
                </vaadin-horizontal-layout>
            </div>
            <div id="customId"></div>
            <div id="bottomPanel">
                <vaadin-horizontal-layout theme="spacing">
                    <div style="width: 20%">
                        <vaadin-vertical-layout theme="spacing-padding">
                            <span>Описание объекта</span>
                            <vaadin-text-field label="Мнемоник"
                                               theme="text-field-width"
                                               value = "${this.mnemonic}"
                                               style="visibility: ${this.mneAndDescriptorVisibility}"
                            >
                            </vaadin-text-field>
                            <vaadin-text-field label="Дескриптор" 
                                               theme="text-field-width"
                                               value="${this.descriptor}"
                                               style="visibility: ${this.mneAndDescriptorVisibility}"
                            />
                            </vaadin-text-field>
                            <vaadin-text-area label="Описание" 
                                              theme="text-field-width"
                                              value="${this.description}"
                                              style="visibility: ${this.DescriptionVisibility}"
                            />
                            </vaadin-text-area>
                        </vaadin-vertical-layout>
                    </div>
                    <div style="width: 20%">
                        <vaadin-vertical-layout theme="spacing-padding">
                            <span>Опции объекта</span>
                            <br>
                            <vaadin-checkbox-group                                                  
                                    .value="${this.checkBoxValues}"
                            >
                                <vaadin-checkbox label="Исторический" 
                                                 theme="vertical"
                                                 style="visibility: ${this.CheckBoxesVisibility}"
                                                 value="0"
                                >
                                </vaadin-checkbox>
                                <vaadin-checkbox label="Кнотированный"
                                                 theme="vertical"
                                                 style="visibility: ${this.CheckBoxesVisibility}"
                                                 value="1"
                                >
                                </vaadin-checkbox>                    
                            <vaadin-checkbox-group>

                        </vaadin-vertical-layout>
                    </div>
                    <div style="width: 60%">
                        <vaadin-vertical-layout theme="spacing-padding"">
                        <span>Значения</span>
                        <vaadin-grid>
                            <vaadin-grid-column path="firstName"></vaadin-grid-column>
                            <vaadin-grid-column path="lastName"></vaadin-grid-column>
                            <vaadin-grid-column path="email"></vaadin-grid-column>
                            <vaadin-grid-column path="profession"></vaadin-grid-column>
                        </vaadin-grid>
                        </vaadin-vertical-layout>
                    </div>
                </vaadin-horizontal-layout>
            </div>
        `
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        this.$server?.fillComponentRequest();
    }
    private clickAction() {
        this.$server!.displayNotification("Click on button");
    }

    createItem(iconName: string, iconRepo: string, id: string) {

        const item = document.createElement('vaadin-context-menu-item');
        const ic = new Icon();
        ic.setAttribute('icon', `${iconRepo}:${iconName}`)

        item.setAttribute('id', String(id))
        item.setAttribute('theme', "icon")

        var _this = this;

        if(iconName == 'search-plus'){
            item.onclick = () => {
                this.scale = this.scale * 1.5;
                this.network.moveTo({scale: this.scale});
                this.mneAndDescriptorVisibility = "вот"
            };
        }
        if(iconName === 'search-minus'){
            item.onclick = () => {
                this.scale = this.scale / 1.5;
                this.network.moveTo({scale: this.scale});
            };
        }
        if(iconName === 'anchor-add'){
            item.onclick = () =>{
                // window.addEdge(`""`);
                this.addNode(1, false);
            };
        }
        if(iconName === 'tie-add'){
            item.onclick = () => {
                // window.addEdge(`""`);
                this.addNode(2, false);
            };
        }
        if(iconName === 'tie-his-add'){
            item.onclick = () => {
                this.addNode(5, false)
            }
        }
        if(iconName === 'tie-a-add'){
            item.onclick = () =>{
                // window.addEdge(`""`);
                this.addNode(2, true);
            };
        }
        if(iconName === 'tie-his-a-add'){
            item.onclick = () => {
                this.addNode(5, true)
            }
        }
        if(iconName === 'attribute-add'){
            item.onclick = () =>{
                // window.addEdge(`""`);
                this.addNode(4, false);
            };
        }
        if(iconName === 'attribute-his-add'){
            item.onclick = () => {
                this.addNode(6, false)
            }
        }
        if(iconName === 'download'){
            item.onclick = () => {
                this.download()
            }
        }

        item.appendChild(ic);
        return item;
    }

    download(){

        this.$server!.addNodesAndEdges(
            // @ts-ignore
            JSON.stringify(this.network.body.data.nodes._data),
            // @ts-ignore
            JSON.stringify(this.network.body.data.edges._data),
        );
    };

    createUpload(){
        let item = new Upload();

        item.nodrop = true;

        item.i18n.addFiles.many = 'Load scheme from XML';

        item.i18n.addFiles.one = 'Load scheme from XML';

        item.headers = '{"Content-Type": "application/xml"}'

        item.target = 'http://localhost:8080/count'
        return item;
    }

    itemSelected(e: MenuBarItemSelectedEvent) {
        this.selectedItem = e.detail.value;
    }

    allNodesIsTypedAs(nodeType: any){
        // @ts-ignore
        let array = this.network.getSelectedNodes().filter(node => this.network.body.nodes[node].options.type != nodeType);
        return array.length == 0;
    }

    init(element: any, edges: any, nodes: any) {

        this.getNodesAndEdges(edges, nodes);

        var data = {
            nodes: this.nodes,
            edges: this.edges,
        };
        var options = {
            height: '500',
            width: '100%',
            interaction: {
                keyboard: true,
                multiselect: true
            }
        };
        this.network = new Network(
            this.shadowRoot!.getElementById("customId")!,
            data,
            options
        );

        this.initEvents();

    }

    fillNetwork(edges: any, nodes: any) {

        this.init('', edges, nodes);

    }

    initEvents(){

        var step;

        var _this = this;

        this.network.on("selectNode", (params) => {
            this.switchCaseMenuBar(params);
            this.fillWorkplace(params)
        });

        this.network.on("deselectNode", (params) => {



            var selectedNodeId = params.nodes[0];
            // @ts-ignore
            var node = this.network.body.nodes[selectedNodeId];

            if (this.network.getSelectedNodes().length == 1){
                this.fillItemList(node.options.type);
            } else if(this.network.getSelectedNodes().length == 0) {
                this.fillItemList(0);
            }
            else if (this.allNodesIsTypedAs(node.options.type)
                && this.network.getSelectedNodes().length > 1){
                if(node.options.type == 1){
                    this.fillItemList(7);
                }
            } else {
                this.fillItemList(3);
            }

            this.checkBoxValues = [];
            this.CheckBoxesVisibility = 'hidden';

            this.description = "";
            this.descriptor = "";
            this.mnemonic = "";

            this.mneAndDescriptorVisibility = 'hidden';
            this.DescriptionVisibility = 'hidden';

        });


        this.network.on("afterDrawing", (ctx) => {
            for (step = 0; step < this.historicalAttributes.length; step++) {
                var nodePosition = this.network.getPositions([this.historicalAttributes[step]]);
                ctx.strokeStyle = '#f66';
                ctx.lineWidth = 2;
                ctx.circle(nodePosition[this.historicalAttributes[step]].x, nodePosition[this.historicalAttributes[step]].y, 15);
                ctx.stroke();
            }

            for (step = 0; step < this.historicalTies.length; step++) {
                var nodePosition = this.network.getPositions([this.historicalTies[step]]);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.diamond(nodePosition[this.historicalTies[step]].x, nodePosition[this.historicalTies[step]].y, 20);
                ctx.stroke();

            }
            for (step = 0; step < this.checked.length; step++) {
                var nodePosition = this.network.getPositions([this.checked[step]]);
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 4;
                ctx.circle(nodePosition[this.checked[step]].x, nodePosition[this.checked[step]].y, 2);
                ctx.stroke();

            }
        })
        this.network.on( 'doubleClick', (properties) => {
            var ids = properties.nodes;

            if (ids.length > 0) {
                // @ts-ignore
                var node = this.network.body.data.nodes._data[ids[0]];
                if (this.checked.includes(ids[0])) {
                    // @ts-ignore
                    node["fixed"] = false;
                    // @ts-ignore
                    this.network.body.data.nodes.update(node);
                    const index = this.checked.indexOf(ids[0]);
                    this.checked.splice(index, 1);
                } else {
                    this.checked.push(ids[0]);
                    node["fixed"] = true;
                    var pos = this.network.getPositions([ids[0]]);
                    node["x"] = pos[ids[0]].x;
                    node["y"] = pos[ids[0]].y;
                    // @ts-ignore
                    this.network.body.data.nodes.update(node);
                }
            }
        });
        this.network.on( 'oncontext', (properties) => {

            var a = this.network.getNodeAt(properties.pointer.DOM);
            var b = this.network.getEdgeAt(properties.pointer.DOM)

            if (b != null){

            }

            const url = 'http://localhost:8080/down';

            if (a != null){

                try {
                    const response =  fetch(url, {
                        method: 'POST', // или 'PUT'
                        body: a.toString(), // данные могут быть 'строкой' или {объектом}!
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const json = response;
                    console.log('Успех:', json);
                } catch (error) {
                    console.error('Ошибка:', error);
                }
            }
        });
        this.network.on('dragStart', (params) => {

            if(params.nodes.length != 0){
                this.switchCaseMenuBar(params);
                this.fillWorkplace(params)
            }


            var ids = params.nodes;
            if (ids.length > 0) {
                // @ts-ignore
                var node = this.network.body.data.nodes._data[ids[0]];
                node["fixed"] = false;
                var pos = this.network.getPositions([ids[0]]);
                node["x"] = pos[ids[0]].x;
                node["y"] = pos[ids[0]].y;
                // @ts-ignore
                this.network.body.data.nodes.update(node);
            }
        });
        this.network.on('dragEnd', (properties) => {
            var ids = properties.nodes;
            if (ids.length > 0) {
                if (this.checked.includes(ids[0])) {
                    // @ts-ignore
                    var node = this.network.body.data.nodes._data[ids[0]];
                    node["fixed"] = true;
                    var pos = this.network.getPositions([ids[0]]);
                    node["x"] = pos[ids[0]].x;
                    node["y"] = pos[ids[0]].y;
                    // @ts-ignore
                    this.network.body.data.nodes.update(node);
                }
            }
        });
    }

    switchCaseMenuBar(properties: any){
        var selectedNodeId = properties.nodes[0];
        // @ts-ignore
        var node = this.network.body.nodes[selectedNodeId];

        this.selectedNode = selectedNodeId;

        if (this.network.getSelectedNodes().length == 1){
            this.fillItemList(node.options.type);
        } else if (this.allNodesIsTypedAs(node.options.type)
            && this.network.getSelectedNodes().length > 1){

            if(node.options.type == 1){
                this.fillItemList(7);
            }

        } else {
            this.fillItemList(3);
        }
    }

    fillWorkplace(properties: any){
        var selectedNodeId = properties.nodes[0].toString();
        // this.$server!.workplaceFillComponent(selectedNodeId);

        // @ts-ignore
        var node = this.network.body.nodes[selectedNodeId];

        this.mnemonic = node.options.mnemonic;
        this.descriptor = node.options.label;
        // this.description = node.options.description;

        this.checkBoxValues = [];

        if(node.options.type != 3 && node.options.type != 1){
            this.CheckBoxesVisibility = 'visible';

            let connectedNodes = this.network.getConnectedNodes(selectedNodeId);
            for(let id in connectedNodes){
                // @ts-ignore
                if (this.network.body.nodes[connectedNodes[id]].options.type == 3) {
                    // @ts-ignore
                    this.checkBoxValues = ['1'];
                    break;
                }
            }

            if (node.options.type == 5 || node.options.type == 6) {
                // @ts-ignore
                this.checkBoxValues.push('0')
            }

        } else {
            this.CheckBoxesVisibility = 'hidden';
        }


    }

    fillItemList(nodeType: any){
        switch (nodeType){
            case 0: {
                this.mneAndDescriptorVisibility = 'visible';
                this.DescriptionVisibility = 'visible';
                this.itemsForAnchorsMenuBar = [
                    this.anchorMenuBarItem
                ];
                break;
            }
            case 1: {
                this.mneAndDescriptorVisibility = 'visible';
                this.DescriptionVisibility = 'visible';
                this.itemsForAnchorsMenuBar = [
                    this.attributeMenuBarItem,
                    this.composedAttributeMenuBarItem,
                    this.historicalAttributeMenuBarItem,
                    this.tieWithAnchorMenuBarItem,
                    this.historicalTieWithAnchorMenuBarItem
                ];
                break;
            }
            case 2:
            case 5: {
                this.mneAndDescriptorVisibility = 'hidden';
                this.DescriptionVisibility = 'visible';
                this.itemsForAnchorsMenuBar = [
                    this.anchorMenuBarItem
                ];
                break;
            }
            case 3:
            case 4:
            case 6: {
                this.mneAndDescriptorVisibility = 'visible';
                this.DescriptionVisibility = 'visible';
                this.itemsForAnchorsMenuBar = [];
                break;
            }
            case 7:{
                this.mneAndDescriptorVisibility = 'hidden';
                this.DescriptionVisibility = 'hidden';
                this.itemsForAnchorsMenuBar = [
                    this.tieMenuBarItem,
                    this.tieWithAnchorMenuBarItem,
                    this.historicalTieMenuBarItem,
                    this.historicalTieWithAnchorMenuBarItem
                ];
                break;
            }
        }
    }

    getNodesAndEdges(edges: string, nodes: string){
        // @ts-ignore
        this.lastId = Math.max(...JSON.parse(nodes).map(node => node.id));


        this.loadedNodes = JSON.parse(nodes);
        this.historicalAttributes = [];
        this.historicalTies = [];

        this.checked = [];

        var step;
        for (step = 0; step < this.loadedNodes.length; step++) {
            this.loadedNodes[step] = this.fillNode(this.loadedNodes[step]);
        }

        this.nodes = new DataSet(this.loadedNodes);

        this.loadedEdges = JSON.parse(edges);
        for (step = 0; step < this.loadedEdges.length; step++) {
            this.loadedEdges[step] = this.fillEdge(this.loadedEdges[step]);
        }

        this.edges = new DataSet(this.loadedEdges);
    }

    draw(element: any, edges: string, nodes: string){


        this.getNodesAndEdges(edges, nodes)

        var data = {
            nodes: this.nodes,
            edges: this.edges,
        };
    }

    redraw(element: any, edges: string, nodes: string) {

        this.draw(element, edges, nodes);

        // @ts-ignore
        this.network.body.data.edges.clear();
        // @ts-ignore
        this.network.body.data.nodes.clear();
        // @ts-ignore
        this.network.body.data.edges.update(
            this.loadedEdges
        );
        // @ts-ignore
        this.network.body.data.nodes.update(
            this.loadedNodes
        );

        this.network.unselectAll();
    }

    fillEdge(edge: any){
        edge['color'] = {'color': "#000000"};
        return edge;
    }

    fillNode(node: { [x: string]: any; }){
        switch (node["type"]){
            case 1: {
                node["color"] = {
                    border: "#f66",
                    background: "#f66"
                };
                node["shape"] = "square";
                break
            }
            case 2:{
                node["color"] =  {
                    border: "#c0c0c0",
                    background: '#c0c0c0'
                };
                node["shape"] = "diamond";
                break
            }
            case 3: {
                node["color"] = {
                    border: "#f66",
                    background: '#ffffff'
                };
                node["borderWidth"] = 2;
                node["shape"] = "square";
                node["scaling"] =  {
                    label: {
                        enabled: true,
                        min: 50,
                        max: 50
                    }
                };
                break
            }
            case 4: {
                node["color"] = {
                    border: "#f66",
                    background: '#ffffff'
                };
                node["borderWidth"] = 2;
                node["shape"] = "dot";
                break
            }
            case 5: {
                node["color"] = {
                    border: "#c0c0c0",
                    background: '#c0c0c0'
                };
                node["borderWidth"] = 2;
                node["shape"] = "diamond";
                node["scaling"] =  {
                    label: {
                        enabled: true,
                        min: 50,
                        max: 50
                    }
                };
                this.historicalTies.push(node["id"])
                break
            }
            case 6: {
                node["color"] = {
                    border: "#f66",
                    background: '#ffffff'
                };
                node["borderWidth"] = 2;
                node["shape"] = "dot";
                this.historicalAttributes.push(node["id"]);
                break
            }
        }
        if (node["fixed"] === true) {
            this.checked.push(node["id"]);
        }
        return node;
    }

    addEdge(newNode: string, newEdge: string){

        var node = JSON.parse(newNode);
        var edge = JSON.parse(newEdge);

        if (node != null){
            node = this.fillNode(node);
        }
        if (edge != null){
            edge = this.fillEdge(edge);
        }
        try {
            // @ts-ignore
            this.network.body.data.nodes.update(node)
        } catch (err) {
            console.log(err);
        }
        try {
            // @ts-ignore
            this.network.body.data.edges.update(edge)
        } catch (err) {
            console.log(err);
        }
    }

    addNode(nodeType: any, isAnchored: boolean){

        this.lastId = this.lastId + 1;
        let node = {
            "id": this.lastId,
            "label": "Example",
            "mnemonic": "Example",
            "type": nodeType,
            "x": 0,
            "y": 0,
            "fixed": false
        }

        let idFrom = this.lastId;

        // @ts-ignore
        node = this.fillNode(node);

        try {
            // @ts-ignore
            this.network.body.data.nodes.update(node)
        } catch (err) {
            console.log(err);
        }

        if (isAnchored){
            this.lastId = this.lastId + 1;
            let node = {
                "id": this.lastId,
                "label": "AnchorExample",
                "mnemonic": "Example",
                "type": 1,
                "x": 0,
                "y": 0,
                "fixed": false
            }
            let idTo = this.lastId;

            let edge = {
                "from": idFrom,
                "to": idTo
            }
            // @ts-ignore
            node = this.fillNode(node);
            edge = this.fillEdge(edge);

            try {
                // @ts-ignore
                this.network.body.data.nodes.update(node);
                // @ts-ignore
                this.network.body.data.edges.update(edge);
            } catch (err) {
                console.log(err);
            }

        }

        for (var i = 0; i < this.network.getSelectedNodes().length; i++) {
            try {
                let edge = {
                    "from": idFrom,
                    "to": this.network.getSelectedNodes()[i]
                }
                edge = this.fillEdge(edge);
                // @ts-ignore
                this.network.body.data.edges.update(edge);
            } catch (err) {
                console.log(err)
            }
        }

        this.network.unselectAll();

        this.selectedNode = null;
        this.checkBoxValues = [];
        this.CheckBoxesVisibility = 'hidden';

    }

    getCoordinates(){

        const url = 'http://localhost:8080/download';

        try {
            const response =  fetch(url, {
                method: 'POST',
                // @ts-ignore
                body: JSON.stringify(this.network.body.data.nodes._data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Успех:', response);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    updateNode(element: any, node: string){

        try {
            // @ts-ignore
            this.network.body.data.nodes.update(JSON.parse(node))
        } catch (err) {
            console.log(err);
        }
    }

    deleteNode(element: any, node: string){
        try {
            // @ts-ignore
            this.network.body.data.nodes.update(JSON.parse(node))
        } catch (err) {
            console.log(err);
        }
    }

}

interface VisJsComponentServerInterface {
    displayNotification(text: string): void;
    fillComponentRequest(): void;
    workplaceFillComponent(text: string): void;
    addNodesAndEdges(stringOfNodes: string, stringOfEdges: string): void;
}