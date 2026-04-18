import { load } from "cheerio";
import pagination from "@/lib/pagination";
import scrapeOngoingAnime from "@/lib/scapeOngoingAnime";
import { fetchHTML } from "@/lib/fetcher";

const ongoingAnime = async (page: number | string = 1) => {
  const html = await fetchHTML(
    `/ongoing-anime/page/${page}`
  );

  const $ = load(html);

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
