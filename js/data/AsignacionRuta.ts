import { DB } from "./DB";
import { Usuario } from "./Usuario";
import { Request } from "./Request";
import { MainPage } from "../MainPage";
import { Entidades } from "../general/Entidades";

export namespace AsignacionRuta {

    export var RutaAsignada: Entidades.IAsignacionRuta;
    export var StoreName = "AsignacionRuta";
    export var Key = "IdAsignacion";
    export var ColumnName: string[] = [
        "IdAsignacion",
        "IdEmpresa",
        "IdUnidad",
        "IdRuta",
        "HoraInicio",
        "HoraFinal",
        "Estado",
        "FechaAsignacion",
        "NumeroOrden",
        "Salida",
        "Regreso",
        "Modificacion",
        "EnUso"
    ];

    export async function fn_obtener_asignacionRuta() {
        return fn_get_asignacion_ruta().then(res => {
            if (res) {
                RutaAsignada = res;
                return res;
            } else {
                let params = {
                    IdUsuario: Usuario.UserLogged.IdUsuario,
                    Token: Usuario.UserLogged.Token,
                    IdEmpresa: Usuario.UserLogged.IdEmpresa,
                    IdUnidad: Usuario.UserLogged.IdUnidad
                };
                // Modificacion: maxDate

                return Request.JSONRequest(MainPage.SVCAsignaciones + "ObtenerAsignacionRuta", 'POST', params).then((result: any) => {
                    if (result.ObtenerAsignacionRutaResult && result.ObtenerAsignacionRutaResult.IdAsignacion > 0 && result.ObtenerAsignacionRutaResult.Regreso == null) {
                        let _rutaAsignada = result.ObtenerAsignacionRutaResult;

                        DB.setRows(StoreName, [_rutaAsignada]);//ADD BD

                        RutaAsignada = _rutaAsignada;
                    }

                    return RutaAsignada;
                });
            }
        });
    }

    export async function fn_marcar_salida(idAsignacion: number) {
        let params = {
            IdUsuario: Usuario.UserLogged.IdUsuario,
            Token: Usuario.UserLogged.Token,
            IdEmpresa: Usuario.UserLogged.IdEmpresa,
            IdAsignacion: idAsignacion,
            Proceso: true,
            Modificacion: null as string
        };

        return Request.JSONRequest(MainPage.SVCAsignaciones + "MarcarSalidaRegreso", 'POST', params);
    }

    export async function fn_marcar_regreso(idAsignacion: number) {
        let params = {
            IdUsuario: Usuario.UserLogged.IdUsuario,
            Token: Usuario.UserLogged.Token,
            IdEmpresa: Usuario.UserLogged.IdEmpresa,
            IdAsignacion: idAsignacion,
            Proceso: false,
            Modificacion: null as string
        };

        return Request.JSONRequest(MainPage.SVCAsignaciones + "MarcarSalidaRegreso", 'POST', params);
    }

    export async function fn_marcar_llegada_salida(idAsignacion: number, idPuntoRuta: number, isLlegada: boolean) {
        let params = {
            IdUsuario: Usuario.UserLogged.IdUsuario,
            Token: Usuario.UserLogged.Token,
            IdAsignacion: idAsignacion,
            Proceso: isLlegada,
            IdPuntoRuta: idPuntoRuta

        };

        return Request.JSONRequest(MainPage.SVCAsignaciones + "MarcarLlegadaSalida", 'POST', params);
    }

    export async function fn_obtener_asignacion_cumplimiento(idAsignacion: number) {
        let params = {
            IdUsuario: Usuario.UserLogged.IdUsuario,
            Token: Usuario.UserLogged.Token,
            IdAsignacion: idAsignacion,
            Modificacion: null as string
        };

        return Request.JSONRequest(MainPage.SVCAsignaciones + "ObtenerAsignacionCumplimiento", 'POST', params);
    }



    //For StoreObject: AsignacionRuta
    export async function fn_count_clv(clv: any) {
        return DB.countRows(StoreName, clv);
    }

    export async function fn_get_asignacion_ruta() {
        return DB.getRows(StoreName).then((res: any) => {
            let _rutaAsignada;
            if (res && res.length > 0)
                _rutaAsignada = res[0];

            return _rutaAsignada;
        });
    }

    export async function fn_remove_asignacion_ruta() {
        return DB.clearObjectStore(StoreName).then(res => {
            RutaAsignada = null;
        });
    }

    export async function fn_set_asignacion_ruta(asignacion: Entidades.IAsignacionRuta) {
        return DB.setRows(StoreName, [asignacion]);
    }

}