"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3");
const MainPage_1 = require("./MainPage");
const template_1 = require("./controles/template");
const dashboard_1 = require("./pantallas/dashboard");
const control_svg_carga_1 = require("./controles/control_svg_carga");
const Usuario_1 = require("./data/Usuario");
const DB_1 = require("./data/DB");
const Unidad_1 = require("./data/Unidad");
const RutaPuntos_1 = require("./data/RutaPuntos");
const AsignacionRuta_1 = require("./data/AsignacionRuta");
const Sucursales_1 = require("./pantallas/Sucursales");
const infoEntrega_1 = require("./pantallas/infoEntrega");
const dialogs_1 = require("./general/dialogs");
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
            prop_svg_contenedor_template = MainPage_1.MainPage.prop_template_login
                .fun_get_g_content()
                .append("g")
                .classed("g_content_app", true);
            let g_contentCargaLogin = MainPage_1.MainPage.prop_template_login
                .fun_get_g_content()
                .append("g")
                .classed("g_content_carga_app", true);
            fn_crearControlCarga(g_contentCargaLogin);
            MainPage_1.MainPage.prop_cargaLogin.met_mostrar();
            prop_svg_contenedor_template
                .select(".svg_frmLogin")
                .style("display", "none");
            window.location.replace("#");
            window.onhashchange = fn_onPageChange;
            fn_getInfoUser();
        }
    }
    Main.main = main;
    function fn_getInfoUser() {
        Usuario_1.Usuario.fn_get_user_data()
            .then(function (data) {
            if (data.length > 0) {
                window.location.assign("#DsH");
                MainPage_1.MainPage.prop_template_login.prop_element.setAttribute("style", "display: none;");
                dashboard_1.Dashboard.fn_init_dashboard();
                MainPage_1.MainPage.prop_cargaLogin.met_ocultar();
            }
            else {
                fn_mostrar_login();
            }
        })
            .catch(function (err) {
            console.log(err);
            fn_mostrar_login();
            dashboard_1.Dashboard.fn_init_dashboard();
        });
    }
    function fn_crearControlCarga(parent) {
        if (MainPage_1.MainPage.prop_cargaLogin == null) {
            MainPage_1.MainPage.prop_cargaLogin = control_svg_carga_1.Carga.fun_main({
                prop_diametro: 150,
                width: MainPage_1.MainPage.prop_template_login.fun_get_width(),
                height: MainPage_1.MainPage.prop_template_login.fun_get_height_content(),
                opacity: 0.7,
                background: "#ffffff",
                color: "#000000",
                el_contenedor_padre: parent
            });
        }
    }
    function fn_mostrar_login() {
        MainPage_1.MainPage.prop_cargaLogin.met_ocultar();
        MainPage_1.MainPage.prop_template_login.prop_element.setAttribute("style", "display: block;");
        dashboard_1.Dashboard.fn_show_dashboard();
        if (prop_svg_contenedor_template.select(".svg_frmLogin").size() > 0) {
            prop_svg_contenedor_template
                .select(".svg_frmLogin")
                .style("display", "block");
            window.location.replace("#LgN");
        }
    }
    Main.fn_mostrar_login = fn_mostrar_login;
    function fn_onPageChange() {
        let hash = ("" + window.location.hash).replace("#", "");
        if (hash == "DsH") {
            if (MainPage_1.MainPage._template != null) {
                if (MainPage_1.MainPage._template_sucursal != null) {
                    Sucursales_1.Sucursales.fn_destroy();
                }
                if (MainPage_1.MainPage._template_infoentrega != null) {
                    infoEntrega_1.infoEntrega.fn_destroyinfo();
                }
                dashboard_1.Dashboard.fn_show_dashboard();
            }
        }
        else {
            if (hash == "") {
                window.location.assign("#DsH");
            }
            else if (hash == "SuC") {
                if (MainPage_1.MainPage._template != null) {
                    dashboard_1.Dashboard.fn_hide_dashboard();
                }
                Sucursales_1.Sucursales.fn_createView();
            }
            else if (hash == "iE") {
                if (MainPage_1.MainPage._template != null) {
                    dashboard_1.Dashboard.fn_hide_dashboard();
                }
                infoEntrega_1.infoEntrega.fn_createviewinfo();
            }
            else if (hash == "CSN") {
                setTimeout(() => {
                    dialogs_1.dialogs.show_confirm_dialog("Cerrar Sesión", "Se abandonará el seguimiento de rutas", dialogs_1.dialogs.fn_salir);
                }, 400);
            }
            else if (hash == "CHT") {
                dialogs_1.dialogs.show_alert_dialog("Recordatorio de entrega", "Te restan " + 2 + "hrs 35 min para finalizar la entrega");
            }
        }
    }
    function InitDB() {
        return __awaiter(this, void 0, void 0, function* () {
            let allStores = [
                {
                    storeName: Usuario_1.Usuario.StoreName,
                    key: Usuario_1.Usuario.Key,
                    columns: Usuario_1.Usuario.ColumnName
                },
                {
                    storeName: Unidad_1.Unidad.StoreName,
                    key: Unidad_1.Unidad.Key,
                    columns: Unidad_1.Unidad.ColumnName
                },
                {
                    storeName: RutaPuntos_1.RutaPuntos.StoreName,
                    key: RutaPuntos_1.RutaPuntos.Key,
                    columns: RutaPuntos_1.RutaPuntos.ColumnName
                },
                {
                    storeName: AsignacionRuta_1.AsignacionRuta.StoreName,
                    key: AsignacionRuta_1.AsignacionRuta.Key,
                    columns: AsignacionRuta_1.AsignacionRuta.ColumnName
                }
            ];
            return DB_1.DB.Init(allStores);
        });
    }
    Main.InitDB = InitDB;
})(Main = exports.Main || (exports.Main = {}));
var main = new Main.main();
