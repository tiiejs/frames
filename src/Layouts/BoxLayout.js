import Layout from "Tiie/Frames/Layouts/Layout";
import jQuery from "jquery";

const cn = 'BoxLayout';
class BoxLayout extends Layout {
    constructor(frames, target, responsive) {
        super(frames, target, responsive);

        let p = this.__private(cn, {
            // private
            responsive,
        });

        // Set private.
        p.frames = frames;
    }

    recalculate(frames = [], layer) {
        let p = this.__private(cn),
            height = this.__target().height(),
            width = this.__target().width(),
            last = {},
            first = 1,

            // margin
            margin = layer.get("margin"),
            marginTop = layer.get("marginTop"),
            marginLeft = layer.get("marginLeft"),
            marginRight = layer.get("marginRight"),
            marginBottom = layer.get("marginBottom")
        ;

        // Calculate margin.
        margin = margin == null ? 0 : margin;
        marginTop = marginTop == null ? margin : marginTop;
        marginLeft = marginLeft == null ? margin : marginLeft;
        marginRight = marginRight == null ? margin : marginRight;
        marginBottom = marginBottom == null ? margin : marginBottom;

        // Align
        let layerAlign = p.responsive.selectValue(width, layer.align());

        // Calculate frames
        frames.forEach((frame) => {
            frame.level = 0;

            frame.opacity = frame.object.opacity();

            // Align
            let frameAlign = p.responsive.selectValue(width, frame.object.align());

            frame.align = frameAlign ? frameAlign : (layerAlign ? layerAlign : ["center", "top"]);

            if (frame.object.size()) {
                frame.width = this.__calculate("width", frame.object.size());
                frame.height = this.__calculate("height", frame.object.size());
            }

            if (frame.object.width()) frame.width = this.__calculate("width", frame.object.width());
            if (frame.object.height()) frame.height = this.__calculate("height", frame.object.height());

            if (frame.object.height() == "auto") {
                frame.height = jQuery(frame.uiFrame.get(0).firstChild).outerHeight();

                // todo Frame height for auto height.
                if (frame.height == 0) {
                    frame.height = 100;
                }
            }
        });

        let frame = null;

        frames.forEach((f) => {
            if(f.visible) {
                frame = f;
            }
        });

        if(frame) {
            let align = frame.align ? frame.align : (layer.align() ? layer.align() : ["center", "middle"]);

            if(0) {
            } else if (align.includes("left")) {
                frame.x = 0 + marginLeft;
            } else if (align.includes("center")) {
                frame.x = ((width - frame.width) / 2) + marginLeft;
            } else if (align.includes("right")) {
                frame.x = (width - frame.width) - marginRight;
            }

            frame.y = 0 + marginTop;

            if(0) {
            } else if (align.includes("top")) {
                frame.y = 0 + marginTop;
            } else if (align.includes("middle")) {
                frame.y = ((height - frame.height) / 2) + marginTop;
            } else if (align.includes("bottom")) {
                frame.y = (height - frame.height) - marginBottom;
            }
        }

        return frames;
    }
}

export default BoxLayout;
