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
            animations : {
                show : {
                    name : Animation.ANIMATION_ZOOM_IN,
                    params : {},
                },
                hide : {
                    name : Animation.ANIMATION_ZOOM_OUT,
                    params : {},
                },
            },
            // private
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
     * @param {string} name
     * @param {object} params
     * @return {object|null|this}
     */
    animation(...args) {
        let p = this.__private(cn);

        if (args.length == 1) {
            return p.animations[args[0]] ? p.animations[args[0]] : null;
        } else if(args.length == 2) {
            p.animations[args[0]] = {
                name : args[0],
                params : args[1] ? args[1] : {},
            };

            return this;
        } else {
            return null;
        }
    }
}

Layer.LAYER_DEFAULT = "default";

export default Layer;
