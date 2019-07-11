import * as d3 from "d3";
import { MainPage } from "./MainPage";
import { Template } from "./controles/template";
import { Dashboard } from "./pantallas/dashboard";
import { Carga } from "./controles/control_svg_carga";
import { Login } from "./pantallas/Login";
import { Usuario } from "./data/Usuario";
import { DB } from "./data/DB";
import { Unidad } from "./data/Unidad";
import { RutaPuntos } from "./data/RutaPuntos";
import { AsignacionRuta } from "./data/AsignacionRuta";
import { Sucursales } from "./pantallas/Sucursales";
import { infoEntrega } from "./pantallas/infoEntrega";
import { dialogs } from "./general/dialogs";

let prop_svg_contenedor_template: d3.Selection<any, any, any, any> = null;

export namespace Main {
  // InitDB();//Init DB

  export class main {
    constructor() {
      //Dibujar el SVG
      MainPage.prop_contenedor_principal = d3
        .select("body")
        .append("div")
        .style("width", "100%")
        .style("height", "100%");

      //Construir el SVG Principal
      MainPage.svg_top_parent = Template.fn_create_svg_parent_top(
        MainPage.prop_contenedor_principal
      );

      MainPage.prop_template_login = Template.fun_main({
        el_content: MainPage.prop_contenedor_principal,
        prop_height_footer: 0,
        prop_height_header: 0,
        prop_orientation: "portrait"
      });

      prop_svg_contenedor_template = MainPage.prop_template_login
        .fun_get_g_content()
        .append("g")
        .classed("g_content_app", true);

      let g_contentCargaLogin = MainPage.prop_template_login
        .fun_get_g_content()
        .append("g")
        .classed("g_content_carga_app", true);
      fn_crearControlCarga(g_contentCargaLogin);
      MainPage.prop_cargaLogin.met_mostrar();

      //prop_svg_contenedor_template.append(() => Login.fn_crearLogin().node());
      prop_svg_contenedor_template
        .select(".svg_frmLogin")
        .style("display", "none");

      //Anclas...
      window.location.replace("#");
      window.onhashchange = fn_onPageChange;

      //Get & Valid User Data
      fn_getInfoUser();
      // Dashboard.fn_show_dashboard();
    }
  }
  function fn_getInfoUser() {
    //MainPage.fn_getInfoUser(); //Get Info Mobile
    Usuario.fn_get_user_data()
      .then(function(data: any) {
        if (data.length > 0) {
          window.location.assign("#DsH"); //asignar location
          MainPage.prop_template_login.prop_element.setAttribute(
            "style",
            "display: none;"
          );
          Dashboard.fn_init_dashboard();
          MainPage.prop_cargaLogin.met_ocultar();
        } else {
          fn_mostrar_login();
        }
      })
      .catch(function(err) {
        console.log(err);
        fn_mostrar_login();
        Dashboard.fn_init_dashboard();
      });
  }

  function fn_crearControlCarga(parent: d3.Selection<any, any, any, any>) {
    if (MainPage.prop_cargaLogin == null) {
      MainPage.prop_cargaLogin = Carga.fun_main({
        prop_diametro: 150,
        width: MainPage.prop_template_login.fun_get_width(),
        height: MainPage.prop_template_login.fun_get_height_content(),
        opacity: 0.7,
        background: "#ffffff",
        color: "#000000",
        el_contenedor_padre: parent
      });
    }
  }

  export function fn_mostrar_login() {
    // setTimeout(() => {
    //Usuario.fn_logout(); //Delete all BD
    // }, 1000);
    //comentario
    MainPage.prop_cargaLogin.met_ocultar();
    MainPage.prop_template_login.prop_element.setAttribute(
      "style",
      "display: block;"
    );
    Dashboard.fn_show_dashboard();
    if (prop_svg_contenedor_template.select(".svg_frmLogin").size() > 0) {
      prop_svg_contenedor_template
        .select(".svg_frmLogin")
        .style("display", "block");
      // MainPage.fn_obtenerDatosUsuario();

      window.location.replace("#LgN");
    }
  }

  function fn_onPageChange() {
    let hash = ("" + window.location.hash).replace("#", "");
    if (hash == "DsH") {
      if (MainPage._template != null) {
        if (MainPage._template_sucursal != null) {
          Sucursales.fn_destroy();
        }
        if (MainPage._template_infoentrega != null) {
          infoEntrega.fn_destroyinfo();
        }

        Dashboard.fn_show_dashboard();
      }
    } else {
      if (hash == "") {
        window.location.assign("#DsH");
      } else if (hash == "SuC") {
        if (MainPage._template != null) {
          Dashboard.fn_hide_dashboard();
        }
        Sucursales.fn_createView();
      } else if (hash == "iE") {
        if (MainPage._template != null) {
          Dashboard.fn_hide_dashboard();
        }
        infoEntrega.fn_createviewinfo();
      } else if (hash == "CSN") {
        setTimeout(() => {
          dialogs.show_confirm_dialog(
            "Cerrar Sesión",
            "Se abandonará el seguimiento de rutas",
            dialogs.fn_salir
          );
        }, 400);
      } else if (hash == "CHT") {
        dialogs.show_alert_dialog(
          "Recordatorio de entrega",
          "Te restan " + 2 + "hrs 35 min para finalizar la entrega"
        );
      }
    }
  }

  export async function InitDB() {
    let allStores = [
      {
        storeName: Usuario.StoreName,
        key: Usuario.Key,
        columns: Usuario.ColumnName
      }, // => Usuario
      {
        storeName: Unidad.StoreName,
        key: Unidad.Key,
        columns: Unidad.ColumnName
      }, // => Unidad
      {
        storeName: RutaPuntos.StoreName,
        key: RutaPuntos.Key,
        columns: RutaPuntos.ColumnName
      }, // => Ruta Puntos
      {
        storeName: AsignacionRuta.StoreName,
        key: AsignacionRuta.Key,
        columns: AsignacionRuta.ColumnName
      } // => Asignacion Ruta
    ];

    return DB.Init(allStores);
  }
}

var main = new Main.main();
