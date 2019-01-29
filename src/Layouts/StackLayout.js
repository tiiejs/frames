import Layout from "Tiie/Frames/Layouts/Layout";

const cn = 'StackLayout';
class StackLayout extends Layout {
    constructor(frames, params = {}) {
        super(frames, params);

        let p = this.__private(cn, {
            align : params.align ? params.align : ["center"],
        });

        // Set private.
        p.frames = frames;
    }

    recalculate(frames = [], layer) {
        let p = this.__private(cn),
            height = p.frames.height(),
            width = p.frames.width(),
            last = {},
            first = 1,

            // attributes
            align = layer.get("align"),

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

        if(!(align = layer.align())) align = ["center"];

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
            if (align.includes("left")) {
                frame.x = 0 + marginLeft;
            } else if (align.includes("center")) {
                frame.x = ((width - (marginLeft + marginRight)) - frame.width) / 2;
            } else if (align.includes("right")) {
                frame.x = (width - marginRight) - frame.width;
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
