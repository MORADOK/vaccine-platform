// src/pages/App.tsx
import { Link } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-xl w-full text-center">
        <div className="mb-4">
          <span className="pill">Vaccine System</span>
        </div>
        <h1 className="text-3xl font-bold text-brand">Home Hospital</h1>
        <p className="text-gray-600 mt-2">ระบบนัดฉีดวัคซีน โทนเขียว มินิมอล เรียบหรู</p>

        <div className="grid grid-cols-1 gap-3 mt-6">
          <Link to="/liff-register" className="btn-primary">
            ลงทะเบียนคนไข้ (LIFF)
          </Link>
          <Link to="/staff/login" className="btn-outline">
            เข้าสู่ระบบเจ้าหน้าที่
          </Link>
        </div>
      </div>
    </div>
  );
}
