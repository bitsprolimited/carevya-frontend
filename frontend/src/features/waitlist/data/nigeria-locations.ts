/** Nigerian states with sample LGAs for the waitlist modal. */
export const nigeriaStates: Record<string, readonly string[]> = {
  Lagos: [
    "Agege",
    "Alimosho",
    "Eti-Osa",
    "Ikeja",
    "Kosofe",
    "Lagos Island",
    "Lagos Mainland",
    "Surulere",
  ],
  "FCT Abuja": [
    "Abaji",
    "Bwari",
    "Gwagwalada",
    "Kuje",
    "Kwali",
    "Municipal Area Council",
  ],
  Rivers: ["Obio-Akpor", "Port Harcourt", "Eleme", "Ikwerre", "Bonny"],
  Oyo: ["Ibadan North", "Ibadan South-West", "Akinyele", "Egbeda", "Ogbomosho"],
  Kano: ["Kano Municipal", "Nassarawa", "Fagge", "Gwale", "Dala"],
  Ogun: ["Abeokuta South", "Abeokuta North", "Ado-Odo/Ota", "Ifo", "Sagamu"],
  Enugu: ["Enugu East", "Enugu North", "Enugu South", "Nsukka", "Udi"],
  Kaduna: ["Kaduna North", "Kaduna South", "Chikun", "Igabi", "Zaria"],
} as const;

export const nigeriaStateNames = Object.keys(nigeriaStates);
