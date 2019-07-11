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
const DB_1 = require("./DB");
const d3 = require("d3");
const MainPage_1 = require("../MainPage");
const Request_1 = require("./Request");
var Usuario;
(function (Usuario) {
    Usuario.StoreName = "Usuario";
    Usuario.Key = "IdUsuario";
    Usuario.ColumnName = [
        "IdUsuario",
        "NombreUsuario",
        "IdEmpresa",
        "IdUnidad",
        "NombreUnidad",
        "Token",
        "IdSesion"
    ];
    function fn_save_user_data(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let listData = [data];
            return DB_1.DB.addRows(Usuario.StoreName, listData);
        });
    }
    Usuario.fn_save_user_data = fn_save_user_data;
    function fn_get_user_data() {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_1.DB.getRows(Usuario.StoreName).then(function (result) {
                if (result.length > 0)
                    Usuario.UserLogged = result[0];
                return new Promise((resolve, reject) => {
                    let dats = [
                        {
                            IdUsuario: 1,
                            NombreUsuario: "jorge",
                            IdEmpresa: 2,
                            IdUnidad: 2,
                            NombreUnidad: "Unidad movil",
                            Token: "1234",
                            IdSesion: 5432
                        }
                    ];
                    Usuario.UserLogged = dats[0];
                    resolve(dats);
                });
            });
        });
    }
    Usuario.fn_get_user_data = fn_get_user_data;
    function fn_login(user, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return d3.json(MainPage_1.MainPage.SVCUsuariosMovil + "IniciarSesion", {
                method: "POST",
                body: JSON.stringify({
                    Usuario: user,
                    Contrasena: password,
                    Aplicacion: MainPage_1.MainPage.IDAplication,
                    TipoMovil: MainPage_1.MainPage.UserData.TipoMovil,
                    IMEI: MainPage_1.MainPage.UserData.IMEI,
                    KeyGCM: MainPage_1.MainPage.UserData.KeyGCM
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
        });
    }
    Usuario.fn_login = fn_login;
    function fn_logout() {
        DB_1.DB.DBDelete();
        MainPage_1.MainPage.UserData.user = "";
        MainPage_1.MainPage.UserData.pass = "";
    }
    Usuario.fn_logout = fn_logout;
    function fn_obtener_unidad_usuario_movil() {
        return __awaiter(this, void 0, void 0, function* () {
            let params = {
                IdUsuario: Usuario.UserLogged.IdUsuario,
                Token: Usuario.UserLogged.Token,
                Modificacion: null
            };
            return Request_1.Request.JSONRequest(MainPage_1.MainPage.SVCUsuariosMovil + "ObtenerUnidadUsuarioMovil", "POST", params).then(function (result) {
                if (result.ObtenerUnidadUsuarioMovilResult &&
                    result.ObtenerUnidadUsuarioMovilResult.length > 0 &&
                    Usuario.UserLogged.IdUnidad !=
                        result.ObtenerUnidadUsuarioMovilResult[0].IdUnidad) {
                    Usuario.UserLogged.IdUnidad =
                        result.ObtenerUnidadUsuarioMovilResult[0].IdUnidad;
                    Usuario.UserLogged.NombreUnidad =
                        result.ObtenerUnidadUsuarioMovilResult[0].NombreUnidad;
                    return DB_1.DB.setRows(Usuario.StoreName, [Usuario.UserLogged]).then(() => {
                        return fn_get_user_data();
                    });
                }
                else
                    return result;
            });
        });
    }
    Usuario.fn_obtener_unidad_usuario_movil = fn_obtener_unidad_usuario_movil;
    function fn_sesion_en_proceso() {
        return __awaiter(this, void 0, void 0, function* () {
            let params = {
                IdUsuario: Usuario.UserLogged.IdUsuario,
                Token: Usuario.UserLogged.Token,
                IdSesion: Usuario.UserLogged.IdSesion
            };
            return Request_1.Request.JSONRequest(MainPage_1.MainPage.SVCUsuariosMovil + "SesionEnProceso", "POST", params);
        });
    }
    Usuario.fn_sesion_en_proceso = fn_sesion_en_proceso;
    function fn_cerrar_sesion() {
        return __awaiter(this, void 0, void 0, function* () {
            let params = {
                IdUsuario: Usuario.UserLogged.IdUsuario,
                Token: Usuario.UserLogged.Token,
                IdSesion: Usuario.UserLogged.IdSesion
            };
            return Request_1.Request.JSONRequest(MainPage_1.MainPage.SVCUsuariosMovil + "CerrarSesion", "POST", params);
        });
    }
    Usuario.fn_cerrar_sesion = fn_cerrar_sesion;
})(Usuario = exports.Usuario || (exports.Usuario = {}));
