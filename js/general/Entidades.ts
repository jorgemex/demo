export namespace Entidades {
    export const CMenu: number = 1;
    export const CSeperador: number = 2;
    export const CLink: number = 3;
    export const CAccion: number = 4;

    export interface ISubMenu{
        prop_ID: number,
        prop_Path: string,
        prop_Nombre: string,
        prop_Tipo: number,
        prop_Url: string,
        Image: string

    }
    export interface IMenu {
        ID: number,
        Title: string,
        Image: string,
        TextColor: string
    }

    export interface IRutaPunto {
        IdPunto: number,
        Orden: number,
        IdSitio: number,
        NombreSitio: string,
        Latitud: number,
        Longitud: number,
        Radio: number,
        TipoArea: number,
        Poligono: string,
        Modificacion: string,
        EnUso: boolean,
        FechaSalida: string,
        FechaLlegada: string
    }

    export interface IUsusario {
        IdUsuario: number;
        NombreUsuario: string;
        IdEmpresa: number;
        IdUnidad: number;
        NombreUnidad: string;
        Token: string;
        IdSesion: number;
    }

    export interface IAsignacionCumplimiento {
        IdRegistro: number;
        IdAsignacionViaje: number;
        IdPuntoRuta: number;
        Llegada: string;
        Salida: string;
        EnUso: boolean;
        Modificacion: string;
        Orden: number;
        FechaSalida: string;
    }

    export interface IAsignacionRuta {
        IdAsignacion: number,
        IdEmpresa: number,
        IdUnidad: number,
        IdRuta: number,
        HoraInicio: string,
        HoraFinal: string,
        Estado: string,
        FechaAsignacion: string,
        NumeroOrden: string,
        Salida: string,
        Regreso: string,
        Modificacion: string,
        EnUso: boolean
    }


}