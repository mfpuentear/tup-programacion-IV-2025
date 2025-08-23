import { PI, suma, obj as objeto } from "./aritmetica.js";
import masGrande from "./predeterminado.js";
import obtenerContador, { incrementar, decrementar } from "./mixto.js";

console.log("Hola mundo");

console.log("suma:", suma(3, 8));
console.log("pi:", PI);
console.log("obj:", objeto);

console.log("mayor:", masGrande(6, 8));

console.log("contador:", obtenerContador());
incrementar();
incrementar();
incrementar();
decrementar();
console.log("contador:", obtenerContador());
