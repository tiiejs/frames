import Frames from "Tiie/Frames/Frames";
import FramesService from "Tiie/Frames/Service";
import style from "./resources/style.scss";

export default function(app, params = {}) {
    let service = new FramesService(app.components().get("@responsive"));

    app.components().set("@frames", service);

    // Create Frames for window.
    app.components().set("@frames.window", service.attach(app.target(), 1, {
        zIndex : params.windowZIndex,
    }));

    return 1;
}
