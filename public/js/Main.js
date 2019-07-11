"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3");
const MainPage_1 = require("./MainPage");
const template_1 = require("./controles/template");
let prop_svg_contenedor_template = null;
var Main;
(function (Main) {
    class main {
        constructor() {
            MainPage_1.MainPage.prop_contenedor_principal = d3
                .select("body")
                .append("div")
                .style("width", "100%")
                .style("height", "100%");
            MainPage_1.MainPage.svg_top_parent = template_1.Template.fn_create_svg_parent_top(MainPage_1.MainPage.prop_contenedor_principal);
            MainPage_1.MainPage.prop_template_login = template_1.Template.fun_main({
                el_content: MainPage_1.MainPage.prop_contenedor_principal,
                prop_height_footer: 0,
                prop_height_header: 0,
                prop_orientation: "portrait"
            });
            console.log("eesto", this);
        }
    }
    Main.main = main;
})(Main = exports.Main || (exports.Main = {}));
