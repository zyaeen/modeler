import {css, html, LitElement, PropertyValues} from 'lit';
import {customElement, property, state} from 'lit/decorators';
import '@vaadin/menu-bar';
import {createTemplate} from "Frontend/getIcons";
import {Icon} from "@vaadin/icon";
import {DataSet, Edge, IdType, Network, Node} from "vis";
import '@vaadin/vertical-layout';
import {randomBytes} from "crypto";
import {TextField} from "@vaadin/text-field";
import {CheckboxCheckedChangedEvent} from "@vaadin/checkbox";

const template = createTemplate();
document.head.appendChild(template.content);


@customElement('custom-tag')
export class VisJsComponent extends LitElement {

  static get styles() {
    return css`
      .text-field-width{
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

  private metadataKeys = ["privacy", "capsule", "restatable", "generator", "idempotent", "deletable"]

  @property()
  private nodeDataSet = new DataSet<Node>([]);
  @property()
  private edgeDataSet = new DataSet<Edge>([]);

  @property()
  private lastId = 1000;

  @property()
  private selectedNode : IdType | null  = null;

  @property()
  private privacy : string | null = "";
  @property()
  private timeRange : string | null = "";
  @property()
  private _id : string | null= ""
  @property()
  private accessType : string | null = ""
  @property()
  private deprecated : boolean | null = false
  @property()
  private identity : string | null = ""
  @property()
  private inheritPerm : string | null = ""
  @property()
  private capsule : string | null = ""
  @property()
  private generator : boolean | null = false
  @property()
  private idempotent : boolean | null = false
  @property()
  private restatable : boolean | null = false
  @property()
  private deletable : boolean | null = false
  @property()
  private skip : boolean | null = false
  @property()
  private dataRange : string | null = ""
  @property()
  private included : boolean | null = false
  @property()
  private columnName : string | null = ""
  @property()
  private nullable : boolean | null = false;
  @property()
  private restrictedAccess : boolean | null = false
  @property()
  private _group : string | null | object = ""
  @property()
  private knotRole : string | null | object = ""
  @property()
  private knotRange : string | null = ""
  @property()
  private transactional : boolean | null = false;

  private scale = 1;

  @property()
  private pinAll = false;

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
    {id: 0, component: this.createItem('pin', 'vaadin', '4')},
    {id: 1, component: this.createItem('search-plus', 'vaadin', '4')},
    {id: 2, component: this.createItem('search-minus', 'vaadin', '5')},
    {id: 3, component: this.createItem('search', 'vaadin', '6'), children: [{ component: this.createSearchTextBox()}] },
    {id: 4, component: this.createItem('download', 'lumo', '7')},
  ];

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
  private mnemonic : string | null = "";
  @property()
  private descriptor : string | null = "";
  @property()
  private description : string | null = "";
  @property()
  private mneAndDescriptorVisibility : string = 'none';
  @property()
  private descriptionVisibility : string = 'none'

  render() {
    return html`
      <div style="position: absolute; z-index: 1; background-color: transparent; left: 20px">
        <vaadin-menu-bar
            .items="${this.itemsForAnchorsMenuBar}"
            theme="icon"
            style=" background-color: hsla(0, 0%, 100%, 0.3);"
        >
        </vaadin-menu-bar>
      </div>
      <div style="position: absolute; z-index: 1; background-color: transparent; right: 20px">
        <vaadin-menu-bar
            .items="${this.itemsForZoomAndSearchMenuBar}"
            theme="icon"
            style=" background-color: hsla(0, 0%, 100%, 0.3);"
        >
        </vaadin-menu-bar>
      </div>
      <div id="customId"></div>
      <div id="bottomPanel"
           style="display: ${this.mneAndDescriptorVisibility == 'none' && this.descriptionVisibility == 'none' ? 'none' : 'flex'};"
      >

        <vaadin-horizontal-layout theme="spacing-xs padding" style="width: 100%; margin-top: 15px;">

          <vaadin-vertical-layout theme="spacing-xs padding" style="width: 15%;">
            <vaadin-text-field label="Мнемоник"
                               class="text-field-width"
                               value="${this.mnemonic}"
                               style="display: ${this.mneAndDescriptorVisibility}"
                               @value-changed="${this.mnemonicChanged}"
            >
            </vaadin-text-field>
            <vaadin-text-field label="Дескриптор"
                               class="text-field-width"
                               value="${this.descriptor}"
                               style="display: ${this.mneAndDescriptorVisibility}"
                               @value-changed="${this.descriptorChanged}"
            >
            </vaadin-text-field>
            <vaadin-text-area label="Описание"
                              class="text-field-width"
                              value="${this.description}"
                              style="display: ${this.descriptionVisibility}; max-height: 120px;"
                              @value-changed="${this.descriptionChanged}"
                              caret="20"
            >
            </vaadin-text-area>
          </vaadin-vertical-layout>


          <vaadin-horizontal-layout style="width: 85%; display: ${this.attributeLayout}" theme="spacing-xs padding">


            <vaadin-vertical-layout theme="spacing-xs padding">
              <vaadin-combo-box label="TimeRange" name="timeRange"
                                class="text-field-width"
                                value="${this.timeRange}"
                                .items="${['DATETIME', 'BIGINT']}"
                                @selected-item-changed="${this.comboBoxChanged}"
              >

              </vaadin-combo-box>
              <vaadin-text-field label="KnotRange" name="knotRange"
                                 class="text-field-width"
                                 value="${this.knotRange}"
                                 readonly
              >
              </vaadin-text-field>
              <br>
              <vaadin-checkbox @checked-changed="${ this.histCheckBoxChanged }"
                               label="Исторический"
                               .checked = "${this.timeRange != null && this.timeRange != ""}"
              >
              </vaadin-checkbox>
              <vaadin-checkbox @checked-changed="${ this.knotRangeCheckBoxChanged }"
                               label="Кнотированный"
                               .checked = "${this.knotRange != null && this.knotRange != ""}"
              >
              </vaadin-checkbox>

            </vaadin-vertical-layout>


            <vaadin-vertical-layout theme="spacing-xs padding">
              <vaadin-text-field label="DataRange" name="dataRange"
                                 class="text-field-width"
                                 value="${this.dataRange}"
                                 @value-changed="${this.layoutDataChanged}"
              >
              </vaadin-text-field>
              <vaadin-text-field label="Column Name" name="columnName"
                                 class="text-field-width"
                                 value="${this.columnName}"
                                 @value-changed="${this.layoutDataChanged}"
              >
              </vaadin-text-field>
              <br>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Deprecated" name="deprecated"
                               .checked=${this.deprecated}
              >
              </vaadin-checkbox>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Skip" name="skip"
                               .checked=${this.skip}
              >
              </vaadin-checkbox>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Nullable" name="nullable"
                               .checked=${this.nullable}
              >
              </vaadin-checkbox>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Restricted Access"
                               .checked=${this.restrictedAccess}
              >
              </vaadin-checkbox>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Included" name="included"
                               .checked=${this.included}
              >
              </vaadin-checkbox>
            </vaadin-vertical-layout>



            <vaadin-vertical-layout theme="spacing-xs padding">
              <vaadin-text-field label="Privacy" name="privacy"
                                 class="text-field-width"
                                 value="${this.privacy}"
                                 @value-changed="${this.layoutDataChanged}"
              >
              </vaadin-text-field>
              <vaadin-text-field label="Capsule" name="capsule"
                                 class="text-field-width"
                                 value="${this.capsule }"
                                 @value-changed="${this.layoutDataChanged}"
              >
              </vaadin-text-field>
              <br>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Restatable" name="restatable"
                               .checked=${this.restatable}
              >
              </vaadin-checkbox>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Generator" name="generator"
                               .checked=${this.generator}
              >
              </vaadin-checkbox>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Idempotent" name="idempotent"
                               .checked=${this.idempotent}
              >
              </vaadin-checkbox>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Deletable" name="deletable"
                               .checked=${this.deletable}
              >
              </vaadin-checkbox>
            </vaadin-vertical-layout>


            <vaadin-vertical-layout style="width: 100%">
              <vaadin-tabsheet style="width: 100%">
                <vaadin-tabs theme="equal-width-tabs">
                  <vaadin-tab>Индексы</vaadin-tab>
                </vaadin-tabs>

                <vaadin-vertical-layout theme="padding">
                  <p>"323"</p>
                </vaadin-vertical-layout>

              </vaadin-tabsheet>
            </vaadin-vertical-layout>


          </vaadin-horizontal-layout>

          <vaadin-horizontal-layout style="width: 85%; display: ${this.anchorLayout}" theme="spacing-xs padding">


            <vaadin-vertical-layout theme="spacing-xs padding">
              <vaadin-text-field label="Id" name="_id"
                                 class="text-field-width"
                                 value="${this._id }"
                                 @value-changed="${this.layoutDataChanged}"
              >
              </vaadin-text-field>
              <vaadin-text-field label="Identity" name="identity"
                                 class="text-field-width"
                                 value="${this.identity}"
                                 @value-changed="${this.layoutDataChanged}"
              >
              </vaadin-text-field>
              <vaadin-text-field label="InheritPermission" name="inheritPerm"
                                 class="text-field-width"
                                 value="${this.inheritPerm }"
                                 @value-changed="${this.layoutDataChanged}"
              >
              </vaadin-text-field>
            </vaadin-vertical-layout>


            <vaadin-vertical-layout theme="spacing-xs padding">
              <vaadin-text-field label="Group" name="_group"
                                 class="text-field-width"
                                 value="${this._group }"
                                 @value-changed="${this.layoutDataChanged}"
              >
              </vaadin-text-field>
              <vaadin-text-field label="Access Type" name="accessType"
                                 class="text-field-width"
                                 value="${this.accessType }"
                                 @value-changed="${this.layoutDataChanged}"
              >
              </vaadin-text-field>
              <br>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Deprecated" name="deprecated"
                               .checked=${this.deprecated}
              >
              </vaadin-checkbox>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Skip" name="skip"
                               .checked=${this.skip}
              >
              </vaadin-checkbox>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Transactional" name="transactional"
                               .checked=${this.transactional}
              >
              </vaadin-checkbox>
            </vaadin-vertical-layout>



            <vaadin-vertical-layout theme="spacing-xs padding">
              <vaadin-text-field label="Privacy" name="privacy"
                                 class="text-field-width"
                                 value="${this.privacy }"
                                 @value-changed="${this.layoutDataChanged}"
              >
              </vaadin-text-field>
              <vaadin-text-field label="Capsule" name="capsule"
                                 class="text-field-width"
                                 value="${this.capsule }"
                                 @value-changed="${this.layoutDataChanged}"
              >
              </vaadin-text-field>
              <br>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Restatable" name="restatable"
                               .checked=${this.restatable}
              >
              </vaadin-checkbox>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Generator" name="generator"
                               .checked=${this.generator}
              >
              </vaadin-checkbox>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Idempotent" name="idempotent"
                               .checked=${this.idempotent}
              >
              </vaadin-checkbox>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Deletable" name="deletable"
                               .checked=${this.deletable}
              >
              </vaadin-checkbox>
            </vaadin-vertical-layout>



            <vaadin-vertical-layout style="width: 100%">
              <vaadin-tabsheet style="width: 100%">
                <vaadin-tabs theme="equal-width-tabs">
                  <vaadin-tab>Динамика</vaadin-tab>
                  <vaadin-tab>Статика</vaadin-tab>
                  <vaadin-tab>Индексы</vaadin-tab>
                </vaadin-tabs>

                <vaadin-vertical-layout theme="padding">
                  <p>"323"</p>
                </vaadin-vertical-layout>

              </vaadin-tabsheet>
            </vaadin-vertical-layout>


          </vaadin-horizontal-layout>

          <vaadin-horizontal-layout style="width: 85%; display: ${this.knotLayout}" theme="spacing-xs padding">


            <vaadin-vertical-layout theme="spacing-xs padding">
              <vaadin-text-field label="DataRange" name="dataRange"
                                 class="text-field-width"
                                 value="${this.dataRange }"
                                 @value-changed="${this.layoutDataChanged}"
              >
              </vaadin-text-field>
              <vaadin-text-field label="Identity" name="identity"
                                 class="text-field-width"
                                 value="${this.identity}"
                                 @value-changed="${this.layoutDataChanged}"
              >
              </vaadin-text-field>
              <br>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Deprecated" name="deprecated"
                               .checked=${this.deprecated}
              >
              </vaadin-checkbox>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Skip" name="skip"
                               .checked=${this.skip}
              >
              </vaadin-checkbox>
            </vaadin-vertical-layout>




            <vaadin-vertical-layout theme="spacing-xs padding">
              <vaadin-text-field label="Privacy" name="privacy"
                                 class="text-field-width"
                                 value="${this.privacy }"
                                 @value-changed="${this.layoutDataChanged}"
              >
              </vaadin-text-field>
              <vaadin-text-field label="Capsule" name="capsule"
                                 class="text-field-width"
                                 value="${this.capsule }"
                                 @value-changed="${this.layoutDataChanged}"
              >
              </vaadin-text-field>
              <br>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Restatable" name="restatable"
                               .checked=${this.restatable}
              >
              </vaadin-checkbox>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Generator" name="generator"
                               .checked=${this.generator}
              >
              </vaadin-checkbox>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Idempotent" name="idempotent"
                               .checked=${this.idempotent}
              >
              </vaadin-checkbox>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Deletable" name="deletable"
                               .checked=${this.deletable}
              >
              </vaadin-checkbox>
            </vaadin-vertical-layout>


            <vaadin-vertical-layout style="width: 100%">
              <vaadin-tabsheet style="width: 100%">
                <vaadin-tabs theme="equal-width-tabs">
                  <vaadin-tab>Items</vaadin-tab>
                </vaadin-tabs>

                <vaadin-vertical-layout theme="padding">
                  <p>"323"</p>
                </vaadin-vertical-layout>

              </vaadin-tabsheet>
            </vaadin-vertical-layout>


          </vaadin-horizontal-layout>

          <vaadin-horizontal-layout style="width: 85%; display: ${this.tieLayout}" theme="spacing-xs padding">


            <vaadin-vertical-layout theme="spacing-xs padding">
              <vaadin-combo-box label="TimeRange" name="timeRange"
                                class="text-field-width"
                                value="${this.timeRange}"
                                .items="${['DATETIME', 'BIGINT']}"
                                @selected-item-changed="${this.comboBoxChanged}"
              >
              </vaadin-combo-box>
              <vaadin-text-field label="KnotRole" name="knotRole"
                                 class="text-field-width"
                                 value="${this.knotRole}"
                                 readonly
              >
              </vaadin-text-field>
              <br>
              <vaadin-checkbox @checked-changed="${ this.histCheckBoxChanged }"
                               label="Исторический"
                               .checked = "${this.timeRange != null && this.timeRange != ""}"
              >
              </vaadin-checkbox>
              <vaadin-checkbox @checked-changed="${ this.knotRoleCheckBoxChanged }"
                               label="Кнотированный"
                               .checked = "${this.knotRole != null && this.knotRole != ""}"
              >
              </vaadin-checkbox>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Deprecated" name="deprecated"
                               .checked=${this.deprecated}
              >
              </vaadin-checkbox>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Skip" name="skip"
                               .checked=${this.skip}
              >
              </vaadin-checkbox>
            </vaadin-vertical-layout>


            <vaadin-vertical-layout theme="spacing-xs padding">
              <vaadin-text-field label="Privacy" name="privacy"
                                 class="text-field-width"
                                 value="${this.privacy }"
                                 @value-changed="${this.layoutDataChanged}"
              >
              </vaadin-text-field>
              <vaadin-text-field label="Capsule" name="capsule"
                                 class="text-field-width"
                                 value="${this.capsule }"
                                 @value-changed="${this.layoutDataChanged}"
              >
              </vaadin-text-field>
              <br>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Restatable" name="restatable"
                               .checked=${this.restatable}
              >
              </vaadin-checkbox>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Generator" name="generator"
                               .checked=${this.generator}
              >
              </vaadin-checkbox>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Idempotent" name="idempotent"
                               .checked=${this.idempotent}
              >
              </vaadin-checkbox>
              <vaadin-checkbox @checked-changed="${ (e: CheckboxCheckedChangedEvent) =>  this.layoutDataChanged(e) }"
                               label="Deletable" name="deletable"
                               .checked=${this.deletable}
              >
              </vaadin-checkbox>
            </vaadin-vertical-layout>



            <vaadin-vertical-layout style="width: 100%">
              <vaadin-tabsheet style="width: 100%">
                <vaadin-tabs theme="equal-width-tabs">
                  <vaadin-tab>Индексы</vaadin-tab>
                </vaadin-tabs>

                <vaadin-vertical-layout theme="padding">
                  <p>"323"</p>
                </vaadin-vertical-layout>

              </vaadin-tabsheet>
            </vaadin-vertical-layout>


          </vaadin-horizontal-layout>


        </vaadin-horizontal-layout>
      </div>
    `
  }

  @property()
  private attributeLayout : string = 'none';
  @property()
  private anchorLayout : string = 'none';
  @property()
  private tieLayout : string = 'none';
  @property()
  private knotLayout : string = 'none';

  setAnchorLayout(){
    this.anchorLayout = 'flex';
    this.attributeLayout = 'none';
    this.knotLayout = 'none';
    this.tieLayout = 'none';
  }
  setAttributeLayout(){
    this.anchorLayout = 'none';
    this.attributeLayout = 'flex';
    this.knotLayout = 'none';
    this.tieLayout = 'none';
  }
  setKnotLayout(){
    this.anchorLayout = 'none';
    this.attributeLayout = 'none';
    this.knotLayout = 'flex';
    this.tieLayout = 'none';
  }
  setTieLayout(){
    this.anchorLayout = 'none';
    this.attributeLayout = 'none';
    this.knotLayout = 'none';
    this.tieLayout = 'flex';
  }
  setNullLayout(){
    this.anchorLayout = 'none';
    this.attributeLayout = 'none';
    this.knotLayout = 'none';
    this.tieLayout = 'none';

    this.mneAndDescriptorVisibility = 'none';
    this.descriptionVisibility = 'none';

  }

  private createSearchTextBox(){
    let item = new TextField();
    item.placeholder = "Имя анкера или мнемоник";
    item.style.width='300px';
    item.oninput = () => {
      try {
        switch (item.value.length) {
          case 2: {
            for (let anchorIndex = 0; anchorIndex < this.anchorList.length; anchorIndex++) {
              // @ts-ignore
              if (this.anchorList[anchorIndex]['mnemonic'] == item.value) {
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
    return item;
  }

  knotRoleCheckBoxChanged(e: CustomEvent){

    if(this.selectedNode != null ){
      let nodeId = this.network.getSelectedNodes();
      let node : { [key: string]: any } = this.nodeDataSet.get(nodeId)[0];

      if((node['knotRole'] != null && node['knotRole'] != "") != e.detail.value){
        if(e.detail.value){
          let knot = this.addKnot();
          node['knotRole'] = {
            description: knot['description'],
            type: knot['mnemonic'],
            identifier: true,
            role: "role"
          };
          this.nodeDataSet.update([node]);
          this.knotRole = knot['mnemonic'];
        } else {
          const knot = this.knotList.filter(knotNode => knotNode['id'] == node['knotRole']['type'] || knotNode['id'] == node['knotRole']);
          const connectedEdgesId = this.network.getConnectedEdges(knot[0]['id']!);

          if(connectedEdgesId.length == 1){
            this.nodeDataSet.remove(knot[0]['id']!);
            this.knotList.splice(this.knotList.indexOf(knot[0]));
            this.fixedNodes.splice(this.fixedNodes.indexOf(knot[0]['id'] as string));
          }
          for(let index in connectedEdgesId){
            this.deleteEdge(node, connectedEdgesId[index], knot);
          }
          node['knotRole'] = null;
          this.knotRole = null;
          this.nodeDataSet.update(node);
        }
      }
    }
  }

  getSelectedNode(){
    let nodeId = this.network.getSelectedNodes();
    let node : { [key: string]: any } = this.nodeDataSet.get(nodeId)[0]

    return node;
  }

  getNodeById(nodeId : number){
    console.log(this.nodeDataSet.get(nodeId)!)
    return this.nodeDataSet.get(nodeId)!;
  }

  knotRangeCheckBoxChanged(e: CustomEvent){

    if(this.selectedNode != null ){

      let node = this.getSelectedNode();

      if((node['knotRange'] != null && node['knotRange'] != "") != e.detail.value){
        if(e.detail.value){
          let knot = this.addKnot();
          node['knotRange'] = knot['mnemonic'];
          this.nodeDataSet.update([node]);
          this.knotRange = node['knotRange'];
        } else {
          const knot = this.knotList.filter(knotNode => knotNode['id'] == node['knotRange']);
          if(this.network.getConnectedNodes(knot[0].id!).length == 1){
            this.nodeDataSet.remove(knot[0].id!);
          }
          this.knotList.splice(this.knotList.indexOf(knot[0]));
          node['knotRange'] = null;
          this.nodeDataSet.update([node]);
          this.knotRange = null;
        }
      }
    }

  }

  histCheckBoxChanged(e: CustomEvent){

    if(this.selectedNode != null ){

      let node = this.getSelectedNode();

      if((node['timeRange'] != null && node['timeRange'] != "") != e.detail.value){
        if(e.detail.value){
          node['timeRange'] = 'BIGINT';
          node = this.setPositions(node);
          this.nodeDataSet.update(node);
          if(node['type'] == 4){
            this.historicalAttributes.push(this.selectedNode as string);
          } else {
            this.historicalTies.push(this.selectedNode as string);
          }
          this.timeRange = node['timeRange'];
        } else {
          node['timeRange'] = null;
          node = this.setPositions(node);
          this.nodeDataSet.update([node]);
          if(node['type'] == 4){
            this.historicalAttributes.splice(this.historicalAttributes.indexOf(node['id']), 1);
          } else {
            this.historicalTies.splice(this.historicalTies.indexOf(node['id']), 1);
          }
          this.timeRange = null;
        }
      }
    }
  }

  comboBoxChanged(e: CustomEvent){
    if(this.selectedNode != null) {
      let node = this.nodeDataSet.get(this.selectedNode);
      // @ts-ignore
      node['timeRange'] = e.detail.value;
      node = this.setPositions(node);
      this.nodeDataSet.update(node as Node);
    }
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

  descriptorChanged(e: CustomEvent) {
    if (this.selectedNode != null) {
      let node = this.getSelectedNode();
      let nodePosition = this.network.getPositions([node['id']]);
      if (this.descriptor != e.detail.value) {
        this.descriptor = e.detail.value;
        node['label'] = this.descriptor;
        node['x'] = nodePosition[node['id']].x;
        node['y'] = nodePosition[node['id']].y;
        this.nodeDataSet.update(node);
      }
    }
  }
  mnemonicChanged(e: CustomEvent) {

    if (this.selectedNode != null) {
      let node = this.getSelectedNode();
      if (this.mnemonic != e.detail.value) {
        this.mnemonic = e.detail.value;
        node['mnemonic'] = this.mnemonic;
        node = this.setPositions(node);
        this.nodeDataSet.update(node)

        if(node['type'] == 3){
          let connectedNodes = this.network.getConnectedNodes(node['id']);
          for(let index = 0; index < connectedNodes.length; index++){
            let connectedNode = this.getNodeById(connectedNodes[index] as number);
            // @ts-ignore
            if(connectedNode['type'] == 4){
              // @ts-ignore
              connectedNode['knotRange'] = this.mnemonic
            } else {
              // @ts-ignore
              connectedNode['knotRole']['type'] = this.mnemonic;
            }
            connectedNode = this.setPositions(connectedNode);
            this.nodeDataSet.update(connectedNode)
          }
        }

      }

    }
  }
  descriptionChanged(e: CustomEvent) {
    if(this.selectedNode != null){
      let node = this.getSelectedNode();
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
  layoutDataChanged(e: CustomEvent){

    let target = e.target as HTMLInputElement;

    if(this.selectedNode != null){
      switch (target.name) {
        case 'timeRange' : {
          this.timeRange = e.detail.value;
          break;
        }
        case 'privacy' : {
          this.privacy = e.detail.value;
          break;
        }
        case '_id' : {
          this._id = e.detail.value;
          break;
        }
        case 'accessType' : {
          this.accessType = e.detail.value;
          break;
        }
        case 'deprecated' : {
          this.deprecated = e.detail.value;
          break;
        }
        case 'identity' : {
          this.identity = e.detail.value;
          break;
        }
        case 'inheritPerm' : {
          this.inheritPerm = e.detail.value;
          break;
        }
        case 'capsule' : {
          this.capsule = e.detail.value;
          break;
        }
        case 'generator' : {
          this.generator = e.detail.value;
          break;
        }
        case 'idempotent' : {
          this.idempotent = e.detail.value;
          break;
        }
        case 'restatable' : {
          this.restatable = e.detail.value;
          break;
        }
        case 'deletable' : {
          this.deletable = e.detail.value;
          break;
        }
        case 'skip' : {
          this.skip = e.detail.value;
          break;
        }
        case 'dataRange' : {
          this.dataRange = e.detail.value;
          break;
        }
        case 'included' : {
          this.included = e.detail.value;
          break;
        }
        case 'columnName' : {
          this.columnName = e.detail.value;
          break;
        }
        case 'nullable' : {
          this.nullable = e.detail.value;
          break;
        }
        case 'restrictedAccess' : {
          this.restrictedAccess = e.detail.value;
          break;
        }
        case '_group' : {
          this._group = e.detail.value;
          break;
        }
        case 'knotRole' : {
          this.knotRole = e.detail.value;
          break;
        }
        case 'knotRange' : {
          this.knotRange = e.detail.value;
          break;
        }
        case 'transactional' : {
          this.transactional = e.detail.value;
          break;
        }
      }
      let node = this.getSelectedNode();
      let nodePosition = this.network.getPositions([node['id']]);

      if(this.metadataKeys.includes(target.name)){
        if(node.metadata != null){
          node.metadata[target.name] = e.detail.value;
        } else {
          node['metadata'] = {}
          node.metadata[target.name] = e.detail.value;
        }
      } else if (target.name=='_group') {
        node[target.name] = [
          {
            id: target.value
          }
        ]
      } else {
        node[target.name] = e.detail.value;
      }
      node['x'] = nodePosition[node['id']].x;
      node['y'] = nodePosition[node['id']].y;
      this.nodeDataSet.update(node)

    }


  }


  createItem(iconName: string, iconRepo: string, id: string) {

    const item = document.createElement('vaadin-context-menu-item');
    const icon = new Icon();
    icon.setAttribute('icon', `${iconRepo}:${iconName}`)

    item.setAttribute('id', String(id))
    item.setAttribute('theme', "icon")

    if (iconName == 'pin') {
      item.onclick = () => {

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

      };
    }
    if (iconName == 'search-plus') {
      item.onclick = () => {
        if(this.network.getScale() * 1.3 <= 1.5){
          this.scale = this.scale * 1.3;
          this.network.moveTo({scale: this.scale});
        }
      };
    }
    if (iconName === 'search-minus') {
      item.onclick = () => {
        if(this.network.getScale() / 1.3 >= 0.2){
          this.scale = this.scale / 1.3;
          this.network.moveTo({scale: this.scale});
        }
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
    this.anchorList.push(node);
    this.nodeDataSet.add([node]);
    this.connectNodes(node);
    this.itemsForAnchorsMenuBar = [this.anchorMenuBarItem]
    this.network.unselectAll();
    this.setNullLayout();
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
    this.itemsForAnchorsMenuBar = [this.anchorMenuBarItem]
    this.network.unselectAll();
    this.setNullLayout();
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
    this.itemsForAnchorsMenuBar = [this.anchorMenuBarItem]
    this.network.unselectAll();
    this.setNullLayout();
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
      this.fillWorkplace(params);

    });
    this.network.on("deselectNode", (params) => {

      const selectedNodeId = params.nodes[0];
      this.selectedNodes.splice(this.selectedNodes.indexOf(selectedNodeId), 1);
      const node = this.getSelectedNode();

      this.switchCaseMenuBar(node);

      // this.description = "";
      // this.descriptor = "";
      // this.mnemonic = "";

      this.timeRange = "";
      this.knotRole = "";
      this.knotRange = "";

      this.mneAndDescriptorVisibility = 'none';
      this.descriptionVisibility = 'none';

      this.selectedNode = null;

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
    } else if(this.network.getSelectedNodes().length == 0) {
      this.fillItemList(0);
    }
    else if (this.allNodesIsTypedAs(node.type)
        && this.network.getSelectedNodes().length > 1){
      if(node.type == 1){
        this.fillItemList(7);
      }
    } else {
      this.fillItemList(3);
    }
  }

  fillMetadata(node: any){

    this.privacy = node.metadata != null ? node.metadata.privacy : "";
    this._id = node._id != null ? node._id : "";
    this.accessType = node.accessType != null ? node.accessType : "";
    this.deprecated = node.deprecated != null ? node.deprecated : false;
    this.identity =  node.identity != null ? node.identity : "";
    this.inheritPerm = node.inheritPerm != null ? node.inheritPerm : "";
    this.capsule = node.metadata != null ? node.metadata.capsule : "";
    this.generator = node.metadata != null && node.metadata.generator != null ? node.metadata.generator : false;
    this.idempotent = node.metadata != null && node.metadata.idempotent != null ? node.metadata.idempotent : false;
    this.restatable =  node.metadata != null && node.metadata.restatable != null ? node.metadata.restatable : false;
    this.deletable = node.metadata != null && node.metadata.deletable != null ? node.metadata.deletable : false;
    this.skip = node.skip != null ? node.skip : false;
    this.dataRange = node.dataRange != null ? node.dataRange : "";
    this.included = node.included != null ? node.included : false;
    this.columnName = node.columnName != null ? node.columnName : false;
    this.nullable = node.nullable != null ? node.nullable : false;
    this.restrictedAccess = node.restrictedAccess != null ? node.restrictedAccess : false;
    this._group = node._group != null ? (node._group.length != 0 ? node._group[0].id : "") : "";
    this.transactional = node.transactional;
  }

  fillWorkplace(properties: any) {

    const selectedNodeId = properties.nodes[0].toString();
    const node = this.nodeDataSet.get(selectedNodeId);

    // @ts-ignore
    this.mnemonic = node.mnemonic;
    // @ts-ignore
    this.descriptor = node.label;
    // @ts-ignore
    this.description = node.description;


    this.fillMetadata(node);

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
      this.setNullLayout();
      this.mneAndDescriptorVisibility = 'none';
      this.descriptionVisibility = 'none';
    }


  }

  fillItemList(nodeType: any){

    switch (nodeType){
      case 0: {
        this.setNullLayout();
        this.mneAndDescriptorVisibility = 'flex';
        this.descriptionVisibility = 'flex';
        this.itemsForAnchorsMenuBar = [
          this.anchorMenuBarItem
        ];
        break;
      }
      case 7:{
        this.setNullLayout();
        this.mneAndDescriptorVisibility = 'none';
        this.descriptionVisibility = 'none';
        this.itemsForAnchorsMenuBar = [
          this.tieMenuBarItem,
          this.tieWithAnchorMenuBarItem,
          this.historicalTieMenuBarItem,
          this.historicalTieWithAnchorMenuBarItem
        ];
        break;
      }
      case 1: {
        this.setAnchorLayout();
        this.mneAndDescriptorVisibility = 'flex';
        this.descriptionVisibility = 'flex';
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
        this.setTieLayout();
        this.mneAndDescriptorVisibility = 'none';
        this.descriptionVisibility = 'flex';
        this.itemsForAnchorsMenuBar = [
          this.anchorMenuBarItem
        ];
        break;
      }
      case 3:{
        this.setKnotLayout();
        this.mneAndDescriptorVisibility = 'flex';
        this.descriptionVisibility = 'flex';
        this.itemsForAnchorsMenuBar = [];
        break;
      }
      case 4:
      case 6: {
        this.setAttributeLayout();
        this.mneAndDescriptorVisibility = 'flex';
        this.descriptionVisibility = 'flex';
        this.itemsForAnchorsMenuBar = [];
        break;
      }
    }
  }

}

interface VisJsComponentServerInterface {
  displayNotification(text: string): void;
  fillComponentRequest(): void;
  workplaceFillComponent(text: string): void;
  addNodesAndEdges(stringOfNodes: string, stringOfEdges: string): void;
}