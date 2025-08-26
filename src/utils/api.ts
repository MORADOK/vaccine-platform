const BASE = (import.meta as any).env.VITE_N8N_BASE_URL?.replace(/\/$/, "") || "";
const WEBHOOK_VACCINE_PATH = (import.meta as any).env.VITE_WEBHOOK_VACCINE_PATH || "Webhook-Vaccine";

async function jsonFetch(path: string, payload: any) {
  const url = `${BASE}/${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    mode: "cors",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  try { return await res.json(); } catch { return {}; }
}

export async function registerPatientViaLIFF(data: { lineUserId: string; patientName: string; phoneNumber?: string; email?: string; }) {
  return jsonFetch(WEBHOOK_VACCINE_PATH, { action: "register", ...data });
}

export async function bookVaccineViaLIFF(data: { lineUserId: string; vaccine: string; registerDate?: string; }) {
  return jsonFetch(WEBHOOK_VACCINE_PATH, { action: "book", ...data });
}

export async function checkStaff(credentials: { staffId: string; password: string; }) {
  const endpoint = ((import.meta as any).env.VITE_CHECK_STAFF_ENDPOINT || "CheckStaffToken").replace(/^\//,"");
  return jsonFetch(endpoint, credentials);
}

export async function searchPatients(query: string) {
  const endpoint = ((import.meta as any).env.VITE_PATIENT_SEARCH_ENDPOINT || "PatientsSearch").replace(/^\//,"");
  return jsonFetch(endpoint, { query });
}

export async function assignSchedule(payload: { lineUserId: string; vaccine: string; firstDoseDate?: string; }) {
  const endpoint = ((import.meta as any).env.VITE_ASSIGN_SCHEDULE_ENDPOINT || "AssignSchedule").replace(/^\//,"");
  return jsonFetch(endpoint, payload);
}
