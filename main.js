
console.log("Flowchart Generator Started");
async function start() {
    const engine = await import("flowchart-gen/engine/link.js")
    const lang = await document.getElementById("language-select").value;
    const code = await document.getElementById("code-input").value;
    console.log("Selected Language:", lang);
    console.log("Code:", code);
    engine.flowchartEngine()
}

const genBtn = document.getElementById("generate-button");
genBtn.addEventListener("click", (e)=>{
    start();
});