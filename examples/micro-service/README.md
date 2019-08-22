
# Overview

Implements a simple Web UI which can be dynamically extended by simply adding additional javascript files
into the main page.

# Quick Demo

Let us quickly run through a few steps to demonstrate on how we can dynamically add UI components provided by a micro service 
without having to change any code in the core application.

## Step 1: Build Base UI

The basic scaffolding is implemented in `core`. To build it:

    cd core
    npm install
    npm run build
    cd ..

This is a _normal__ React application and could already be previewed by running `npm start` in the `core` directory.

## Step 2: Start Test Server

In the top directory of this example you'll find a `server.js` file which contains a simple [express](https://expressjs.com) web application. Assuming you have _express_ installed in a global context (`npm install express --save`), you an start the server with:

    node server.js
    ...
    Server listening on port 8080!

Pointing a web browser to `http://localhost:8080` should show a page like:

<p align="center">
  <img src="./doc/core-only.png" alt="Core screen" width="400"/>
</p>

## Step 3: Add an Additional Service

If we want to add a new 'Cars' service and make accesible through the left menu, do the following:

    cd car-service
    npm install
    npm run build

This creates a `car-service.js` file in the `build` directory.

Now lets return to the parent directory and re-start the test server.

    node server.js
    ...
    Server listening on port 8080!

Returning back to the web browser and refreshing the page should now show a page like:

<p align="center">
  <img src="./doc/with-car-service.png" alt="With Car Service" width="400"/>
</p>

And clicking on the new service, should transition to the top page of that service:

<p align="center">
  <img src="./doc/car-service.png" alt="Car Service" width="400"/>
</p>

# So how Does this Work

As mentioned above, the core application is built as a standard __Pihanga__ application with a few 
minor additions which will allow extensions to register themselves before the core is calling `pihangaStart`.

The primary idea is to create a _rendezvous point_ on the `index.html` page followed by `script` tags loading the
extensions, followed by the core libraries. 

    <body style="height: 100%; margin: 0" >
        <div id="root" style="height: 100%"></div>
        <!-- Rendezvous point for extensions -->
        <script type="text/javascript">
            var Pihanga = {
                BootstrapInit: [],
                Core: {},
                UI: {}
            };
        </script>
        <!-- extensions -->
        <script type="text/javascript" src="/static/car-service/car-service.js"></script>
        <!-- core and REACT runtime -->
        <script type="text/javascript" src="/static/core/static/js/2.06d855d3.chunk.js"></script>
        <script type="text/javascript" src="/static/core/static/js/main.592571b1.chunk.js"></script>
        <script type="text/javascript" src="/static/core/static/js/runtime~main.b9ab5a92.js"></script>
    </body>

The global `Pihanga` acts as the _rendezvous point_ between the core and the extensions. Let us first look at how
an extension registers with the core.

In `car-service/src/index.js`, we find the following code snippet:

    export function bootstrapInit(opts) {
        const cardDefs = cardDefsF(opts);
        return register => {
            ... // Called during the normal Pihanga bootstrpa process
        };    
    }

    if (window.Pihanga) {
      window.Pihanga.BootstrapInit.push(bootstrapInit);
    }

When the `car-service.js` script gets loaded and the code in `index.js` gets executed it only attaches the local function `bootstrapInit`
to the global `window.Pihanga.BootstrapInit` array and immediately returns.

Now, let us have a look at the `core/src/index.js`. Beside the usual __Pihanga__ bootstrapping code, we find the following, additional fragment:

    if (window.Pihanga) {
        ...
        if (Array.isArray(window.Pihanga.BootstrapInit)) {
            const opts = exportModule({}, require('./app.pihanga'));
            window.Pihanga.BootstrapInit.forEach(f => {
                const initF = f(opts);
                if (initF) {
                    inits.push(initF);
                } else {
                    logger.error("extension bootstrap didn't return anything for ", f);
                }
            });
        }
    }

    pihangaStart({
        ...
        inits,
        ...
    });

The first few lines test if the rendezvous points were defined in `index.html`, specifically `window.Pihanga.BootstrapInit[]`. If it exists, we first collect all the helper functions defined in `./app.pihanga.js` (`const opts = ...`) and then calls all the functors registered in
`BootstrapInit`. The returned functions is then added to the `inits` function array which later becomes a parameter to `pihangaStart` and 
therefore becomes part of the normal __Pihanga__ bootstrap process.
