import { motion } from "framer-motion";
import { PageHero } from "@/components/page-hero";
import { LoadingState, ErrorState } from "@/components/query-states";
import { useGallery } from "@/lib/queries";
import { usePageTitle } from "@/lib/use-page-title";
import { galleryStock, media } from "@/lib/media";
import type { GalleryItemApi } from "@/types/api";

type Tile = { url: string; type: "image" | "video"; alt: string };

function MediaFrame({ item, className }: { item: Tile; className?: string }) {
  return item.type === "video" ? (
    <video
      src={item.url}
      muted
      loop
      autoPlay
      playsInline
      className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${className ?? ""}`}
    />
  ) : (
    <img
      src={item.url}
      alt={item.alt}
      loading="lazy"
      className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${className ?? ""}`}
    />
  );
}

/**
 * A 4-tile bento block: one large 2×2 cell plus a 1×1, a 1×1 and a 2×1 —
 * Tailwind's default grid auto-placement tiles these into a full 4×2 grid
 * with no gaps, no explicit grid-template-areas required. Stacks plainly
 * below lg, where there isn't room for a bento composition to read well.
 */
function BentoHighlights({ tiles }: { tiles: Tile[] }) {
  if (tiles.length < 4) return null;
  const [a, b, c, d] = tiles;

  return (
    <div className="mb-14 grid grid-cols-2 gap-3 sm:mb-20 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2 lg:h-[36rem]">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="group col-span-2 row-span-2 aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-3xl lg:aspect-auto lg:h-full"
      >
        <MediaFrame item={a} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
        className="group aspect-square overflow-hidden rounded-2xl lg:aspect-auto lg:h-full"
      >
        <MediaFrame item={b} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
        className="group aspect-square overflow-hidden rounded-2xl lg:aspect-auto lg:h-full"
      >
        <MediaFrame item={c} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.24, ease: "easeOut" }}
        className="group col-span-2 aspect-[16/9] overflow-hidden rounded-2xl sm:rounded-3xl lg:col-span-2 lg:aspect-auto lg:h-full"
      >
        <MediaFrame item={d} />
      </motion.div>
    </div>
  );
}

/** Pinterest-style masonry via CSS columns — natural image heights, no forced squares. */
function MasonryGrid({ tiles }: { tiles: Tile[] }) {
  // Too few tiles for the column count leaves one lonely image per column and a
  // ragged bottom edge, so scale columns to how much there actually is to show.
  const columnClasses =
    tiles.length <= 4
      ? "columns-2 gap-3 sm:gap-4"
      : tiles.length <= 8
        ? "columns-2 gap-3 sm:columns-3 sm:gap-4"
        : "columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4";

  return (
    <div className={columnClasses}>
      {tiles.map((tile, index) => (
        <motion.div
          key={`${tile.url}-${index}`}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: (index % 8) * 0.05, ease: "easeOut" }}
          className="group mb-3 break-inside-avoid overflow-hidden rounded-2xl sm:mb-4"
        >
          {tile.type === "video" ? (
            <div className="aspect-video w-full overflow-hidden">
              <MediaFrame item={tile} />
            </div>
          ) : (
            <img
              src={tile.url}
              alt={tile.alt}
              loading="lazy"
              className="w-full rounded-2xl object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default function GalleryPage() {
  usePageTitle("Gallery", "Moments from past Kasepu Kalisi gatherings.");
  const { data: items, isLoading, isError } = useGallery();

  const albums = new Map<string, GalleryItemApi[]>();
  for (const item of items ?? []) {
    if (!albums.has(item.album)) albums.set(item.album, []);
    albums.get(item.album)!.push(item);
  }

  const hasRealPhotos = Boolean(items && items.length > 0);

  const highlightTiles: Tile[] = hasRealPhotos
    ? (items ?? []).slice(0, 4).map((i) => ({ url: i.url, type: i.type, alt: i.album }))
    : galleryStock.slice(0, 4).map((url) => ({ url, type: "image", alt: "Kasepu Kalisi" }));

  // The bento already shows these, so keep them out of the masonry below.
  const featuredUrls = new Set(highlightTiles.map((t) => t.url));

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        image={media.tableWithFlowers}
        title={
          <>
            Moments that
            <br />
            <span className="italic text-gold">stayed with us.</span>
          </>
        }
        description="Photography from each gathering lands here once the evening is over."
      />

      <div className="container-kk py-14 sm:py-20 lg:py-24">
        {isLoading && <LoadingState label="Loading gallery…" />}
        {isError && <ErrorState message="Couldn't load the gallery." />}

        {!isLoading && !isError && (
          <>
            <BentoHighlights tiles={highlightTiles} />

            {hasRealPhotos ? (
              <div className="flex flex-col gap-16">
                {Array.from(albums.entries()).map(([album, albumItems]) => {
                  const rest = albumItems.filter((i) => !featuredUrls.has(i.url));
                  if (rest.length === 0) return null;
                  return (
                    <div key={album}>
                      <h2 className="text-2xl sm:text-3xl">{album}</h2>
                      <div className="mt-6">
                        <MasonryGrid tiles={rest.map((i) => ({ url: i.url, type: i.type, alt: album }))} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                <MasonryGrid
                  tiles={galleryStock
                    .filter((url) => !featuredUrls.has(url))
                    .map((url) => ({ url, type: "image" as const, alt: "Kasepu Kalisi" }))}
                />
                <p className="mt-8 text-center text-sm text-slate">
                  Preview imagery — real photos from each gathering land here after the evening.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
