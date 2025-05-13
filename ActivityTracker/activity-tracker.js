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
console.log("hello")

const output = await getClubActivites();
console.log(output);