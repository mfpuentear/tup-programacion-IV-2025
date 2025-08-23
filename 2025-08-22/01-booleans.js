// Variable boolean (true o false)

// Contexto booleano se da en if, for, while y operadores &&, || y !.

// Habran ciertos valores que pueden considerarse como "falsos" (falsy).
// Los que se comportan como "verdadero" (truthy).

// Falsy: false, null, undefined, 0, -0, "", NaN
// Truthy (ejemplos): true, 1, -25, "a", [], {}, etc

if (false || null || undefined || 0 || -0 || "" || NaN) {
  console.log("Nunca deberia mostrarse este mensaje");
} else {
  console.log("Valores falsy");
}

if (true && 1 && -25 && "b" && [] && {}) {
  console.log("Valores truthy");
}

// Operador OR (||): "Busca" de izquierda a derecha el primer valor que se comporte como
// verdadero. Si no lo encuentra devuelve el último. Útil para valores por defecto.

const variable = null || undefined || 0;
console.log(variable);

const numero = null;
console.log(numero || 10);

// Muestra el último valor ya que todos son "falsos"
console.log(0 || undefined || null || "");

// Operador AND (&&): "Busca" de izquierda a derecha el primer valor que se comporte como
// falso. Si no lo encuentra devuelve el último. Útil para ejecuciones condicionales.

const var2 = 25 && "a" && 0 && "mensaje" && null;
console.log(var2);

// Muestra el último valor ya que todos son "verdaderos"
console.log("c" && 25 && -1 && []);

const func1 = () => {
  console.log("en func1");
  return 1;
};

const func2 = () => {
  console.log("en func2");
  return null;
};

const func3 = () => {
  console.log("en func3");
  return "texto";
};

console.log(func1() && func2() && func3());
