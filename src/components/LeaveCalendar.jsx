import { useState } from "react";

const fmt = (iso) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

export default function LeaveCalendar({ leaves, onDelete }) {
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });

  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const firstDay = new Date(view.y, view.m, 1).getDay();
  const monthName = new Date(view.y, view.m).toLocaleString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const shifts = (n) =>
    setView((v) => {
      const d = new Date(v.y, v.m + n, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });

  const leaversOn = (d) => {
    const date = new Date(view.y, view.m, d);
    return leaves.filter(
      (l) => date >= new Date(l.mulai) && date <= new Date(l.selesai)
    );
  };

  const isToday = (d) =>
    today.getFullYear() === view.y && today.getMonth() === view.m && today.getDate() === d;

  return (
    <div className="border-t-2 border-slate-900 pt-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => shifts(-1)}
          aria-label="Bulan sebelumnya"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-lg transition hover:border-slate-900"
        >
          ‹
        </button>
        <h2 className="font-display text-xl font-bold capitalize tracking-tight">{monthName}</h2>
        <button
          onClick={() => shifts(1)}
          aria-label="Bulan berikutnya"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-lg transition hover:border-slate-900"
        >
          ›
        </button>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-1 text-center">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
          <div key={d} className="py-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            {d}
          </div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={"e" + i} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const d = i + 1;
          const who = leaversOn(d);
          return (
            <div
              key={i}
              title={who.map((w) => w.nama).join(", ")}
              className={`relative py-2 text-sm transition ${
                who.length > 0
                  ? "rounded-full bg-orange-600 font-bold text-white"
                  : isToday(d)
                    ? "rounded-full font-bold text-orange-600 ring-1 ring-orange-600"
                    : "rounded-full text-slate-600 hover:bg-slate-100"
              }`}
            >
              {d}
              {who.length > 1 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[9px] font-bold text-white">
                  {who.length}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-5 text-xs text-slate-500">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-600" /> Ada cuti
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full ring-1 ring-orange-600" /> Hari ini
        </span>
      </div>

      <h3 className="font-display mt-8 text-lg font-bold tracking-tight">
        Pengajuan <span className="text-slate-400">({leaves.length})</span>
      </h3>
      <div className="mt-2 divide-y divide-slate-200 border-y border-slate-200">
        {leaves.map((l, i) => (
          <div key={i} className="flex items-center gap-4 py-4">
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-slate-900">{l.nama}</div>
              <div className="text-sm text-slate-500">
                {l.divisi} · {fmt(l.mulai)} — {fmt(l.selesai)}
              </div>
            </div>
            <button
              onClick={() => onDelete?.(i)}
              className="text-xs font-bold uppercase tracking-widest text-slate-400 transition hover:text-red-600"
            >
              Hapus
            </button>
          </div>
        ))}
        {leaves.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">Belum ada pengajuan cuti</p>
        )}
      </div>
    </div>
  );
}
