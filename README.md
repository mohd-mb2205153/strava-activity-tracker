# 🚴‍♂️ Strava Club Activity Logger

A Google Apps Script that fetches **recent activities** of members from a **Strava club** and displays them in a Google Sheet, with proper formatting and automation.

---
<img src="assets/demo-1.gif" width="500" alt="Strava Activity Tracker Demo">


---

## 📌 Features

- 🔐 Automatically refreshes access tokens using the Strava OAuth2 token refresh flow.
- 📄 Logs and displays each athlete’s:
  - Name
  - Distance (in kilometers)
  - Workout Duration (HH:MM:SS)
  - Activity Type
- 🎨 Applies clean formatting to the Google Sheet.
- 📅 Displays the last updated timestamp.
- ⏰ Can be scheduled to run automatically using a **time-based trigger**.
- 🧪 Includes inline logs to track script execution status.

---

## 🛠️ Technologies Used

- **Google Apps Script** (for scripting & integration)
- **Strava API v3** (for fetching club activities)
- **Google Sheets** (as the output display)
- **GitHub** (for version control)

---

## 📋 Setup Instructions

1. **Clone or copy the script** into the [Apps Script editor](https://script.google.com/).
2. Replace the **client ID**, **client secret**, and **refresh token** from your Strava app (already included in the sample script).
3. Connect the script to a Google Sheet.
4. Run the `getClubActivities()` function to test the setup.
5. (Optional) Add a **time-driven trigger** to run the script automatically every day/hour.

---

## 📸 Sample Output (Google Sheet)

| Athlete Name | Distance (Km) | Workout Duration (HH:MM:SS) | Activity Type |
|--------------|----------------|-----------------------------|---------------|
| John Doe     | 12.50          | 01:10:35                    | Run           |
| Jane Smith   | 34.23          | 01:55:12                    | Ride          |

A **timestamp** will appear in merged cell `F1:G1`, such as:
```
Last updated at: 14-May-2025 19:15
```
---

## 📄 Script Structure

- `getNewAccessToken()`  
  Refreshes the access token using stored credentials.

- `getClubActivities()`  
  Main function that:
  - Fetches club activities using pagination.
  - Parses and appends data to the sheet.
  - Handles expired token errors.
  - Applies formatting and styling.
  - Displays a log with start/end timestamp.

---

## ⚠️ Security Note

🔐 **Do not expose your client ID, secret, or refresh token** in a public repository. In a production version, these sensitive credentials should be stored securely using Google Apps Script’s `PropertiesService` or GitHub secrets.

---

## 🙋‍♂️ Author

**Mohd Muhtasim Bashar**  
📧 Contact: muhtasim2k2@gmail.com

---

## 📅 Future Improvements

- Add support for storing data in a database.
- Add filtering by activity type or date range.
- Visualize data with charts (distance over time, etc.).
- Build a web dashboard to display club statistics.

---

## 📃 License

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**.

You are free to:

- **Use** the code for any purpose.
- **Study** how the code works and adapt it to your needs.
- **Share** the code and any modifications you make.
- **Modify** the code and distribute your versions under the same license.

However, under this license, you **must**:

- **Disclose source**: If you distribute the code (modified or unmodified), you must include the source code or a way to obtain it.
- **License your modifications** under the same GPL-3.0 terms.
- **State changes**: If you make changes to the code, you must clearly state what you changed.

There is **no warranty**, and the license does **not grant trademark rights**.
However, you are not allowed to distribute closed-source versions.

For more details, refer to the [full license text](https://www.gnu.org/licenses/gpl-3.0.en.html).
