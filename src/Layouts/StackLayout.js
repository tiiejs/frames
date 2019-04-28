import Layout from "Tiie/Frames/Layouts/Layout";

const cn = 'StackLayout';
class StackLayout extends Layout {
    constructor(frames, target, responsive) {
        super(frames, target, responsive);

        let p = this.__private(cn, {
            // ...
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

            // attributes
            // align = layer.get("align"),

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

        frames.forEach((frame, key) => {
            if (!frame.visible) {
                // Ommit invisible frames.
                return;
            }

            if (first) {
                first = 0;
                frame.y = 0 + marginTop;
            } else {
                frame.y = last.y + last.height + 20;
            }

            // Calculate align
            if (frame.align.includes("left")) {
                frame.x = 0 + marginLeft;
            } else if (frame.align.includes("center")) {
                frame.x = ((width - (marginLeft + marginRight)) - frame.width) / 2;
            } else if (frame.align.includes("right")) {
                frame.x = width - marginRight - frame.width;
            }

            last = {
                x : frame.x,
                y : frame.y,
                height : frame.height,
                width : frame.width,
            };
        });

        return frames;
    }
}

export default StackLayout;
