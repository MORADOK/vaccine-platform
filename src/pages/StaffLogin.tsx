import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkStaff } from "../utils/api";

export default function StaffLogin() {
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError(null);
      const res = await checkStaff({ staffId, password });
      if (!res || !res.ok) throw new Error(res?.message || "เข้าสู่ระบบไม่สำเร็จ");
      sessionStorage.setItem("staffToken", res.token);
      sessionStorage.setItem("staffRole", res.role);
      sessionStorage.setItem("staffName", res.name || staffId);
      navigate("/staff");
    } catch (e: any) {
      setError(e.message || String(e));
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <form onSubmit={onLogin} className="card max-w-sm w-full">
        <h2 className="text-2xl font-bold text-brand text-center">เข้าสู่ระบบเจ้าหน้าที่</h2>
        <div className="mt-6 space-y-3">
          <div>
            <label className="block mb-1 text-sm text-gray-700">รหัสพนักงาน</label>
            <input className="field" value={staffId} onChange={(e) => setStaffId(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">รหัสผ่าน</label>
            <input className="field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </div>
        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        <button className="btn-primary w-full mt-4" type="submit">เข้าสู่ระบบ</button>
      </form>
    </div>
  );
}
