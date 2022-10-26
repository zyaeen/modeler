import { css, html, LitElement } from 'lit';
import { customElement, state, property  } from 'lit/decorators';
import '@vaadin/menu-bar';
import { MenuBarItem, MenuBarItemSelectedEvent } from '@vaadin/menu-bar';
import {createTemplate} from "Frontend/getIcons";
import {Icon} from "@vaadin/icon";
import {Upload} from "@vaadin/upload";
import { DataSet, Network } from "vis";
import '@vaadin/vertical-layout';
import {PropertyValues} from "lit";
import {randomBytes} from "crypto";

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
        height: 350px;
        width: 100%;
      }
       #customId {
        padding: 0;
        height: 70vh;
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
  private selectedNodes = [];

  @property()
  private anchorList = [];
  @property()
  private knotList = [];
  @property()
  private attributeList: object[] = [];
  @property()
  private tieList = [];
  @property()
  private edgeList = [];

  @property()
  private nodeDataSet = new DataSet([]);
  @property()
  private edgeDataSet = new DataSet([]);

  @property()
  private lastId = 1000;

  @property()
  private selectedNode = null;

  private scale = 1;

  private anchorMenuBarItem = {id: 1, component: this.createItem('anchor-add', 'lean-di-icons', '1')};
  private attributeMenuBarItem = {id: 2, component: this.createItem('attribute-add', 'lean-di-icons', '2')}
  private composedAttributeMenuBarItem = {id: 3, component: this.createItem('attribute-composed-add', 'lean-di-icons', '2')}
  private historicalAttributeMenuBarItem = {id: 3, component: this.createItem('attribute-his-add', 'lean-di-icons', '2')}
  private tieWithAnchorMenuBarItem = {id: 3, component: this.createItem('tie-a-add', 'lean-di-icons', '2')}
  private tieMenuBarItem = {id: 3, component: this.createItem('tie-add', 'lean-di-icons', '2')}
  private historicalTieWithAnchorMenuBarItem = {id: 3, component: this.createItem('tie-his-a-add', 'lean-di-icons', '2')}
  private historicalTieMenuBarItem = {id: 3, component: this.createItem('tie-his-add', 'lean-di-icons', '2')}

  @state()
  public itemsForAnchorsMenuBar = [this.anchorMenuBarItem];
  @state()
  private itemsForZoomAndSearchMenuBar = [
    {id: 1, component: this.createItem('search-plus', 'vaadin', '4')},
    {id: 2, component: this.createItem('search-minus', 'vaadin', '5')},
    {id: 3, component: this.createItem('search', 'vaadin', '6')},
    {id: 4, component: this.createItem('download', 'lumo', '7')},
  ];

  @property()
  public historicalAttributes = [];
  @state()
  private historicalTies = [];
  @state()
  private fabergeNodes = [];
  @state()
  private fixedNodes = [];

  @property()
  private network!: Network;

  private $server?: VisJsComponentServerInterface;

  @property()
  private mnemonic = "";
  @property()
  private descriptor = "";
  @property()
  private description = "";
  @property()
  private mneAndDescriptorVisibility = 'hidden';
  @property()
  private descriptionVisibility = 'hidden'
  @property()
  private checkBoxesVisibility = 'hidden';
  @property()
  private checkBoxValues = []

  render() {
    return html`
      <div style="position: absolute; z-index: 1; background-color: transparent;">
        <vaadin-horizontal-layout style="width: 100%;">
          <vaadin-vertical-layout style="width: 50vw">
            <vaadin-menu-bar
                .items="${this.itemsForAnchorsMenuBar}"
                theme="icon"
                style=" background-color: hsla(0, 0%, 100%, 0.3);"
            >
            </vaadin-menu-bar>
          </vaadin-vertical-layout>
          <vaadin-vertical-layout style="width: 48vw; align-items: flex-end">
            <vaadin-menu-bar
                .items="${this.itemsForZoomAndSearchMenuBar}"
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
                                 value="${this.mnemonic}"
                                 style="visibility: ${this.mneAndDescriptorVisibility}"
                                 @value-changed="${this.mnemonicChanged}"
              >
              </vaadin-text-field>
              <vaadin-text-field label="Дескриптор"
                                 theme="text-field-width"
                                 value="${this.descriptor}"
                                 style="visibility: ${this.mneAndDescriptorVisibility}"
                                 @value-changed="${this.descriptorChanged}"
              />
              </vaadin-text-field>
              <vaadin-text-area label="Описание"
                                theme="text-field-width"
                                value="${this.description}"
                                style="visibility: ${this.descriptionVisibility}"
                                @value-changed="${this.descriptionChanged}"
                                caret="20"
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
                  @value-changed="${this.checkBoxChanged}"
              >
                <vaadin-checkbox label="Исторический"
                                 theme="vertical"
                                 style="visibility: ${this.checkBoxesVisibility}"
                                 value="0"
                >
                </vaadin-checkbox>
                <vaadin-checkbox label="Кнотированный"
                                 theme="vertical"
                                 style="visibility: ${this.checkBoxesVisibility}"
                                 value="1"
                >
                </vaadin-checkbox>
                <vaadin-checkbox-group>
            </vaadin-vertical-layout>
          </div>
          <div style="width: 60%">
            <vaadin-vertical-layout theme="spacing-padding"
            ">
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
    this.initTree();
    this.$server?.fillComponentRequest();
    this.lastId = 1000;
  }

  initTree() {

    const data = {
      nodes: this.nodeDataSet,
      edges: this.edgeDataSet,
    };
    const options = {

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
    this.network.moveTo({scale: 0.25})
  }

  private clickAction() {
    this.$server!.displayNotification("Click on button");
  }

  checkBoxChanged(e: CustomEvent) {

    let values = e.detail.value.sort();

    try {
      let nodeId = this.network.getSelectedNodes();
      let node = this.nodeDataSet.get(nodeId)[0]

      if(this.selectedNode != null) {

        this.attributeChangeTimeRange(values, node);
        this.tieChangeTimeRange(values, node);
        this.attributeChangeKnotRange(values, node);
        this.tieChangeKnotRange(values, node);

        this.checkBoxValues = values;

      }

    } catch (e) {
    }


    // if (this.selectedNode != null) {
    //   // @ts-ignore
    //   let node = this.network.body.data.nodes._data[this.selectedNode];
    //
    //
    //   if(this.checkBoxValues != e.detail.value){
    //       // this.checkBoxValues = e.detail.value;
    //
    //       if(e.detail.value.includes('0') ){
    //           if(node['type'] == 4){
    //               node['type'] = 6;
    //           } else if(node['type'] == 2) {
    //               node['type'] = 5;
    //           }
    //           node = this.fillNode(node);
    //           // @ts-ignore
    //           this.network.body.data.nodes.update(node);
    //           if(e.detail.value.includes('1')){
    //               this.addNode(3, false);
    //           } else {
    //               let connectedNodes = this.network.getConnectedNodes(this.selectedNode);
    //
    //               for(let index in connectedNodes){
    //                   // @ts-ignore
    //                   let nodeToCheck = this.network.body.data.nodes._data[connectedNodes[index]];
    //                   if(nodeToCheck['type'] == 3) {
    //                       let connectedEdges = this.network.getConnectedEdges(nodeToCheck['id']);
    //                       if(connectedEdges.length > 1){
    //                           for(let edgeIndex in connectedEdges){
    //                               // @ts-ignore
    //                               if(connectedEdges[edgeIndex]['from'] == this.selectedNode
    //                                   // @ts-ignore
    //                                   || connectedEdges[edgeIndex]['to'] == this.selectedNode){
    //                                   // @ts-ignore
    //                                   this.network.body.data.edges.remove(connectedEdges[edgeIndex]);
    //                               }
    //                           }
    //                       } else {
    //                           // @ts-ignore
    //                           this.network.body.data.nodes.remove(nodeToCheck['id']);
    //                       }
    //                   }
    //               }
    //           }
    //
    //       } else  {
    //           if(node['type'] == 6){
    //               // @ts-ignore
    //               this.historicalAttributes.splice(this.historicalAttributes.indexOf(node['id']), 1);
    //               node['type'] = 4;
    //           } else if(node['type'] == 5) {
    //               this.historicalTies.splice(this.historicalTies.indexOf(node['id']), 1);
    //               node['type'] = 2;
    //           }
    //           node = this.fillNode(node);
    //           // @ts-ignore
    //           this.network.body.data.nodes.update(node);
    //           if(e.detail.value.includes('1')){
    //               this.addNode(3, false);
    //           } else {
    //               let connectedNodes = this.network.getConnectedNodes(this.selectedNode);
    //
    //               for(let index in connectedNodes){
    //                   // @ts-ignore
    //                   let nodeToCheck = this.network.body.data.nodes._data[connectedNodes[index]];
    //                   if(nodeToCheck['type'] == 3) {
    //                       let connectedEdges = this.network.getConnectedEdges(nodeToCheck['id']);
    //                       if(connectedEdges.length > 1){
    //                           for(let edgeIndex in connectedEdges){
    //                               // @ts-ignore
    //                               if(connectedEdges[edgeIndex]['from'] == this.selectedNode
    //                                   // @ts-ignore
    //                                   || connectedEdges[edgeIndex]['to'] == this.selectedNode){
    //                                   // @ts-ignore
    //                                   this.network.body.data.edges.remove(connectedEdges[edgeIndex]);
    //                               }
    //                           }
    //                       } else {
    //                           // @ts-ignore
    //                           this.network.body.data.nodes.remove(nodeToCheck['id']);
    //                       }
    //                   }
    //               }
    //           }
    //
    //       }
    //       // @ts-ignore
    //
    //       this.checkBoxValues = e.detail.value;
    //   }
    // }
  }

  attributeChangeKnotRange(values: any, node: any){
    if(values.includes('1') && node['knotRange'] == null && node['type'] == 4){
      // @ts-ignore
      let knot = this.addKnot();
      node['knotRange'] = knot['mnemonic'];
      // @ts-ignore
      this.nodeDataSet.update([node]);
    }
    if(!values.includes('1') && node['knotRange'] != null && node['type'] == 4){
      // @ts-ignore
      const knot = this.knotList.filter(knotNode => knotNode['id'] == node['knotRange']);
      if(this.network.getConnectedNodes(knot[0]['id']).length == 1){
        this.nodeDataSet.remove(knot[0]['id']);
      }
      // @ts-ignore
      this.knotList.splice(this.knotList.indexOf(knot));
      node['knotRange'] = null;
      // @ts-ignore
      this.nodeDataSet.update([node]);
    }
  }
  tieChangeKnotRange(values: any, node: any){
    if(values.includes('1') && node['knotRole'] == null && node['type'] == 2){
      // @ts-ignore
      let knot = this.addKnot();
      node['knotRole'] = {
        description: knot['description'],
        type: knot['mnemonic'],
        identifier: true,
        role: "role"
      };
      // @ts-ignore
      this.nodeDataSet.update([node]);
    }
    if(!values.includes('1') && node['knotRole'] != null && node['type'] == 2){
      // @ts-ignore
      const knot = this.knotList.filter(knotNode => knotNode['id'] == node['knotRole']['type']);
      const connectedEdgesId = this.network.getConnectedEdges(knot[0]['id']);
      if(connectedEdgesId.length == 1){
        this.nodeDataSet.remove(knot[0]['id']);
        // @ts-ignore
        this.knotList.splice(this.knotList.indexOf(knot));
        // @ts-ignore
        this.fixedNodes.splice(this.fixedNodes.indexOf(knot[0]['id']));
      }
      for(let index in connectedEdgesId){
        this.deleteEdge(node, connectedEdgesId[index], knot);
      }

      node['knotRole'] = null;
      // @ts-ignore
      this.nodeDataSet.update([node]);
    }
  }

  deleteEdge(node: any, edgeId: any, knot: any){
    let edge = this.edgeDataSet.get(edgeId);
    // @ts-ignore
    if((edge['from'] == node['id'] && edge['to'] == knot[0]['id']) || (edge['from']== knot[0]['id'] && edge['to'] == node['id'])){
      // @ts-ignore
      this.edgeDataSet.remove(edge['id']);
      let edgeToDel = this.edgeList.filter(e => (e['from'] == node['id'] && e['to'] == knot[0]['id']) || (e['from']== knot[0]['id'] && e['to'] == node['id']));
      // @ts-ignore
      this.edgeList.splice(edgeToDel, 1);
    }
  }

  addKnot(){
    let mnemonic = randomBytes(2).toString('hex').substring(0, 3);

    let node = {
      "id": mnemonic,
      "label": "KnotExample",
      "descriptor": "KnotExample",
      "description": "Knot Example Description",
      "mnemonic": mnemonic,
      "type": 3,
      "x": 0,
      "y": 0,
      "fixed": false,
    }
    node = this.fillKnotFigure(node);
    // @ts-ignore
    this.knotList.push(node);
    // @ts-ignore
    this.nodeDataSet.add([node]);
    this.connectNodes(node);
    return node;
  }

  attributeChangeTimeRange(values: any, node: any){
    if(values.includes('0') && node['timeRange'] == null && node['type'] == 4){
      // @ts-ignore
      node['timeRange'] = 'bigint';
      // @ts-ignore
      this.nodeDataSet.update([node]);
      // @ts-ignore
      this.historicalAttributes.push(node['id']);
    }
    if(!values.includes('0') && node['timeRange'] != null && node['type'] == 4){
      // @ts-ignore
      node['timeRange'] = null;
      // @ts-ignore
      this.nodeDataSet.update([node]);
      // @ts-ignore
      this.historicalAttributes.splice(this.historicalAttributes.indexOf(node['id']), 1);
    }
  }
  tieChangeTimeRange(values: any, node: any){
    if(values.includes('0') && node['timeRange'] == null && node['type'] == 2){
      // @ts-ignore
      node['timeRange'] = 'bigint';
      // @ts-ignore
      this.nodeDataSet.update([node]);
      // @ts-ignore
      this.historicalTies.push(node['id']);
    }
    if(!values.includes('0') && node['timeRange'] != null && node['type'] == 2){
      // @ts-ignore
      node['timeRange'] = null;
      // @ts-ignore
      this.nodeDataSet.update([node]);
      // @ts-ignore
      this.historicalTies.splice(this.historicalTies.indexOf(node['id']), 1);
    }
  }

  descriptorChanged(e: CustomEvent) {
    if (this.selectedNode != null) {
      // @ts-ignore
      let node = this.network.body.data.nodes._data[this.selectedNode];
      let nodePosition = this.network.getPositions([node['id']]);
      if (this.descriptor != e.detail.value) {
        this.descriptor = e.detail.value;
        node['label'] = this.descriptor;
        node['x'] = nodePosition[node['id']].x;
        node['y'] = nodePosition[node['id']].y;
        this.nodeDataSet.update(node)
      }
    }
  }
  mnemonicChanged(e: CustomEvent) {
    if (this.selectedNode != null) {
      // @ts-ignore
      let node = this.network.body.data.nodes._data[this.selectedNode];
      let nodePosition = this.network.getPositions([node['id']]);
      if (this.mnemonic != e.detail.value) {
        this.mnemonic = e.detail.value;
        node['mnemonic'] = this.mnemonic;
        node['x'] = nodePosition[node['id']].x;
        node['y'] = nodePosition[node['id']].y;
        this.nodeDataSet.update(node)
      }
    }
  }
  descriptionChanged(e: CustomEvent) {
    if(this.selectedNode != null){

      // @ts-ignore
      let node = this.network.body.data.nodes._data[this.selectedNode];
      let nodePosition = this.network.getPositions([node['id']]);
      if (this.description != e.detail.value) {
        this.description = e.detail.value;
        node['description'] = this.description;
        node['x'] = nodePosition[node['id']].x;
        node['y'] = nodePosition[node['id']].y;
        this.nodeDataSet.update(node)
      }
    }
  }

  createItem(iconName: string, iconRepo: string, id: string) {

    const item = document.createElement('vaadin-context-menu-item');
    const icon = new Icon();
    icon.setAttribute('icon', `${iconRepo}:${iconName}`)

    item.setAttribute('id', String(id))
    item.setAttribute('theme', "icon")

    if (iconName == 'search-plus') {
      item.onclick = () => {
        this.scale = this.scale * 1.5;
        this.network.moveTo({scale: this.scale});
      };
    }
    if (iconName === 'search-minus') {
      item.onclick = () => {
        this.scale = this.scale / 1.5;
        this.network.moveTo({scale: this.scale});
      };
    }

    if (iconName === 'download') {
      item.onclick = () => {
        this.download()
      }
    }

    if (iconName === 'anchor-add') {
      item.onclick = () => this.addAnchor();
    }
    if (iconName === 'tie-add') {
      item.onclick = () => this.addTie();
    }
    if (iconName === 'tie-his-add') {
      item.onclick = () => this.addHistoricalTie();
    }
    if (iconName === 'tie-a-add') {
      item.onclick = () => this.addAnchoredTie();
    }
    if (iconName === 'tie-his-a-add') {
      item.onclick = () => this.addAnchoredHistoricalTie();
    }
    if (iconName === 'attribute-add') {
      item.onclick = () => this.addAttribute();
    }
    if (iconName === 'attribute-his-add') {
      item.onclick = () => this.addHistoricalAttribute();
    }
    if (iconName === 'attribute-composed-add') {
      item.onclick = () => this.addComposedAttribute();
    }

    item.appendChild(icon);
    return item;
  }

  addAnchor(){
    let mnemonic = randomBytes(2).toString('hex').substring(0, 2);
    let node = {
      "id": mnemonic,
      "label": "AnchorExample",
      "descriptor": "AnchorExample",
      "description": "Anchor Example Description",
      "mnemonic": mnemonic,
      "type": 1,
      "x": 0,
      "y": 0,
      "fixed": false
    }
    node = this.fillAnchorFigure(node);
    // @ts-ignore
    this.anchorList.push(node);
    // @ts-ignore
    this.nodeDataSet.add([node]);
    this.connectNodes(node);
    this.itemsForAnchorsMenuBar = [this.anchorMenuBarItem]
    return node;
  }
  addTie(){
    this.lastId++;
    let mnemonic = this.lastId.toString();
    let node = {
      "id": mnemonic,
      "label": null,
      "descriptor": null,
      "description": "Tie Example Description",
      "mnemonic": mnemonic,
      "type": 2,
      "x": 0,
      "y": 0,
      "fixed": false
    }
    node = this.fillTieFigure(node);
    // @ts-ignore
    this.tieList.push(node);
    // @ts-ignore
    this.nodeDataSet.add([node]);
    this.connectNodes(node);
    this.itemsForAnchorsMenuBar = [this.anchorMenuBarItem]
    return node;
  }
  addHistoricalTie(){
    this.lastId++;
    let mnemonic = this.lastId.toString();
    let node = {
      "id": mnemonic,
      "label": null,
      "descriptor": null,
      "description": "Tie Example Description",
      "mnemonic": mnemonic,
      "type": 2,
      "x": 0,
      "y": 0,
      "fixed": false,
      "timeRange": "bigint"
    }
    node = this.fillTieFigure(node);
    // @ts-ignore
    this.tieList.push(node);
    // @ts-ignore
    this.nodeDataSet.add([node]);
    this.connectNodes(node);
    this.itemsForAnchorsMenuBar = [this.anchorMenuBarItem]
    return node;
  }
  addAnchoredTie(){
    let tie = this.addTie();
    let anchor = this.addAnchor();
    let edge = this.fillEdge(tie['id'], anchor['id']);
    // @ts-ignore
    this.edgeDataSet.add([edge]);
    // @ts-ignore
    // this.edgeList.push(edge);
    this.itemsForAnchorsMenuBar = [this.anchorMenuBarItem]
  }
  addAnchoredHistoricalTie(){
    let tie = this.addHistoricalTie();
    let anchor = this.addAnchor();
    let edge = this.fillEdge(tie['id'], anchor['id']);
    // @ts-ignore
    this.edgeDataSet.add([edge]);
    // @ts-ignore
    // this.edgeList.push(edge);
    this.itemsForAnchorsMenuBar = [this.anchorMenuBarItem]
  }
  addAttribute(){
    let mnemonic = randomBytes(2).toString('hex').substring(0, 3);
    let node = {
      "id": this.network.getSelectedNodes()[0].toString() + "_" + mnemonic,
      "label": "AttributeExample",
      "descriptor": "AttributeExample",
      "description": "Attribute Example Description",
      "mnemonic": mnemonic,
      "type": 4,
      "x": 0,
      "y": 0,
      "fixed": false
    }
    node = this.fillAttributeFigure(node);
    // @ts-ignore
    this.attributeList.push(node);
    // @ts-ignore
    this.nodeDataSet.add([node]);
    this.connectNodes(node);
    this.itemsForAnchorsMenuBar = [this.anchorMenuBarItem]
    return node;
  }
  addHistoricalAttribute(){
    let mnemonic = randomBytes(2).toString('hex').substring(0, 3);
    let node = {
      "id": this.network.getSelectedNodes()[0].toString() + "_" + mnemonic,
      "label": "AttributeExample",
      "descriptor": "AttributeExample",
      "description": "Attribute Example Description",
      "mnemonic": mnemonic,
      "type": 4,
      "x": 0,
      "y": 0,
      "fixed": false,
      "timeRange": "bigint"
    }
    node = this.fillAttributeFigure(node);
    // @ts-ignore
    this.attributeList.push(node);
    // @ts-ignore
    this.nodeDataSet.add([node]);
    this.connectNodes(node);
    this.itemsForAnchorsMenuBar = [this.anchorMenuBarItem]
    return node;
  }
  addComposedAttribute(){
    let mnemonic = randomBytes(2).toString('hex').substring(0, 3);
    let node = {
      "id": this.network.getSelectedNodes()[0].toString() + "_" + mnemonic,
      "label": "AttributeExample",
      "descriptor": "AttributeExample",
      "description": "Attribute Example Description",
      "mnemonic": mnemonic,
      "type": 4,
      "x": 0,
      "y": 0,
      "fixed": false,
      "innerColumn": [""]
    }
    node = this.fillAttributeFigure(node);
    // @ts-ignore
    this.attributeList.push(node);
    // @ts-ignore
    this.nodeDataSet.add([node]);
    this.connectNodes(node);
    this.itemsForAnchorsMenuBar = [this.anchorMenuBarItem]
    return node;
  }

  connectNodes(node: any){
    for (let i = 0; i < this.network.getSelectedNodes().length; i++) {
      try {
        let edge = this.fillEdge(node['id'], this.network.getSelectedNodes()[i].toString());
        // @ts-ignore
        this.edgeDataSet.add([edge]);
        // @ts-ignore
        // this.edgeList.push(edge);
        // @ts-ignore
      } catch (err) {
        console.log(err)
      }
    }
    if(node['type'] != 3 && node['type'] != 4){
      this.network.unselectAll();
      this.selectedNode = null;
      this.checkBoxValues = [];
      this.checkBoxesVisibility = 'hidden';
    }

  }

  download() {
    this.$server!.addNodesAndEdges(
        // @ts-ignore
        JSON.stringify(this.network.body.data.nodes._data),
        // @ts-ignore
        JSON.stringify(this.network.body.data.edges._data),
    );
  };

  allNodesIsTypedAs(nodeType: any) {
    // @ts-ignore
    let array = this.network.getSelectedNodes().filter(node => this.network.body.nodes[node].options.type != nodeType);
    return array.length == 0;
  }

  getTree(anchors: string, knots: string, ties: string) {

    this.getKnots(knots);
    this.getAnchors(anchors);
    this.getTies(ties);

    this.edgeDataSet.add(this.edgeList)

    this.initEvents();

  }

  getAnchors(anchors: string) {
    this.anchorList = JSON.parse(anchors);
    // @ts-ignore
    this.anchorList = this.anchorList.map(node => this.parseAnchor(node));
    this.nodeDataSet.add(this.anchorList);
    // @ts-ignore
    this.nodeDataSet.add(this.attributeList)
  }
  parseAnchor(anchor: object | any) {

    anchor = this.parseNodeMainData(anchor);
    anchor = this.parseNodeLayout(anchor);
    anchor = this.fillAnchorFigure(anchor);

    this.getAttributes(anchor);

    return anchor;
  }

  getAttributes(anchor: object | any) {
    for (let attributeIndex in anchor['attribute']) {
      let attribute = anchor['attribute'][attributeIndex];
      attribute = this.parseAttribute(attribute, anchor);
      this.fillEdge(anchor['id'], attribute['id']);
      this.attributeList.push(attribute);
    }
  }
  parseAttribute(attribute: object | any, anchor: object | any) {

    attribute = this.parseNodeMainData(attribute, anchor);
    attribute = this.parseNodeLayout(attribute, anchor);
    attribute = this.fillAttributeFigure(attribute);

    this.getKnot(attribute);

    return attribute;
  }
  getKnot(attribute: object | any) {
    if (attribute['knotRange'] != null) {
      this.fillEdge(attribute['id'], attribute['knotRange']);
    }
  }

  getKnots(knots: string) {
    this.knotList = JSON.parse(knots);
    // @ts-ignore
    this.knotList = this.knotList.map(node => this.parseKnot(node));
    this.nodeDataSet.add(this.knotList)
  }
  parseKnot(knot: object | any) {
    knot = this.parseNodeMainData(knot);
    knot = this.parseNodeLayout(knot);
    knot = this.fillKnotFigure(knot);

    return knot;
  }

  getTies(ties: string) {
    this.tieList = JSON.parse(ties);
    // @ts-ignore
    this.tieList = this.tieList.map(node => this.parseTie(node));
    this.nodeDataSet.add(this.tieList)
  }
  parseTie(tie: object | any) {
    tie = this.parseNodeMainData(tie);
    tie = this.parseNodeLayout(tie);
    tie = this.fillTieFigure(tie);

    this.getConnections(tie);

    return tie;
  }
  getConnections(tie: object | any) {
    for (let anchorIndex in tie['anchorRole']) {
      let anchorRole = tie['anchorRole'][anchorIndex];
      this.fillEdge(tie['id'], anchorRole['type']);
    }
    if (tie['knotRole'] != null) {
      let knotRole = tie['knotRole'];
      this.fillEdge(tie['id'], knotRole['type']);
    }
  }

  fillEdge(idFrom: string, idTo: string) {
    let edge = {
      'from': idFrom,
      'to': idTo,
      'color': {
        'color': "#000000"
      },
      'length': 200

    }
    // @ts-ignore
    this.edgeList.push(edge)
    return edge;
  }

  parseNodeMainData(node: object | any, parentNode?: object | any) {
    if (node['mnemonic'] == null) {
      node['id'] = this.lastId.toString();
      node['_id'] = null;
      this.lastId++;
    } else {

      if (parentNode != null) {
        node['id'] = parentNode['mnemonic'] + "_" + node['mnemonic'];
      } else {
        node['id'] = node['mnemonic']
      }

      node['_id'] = node['id'];
    }
    node['label'] = node['descriptor'];
    return node;
  }
  parseNodeLayout(node: object | any, motherNode?: object | any) {
    if(motherNode != null && motherNode['layout'] != null){
      node['fixed'] = false;
      node['x'] = motherNode['layout']["x"] * 1.5 + Math.random() * 200;
      node['y'] = motherNode['layout']["y"] * 1.5 + Math.random() * 200;
    } else{
      if (node['layout'] != null) {
        if (node['layout']["fixed"] === true) {
          node['fixed'] = node['layout']["fixed"];
          node['x'] = node['layout']["x"];
          node['y'] = node['layout']["y"];
          // @ts-ignore
          this.fixedNodes.push(node["id"]);
        }
      } else {
        node['fixed'] = false;
        node['x'] = 700;
        node['y'] = 700;
      }
    }


    return node;
  }

  fillAnchorFigure(node: object | any) {
    node["color"] = {
      border: "#f66",
      background: "#f66"
    };
    node['_group'] = node['group'];
    delete node['group'];
    node["shape"] = "square";
    node['type'] = 1;
    return node;
  }
  fillAttributeFigure(node: object | any) {
    node["color"] = {
      border: "#f66",
      background: '#ffffff'
    };
    // @ts-ignore
    node["borderWidth"] = 2;
    // @ts-ignore
    node["shape"] = "dot";
    node['type'] = 4;
    if(node['innerColumn'] != null){
      if (node["innerColumn"].length != 0) {
        // @ts-ignore
        this.fabergeNodes.push(node["id"]);
      }
    }
    if (node["timeRange"] != null) {
      // @ts-ignore
      this.historicalAttributes.push(node["id"]);
    }
    return node;
  }
  fillKnotFigure(node: object | any) {
    node["color"] = {
      border: "#f66",
      background: '#ffffff'
    };
    // @ts-ignore
    node["borderWidth"] = 2;
    // @ts-ignore
    node["shape"] = "square";
    // @ts-ignore
    node["scaling"] = {
      label: {
        enabled: true,
        min: 50,
        max: 50
      }
    };
    node['type'] = 3;
    // let selectedNodes = this.network.getSelectedNodes();
    // if(selectedNodes.length != 0){
    //   node['x'] = this.network.getPositions(selectedNodes[0])[selectedNodes[0]].x;
    //   node['y'] = this.network.getPositions(selectedNodes[0])[selectedNodes[0]].y;
    // }
    return node;
  }
  fillTieFigure(node: object | any) {
    node["color"] = {
      border: "#c0c0c0",
      background: '#c0c0c0'
    };
    // @ts-ignore
    node["shape"] = "diamond";
    node['type'] = 2;
    // @ts-ignore
    if (node["timeRange"] != null) {
      // @ts-ignore
      this.historicalTies.push(node["id"]);
    }
    return node;
  }


  initEvents(){

    let step;
    let nodePosition;

    this.network.on("afterDrawing", (ctx) => {
      for (step = 0; step < this.historicalAttributes.length; step++) {
        nodePosition = this.network.getPositions([this.historicalAttributes[step]]);
        ctx.strokeStyle = '#f66';
        ctx.lineWidth = 2;
        ctx.circle(
            nodePosition[this.historicalAttributes[step]].x,
            nodePosition[this.historicalAttributes[step]].y,
            15
        );
        ctx.stroke();
      }
      for (step = 0; step < this.historicalTies.length; step++) {
        nodePosition = this.network.getPositions([this.historicalTies[step]]);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.diamond(nodePosition[this.historicalTies[step]].x, nodePosition[this.historicalTies[step]].y, 20);
        ctx.stroke();

      }
      for (step = 0; step < this.fixedNodes.length; step++) {
        nodePosition = this.network.getPositions([this.fixedNodes[step]]);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;

        ctx.circle(
            nodePosition[this.fixedNodes[step]].x,
            nodePosition[this.fixedNodes[step]].y,
            2
        );

        ctx.stroke();

      }
      for (step = 0; step < this.fabergeNodes.length; step++) {
        nodePosition = this.network.getPositions([this.fabergeNodes[step]]);
        if(this.selectedNodes.includes(this.fabergeNodes[step])){
          ctx.strokeStyle = '#2B7CE9'
          ctx.fillStyle = '#D2E5FF'
        }
        else {
          ctx.strokeStyle = '#f66';
          ctx.fillStyle='#ffffff'
        }
        ctx.lineWidth = 2;
        ctx.circle(
            nodePosition[this.fabergeNodes[step]].x + 35,
            nodePosition[this.fabergeNodes[step]].y,
            25
        );
        ctx.fill()
        ctx.stroke();
      }
    });
    this.network.on("selectNode", (params) => {

      const selectedNodeId = params.nodes[0];
      // @ts-ignore
      this.selectedNodes.push(selectedNodeId)
      this.selectedNode = selectedNodeId;
      // @ts-ignore
      const node = this.network.body.nodes[selectedNodeId];
      console.log(node)
      this.switchCaseMenuBar(node);
      this.fillWorkplace(params);

    });
    this.network.on("deselectNode", (params) => {

      const selectedNodeId = params.nodes[0];
      // @ts-ignore
      this.selectedNodes.splice(this.selectedNodes.indexOf(selectedNodeId), 1);
      // @ts-ignore
      const node = this.network.body.nodes[selectedNodeId];

      this.switchCaseMenuBar(node);

      this.checkBoxValues = [];
      this.checkBoxesVisibility = 'hidden';

      // this.description = "";
      // this.descriptor = "";
      // this.mnemonic = "";

      this.mneAndDescriptorVisibility = 'hidden';
      this.descriptionVisibility = 'hidden';




    });
    this.network.on( 'doubleClick', (properties) => {
      const ids = properties.nodes;
      if (ids.length > 0) {
        // @ts-ignore
        const node = this.network.body.data.nodes._data[ids[0]];
        // @ts-ignore
        if (this.fixedNodes.includes(ids[0])) {
          // @ts-ignore
          node["fixed"] = false;
          // @ts-ignore
          this.network.body.data.nodes.update(node);
          // @ts-ignore
          const index = this.fixedNodes.indexOf(ids[0]);
          this.fixedNodes.splice(index, 1);
        } else {
          // @ts-ignore
          this.fixedNodes.push(ids[0]);
          node["fixed"] = true;
          const pos = this.network.getPositions([ids[0]]);
          node["x"] = pos[ids[0]].x;
          node["y"] = pos[ids[0]].y;
          // @ts-ignore
          this.network.body.data.nodes.update(node);
        }
      }
    });
    this.network.on( 'oncontext', (properties) => {

      const a = this.network.getNodeAt(properties.pointer.DOM);
      const b = this.network.getEdgeAt(properties.pointer.DOM);

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
          console.log('Успех:', response);
        } catch (error) {
          console.error('Ошибка:', error);
        }
      }
    });
    this.network.on('dragStart', (params) => {

      const selectedNodeId = params.nodes[0];

      let node = null;

      if(selectedNodeId != null){
        // @ts-ignore
        this.selectedNodes.push(selectedNodeId)
        this.selectedNode = selectedNodeId;
        // @ts-ignore
        node = this.network.body.nodes[selectedNodeId];
      }

      if(params.nodes.length != 0){
        this.switchCaseMenuBar(node);
        this.fillWorkplace(params)
      }

      const ids = params.nodes;
      if (ids.length > 0) {
        // @ts-ignore
        const node = this.network.body.data.nodes._data[ids[0]];
        node["fixed"] = false;
        const pos = this.network.getPositions([ids[0]]);
        node["x"] = pos[ids[0]].x;
        node["y"] = pos[ids[0]].y;
        // @ts-ignore
        this.network.body.data.nodes.update(node);
      }
    });
    this.network.on('dragEnd', (properties) => {
      const ids = properties.nodes;
      if (ids.length > 0) {
        // @ts-ignore
        if (this.fixedNodes.includes(ids[0])) {
          // @ts-ignore
          const node = this.network.body.data.nodes._data[ids[0]];
          node["fixed"] = true;
          const pos = this.network.getPositions([ids[0]]);
          node["x"] = pos[ids[0]].x;
          node["y"] = pos[ids[0]].y;
          // @ts-ignore
          this.network.body.data.nodes.update(node);
        }
      }
    });
  }

  switchCaseMenuBar(node: any){

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
  }

  fillWorkplace(properties: any){
    const selectedNodeId = properties.nodes[0].toString();
    // this.$server!.workplaceFillComponent(selectedNodeId);

    // @ts-ignore
    const node = this.network.body.nodes[selectedNodeId];

    this.mnemonic = node.options.mnemonic;
    this.descriptor = node.options.label;
    this.description = node.options.description;

    this.checkBoxValues = [];

    if(node.options.type != 3 && node.options.type != 1 && properties.nodes.length == 1){
      this.checkBoxesVisibility = 'visible';

      let connectedNodes = this.network.getConnectedNodes(selectedNodeId);
      for(let id in connectedNodes){
        // @ts-ignore
        if (this.network.body.nodes[connectedNodes[id]].options.type == 3) {
          // @ts-ignore
          this.checkBoxValues = ['1'];
          break;
        }
      }

      if (node.options.timeRange != null) {
        // @ts-ignore
        this.checkBoxValues.push('0')
      }

    } else {
      this.checkBoxesVisibility = 'hidden';
    }


  }

  fillItemList(nodeType: any){

    switch (nodeType){
      case 0: {
        this.mneAndDescriptorVisibility = 'visible';
        this.descriptionVisibility = 'visible';
        this.itemsForAnchorsMenuBar = [
          this.anchorMenuBarItem
        ];
        break;
      }
      case 7:{
        this.mneAndDescriptorVisibility = 'hidden';
        this.descriptionVisibility = 'hidden';
        this.itemsForAnchorsMenuBar = [
          this.tieMenuBarItem,
          this.tieWithAnchorMenuBarItem,
          this.historicalTieMenuBarItem,
          this.historicalTieWithAnchorMenuBarItem
        ];
        break;
      }
      case 1: {
        this.mneAndDescriptorVisibility = 'visible';
        this.descriptionVisibility = 'visible';
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
        this.descriptionVisibility = 'visible';
        this.itemsForAnchorsMenuBar = [
          this.anchorMenuBarItem
        ];
        break;
      }
      case 3:
      case 4:
      case 6: {
        this.mneAndDescriptorVisibility = 'visible';
        this.descriptionVisibility = 'visible';
        this.itemsForAnchorsMenuBar = [];
        break;
      }
    }
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