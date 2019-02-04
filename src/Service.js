/** @module Tiie/Frames */
import TiieObject from "Tiie/Object";

import Animation from "Tiie/Frames/Animation";

import Layout from "Tiie/Frames/Layouts/Layout";
import BoxLayout from "Tiie/Frames/Layouts/BoxLayout";
import StackLayout from "Tiie/Frames/Layouts/StackLayout";
// import CartesianLayout from "Tiie/Frames/Layouts/CartesianLayout";

import Frame from "Tiie/Frames/Frame";
import Frames from "Tiie/Frames/Frames";
import Layer from "Tiie/Frames/Layer";

const cn = 'Service';
class Service extends TiieObject {
    constructor() {
        super();

        let p = this.__private(cn, {
            attached : new WeakMap(),
            attachedFixed : new WeakMap(),
        });
    }

    /**
     * Attach frames to given target. Method checks if there is no any frames
     * attached. If frames is attached already then this frames are return.
     *
     * @param {jQuery} target
     * @param {boolean} fixed
     * @param {object} params
     *
     * @return {Tiie.Frames.Frames}
     */
    attach(target, fixed = 0, params = {}) {
        let p = this.__private(cn),
            attached = fixed ? p.attachedFixed : p.attached;
        ;

        if(attached.has(target)) {
            return attached.get(target);
        } else {
            let frames = new Frames(target, {
                fixed,
                zIndex : params.zIndex,
            });

            attached.set(target, frames);

            return frames;
        }
    }

    // /**
    //  * Check if there are frames attached for given target.
    //  *
    //  * @param {jQuery} frames
    //  * @return {boolean}
    //  */
    // attached(target) {
    //     let p = this.__private(cn);

    //     return p.attached.has(target) ? 1 : 0;
    // }

    // /**
    //  * Return frames reference if frames are attached to target.
    //  *
    //  * @param {jQuery} frames
    //  * @return {Tiie.Frames.Frames|null}
    //  */
    // frames(frames) {
    //     let p = this.__private(cn);

    //     return p.attached.has(target) ? p.attached.get(target) : null;
    // }
}

export default Service;
