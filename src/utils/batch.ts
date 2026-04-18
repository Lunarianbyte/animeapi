import axios from "axios";
import getBatch from "@/lib/getBatch";
import scrapeBatch from "@/lib/scrapeBatch";

const BASEURL =
  process.env.BASEURL || "https://otakudesu.blog";

const batch = async ({
  batchSlug,
  animeSlug,
}: {
  batchSlug?: string;
  animeSlug?: string;
}) => {
  let batch: string | undefined = batchSlug;

  if (animeSlug) {
    const { data } = await axios.get(
      `${BASEURL}/anime/${animeSlug}`,
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

    const batchData = getBatch(data);
    batch = batchData?.slug;
  }

  if (!batch) return false;

  const { data } = await axios.get(
    `${BASEURL}/batch/${batch}`,
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

  const result = scrapeBatch(data);

  return result;
};

export default batch;
