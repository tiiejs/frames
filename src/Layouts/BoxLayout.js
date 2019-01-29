import Layout from "Tiie/Frames/Layouts/Layout";

const cn = 'BoxLayout';
class BoxLayout extends Layout {
    constructor(windows, params = {}) {
        super(windows, params);

        let p = this.__private(cn, {});

        // Set private.
        p.windows = windows;
    }

    recalculate(frames = []) {
        let p = this.__private(cn),
            canvasHeight = p.windows.height(),
            canvasWidth = p.windows.width(),
            lastVisible = null
        ;

        frames.forEach((frame, key) => {
            if (frame.visible) {
                lastVisible = frame;
            }
        });

        frames.forEach((frame, key) => {
            if (frame != lastVisible) {
                frame.visible = 0;
            } else {
                frame.visible = 1;
            }

            frame.y = 20;

            // Calculate align
            if(0) {
            } else if (frame.align.includes("left")) {
                // frame.transform.x = 0;
                frame.x = 0;
            } else if (frame.align.includes("center")) {
                // frame.transform.x = (canvasWidth - frame.width) / 2;
                frame.x = (canvasWidth - frame.width) / 2;
            } else if (frame.align.includes("right")) {
                // frame.transform.x = canvasWidth - frame.width;
                frame.x = canvasWidth - frame.width;
            }
        });

        return frames;
    }
}

export default BoxLayout;
