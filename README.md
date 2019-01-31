## Tiiejs frames
Extension to display frames.

## Install

### Webpack

First we need to define alias for Webpack.

```js
// webpack.config.js

const path = require('path');

module.exports = (environment) => {
    return {
        // ...
        resolve : {
            alias : {
                // ...
                "Tiie/Frames" : "tiiejs-frames/src",
                "Tiie" : "tiiejs/src",
            }
        }
    }
};
```

Then plug extension and define component.

```js
import App from "Tiie/App";
import extensionFrames from "Tiie/Frames/extension"

// ...
let app = new App(jQuery("body"));

app.plugin(extensionFrames);
app.run();
```

**The documentation is being created ...**
