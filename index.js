"use strict"

import { json } from "d3-fetch";
import { min, max, sum, extent, mean } from "d3-array";

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


async function showMonster(monster_id){
    //for iterative processes
    let firstIter = true
    //some very useful selectors
    const statBlock = document.querySelector("stat-block");
    const monster = await API(`https://www.dnd5eapi.co/api/monsters/${monster_id}`);
    const heading = statBlock.querySelector("creature-heading");
    const top = statBlock.querySelector("top-stats");
    //monster name
    heading.querySelector("h1").innerHTML = `${monster.name}`
    //monster size, type and alignment
    heading.querySelector("h2").innerHTML = `${monster.size} ${monster.type}, ${monster.alignment}`
    //monster armor class
    top.querySelector("property-line:nth-child(1) p").innerHTML = ` ${monster.armor_class[0].value}${monster.armor_class[0].type != "armor" ? ` (${monster.armor_class[0].type} armor)` : ""}`
    //monster hit points
    top.querySelector("property-line:nth-child(2) p").innerHTML = ` ${monster.hit_points} (${monster.hit_points_roll})`
    //monster speed
    top.querySelector("property-line:nth-child(3) p").innerHTML = generateFullSpeedText(monster.speed)
    //stats and modifiers
    const statList = top.querySelector("abilities-block:nth-child(4)").shadowRoot
    statList.querySelector("#str").innerHTML = `${monster.strength} (${(monster.strength>=10 ? "+":"")}${(monster.strength-monster.strength%2-10)/2})`
    statList.querySelector("#dex").innerHTML = `${monster.dexterity} (${(monster.dexterity>=10 ? "+":"")}${(monster.dexterity-monster.dexterity%2-10)/2})`
    statList.querySelector("#con").innerHTML = `${monster.constitution} (${(monster.constitution>=10 ? "+":"")}${(monster.constitution-monster.constitution%2-10)/2})`
    statList.querySelector("#int").innerHTML = `${monster.intelligence} (${(monster.intelligence>=10 ? "+":"")}${(monster.intelligence-monster.intelligence%2-10)/2})`
    statList.querySelector("#wis").innerHTML = `${monster.wisdom} (${(monster.wisdom>=10 ? "+":"")}${(monster.wisdom-monster.wisdom%2-10)/2})`
    statList.querySelector("#cha").innerHTML = `${monster.charisma} (${(monster.charisma>=10 ? "+":"")}${(monster.charisma-monster.charisma%2-10)/2})`
    //proficiencies
    const profList = monster.proficiencies
    let profSaveExists = false
    let profSkillExists = false
    profList.forEach(proficiency => {
        const proficiencyTypeArray = proficiency.proficiency.index.split("-")
        const nameArray = proficiency.proficiency.name.split(" ")
        if (proficiencyTypeArray[0] === "saving") {
            profSaveExists = true
            if(top.querySelector("property-line:nth-child(5) p").innerHTML === ""){
                top.querySelector("property-line:nth-child(5) p").innerHTML += `${nameArray[nameArray.length-1]}`
            }else{
                top.querySelector("property-line:nth-child(5) p").innerHTML += `, ${nameArray[nameArray.length-1]}`
            }
            top.querySelector("property-line:nth-child(5) p").innerHTML += ` ${proficiency.value >= 0 ? `+${proficiency.value}` : `-${proficiency.value}`}`
        }else if (proficiencyTypeArray[0] === "skill") {
            profSkillExists = true
            if(top.querySelector("property-line:nth-child(6) p").innerHTML === ""){
                top.querySelector("property-line:nth-child(6) p").innerHTML += `${nameArray[nameArray.length-1]}`
            }else{
                top.querySelector("property-line:nth-child(6) p").innerHTML += `, ${nameArray[nameArray.length-1]}`
            }
            top.querySelector("property-line:nth-child(6) p").innerHTML += ` ${proficiency.value >= 0 ? `+${proficiency.value}` : `-${proficiency.value}`}`
        }
    })
    if (profSaveExists === false){
        top.querySelector("property-line:nth-child(5) h4").innerHTML = ""
    }
    if (profSkillExists === false){
        top.querySelector("property-line:nth-child(6) h4").innerHTML = ""
    }
    
    //damage resistances
    if (!monster.damage_resistances.length > 0){
        top.querySelector("property-line:nth-child(7) h4").innerHTML = ""
        top.querySelector("property-line:nth-child(7) p").innerHTML = ""
    }else{
        firstIter = true
        top.querySelector("property-line:nth-child(7) p").innerHTML = ""
        monster.damage_resistances.forEach(resistance => {
            if (!firstIter) {
                top.querySelector("property-line:nth-child(7) p").innerHTML += ", "
            }
            top.querySelector("property-line:nth-child(7) p").innerHTML += resistance
            firstIter = false
        })
    };
    //damage immunities
    if (!monster.damage_immunities.length > 0){
        top.querySelector("property-line:nth-child(8) h4").innerHTML = ""
        top.querySelector("property-line:nth-child(8) p").innerHTML = ""
    }else{
        firstIter = true
        top.querySelector("property-line:nth-child(8) p").innerHTML = ""
        monster.damage_immunities.forEach(immunity => {
            if (!firstIter) {
                top.querySelector("property-line:nth-child(8) p").innerHTML += ", "
            }
            top.querySelector("property-line:nth-child(8) p").innerHTML += immunity
            firstIter = false
        })
    };
    //condition immunities
    if (!monster.condition_immunities.length > 0){
        top.querySelector("property-line:nth-child(9) h4").innerHTML = ""
        top.querySelector("property-line:nth-child(9) p").innerHTML = ""
    }else{
        firstIter = true
        top.querySelector("property-line:nth-child(9) p").innerHTML = ""
        monster.condition_immunities.forEach(immunity => {
            if (!firstIter) {
                top.querySelector("property-line:nth-child(9) p").innerHTML += ", "
            }
            top.querySelector("property-line:nth-child(9) p").innerHTML += immunity.name
            firstIter = false
        })
    };
    //senses
    top.querySelector("property-line:nth-child(10) p").innerHTML = `${monster.senses.blindsight ? `Blindsight ${monster.senses.blindsight}, ` : ""}${monster.senses.darkvision ? `Darkvision ${monster.senses.darkvision}, ` : ""}${monster.senses.tremorsense ? `Tremorsense ${monster.senses.tremorsense}, ` : ""}${monster.senses.truesight ? `Truesight ${monster.senses.truesight}, ` : ""}Passive Perception ${monster.senses.passive_perception}`
    //languages
    top.querySelector("property-line:nth-child(11) p").innerHTML = `${monster.languages}`
    //challenge rating and xp
    top.querySelector("property-line:nth-child(12) p:nth-child(2)").innerHTML = `${monster.challenge_rating % 1 ? fractionize(monster.challenge_rating) : monster.challenge_rating} (${monster.xp} XP)`
    //proficiency bonus
    top.querySelector("property-line:nth-child(12) p:nth-child(4)").innerHTML = `+${monster.proficiency_bonus}`
    //remove property-blocks
    statBlock.querySelectorAll("property-block").forEach(pb => {
        pb.outerHTML = ""
    });
    //insert special abilities under the top part of the monster's stat block
    for (let i = monster.special_abilities.length-1; i >= 0; i--) {
        let html = ""
        if (monster.special_abilities[i].spellcasting) {
            html = `
            <property-block>
                <h4>${monster.special_abilities[i].name}</h4>
                <p class="spellcasting">${monster.special_abilities[i].desc}</p>
            </property-block>`
        }else if (monster.special_abilities[i].usage){
            html = `
            <property-block>
                <h4>${monster.special_abilities[i].name} (${monster.special_abilities[i].usage.times}/Day)</h4>
                <p>${monster.special_abilities[i].desc}</p>
            </property-block>`
        }else{
            html = `
            <property-block>
                <h4>${monster.special_abilities[i].name}</h4>
                <p>${monster.special_abilities[i].desc}</p>
            </property-block>`
        }
        top.insertAdjacentHTML("afterend", html)
    }
    //insert actions before the end of the monster stat block
    for (let i = 0; i < monster.actions.length; i++) {
        let html = ""
        if (monster.actions[i].spellcasting) {
            html = `
            <property-block>
                <h4>${monster.actions[i].name}</h4>
                <p class="spellcasting">${monster.actions[i].desc}</p>
            </property-block>`
        }else if (monster.actions[i].usage){
            if (monster.actions[i].usage.type === "per day") {
                html = `
                <property-block>
                    <h4>${monster.actions[i].name} (${monster.actions[i].usage.times}/Day)</h4>
                    <p>${monster.actions[i].desc}</p>
                </property-block>`
            }else if (monster.actions[i].usage.type === "recharge on roll"){
                html = `
                <property-block>
                    <h4>${monster.actions[i].name} (Recharge ${monster.actions[i].usage.min_value}-8)</h4>
                    <p>${monster.actions[i].desc.replace(/(^|)(\n.+ Breath)(|$)/ig, '\n\n</p><h4>$2</h4><p>')}</p>
                </property-block>`
            }
        }else{
            html = `
            <property-block>
                <h4>${monster.actions[i].name}</h4>
                <p>${monster.actions[i].desc}</p>
            </property-block>`
        }
        statBlock.insertAdjacentHTML("beforeend", html)
    }

    //insert legendary actions before the end of the monster's stat block (if they exist)
    if(monster.legendary_actions.length > 0){
        statBlock.insertAdjacentHTML("beforeend", `<h3 id="legendary-actions">Legendary Actions</h3>`)
        statBlock.insertAdjacentHTML("beforeend", `<p id="legendary-actions">The ${monster.type} can take ${monster.name === ("Tiamat" | "Bahamut") ? 5 : 3} legendary actions, choosing from the options below. Only one legendary action can be used at a time and only at the end of another creature's turn. The ${monster.type} regains spent legendary actions at the start of its turn.</p>`)
        for (let i = 0; i < monster.legendary_actions.length; i++) {
            let html = ""
            if (monster.legendary_actions[i].spellcasting) {
                html = `
                <property-block>
                    <h4>${monster.legendary_actions[i].name}</h4>
                    <p class="spellcasting">${monster.legendary_actions[i].desc}</p>
                </property-block>`
            }else if (monster.legendary_actions[i].usage){
                if (monster.legendary_actions[i].usage.type === "per day") {
                    html = `
                    <property-block>
                        <h4>${monster.legendary_actions[i].name} (${monster.legendary_actions[i].usage.times}/Day)</h4>
                        <p>${monster.legendary_actions[i].desc}</p>
                    </property-block>`
                }else if (monster.legendary_actions[i].usage.type === "recharge on roll"){
                    html = `
                    <property-block>
                        <h4>${monster.legendary_actions[i].name} (Recharge ${monster.legendary_actions[i].usage.min_value}-8)</h4>
                        <p>${monster.legendary_actions[i].desc}</p>
                    </property-block>`
                }
            }else{
                html = `
                <property-block>
                    <h4>${monster.legendary_actions[i].name}</h4>
                    <p>${monster.legendary_actions[i].desc}</p>
                </property-block>`
            }
            statBlock.insertAdjacentHTML("beforeend", html)
        }
    }
    console.log(monster)
}

showMonster("ancient-bronze-dragon")
