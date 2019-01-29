import Layout from "Tiie/Frames/Layouts/Layout";

const cn = 'Frames';
class CartesianLayer extends Layout {
    constructor(canvas, params = {}) {
        super(canvas);

        let p = this.__private(cn, {});

        // Set private.
        p.level = params.hasOwnProperty("level") ? params.level : 1;
        p.containers = [];
    }

    level(level) {
        let p = this.__private(cn);

        if (level) {
            p.level = level;
        } else {
            return p.level
        }
    }

    windows() {
        let p = this.__private(cn);

        return p.containers.map(container => container.window);
    }

    push(window) {
        let p = this.__private(cn),
            // todo
            // Change topi-windows__window-item to topi-windows__container
            container = jQuery(`<div class="topi-windows__container"></div>`)
        ;

        p.containers.push({
            // Cordinates
            x : 0,
            y : 0,

            // Attributes
            opacity : 1,
            width : null,
            height : null,

            container,
            window,
            last : null,
        });

        container.append(window.element());

        this.canvas().append(container);

        this.reload();

        return this;
    }

    reload() {
        let p = this.__private(cn),
            last = {},
            canvasHeight = p.canvas.height(),
            canvasWidth = p.canvas.width(),
            destroyed = 0
        ;

        p.containers.forEach((container, key) => {
            let animate = 0,
                visible = container.window.is("@visible")
            ;

            if (visible) {
                container.x = container.window.x();
                container.y = container.window.y();

                container.window.opacity(1);
            } else {
                container.window.opacity(0);
            }

            if (container.window.size()) {
                container.height = this.__calculate("height", container.window.size());
                container.width = this.__calculate("width", container.window.size());
            }

            container.opacity = container.window.opacity();

            if (container.window.width()) container.width = this.__calculate("width", container.window.width());
            if (container.window.height()) container.height = this.__calculate("height", container.window.height());

            // Level
            container.level = this.level();

            if (container.last == null) {
                container.last = {};
                container.last.x = container.x;
                container.last.y = container.y;
                container.last.width = container.width;
                container.last.height = container.height;
                container.last.opacity = container.opacity;

                animate = 1;
            }

            // Save values of last position.
            if (visible) {
                last = {
                    x : container.x,
                    y : container.y,
                    height : container.height,
                    width : container.width,
                    opacity : container.opacity,
                };
            }

            if (
                container.x != container.last.x ||
                container.y != container.last.y ||
                container.height != container.last.height ||
                container.width != container.last.width ||
                container.opacity != container.last.opacity ||
                animate
            ) {
                this.animation().animate({
                    left : container.x,
                    top : container.y,
                    width : container.width,
                    height : container.height,
                    opacity : container.opacity,
                }, {
                    left : container.last.x,
                    top : container.last.y,
                    width : container.last.width,
                    height : container.last.height,
                    opacity : container.last.opacity,
                }, container.container);

                container.last.x = container.x;
                container.last.y = container.y;
                container.last.width = container.width;
                container.last.height = container.height;
                container.last.opacity = container.opacity;
            }
        });

        p.containers = p.containers.filter(container => !container.window.is("@destroyed"));
        p.containers.filter(container => container.window.is("@destroyed"));

        return 1;
    }
}

export default CartesianLayout;
