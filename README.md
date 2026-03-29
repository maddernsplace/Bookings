# Business Job Manager (MVP)

A lightweight web app to manage business jobs:

- Book jobs with customer details, date/time, address, and notes.
- Show bookings on a monthly calendar.
- Filter jobs by clicking a date in the calendar.
- Open navigation to the job site address (Google Maps directions link).

## Run

Because this is a static app, you can open `index.html` directly in your browser, or serve it locally:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Notes

- Data is stored in browser `localStorage` under `business_jobs_v1`.
- This is a starter MVP you can extend with reminders, staff allocation, recurring jobs, and invoicing.
