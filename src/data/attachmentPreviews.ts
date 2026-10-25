// Prototype preview content for sample attachments. Real previews would be served from file storage.
export const imagePreviews: Record<string, string> = {
  'f-1': "/31946476-5672-47c8-b11b-841182ef8c5e.jpg",
  'f-3': "/31946476-5672-47c8-b11b-841182ef8c5e.jpg",
  'f-5': "/44544ea6-93ae-49cf-9646-fe3799cfd471.jpg",
  default: "/883fb685-3398-438a-8cc6-00176a30fa4a.jpg"
};

export const textPreviews: Record<string, string> = {
  'f-11': `10-24 05:41:12.884 E/AndroidRuntime: FATAL EXCEPTION: main
Process: app.cadence.mobile, PID: 18842
java.lang.IllegalStateException: DeepLinkRouter not initialised
    at app.cadence.links.DeepLinkRouter.resolve(DeepLinkRouter.kt:88)
    at app.cadence.links.SharedAvailabilityActivity.onCreate(SharedAvailabilityActivity.kt:41)
    at android.app.Activity.performCreate(Activity.java:9002)`,
  'f-7': `appointment_id,provider,start_time,location,status
A-882101,Dr. L. Moreno,2026-07-01T08:30,Eastside,completed
A-882102,Dr. L. Moreno,2026-07-01T09:00,Eastside,completed
A-882103,Dr. K. Iwu,2026-07-01T09:00,Riverside,no_show
…
A-892100,Dr. S. Patel,2026-08-14T15:30,Northgate,completed   ← row 10,000 (export stops)`,
  'f-8': `booking_ref,customer,resource_code,start,end
LS-000184,Harbor Logistics,DOCK-3,03/01/2024 07:00,03/01/2024 08:00
LS-000185,Westway Imports,DOCK-1,03/01/2024 07:30,03/01/2024 08:30
LS-000186,Harbor Logistics,DOCK-2,03/01/2024 08:00,03/01/2024 09:00`,
  'f-2': `{
  "log": {
    "entries": [
      { "request": { "method": "GET", "url": "https://lumen.cadence.app/sso/callback" },
        "response": { "status": 302, "redirectURL": "https://lumen.cadence.app/signin?error=nameid_mismatch" } }
    ]
  }
}`
};
