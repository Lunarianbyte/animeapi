import axios from "axios";
import { load } from "cheerio";

const BASEURL =
  process.env.BASEURL || "https://otakudesu.blog/";

const movie = async (slug: string): Promise<any> => {
  const { data } = await axios.get(
    `${BASEURL}episode/${slug}`,
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

  const $ = load(data);

  const checkUrl = $(".episodelist ul li span a").attr("href");
  const fixedUrl = checkUrl?.split("/")[4];

  const { data: movieData } = await axios.get(
    `${BASEURL}episode/${fixedUrl}`,
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

  const $$ = load(movieData);

  const title =
    $(".posttl").html() ?? $$(".posttl").html();

  const iframeSrc =
    $("iframe").attr("src") ??
    $$(".iframe").attr("src");

  const downloadLinks: {
    quality: string;
    links: { name: string; url: string }[];
  }[] = [];

  $(".yondarkness-title").each((_, element) => {
    const quality = $$(element).text().trim();

    const links: { name: string; url: string }[] = [];

    $$(element)
      .next(".yondarkness-item")
      .find("a")
      .each((__, el) => {
        const name = $$(el).text().trim();
        const url = $$(el).attr("href") ?? "";
        links.push({ name, url });
      });

    downloadLinks.push({ quality, links });
  });

  if (downloadLinks.length === 0) {
    $$(".yondarkness-item").each((_, element) => {
      const quality = $$(element)
        .find("a")
        .text()
        .trim();

      const links: { name: string; url: string }[] = [];

      $$(element)
        .find("a")
        .each((__, el) => {
          const name = $$(el).text().trim();
          const url = $$(el).attr("href") ?? "";
          links.push({ name, url });
        });

      downloadLinks.push({ quality, links });
    });
  }

  return { title, iframeSrc, downloadLinks };
};

export default movie;
