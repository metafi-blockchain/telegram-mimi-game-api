export interface ICategory{
        name: string
        created_by?: string
        modified_by?: string
}


export type IHero = {
        version: number,
        heroId: string | number,
        name: string,
        description?: string,
        image?: string,
        rarity?: string,
        skills?: string,
        commanderMight?: number,
        baseMight?: number,
        commanderLevel? : number,
        commanderSkill?: number,
        commanderTalent?: number,
}