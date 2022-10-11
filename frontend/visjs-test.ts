import { css, html, LitElement } from 'lit';
import { customElement, state,property } from 'lit/decorators.js';
import '@vaadin/menu-bar';
import { MenuBarItem, MenuBarItemSelectedEvent } from '@vaadin/menu-bar';
import { applyTheme } from 'Frontend/generated/theme';
import {createTemplate} from "Frontend/getIcons";
import {Icon} from "@vaadin/icon";
import {Upload} from "@vaadin/upload";
import {Button} from "@vaadin/button";
import { DataSet, Network } from "vis"
const template = createTemplate();
document.head.appendChild(template.content);
window.onclick = e => {
    console.log(e.target);  // to get the element
    console.log(e.target.tagName);  // to get the element tag name alone
}
@customElement('custom-tag')
export class VisJsTest extends LitElement {

    protected createRenderRoot() {
        const root = super.createRenderRoot();
        // Apply custom theme (only supported if your app uses one)
        applyTheme(root);
        return root;
    }
    @state()
    private selectedItem?: MenuBarItem;
    @state()
    private counter = 0;
    createItem(iconName: string, ariaLabel: string, id: string, disabled: boolean) {

        const item = document.createElement('vaadin-context-menu-item');
        const ic = new Icon();

        ic.setAttribute('icon', "lean-di-icons:anchor-add")

        item.setAttribute('id', String(id))
        item.setAttribute('theme', "icon")

        item.onclick = function (){
            console.log(item.id)
        };

        item.appendChild(ic);
        return item;
    }
    createUpload(){
        let item = new Upload();

        item.nodrop = true;

        item.i18n.addFiles.many = 'Load scheme from XML';

        item.i18n.addFiles.one = 'Load scheme from XML';

        item.headers = '{"Content-Type": "application/xml"}'
        // item.formDataName = "file"

        item.target = 'http://localhost:8080/count'

        return item;
    }
    @state()
    private items = [
        { id: 1, component: this.createItem('download', 'download', '1', true), disabled: true },
        { id: 2, component: this.createItem('upload', 'upload', '2', false )},
        { id: 3, component: this.createItem('upload', 'upload', '2', false ) },
        {component: this.createUpload()}
    ];

    render() {
        return html`
          <vaadin-menu-bar
            .items="${this.items}"
            @item-selected="${this.itemSelected}"
            theme="icon"
          >
          </vaadin-menu-bar>
          <div>Clicked button: ${this.selectedItem?.id}</div>
          <vaadin-button>Click</vaadin-button>

          <slot></slot>
        `;
    }

    itemSelected(e: MenuBarItemSelectedEvent) {
        this.selectedItem = e.detail.value;
        this.items = [
            { id: 1, component: this.createItem('download', 'download','1', false ), disabled: false },
            { id: 2, component: this.createItem('upload', 'upload', '2', false ) },
            { id: 3, component: this.createItem('upload', 'upload', '2', false ) },
            {component: this.createUpload()}

        ];
    }

    init(element: any, edges: any, nodes: any) {
        this.element = element;
        var _this = this;

        this.draw(element, edges, nodes);

        this.container = document.getElementById("customId");
        console.log("HEH")

        var host = document.querySelector('#customId');

        // document.addEventListener('contextmenu', event => event.preventDefault());

        var options = {};
        this.network = new Network(this.container, this.data, options);

        var step;
        this.network.on("afterDrawing", function (ctx) {
            for (step = 0; step < _this.historicalAttributes.length; step++) {
                var nodePosition = this.getPositions([_this.historicalAttributes[step]]);
                ctx.strokeStyle = '#f66';
                ctx.lineWidth = 2;
                ctx.circle(nodePosition[_this.historicalAttributes[step]].x, nodePosition[_this.historicalAttributes[step]].y, 15);
                ctx.stroke();
            }

            for (step = 0; step < _this.historicalTies.length; step++) {
                var nodePosition = this.getPositions([_this.historicalTies[step]]);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.diamond(nodePosition[_this.historicalTies[step]].x, nodePosition[_this.historicalTies[step]].y, 20);
                ctx.stroke();

            }
            for (step = 0; step < _this.checked.length; step++) {
                var nodePosition = this.getPositions([_this.checked[step]]);
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 4;
                ctx.circle(nodePosition[_this.checked[step]].x, nodePosition[_this.checked[step]].y, 2);
                ctx.stroke();

            }
        })
        this.network.on( 'doubleClick', function(properties) {
            var ids = properties.nodes;

            host.shadowRoot.querySelector("vaadin-menu-bar").shadowRoot.querySelector('vaadin-menu-bar-button').disabled =
              !host.shadowRoot.querySelector("vaadin-menu-bar").shadowRoot.querySelector('vaadin-menu-bar-button').disabled;

            if (ids.length > 0) {
                if (_this.checked.includes(ids[0])) {
                    var node = this.body.data.nodes._data[ids[0]];
                    node["fixed"] = false;
                    this.body.data.nodes.update(node);
                    const index = _this.checked.indexOf(ids[0]);
                    _this.checked.splice(index, 1);
                } else {
                    _this.checked.push(ids[0]);
                    var node = this.body.data.nodes._data[ids[0]];
                    node["fixed"] = true;
                    var pos = this.getPositions([ids[0]]);
                    node["x"] = pos[ids[0]].x;
                    node["y"] = pos[ids[0]].y;
                    this.body.data.nodes.update(node);
                }
            }
        });
        this.network.on( 'oncontext', function(properties) {

            var a = this.getNodeAt(properties.pointer.DOM);
            var b = this.getEdgeAt(properties.pointer.DOM)



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
        this.network.on('dragStart', function(properties) {
            var ids = properties.nodes;
            if (ids.length > 0) {
                var node = this.body.data.nodes._data[ids[0]];
                node["fixed"] = false;
                var pos = this.getPositions([ids[0]]);
                node["x"] = pos[ids[0]].x;
                node["y"] = pos[ids[0]].y;
                this.body.data.nodes.update(node);
            }
        });
        this.network.on('dragEnd', function(properties) {
            var ids = properties.nodes;
            if (ids.length > 0) {
                if (_this.checked.includes(ids[0])) {
                    var node = this.body.data.nodes._data[ids[0]];
                    node["fixed"] = true;
                    var pos = this.getPositions([ids[0]]);
                    node["x"] = pos[ids[0]].x;
                    node["y"] = pos[ids[0]].y;
                    this.body.data.nodes.update(node);
                }
            }
        });
    }

    draw(element: any, edges: string, nodes: string){
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

        this.data = {
            nodes: this.nodes,
            edges: this.edges,
        };
    }
    redraw(element: any, edges: string, nodes: string) {

        this.draw(element, edges, nodes);

        this.network.body.data.edges.clear();
        this.network.body.data.nodes.clear();

        this.network.body.data.edges.update(
          this.loadedEdges
        );
        this.network.body.data.nodes.update(
          this.loadedNodes
        );
    }
    fillEdge(edge: { [x: string]: { color: string; }; }){
        edge['color'] = {'color': "#000000"};
        return edge;
    }
    fillNode(node: { [x: string]: any; }){
        switch (node["type"]){
            case 1: {
                node["color"] = "#f66";
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
            this.network.body.data.nodes.update(node)
        } catch (err) {
            console.log(err);
        }
        try {
            this.network.body.data.edges.update(edge)
        } catch (err) {
            console.log(err);
        }
    }
    getCoordinates(element){

        const url = 'http://localhost:8080/download';

        try {
            const response =  fetch(url, {
                method: 'POST', // или 'PUT'
                body: JSON.stringify(this.network.body.data.nodes._data), // данные могут быть 'строкой' или {объектом}!
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
        var node = JSON.parse(node);
        try {
            this.network.body.data.nodes.update(node)
        } catch (err) {
            console.log(err);
        }
    }
    deleteNode(element: any, node: string){
        var node = JSON.parse(node);
        try {
            this.network.body.data.nodes.update(node)
        } catch (err) {
            console.log(err);
        }
    }

}
declare global {
    interface Window {
        initThree: any;
        addEdge: any;
        redraw: any;
        getCoordinates: any;
        updateNode: any;
        deleteNode: any;
    }
}

const tt = new VisJsTest();

window.initThree = function(element: any, edges: any, nodes: any) {
    tt.init(element, edges, nodes);
};
window.addEdge = function (element: any, newNodeId: string, nodeToConnectId: string){
    tt.addEdge(newNodeId, nodeToConnectId);
}

window.redraw = function(element: any, edges: string, nodes: string) {
    tt.redraw(element, edges, nodes);
};

window.getCoordinates = function(element: any) {
    tt.getCoordinates(element);
};

window.updateNode = function (element: any, node: string){
    tt.updateNode(element, node)
}

window.deleteNode = function (element: any, node: string){
    tt.deleteNode(element, node)
}