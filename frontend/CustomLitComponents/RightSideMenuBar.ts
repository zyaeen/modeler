import {html, LitElement} from 'lit';
import {customElement} from 'lit/decorators';
import '@vaadin/menu-bar';
import {createTemplate} from "Frontend/getIcons";
import {Icon} from "@vaadin/icon";
import '@vaadin/vertical-layout';
import {TextField} from "@vaadin/text-field";
import {applyTheme} from "Frontend/generated/theme";

const template = createTemplate();
document.head.appendChild(template.content);


@customElement('right-side-menu-bar')
export class RightSideMenuBar extends LitElement {
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        // Apply custom theme (only supported if your app uses one)
        applyTheme(root);
        return root;
    }

    private zoomPlusEvent = new CustomEvent<string>("zoom-event",{detail: 'zoom-plus'});
    private zoomMinusEvent = new CustomEvent<string>("zoom-event",{detail: 'zoom-minus'});
    private pinEvent = new CustomEvent<string>("pin-event",{detail: 'pin'});
    private downloadEvent = new CustomEvent<string>("download-event",{detail: 'download'});


    createItem(iconName: string, iconRepo: string, id: string) {

        const item = document.createElement('vaadin-context-menu-item');
        const icon = new Icon();
        icon.setAttribute('icon', `${iconRepo}:${iconName}`)

        item.setAttribute('id', String(id))
        item.setAttribute('theme', "icon")

        if (iconName === 'pin') {
            item.onclick = (): void => {this.dispatchEvent(this.pinEvent)};
        }
        if (iconName === 'search-plus') {
            item.onclick = (): void => {this.dispatchEvent(this.zoomPlusEvent)};
        }
        if (iconName === 'search-minus') {
            item.onclick = (): void => {this.dispatchEvent(this.zoomMinusEvent)};
        }
        if (iconName === 'download') {
            item.onclick = (): void => {this.dispatchEvent(this.downloadEvent)};
        }

        item.appendChild(icon);
        return item;
    }

    private createSearchTextBox(){
        let item = new TextField();
        item.placeholder = "Имя анкера или мнемоник";
        item.style.width='300px';
        item.oninput = () => this.dispatchEvent(new CustomEvent<string>("search-event",{detail: item.value}));
        return item;
    }

    private itemsForZoomAndSearchMenuBar = [
        {id: 0, component: this.createItem('pin', 'vaadin', '4')},
        {id: 1, component: this.createItem('search-plus', 'vaadin', '4')},
        {id: 2, component: this.createItem('search-minus', 'vaadin', '5')},
        {id: 3, component: this.createItem('search', 'vaadin', '6'),
            children: [{ component: this.createSearchTextBox()}]
        },
        {id: 4, component: this.createItem('download', 'lumo', '7')},
    ];

    render() {
        return html`
            <vaadin-menu-bar
                    .items="${this.itemsForZoomAndSearchMenuBar}"
                    theme="icon"
                    style=" background-color: hsla(0, 0%, 100%, 0.3);"
            >
            </vaadin-menu-bar>
        `;
    }
}