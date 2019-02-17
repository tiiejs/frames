import Layout from "Tiie/Frames/Layouts/Layout";

const cn = 'BoxLayout';
class BoxLayout extends Layout {
    constructor(frames, params = {}) {
        super(frames, params);

        let p = this.__private(cn, {
            align : params.align ? params.align : ["center"],
        });

        // Set private.
        p.frames = frames;
    }

    // recalculate(frames = []) {
    recalculate(frames = [], layer) {
        let p = this.__private(cn),
            height = p.frames.height(),
            width = p.frames.width(),
            last = {},
            first = 1,

            // attributes
            // align = layer.get("align") ? layer.get("align") : ["center"],

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

        let frame = null;

        frames.forEach((f) => {
            if(f.visible) {
                frame = f;
            }
        });

        if(frame) {
            let align = frame.align ? frame.align : (layer.align() ? layer.align() : ["center"]);

            if(0) {
            } else if (align.includes("left")) {
                frame.x = 0 + marginLeft;
            } else if (align.includes("center")) {
                // frame.transform.x = (width - frame.width) / 2;
                frame.x = ((width - frame.width) / 2) + marginLeft;
            } else if (align.includes("right")) {
                // frame.transform.x = width - frame.width;
                frame.x = (width - frame.width) - marginRight;
            }

            frame.y = 0 + marginTop;
        }

        return frames;
    }
}

export default BoxLayout;
