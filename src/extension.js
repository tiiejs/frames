import Frames from "Tiie/Frames/Frames";
import FramesService from "Tiie/Frames/Service";
import style from "./resources/style.css";

export default function(app) {
    let service = new FramesService();

    app.components().set("@frames", service);
    app.components().set("@frames.window", service.attach(app.target(), {
        fixed : 1,
        zIndex : 1001
    }));
}
