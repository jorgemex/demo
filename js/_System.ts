namespace _System {
  export function _setSystem() {
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
  export function _ImportModule(nombre: string) {
    SystemJS.import(nombre);
  }
  _setSystem();
}
