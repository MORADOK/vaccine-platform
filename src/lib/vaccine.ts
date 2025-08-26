export type VaccineKey = "flu"|"hep_b"|"tetanus"|"shingles"|"hpv"|"pneumonia"|"chickenpox"|"rabies";

export const vaccineIntervals = {
  flu: { label: "วัคซีนไข้หวัดใหญ่", intervals: [0,365], doseLabels: ["เข็มที่ 1","ฉีดกระตุ้นปีหน้า"] },
  hep_b: { label: "วัคซีนไวรัสตับอักเสบบี", intervals: [0,28,168], doseLabels: ["โดส 1","โดส 2 (1 เดือน)","โดส 3 (6 เดือน)"] },
  tetanus: { label: "วัคซีนป้องกันบาดทะยัก", intervals: [0,28,196], doseLabels: ["โดส 1","โดส 2 (1 เดือน)","โดส 3 (หลังจากโดส 2 อีก 6 เดือน)"] },
  shingles: { label: "วัคซีนงูสวัด", intervals: [0,84], doseLabels: ["โดส 1","โดส 2 (3 เดือน)"] },
  hpv: { label: "วัคซีนป้องกันมะเร็งปากมดลูก", intervals: [0,28,168], doseLabels: ["โดส 1","โดส 2 (1 เดือน)","โดส 3 (6 เดือน)"] },
  pneumonia: { label: "วัคซีนปอดอักเสบ", intervals: [0,56], doseLabels: ["โดส 1","โดส 2 (2 เดือน)"] },
  chickenpox: { label: "วัคซีนอีสุกอีใส", intervals: [0,28], doseLabels: ["โดส 1","โดส 2 (1 เดือน)"] },
  rabies: { label: "วัคซีนพิษสุนัขบ้า", intervals: [0,3,7,14,28], doseLabels: ["เข็มที่ 1 (วันแรก)","เข็มที่ 2 (วันที่ 3)","เข็มที่ 3 (วันที่ 7)","เข็มที่ 4 (วันที่ 14)","เข็มที่ 5 (วันที่ 28)"] }
} as const;

export type DosePlan = { dose:number; doseLabel:string; appointmentDate:string; };

export function formatDateISO(d: Date){
  const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,"0"), day=String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}

export function planFor(vaccine: VaccineKey, startDate?: Date): DosePlan[] {
  const map = (vaccineIntervals as any)[vaccine];
  const base = startDate ?? new Date();
  return map.intervals.map((days:number, i:number)=> {
    const d = new Date(base); d.setDate(d.getDate()+days);
    return { dose: i+1, doseLabel: map.doseLabels[i] ?? `เข็มที่ ${i+1}`, appointmentDate: formatDateISO(d) };
  });
}
