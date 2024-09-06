import { getPetObjectInfo } from "./decodeGen";

import * as fs from 'fs';


import  heroTemplate  from '../templates/hero.template.json';




// async function createCollection2Json(path: string, id) {

//     const  template  = await import ("../collections/json/template.json")

//     const data = nftCollection[id];
//     template.name = data.name;
//     template.symbol = data.symbol;
//     template.description = data.description;
//     template.image = data.image;
//     template.uri = data.uri;
//     fs.writeFileSync(`${path}/${data.name.toLowerCase()}.json`, JSON.stringify(template));

// }

// function createPetJsonFile(path: string, gen: string, idNft: string | number) {

//     const pet = getPetObjectInfo(gen);
//     // console.log("pet", pet);
//     const idHero = pet.petId.toString().padStart(3, '0');

//     let template = require('../../nfts/template.json');
//     template.name = `${collect.name} #${idNft}`;
//     template.symbol = collect.symbol;
//     template.description = collect.description;
//     template.image = collect.image;
//     template.uri = collect.uri;
//     template.collection.family = collect.name;
//     template.collection.name = collect.name;

//     template.attributes = [
//         {
//             "trait_type": "Gen",
//             "value": gen
//         },

//         {
//             "trait_type": "Sex",
//             "value": pet.sex
//         },
//         {
//             "trait_type": "Element",
//             "value": pet.element
//         },
//         {
//             "trait_type": "ATK",
//             "value": pet.baseAtk
//         },
//         {
//             "trait_type": "DEF",
//             "value": pet.baseDef

//         },
//         {
//             "trait_type": "HP",
//             "value": pet.baseHp
//         },
//         {
//             "trait_type": "grow ATK",
//             "value": pet.growAtk
//         },
//         {
//             "trait_type": "grow DEF",
//             "value": pet.growDef
//         },
//         {
//             "trait_type": "grow HP",
//             "value": pet.growHp
//         }
//     ];

//     template.properties.files.uri = collect.image;

//     fs.writeFileSync(`${path}/${gen}.json`, JSON.stringify(template));
// }








// module.exports = {
//     createCollection2Json,
//     createPetJsonFile,
// };
