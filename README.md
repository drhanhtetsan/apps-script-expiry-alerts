# Google Sheets Expiry Alerts (Apps Script)

<p align="center">
  <img src="assets/banner.png" alt="Email Alerts for Items Expiring Soon in Google Sheets (Food/Medicine) using Apps Script" width="100%" />
</p>

Email yourself a daily summary of items that are expiring soon from one or more Google Sheets tabs (e.g., Food, Medicine). This Apps Script scans specified sheets for columns "Item Name" and "Expiry Date", and emails items expiring within a threshold window.

## Features
- Multiple sheet support (default: Food, Medicine)
- Threshold window in days (default: 30)
- Auto-detection of headers "Item Name" and "Expiry Date"
- Clean daily summary email
- Optional daily time-based trigger helper

## Sheet Setup
For each sheet you want to scan (default names: `Food`, `Medicine`):
- Include a header row with at least:
  - `Item Name`
  - `Expiry Date` (must be valid dates or date-formatted cells)

Example:

```
| Item Name | Expiry Date |
|-----------|-------------|
| Milk      | 2025-12-05  |
| Ibuprofen | 2025-11-22  |
```

## Configuration
Inside `Code.gs` (or your existing `Code_Version3.gs`):
- `sheetNames`: array of sheet tabs to scan
- `thresholdDays`: number of days ahead to include (e.g., 30)
- `recipient`: defaults to the active user email via `Session.getActiveUser().getEmail()`

## Deployment
1. Open your target Google Sheet.
2. Extensions → Apps Script → Create a new project.
3. Copy the contents of `Code.gs` (or `Code_Version3.gs`) into the editor and save.
4. Click Run → Authorize the script (first run).
5. Optional: create a trigger to run daily:
   - Triggers → Add Trigger
   - Choose function: `sendExpiryAlerts`
   - Event source: Time-driven
   - Type: Day timer, select hour, save
   - Or run `createDailyTrigger()` once.

## Notes
- The email is sent only if at least one sheet has items expiring within the threshold window.
- The script ignores rows with invalid/missing dates or item names.
- Dates are read from the sheet; ensure date formatting is consistent.

## Customization
- Change sheet names, threshold, or recipient in the `config` object.
- Add more sheets simply by appending to the `sheetNames` array.

## Banner image
- Upload your image as `assets/banner.png` in this repository (GitHub → Add file → Upload files) and the banner above will render automatically.
- If you prefer plain Markdown instead of the centered HTML block, replace it with:

```
![Email Alerts for Items Expiring Soon in Google Sheets (Food/Medicine) using Apps Script](assets/banner.png)
```

## License
MIT — see [LICENSE](./LICENSE_Version3.txt).