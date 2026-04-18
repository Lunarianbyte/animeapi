import axios from "axios";
import episodes from "./episodes";
import scrapeEpisode from "@/lib/scrapeEpisode";

const BASEURL =
  process.env.BASEURL || "https://otakudesu.blog";

const episode = async ({
  episodeSlug,
  animeSlug,
  episodeNumber,
}: {
  episodeSlug?: string | undefined;
  animeSlug?: string | undefined;
  episodeNumber?: number | undefined;
}) => {
  let slug = "";

  if (episodeSlug) slug = episodeSlug;

  if (animeSlug && episodeNumber) {
    const episodeLists = await episodes(animeSlug);
    if (!episodeLists) return undefined;

    const splittedEpisodeSlug =
      episodeLists[0].slug?.split("-episode-") as string[];

    const prefixEpisodeSlug = splittedEpisodeSlug[0];
    const firstEpisodeNumber =
      splittedEpisodeSlug[1].replace("-sub-indo", "");

    slug = `${prefixEpisodeSlug}-episode-${
      episodeNumber -
      (parseInt(firstEpisodeNumber) == 0 ? 1 : 0)
    }-sub-indo`;
  }

  const { data } = await axios.get(
    `${BASEURL}/episode/${slug}`,
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

  const result = scrapeEpisode(data);

  return result;
};

export default episode;
