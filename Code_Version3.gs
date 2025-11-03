function sendExpiryAlerts() {
  const config = {
    sheetNames: ['Food', 'Medicine'],
    thresholdDays: 30,
    recipient: Session.getActiveUser().getEmail(),
    dateHeader: 'Expiry Date',
    nameHeader: 'Item Name'
  };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const now = new Date();
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const sections = [];

  config.sheetNames.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;

    const data = sheet.getDataRange().getValues();
    if (!data.length) return;

    const headers = data[0].map(h => String(h).trim());
    const nameIdx = headers.indexOf(config.nameHeader);
    const expiryIdx = headers.indexOf(config.dateHeader);
    if (nameIdx === -1 || expiryIdx === -1) return;

    const lines = [];
    for (let i = 1; i < data.length; i++) {
      const itemName = data[i][nameIdx];
      const rawDate = data[i][expiryIdx];

      if (!itemName || !rawDate) continue;

      const expiryDate = rawDate instanceof Date ? rawDate : new Date(rawDate);
      if (isNaN(expiryDate)) continue;

      const daysToExpire = Math.floor((expiryDate - now) / MS_PER_DAY);

      if (daysToExpire >= 0 && daysToExpire <= config.thresholdDays) {
        lines.push(`- ${itemName} (Expires: ${expiryDate.toDateString()} • in ${daysToExpire} day${daysToExpire !== 1 ? 's' : ''})`);
      }
    }

    if (lines.length) {
      sections.push(`**${sheetName} items expiring within ${config.thresholdDays} days:**\n${lines.join('\n')}`);
    }
  });

  if (!sections.length) {
    // Nothing to send today
    return;
  }

  const message = sections.join('\n\n');

  MailApp.sendEmail({
    to: config.recipient,
    subject: `Items Expiring Soon (within ${config.thresholdDays} days)`,
    body: message
  });
}

/**
 * Optional helper to schedule a daily email at ~08:00.
 * Run once to create the trigger, or configure via UI.
 */
function createDailyTrigger() {
  ScriptApp.newTrigger('sendExpiryAlerts')
    .timeBased()
    .atHour(8)       // Adjust to your preferred hour (0–23)
    .everyDays(1)
    .create();
}