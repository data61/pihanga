
# Overview

Implements a simple Web UI to ask a few questions to a backend which
calculates the answer in a privacy preserving way.

## Running

    % node backend.js

This will start a web server listening at port 8080, and pointing
your web browser at `http://__this_machine_name__:8080`. 

When issuing a request from the UI, the above started server is 
delegating the request by executing the `wrapper.sh` script and 
returning the output of that script.

## Building

To build the javascript bundle and front page, run the `build_dist.sh`
script which will create all the necessary artefacts to run the UI
in the `build` directory.

# Developer

To further develop the UI start the development server with

    % npm start

