import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchPatients, assignSchedule } from "../utils/api";
import { planFor, VaccineKey } from "../lib/vaccine";

type Patient = { LineUserID: string; PatientName?: string; PhoneNumber?: string; Email?: string };

export default function StaffDashboard() {
  const nav = useNavigate();
  const role = sessionStorage.getItem("staffRole") || "Reader";
  const name = sessionStorage.getItem("staffName") || "Staff";

  useEffect(() => {
    const token = sessionStorage.getItem("staffToken");
    if (!token) nav("/staff/login");
  }, []);

  const [q, setQ] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSearch() {
    try {
      setError(null);
      setLoading(true);
      const res = await searchPatients(q);
      setPatients(Array.isArray(res?.items) ? res.items : []);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  const [selected, setSelected] = useState<Patient | null>(null);
  const [vaccine, setVaccine] = useState<VaccineKey>("flu");
  const [firstDate, setFirstDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const plan = useMemo(() => planFor(vaccine, firstDate ? new Date(firstDate) : undefined), [vaccine, firstDate]);

  async function onAssign() {
    if (!selected) return;
    try {
      setError(null);
      await assignSchedule({ lineUserId: selected.LineUserID, vaccine, firstDoseDate: firstDate });
      alert("สร้างตารางนัดแล้ว และส่งไปยัง n8n เพื่อบันทึก/แจ้งเตือน");
    } catch (e: any) {
      setError(e.message || String(e));
    }
  }

  function Logout() {
    sessionStorage.clear();
    nav("/staff/login");
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-brand">Staff Portal</h1>
            <div className="text-sm text-gray-600">
              ยินดีต้อนรับ, {name} · <span className="pill">{role}</span>
            </div>
          </div>
          <button onClick={Logout} className="btn-outline">ออกจากระบบ</button>
        </header>

        <div className="grid md:grid-cols-2 gap-4">
          <section className="card">
            <h2 className="text-lg font-semibold">ค้นหาคนไข้</h2>
            <div className="mt-3 flex gap-2">
              <input className="field flex-1" value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหาด้วยชื่อ / เบอร์โทร / LINE UserID" />
              <button onClick={onSearch} className="btn-primary">ค้นหา</button>
            </div>
            {loading && <div className="mt-3 text-sm">กำลังค้นหา...</div>}
            {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
            <ul className="mt-4 divide-y">
              {patients.map((p) => (
                <li key={p.LineUserID} className="py-2 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{p.PatientName || "(ไม่ระบุชื่อ)"}</div>
                    <div className="text-xs text-gray-600 font-mono">{p.LineUserID}</div>
                  </div>
                  <button className="btn-outline" onClick={() => setSelected(p)}>เลือก</button>
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2 className="text-lg font-semibold">กำหนดวัคซีน & ตารางนัด</h2>
            {!selected ? (
              <div className="text-sm text-gray-600 mt-2">ยังไม่เลือกคนไข้</div>
            ) : (
              <div className="mt-3 space-y-3">
                <div className="text-sm">คนไข้: <span className="font-medium">{selected.PatientName || selected.LineUserID}</span></div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700">วัคซีน</label>
                  <select className="field" value={vaccine} onChange={(e) => setVaccine(e.target.value as VaccineKey)}>
                    <option value="flu">วัคซีนไข้หวัดใหญ่</option>
                    <option value="hep_b">ไวรัสตับอักเสบบี</option>
                    <option value="tetanus">บาดทะยัก</option>
                    <option value="shingles">งูสวัด</option>
                    <option value="hpv">HPV</option>
                    <option value="pneumonia">ปอดอักเสบ</option>
                    <option value="chickenpox">อีสุกอีใส</option>
                    <option value="rabies">พิษสุนัขบ้า</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700">วันที่ฉีดเข็มแรก</label>
                  <input className="field" type="date" value={firstDate} onChange={(e) => setFirstDate(e.target.value)} />
                </div>
                <div className="p-3 rounded-xl bg-brand-50">
                  <div className="text-sm font-semibold text-brand-800">ตารางนัด</div>
                  <ul className="mt-2 space-y-1 text-sm">
                    {plan.map((p) => (
                      <li key={p.dose} className="flex items-center justify-between">
                        <span>{p.doseLabel}</span>
                        <span className="font-medium">{p.appointmentDate}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <button className="btn-primary flex-1" onClick={onAssign} disabled={role === "Reader"}>บันทึก & แจ้งเตือน</button>
                </div>
                {role === "Reader" && <div className="text-xs text-gray-500">* สิทธิ์ Reader ไม่สามารถสร้างตารางได้</div>}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
