/**
 * Strava Club Activity Fetcher
 * 
 * Author: Mohd Muhtasim Bashar
 * Description: 
 *   - Fetches all club activities using Strava API
 *   - Handles access token refresh automatically
 *   - Outputs athlete name, distance, duration, and activity type
 *   - Applies formatting and automated updates via time-based trigger
 * 
 * Technologies: Google Apps Script, Strava API, GitHub for version control
 * 
 * Note: Client Id, Secret and Refresh token is explicitly mention in the script
 */

// Function for getting the new access token using the refresh token
function getNewAccessToken() {
  const clientId = '';
  const clientSecret = '';
  const refreshToken = '';

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

// Function that gets all the club activities
function getClubActivites() {
  Logger.log("===== Script started: Fetching club activities =====\n" +
  "Start Time:"  + new Date() );

  // Header row
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear();
  sheet.appendRow(['Date','Time','Athlete Name', 'Distance (Km)', 'Workout Duration (HH:MM:SS)', 'Activity Type']);

  // For formatting the header 
  const headerRange = sheet.getRange(1,1,1,6);
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  headerRange.setWrap(true);
  headerRange.setBackground("#f2f2f2")

  // Setting alignment for all rows (optional)
  const allDataRange = sheet.getRange(2, 1, 500, 6); // from row 2 down, 500 rows, 5 columns
  allDataRange.setHorizontalAlignment("center");

  const clubId = String(491970);

  let perPage = 50;  // No of activites per page
  let page = 1;    // No of pages
  let hasMore = true; // Flag that indicates if there are still activitites

  while(hasMore) {
    let token = PropertiesService.getScriptProperties().getProperty('STRAVA_ACCESS_TOKEN');
    if(!token) {
      token = getNewAccessToken()     //Access Token provided by STRAVA API, has a validity if 6 hours
    }

    const url = `https://www.strava.com/api/v3/clubs/${clubId}/activities?per_page=${perPage}&page=${page}`;
    const options = 
    {
        'method': 'get',
        'headers': {
            'Authorization': 'Bearer ' + token
        },
        muteHttpExceptions: true      // Muting exceptions 
    }

    let response =  UrlFetchApp.fetch(url, options);
    let statusCode = response.getResponseCode();

    if (statusCode == 401) {    // If old token is expired, get the new token
      token = getNewAccessToken();
      options.headers.Authorization = 'Bearer ' + token;
      response = UrlFetchApp.fetch(url, options);
      statusCode = response.getResponseCode();
    }

    if (statusCode != 200) {     // If Error
      const errorText =  response.text();
      Logger.log("Failed to fetch data. [Status Code" + statusCode + " ]")
      Logger.log(response.getContentText())
      return;
    } 

    const activitiesList = JSON.parse(response.getContentText())

    if (activitiesList.length === 0) { // If there is no more activities
      hasMore = false;
      break;   
    }

    // A function that takes an activity object and appends to google sheets row
    function addingActivities(activity) {
      const now = new Date().toLocaleString();  // Returns date & time according to local timezone of the system
      const date = now.split(', ')[0];
      const time = now.split(', ')[1];

      const name = activity.athlete.firstname + " " + activity.athlete.lastname;
      const distance = (activity.distance / 1000).toFixed(2) // In kilometeres

      const elapsedSeconds = activity.elapsed_time

      const hours = Math.floor(elapsedSeconds / 3600 )
      const minutes = Math.floor((elapsedSeconds % 3600) / 60)
      const seconds = elapsedSeconds % 60

      const duration = 
        String(hours).padStart(2, '0') + " : " +
        String(minutes).padStart(2, '0') + " : " +
        String(seconds).padStart(2, '0');
      const type = activity.type
      sheet.appendRow([date, time, name, distance, duration, type])
    }

    Logger.log('Adding activites of page no:' + page);
    activitiesList.forEach((act) => addingActivities(act));
    page++; // Go to next page
  }

  const noOfActivites = perPage * page; 

  const dataRange = sheet.getRange(2, 1, noOfActivites+1, 4); // Data starts at row 2
  dataRange.setHorizontalAlignment('center');

  // Display the last updated date and time
  const now = new Date()
  sheet.getRange('H1:I1').merge();
  sheet.getRange('H1')
    .setValue(`Last updated at: ${Utilities.formatDate(now, Session.getScriptTimeZone(), "dd-MMM-yyyy HH:mm")}`)
    .setHorizontalAlignment('center')
    .setBackground("#e0f7fa")        // Light cyan
    .setFontColor("#006064")   // Dark cyan
    .setVerticalAlignment('middle')
    .setFontWeight('bold')
    .setWrap(true);

  sheet.setColumnWidth(7, 180); // Column G is index 7

  Logger.log(
    "===============================\n" +
    "Script Status: ✅ Completed\n" +
    "Timestamp: " + new Date() + "\n" +
    "==============================="
  );


}
