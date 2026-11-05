# COVID-19 Early Outbreak Dashboard

A responsive, no-login web dashboard for exploring the supplied COVID-19 country time-series snapshots from 1 February to 31 March 2020.

## Requirements
- A modern browser
- Python 3 (for the simple local web server), or another static HTTP server
- Internet access to load Chart.js from its CDN

## Run the dashboard
Browsers commonly block `fetch()` requests to local JSON files opened using `file://`. Start a local server from the project root:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser. Keep the terminal/server running while using the dashboard.

## Features
- Country selector: China, Italy, South Korea, United States and South Africa
- Four metric cards: confirmed, deaths, recoveries and active cases
- Cumulative line chart for confirmed cases, deaths and recoveries
- Bar chart for the increase in confirmed cases between consecutive supplied observations
- Timeline slider that limits the dashboard to the selected observation date
- Responsive layout for desktop and tablet/mobile widths
- JSON loading error handling and chronological sorting

## Calculation rules
- **Active cases** = confirmed − deaths − recovered, using the latest visible observation.
- **Increase since previous observation** = current cumulative confirmed − previous cumulative confirmed.
- The first observation is shown as zero increase because the dataset does not include an earlier baseline.

## Important data limitation / ambiguity decision
The provided JSON is sparse: it contains only a handful of dated snapshots per country, not a row for every calendar day. Therefore, exact *daily* new case counts cannot be calculated from this file alone. The bar chart deliberately labels each value as the increase **since the previous available observation**, rather than misrepresenting an interval total as a one-day count. For example, if consecutive snapshots are 10 days apart, the bar represents the total increase over those 10 days. To produce true daily new cases, obtain daily cumulative observations (or a daily incident-case dataset) for every date.

Missing dates are not fabricated or filled with zero. Charts plot only dates actually supplied for each country. This avoids suggesting that no cases occurred on dates where the dataset simply has no record.

## Data source
The dataset metadata identifies the COVID-19 Data Repository by Johns Hopkins CSSE as its source. Preserve the original dataset and verify the appropriate repository citation/licence details before external publication.

## Testing checklist
1. Select China: latest supplied snapshot should show 81,554 confirmed, 3,312 deaths, 76,128 recoveries and 2,114 active cases.
2. Select Italy: latest supplied snapshot should show 105,792 confirmed, 12,428 deaths, 15,729 recoveries and 77,635 active cases.
3. Select South Africa: first available observation is 5 March 2020 with 1 confirmed case; latest snapshot is 1,353 confirmed, 5 deaths, 31 recoveries and 1,317 active cases.
4. Select South Korea and United States and confirm both charts and all cards update.
5. Move the timeline slider: cards and charts should stop at the selected observation.
6. Resize the browser to tablet/mobile width and confirm the cards and charts remain usable.
7. Check the browser developer console for errors.

## Evidence screenshots
Capture screenshots after running the dashboard for China, Italy and South Africa at minimum. Suggested filenames:
- `screenshots/china.png`
- `screenshots/italy.png`
- `screenshots/south-africa.png`

The `screenshots/` folder is included as a placeholder; add your actual browser screenshots before submission.
