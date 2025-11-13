# Interview Management System

A comprehensive interview management system that allows multiple panelists to add and view feedback for interviewees. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Home Page**: Displays all interviews with interviewee details and who added them
- **Interview Details Page**: Shows comprehensive interviewee information with resume and job description
- **Multi-Panelist Feedback**: Anyone with the link can view interviews and add feedback
- **PDF Upload Support**: Upload resume and job description PDFs for each interviewee
- **Rating System**: Optional 1-10 rating scale for feedback
- **No Authentication Required**: Simple, open access for easy collaboration

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: JSON file-based storage
- **UI Components**: Custom components (Button, Card, Input, Textarea, Dialog, Label)

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Adding an Interviewee

1. Click the "Add Interviewee" button on the home page
2. Fill in the required fields:
   - Name
   - Email
   - Your Name (person adding the interviewee)
3. Optionally upload:
   - Resume (PDF)
   - Job Description (PDF)
4. Click "Add Interviewee"

### Viewing Interview Details

1. Click on any interview card on the home page
2. View interviewee details and any uploaded documents
3. See all existing feedback from panelists

### Adding Feedback

1. Navigate to an interview's detail page
2. Scroll to the "Add Feedback" section
3. Fill in:
   - Your Name (panelist name)
   - Rating (optional, 1-10)
   - Feedback (required)
4. Click "Submit Feedback"

## Project Structure

```
interview-feedback/
├── app/
│   ├── api/              # API routes
│   │   ├── interviews/   # Interview CRUD endpoints
│   │   └── upload/       # File upload endpoint
│   ├── interview/[id]/   # Interview detail page
│   ├── page.tsx          # Home page
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # Reusable UI components
│   └── add-interview-dialog.tsx
├── lib/
│   ├── db.ts             # Database operations
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
├── data/                 # JSON database storage
└── public/
    └── uploads/          # Uploaded PDF files
```

## API Endpoints

- `GET /api/interviews` - List all interviews
- `POST /api/interviews` - Create new interview
- `GET /api/interviews/[id]` - Get interview details
- `PUT /api/interviews/[id]` - Update interview
- `DELETE /api/interviews/[id]` - Delete interview
- `GET /api/interviews/[id]/feedbacks` - Get interview feedbacks
- `POST /api/interviews/[id]/feedbacks` - Add feedback
- `POST /api/upload` - Upload PDF file

## Data Storage

The system uses a simple JSON file-based storage system located in the `data/` directory. All interview data and feedback are stored in `data/db.json`. Uploaded files are stored in `public/uploads/`.

## Build for Production

```bash
npm run build
npm start
```

## Notes

- No authentication is required - anyone with the link can view and add feedback
- PDF files are the only supported format for resume and job description uploads
- All timestamps are stored in ISO 8601 format
- The system automatically sorts interviews and feedback by creation date (newest first)
