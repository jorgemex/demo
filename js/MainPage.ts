import { Template } from "./controles/template";
import { Carga } from "./controles/control_svg_carga";
//import { namespace } from "d3";
interface Mobile {
  _SaveUserInfo(usuario: string, password: string): void;
  _LoadInfo(): any;
  _CheckUserData(param: string): void;
  _NavigateMaps(lat: number, lng: number): void;
  _ShowMessage(msg: string): void;
  _ClickOnBack(): boolean;
  _CloseApp(): void;
}
declare let Mobile: Mobile;

export namespace MainPage {
  export let prop_contenedor_principal: d3.Selection<any, any, any, any>;
  export let prop_cargaLogin: Carga.iObjetoControl = null;
  export let svg_top_parent: d3.Selection<any, any, any, any>;
  export let prop_template_login: Template.iControlObject = null;
  export let _template: Template.iControlObject = null;
  export let prop_content_template: d3.Selection<any, any, any, any> = null;
  export let _template_sucursal: Template.iControlObject = null;
  export let _template_infoentrega: Template.iControlObject = null;
  export let URLPrincipal: string = "";
  export let MovilJs: string = URLPrincipal + "MovilJs/";
  export let SVCUsuariosMovil: string = MovilJs + "svc_UsuariosMovil.svc/";
  export let SVCAsignaciones: string = MovilJs + "svc_Asignaciones.svc/";
  //Defaul Values
  export var UserData: any;
  export var IDAplication: number = 13;
  export function fn_show_message(msg: string) {
    if (typeof Mobile === "object") Mobile._ShowMessage(msg);
    else {
      // alert(msg);
      console.log(msg);
    }
  }
  export function fn_open_maps_assist(lat: number, lng: number) {
    if (typeof Mobile === "object") Mobile._NavigateMaps(lat, lng);
    else {
      window.open(
        "http://maps.google.com/maps?daddr=" + lat + "," + lng,
        "_blank"
      );
    }
  }
  export function fn_save_user_data(data: any) {
    if (typeof Mobile === "object") {
      Mobile._SaveUserInfo(data.Usuario, data.Contrasena);
    } else {
      localStorage.setItem("usuario", data.Usuario);
      localStorage.setItem("password", data.Contrasena);
    }
  }

  export function fn_getInfoUser() {
    let result: any = {};
    if (typeof Mobile === "object") {
      let user_data = Mobile._LoadInfo();

      if (user_data !== undefined) {
        if (user_data != "") {
          result = JSON.parse(user_data);
          // result = { "user": result.user, "pass": result.password };
        }

        this.UserData = result;
      }
    } else {
      let usuario: string = "",
        password: string = "";

      if (localStorage.getItem("usuario") != null)
        usuario = localStorage.getItem("usuario");
      if (localStorage.getItem("password") != null)
        password = localStorage.getItem("password");

      if (usuario != "" && password != "")
        result = { user: usuario, pass: password };

      //Default App Values
      result.TipoMovil = 3; // => 1: Android, 2: IOS, 3: Web
      result.IMEI = "";
      result.KeyGCM = "";

      this.UserData = result;
    }
  }
}
