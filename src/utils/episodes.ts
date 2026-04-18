import axios from "axios";
import scrapeAnimeEpisodes from "@/lib/scrapeAnimeEpisodes";
import type { episode_list } from "@/types/types";

const BASEURL =
  process.env.BASEURL || "https://otakudesu.blog";

const episodes = async (
  slug: string
): Promise<episode_list[] | undefined> => {
  const { data } = await axios.get(
    `${BASEURL}/anime/${slug}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: BASEURL,
        Connection: "keep-alive",
      },
      timeout: 10000,
    }
  );

  const result = scrapeAnimeEpisodes(data);

  return result;
};

export default episodes;
