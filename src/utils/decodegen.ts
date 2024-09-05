import { NFT_COLLECTIONS, PetElements } from "src/constants";
import { CharacterNft } from "src/interface/nft.interface";

// const {PetContains, CollectionNft} = require('../../constants/index');




export const decodePetGen = (gen: String) => {


    if (gen.length != "100000000100000141000001700110000030000650001500001550001700000".length) {
        return null
    }


    return {
        Id: Number(gen.substring(0, 8)),
        version: Number(gen.substring(8, 10)),
        petId: Number(gen.substring(10, 18)).toString().padStart(3, '0'),
        sex: Number(gen.substring(18, 19)),
        element: gen.substring(19, 25).padStart(6, '0'),
        baseAtk: Number(gen.substring(25, 31)),
        baseDef: Number(gen.substring(31, 37)),
        baseHp: Number(gen.substring(37, 43)),
        growAtk: Number(gen.substring(43, 49)),
        growDef: Number(gen.substring(49, 55)),
        growHp: Number(gen.substring(55, 61)),
    };

}

export const getPetObjectInfo = (gen: string ) : CharacterNft=> {
    const petGen  = decodePetGen(gen);

    if(!petGen) return null;

    if(!NFT_COLLECTIONS[petGen.petId]) return null;


    return {
        version: petGen.version,
        petId: petGen.petId,
        name: NFT_COLLECTIONS[petGen.petId]?.name,
        sex:  petGen.sex === 0 ? "Male" : "Female",
        element: getElementFromGen(petGen.element),
        baseAtk: petGen.baseAtk,
        baseDef: petGen.baseDef,
        baseHp: petGen.baseHp,
        growAtk: petGen.growAtk,
        growDef: petGen.growDef,
        growHp:  petGen.growHp
       };
}









const getElementFromGen = (genElement: string) : String=> {
    let result= []
    const element1 = genElement.toString().padStart(6, '0').substring(0, 2);
    const element2 = genElement.toString().padStart(6, '0').substring(2, 4);
    const element3 = genElement.toString().padStart(6, '0').substring(4, 6);

    if(PetElements[element1]) result.push(PetElements[element1]);
    if(PetElements[element2]) result.push(PetElements[element2]);
    if(PetElements[element3]) result.push(PetElements[element3]);
   return result.join(", ");
}








module.exports = {
    decodePetGen,
    getPetObjectInfo
}
