export const AIRCRAFT = {
  phantom: {
    id: "phantom",
    name: "PHANTOM",
    role: "Interceptor",
    color: "#45D7FF",
    ability: "quick_scan",
    abilityName: "Quick Scan",
    abilityUses: 1,
  },

  titan: {
    id: "titan",
    name: "TITAN",
    role: "Heavy Bomber",
    color: "#FFB454",
    ability: "wide_scan",
    abilityName: "Wide Scan",
    abilityUses: 1,
  },

  wraith: {
    id: "wraith",
    name: "WRAITH",
    role: "Stealth",
    color: "#A8F36B",
    ability: "stealth_scan",
    abilityName: "Stealth Scan",
    abilityUses: 1,
  },

  spectre: {
    id: "spectre",
    name: "SPECTRE",
    role: "Recon",
    color: "#BD8CFF",
    ability: "area_scan",
    abilityName: "Area Scan",
    abilityUses: 1,
  },

  volt: {
    id: "volt",
    name: "VOLT",
    role: "Electronic Warfare",
    color: "#60A5FA",
    ability: "signal_jam",
    abilityName: "Signal Jam",
    abilityUses: 1,
  },

  nova: {
    id: "nova",
    name: "NOVA",
    role: "Plasma Strike",
    color: "#FF6B9D",
    ability: "plasma_scan",
    abilityName: "Plasma Scan",
    abilityUses: 1,
  },
};

export const DEFAULT_FLEET = ["phantom", "wraith", "spectre"];
