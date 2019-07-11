"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MainPage;
(function (MainPage) {
    MainPage.prop_cargaLogin = null;
    MainPage.prop_template_login = null;
    MainPage._template = null;
    MainPage.prop_content_template = null;
    MainPage._template_sucursal = null;
    MainPage._template_infoentrega = null;
    MainPage.URLPrincipal = "";
    MainPage.MovilJs = MainPage.URLPrincipal + "MovilJs/";
    MainPage.SVCUsuariosMovil = MainPage.MovilJs + "svc_UsuariosMovil.svc/";
    MainPage.SVCAsignaciones = MainPage.MovilJs + "svc_Asignaciones.svc/";
    MainPage.IDAplication = 13;
    function fn_show_message(msg) {
        if (typeof Mobile === "object")
            Mobile._ShowMessage(msg);
        else {
            console.log(msg);
        }
    }
    MainPage.fn_show_message = fn_show_message;
    function fn_open_maps_assist(lat, lng) {
        if (typeof Mobile === "object")
            Mobile._NavigateMaps(lat, lng);
        else {
            window.open("http://maps.google.com/maps?daddr=" + lat + "," + lng, "_blank");
        }
    }
    MainPage.fn_open_maps_assist = fn_open_maps_assist;
    function fn_save_user_data(data) {
        if (typeof Mobile === "object") {
            Mobile._SaveUserInfo(data.Usuario, data.Contrasena);
        }
        else {
            localStorage.setItem("usuario", data.Usuario);
            localStorage.setItem("password", data.Contrasena);
        }
    }
    MainPage.fn_save_user_data = fn_save_user_data;
    function fn_getInfoUser() {
        let result = {};
        if (typeof Mobile === "object") {
            let user_data = Mobile._LoadInfo();
            if (user_data !== undefined) {
                if (user_data != "") {
                    result = JSON.parse(user_data);
                }
                this.UserData = result;
            }
        }
        else {
            let usuario = "", password = "";
            if (localStorage.getItem("usuario") != null)
                usuario = localStorage.getItem("usuario");
            if (localStorage.getItem("password") != null)
                password = localStorage.getItem("password");
            if (usuario != "" && password != "")
                result = { user: usuario, pass: password };
            result.TipoMovil = 3;
            result.IMEI = "";
            result.KeyGCM = "";
            this.UserData = result;
        }
    }
    MainPage.fn_getInfoUser = fn_getInfoUser;
})(MainPage = exports.MainPage || (exports.MainPage = {}));
