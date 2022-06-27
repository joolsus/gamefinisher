const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

let IGDB_ACCESS_TOKEN_OBJECT = undefined;
let lastAccessTokenTime = Date.now();
const urlBase = 'https://api.igdb.com/v4/'


async function validateIGDBAccessToken(req, res, next) {
  await getIGDBAccessToken();
  next();
}

router.use(validateIGDBAccessToken);

router.post("/games/:game_id", async (req, res) => {
  console.log(`search req: ${req}`);
  console.log(`IGDB_ACCESS_TOKEN_OBJECT = ${IGDB_ACCESS_TOKEN_OBJECT}`);
  console.log(IGDB_ACCESS_TOKEN_OBJECT);
  res.status(200).json({ message: "POST game" });
});

router.post("/search/:searchTerm", async (req, res) => {
  console.log(`search req: ${req.params}`);
  console.log(req.params.searchTerm);
  //console.log(`IGDB_ACCESS_TOKEN_OBJECT = ${IGDB_ACCESS_TOKEN_OBJECT}`);
  //let body = 'fields id, name, summary, url, cover.image_id, platforms.name, platforms.summary, platforms.platform_logo.image_id; search "'+req.params.searchTerm+'"; limit 10;'
  let body = 'fields id, name, summary, url, cover.image_id, platforms.name, platforms.id, platforms.platform_logo.image_id; search "'+req.params.searchTerm+'"; limit 50;'
  console.log(body)



  const response = await fetch(
    urlBase+'games/',
    {
      method: "POST",
      headers: {
        'Client-ID': process.env.IGDB_CLIENT_ID,
        'Authorization':' Bearer ' +IGDB_ACCESS_TOKEN_OBJECT.access_token,
      },
      body: body
      
      
    }
  );
  
  //console.log(response);  


  const json = await response.json();
  console.log(json);  
  //if there are errors from the graphql request, just throw the json object which will trigger Parse to send
  //an error message with the json object as content
  if (json.errors) {
    throw json;
  }
  res.status(200).json(json);
});

//Get access token for IGDB
async function getIGDBAccessToken() {
  if (
    IGDB_ACCESS_TOKEN_OBJECT == undefined ||
    IGDB_ACCESS_TOKEN_OBJECT.expires_in + lastAccessTokenTime < Date.now()
  ) {
    const response = await fetch(
      "https://id.twitch.tv/oauth2/token?client_id=" +
        process.env.IGDB_CLIENT_ID +
        "&client_secret=" +
        process.env.IGDB_SECRET +
        "&grant_type=client_credentials",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    lastAccessTokenTime = Date.now();
    const json = await response.json();

    //if there are errors from the graphql request, just throw the json object which will trigger Parse to send
    //an error message with the json object as content
    if (json.errors) {
      throw json;
    }
    //console.log("bla")
    //console.log(json)
    IGDB_ACCESS_TOKEN_OBJECT = json;
    return json;
  } else {
    console.log(`Already have valid access token`);
    return;
  }
}

module.exports = router;
