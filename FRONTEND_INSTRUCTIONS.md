# Frontend Instructions - Sistem Manajemen Cuti Karyawan

## 🎯 Overview
Aplikasi web modern untuk manajemen cuti karyawan yang terintegrasi dengan backend API yang sudah dibuat.

---

## 📋 Tech Stack Recommendations

- **Framework**: Next.js 15 dengan App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand / React Context
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod
- **Date Handling**: date-fns
- **HTTP Client**: Axios / Fetch API
- **Icons**: Lucide React
- **Charts**: Recharts / Chart.js
- **Notifications**: React Hot Toast

---

## 🏗️ Project Structure (Next.js)

```
frontend-cuti/
├── src/
│   ├── app/                          # App Router pages
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Dashboard home
│   │   ├── karyawan/                 # Karyawan module
│   │   │   ├── page.tsx              # List karyawan
│   │   │   ├── [id]/page.tsx         # Detail karyawan
│   │   │   └── tambah/page.tsx       # Form tambah
│   │   ├── cuti-tahunan/             # Cuti Tahunan module
│   │   │   ├── page.tsx              # List & generate
│   │   │   └── [id]/page.tsx         # Detail
│   │   └── cuti/                     # Cuti module
│   │       ├── page.tsx              # List cuti
│   │       ├── tambah/page.tsx       # Form pengajuan
│   │       ├── rekap/page.tsx        # Rekap bulanan
│   │       └── summary/page.tsx      # Summary overview
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── table.tsx
│   │   │   ├── form.tsx
│   │   │   └── ...
│   │   ├── layout/                   # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Breadcrumb.tsx
│   │   ├── karyawan/                 # Karyawan components
│   │   │   ├── KaryawanTable.tsx
│   │   │   ├── KaryawanForm.tsx
│   │   │   ├── KaryawanCard.tsx
│   │   │   └── KaryawanFilter.tsx
│   │   ├── cuti-tahunan/             # Cuti Tahunan components
│   │   │   ├── CutiTahunanTable.tsx
│   │   │   ├── GenerateDialog.tsx
│   │   │   └── SaldoCard.tsx
│   │   └── cuti/                     # Cuti components
│   │       ├── CutiTable.tsx
│   │       ├── CutiForm.tsx
│   │       ├── CutiCalendar.tsx
│   │       ├── RekapBulanan.tsx
│   │       └── SummaryDashboard.tsx
│   │
│   ├── lib/                          # Utilities
│   │   ├── api.ts                    # Axios instance / fetch wrapper
│   │   ├── utils.ts                  # Helper functions
│   │   └── constants.ts              # Constants & enums
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useKaryawan.ts            # Karyawan data fetching
│   │   ├── useCutiTahunan.ts         # Cuti tahunan hooks
│   │   ├── useCuti.ts                # Cuti hooks
│   │   └── useToast.ts               # Toast notifications
│   │
│   ├── types/                        # TypeScript types
│   │   ├── karyawan.types.ts
│   │   ├── cuti-tahunan.types.ts
│   │   ├── cuti.types.ts
│   │   └── api.types.ts
│   │
│   ├── schemas/                      # Zod validation schemas
│   │   ├── karyawan.schema.ts
│   │   ├── cuti-tahunan.schema.ts
│   │   └── cuti.schema.ts
│   │
│   └── stores/                       # State management (Zustand)
│       ├── useAuthStore.ts           # Auth state (future)
│       └── useAppStore.ts            # Global app state
│
├── public/                           # Static assets
├── .env.local                        # Environment variables
├── tailwind.config.ts                # Tailwind config
├── next.config.js                    # Next.js config
├── tsconfig.json                     # TypeScript config
└── package.json
```

---

## 🎨 UI/UX Design Requirements

### Color Scheme
- **Primary**: Blue (#3B82F6) - Actions, links
- **Success**: Green (#10B981) - Approved, active status
- **Warning**: Yellow (#F59E0B) - Pending, warnings
- **Danger**: Red (#EF4444) - Rejected, delete actions
- **Info**: Cyan (#06B6D4) - Information
- **Neutral**: Gray scale - Text, borders, backgrounds

### Layout
- **Sidebar Navigation** (collapsible on mobile)
  - Dashboard
  - Data Karyawan
  - Cuti Tahunan
  - Data Cuti
  - Laporan (future)
- **Header**: Breadcrumb, user profile, notifications
- **Content Area**: Main workspace with cards/tables
- **Mobile Responsive**: Hamburger menu, touch-friendly

### Key UI Components
- ✅ Data tables dengan sorting, filtering, pagination
- ✅ Forms dengan real-time validation
- ✅ Modal dialogs untuk confirmations
- ✅ Toast notifications untuk feedback
- ✅ Loading states & skeletons
- ✅ Empty states dengan ilustrasi
- ✅ Date pickers dengan working days highlight
- ✅ Charts untuk visualization (rekap, summary)

---

## 📱 Features & Pages

### 1. **Dashboard** (Home)
- **Summary Cards**:
  - Total Karyawan Aktif
  - Total Cuti Bulan Ini
  - Saldo Cuti Terendah (warning)
  - Karyawan Tanpa Hak Cuti (alert)
- **Recent Activities**: 5 cuti terbaru
- **Chart**: Trend penggunaan cuti (6 bulan terakhir)
- **Quick Actions**: Tambah Karyawan, Ajukan Cuti, Generate Cuti Tahunan

### 2. **Data Karyawan** (`/karyawan`)
- **List View**:
  - Table: NIK, Nama, Email, No HP, Jabatan, Status, Aksi
  - Filter: Status (Aktif/Nonaktif), Search by nama/NIK
  - Sorting: by nama, tanggal bergabung
  - Pagination: 10/25/50 per page
  - Action buttons: Edit, Deactivate, View Detail
- **Form Tambah/Edit**:
  - Fields: NIK, nama, email, no_hp, alamat, tanggal_bergabung, jabatan, status_karyawan
  - Validasi: NIK unik, email format, tanggal tidak future
  - Auto-save indicator
- **Detail View**:
  - Info lengkap karyawan
  - History hak cuti tahunan (table)
  - History penggunaan cuti (table)
  - Total saldo saat ini

### 3. **Cuti Tahunan** (`/cuti-tahunan`)
- **List View**:
  - Table: Karyawan, Tahun, Tipe, Saldo Awal, Terpakai, Sisa, Expire Date
  - Filter: Tahun, Karyawan, Tipe pemberian
  - Sort by: Sisa saldo (ascending)
  - Highlight: Saldo < 3 hari (warning color)
- **Generate Dialog**:
  - Option 1: Generate per karyawan (select karyawan, pilih tahun)
  - Option 2: Generate bulk semua karyawan (pilih tahun)
  - Preview: Estimasi berapa karyawan akan diproses
  - Progress indicator saat generate
  - Result summary: Success count, failed count, messages
- **Detail View**:
  - Info lengkap hak cuti
  - Calculation breakdown (carry forward, prorate, dll)
  - History penggunaan dari hak cuti ini

### 4. **Data Cuti** (`/cuti`)
- **List View**:
  - Table: Karyawan, Jenis, Tanggal Mulai-Selesai, Durasi, Keterangan, Status
  - Filter: 
    - Jenis cuti (dropdown: TAHUNAN, SAKIT, dll)
    - Status (APPROVED, PENDING, REJECTED)
    - Tanggal (date range picker)
    - Karyawan (autocomplete)
  - Color coding: Status dengan badge colors
  - Action: View detail, Delete (dengan confirm)
- **Form Ajukan Cuti**:
  - Select: Karyawan (autocomplete dengan info saldo)
  - Select: Jenis cuti
  - Date picker: Tanggal mulai & selesai (highlight working days)
  - Auto-calculate: Jumlah hari (working days only)
  - Show warning: Jika saldo tidak cukup (untuk TAHUNAN)
  - Textarea: Keterangan
  - Select: Status (default APPROVED untuk direct record)
  - Submit dengan loading state
- **Rekap Bulanan** (`/cuti/rekap`):
  - Filter: Bulan & Tahun
  - Summary cards: Total cuti, per jenis cuti
  - Table: Detail per karyawan (nama, jumlah cuti, jenis)
  - Export to Excel (future)
- **Summary Overview** (`/cuti/summary`):
  - Cards: Total karyawan, rata-rata cuti per karyawan
  - Breakdown by jenis cuti (pie chart)
  - Trend 12 bulan terakhir (line chart)
  - Top 5 karyawan dengan cuti terbanyak (bar chart)

---

## 🔌 API Integration

### Base Configuration
```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data, // Return only data
  (error) => {
    // Handle errors consistently
    const message = error.response?.data?.message || 'Something went wrong';
    toast.error(message);
    return Promise.reject(error);
  }
);
```

### API Hooks Example
```typescript
// hooks/useKaryawan.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useKaryawan = () => {
  return useQuery({
    queryKey: ['karyawan'],
    queryFn: () => api.get('/karyawan'),
  });
};

export const useCreateKaryawan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => api.post('/karyawan', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['karyawan']);
      toast.success('Karyawan berhasil ditambahkan');
    },
  });
};
```

---

## ✅ Development Flow

### Phase 1: Setup & Configuration (2-3 hours)
1. ✅ Initialize Next.js project dengan TypeScript
2. ✅ Install dependencies (Tailwind, shadcn/ui, TanStack Query, dll)
3. ✅ Setup shadcn/ui components
4. ✅ Configure Tailwind dengan custom colors
5. ✅ Setup environment variables
6. ✅ Create base layout (Sidebar, Header)
7. ✅ Setup API client & interceptors

### Phase 2: Karyawan Module (3-4 hours)
1. ✅ Create TypeScript types & Zod schemas
2. ✅ Create API hooks (useKaryawan, useCreateKaryawan, dll)
3. ✅ Build KaryawanTable component
4. ✅ Build KaryawanForm component
5. ✅ Build KaryawanFilter component
6. ✅ Implement list page (`/karyawan`)
7. ✅ Implement form page (`/karyawan/tambah`)
8. ✅ Implement detail page (`/karyawan/[id]`)
9. ✅ Add CRUD functionality dengan toast notifications

### Phase 3: Cuti Tahunan Module (2-3 hours)
1. ✅ Create types & schemas
2. ✅ Create API hooks
3. ✅ Build CutiTahunanTable component
4. ✅ Build GenerateDialog component
5. ✅ Implement list page dengan filter
6. ✅ Implement generate functionality (single & bulk)
7. ✅ Add progress indicator & result summary

### Phase 4: Cuti Module (4-5 hours)
1. ✅ Create types & schemas
2. ✅ Create API hooks
3. ✅ Build CutiTable component dengan advanced filters
4. ✅ Build CutiForm dengan date picker & validation
5. ✅ Implement list page
6. ✅ Implement form page dengan saldo checking
7. ✅ Implement rekap bulanan page dengan charts
8. ✅ Implement summary page dengan dashboard
9. ✅ Add delete functionality dengan rollback

### Phase 5: Dashboard & Polish (2-3 hours)
1. ✅ Build dashboard dengan summary cards
2. ✅ Add charts (Recharts)
3. ✅ Implement recent activities
4. ✅ Add loading states & skeletons
5. ✅ Add empty states
6. ✅ Mobile responsive testing
7. ✅ Performance optimization

### Phase 6: Testing & Refinement (2-3 hours)
1. ✅ Manual testing semua flows
2. ✅ Error handling improvements
3. ✅ Accessibility improvements (ARIA labels, keyboard nav)
4. ✅ SEO optimization (metadata)
5. ✅ Documentation (README)

**Total Estimated Time: 15-21 hours**

---

## 🔒 Future Enhancements

### Authentication & Authorization
- Login/Register dengan JWT
- Role-based access (Admin, Manager, Employee)
- Protected routes dengan middleware
- Session management

### Advanced Features
- Email notifications
- Export to Excel/PDF
- Calendar view untuk cuti
- Approval workflow (multi-level)
- File upload (surat sakit, dll)
- Dark mode toggle
- Multi-language (i18n)

### Technical Improvements
- Unit testing (Jest + React Testing Library)
- E2E testing (Playwright)
- Storybook untuk component documentation
- CI/CD pipeline
- Docker containerization
- PWA capabilities (offline support)

---

## 📦 Package.json Dependencies

```json
{
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@tanstack/react-query": "^5.62.0",
    "axios": "^1.7.0",
    "zustand": "^5.0.0",
    "react-hook-form": "^7.54.0",
    "zod": "^4.3.5",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.469.0",
    "recharts": "^2.15.0",
    "react-hot-toast": "^2.4.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.0"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^19",
    "typescript": "^5",
    "tailwindcss": "^3.4.0",
    "eslint": "^9",
    "prettier": "^3.4.0"
  }
}
```

---

## 🚀 Quick Start Commands

```bash
# Create Next.js project
npx create-next-app@latest frontend-cuti --typescript --tailwind --app --eslint

# Install shadcn/ui
npx shadcn@latest init

# Add components
npx shadcn@latest add button card table form dialog toast

# Install additional dependencies
npm install @tanstack/react-query axios zustand react-hook-form zod date-fns lucide-react recharts react-hot-toast

# Run development
npm run dev

# Build production
npm run build
npm start
```

---

## 🎯 Success Criteria

- ✅ All CRUD operations working correctly
- ✅ Real-time validation dengan Zod
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Fast performance (< 3s initial load)
- ✅ User-friendly error messages
- ✅ Consistent UI/UX across pages
- ✅ Accessible (WCAG 2.1 Level AA)
- ✅ Clean code dengan TypeScript strict mode
- ✅ Well-documented components

---

## 📝 Notes

- Backend API sudah siap di `http://localhost:3000/api`
- Gunakan `.env.local` untuk configuration
- Follow Next.js best practices (Server Components, optimistic updates)
- Prioritize user experience & performance
- Test di multiple browsers (Chrome, Firefox, Safari)

---

**Ready to build? Let's create an amazing frontend! 🚀**
