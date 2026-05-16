const fs = require("fs");
const path = require("path");
const out = path.join(__dirname, "..", "src", "assets", "js", "discount-modal.js");
const src = path.join(__dirname, "discount-modal.fragment.txt");
fs.writeFileSync(out, fs.readFileSync(src, "utf8"));
console.log("Wrote", out);
