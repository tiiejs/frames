import TiieObject from "Tiie/Object";

const cn = 'Layout';
class Layout extends TiieObject{
    constructor(frames, params = {}) {
        super();

        let p = this.__private(cn, {});
    }

    recalculate(frames = []) {
        console.warn(`Please implement recalculate method for layout.`);

        return frames;
    }
}

Layout.TYPE_STACK = "stack";
Layout.TYPE_CARTESIAN = "cartesian";
Layout.TYPE_BOX = "box";

export default Layout;
