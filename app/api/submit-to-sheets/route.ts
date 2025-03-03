import { NextResponse } from "next/server"
import { google } from "googleapis"

// Environment variables
const GOOGLE_SHEETS_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDAYHF+zPQNi3BW\n7kBMpARMX0KA//MOnspp79pBpHYFbnuK8XHYqjZmba7HpeB0xrqWvpMt/5qHCXqE\n5503W6elyIN4j6GZAZHubdJZ/UGvNOjJksuLsgsrBN9l2HhwxhDYhce7sTg+syrs\nwjigDWgmODk0vc+Q4ChDTCh89ICsYJH3U57AlsMsA8UH3/xMOVopV2oW/r91B9IW\nx3Fg2CYT1OW7qz36r1IORzsuoIMiE5Tx+ClICmtyHv0x8raYptMZU+lcxBVT6UwL\njdlQnGiu8ZjaqjUw+Vo4Y5DsAfuRjMk8micwo/fjWUn1kbY5tHTiium4/RDnCFN7\nluCjzi09AgMBAAECggEAFkm2LIDV+lHAM1oeufe7WxZ4RSt3f1H3VTG0NtcKfhOa\n8vHehOx80/4mJJGma8ZwbLGUqgd14ZTqtxuByUhFp+fkuiLjOoUGNrpOMh3Xg9Mx\n8H9LihpCaqVXCod7YLlvJIl5/AK1Z6eTXrhxHgifmzn4ABEeS1nPtbL3nTkomo/R\nkbUW7hfk3WT7VFV9xnnAWeyHafe9Wmfl2LrU6bXr+3hbgod+Lsm+tkA9NEIXTkiQ\np4CBD2WwW7AfO7YjJNeXze3KBLwUd76GeCSAsSmW7rO5blTbnK8C3A/Q7pdk8djs\nbogK4iXdgKFlq+EkS19/mI9Mqlyo9Ev7f2E8Cr8KkwKBgQDgs4uS0EooqHPX4xfv\nFItk0AYLVGXzS9BvLfdgDE6o8iScSHB/AVgqMWrkbCGOj3h5FC7kIbZ6toXshMEE\ntTAQ/d3rcsLOh9aAHBhfTIK/ry+FMEVJJ7+enFZQxuSYjOMJPb9J4yjJ8TFNzpU3\n7N9gFGS03XbFrINa8tPB98L4TwKBgQDbLEJYyFLXqj7JbvOTR3DcDlT19D0Oglpe\nlAch4iN8WqmvU6vT8+XTMkVGnwFn8oyUUIQ01xHtU3YJcFdSOcZFwZw3YdhfSVnh\nLpqy9O92HJ0dLWB04GzMxjDa2S5T7vLkn7WQ8kPvtNGlHFgN9qlGJByZ3u+PuV9V\ndz6YmGsSswKBgQDRo7Gcj+ggdsldqeoyjKBgthRtjZhwnVMh52jcm57n0MKHbK5I\nUCDJfMGVy6yjLQfhLwtwnGN7qb7ZJCJRGhp2P+REPxWxStq9O3khsGhsHi3fvWFn\nF0aX3JRLWMT97rQDczB85wqvHfA5/3sIal8dbOloNRcS5hjHSbZ3SYkF0QKBgDQv\nEYz6BV98FX74f94tQF3ku63j/TWbK9EhBaG3qiNNouEv1tWcWLg0W/I4oakSQw59\nLT03h/ktygjtSp01TFQHiR5WmaH2YQQQiJzbXLiOj4oG59RsKvuGpNM2qqUpW4O7\n0wsz46ELOG9LlFuewycEKhsozXk29c/vmGPUxompAoGBAIjKzgcfjbncqZyZUCMD\nGllbKYA3EmsSJDppYQfD4UrS3uZklVTHvClEIfXtCcTWPmPNTDjjdECU0H5PoHi+\n8u/L1bZPdEaS7c17rwUeilwlTXM2VByNO/olRlQnEKb+txwGFimVnBCahiOVq93g\nfwkR5YWj/m2YjDJFYMnB+i14\n-----END PRIVATE KEY-----\n";
const GOOGLE_SHEETS_CLIENT_EMAIL = "elisangelashowbrasil@elisangelashow.iam.gserviceaccount.com";
const SPREADSHEET_ID = "14G43BVcfLK8g3yiBuO7l7BwxOhGLmo0fgEuKoQpGtz8";

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
