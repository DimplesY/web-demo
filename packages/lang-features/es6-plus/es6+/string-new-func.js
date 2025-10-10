console.log(String.fromCharCode(0x20bb7));

console.log(String.raw`Hi\n`);
console.log("Hi \n");

let s = "Hello World";

console.log(s.startsWith("Hello"));
console.log(s.endsWith("!"));
console.log(s.includes("o"));

console.log("x".padStart(5, "ab"));
console.log("x".padEnd(5, "ab"));

const strim = "    abc    ";
console.log(strim.trim());
console.log(strim.trimStart());
console.log(strim.trimEnd());

console.log("abbc".replaceAll("b", "$&"));

console.log("abcdes".at(1))
