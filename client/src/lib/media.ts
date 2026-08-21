// Curated stock imagery standing in for real Kasepu Kalisi photography until the
// brand shoot exists. Swap these for real event photos via the Gallery admin.
function unsplash(id: string, w = 1600) {
  return `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
}

export const media = {
  dinnerPlate: unsplash("1414235077428-338989a2e8c0"),
  outdoorGathering: unsplash("1529193591184-b1d58069ecdd"),
  buffetSpread: unsplash("1555244162-803834f70033"),
  wineToast: unsplash("1519671482749-fd09be7ccebf"),
  loungeInterior: unsplash("1543007630-9710e4a00a20"),
  cocktailPour: unsplash("1533422902779-aff35862e462"),
  concertCrowd: unsplash("1478147427282-58a87a120781"),
  tableWithFlowers: unsplash("1511795409834-ef04bbd61622"),
} as const;

/** Fallback portraits when an artist has no photoUrl set in the admin. */
export const artistStock = [
  unsplash("1493225457124-a3eb161ffa5f", 900),
  unsplash("1516450360452-9312f5e86fc7", 900),
  unsplash("1524650359799-842906ca1c06", 900),
  unsplash("1501612780327-45045538702b", 900),
];

export function artistImageFor(name: string) {
  const hash = Array.from(name).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return artistStock[hash % artistStock.length];
}

export const experienceVideo = {
  src: "https://assets.mixkit.co/videos/4640/4640-720.mp4",
  poster: media.outdoorGathering,
};

export const galleryStock = [
  media.tableWithFlowers,
  media.outdoorGathering,
  media.concertCrowd,
  media.wineToast,
  media.buffetSpread,
  media.loungeInterior,
  media.cocktailPour,
  media.dinnerPlate,
];

/**
 * djb2 — summing char codes collided constantly (anagram-ish slugs like
 * "…-chennai-2025" and "…-bengaluru-2026" landed on the same photo).
 */
function hashString(value: string) {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) + hash + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function imageForSlug(slug: string) {
  return galleryStock[hashString(slug) % galleryStock.length];
}

/**
 * Picks a photo per slug while guaranteeing no two entries in the same list
 * share one — a hash alone can't promise that, and repeated images in a grid
 * read as a bug.
 */
export function distinctImagesForSlugs(slugs: string[]): Record<string, string> {
  const used = new Set<string>();
  const result: Record<string, string> = {};

  for (const slug of slugs) {
    const start = hashString(slug) % galleryStock.length;
    let chosen = galleryStock[start];

    // Walk forward until an unused photo turns up; if every photo is taken
    // (more items than photos) fall back to the hashed pick.
    for (let offset = 0; offset < galleryStock.length; offset++) {
      const candidate = galleryStock[(start + offset) % galleryStock.length];
      if (!used.has(candidate)) {
        chosen = candidate;
        break;
      }
    }

    used.add(chosen);
    result[slug] = chosen;
  }

  return result;
}
