"use strict";
 
import * as d3 from "d3"; // Import de D3
 
async function API(url) {
    const res = await fetch(url);
    const data = await res.json();
    return data;
}
 
async function fetchMonsters() {
    const monstersData = await fetch("https://www.dnd5eapi.co/api/monsters")
        .then(response => response.json())
        .then(data => data.results);
 
    const monsters = await Promise.all(monstersData.map(async (monster) => {
        const monsterData = await fetch(`https://www.dnd5eapi.co${monster.url}`).then(response => response.json());
        return {
            name: monster.name,
            ac: monsterData.armor_class[0].value,
            cr: monsterData.challenge_rating
        };
    }));
 
    const groupedMonsters = {};
    monsters.forEach(monster => {
        if (!groupedMonsters[monster.ac]) {
            groupedMonsters[monster.ac] = [];
        }
        groupedMonsters[monster.ac].push(monster);
    });
 
    const data = [];
    for (const ac in groupedMonsters) {
        if (Object.hasOwnProperty.call(groupedMonsters, ac)) {
            const monstersWithSameAC = groupedMonsters[ac];
            const averageCR = monstersWithSameAC.reduce((sum, monster) => sum + parseFloat(monster.cr), 0) / monstersWithSameAC.length;
            data.push({ ac: parseFloat(ac), cr: averageCR });
        }
    }
 
    return data.filter(entry => entry.cr <= 30);
}
 
fetchMonsters().then(data => {
    console.log(data); // Afficher les données préparées
    // Maintenant vous pouvez créer le graphique avec ces données
    createGraph(data); // Créer le graphique
});
 
function createGraph(data) {
    // Nettoyer le contenu de #graph avant de créer le nouveau graphique
    d3.select("#graph2").selectAll("*").remove();
 
    // Dimensions de l'élément SVG
    const svgWidth = 650;
    const svgHeight = 400;
    const margin = { top: 30, right: 20, bottom: 50, left: 60 };  // Augmenté pour les labels
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;
 
    const svg = d3.select("#graph2")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.cr)])
        .nice()
        .range([0, width]);
 
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.ac)])
        .nice()
        .range([height, 0]);
 
    const line = d3.line()
        .x(d => xScale(d.cr))
        .y(d => yScale(d.ac));
 
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .attr("class", "x axis")
        .call(d3.axisBottom(xScale));
 
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale));
 
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", line);
 
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.cr))
        .attr("cy", d => yScale(d.ac))
        .attr("r", 5)
        .attr("fill", "red");
 
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .text("Classe d’armure en fonction de la puissance");
 
    // Ajouter le nom de l'axe X
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text("Puissance (CR)");
 
    // Ajouter le nom de l'axe Y
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 15)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .text("Classe d'armure (AC)");
}