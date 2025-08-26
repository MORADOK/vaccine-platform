import { useEffect, useState } from "react";
import liff from "@line/liff";
import { registerPatientViaLIFF, bookVaccineViaLIFF } from "../utils/api";
import { planFor, VaccineKey } from "../lib/vaccine";

const LIFF_ID = import.meta.env.VITE_LIFF_ID;

export default function LIFFRegister() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ userId: string; displayName: string } | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [vaccine, setVaccine] = useState<VaccineKey>("flu");
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!LIFF_ID) throw new Error("Missing VITE_LIFF_ID");
        await liff.init({ liffId: LIFF_ID });
        if (!liff.isLoggedIn()) liff.login();
        const prof = await liff.getProfile();
        setProfile({ userId: prof.userId, displayName: prof.displayName });
        setName(prof.displayName || "");
      } catch (e: any) {
        setError(e.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onRegister() {
    if (!profile) return;
    try {
      setError(null);
      const payload = await registerPatientViaLIFF({
        lineUserId: profile.userId,
        patientName: name.trim() || profile.displayName,
        phoneNumber: phone || undefined,
        email: email || undefined,
      });
      setResult({ ok: true, stage: "register", data: payload });
    } catch (e: any) {
      setError(e.message || String(e));
    }
  }

  async function onQuickBook() {
    if (!profile) return;
    try {
      setError(null);
      const todayISO = new Date().toISOString().slice(0, 10);
      const payload = await bookVaccineViaLIFF({
        lineUserId: profile.userId,
        vaccine,
        registerDate: todayISO,
      });
      setResult({ ok: true, stage: "book", data: payload });
    } catch (e: any) {
      setError(e.message || String(e));
    }
  }

  const plan = planFor(vaccine);

  if (loading) return <div className="p-6 text-center">กำลังโหลด LIFF...</div>;
  if (error) return <div className="p-6 text-center text-red-600">เกิดข้อผิดพลาด: {error}</div>;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-xl mx-auto card">
        <h2 className="text-2xl font-bold text-brand text-center">ลงทะเบียนคนไข้</h2>
        {profile && (
          <p className="text-center text-sm text-gray-600 mt-1">
            LINE UserID: <span className="font-mono">{profile.userId}</span>
          </p>
        )}

        <div className="mt-6 space-y-3">
          <div>
            <label className="block mb-1 text-sm text-gray-700">ชื่อ-สกุล</label>
            <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="ชื่อจาก LINE จะถูกใส่อัตโนมัติ" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-sm text-gray-700">เบอร์โทร</label>
              <input className="field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0812345678" />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-700">อีเมล (ถ้ามี)</label>
              <input className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button className="btn-primary flex-1" onClick={onRegister}>บันทึกข้อมูล</button>
        </div>

        <hr className="my-6" />

        <div className="space-y-3">
          <div>
            <label className="block mb-1 text-sm text-gray-700">เลือกรายการวัคซีน (Quick Book)</label>
            <select className="field" value={vaccine} onChange={(e) => setVaccine(e.target.value as any)}>
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

          <div className="p-3 rounded-xl bg-brand-50">
            <div className="text-sm font-semibold text-brand-800">ตารางนัดโดยประมาณ</div>
            <ul className="mt-2 space-y-1 text-sm">
              {plan.map((p) => (
                <li key={p.dose} className="flex items-center justify-between">
                  <span>{p.doseLabel}</span>
                  <span className="font-medium">{p.appointmentDate}</span>
                </li>
              ))}
            </ul>
          </div>

          <button className="btn-outline w-full" onClick={onQuickBook}>จองวัคซีนทันที</button>
        </div>

        {result && (
          <div className="mt-6 text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">
            <div className="font-semibold">ผลลัพธ์:</div>
            <pre className="overflow-auto">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
