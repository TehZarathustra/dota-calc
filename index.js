import {
  WRAITH_BAND_MIN,
  WRAITH_BAND_MAX,
  BRACER_MIN,
  BRACER_MAX,
  NULL_TALISMAN_MIN,
  NULL_TALISMAN_MAX,
  POWER_TREADS
} from './items.js';

const formatFloat = n => Number(n.toFixed(2));

/*
  mergeBonuses([
    calcAttr(STR_BONUS)(10),
    calcAttr(INNATE_STR_BONUS)(10),
    calcAttr(UNIVERSAL_BONUS)(10)
  ]);
*/
const mergeBonuses = bonuses => bonuses.reduce((acc, item) => {
  const result = {...acc};

  Object.entries(item).forEach(([name, value]) => {
    result[name] = formatFloat(result[name] ? result[name] + value : value);
  });

  return result;
}, {});

const calcAttrs = attrs => {
  const UNIVERSAL_BONUS = {attack: 0.7};
  const STR_BONUS = {hp: 22, hp_regen: 0.1};
  const AGI_BONUS = {armor: 0.166, attack_speed: 1};
  const INT_BONUS = {mp: 12, mp_regen: 0.05, mag_res: 0.1};

  /*
    Innate Intrinsic Edge bonuses
      Health Regen Bonus per Str:  0.125
      Armor Bonus per Agi:  0.208
      Mana Regen Bonus per Int:  0.063
      Base Magic Resist Bonus per Int:  0.125%
  */
  const INNATE_STR_BONUS = {hp_regen: 0.125};
  const INNATE_AGI_BONUS = {armor: 0.208};
  const INNATE_INT_BONUS = {mp_regen: 0.063, mag_res: 0.125};

  const calcAttr = bonuses => mult =>
    Object.entries(bonuses).reduce((result, bonus) => {
      const [bonusName, bonusValue] = bonus;

      return {...result, [bonusName]: bonusValue * mult}
    }, {});

  const calcComplexAttr = ([name, value]) => {
    const attrMap = {
      str: [STR_BONUS, INNATE_STR_BONUS, UNIVERSAL_BONUS],
      agi: [AGI_BONUS, INNATE_AGI_BONUS, UNIVERSAL_BONUS],
      int: [INT_BONUS, INNATE_INT_BONUS, UNIVERSAL_BONUS]
    };

    if (!attrMap[name]) return {};

    return mergeBonuses(attrMap[name].map(calcAttr).map(fn => fn(value)));
  };

  const calcFlatBonuses = attrs => {
    const FLAT_BONUSES = ['hp', 'mp', 'mp_regen', 'attack_speed', 'armor', 'attack'];

    return Object.entries(attrs).reduce((acc, [name, value]) => {
      const result = {...acc};

      if (FLAT_BONUSES.includes(name)) {
        result[name] = result[name] ? result[name] + value : value;
      }

      return result;
    }, {});
  }

  return mergeBonuses([
    ...Object.entries(attrs).map(calcComplexAttr),
    calcFlatBonuses(attrs)
  ]);
}

const formatOutputToString = obj => Object.entries(obj).map(([name, value]) => `+${value} ${name}`).join('\n');

console.log(formatOutputToString(calcAttrs(WRAITH_BAND_MIN)), '\n');
console.log(formatOutputToString(calcAttrs(BRACER_MIN)), '\n');
console.log(formatOutputToString(calcAttrs(NULL_TALISMAN_MIN)), '\n');
// console.log(mergeBonuses([calcAttrs(BRACER_MIN), calcAttrs(BRACER_MIN)]));
// console.log(mergeBonuses([
//   calcAttrs(WRAITH_BAND_MIN),
//   calcAttrs(BRACER_MIN),
//   calcAttrs(NULL_TALISMAN_MIN),
// ]));

