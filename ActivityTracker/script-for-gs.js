function getClubActivites() {

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
    const response =  UrlFetchApp.fetch(url, options);
    const statusCode = response.getResponseCode();

    if(statusCode != 200) {     // If Error
        const errorText =  response.text();
        Logger.log("Failed to fetch data. [Status Code" + statusCode + " ]")
        Logger.log(response.getContentText())
        return;
    }

    const activitiesList = JSON.parse(response.getContentText())
    Logger.log(activitiesList);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.clear();
    sheet.appendRow(['Date', 'Time', 'Athlete Name', 'Distance', 'Workout Duration', 'Activity Type']);

    function addingActivities(activity) {
      const date = 0;
      const time = 0;
      const name = activity.athlete.firstname + " " + activity.athlete.lastname;
      const distance = activity.distance / 1000 //In kilometeres
      const hours = Math.floor(activity.elapsed_time / 3600 )
      const minutes = Math.floor((activity.elapsed_time % 3600) / 60)
      const paddedMinutes = minutes < 10 ? '0' + minutes : minutes       // Pad minutes with 0 if needed
      const duration = hours + ':' + paddedMinutes
      const type = activity.type
      sheet.appendRow([date, time, name, distance, duration, type])
    }

    activitiesList.forEach((act) => addingActivities(act));

}
