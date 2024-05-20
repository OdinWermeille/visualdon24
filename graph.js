"use strict";
 
import * as d3 from "d3"; // Import de D3
 
async function API(url) {
    const res = await fetch(url);
    const data = await res.json();
    return data;
}
 
const initialMonsterId = "air-elemental";
monsterInit(initialMonsterId);
 
async function monsterInit(monsterId) {
    try {
        const monster = await API(`https://www.dnd5eapi.co/api/monsters/${monsterId}`);
        const damageData = prepareDamageData(monster);
        const statsData = prepareStatsData(monster);
 
        createBarChart(damageData);
        createLineChart(statsData);
    } catch (error) {
        console.error("Une erreur est survenue lors de la récupération des données du monstre:", error);
    }
}
 
function prepareDamageData(monster) {
    const resistances = monster.damage_resistances.length > 0 ? monster.damage_resistances.length : 0;
    const immunities = monster.damage_immunities.length > 0 ? monster.damage_immunities.length : 0;
    const vulnerabilities = monster.damage_vulnerabilities.length > 0 ? monster.damage_vulnerabilities.length : 0;
   
    return [
        { type: "Résistance", level: resistances },
        { type: "Immunité", level: immunities },
        { type: "Vulnérabilité", level: vulnerabilities }
    ];
}
 
function prepareStatsData(monster) {
    return [
        { stat: "Armor Class", value: monster.armor_class[0].value },
        { stat: "Challenge Rating", value: monster.challenge_rating }
    ];
}
 
function createBarChart(data) {
    const svgWidth = 600;
    const svgHeight = 400;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;
 
    d3.select("#graph").selectAll("*").remove();
 
    const svg = d3.select("#graph")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.type))
        .range([0, width])
        .padding(0.1);
 
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.level)])
        .nice()
        .range([height, 0]);
 
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.type))
        .attr("width", xScale.bandwidth())
        .attr("y", d => yScale(d.level))
        .attr("height", d => height - yScale(d.level))
        .attr("fill", d => {
            switch (d.type) {
                case "Résistance":
                    return "yellow";
                case "Immunité":
                    return "red";
                case "Vulnérabilité":
                    return "red";
                default:
                    return "black";
            }
        });
 
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));
 
    svg.append("g")
        .call(d3.axisLeft(yScale));
 
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .text("Dommages du monstre");
}