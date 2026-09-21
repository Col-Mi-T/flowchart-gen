import init, { create_chart } from "./pkg/engine.js";

export async function flowchartEngine() {
    console.log("Initializing Flowchart WASM module...");

    await init();

    const code = "import time\nprint('Hello, World!')\nname = input('What is your name?')\nprint('Hello, ' + name)\nname = range(1, 10)\nprint('Random number:', name)\ntime.sleep(2)\nprint('Goodbye!')\nsleep(2)\nif name == 'Alice':\n\tprint('Hello, Alice!')\nelse:\n\tprint('Hello, stranger!')\nfor i in range(5):\n\tprint(i)\nwhile name != 'exit':\n\tname = input('Type \"exit\" to quit:')\n\tprint('You typed:', name)\ndef greet(name):\n\treturn 'Hello, ' + name\nresult = greet('Bob')\nprint(result)\nclass Person:\n\tdef __init__(self, name):\n\t\tself.name = name\n\tdef say_hello(self):\n\t\treturn 'Hello, ' + self.name\nperson = Person('Charlie')\nprint(person.say_hello())";
    console.log(code);
    const chart = create_chart(code,"python")
    


    console.log(chart,"Layout");

    chart.forEach(element => {
        const id = element.id
        const nodeType = element.node_type
        const code = element.code
        const lineno = element.lineno
        const scopeId = element.scope_id
        console.log(id, nodeType, code, lineno, scopeId);
    });



    const svg = document.getElementById("flowchart-output")


    const group = document.createElementNS("http://www.w3.org/2000/svg", "g")
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker")
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
    const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line")
    const line3 = document.createElementNS("http://www.w3.org/2000/svg", "line")

    marker.setAttribute("id", "arrow")
    marker.setAttribute("markerWidth", "10")
    marker.setAttribute("markerHeight", "10")
    marker.setAttribute("refX", "8")
    marker.setAttribute("refY", "3")
    marker.setAttribute("orient", "auto")

    path.setAttribute("d", "M0,0 L0,6 L9,3 Z")

    marker.appendChild(path)
    defs.appendChild(marker)
    svg.appendChild(defs)

    rect.setAttribute("x", 100) //x coordinate, increases to the right
    rect.setAttribute("y", 100) //y coordinate, increases downward
    rect.setAttribute("width", 200)
    rect.setAttribute("height", 60)
    rect.setAttribute("rx", 5) // corner radius in x direction
    rect.setAttribute("stroke", "black")
    rect.setAttribute("stroke-width", 5)
    rect.setAttribute("fill", "white")
    //rect.setAttribute("ry", 50) // corner radius in y direction

    line.setAttribute("x1", 120) //top of the line x
    line.setAttribute("y1", 102) // top of the line y
    line.setAttribute("x2", 120) //bottom of the line x
    line.setAttribute("y2", 158) //bottom of the line y
    line.setAttribute("stroke", "blue")
    line.setAttribute("stroke-width", 2)

    line2.setAttribute("x1", 280) //top of the line x
    line2.setAttribute("y1", 102) // top of the line y
    line2.setAttribute("x2", 280) //bottom of the line x
    line2.setAttribute("y2", 158) //bottom of the line y
    line2.setAttribute("stroke", "blue")
    line2.setAttribute("stroke-width", 2)

    line3.setAttribute("x1", 200) //top of the line x
    line3.setAttribute("y1", 160) // top of the line y
    line3.setAttribute("x2", 200) //bottom of the line x
    line3.setAttribute("y2", 200) //bottom of the line y
    line3.setAttribute("stroke", "blue")
    line3.setAttribute("stroke-width", 2)
    line3.setAttribute("marker-end", "url(#arrow)")


    group.appendChild(rect)
    group.appendChild(line)
    group.appendChild(line2)
    group.appendChild(line3)

    //group.setAttribute("transform", "translate(300,200)")
    // group.setAttribute("transform", "translate(300,200)")
    svg.appendChild(group)

    //  FIX: Get the bounding size of all rendered elements inside the SVG
    const bbox = group.getBBox();

    //  FIX: Add padding so your shapes don't touch the canvas borders
    const padding = 20;

    //  FIX: Update the viewBox and dimensions dynamically based on content size
    svg.setAttribute("viewBox", `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + (padding * 2)} ${bbox.height + (padding * 2)}`);
    svg.setAttribute("width", bbox.width + (padding * 2));
    svg.setAttribute("height", bbox.height + (padding * 2));


}