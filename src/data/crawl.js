import fs from "fs";
import axios from "axios";
import { parseStringPromise } from "xml2js";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function crawl(data) {
  for (const country of data) {
    try {
      console.log(`Crawling ${country.name} with ${country["alpha-2"]}...`);
      let countryName = country.name;
      let geoCode = country["alpha-2"];
      const url = `https://trends.google.com/trending/rss?geo=${geoCode}`;
      const response = await axios.get(url);
      const feed = await parseStringPromise(response.data);

      const trend = feed.rss.channel[0].item.map((item) => ({
        title: item.title[0],
        link: item.link[0],
        pubdate: item.pubDate[0],
        approx_traffic: item["ht:approx_traffic"]
          ? item["ht:approx_traffic"][0]
          : "N/A",
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
  return "Crawl completed";
}

var list = JSON.parse(fs.readFileSync("./src/data/all.json", "utf8"));
(async () => {
  await crawl(list);
})();

// const url = `https://trends.google.com/trending/rss?geo=ZA`;
// const feed = await axios.get(url);
// const response = await parser.parseStringPromise(feed.data);
// console.log(response.rss.channel[0].item);
