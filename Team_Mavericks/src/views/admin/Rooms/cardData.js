// cardData.js
const initialCards = [
  {
    id: 0,
    fields: ["1001", "1004"],
    settings: {
      gloves: true,
      helmet: false,
      boots: true,
      vest: true,
      glasses: false,
      // mask: false,
      // suit: true,
    },
    showSettings: false,
  },
  {
    id: 1,
    fields: ["1012"],
    settings: {
      gloves: false,
      helmet: true,
      boots: false,
      vest: false,
      glasses: true,
      // mask: true,
      // suit: false,
    },
    showSettings: false,
  },
  {
    id: 2,
    fields: ["1017"],
    settings: {
      gloves: false,
      helmet: true,
      boots: false,
      vest: true,
      glasses: true,
      // mask: true,
      // suit: false,
    },
    showSettings: false,
  },
];

export default initialCards;
