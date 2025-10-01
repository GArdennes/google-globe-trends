import fs from "fs";
import { parseStringPromise } from "xml2js";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, retries = 3, backoff = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.text();
      return { data };
    } catch (error) {
      if (error.message.includes("429") && i < retries - 1) {
        console.warn(`Rate limit exceeded. Retrying in ${backoff}ms...`);
        await delay(backoff);
        backoff *= 4; // Exponential backoff
      } else {
        throw error;
      }
    }
  }
}

export default async function crawl(data) {
  let tableData = [];
  for (const country of data) {
    try {
      console.log(`Crawling ${country.name} with ${country["alpha-2"]}...`);
      let countryName = country.name;
      let geoCode = country["alpha-2"];
      const url = `https://trends.google.com/trending/rss?geo=${geoCode}`;
      const response = await fetchWithRetry(url);
      const feed = await parseStringPromise(response.data);

      const trend = feed.rss.channel[0].item.map((item) => ({
        title: item.title[0],
        link: item.link[0],
        pubdate: item.pubDate[0],
        approx_traffic: item["ht:approx_traffic"]
          ? parseInt(item["ht:approx_traffic"][0].replace(/\D+/g, ""), 10) || 0
          : 0,
        picture: item["ht:picture"] ? item["ht:picture"][0] : "N/A",
        picture_source: item["ht:picture_source"]
          ? item["ht:picture_source"][0]
          : "N/A",
        news_items: item["ht:news_item"]
          ? item["ht:news_item"].map((newsItem) => ({
              title: newsItem["ht:news_item_title"]
                ? newsItem["ht:news_item_title"][0]
                : "N/A",
              snippet: newsItem["ht:news_item_snippet"]
                ? newsItem["ht:news_item_snippet"][0]
                : "N/A",
              url: newsItem["ht:news_item_url"]
                ? newsItem["ht:news_item_url"][0]
                : "N/A",
              picture: newsItem["ht:news_item_picture"]
                ? newsItem["ht:news_item_picture"][0]
                : "N/A",
              source: newsItem["ht:news_item_source"]
                ? newsItem["ht:news_item_source"][0]
                : "N/A",
            }))
          : [],
      }));

      // Sort trends by approx_traffic in decreasing order
      const sortedTrends = trend.sort(
        (a, b) => b.approx_traffic - a.approx_traffic,
      );

      // Select the top 3 trends
      const topTrends = sortedTrends.slice(0, 3);

      const x = {
        country: countryName,
        ISO: geoCode,
        trends: topTrends.map((t) => ({
          title: t.title,
          link: t.news_items[0] ? t.news_items[0].url : "N/A",
          traffic: t.approx_traffic,
        })),
      };

      tableData.push(x);
      fs.writeFileSync(
        `./src/data/countries/${countryName}.json`,
        JSON.stringify(trend, null, 2),
      );
    } catch (error) {
      console.error(`Error crawling ${country.name}:`, error.message);
      continue;
    }
    await delay(1000); // Delay for 1 second between requests
  }

  const res = {
    lastUpdate: new Date().toISOString(),
    data: tableData,
  };
  fs.writeFileSync(`./src/data/data.json`, JSON.stringify(res, null, 2));
  return "Crawl completed";
}

var list = JSON.parse(fs.readFileSync("./src/data/all.json", "utf8"));
(async () => {
  await crawl(list);
})();
