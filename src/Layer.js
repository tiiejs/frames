/** @module Tiie/Frames */
import TiieObject from "Tiie/Object";

import Layout from "Tiie/Frames/Layouts/Layout";
import Animation from "Tiie/Frames/Animation";

const cn = 'Layer';

/**
 * Layer representation.
 *
 * @param {object} params
 *
 * @class
 */
class Layer extends TiieObject {
    constructor(params = {}) {
        super();

        let p = this.__private(cn, {
            animationShowName : params.animationShowName !== undefined ? params.animationShowName : Animation.ANIMATION_ZOOM_IN,
            animationShowParams : params.animationShowParams !== undefined ? params.animationShowParams : {},

            animationHideName : params.animationHideName !== undefined ? params.animationHideName : Animation.ANIMATION_ZOOM_OUT,
            animationHideParams : params.animationHideParams !== undefined ? params.animationHideParams : {},
        });

        this.set("-align", params.align != undefined ? params.align : null);
        this.set("-level", params.level != undefined ? params.level : 0);
        this.set("-layout", params.layout != undefined ? params.layout : Layout.TYPE_BOX);

        // Modal
        this.set("-modal", params.modal != undefined ? params.modal : 0);

        // Margins.
        this.set("-margin", params.margin != undefined ? params.margin : null);
        this.set("-marginTop", params.marginTop != undefined ? params.marginTop : null);
        this.set("-marginLeft", params.marginLeft != undefined ? params.marginLeft : null);
        this.set("-marginRight", params.marginRight != undefined ? params.marginRight : null);
        this.set("-marginBottom", params.marginBottom != undefined ? params.marginBottom : null);
    }

    layout(layout) {
        return this.get("layout");
    }

    align(align) {
        return this.get("align");
    }

    level(level) {
        return this.get("level");
    }

    /**
     * Return animation with given name or returns animation.
     *
     * @param {string} type
     * @param {string} name
     * @param {object} [params]
     *
     * @return {object|null|this}
     */
    animation(...args) {
        let p = this.__private(cn);

        if(args[0] == "show") {
            if(args.length == 1) {
                return {
                    name : p.animationShowName,
                    params : p.animationShowParams,
                };
            } else {
                p.animationShowName = args[1];
                p.animationShowParams = args[2] ? args[2] : {};

                return this;
            }
        } else if(args[0] == "hide") {
            if(args.length == 1) {
                return {
                    name : p.animationHideName,
                    params : p.animationHideParams,
                };
            } else {
                p.animationHideName = args[1];
                p.animationHideParams = args[2] ? args[2] : {};

                return this;
            }
        } else {
            this.log(`Inproper type of animation.`, "warning");

            return null;
        }
    }
}

Layer.LAYER_DEFAULT = "default";

export default Layer;
