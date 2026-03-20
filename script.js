const contenedores = [
    { id: 1, x: 60, y: 60 },
    { id: 2, x: 200, y: 120 },
    { id: 3, x: 320, y: 260 },
    { id: 4, x: 120, y: 320 },
    { id: 5, x: 380, y: 90 }
];

const map = document.getElementById("map");

// Crear contenedores en el mapa
contenedores.forEach(c => {
    const div = document.createElement("div");
    div.className = "container-dot";
    div.style.left = c.x + "px";
    div.style.top = c.y + "px";
    div.id = "c" + c.id;
    div.innerHTML = "0%";

    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.innerText = "0%";
    div.appendChild(tooltip);

    div.onmouseover = () => tooltip.style.display = "block";
    div.onmouseout = () => tooltip.style.display = "none";

    map.appendChild(div);
});

// COLOR SEGÚN VALOR
function getColorClass(valor){
    if(valor < 50) return "green";
    if(valor <= 70) return "yellow";
    return "red";
}

// FUNCIÓN PRINCIPAL
function simular(){

    let seleccionados = [];

    contenedores.forEach(c => {

        let valor = Math.floor(Math.random() * 101);
        c.valor = valor;

        let div = document.getElementById("c" + c.id);

        div.className = "container-dot " + getColorClass(valor);
        div.innerHTML = valor + "%";
        div.children[0].innerText = valor + "%";

        if(valor > 70){
            seleccionados.push(c);
        }
    });

    // garantizar mínimo 2
    while(seleccionados.length < 2){
        let random = contenedores[Math.floor(Math.random() * 5)];
        random.valor = 80;

        let div = document.getElementById("c" + random.id);
        div.className = "container-dot red";

        if(!seleccionados.includes(random)){
            seleccionados.push(random);
        }
    }

    // RESULTADOS
    document.getElementById("resultado").innerText = seleccionados.length;
    document.getElementById("lista").innerText =
        seleccionados.map(c => c.id).join(", ");

    let eficiencia = 100 - ((seleccionados.length / 5) * 100);
    document.getElementById("eficiencia").innerText =
        eficiencia.toFixed(0) + "%";

    dibujarRuta(seleccionados);
}

// DIBUJAR RUTA
function dibujarRuta(lista){

    const svg = document.getElementById("lines");
    svg.innerHTML = "";

    for(let i = 0; i < lista.length - 1; i++){

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

        line.setAttribute("x1", lista[i].x + 25);
        line.setAttribute("y1", lista[i].y + 25);
        line.setAttribute("x2", lista[i+1].x + 25);
        line.setAttribute("y2", lista[i+1].y + 25);

        line.setAttribute("stroke", "#1e88e5");
        line.setAttribute("stroke-width", "3");

        svg.appendChild(line);
    }
}