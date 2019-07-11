var _System;
(function (_System) {
    function _setSystem() {
        SystemJS.config({
            baseURL: "/",
            map: {
                d3: "libs/d3.min.js",
                leaflet: "libs/leaflet.js"
            },
            meta: {
                d3: {
                    format: "global",
                    exports: "d3"
                }
            },
            defaultJSExtensions: true
        });
    }
    _System._setSystem = _setSystem;
    function _ImportModule(nombre) {
        SystemJS.import(nombre);
    }
    _System._ImportModule = _ImportModule;
    _setSystem();
})(_System || (_System = {}));
