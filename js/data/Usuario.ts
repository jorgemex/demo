import { DB } from "./DB";
import * as d3 from "d3";
import { MainPage } from "../MainPage";
import { Request } from "./Request";
import { Entidades } from "../general/Entidades";
import { General } from "../general/General";

export namespace Usuario {
  export var UserLogged: Entidades.IUsusario;
  export var StoreName = "Usuario";
  export var Key = "IdUsuario";
  export var ColumnName: string[] = [
    "IdUsuario",
    "NombreUsuario",
    "IdEmpresa",
    "IdUnidad",
    "NombreUnidad",
    "Token",
    "IdSesion"
  ];

  export async function fn_save_user_data(data: any) {
    let listData: Array<object> = [data];

    return DB.addRows(StoreName, listData);
  }
  export async function fn_get_user_data() {
    return DB.getRows(StoreName).then(function(result: any) {
      if (result.length > 0) UserLogged = result[0];
      return new Promise((resolve, reject) => {
        let dats: Array<Entidades.IUsusario> = [
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
        UserLogged = dats[0];
        resolve(dats);
      });
    });
  }

  export async function fn_login(user: string, password: string) {
    return d3.json(MainPage.SVCUsuariosMovil + "IniciarSesion", {
      method: "POST",
      body: JSON.stringify({
        Usuario: user,
        Contrasena: password,
        Aplicacion: MainPage.IDAplication,
        TipoMovil: MainPage.UserData.TipoMovil,
        IMEI: MainPage.UserData.IMEI,
        KeyGCM: MainPage.UserData.KeyGCM
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
  }

  export function fn_logout() {
    DB.DBDelete();
    MainPage.UserData.user = "";
    MainPage.UserData.pass = "";
  }

  export async function fn_obtener_unidad_usuario_movil() {
    let params = {
      IdUsuario: UserLogged.IdUsuario,
      Token: UserLogged.Token,
      Modificacion: null as string
    };

    return Request.JSONRequest(
      MainPage.SVCUsuariosMovil + "ObtenerUnidadUsuarioMovil",
      "POST",
      params
    ).then(function(result: any) {
      if (
        result.ObtenerUnidadUsuarioMovilResult &&
        result.ObtenerUnidadUsuarioMovilResult.length > 0 &&
        UserLogged.IdUnidad !=
          result.ObtenerUnidadUsuarioMovilResult[0].IdUnidad
      ) {
        UserLogged.IdUnidad =
          result.ObtenerUnidadUsuarioMovilResult[0].IdUnidad;
        UserLogged.NombreUnidad =
          result.ObtenerUnidadUsuarioMovilResult[0].NombreUnidad;

        return DB.setRows(StoreName, [UserLogged]).then(() => {
          return fn_get_user_data();
        });
      } else return result;
    });
  }

  export async function fn_sesion_en_proceso() {
    let params = {
      IdUsuario: UserLogged.IdUsuario,
      Token: UserLogged.Token,
      IdSesion: UserLogged.IdSesion
    };

    return Request.JSONRequest(
      MainPage.SVCUsuariosMovil + "SesionEnProceso",
      "POST",
      params
    );
  }

  export async function fn_cerrar_sesion() {
    let params = {
      IdUsuario: UserLogged.IdUsuario,
      Token: UserLogged.Token,
      IdSesion: UserLogged.IdSesion
    };

    return Request.JSONRequest(
      MainPage.SVCUsuariosMovil + "CerrarSesion",
      "POST",
      params
    );
  }
}
