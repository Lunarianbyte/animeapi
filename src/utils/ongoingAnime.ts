import axios from "axios";
import { load } from "cheerio";
import pagination from "@/lib/pagination";
import scrapeOngoingAnime from "@/lib/scapeOngoingAnime";

const BASEURL =
  process.env.BASEURL || "https://otakudesu.blog";

const ongoingAnime = async (page: number | string = 1) => {
  const { data } = await axios.get(
    `${BASEURL}/ongoing-anime/page/${page}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": BASEURL,
        "Connection": "keep-alive",
      },
      timeout: 10000,
    }
  );

  const $ = load(data);

  const ongoingAnimeEls = $(
    ".venutama .rseries .rapi .venz ul li"
  ).toString();

  const ongoingAnimeData =
    scrapeOngoingAnime(ongoingAnimeEls);

  const paginationData = pagination(
    $(".pagination").toString()
  );

  return {
    paginationData,
    ongoingAnimeData,
  };
};

export default ongoingAnime;
