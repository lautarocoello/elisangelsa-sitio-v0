import { NextResponse } from "next/server"
import { google } from "googleapis"

// Environment variables
const GOOGLE_SHEETS_PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n") || "";
const GOOGLE_SHEETS_CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL || "";
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || "";

// Initialize Google Sheets API
const initializeGoogleSheets = async () => {
  const auth = new google.auth.JWT(
    GOOGLE_SHEETS_CLIENT_EMAIL,
    undefined,
    GOOGLE_SHEETS_PRIVATE_KEY,
    ["https://www.googleapis.com/auth/spreadsheets"]
  );

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
