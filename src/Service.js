/** @module Tiie/Frames */
import TiieObject from "Tiie/Object";

import Frames from "Tiie/Frames/Frames";

const cn = 'Service';
class Service extends TiieObject {
    constructor(responsive) {
        super();

        let p = this.__private(cn, {
            attached : new WeakMap(),
            responsive,
        });
    }

    /**
     * Attach frames to given target. Method checks if there is no any frames
     * attached. If frames is attached already then this frames are return.
     *
     * @param {jQuery}  target
     * @param {number}  [params.zIndex]
     * @param {boolean} [params.fixed]
     *
     * @return {Tiie.Frames.Frames}
     */
    attach(target, params = {}) {
        let p = this.__private(cn);

        let frames = new Frames(target, p.responsive, {
            fixed : params.fixed,
            zIndex : params.zIndex,
        });

        if(p.attached.has(target)) {
            p.attached.get(target).push(frames);
        } else {
            p.attached.set(target, [frames]);
        }

        return frames;
    }
}

export default Service;
