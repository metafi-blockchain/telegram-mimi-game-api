export interface ICategory{
        name: string
        created_by?: string
        modified_by?: string
}


export type IHero = {
        version: Number,
        heroId: String | Number,
        name: String,
        rarity: String,
        skills: String,
        commanderMight: Number,
        baseMight: Number,
        commanderLevel : Number,
        commanderSkill: Number,
        commanderTalent: Number,
}