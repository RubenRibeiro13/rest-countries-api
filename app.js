const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const numericFormats = require(__dirname + "/numeric-formats.js");

let countryFieldText = "";
let selectedRegion = "";

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.redirect("/home");
});

app.get("/home", function(req, res) {
  const url = "https://restcountries.com/v3.1/all?fields=flags,name,population,region,capital,cca2";

  https.get(url, function(response) {
    let data = "";

    response.on("data", function(chunk) {
      data += chunk.toString();
    }).on("end", function() {
      let filteredCountries = [];

      if (countryFieldText === "" && ["", "All Regions"].includes(selectedRegion)) {
        filteredCountries = JSON.parse(data);
      } else if (countryFieldText !== "" && ["", "All Regions"].includes(selectedRegion)) {
        const countryFieldTextPattern = new RegExp("^" + countryFieldText.toLowerCase());

        JSON.parse(data).forEach(function(country) {
          if (countryFieldTextPattern.test(country.name.common.toLowerCase())) {
            filteredCountries.push(country);
          }
        });
      } else if (countryFieldText === "" && ["", "All Regions"].includes(selectedRegion) === false) {
        const selectedRegionPattern = new RegExp("^" + selectedRegion);

        JSON.parse(data).forEach(function(country) {
          if (selectedRegionPattern.test(country.region)) {
            filteredCountries.push(country);
          }
        });
      } else {
        const countryFieldTextPattern = new RegExp("^" + countryFieldText.toLowerCase());
        const selectedRegionPattern = new RegExp("^" + selectedRegion);

        JSON.parse(data).forEach(function(country) {
          if (countryFieldTextPattern.test(country.name.common.toLowerCase()) && selectedRegionPattern.test(country.region)) {
            filteredCountries.push(country);
          }
        });
      }

      filteredCountries.forEach(function(country) {
        country.population = numericFormats.commaFormat(country.population + "");
      });

      res.render("home", {filtered_countries: filteredCountries, country_field_text: countryFieldText, selected_region: selectedRegion});
    });
  });
});

app.get("/detail/:clickedCountryCode", function(req, res) {
  const clickedCountryURL = "https://restcountries.com/v3.1/alpha/" + req.params.clickedCountryCode + "?fields=flags,name,population,region,subregion,capital,tld,currencies,languages,borders";

  https.get(clickedCountryURL, function(clickedCountryRes) {
    let clickedCountryData = "";

    clickedCountryRes.on("data", function(clickedCountryChunk) {
      clickedCountryData += clickedCountryChunk;
    });

    clickedCountryRes.on("end", function() {
      const clickedCountry = JSON.parse(clickedCountryData);
      clickedCountry.population = numericFormats.commaFormat(clickedCountry.population + "");

      if (Object.values(clickedCountry.name.nativeName).length === 0) {
        clickedCountry.name.nativeName = {language: {common: ""}};
      }

      if (Object.values(clickedCountry.currencies).length === 0) {
        clickedCountry.currencies = {currency: {name: ""}};
      }
      
      let borderCountriesURL = "https://restcountries.com/v3.1/alpha?codes=" + clickedCountry.borders + "&fields=name,cca2";
      
      https.get(borderCountriesURL, function(borderCountriesRes) {
        let borderCountriesData = "";

        borderCountriesRes.on("data", function(borderCountriesChunk) {
          borderCountriesData += borderCountriesChunk;
        });

        borderCountriesRes.on("end", function() {
          let borderCountries = JSON.parse(borderCountriesData);
          
          if (borderCountries.status === 400) {
            borderCountries = [];
          }

          res.render("detail", {clicked_country: clickedCountry, border_countries: borderCountries});
        });
      });
    });
  });
});

app.post("/home", function(req, res) {
  countryFieldText = req.body.country_field_text;
  selectedRegion = req.body.selected_region;

  res.redirect("/home");
});

app.listen(process.env.PORT || 3000);
