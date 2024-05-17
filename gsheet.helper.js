const { google } = require("googleapis");
const path = require("path");
const serviceAccountKeyFile = path.join(__dirname, "google-spread-sheet-keys.json");

async function _getGoogleSheetClient() {
	const auth = new google.auth.GoogleAuth({
		keyFile: serviceAccountKeyFile,
		scopes: ["https://www.googleapis.com/auth/spreadsheets"],
	});
	const authClient = await auth.getClient();

	return google.sheets({
		version: "v4",
		auth: authClient,
	});
}

async function _writeGoogleSheet(googleSheetClient, sheetId, tabName, range, data) {
	await googleSheetClient.spreadsheets.values.append({
		spreadsheetId: sheetId,
		range: `${tabName}!${range}`,
		valueInputOption: "USER_ENTERED",
		insertDataOption: "INSERT_ROWS",
		resource: {
			majorDimension: "ROWS",
			values: data,
		},
	});
}

module.exports = {
	_getGoogleSheetClient,
	_writeGoogleSheet,
};
