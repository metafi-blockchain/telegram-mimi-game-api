import { getPetObjectInfo } from './decodeGen';

import * as fs from 'fs';

import heroTemplate from '../templates/hero.template.json';
import { HERO_COLLECTIONS } from '../constants/hero-collection';
import { IHero } from 'src/interface/nft.interface';


export const getHeroJsonTemplate = (gen: string )  => {
    const hrOb = getPetObjectInfo(gen);
    if(!hrOb) {
        console.log('Not found hero with gen: ', gen);
        return null;
    }
    
    const idHero = hrOb.heroId.toString().padStart(3, '0');
    console.log('idHero', idHero);
    

    const hero = HERO_COLLECTIONS[idHero];
    if (!hero) {
        console.log('Not found hero', idHero);
        return null;
    }
    const fullHero = Object.assign({}, hero, hrOb);
    heroTemplate.name = `${fullHero.name}`;
    heroTemplate.description = fullHero.description;
    heroTemplate.image = fullHero.image;
    heroTemplate.attributes = _createAttributeHero(gen, fullHero);
    heroTemplate.external_url = fullHero.image;
 
    return heroTemplate;
};

export type HeroAttribute = {
    trait_type: string;
    value: string | number | null ;
};

const _createAttributeHero = (
    gen: string,
    hero: IHero,
): Array<HeroAttribute | null> => {
    return [
        {
            trait_type: 'gen',
            value: gen,
        },
        {
            trait_type: 'Rarity',
            value: 'Legendary',
        },
        {
            trait_type: 'Skills',
            value: hero.skills,
        },
        {
            trait_type: 'Commander Might',
            value: hero.commanderMight,
        },
        {
            trait_type: 'Base Might',
            value: hero.baseMight,
        },
        {
            trait_type: 'Commander Level',
            value: hero.commanderLevel,
        },
        {
            trait_type: 'Commander Skill',
            value: hero.commanderSkill,
        },
        {
            trait_type: 'Commander Talent',
            value: hero.commanderTalent,
        },
    ];
};
