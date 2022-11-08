import {css, html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators';
import '@vaadin/menu-bar';
import {createTemplate} from "Frontend/getIcons";
import '@vaadin/vertical-layout';
import {applyTheme} from "Frontend/generated/theme";

const template = createTemplate();
document.head.appendChild(template.content);


@customElement('anchor-editor-layout')
export class AnchorEditorLayout extends LitElement {

    protected createRenderRoot() {
        const root = super.createRenderRoot();
        // Apply custom theme (only supported if your app uses one)
        applyTheme(root);
        return root;
    }

    static get styles() {
        return css`
      [slot="label"] {
        font-size: medium;
        font-weight: normal ;
      }
    .text-field-width{
        width: 100%;
      }
      `
    }

    @property()
    private anchor: any;

    setAnchor(anchor: any){
        this.anchor = anchor;
    }

    render() {
        return html`
          <vaadin-horizontal-layout style="width: 100%;" theme="spacing-xs padding">
              
            <vaadin-vertical-layout theme="spacing-xs padding"  style="width: 600px">
                <vaadin-text-field 
                        label="Мнемоник"
                        class="text-field-width"
                        name="mnemonic"
                        value="${this.anchor.mnemonic}"
                >
                </vaadin-text-field>
                <vaadin-text-field 
                        label="Дескриптор"
                        class="text-field-width"
                        name="descriptor"
                        value="${this.anchor.descriptor}"
                >
                </vaadin-text-field>
                <vaadin-text-area 
                        label="Описание"
                        class="text-field-width"
                        value="${this.anchor.description}"
                        caret="20"
                        name="description"
                        style="height: 150px"
                >
                </vaadin-text-area>
            </vaadin-vertical-layout>
              
            <vaadin-vertical-layout theme="spacing-xs padding">
                <vaadin-text-field 
                        label="Id"
                        name="_id"
                        class="text-field-width"
                        value="${this.anchor._id}"
                >
                </vaadin-text-field>
                <vaadin-text-field 
                        label="Identity"
                        name="identity"
                        class="text-field-width"
                        value="${this.anchor.identity}"
                >
                </vaadin-text-field>
                <vaadin-text-field 
                        label="InheritPermission" 
                        name="inheritPerm"
                        class="text-field-width"
                        value="${this.anchor.inheritPerm}"
                >
                </vaadin-text-field>
            </vaadin-vertical-layout>
        
        
            <vaadin-vertical-layout theme="spacing-xs padding">
              <vaadin-text-field 
                      label="Group" 
                      name="_group"
                      class="text-field-width"
                      value="${this.anchor._group != null && this.anchor._group.length != 0 ? this.anchor._group[0].id : null}"
              >
              </vaadin-text-field>
              <vaadin-text-field 
                      label="Access Type"
                      name="accessType"
                      class="text-field-width"
                      value="${this.anchor.accessType}"
              >
              </vaadin-text-field>
              <br>
              <vaadin-checkbox 
                      label="Deprecated"
                      name="deprecated" 
                      .checked="${this.anchor.deprecated == null ? false : this.anchor.deprecated}"
              >
              </vaadin-checkbox>
              <vaadin-checkbox 
                      label="Skip" 
                      name="skip"
                      .checked="${this.anchor.skip == null ? false : this.anchor.skip}"
              >
              </vaadin-checkbox>
              <vaadin-checkbox 
                      label="Transactional" 
                      name="transactional"
                      .checked="${this.anchor.transactional == null ? false : this.anchor.transactional}"
              >
              </vaadin-checkbox>
            </vaadin-vertical-layout>
        
              
            <vaadin-vertical-layout theme="spacing-xs padding">
              <vaadin-text-field 
                      label="Privacy"
                      name="metadata.privacy"
                      class="text-field-width"
                      value="${this.anchor.metadata != null ? this.anchor.metadata.privacy : null}"
              >
              </vaadin-text-field>
              <vaadin-text-field 
                      label="Capsule" 
                      name="metadata.capsule"
                      class="text-field-width"
                      value="${this.anchor.metadata != null ? this.anchor.metadata.capsule : null}"
              >
              </vaadin-text-field>
              <br>
              <vaadin-checkbox
                      label="Restatable" 
                      name="metadata.restatable"
                      .checked="${this.anchor.metadata != null && this.anchor.metadata.restatable != null ? this.anchor.metadata.restatable : false}"
              >
              </vaadin-checkbox>
              <vaadin-checkbox
                      label="Generator" 
                      name="metadata.generator"
                      .checked="${this.anchor.metadata != null && this.anchor.metadata.generator != null ? this.anchor.metadata.generator : false}"
              >
              </vaadin-checkbox>
              <vaadin-checkbox 
                      label="Idempotent" 
                      name="metadata.idempotent"
                      .checked="${this.anchor.metadata != null && this.anchor.metadata.idempotent != null ? this.anchor.metadata.idempotent : false}"
              >
              </vaadin-checkbox>
              <vaadin-checkbox 
                      label="Deletable"
                      name="metadata.deletable"
                      .checked="${this.anchor.metadata != null && this.anchor.metadata.deletable != null ? this.anchor.metadata.deletable : false}"
              >
              </vaadin-checkbox>
            </vaadin-vertical-layout>
        
        
        
            <vaadin-vertical-layout style="width: 100%" theme="spacing-xs padding">
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
        `;
    }
}