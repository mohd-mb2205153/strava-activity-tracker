async function getClubActivites() {

    const token = '954b20102d959bd1c600ad398824f39295263ffb'  //Access Token provided by STRAVA API
    //Token has a validity if 6 hours
    const clubId = String(491970);

    const url = `https://www.strava.com/api/v3/clubs/${clubId}/activities`
    const options = 
    {
        'method': 'get',
        'headers': {
            'Authorization': 'Bearer ' + token
        }
    }
    const response = await fetch(url, options);
    if(!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const activitiesList = await response.json();
    return activitiesList;

}
// console.log("hello")

// const output = await getClubActivites();
// console.log(output);



//Function for getting the new access token using the refresh token
function getNewAccessToken() {
  const clientId = '159369';
  const clientSecret = '399f3c6e47734891baf5abd82426058facaf2f9c';
  const refreshToken = '86792c3c3ce4a2a15860919416c5ac8421977bb3';

  const url = 'https://www.strava.com/oauth/token';
  const payload = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  };

  const options = {
    method: 'post',
    payload: payload
  };

  const response = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText());
  const newAccessToken = data.access_token;

  // Storing the new access token in PropertiesService
  PropertiesService.getScriptProperties().setProperty('STRAVA_ACCESS_TOKEN', newAccessToken);
  
  return newAccessToken;
}

const newtoken = getNewAccessToken();
console.log("New token: " + newtoken);