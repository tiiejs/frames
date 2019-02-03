/** @module Tiie/Frames */
import TiieObject from "Tiie/Object";

const cn = 'Animation';

/**
 * @class
 */
class Animation extends TiieObject {
    constructor() {
        super();

        let p = this.__private(cn, {
            style : null,
            animations : {},
            animated : new WeakMap(),
        });

        // Init animate style.
        p.style = jQuery("#em-frames__animate");

        if (!p.style.length) {
            // TODO Przekazanie jQuery w inny sposób niż globalny.
            p.style = jQuery(`<style id="em-frames__animate"></style>`);
            jQuery("head").append(p.style);
        }
    }

    /**
     * Calculate the coordinates to generate the animation.
     *
     * @param {string} animation
     * @param {object} context
     * @param {object} frame
     *
     * @return {object}
     */
    calculate(animation, context, frame) {
        if(0) {
        } else if (animation == 'zoomIn') {
            frame.x = ((context.width - frame.width) / 2) + (frame.width / 2);
            frame.y = frame.y + (frame.height) / 2;
            frame.width = 0;
            frame.height = 0;
        } else if (animation == 'zoomOut') {
            frame.x = ((context.width - frame.width) / 2) + (frame.width / 2);
            frame.y = frame.y + (frame.height) / 2;
            frame.width = 0;
            frame.height = 0;
        } else if(animation == 'slideInFromLeft') {
            frame.x = 0;
            frame.width = frame.width;
            frame.height = frame.height;
        } else if(animation == 'slideInFromRight') {
            frame.x = context.width - frame.width;
            frame.width = frame.width;
            frame.height = frame.height;
        } else if(animation == 'slideInFromTop') {
            frame.y = 0
        } else if(animation == 'slideInFromBottom') {
            frame.x = context.width - frame.width;
            frame.width = frame.width;
            frame.height = frame.height;
        }

        return frame;
    }

    transform(values, present, target) {
        let p = this.__private(cn),
            from = this._inlineCss(present),
            to = this._inlineCss(values),
            animation = this._animationName(values, present)
        ;

        if (p.animations[animation] == undefined) {
            let to = this._inlineCss(values),
                from = this._inlineCss(present)
            ;

            p.style.append(`
@keyframes ${animation} {
    from {
        ${from}
    }
    to {
        ${to}
    }
}

.${animation} {
    ${to}
    animation-name: ${animation};
    animation-duration: 0.3s;
}
        `);

            p.animations[animation] = 1;
        }

        if (p.animated.get(target) == animation) {
            // Target was aniamated at this way.
            return animation;
        }

        // Remove old class.
        if (p.animated.get(target)) {
            target.removeClass(p.animated.get(target));
        }

        // Set new.
        p.animated.set(target, animation);

        // Animate
        target.addClass(animation);

        return new Promise((resolve, reject) => {
            target.one("oanimationend animationend webkitAnimationEnd", resolve);
        });
    }

    _animationName(values, present) {
        let p = this.__private(cn),
            name = "animate"
        ;

        Object.keys(values).forEach((attribute) => {
            name = `${name}${(values[attribute] + "").replace(".", "")}`;
        });

        Object.keys(present).forEach((attribute) => {
            name = `${name}${(present[attribute] + "").replace(".", "")}`;
        });

        return name;
    }

    _inlineCss(values = {}) {
        let p = this.__private(cn),
            inline = ""
        ;

        Object.keys(values).forEach((attribute) => {
            if (
                attribute == "left" ||
                attribute == "top" ||
                attribute == "width" ||
                attribute == "height"
            ) {
                inline = `${inline}\n${attribute}: ${values[attribute]}px;\n`;
            } else {
                inline = `${inline}\n${attribute}: ${values[attribute]};\n`;
            }
        });

        return inline;
    }
}

Animation.ANIMATION_ZOOM_IN = "zoomIn";
Animation.ANIMATION_ZOOM_OUT = "zoomOut";

Animation.ANIMATION_SLIDE_IN_FROM_RIGHT = "slideInFromRight";
Animation.ANIMATION_SLIDE_IN_FROM_LEFT = "slideInFromLeft";
Animation.ANIMATION_SLIDE_IN_FROM_TOP = "slideInFromTop";
Animation.ANIMATION_SLIDE_IN_FROM_BOTTOM = "slideInFromBottom";

export default Animation;

