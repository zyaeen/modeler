import {css, html, LitElement, PropertyValues} from 'lit';
import {customElement, property, state} from 'lit/decorators';
import '@vaadin/menu-bar';
import {createTemplate} from "Frontend/getIcons";
import {DataSet, Edge, IdType, Network, Node} from "vis";
import '@vaadin/vertical-layout';
import {randomBytes} from "crypto";

import {AnchorEditorLayout} from "Frontend/CustomLitComponents/AnchorEditorLayout";
import "Frontend/CustomLitComponents/LeftSideMenuBar";
import "Frontend/CustomLitComponents/RightSideMenuBar";
import {KnotEditorLayout} from "Frontend/CustomLitComponents/KnotEditorLayout";

const template = createTemplate();
document.head.appendChild(template.content);


@customElement('custom-tag')
export class VisJsComponent extends LitElement {

  static get styles() {
    return css`
      .text-field-width{
        width: 100%;
      }
      anchor-editor-layout{
        width: 100%;
      }
      knot-editor-layout{
        width: 100%;
      }
      [slot="label"] {
        font-size: medium;
        font-weight: normal ;
      }
      [theme="spacing-padding"] {
        height: 350px;
        width: 100%;
        padding-top: 0;
      }
      [theme="spacing-xs padding"]{
        padding-top: 0;
                height: 350px;

      }
       #customId {
        padding: 0;
        height: 97vh;
        width: 98vw;
        margin: 0;
      }
      #bottomPanel {
        position: absolute; 
        z-index: 2; 
        left: 20px;
        bottom: 10px;
        width: 98%;
        height: 400px;
        background-color: white; 
        border-style: solid; 
        border-color:  #006AF5; 
        border-radius: 3px;
        border-width: 1px;
      }
  }
`;
  }


  @state()
  private selectedNodes : IdType[] = [];

  @property()
  private anchorList :Node[] = [];
  @property()
  private knotList : Node[] = [];
  @property()
  private attributeList: Node[] = [];
  @property()
  private tieList: Node[] = [];
  @property()
  private edgeList: Edge[] = [];


  @property()
  private nodeDataSet = new DataSet<Node>([]);
  @property()
  private edgeDataSet = new DataSet<Edge>([]);

  @property()
  private lastId = 1000;

  @property()
  private selectedNode : IdType | null  = null;

  private scale = 1;

  @property()
  private activeNode: Node | null = null;

  @property()
  private pinAll = false;


  @property()
  public historicalAttributes : string[] = [];
  @state()
  private historicalTies : string[] = [];
  @state()
  private fabergeNodes : string[] = [];
  @state()
  private fixedNodes : string[] = [];
  @state()
  private transAnchors : string[] = [];

  @property()
  private network!: Network;

  private $server?: VisJsComponentServerInterface;


  @property()
  private metadataLayoutVisibility = 'none';


  private nodeAddingEventHandlerStructure: {[element: string] : () => void} = {
    'anchor-add': () => this.addAnchor(),
    'tie-add': () => this.addTie(),
    'tie-his-add': () => this.addHistoricalTie(),
    'tie-a-add': () => this.addAnchoredTie(),
    'tie-his-a-add': () => this.addAnchoredHistoricalTie(),
    'attribute-add': () => this.addAttribute(),
    'attribute-his-add': () => this.addHistoricalAttribute(),
    'attribute-composed-add': () => this.addComposedAttribute()
  }

  @property()
  private chosenNodeType = 0;

  @property()
  private renderingComponent : AnchorEditorLayout | KnotEditorLayout | null = null;

  render() {
    return html`

      <div style="position: absolute; z-index: 1; background-color: transparent; left: 20px">
        <left-side-menu-bar
            @add-node-event="${(e: CustomEvent) => {this.nodeAddingEventHandlerStructure[e.detail]()}}"
            .chosenNodeType = "${this.chosenNodeType}"
            style=" background-color: hsla(0, 0%, 100%, 0.3);"
        >
        </left-side-menu-bar>
      </div>
      <div style="position: absolute; z-index: 1; background-color: transparent; right: 20px">
        <right-side-menu-bar
            style=" background-color: hsla(0, 0%, 100%, 0.3);"
            @zoom-event="${(e: CustomEvent) => this.handleZoom(e)}"
            @pin-event="${(e: CustomEvent) => this.handlePin(e)}"
            @search-event="${(e: CustomEvent) => this.handleSearch(e)}"
            @downloadEvent="${(e: CustomEvent) => this.handleDownload(e)}"
        >
        </right-side-menu-bar>
      </div>
      <div id="customId"></div>
      <div id="bottomPanel"
           style="display: ${this.metadataLayoutVisibility};"
      >
        ${this.renderingComponent}
      </div>
    `
  }

  handleNodeMetadataChanging(source: any){

    if(source.name == 'descriptor'){
      this.activeNode!['label'] = source.value;
      // @ts-ignore
      this.activeNode![source.name] = source.value;
    } else if(source.name.includes('metadata')){
      // @ts-ignore
      if(this.activeNode['metadata'] == null){
        // @ts-ignore
        this.activeNode['metadata'] = {};
      }
      let nameKeys = source.name.split(".");
      if(source.type == 'checkbox'){
        // @ts-ignore
        this.activeNode['metadata'][nameKeys[1]] = source.checked;
      } else {
        // @ts-ignore
        this.activeNode['metadata'][nameKeys[1]] = source.value;
      }
      // @ts-ignore
      this.activeNode['metadata'][nameKeys[1]] = source.value;
    } else if (source.name == '_group') {
      // @ts-ignore
      this.activeNode[source.name] = [
        {
          "id": source.value
        }
      ]
    } else {
      if(source.type == 'checkbox'){
        // @ts-ignore
        this.activeNode[source.name] = source.checked;
      } else {
        // @ts-ignore
        this.activeNode[source.name] = source.value;
      }
    }
  }


  createAnchorEditorComponent(){
    this.renderingComponent = new AnchorEditorLayout();
    this.renderingComponent.setAnchor(this.activeNode);
    this.renderingComponent.render();
    this.initInputEvent();
  }
  createKnotEditorComponent(){
    this.renderingComponent = new KnotEditorLayout();
    this.renderingComponent.setKnot(this.activeNode);
    this.renderingComponent.render();
    this.initInputEvent();
  }

  initInputEvent(){
    this.renderingComponent!.oninput = (e: Event) => {
      // @ts-ignore
      this.handleNodeMetadataChanging(e.path[0]);
      this.activeNode = this.setPositions(this.activeNode);
      this.nodeDataSet.update(this.activeNode!);
    };
  }

  getSelectedNode(){
    let nodeId = this.network.getSelectedNodes();
    let node : { [key: string]: any } = this.nodeDataSet.get(nodeId)[0]
    return node;
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
      },
      physics: {
        enabled: true,
        stabilization: {
          enabled: false
        }
      }
    };

    this.network = new Network(
        this.shadowRoot!.getElementById("customId")!,
        data,
        options
    );
    this.network.moveTo({scale: 0.25})
  }


  setPositions(node: any){
    let nodePosition = this.network.getPositions([node['id']]);
    node['x'] = nodePosition[node['id']].x;
    node['y'] = nodePosition[node['id']].y;
    return node;
  }

  deleteEdge(node: any, edgeId: any, knot: any){
    let edge : Edge = this.edgeDataSet.get(edgeId);
    if((edge['from'] == node['id'] && edge['to'] == knot[0]['id']) || (edge['from']== knot[0]['id'] && edge['to'] == node['id'])){
      this.edgeDataSet.remove(edge['id'] as IdType);
      let edgeToDel = this.edgeList.filter(e => (e['from'] == node['id'] && e['to'] == knot[0]['id']) || (e['from']== knot[0]['id'] && e['to'] == node['id']));
      this.edgeList.splice(this.edgeList.indexOf(edgeToDel[0]), 1);
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
      "knotRole": null
    }
    node = this.fillKnotFigure(node);
    this.knotList.push(node);
    this.nodeDataSet.add([node]);
    this.connectNodes(node);
    return node;
  }

  handleZoom(e: CustomEvent){
    if (e.detail == 'zoom-plus') {
      if(this.network.getScale() * 1.3 <= 1.5){
        this.scale = this.scale * 1.3;
        this.network.moveTo({scale: this.scale});
      }
    }
    else {
        if(this.network.getScale() / 1.3 >= 0.2){
          this.scale = this.scale / 1.3;
          this.network.moveTo({scale: this.scale});
        }
    }
  }

  handleDownload(e: CustomEvent){
    this.download();
  }
  handleSearch(e: CustomEvent){
    try {
      switch (e.detail.length) {
        case 2: {
          for (let anchorIndex = 0; anchorIndex < this.anchorList.length; anchorIndex++) {
            // @ts-ignore
            if (this.anchorList[anchorIndex]['mnemonic'] == e.detail) {
              this.network.focus(this.anchorList[anchorIndex]['id']!, {animation: true});
              this.network.selectNodes([this.anchorList[anchorIndex]['id']!]);
            }
          }
          break;
        }
      }
    }
    catch (e){
    }
  }
  handlePin(e: CustomEvent){
    if(this.pinAll){
      this.nodeDataSet.forEach(node => {
        if(!this.fixedNodes.includes(node.id as string)){
          this.nodeDataSet.update({id: node.id, fixed: true});
          this.fixedNodes.push(node.id as string)
        }
      });

      this.pinAll = false;
    } else {
      this.nodeDataSet.forEach(node => {
        if(this.fixedNodes.includes(node.id as string)){
          this.nodeDataSet.update({id: node.id, fixed: false});
          this.fixedNodes.splice(this.fixedNodes.indexOf(node.id as string), 1);
        }
      });
      this.pinAll = true;
    }
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
    this.anchorList.push(node);
    this.nodeDataSet.add([node]);
    this.connectNodes(node);
    this.chosenNodeType = 0;
    this.network.unselectAll();
    return node;
  }

  createTieNodeTemplate(){
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
    return node;
  }
  addTieToLayoutProperties(node: object){
    this.tieList.push(node);
    this.nodeDataSet.add([node]);
    this.connectNodes(node);
    this.chosenNodeType = 0;
    this.network.unselectAll();
  }
  addTie(){
    let node = this.createTieNodeTemplate();
    node = this.fillTieFigure(node);
    this.addTieToLayoutProperties(node);
    return node;
  }
  addHistoricalTie(){
    let node =  this.createTieNodeTemplate();
    // @ts-ignore
    node['timeRange'] = 'BIGINT';
    node = this.fillTieFigure(node);
    this.addTieToLayoutProperties(node);
    return node;
  }
  addAnchoredTie(){
    let tie = this.addTie();
    let anchor = this.addAnchor();
    let edge = this.fillEdge(tie['id'], anchor['id']);
    this.edgeDataSet.add([edge]);
  }
  addAnchoredHistoricalTie(){
    let tie = this.addHistoricalTie();
    let anchor = this.addAnchor();
    let edge = this.fillEdge(tie['id'], anchor['id']);
    this.edgeDataSet.add([edge]);
  }

  createAttributeNodeTemplate(){
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
      "knotRange": null
    }
    return node;
  }
  addAttribute(){
    let node = this.createAttributeNodeTemplate();
    node = this.fillAttributeFigure(node);
    this.addAttributeToLayoutProperties(node);
    return node;
  }
  addHistoricalAttribute(){
    let node = this.createAttributeNodeTemplate();
    // @ts-ignore
    node['timeRange'] = 'BIGINT';
    node = this.fillAttributeFigure(node);
    this.addAttributeToLayoutProperties(node);
    return node;
  }
  addComposedAttribute(){
    let node = this.createAttributeNodeTemplate();
    // @ts-ignore
    node['innerColumn'] = [""];
    node = this.fillAttributeFigure(node);
    this.addAttributeToLayoutProperties(node);
    return node;
  }
  addAttributeToLayoutProperties(node : Node){
    this.attributeList.push(node);
    this.nodeDataSet.add([node]);
    this.connectNodes(node);
    this.chosenNodeType = 0;
    this.network.unselectAll();
  }

  connectNodes(node: any){
    for (let i = 0; i < this.network.getSelectedNodes().length; i++) {
      try {
        let edge = this.fillEdge(node['id'], this.network.getSelectedNodes()[i].toString());
        this.edgeDataSet.add([edge]);
      } catch (err) {
        console.log(err)
      }
    }
    if(node['type'] != 3 && node['type'] != 4){
      this.network.unselectAll();
      this.selectedNode = null;
    }

  }

  download() {
    // this.$server!.addNodesAndEdges(
    //     JSON.stringify(this.network.body.data.nodes._data),
    //     JSON.stringify(this.network.body.data.edges._data),
    // );
  };

  allNodesIsTypedAs(nodeType: any) {
    //@ts-ignore
    let array = this.network.getSelectedNodes().filter(node => this.nodeDataSet.get(node)!.type != nodeType);
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
    this.anchorList = this.anchorList.map(node => this.parseAnchor(node));
    this.nodeDataSet.add(this.anchorList);
    this.nodeDataSet.add(this.attributeList)
  }
  parseAnchor(anchor: object) {

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
  parseAttribute(attribute: object, anchor: object) {

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
    this.knotList = this.knotList.map(node => this.parseKnot(node));
    this.nodeDataSet.add(this.knotList)
  }
  parseKnot(knot: object) {
    knot = this.parseNodeMainData(knot);
    knot = this.parseNodeLayout(knot);
    knot = this.fillKnotFigure(knot);

    return knot;
  }

  getTies(ties: string) {
    this.tieList = JSON.parse(ties);
    this.tieList = this.tieList.map(node => this.parseTie(node));
    this.nodeDataSet.add(this.tieList)
  }
  parseTie(tie: object) {
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
    this.edgeList.push(edge)
    return edge;
  }

  parseNodeMainData(node: object | any, parentNode?: object | any) {
    if (node['mnemonic'] == null) {
      node['id'] = this.lastId.toString();
      node['_id'] = null;
      this.lastId++;
    } else {

      node['_id'] = node['id'];

      if (parentNode != null) {
        node['id'] = parentNode['mnemonic'] + "_" + node['mnemonic'];
      } else {
        node['id'] = node['mnemonic']
      }

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
          this.fixedNodes.push(node["id"]);
        }
      } else {
        node['fixed'] = false;
        node['x'] = 700;
        node['y'] = 700;
      }
    }
    if(node['transactional'] != null && node['transactional'] == true){
      this.transAnchors.push(node['id']);
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
    node["borderWidth"] = 2;
    node["shape"] = "dot";
    node['type'] = 4;
    if(node['innerColumn'] != null){
      if (node["innerColumn"].length != 0) {
        this.fabergeNodes.push(node["id"]);
      }
    }
    if (node["timeRange"] != null) {
      this.historicalAttributes.push(node["id"]);
    }
    return node;
  }
  fillKnotFigure(node: object | any) {
    node["color"] = {
      border: "#f66",
      background: '#ffffff'
    };
    node["borderWidth"] = 2;
    node["shape"] = "square";
    node["scaling"] = {
      label: {
        enabled: true,
        min: 50,
        max: 50
      }
    };
    node['type'] = 3;
    return node;
  }
  fillTieFigure(node: object | any) {
    node["color"] = {
      border: "#c0c0c0",
      background: '#c0c0c0'
    };
    node["shape"] = "diamond";
    node['type'] = 2;
    if (node["timeRange"] != null) {
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
      for (step = 0; step < this.transAnchors.length; step++) {
        nodePosition = this.network.getPositions([this.transAnchors[step]]);
        ctx.strokeStyle = '#000000';
        ctx.font = "30px arial";
        ctx.fillText(
            "TX",
            nodePosition[this.transAnchors[step]].x,
            nodePosition[this.transAnchors[step]].y - 35,
        );

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

      this.selectedNode = params.nodes[0];
      this.selectedNodes.push(this.selectedNode!);

      const node = this.getSelectedNode();

      this.switchCaseMenuBar(node);
      // this.fillWorkplace(params);

      this.activeNode = node;

      // @ts-ignore
      if(this.activeNode.type == 1){
        this.createAnchorEditorComponent();
      }
      // @ts-ignore
      if(this.activeNode.type == 3){
        this.createKnotEditorComponent();
      }

    });
    this.network.on("deselectNode", (params) => {

      const selectedNodeId = params.nodes[0];
      this.selectedNodes.splice(this.selectedNodes.indexOf(selectedNodeId), 1);
      const node = this.getSelectedNode();

      this.switchCaseMenuBar(node);

      this.metadataLayoutVisibility = 'none';

      this.selectedNode = null;
      this.renderingComponent = null;
    });
    this.network.on( 'doubleClick', (properties) => {
      const ids = properties.nodes;
      if (ids.length > 0) {
        const node = this.nodeDataSet.get(ids[0]);
        if (this.fixedNodes.includes(ids[0])) {
          // @ts-ignore
          node["fixed"] = false;
          this.nodeDataSet.update(node);
          // @ts-ignore
          const index = this.fixedNodes.indexOf(ids[0]);
          this.fixedNodes.splice(index, 1);
        } else {
          this.fixedNodes.push(ids[0]);
          // @ts-ignore
          node["fixed"] = true;
          const pos = this.network.getPositions([ids[0]]);
          // @ts-ignore
          node["x"] = pos[ids[0]].x;
          // @ts-ignore
          node["y"] = pos[ids[0]].y;
          // @ts-ignore
          this.nodeDataSet.update(node);
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
    this.network.on('zoom', () => {
      if( this.network.getScale() > 1.5 )//the limit you want to stop at
      {
        this.network.moveTo({scale: 1.5}); //set this limit so it stops zooming out here
      }
      if( this.network.getScale() < 0.2 )//the limit you want to stop at
      {
        this.network.moveTo({scale: 0.2}); //set this limit so it stops zooming out here
      }
    });
    this.network.on('dragStart', (params) => {

      const selectedNodeId = params.nodes[0];

      let node = null;

      if(selectedNodeId != null){
        this.selectedNodes.push(selectedNodeId)
        this.selectedNode = selectedNodeId;
        node = this.nodeDataSet.get([selectedNodeId]);
      }

      if(params.nodes.length != 0){
        this.switchCaseMenuBar(node);
        this.fillWorkplace(params)
      }

      const ids = params.nodes;
      if (ids.length > 0) {
        // @ts-ignore
        const node = this.nodeDataSet.get(ids[0]);
        // @ts-ignore
        node["fixed"] = false;
        const pos = this.network.getPositions([ids[0]]);
        // @ts-ignore
        node["x"] = pos[ids[0]].x;
        // @ts-ignore
        node["y"] = pos[ids[0]].y;
        // @ts-ignore
        this.nodeDataSet.update(node);
      }
    });
    this.network.on('dragEnd', (properties) => {
      const ids = properties.nodes;
      if (ids.length > 0) {
        if (this.fixedNodes.includes(ids[0])) {
          // @ts-ignore
          const node = this.nodeDataSet.get(ids[0]);
          // @ts-ignore
          node["fixed"] = true;
          const pos = this.network.getPositions([ids[0]]);
          // @ts-ignore
          node["x"] = pos[ids[0]].x;
          // @ts-ignore
          node["y"] = pos[ids[0]].y;
          this.nodeDataSet.update(node);
        }
      }
    });
  }

  switchCaseMenuBar(node: any){
    if (this.network.getSelectedNodes().length == 1){
      this.fillItemList(node.type);
      this.chosenNodeType = node.type;
    } else if(this.network.getSelectedNodes().length == 0) {
      this.fillItemList(0);
      this.chosenNodeType = 0;
    }
    else if (this.allNodesIsTypedAs(node.type)
        && this.network.getSelectedNodes().length > 1){
      if(node.type == 1){
        this.fillItemList(7);
        this.chosenNodeType = 7;
      }
    } else {
      this.fillItemList(3);
      this.chosenNodeType = 3;
    }
  }

  fillWorkplace(properties: any) {

    const selectedNodeId = properties.nodes[0].toString();
    const node = this.nodeDataSet.get(selectedNodeId);

    // @ts-ignore
    if(node.type != 3 && node.type != 1 && properties.nodes.length == 1){

      let connectedNodes = this.network.getConnectedNodes(selectedNodeId);
      for(let id in connectedNodes){
        // @ts-ignore
        if (this.nodeDataSet.get(connectedNodes[id]).type == 3) {
          // @ts-ignore
          if(node.type == 2){
            // @ts-ignore
            this.knotRole = node.knotRole.type;
          } else {
            // @ts-ignore
            this.knotRange = node.knotRange;
          }
          break;
        }
      }
      // @ts-ignore
      if (node.timeRange != null && node.timeRange != "") {
        // @ts-ignore
        this.timeRange = node.timeRange;
      }

    } else {

    }

    if(properties.nodes.length > 1){
      this.metadataLayoutVisibility = 'none';
    }


  }

  fillItemList(nodeType: any){

    switch (nodeType){
      case 0: {
        this.metadataLayoutVisibility = 'flex';

        break;
      }
      case 7:{
        this.metadataLayoutVisibility = 'none';
        break;
      }
      case 1: {
        this.metadataLayoutVisibility = 'flex';

        break;
      }
      case 2:
      case 5: {
        this.metadataLayoutVisibility = 'flex';
        break;
      }
      case 3:{
        this.metadataLayoutVisibility = 'flex';
        break;
      }
      case 4:
      case 6: {
        this.metadataLayoutVisibility = 'flex';
        break;
      }
    }
  }

}

interface VisJsComponentServerInterface {
  fillComponentRequest(): void;
}

