import { fetchHTML } from "@/lib/fetcher";
import scrapeSingleAnime from "@/lib/scrapeSingleAnime";
import type { anime as animeType } from "@/types/types";

const anime = async (
  slug: string
): Promise<animeType | undefined> => {
  const html = await fetchHTML(`/anime/${slug}`);

  const result = scrapeSingleAnime(html);

  return result;
};

export default anime;
