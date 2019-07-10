"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3");
const MainPage_1 = require("./MainPage");
var Main;
(function (Main) {
    class main {
        constructor() {
            MainPage_1.MainPage.prop_contenedor_principal = d3.select("body");
            console.log("eesto", this);
        }
    }
    Main.main = main;
})(Main = exports.Main || (exports.Main = {}));
