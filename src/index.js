"use strict"

import { json } from "d3-fetch";
import { min, max, sum, extend, mean } from "d3-array";

async function API(url) {
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
}

API("https://www.dnd5eapi.co/api/monsters/drider")
