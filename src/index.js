// jQuery(document).ready(() => {
//     let frames = new Frames($("#app")),
//         index = []
//     ;
//
//     let layer = frames.layer("alert", Layout.TYPE_STACK, {
//         align : ["center"]
//     });
//
//     index.push(frames.create({
//         width : 200,
//         height : 100,
//     }, "alert"));
//
//     setTimeout(function() {
//         index.push(frames.create({
//             width : 200,
//             height : 100,
//         }, "alert"));
//
//         index[1].element().css({"background-color" : "yellow"});
//     }, 2000);
//
//     setTimeout(function() {
//         index.push(frames.create({
//             width : 200,
//             height : 100,
//         }, "alert"));
//
//         index[1].hide();
//     }, 4000);
//
//     setTimeout(function() {
//         index[1].show();
//     }, 6000);
// });
//
//
