import { NextResponse } from "next/server"
import { google } from "googleapis"

// Environment variables
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);

// Inicialización de Google Sheets

export const initializeGoogleSheets = async () => {
  const auth = new google.auth.JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
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
            data.date ? new Date(data.date).toLocaleDateString("es-AR") : "",
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
      range: `${sheetName}!A:D`, // A: date, B: title, C: location
    })

    const rows = response.data.values
    if (!rows || rows.length < 2) {
      return NextResponse.json({ upcomingShows: [] })
    }

    const upcomingShows = rows.slice(1).map((row) => {
      const [rawDate, title, location, link] = row

      // Validar que la fecha exista y sea válida
      if (!rawDate) return null

      // Interpretar fecha como DD/MM/YYYY y convertir a ISO sin zona horaria
      const [day, month, year] = rawDate.split("/")
      const localDate = new Date(`${year}-${month}-${day}T00:00:00`)

      if (isNaN(localDate.getTime())) return null // Fecha inválida

      return {
        date: localDate.toISOString(), // Se guarda como ISO (en UTC)
        title: title || "",
        location: location || "",
        link: link || "",
      }
    }).filter(Boolean) // Remover nulos

    return NextResponse.json({ upcomingShows })
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
