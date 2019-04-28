import TiieObject from "Tiie/Object";

const cn = 'Layout';
class Layout extends TiieObject{
    constructor(frames, target, responsive) {
        super();

        let p = this.__private(cn, {
            frames,
            target,
            responsive,
        });
    }

    recalculate(frames = []) {
        console.warn(`Please implement recalculate method for layout.`);

        return frames;
    }

    __target() {
        let p = this.__private(cn);

        return p.target;
    }

    __calculate(attribute, value) {
        let p = this.__private(cn);

        if (typeof value == "number") {
            return value;
        }

        if (value == "auto") {
            return value;
        }

        let relativeTo = 0;

        if(attribute == "width") {
            relativeTo = p.target.width();
        } else if (attribute == "height") {
            relativeTo = p.target.height();
        }

        if(
            typeof value == "object" ||
            typeof value == "string"
        ) {
            return p.responsive.calculate(p.target.width(), value);
        } else {
            return relativeTo;
        }
    }
}

Layout.TYPE_STACK = "stack";
Layout.TYPE_CARTESIAN = "cartesian";
Layout.TYPE_BOX = "box";

export default Layout;
