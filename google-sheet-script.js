/**
 * SPECLAR CYBER TECHNOLOGIES - GOOGLE SHEETS WEBHOOK
 * 
 * INSTRUCTIONS TO CONNECT YOUR SITE TO GOOGLE SHEETS IN 2 MINUTES:
 * 1. Open Google Sheets (https://sheets.new) and create a new blank spreadsheet.
 * 2. Name your spreadsheet: "Speclar Website Leads".
 * 3. In the first row (Row 1), create these column headers:
 *    A1: Timestamp
 *    B1: Source
 *    C1: Organization / Name
 *    D1: Work Email
 *    E1: Phone Number
 *    F1: Service Requested
 *    G1: Timeline / Urgency
 *    H1: Target Scope / Notes
 * 4. Click menu "Extensions" -> "Apps Script".
 * 5. Delete any code in the editor, and paste THIS ENTIRE FILE.
 * 6. Click the blue "Deploy" button (top right) -> "New deployment".
 * 7. Click the gear icon next to "Select type" and choose "Web app".
 * 8. Set:
 *    - Description: "Speclar Form Handler"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (IMPORTANT: This allows your website to write rows)
 * 9. Click "Deploy". Authorize permissions if Google asks.
 * 10. Copy the "Web app URL" (starts with https://script.google.com/macros/s/...)
 * 11. Paste that URL into app.js at line 695: const GOOGLE_SHEET_WEBAPP_URL = "YOUR_URL_HERE";
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);

    // Auto-create headers if sheet is completely empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Source",
        "Organization / Name",
        "Work Email",
        "Phone Number",
        "Service Requested",
        "Timeline / Urgency",
        "Target Scope / Notes"
      ]);
      // Format header row bold with dark background
      var headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0f62fe");
      headerRange.setFontColor("#ffffff");
    }

    // Append new lead row
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.source || "Website Form",
      data.organization || data.name || "N/A",
      data.email || "N/A",
      data.phone || "N/A",
      data.service || "N/A",
      data.urgency || data.timeline || "N/A",
      data.scope || data.notes || "N/A"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("Speclar Google Sheets Webhook is active and running.")
    .setMimeType(ContentService.MimeType.TEXT);
}
