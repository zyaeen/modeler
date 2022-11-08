import {css, html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators';
import '@vaadin/menu-bar';
import {createTemplate} from "Frontend/getIcons";
import '@vaadin/vertical-layout';
import {applyTheme} from "Frontend/generated/theme";

const template = createTemplate();
document.head.appendChild(template.content);


@customElement('knot-editor-layout')
export class KnotEditorLayout extends LitElement {

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
    private knot: any;

    setKnot(attribute: any){
        this.knot = attribute;
    }

    render() {
        return html`
          <vaadin-horizontal-layout style="width: 100%;" theme="spacing-xs padding">

              <vaadin-vertical-layout theme="spacing-xs padding"  style="width: 600px">
                <vaadin-text-field 
                        label="Мнемоник"
                        class="text-field-width"
                        name="mnemonic"
                        value="${this.knot.mnemonic}"
                >
                </vaadin-text-field>
                <vaadin-text-field 
                        label="Дескриптор"
                        class="text-field-width"
                        name="descriptor"
                        value="${this.knot.descriptor}"
                >
                </vaadin-text-field>
                <vaadin-text-area 
                        label="Описание"
                        class="text-field-width"
                        value="${this.knot.description}"
                        caret="20"
                        name="description"
                        style="height: 150px"
                >
                </vaadin-text-area>
            </vaadin-vertical-layout>
              
              
            <vaadin-vertical-layout theme="spacing-xs padding">
                <vaadin-text-field 
                        label="DataRange" 
                        name="dataRange"
                        class="text-field-width"
                        value="${this.knot.dataRange}"
                >
                </vaadin-text-field>
                <vaadin-text-field 
                        label="Identity" 
                        name="identity"
                        class="text-field-width"
                        value="${this.knot.identity}"
                >
                </vaadin-text-field>
                <br>
                <vaadin-checkbox
                        label="Deprecated"
                        name="deprecated"
                        .checked="${this.knot.deprecated == null ? false : this.knot.deprecated}"
                >
                </vaadin-checkbox>
                <vaadin-checkbox 
                        label="Skip"
                        name="skip"
                        .checked="${this.knot.skip == null ? false : this.knot.skip}"
                >
                </vaadin-checkbox>
            </vaadin-vertical-layout>
        
        
              
            <vaadin-vertical-layout theme="spacing-xs padding">
              <vaadin-text-field 
                      label="Privacy"
                      name="metadata.privacy"
                      class="text-field-width"
                      value="${this.knot.metadata != null ? this.knot.metadata.privacy : null}"
              >
              </vaadin-text-field>
              <vaadin-text-field 
                      label="Capsule" 
                      name="metadata.capsule"
                      class="text-field-width"
                      value="${this.knot.metadata != null ? this.knot.metadata.capsule : null}"
              >
              </vaadin-text-field>
              <br>
              <vaadin-checkbox
                      label="Restatable" 
                      name="metadata.restatable"
                      .checked="${this.knot.metadata != null && this.knot.metadata.restatable != null ? this.knot.metadata.restatable : false}"
              >
              </vaadin-checkbox>
              <vaadin-checkbox
                      label="Generator" 
                      name="metadata.generator"
                      .checked="${this.knot.metadata != null && this.knot.metadata.generator != null ? this.knot.metadata.generator : false}"
              >
              </vaadin-checkbox>
              <vaadin-checkbox 
                      label="Idempotent" 
                      name="metadata.idempotent"
                      .checked="${this.knot.metadata != null && this.knot.metadata.idempotent != null ? this.knot.metadata.idempotent : false}"
              >
              </vaadin-checkbox>
              <vaadin-checkbox 
                      label="Deletable"
                      name="metadata.deletable"
                      .checked="${this.knot.metadata != null && this.knot.metadata.deletable != null ? this.knot.metadata.deletable : false}"
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
        `;
    }
}