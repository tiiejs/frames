import TiieObject from "Tiie/Object";
import jQuery from "jquery";

const cn = 'Frame';
class Frame extends TiieObject {
    constructor(frames, params = {}) {
        super();

        let p = this.__private(cn, {
            frames,
        });

        p.x = params.x ? params.x : 0;
        p.y = params.y ? params.y : 0;

        // p.align = params.align ? params.align : ["center"];
        p.align = params.align ? params.align : null;
        p.size = params.size ? params.size : "normal";
        p.width = params.width ? params.width : null;
        p.height = params.height ? params.height : null;
        p.opacity = params.opacity ? params.opacity : 1;
        p.css = params.css ? params.css : {};

        p.element = jQuery(`<div class="em-frames__frame"></div>`);

        // Each frame is visible.
        this.set("@visible", 1);
        this.set("@hover", 0);

        p.element.mouseenter(() => {
            this.set("@hover", 1);
        });

        p.element.mouseleave(() => {
            this.set("@hover", 0);
        });
    }

    view() {
        let p = this.__private(cn);

        return p.element;
    }

    element() {
        let p = this.__private(cn);

        return p.element;
    }

    hide() {
        let p = this.__private(cn);

        this.set("@visible", 0);

        return this;
    }

    show() {
        let p = this.__private(cn);

        this.set("@visible", 1);

        return this;
    }

    css(css) {
        let p = this.__private(cn);

        if (css == undefined) {
            return p.css;
        } else {
            p.css = css;

            return this;
        }
    }

    x(x) {
        let p = this.__private(cn);

        if (x == undefined) {
            return p.x;
        } else {
            p.x = x;

            return this;
        }
    }

    y(y) {
        let p = this.__private(cn);

        if (y == undefined) {
            return p.y;
        } else {
            p.y = y;

            return this;
        }
    }

    // align = ["top", "center"]
    align(align) {
        let p = this.__private(cn);

        if (align == undefined) {
            return p.align;
        } else {
            p.align = align;

            return this;
        }
    }

    size(size) {
        let p = this.__private(cn);

        if (size == undefined) {
            return p.size;
        } else {
            p.size = size;

            return this;
        }
    }

    width(width) {
        let p = this.__private(cn);

        if (width == undefined) {
            return p.width;
        } else {
            p.width = width;

            return this;
        }
    }

    height(height) {
        let p = this.__private(cn);

        if (height == undefined) {
            return p.height;
        } else {
            p.height = height;

            return this;
        }
    }

    opacity(opacity) {
        let p = this.__private(cn);

        if (opacity == undefined) {
            return p.opacity;
        } else {
            p.opacity = opacity;

            return this;
        }
    }
}

export default Frame;
