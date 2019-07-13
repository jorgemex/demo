// import * as d3 from "d3";
// import { Entidades } from "../general/Entidades";

// export namespace datos {
//   export var dicActual: any;
//   var fechaMax: any;
//   let inter: any;

//   export async function iniciactual() {
//     inter = setInterval(cuenta, 1000);
//     dicActual = new Map();
//   }

//   async function cuenta() {
//     window.clearInterval(inter);
//     if (fechaMax == null) {
//       d3.json("/actual.json")
//         .then(actual)
//         .catch(function() {
//           console.log("error en el servidor");
//         });
//       fechaMax = new Date();
//       inter = setInterval(cuenta, 1000);
//     }
//   }

// //   export function actual(data: any) {
// //     for (let index = 0; index < data.length; index++) {
// //       let actual: Entidades.actual = new Object() as Entidades.actual;
// //       actual.IntIDestacion = data[index]["IntIDestacion"];
// //       actual.Vchnombre = data[index]["Vchnombre"];
// //       dicActual.set(actual.Vchnombre + "", actual);
// //     }
// //   }
// }
