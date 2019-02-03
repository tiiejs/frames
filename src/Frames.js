/** @module Tiie/Frames */

import TiieObject from "Tiie/Object";
import Animation from "Tiie/Frames/Animation";

import Layout from "Tiie/Frames/Layouts/Layout";
import BoxLayout from "Tiie/Frames/Layouts/BoxLayout";
import StackLayout from "Tiie/Frames/Layouts/StackLayout";
import jQuery from "jquery";

import Frame from "Tiie/Frames/Frame";
import Layer from "Tiie/Frames/Layer";

const cn = 'Frames';

/**
 * Frames is base container for other frames.
 *
 * @param {jQuery}   target
 * @param {boolean}  params.fixed
 * @param {number}   params.zIndex
 * @param {string[]} params.align
 * @param {number}   params.level
 * @param {string}   params.layout
 * @param {boolean}  params.modal
 * @param {number}   params.margin
 * @param {number}   params.marginTop
 * @param {number}   params.marginLeft
 * @param {number}   params.marginRight
 * @param {number}   params.marginBottom
 *
 * @class
 */
class Frames extends TiieObject {
    constructor(target, params = {}) {
        super();

        let p = this.__private(cn, {
            target,
            layers : [],
            layouts : {},
            transforming : 0,

            // Params
            fixed : params.fixed ? 1 : 0,
            zIndex : params.zIndex != undefined ? params.zIndex : 1000,

            // Layer params
            align : params.align,
            level : params.level,
            layout : params.layout,
            modal : params.modal,
            margin : params.margin,
            marginTop : params.marginTop,
            marginLeft : params.marginLeft,
            marginRight : params.marginRight,
            marginBottom : params.marginBottom,

            // Animation module.
            animation : new Animation(),
            animations : {
                show : {
                    name : "zoomIn",
                    // name : "slideInFromRight",
                    // name : "slideInFromLeft",
                    // name : "slideInFromTop",
                    // name : "slideInFromBottom",
                    params : {
                        duration : 4,
                    },
                },
                hide : {
                    name : "zoomOut",
                    // name : "slideInFromBottom",
                    params : {
                        duration : 4,
                    },
                },
            }
        });

        p.target.css("position", "relative");

        setInterval(() => {
            if (p.transforming > 0) {
                return;
            }

            this.reload();
        }, 100);
    }

    /**
     * Create new frame.
     */
    create(layerId, params = {}) {
        let p = this.__private(cn),
            layer = p.layers.find(layer => layer.id == layerId)
        ;

        if (!layer) {
            if (layerId == Layer.LAYER_DEFAULT) {
                this.createLayer(Layer.LAYER_DEFAULT, {
                    layout : Layout.TYPE_BOX,
                });

                layer = p.layers.find(layer => layer.id == Layer.LAYER_DEFAULT);
            } else {
                this.log(`Layer ${layerId} not found.`, "notice", "Tiie.Frames.Frames");

                return null;
            }
        }

        let object = new Frame(this, params),
            ui = jQuery(`<div class="em-frames__container${p.fixed ? ` --fixed` : ``}${params.classes ? ` ${params.classes.map(c => c).join(' ')}` : ``}">`)
        ;

        // ui.css({"z-index" : p.zIndex});
        ui.append(object.element());

        layer.frames.push({
            x : 0,
            y : 0,
            width : 0,
            height : 0,
            last : {
                x : 0,
                y : 0,
                width : 0,
                height : 0,
            },

            align : [],
            opacity : 0,
            visible : 1,
            level : 0,
            attached : 0,

            object,
            ui,
        });

        this.reload();

        return object;
    }

    /**
     * Find layer by given id.
     *
     * @param {string} id
     * @return {Tiie.Frames.Layer|null}
     */
    findLayerById(id) {
        let p = this.__private(cn),
            layer = p.layers.find(l => l.id == id)
        ;

        return layer ? layer.object : null;
    }

    /**
     * Create layer with given params. New layer is append to layers stack.
     *
     *
     * @param {string}   id
     * @param {string[]} params.align
     * @param {number}   params.level
     * @param {string}   params.layout
     * @param {boolean}  params.modal
     * @param {number}   params.margin
     * @param {number}   params.marginTop
     * @param {number}   params.marginLeft
     * @param {number}   params.marginRight
     * @param {number}   params.marginBottom
     *
     * @return {Tiie.Frames.Layer}
     */
    createLayer(id, params = {}) {
        let p = this.__private(cn);


        p.layers.push({
            id,
            object : new Layer({
                align : p.align,
                level : p.level,
                layout : p.layout,
                modal : p.modal,
                margin : p.margin,
                marginTop : p.marginTop,
                marginLeft : p.marginLeft,
                marginRight : p.marginRight,
                marginBottom : p.marginBottom,
            }),

            frames : [],
            uiModal : null,
        });

        return p.layers[p.layers.length-1].object;
    }

    __calculate(attribute, value, relative = "canvas") {
        let p = this.__private(cn);

        if (typeof value == "number") {
            return value;
        }

        if (value == "auto") {
            return value;
        }

        let divisions = {
            tiny : 0.1,
            small : 0.25,
            normal : 0.50,
            large : 0.75,
            fullscreen : 1,
        };

        let division;

        if (divisions[value]) {
            division = divisions[value];
        } else {
            division = divisions["normal"];
        }

        if(attribute == "width") {
            // return Math.round(p.canvas.width() * division);
            return Math.round(p.target.width() * division);
        } else if (attribute == "height") {
            // return Math.round(p.canvas.height() * division);
            return Math.round(p.target.height() * division);
        }
    }

    height() {
        let p = this.__private(cn);

        return p.target.height();
    }

    width() {
        let p = this.__private(cn);

        return p.target.width();
    }

    context() {
        let p = this.__private(cn);

        return {
            width : p.target.width(),
            height : p.target.height(),
        };
    }

    reload() {
        let p = this.__private(cn),
            canvasHeight = p.target.height(),
            canvasWidth = p.target.width(),
            context = this.context(),

            // Level
            levelOffset = p.zIndex,
            levelMax = 0
        ;

        if (canvasWidth  == 0 || canvasHeight == 0) {
            return;
        }

        p.layers.sort((a, b) => a.object.get("level") < b.object.get("level") ? -1 : 1);

        p.layers.forEach((layer) => {
            let layout = this._layout(layer.object.layout());

            // Check if layer is modal.
            layer.frames.forEach((frame) => {
                frame.level = 0;

                if (frame.object.size()) {
                    frame.height = this.__calculate("height", frame.object.size());
                    frame.width = this.__calculate("width", frame.object.size());
                }

                if (frame.object.is("@destroyed")) {
                    frame.visible = 0;
                } else {
                    frame.visible = frame.object.is("@visible");
                }

                frame.opacity = frame.object.opacity();

                if (frame.object.size()) {
                    frame.width = this.__calculate("width", frame.object.size());
                    frame.height = this.__calculate("height", frame.object.size());
                }

                if (frame.object.width()) frame.width = this.__calculate("width", frame.object.width());
                if (frame.object.height()) frame.height = this.__calculate("height", frame.object.height());

                if (frame.object.height() == "auto") {
                    frame.height = jQuery(frame.ui.get(0).firstChild).height();

                    // todo Frame height for auto height.
                    if (frame.height == 0) {
                        frame.height = 100;
                    }
                }

                frame.align = frame.object.align();
            });

            // Recalculate frames
            layout.recalculate(layer.frames, layer.object);

            // After recalculation I can set proper level for each frames.
            // First I increase levelOffset becaouse there is a new layer.
            levelOffset++;

            // Check if there is modal.
            if(layer.object.is("modal")) {
                // Check if there is any visible frame.
                if(layer.frames.some(frame => frame.visible)) {
                    if(!layer.uiModal) {
                        layer.uiModal = jQuery(`<div class="em-frames__modal">`);
                    }

                    p.target.append(layer.uiModal);
                } else {
                    if(layer.uiModal) {
                        // Detach modal.
                        layer.uiModal.detach();
                    }
                }
            } else {
                if(layer.uiModal) {
                    layer.uiModal.remove();
                }
            }

            if(layer.uiModal) {
                layer.uiModal.css("z-index", levelOffset);
                levelOffset++;
            }

            layer.frames.forEach((frame) => {
                frame.level += levelOffset;

                if(frame.level > levelMax) {
                    levelMax = frame.level;
                }
            });

            // After recalculate layout I update level offset for next layers.
            levelOffset = levelMax;

            layer.frames.forEach((frame) => {
                let animate = 0;

                if (!frame.attached && !frame.visible) {
                    // Ommit frames which are not append to DOM and they are
                    // invisible.
                    return;
                }

                // Is not displayed,
                if (!frame.attached && frame.visible) {
                    frame.last = {
                        x : frame.x,
                        y : frame.y,
                        width : frame.width,
                        height : frame.height,
                        opacity : 0,
                    };

                    frame.last = p.animation.calculate(layer.object.animation('show').name, context, frame.last);
                }

                if (!frame.attached && frame.visible) {
                    // p.canvas.append(frame.ui);
                    p.target.append(frame.ui);
                    frame.attached = 1;
                }

                if (frame.attached && !frame.visible) {
                    frame.last = {
                        x : frame.x,
                        y : frame.y,
                        width : frame.width,
                        height : frame.height,
                        opacity : frame.opacity,
                    };

                    frame = p.animation.calculate(layer.object.animation("hide").name, context, frame);
                }

                frame.ui.css("z-index", frame.level);

                if (
                    frame.x != frame.last.x ||
                    frame.y != frame.last.y ||
                    frame.height != frame.last.height ||
                    frame.width != frame.last.width ||
                    frame.opacity != frame.last.opacity ||
                    animate
                ) {
                    p.transforming++;

                    p.animation.transform({
                        left : frame.x,
                        top : frame.y,
                        width : frame.width,
                        height : frame.height,
                        opacity : frame.opacity,
                    }, {
                        left : frame.last.x,
                        top : frame.last.y,
                        width : frame.last.width,
                        height : frame.last.height,
                        opacity : frame.last.opacity,
                    }, frame.ui).then(() => {
                        p.transforming--;

                        if (!frame.visible) {
                            frame.ui.detach();
                            frame.attached = 0;
                        }
                    });

                    frame.last.x = frame.x;
                    frame.last.y = frame.y;
                    frame.last.width = frame.width;
                    frame.last.height = frame.height;
                    frame.last.opacity = frame.opacity;
                }
            });

            layer.frames = layer.frames.filter(frame => !frame.object.is("@destroyed"));
        });

        return 1;
    }

    _layout(name) {
        let p = this.__private(cn);

        if (!p.layouts[name]) {
            if(name == Layout.TYPE_BOX) {
                p.layouts[name] = new BoxLayout(this);
            } else if(name == Layout.TYPE_STACK) {
                p.layouts[name] = new StackLayout(this);
            } else if(name == Layout.TYPE_STACK) {
                p.layouts[name] = new CartesianLayout(this);
            }
        }

        return p.layouts[name];
    }
}

// Frames.plugin('layer')
Frames.ALIGN_LEFT = "left";
Frames.ALIGN_CENTER = "center";
Frames.ALIGN_RIGHT = "right";

Frames.ANIMATION_SHOW = "show";
Frames.ANIMATION_HIDE = "hide";

export default Frames;
