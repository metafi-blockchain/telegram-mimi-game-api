export interface ICategory{
        name: string
        created_by?: string
        modified_by?: string
}


export type CharacterNft = {
        version: Number,
        petId: String | Number,
        name: String,
        sex:  "Male" | "Female",
        element: String,
        baseAtk: Number,
        baseDef: Number,
        baseHp: Number,
        growAtk: Number,
        growDef: Number,
        growHp:  Number
}