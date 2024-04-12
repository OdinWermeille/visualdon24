    // insert legendary actions before the end of the monster's stat block (if they exist)
    //if(monster.legendary_actions.length > 0){for (let i = 0; i < monster.legendary_actions.length-1; i++) {
    //     let html = ""
    //     if (monster.legendary_actions[i].spellcasting) {
    //         html = `
    //         <property-block>
    //             <h4>${monster.legendary_actions[i].name}</h4>
    //             <p class="spellcasting">${monster.legendary_actions[i].desc}</p>
    //         </property-block>`
    //     }else if (monster.legendary_actions[i].usage){
    //         if (monster.legendary_actions[i].usage.type === "per day") {
    //             html = `
    //             <property-block>
    //                 <h4>${monster.legendary_actions[i].name} (${monster.legendary_actions[i].usage.times}/Day)</h4>
    //                 <p>${monster.legendary_actions[i].desc}</p>
    //             </property-block>`
    //         }else if (monster.legendary_actions[i].usage.type === "recharge on roll"){
    //             html = `
    //             <property-block>
    //                 <h4>${monster.legendary_actions[i].name} (Recharge ${monster.legendary_actions[i].usage.min_value}-6)</h4>
    //                 <p>${monster.legendary_actions[i].desc}</p>
    //             </property-block>`
    //         }
    //     }else{
    //         html = `
    //         <property-block>
    //             <h4>${monster.legendary_actions[i].name}</h4>
    //             <p>${monster.legendary_actions[i].desc}</p>
    //         </property-block>`
    //     }
    //     statBlock.insertAdjacentHTML("beforeend", html)
    //}}