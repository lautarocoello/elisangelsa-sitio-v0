import { NextResponse } from "next/server"
import { google } from "googleapis"

// Environment variables
const GOOGLE_SHEETS_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC0bOfvodbkNDpi\nASflf3HjWQmKkZshu2nnj+n4fvtB4qZgVfhJbLLc+JWyKtCvzNI6bPvovA5LBKpT\nmBbQQSBzc+EogtYu1MXHYhTe7sVIcARARcyXZBXVR+EtS3vHW5D33tnYrBz2OKLo\njGlVEZRMTJgd6yMuzTL6KEHhM4NKHtJDQtkdOANigoILtFL6iBtFYgQbs8c1JzMK\na/QaL+4Sj4xBhINeDMLaqRrUJ4iyrLisYfMt9UcdstAWzX/5iCHfHQOdJKlMWDHw\nIA6anQ9AI1EvAkALAD5sM6jm0bBAfXZJke/oxjmy0ntcDcHAVMaG04WO23jn5lPc\nuxpo6M43AgMBAAECggEAPsTkq+mR6TKCXTYpux3rcTy4pQyi+8lHvtfCfkEvCGzh\nlQJTrreyQk35RlK+52pKeSkROpayIkctOofe5/TAZWobGwzplsFPTV5CBIzs9ZaC\n5BlkZAbd0aWAIVHxbhndBV7ySv8V1FM/2cd/najP/vtmsIHta4rYAU+gG8jgFBiv\nEUvZyrtopnMpNlWdk+phFot4+94Sn21Ee7dMW9IkP50ndUf8gcegheT8s2WFkY0a\npVrghygkbvRb5sfU/zBLcYMeH9UZPEmF6jWKJVMrvj8FkCY3mm0f1TvwXAXDTjyt\nQD/nVEHsFK0MxNeaEDCLG8NBId5J2AYgeFllk2/WgQKBgQDlgfv/db4ks36QLAwh\n5BQ9z0At0/DtArTn74CZSR/6/gYRwkrR7qEfvROH/32AeDkOpas48VGEKxeU8kPZ\nIBsR1HF8S+ia0F3x1ha3JHeSej1CFa+BpPFX1PayYPT9c4wtNMlKOPY0ANfPbsQE\nVoP6KzhGGe5PSCVXzQ+U7cb9qwKBgQDJQIaAS2/zgIiHmCt4qSL3gA0uw9HHuKVF\nE2vkko+t5UYH2n5MitxAVhyj+5+DB2bFqiHpdjWvpUIuzS+x6KMEhhrqRVdw6pxE\n6QsW2HHThxSLmuXKEZHt7g5e/UKRKUhJS5vUWUwn7yMTkC5EEA02kmr1BkThJ5Gk\nOtrK3HDtpQKBgFzPEZ6eeIPS6g1XIpjZ6K2OD7/4gub1Pz7DhVd3UK1o5/9qeGMo\ngpOZHDrUwGWhOEGKERF31KUD4AdlaLZ22zt8k1/WOnvQYw0WrBznbEsZj4gXyN8+\nWjJQdmpv9uI/RaJKRFP1cOpapOrHOhEfA0O5EoqWld4NqLw2umRZOyz9AoGAS/8d\ny1yxTdZ/uBRydgIIvkWQtNQlZ7IGVutaltnxf81QgK61etoFChZ6gkIGnkgxOvtg\nCvUkmMtjDqFVHW2oAZFSoJzGxFET6cHG+j2J3kLoMz+u/ntcC+kVbDFe7coVDfiL\nQ8jkxT+8kyqjDfixxKXN1fEkGZIDoWzIKkrMKjECgYEArfnb74TmwDkXzVEA5a7G\nvrmsxtWpOf/aj6jZelSGkPHWDTA4FC2+oCj6BGIl/v9K4g5uig89k23y9xxM0rzZ\noUt4RmyCkF3q6WPVuXLk7LGABNCSSkjapLxdRCkUZX0EgLZKF50S8Z/BbaI5SVF0\nlZbsxH5YhmupLtu2j1UGvro=\n-----END PRIVATE KEY-----\n";
const GOOGLE_SHEETS_CLIENT_EMAIL = "elisangelashowbrasil@elisangelashow.iam.gserviceaccount.com";
const SPREADSHEET_ID = "88daa54c3173ab6996beabdf47dbed277d487b53";

// Initialize Google Sheets API
const initializeGoogleSheets = async () => {
  const auth = new google.auth.JWT({
    email: GOOGLE_SHEETS_CLIENT_EMAIL,
    key: GOOGLE_SHEETS_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  return sheets;
};

// Handle form submissions
export async function POST(request: Request) {
  try {
    const { formType, data } = await request.json();

    if (!formType || !data) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sheets = await initializeGoogleSheets();
    let sheetName = "";
    let values: any[] = [];

    switch (formType) {
      case "request-show":
        sheetName = "Show Requests";
        values = [
          [
            new Date().toISOString(),
            data.name,
            data.phone,
            data.email,
            data.socialMedia,
            data.date ? new Date(data.date).toLocaleDateString() : "",
            data.description,
          ],
        ];
        break;

      case "collaborate":
        sheetName = "Collaboration Requests";
        values = [
          [
            new Date().toISOString(),
            data.stageName,
            data.email,
            data.phone,
            data.description,
          ],
        ];
        break;

      default:
        return NextResponse.json({ error: "Invalid form type" }, { status: 400 });
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetName,
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting to Google Sheets:", error);
    return NextResponse.json({ error: "Failed to submit form data" }, { status: 500 });
  }
}

// Fetch upcoming shows for the calendar
export async function GET() {
  try {
    const sheets = await initializeGoogleSheets()
    const sheetName = "Upcoming Shows"

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:C`, // A: date, B: title, C: location
    })

    const rows = response.data.values
    if (!rows || rows.length === 0) {
      return NextResponse.json({ upcomingShows: [] })
    }

    const upcomingShows = rows.slice(1).map((row) => ({
      date: new Date(`${row[0]}T00:00:00Z`).toISOString(), // 🔥 Forzamos UTC
      title: row[1],
      location: row[2],
    }))

    return NextResponse.json({ upcomingShows })
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
