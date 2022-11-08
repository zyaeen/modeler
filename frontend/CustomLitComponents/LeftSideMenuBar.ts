import {html, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators';
import '@vaadin/menu-bar';
import {createTemplate} from "Frontend/getIcons";
import {Icon} from "@vaadin/icon";
import '@vaadin/vertical-layout';

import {applyTheme} from "Frontend/generated/theme";

const template = createTemplate();
document.head.appendChild(template.content);


@customElement('left-side-menu-bar')
export class LeftSideMenuBar extends LitElement {
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        // Apply custom theme (only supported if your app uses one)
        applyTheme(root);
        return root;
    }

    private anchorAddEvent = new CustomEvent<string>("add-node-event",{detail: 'anchor-add'});
    private attributeAddEvent = new CustomEvent<string>("add-node-event",{detail: 'attribute-add'});
    private composedAttAddEvent = new CustomEvent<string>("add-node-event",{detail: 'attribute-composed-add'});
    private historicalAttAddEvent = new CustomEvent<string>("add-node-event",{detail: 'attribute-his-add'});
    private tieAddEvent = new CustomEvent<string>("add-node-event",{detail: 'tie-add'});
    private historicalTieAddEvent = new CustomEvent<string>("add-node-event",{detail: 'tie-his-add'});
    private anchoredTieAddEvent = new CustomEvent<string>("add-node-event",{detail: 'tie-a-add'});
    private anchoredHistTieAddEvent = new CustomEvent<string>("add-node-event",{detail: 'tie-his-a-add'});


    private anchorMenuBarItem = {id: 1, component: this.createItem('anchor-add', 'lean-di-icons', '1')};
    private attributeMenuBarItem = {id: 2, component: this.createItem('attribute-add', 'lean-di-icons', '2')}
    private composedAttributeMenuBarItem = {id: 3, component: this.createItem('attribute-composed-add', 'lean-di-icons', '2')}
    private historicalAttributeMenuBarItem = {id: 3, component: this.createItem('attribute-his-add', 'lean-di-icons', '2')}
    private tieWithAnchorMenuBarItem = {id: 3, component: this.createItem('tie-a-add', 'lean-di-icons', '2')}
    private tieMenuBarItem = {id: 3, component: this.createItem('tie-add', 'lean-di-icons', '2')}
    private historicalTieWithAnchorMenuBarItem = {id: 3, component: this.createItem('tie-his-a-add', 'lean-di-icons', '2')}
    private historicalTieMenuBarItem = {id: 3, component: this.createItem('tie-his-add', 'lean-di-icons', '2')}

    createItem(iconName: string, iconRepo: string, id: string) {

        const item = document.createElement('vaadin-context-menu-item');
        const icon = new Icon();
        icon.setAttribute('icon', `${iconRepo}:${iconName}`)

        item.setAttribute('id', String(id))
        item.setAttribute('theme', "icon")

        if (iconName === 'anchor-add') {
            item.onclick = (): void => {this.dispatchEvent(this.anchorAddEvent)};
        }
        if (iconName === 'tie-add') {
            item.onclick = (): void => {this.dispatchEvent(this.tieAddEvent)};
        }
        if (iconName === 'tie-his-add') {
            item.onclick = (): void => {this.dispatchEvent(this.historicalTieAddEvent)};
        }
        if (iconName === 'tie-a-add') {
            item.onclick = (): void => {this.dispatchEvent(this.anchoredTieAddEvent)};
        }
        if (iconName === 'tie-his-a-add') {
            item.onclick = (): void => {this.dispatchEvent(this.anchoredHistTieAddEvent)};
        }
        if (iconName === 'attribute-add') {
            item.onclick = (): void => {this.dispatchEvent(this.attributeAddEvent)};
        }
        if (iconName === 'attribute-his-add') {
            item.onclick = (): void => {this.dispatchEvent(this.historicalAttAddEvent)};
        }
        if (iconName === 'attribute-composed-add') {
            item.onclick = (): void => {this.dispatchEvent(this.composedAttAddEvent)};
        }

        item.appendChild(icon);
        return item;
    }


    @state()
    public items = [this.anchorMenuBarItem];

    @property()
    private chosenNodeType = 0;

    @property()
    private itemSetView: {[element: number] : any[]} = {
        0: [this.anchorMenuBarItem],
        7: [
            this.tieMenuBarItem,
            this.tieWithAnchorMenuBarItem,
            this.historicalTieMenuBarItem,
            this.historicalTieWithAnchorMenuBarItem
        ],
        1: [
            this.attributeMenuBarItem,
            this.composedAttributeMenuBarItem,
            this.historicalAttributeMenuBarItem,
            this.tieWithAnchorMenuBarItem,
            this.historicalTieWithAnchorMenuBarItem
        ],
        2: [this.anchorMenuBarItem],
        3: [],
        4: []
    }

    render() {
        return html`
            <vaadin-menu-bar
                    .items="${this.itemSetView[this.chosenNodeType]}"
                    theme="icon"
                    style=" background-color: hsla(0, 0%, 100%, 0.3);"
            >
            </vaadin-menu-bar>
        `;
    }
}