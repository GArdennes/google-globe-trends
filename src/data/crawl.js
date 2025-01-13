import fs from "fs";
const sdg_data = JSON.parse(fs.readFileSync("./src/data/SDG.json", "utf8"));

export default async function crawl(data) {
  let tableData = [];
  let fetchPromises = [];

  for (const country of data) {
    try {
      console.log(`Crawling ${country.name} with ${country["alpha-3"]}...`);
      let countryName = country.name;
      let geoCode = country["alpha-3"];
      const feed = sdg_data.features;
      const item = feed.find((item) => item.attributes.ID === geoCode);

      if (item) {
        const attributes = item.attributes;
        const performance = {
          "Goal 1 Rating": attributes["Goal_1_Rating"],
          "Goal 2 Rating": attributes["Goal_2_Rating"],
          "Goal 3 Rating": attributes["Goal_3_Rating"],
          "Goal 4 Rating": attributes["Goal_4_Rating"],
          "Goal 5 Rating": attributes["Goal_5_Rating"],
          "Goal 6 Rating": attributes["Goal_6_Rating"],
          "Goal 7 Rating": attributes["Goal_7_Rating"],
          "Goal 8 Rating": attributes["Goal_8_Rating"],
          "Goal 9 Rating": attributes["Goal_9_Rating"],
          "Goal 10 Rating": attributes["Goal_10_Rating"],
          "Goal 11 Rating": attributes["Goal_11_Rating"],
          "Goal 12 Rating": attributes["Goal_12_Rating"],
          "Goal 13 Rating": attributes["Goal_13_Rating"],
          "Goal 14 Rating": attributes["Goal_14_Rating"],
          "Goal 15 Rating": attributes["Goal_15_Rating"],
          "Goal 16 Rating": attributes["Goal_16_Rating"],
          "Goal 17 Rating": attributes["Goal_17_Rating"],
          "Goal 1 Score": attributes["Goal_1_Score"],
          "Goal 2 Score": attributes["Goal_2_Score"],
          "Goal 3 Score": attributes["Goal_3_Score"],
          "Goal 4 Score": attributes["Goal_4_Score"],
          "Goal 5 Score": attributes["Goal_5_Score"],
          "Goal 6 Score": attributes["Goal_6_Score"],
          "Goal 7 Score": attributes["Goal_7_Score"],
          "Goal 8 Score": attributes["Goal_8_Score"],
          "Goal 9 Score": attributes["Goal_9_Score"],
          "Goal 10 Score": attributes["Goal_10_Score"],
          "Goal 11 Score": attributes["Goal_11_Score"],
          "Goal 12 Score": attributes["Goal_12_Score"],
          "Goal 13 Score": attributes["Goal_13_Score"],
          "Goal 14 Score": attributes["Goal_14_Score"],
          "Goal 15 Score": attributes["Goal_15_Score"],
          "Goal 16 Score": attributes["Goal_16_Score"],
          "Goal 17 Score": attributes["Goal_17_Score"],
        };

        const fetchPromise = fetch(
          "https://restcountries.com/v3.1/alpha/" + geoCode,
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((point) => {
            console.log(JSON.stringify(point, null, 2)); // Log the entire point object to inspect its structure
            const x = {
              country: countryName,
              ISO: geoCode,
              population:
                Array.isArray(point) && point.length > 0
                  ? point[0].population
                  : null,
              performance,
            };

            tableData.push(x);
            fs.writeFileSync(
              `./src/data/countries/${countryName}.json`,
              JSON.stringify(performance, null, 2),
            );
          })
          .catch((error) => {
            console.error(
              "There has been a problem with your fetch operation:",
              error,
            );
          });

        fetchPromises.push(fetchPromise);
      } else {
        console.log(`No item found for ${countryName} with code ${geoCode}`);
      }
    } catch (error) {
      console.error(`Error crawling ${country.name}:`, error.message);
      continue;
    }
  }

  // Wait for all fetch calls to complete
  await Promise.all(fetchPromises);

  // Log tableData to ensure it is populated
  // console.log("Final tableData:", JSON.stringify(tableData, null, 2));

  // Write tableData to data.json
  fs.writeFileSync(`./src/data/data.json`, JSON.stringify(tableData, null, 2));
  // fs.writeFileSync(`./public/data/data.json`, JSON.stringify(res, null, 2));
  return "Crawl completed";
}

var list = JSON.parse(fs.readFileSync("./src/data/all.json", "utf8"));
(async () => {
  await crawl(list);
})();
