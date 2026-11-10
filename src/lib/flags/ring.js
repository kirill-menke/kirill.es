// Flag image paths, shared by /flags and the home-page Flags tiles. Deliberately free of
// flags.json, so a tile can import it without bundling the data.

export const imageUrl = (code) => `/flag-images/${code}.svg`;
