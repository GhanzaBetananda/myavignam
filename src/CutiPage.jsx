import { useMemo, useState } from "react";
import LeaveCalendar from "./components/LeaveCalendar";
import LeaveWizard from "./components/LeaveWizard";
import { loadLeaves, saveLeaves } from "./utils/storage";
import { MAX_CUTI_PER_DATE } from "./utils/data";
import { getLoginProfile } from "./utils/session";

function countDaysInMonth(leaves, y, m) {
  const dates = new Set();
  leaves.forEach((l) => {
    const start = new Date(l.mulai);
    const end = new Date(l.selesai);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getFullYear() === y && d.getMonth() === m) {
        dates.add(d.toISOString().slice(0, 10));
      }
    }
  });
  return dates.size;
}

export default function CutiPage() {
  const loginProfile = getLoginProfile()
  const [leaves, setLeaves] = useState(() => loadLeaves());
  const milikSaya = useMemo(
    () => leaves.filter((l) => l.nama === loginProfile.nama),
    [leaves, loginProfile.nama]
  )
  const now = new Date();
  const bulanIni = countDaysInMonth(milikSaya, now.getFullYear(), now.getMonth());

  const removeLeave = (idx) => {
    const target = milikSaya[idx]
    const globalIdx = leaves.indexOf(target)
    const next = leaves.filter((_, i) => i !== globalIdx);
    saveLeaves(next);
    setLeaves(next);
  };

  return (
    <div className="bg-white text-slate-900">
      <div className="border-b border-slate-200">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_320px] lg:py-16">
          <div>
            <p className="anim-fade-up flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
              <span className="inline-block h-px w-10 bg-orange-600" />
              Layanan cuti
            </p>
            <h1 className="anim-fade-up-1 font-display mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Ajukan cuti, pantau jadwal.
            </h1>
            <p className="anim-fade-up-2 mt-4 max-w-lg text-slate-500">
              Diajukan otomatis atas nama {loginProfile.nama} — satu hari atau beberapa
              hari beruntun, maksimal 3 hari.
            </p>
          </div>
          <dl className="anim-fade-up-2 space-y-0 self-end border-t border-slate-200">
            {[
              [milikSaya.length, 'Pengajuan saya'],
              [bulanIni, 'Hari cuti saya bulan ini'],
              [`${MAX_CUTI_PER_DATE} orang`, 'Batas per tanggal'],
            ].map(([v, l]) => (
              <div key={l} className="flex items-baseline justify-between gap-4 border-b border-slate-200 py-3">
                <dt className="text-sm text-slate-500">{l}</dt>
                <dd className="font-display text-2xl font-bold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <main className="mx-auto grid max-w-7xl items-start gap-12 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:py-16">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            <span className="font-display mr-2 text-orange-600">01</span> Formulir pengajuan
          </p>
          <div className="mt-4">
            <LeaveWizard leaves={leaves} onSuccess={(next) => setLeaves(next)} />
          </div>
        </section>
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            <span className="font-display mr-2 text-orange-600">02</span> Kalender jadwal
          </p>
          <div className="mt-4">
            <LeaveCalendar leaves={milikSaya} onDelete={removeLeave} />
          </div>
        </section>
      </main>
    </div>
  );
}
