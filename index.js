"use strict"

import { json } from "d3-fetch";
import { min, max, sum, extent, mean } from "d3-array";
import { select } from "d3-selection";
import scrollama from "scrollama";

const scrolly = select("#scrolly");
const figure = scrolly.select("figure");
const article = scrolly.select("article");
const step = article.selectAll(".step");

const scroller = scrollama();

const monster_id = "air-elemental";
let monster
monsterInit(monster_id)
function handleStepEnter(response) {
    console.log(response);

    step.classed("is-active", function (d, i) {
        return i === response.index;
    });

    if (response.index < 0 || response.index > 17) { return }
    showMonster(response.index)
}

function init() {
    scroller
        .setup({
            step: "#scrolly .step",
            debug: false
        })
        .onStepEnter(handleStepEnter);
}

init();

async function API(url) {
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

const generateFullSpeedText = (speed) => {
    if (speed.walk) {
        return (`${speed.walk}${speed.climb ? `, climb ${speed.climb}`: ""}${speed.fly ? `, fly ${speed.fly}`: ""}${speed.hover ? ` (hover)`: ""}${speed.swim ? `, swim ${speed.swim}`: ""}`)
    }else if(speed.climb){
        return(`climb ${speed.climb}${speed.fly ? `, fly ${speed.fly}`: ""}${speed.hover ? ` (hover)`: ""}${speed.swim ? `, swim ${speed.swim}`: ""}`)
    }else if(speed.fly){
        return(`fly ${speed.fly}${speed.hover ? ` (hover)`: ""}${speed.swim ? `, swim ${speed.swim}`: ""}`)
    }else if(speed.swim){
        return(`swim ${speed.swim}`)
    }else{
        return ""
    }
}

const fractionize = (CR) => {
    return (CR*2)%1 ? (CR*4)%1 ? "1/8" : "1/4" : "1/2"
}

async function monsterInit(monster_id){
    monster = await API(`https://www.dnd5eapi.co/api/monsters/${monster_id}`);
    console.log(monster)
    showMonster(-1)
}

async function showMonster(statblock_part){
    //for iterative processes
    let firstIter = true
    //some very useful selectors
    const statBlock = document.querySelector("stat-block#monster");
    const heading = statBlock.querySelector("creature-heading");
    const top_part = statBlock.querySelector("top-stats");
    const statList = top_part.querySelector("abilities-block:nth-child(4)").shadowRoot;
    let currentElement
    let profSaveExists = false;
    let profSkillExists = false;
    const profList = monster.proficiencies;
    //dans tous les cas, enlever la classe last-shown aux éléments qui ne sont plus les derniers à avoir été montrés
    document.querySelectorAll(".last-shown").forEach(el => el.classList.remove("last-shown"));
    statList.querySelectorAll(".last-shown").forEach(el => el.classList.remove("last-shown"));
    //mettrre en avant ce qui vient d'apparaître
    switch (statblock_part) {
        case -1:
            //setup

            //thing that could possibly be inexistant

            //remove proficiencies
            top_part.querySelector("property-line:nth-child(5) p").innerHTML = ""
            top_part.querySelector("property-line:nth-child(6) p").innerHTML = ""

            profList.forEach(proficiency => {
                const proficiencyTypeArray = proficiency.proficiency.index.split("-")
                if (proficiencyTypeArray[0] === "saving") {
                    profSaveExists = true
                }else if (proficiencyTypeArray[0] === "skill") {
                    profSkillExists = true
                }
            })
            if (profSaveExists === false){
                top_part.querySelector("property-line:nth-child(5) h4").innerHTML = ""
            }
            if (profSkillExists === false){
                top_part.querySelector("property-line:nth-child(6) h4").innerHTML = ""
            }
            

            //remove resistances and immunities
            if (!monster.damage_resistances.length > 0){
                top_part.querySelector("property-line:nth-child(7) h4").innerHTML = ""
            }
            top_part.querySelector("property-line:nth-child(7) p").innerHTML = ""

            if (!monster.damage_immunities.length > 0){
                top_part.querySelector("property-line:nth-child(8) h4").innerHTML = ""
            }
            top_part.querySelector("property-line:nth-child(8) p").innerHTML = ""

            //remove condition immunities
            if (!monster.condition_immunities.length > 0){
                top_part.querySelector("property-line:nth-child(9) h4").innerHTML = ""
            }
            top_part.querySelector("property-line:nth-child(9) p").innerHTML = ""
            

            //remove property-blocks
            statBlock.querySelectorAll("property-block").forEach(pb => {
                pb.outerHTML = ""
            });

            //remove legendary actions title
            if(!monster.legendary_actions.length > 0){
            statBlock.querySelector("#legendary-actions").outerHTML = ""
            }

            //things that always exist but start empty

            //remove name
            heading.querySelector("h1").innerHTML = ``

            //remove HPs
            top_part.querySelector("property-line:nth-child(2) p").innerHTML = ``

            //remove AC
            top_part.querySelector("property-line:nth-child(1) p").innerHTML = ``

            //remove stats and modifier
            statList.querySelector("#str").innerHTML = ``
            statList.querySelector("#dex").innerHTML = ``
            statList.querySelector("#con").innerHTML = ``
            statList.querySelector("#int").innerHTML = ``
            statList.querySelector("#wis").innerHTML = ``
            statList.querySelector("#cha").innerHTML = ``

            //remove movement speeds
            top_part.querySelector("property-line:nth-child(3) p").innerHTML = ``

            //remove senses
            top_part.querySelector("property-line:nth-child(10) p").innerHTML = ``

            //remove proficiency bonus
            top_part.querySelector("property-line:nth-child(12) p:nth-child(4)").innerHTML = ``

            //remove challenge rating and XP reward
            top_part.querySelector("property-line:nth-child(12) p:nth-child(2)").innerHTML = ``

            //remove size, type and alignment
            heading.querySelector("h2").innerHTML = ``

            //remove languages
            top_part.querySelector("property-line:nth-child(11) p").innerHTML = ``

            break;

        case 0:
            //monster name
            heading.querySelector("h1").innerHTML = `${monster.name}`
            break;
    
        case 1:
            //monster hit points
            currentElement = top_part.querySelector("property-line:nth-child(2) p")
            currentElement.innerHTML = ` ${monster.hit_points} (${monster.hit_points_roll})`
            currentElement.classList.add("last-shown")
            break;

        case 2:
            //monster armor class
            currentElement = top_part.querySelector("property-line:nth-child(1) p")
            currentElement.innerHTML = ` ${monster.armor_class[0].value}${monster.armor_class[0].type != "armor" ? ` (${monster.armor_class[0].type} armor)` : ""}`
            currentElement.classList.add("last-shown")
            break;

        case 3:
            //stats and modifiers
            currentElement = statList.querySelector("#str")
            currentElement.innerHTML = `${monster.strength} (${(monster.strength>=10 ? "+":"")}${(monster.strength-monster.strength%2-10)/2})`
            currentElement.classList.add("last-shown")
            
            currentElement = statList.querySelector("#dex")
            currentElement.innerHTML = `${monster.strength} (${(monster.strength>=10 ? "+":"")}${(monster.strength-monster.strength%2-10)/2})`
            currentElement.classList.add("last-shown")
            
            currentElement = statList.querySelector("#con")
            currentElement.innerHTML = `${monster.strength} (${(monster.strength>=10 ? "+":"")}${(monster.strength-monster.strength%2-10)/2})`
            currentElement.classList.add("last-shown")

            currentElement = statList.querySelector("#int")
            currentElement.innerHTML = `${monster.strength} (${(monster.strength>=10 ? "+":"")}${(monster.strength-monster.strength%2-10)/2})`
            currentElement.classList.add("last-shown")
            
            currentElement = statList.querySelector("#wis")
            currentElement.innerHTML = `${monster.strength} (${(monster.strength>=10 ? "+":"")}${(monster.strength-monster.strength%2-10)/2})`
            currentElement.classList.add("last-shown")

            currentElement = statList.querySelector("#cha")
            currentElement.innerHTML = `${monster.strength} (${(monster.strength>=10 ? "+":"")}${(monster.strength-monster.strength%2-10)/2})`
            currentElement.classList.add("last-shown")
            break;

        case 4:
            //proficiency bonus
            currentElement = top_part.querySelector("property-line:nth-child(12) p:nth-child(4)")
            currentElement.innerHTML = `+${monster.proficiency_bonus}`
            currentElement.classList.add("last-shown")
            break;

        case 5:
            //proficiencies
            top_part.querySelector("property-line:nth-child(5) p").innerHTML = ""
            top_part.querySelector("property-line:nth-child(6) p").innerHTML = ""
            profSaveExists = false
            profSkillExists = false
            profList.forEach(proficiency => {
                const proficiencyTypeArray = proficiency.proficiency.index.split("-")
                const nameArray = proficiency.proficiency.name.split(" ")
                if (proficiencyTypeArray[0] === "saving") {
                    currentElement = top_part.querySelector("property-line:nth-child(5) p")
                    profSaveExists = true
                    if(currentElement.innerHTML === ""){
                        currentElement.innerHTML += `${nameArray[nameArray.length-1]}`
                    }else{
                        currentElement.innerHTML += `, ${nameArray[nameArray.length-1]}`
                    }
                    currentElement.innerHTML += ` ${proficiency.value >= 0 ? `+${proficiency.value}` : `-${proficiency.value}`}`
                    currentElement.classList.add("last-shown")
                }else if (proficiencyTypeArray[0] === "skill") {
                    profSkillExists = true
                    currentElement = top_part.querySelector("property-line:nth-child(6) p")
                    if(currentElement.innerHTML === ""){
                        currentElement.innerHTML += `${nameArray[nameArray.length-1]}`
                    }else{
                        currentElement.innerHTML += `, ${nameArray[nameArray.length-1]}`
                    }
                    currentElement.innerHTML += ` ${proficiency.value >= 0 ? `+${proficiency.value}` : `-${proficiency.value}`}`
                    currentElement.classList.add("last-shown")
                }
            })
            if (profSaveExists === false){
                top_part.querySelector("property-line:nth-child(5) h4").innerHTML = ""
            }
            if (profSkillExists === false){
                top_part.querySelector("property-line:nth-child(6) h4").innerHTML = ""
            }
            break;

        case 6:
            //damage resistances
            if (!monster.damage_resistances.length > 0){
                top_part.querySelector("property-line:nth-child(7) h4").innerHTML = ""
                top_part.querySelector("property-line:nth-child(7) p").innerHTML = ""
            }else{
                firstIter = true
                currentElement = top_part.querySelector("property-line:nth-child(7) p")
                currentElement.innerHTML = ""
                monster.damage_resistances.forEach(resistance => {
                    if (!firstIter) {
                        currentElement.innerHTML += ", "
                    }
                    currentElement.innerHTML += resistance
                    firstIter = false
                })
                currentElement.classList.add("last-shown")
            };
            break;

        case 7:
            //damage immunities
            if (!monster.damage_immunities.length > 0){
                top_part.querySelector("property-line:nth-child(8) h4").innerHTML = ""
                top_part.querySelector("property-line:nth-child(8) p").innerHTML = ""
            }else{
                firstIter = true
                currentElement = top_part.querySelector("property-line:nth-child(8) p")
                currentElement.innerHTML = ""
                monster.damage_immunities.forEach(immunity => {
                    if (!firstIter) {
                        currentElement.innerHTML += ", "
                    }
                    currentElement.innerHTML += immunity
                    firstIter = false
                })
                currentElement.classList.add("last-shown")
            };
            break;

        case 8:
            //senses
            currentElement = top_part.querySelector("property-line:nth-child(10) p")
            currentElement.innerHTML = `${monster.senses.blindsight ? `Blindsight ${monster.senses.blindsight}, ` : ""}${monster.senses.darkvision ? `Darkvision ${monster.senses.darkvision}, ` : ""}${monster.senses.tremorsense ? `Tremorsense ${monster.senses.tremorsense}, ` : ""}${monster.senses.truesight ? `Truesight ${monster.senses.truesight}, ` : ""}Passive Perception ${monster.senses.passive_perception}`
            currentElement.classList.add("last-shown")
            break;

        case 9:
            //monster speed
            currentElement = top_part.querySelector("property-line:nth-child(3) p")
            currentElement.innerHTML = generateFullSpeedText(monster.speed)
            currentElement.classList.add("last-shown")
            break;

        case 10:
            //insert actions before the end of the monster stat block
            statBlock.querySelectorAll("#actions ~ property-block:not(#legendary-actions ~ property-block)").forEach(pb => {
                pb.outerHTML = ""
            });
            for (let i = 0; i < monster.actions.length; i++) {
                let html = ""
                if (monster.actions[i].spellcasting) {
                    html = `
                    <property-block class="last-shown">
                        <h4>${monster.actions[i].name}</h4>
                        <p class="spellcasting">${monster.actions[i].desc}</p>
                    </property-block>`
                }else if (monster.actions[i].usage){
                    if (monster.actions[i].usage.type === "per day") {
                        html = `
                        <property-block class="last-shown">
                            <h4>${monster.actions[i].name} (${monster.actions[i].usage.times}/Day)</h4>
                        <p>${monster.actions[i].desc}</p>
                        </property-block>`
                    }else if (monster.actions[i].usage.type === "recharge on roll"){
                        html = `
                        <property-block class="last-shown">
                            <h4>${monster.actions[i].name} (Recharge ${monster.actions[i].usage.min_value}-6)</h4>
                            <p>${monster.actions[i].desc.replace(/(^|)(\n.+ Breath)(|$)/ig, '\n\n</p><h4>$2</h4><p>')}</p>
                        </property-block>`
                    }
                }else{
                    html = `
                    <property-block class="last-shown">
                        <h4>${monster.actions[i].name}</h4>
                        <p>${monster.actions[i].desc}</p>
                    </property-block>`
                }
                statBlock.querySelector("#actions").insertAdjacentHTML("afterend", html)
            }
            break;

        case 11:
            //insert special abilities under the top part of the monster's stat block
            statBlock.querySelectorAll("property-block:not(#actions ~ property-block):not(#legendary-actions ~ property-block)").forEach(pb => {
                pb.outerHTML = ""
            });
            for (let i = monster.special_abilities.length-1; i >= 0; i--) {
                
                
                let html = ""
                if (monster.special_abilities[i].spellcasting) {
                    html = `
                    <property-block class="last-shown">
                        <h4>${monster.special_abilities[i].name}</h4>
                        <p class="spellcasting">${monster.special_abilities[i].desc}</p>
                    </property-block>`
                }else if (monster.special_abilities[i].usage){
                    html = `
                    <property-block class="last-shown">
                        <h4>${monster.special_abilities[i].name} (${monster.special_abilities[i].usage.times}/Day)</h4>
                        <p>${monster.special_abilities[i].desc}</p>
                    </property-block>`
                }else{
                    html = `
                    <property-block class="last-shown">
                        <h4>${monster.special_abilities[i].name}</h4>
                        <p>${monster.special_abilities[i].desc}</p>
                    </property-block>`
                }
                top_part.insertAdjacentHTML("afterend", html)
                
            }
            break;

        case 12:
            //insert legendary actions before the end of the monster's stat block (if they exist)
            statBlock.querySelectorAll("#legendary-actions ~ property-block").forEach(pb => {
                pb.outerHTML = ""
            });
            statBlock.querySelectorAll("#legendary-actions ~ p").forEach(p => {
                p.outerHTML = ""
            })
            if(monster.legendary_actions.length > 0){
                statBlock.insertAdjacentHTML("beforeend", `<p id="legendary-actions">The ${monster.type} can take ${monster.name === ("Tiamat" | "Bahamut") ? 5 : 3} legendary actions, choosing from the options below. Only one legendary action can be used at a time and only at the end of another creature's turn. The ${monster.type} regains spent legendary actions at the start of its turn.</p>`)
                for (let i = 0; i < monster.legendary_actions.length; i++) {
                    let html = ""
                    if (monster.legendary_actions[i].spellcasting) {
                        html = `
                        <property-block class="last-shown">
                            <h4>${monster.legendary_actions[i].name}</h4>
                            <p class="spellcasting">${monster.legendary_actions[i].desc}</p>
                        </property-block>`
                    }else if (monster.legendary_actions[i].usage){
                        if (monster.legendary_actions[i].usage.type === "per day") {
                            html = `
                            <property-block class="last-shown">
                                <h4>${monster.legendary_actions[i].name} (${monster.legendary_actions[i].usage.times}/Day)</h4>
                                <p>${monster.legendary_actions[i].desc}</p>
                            </property-block>`
                        }else if (monster.legendary_actions[i].usage.type === "recharge on roll"){
                            html = `
                            <property-block class="last-shown">
                                <h4>${monster.legendary_actions[i].name} (Recharge ${monster.legendary_actions[i].usage.min_value}-8)</h4>
                                <p>${monster.legendary_actions[i].desc}</p>
                            </property-block>`
                        }
                    }else{
                        html = `
                        <property-block class="last-shown">
                            <h4>${monster.legendary_actions[i].name}</h4>
                            <p>${monster.legendary_actions[i].desc}</p>
                        </property-block>`
                    }
                    statBlock.insertAdjacentHTML("beforeend", html)
                }
            }
            break;

        case 13:    
            //condition immunities
            if (!monster.condition_immunities.length > 0){
                top_part.querySelector("property-line:nth-child(9) h4").innerHTML = ""
                top_part.querySelector("property-line:nth-child(9) p").innerHTML = ""
            }else{
                firstIter = true
                currentElement = top_part.querySelector("property-line:nth-child(9) p")
                currentElement.innerHTML = ""
                monster.condition_immunities.forEach(immunity => {
                    if (!firstIter) {
                        currentElement.innerHTML += ", "
                    }
                    currentElement.innerHTML += immunity.name
                    firstIter = false
                })
                currentElement.classList.add("last-shown")
            }
            break;

        case 14:
            //monster size, type and alignment
            currentElement = heading.querySelector("h2")
            currentElement.innerHTML = `${monster.size} ${monster.type}, ${monster.alignment}`
            currentElement.classList.add("last-shown")
            break;

        case 15:
            //languages
            currentElement = top_part.querySelector("property-line:nth-child(11) p")
            currentElement.innerHTML = `${monster.languages ? monster.languages : "—"}`
            currentElement.classList.add("last-shown")
            break;

        case 16:
            //challenge rating and xp rewards
            currentElement = top_part.querySelector("property-line:nth-child(12) p:nth-child(2)")
            currentElement.innerHTML = `${monster.challenge_rating % 1 ? fractionize(monster.challenge_rating) : monster.challenge_rating} (${monster.xp} XP)`
            currentElement.classList.add("last-shown")
            break;
    
        default:
            break;
    }
}


