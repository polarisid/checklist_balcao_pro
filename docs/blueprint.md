# **App Name**: Checklist Generator Pro

## Core Features:

- Header Inputs: User-friendly form with inputs for client, model, version, OS number, serial number, visit date, and technician name.
- Dynamic Checkboxes: Dynamic rendering of checkboxes based on the selected 'Bloco' (block) from a select dropdown.
- QR/Barcode Scanner: Scanner component with camera (real-time using @zxing/browser) and image upload modes for QR/Barcode reading to populate the serial number. Uses the ZXing library.
- Signature Capture: SignatureBox component using react-signature-canvas for capturing signatures.
- Automatic Local Storage: Automatic form saving to localStorage on every change, with auto-restore on page load.
- PDF Generation: PDF generation using pdf-lib, fetching a base PDF, drawing header texts, 'x' marks on checkboxes, observations, and the signature.

## Style Guidelines:

- Primary color: Soft blue (#A0D2EB), inspired by clarity, cleanliness, and efficiency.
- Background color: Light gray (#F0F4F8), almost the same hue as the primary, but desaturated and bright.
- Accent color: Muted green (#84A98C), to signal successful operations, since apps used for evaluation often need to display results that confirm proper operation.
- Body and headline font: 'Inter', a grotesque-style sans-serif known for its clean and readable design, is well-suited for both headlines and body text, promoting a professional and modern aesthetic.
- Simple and responsive layout with a max-width of 720px for readability.
- Simple line icons for actions and alerts, maintaining a clean interface.
- Subtle transitions and feedback animations for button presses and form saves.