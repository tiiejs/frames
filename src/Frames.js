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
 * @param {boolean}  [params.fixed]
 * @param {number}   [params.zIndex]
 *
 * @class
 */
class Frames extends TiieObject {
    constructor(target, responsive, params = {}) {
        super();

        let p = this.__private(cn, {
            target,
            layers : [],
            layouts : {},
            responsive,
            transforming : 0,

            // Params
            fixed : params.fixed ? 1 : 0,
            zIndex : params.zIndex !== undefined ? params.zIndex : 0,

            // Animation module.
            animation : new Animation(),
        });

        p.target.css("position", "relative");

        setInterval(() => {
            if (p.transforming > 0) {
                return;
            }

            this.reload();
        }, 500);
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
                this.__log(`Layer ${layerId} not found.`, "notice", "Tiie.Frames.Frames");

                return null;
            }
        }

        let object = new Frame(this, params),
            ui = jQuery(`<div class="em-frames__container${p.fixed ? ` --fixed` : ``}${params.classes ? ` ${params.classes.map(c => c).join(' ')}` : ``}">`)
        ;

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
            uiFrame : object.element(),
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
     * @param {string} id
     * @param {string[]} [param.align]
     * @param {string} [param.animationHideName]
     * @param {string} [param.animationShowName]
     * @param {string} [param.layout]
     * @param {number} [param.level]
     * @param {number} [param.margin]
     * @param {number} [param.marginBottom]
     * @param {number} [param.marginLeft]
     * @param {number} [param.marginRight]
     * @param {number} [param.marginTop]
     * @param {boolean} [param.modal]
     *
     * @return {Tiie.Frames.Layer}
     */
    createLayer(id, params = {}) {
        let p = this.__private(cn);

        p.layers.push({
            id,
            object : new Layer({
                align : params.align,
                animationHideName : params.animationHideName,
                animationShowName : params.animationShowName,
                layout : params.layout,
                level : params.level,

                margin : params.margin,
                marginBottom : params.marginBottom,
                marginLeft : params.marginLeft,
                marginRight : params.marginRight,
                marginTop : params.marginTop,

                modal : params.modal,
            }),

            frames : [],
            uiModal : null,
        });

        return p.layers[p.layers.length-1].object;
    }

    _css(ui, attribute, value) {
        let p = this.__private(cn);

        if(ui.css(attribute) != value) {
            ui.css(attribute, value);
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
            levelMax = levelOffset
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

                if (frame.object.is("@destroyed")) {
                    frame.visible = 0;
                } else {
                    frame.visible = frame.object.is("@view.visible");
                }
            });

            // Recalculate frames
            layout.recalculate(layer.frames, layer.object);

            // After recalculation I can set proper level for each frames.
            // First I increase levelOffset becaouse there is a new layer.
            // levelOffset++;

            // Check if there is modal.
            if(layer.object.is("modal")) {
                // Check if there is any visible frame.
                if(layer.frames.some(frame => frame.visible)) {
                    if(!layer.uiModal) {
                        layer.uiModal = jQuery(`<div class="em-frames__modal">`);

                        p.target.append(layer.uiModal);
                    }
                } else {
                    if(layer.uiModal) {
                        // Detach modal.
                        // TODO Modal na ramce.
                        // Trzeba sprawdzic mechanizm modalny czy nie ma
                        // wycieku pamieci. Wczesniej bylo tak ze modal by za
                        // kazdym razem appendowany do body co powodowalo
                        // dziwne zachowanie. Teraz jest appendowany tylko raz
                        // ale trzeba zewerfikowac czy nie ma gdzies do niego
                        // referencji.
                        layer.uiModal.detach();
                        layer.uiModal = null;
                    }
                }
            } else {
                if(layer.uiModal) {
                    layer.uiModal.remove();
                }
            }

            if(layer.uiModal) {
                this._css(layer.uiModal, "z-index", levelOffset);

                levelOffset++;
            }

            layer.frames.forEach((frame) => {
                let counted = frame.level + levelOffset;

                this._css(frame.ui, "z-index", counted);

                if(counted > levelMax) {
                    levelMax = counted;
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
                p.layouts[name] = new BoxLayout(this, p.target, p.responsive);
            } else if(name == Layout.TYPE_STACK) {
                p.layouts[name] = new StackLayout(this, p.target, p.responsive);
            } else if(name == Layout.TYPE_STACK) {
                p.layouts[name] = new CartesianLayout(this, p.target, p.responsive);
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
