# AI Rules & Tech Stack

## Tech Stack
- **React 19 & Vite**: Modern frontend framework and build tool for high performance.
- **Supabase**: Backend-as-a-Service for PostgreSQL database, Authentication, and Storage.
- **React Bootstrap**: Primary UI library for responsive components and grid system.
- **Bootstrap Icons**: Standardized icon set for all visual indicators.
- **SweetAlert2**: Enhanced alert and confirmation dialogs for better UX.
- **Google Generative AI (Gemini)**: Integration for AI-powered features and natural language queries.
- **React Router**: Client-side routing and protected route management.

## Library Usage Rules
- **UI Components**: Always use **React Bootstrap** components (e.g., `Container`, `Row`, `Col`, `Modal`, `Button`) instead of raw HTML or other UI libraries.
- **Icons**: Use **Bootstrap Icons** via the `bi` class prefix (e.g., `<i className="bi bi-people"></i>`).
- **Database & Auth**: All data fetching and user authentication must go through the **Supabase** client configured in `src/database/supabaseconfig.js`.
- **Alerts & Confirmations**: Use **SweetAlert2** (`Swal`) for critical user confirmations and stylized notifications.
- **AI Features**: Utilize the **Google Generative AI** SDK for any natural language processing or intelligent assistant features.
- **Navigation**: Use **React Router** hooks (`useNavigate`, `useLocation`) and components (`Link`, `Navigate`) for all internal routing.
- **Styling**: Combine **Bootstrap** utility classes with custom CSS in `src/App.css` or `src/index.css` when specific overrides are needed.