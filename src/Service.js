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
        });
    }

    /**
     * Attach frames to given target. Method checks if there is no any frames
     * attached. If frames is attached already then this frames are return.
     *
     * @param {jQuery} target
     * @param {object} params
     *
     * @return {Tiie.Frames.Frames}
     */
    attach(target, params = {}) {
        let p = this.__private(cn),
            frames
        ;

        if(!p.attached.has(target)) {
            frames = new Frames(target, params);

            p.attached.set(target, frames);
        } else {
            frames = p.attached.get(target);
        }

        return frames;
    }
}

export default Service;
