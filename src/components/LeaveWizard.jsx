import { useState } from "react";
import { saveLeaves } from "../utils/storage";
import { MAX_RANGE_DAYS } from "../utils/data";
import { getLoginProfile } from "../utils/session";

const inputCls =
  "mt-2 w-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-600";

const labelCls = "block text-xs font-bold uppercase tracking-widest text-slate-500";

export default function LeaveWizard({ leaves, onSuccess }) {
  const loginProfile = getLoginProfile()
  const [form, setForm] = useState({ mulai: "", selesai: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setError("");
    setDone(false);
    if (!form.mulai || !form.selesai)
      return setError("Tentukan tanggal mulai dan selesai terlebih dahulu.");
    const diff = (new Date(form.selesai) - new Date(form.mulai)) / 86400000 + 1;
    if (diff < 1 || diff > MAX_RANGE_DAYS)
      return setError(`Rentang cuti maksimal ${MAX_RANGE_DAYS} hari beruntun.`);
    const next = [...leaves, { divisi: loginProfile.divisi, nama: loginProfile.nama, mulai: form.mulai, selesai: form.selesai }];
    saveLeaves(next);
    onSuccess?.(next);
    setForm({ mulai: "", selesai: "" });
    setDone(true);
  };

  return (
    <form onSubmit={submit} className="border-t-2 border-slate-900 pt-8">
      <div className="space-y-6">
        <div className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Diajukan sebagai <span className="font-bold text-slate-900">{loginProfile.nama}</span>
          <span className="text-slate-400"> · {loginProfile.divisi}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className={labelCls}>
            Tanggal mulai
            <input
              type="date"
              value={form.mulai}
              onChange={(e) => setForm({ ...form, mulai: e.target.value })}
              className={inputCls}
            />
          </label>
          <label className={labelCls}>
            Tanggal selesai
            <input
              type="date"
              value={form.selesai}
              onChange={(e) => setForm({ ...form, selesai: e.target.value })}
              className={inputCls}
            />
          </label>
        </div>

        {error && <p className="border-l-2 border-red-500 pl-3 text-sm font-medium text-red-600">{error}</p>}
        {done && <p className="border-l-2 border-emerald-500 pl-3 text-sm font-medium text-emerald-700">Pengajuan cuti berhasil disimpan.</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-orange-600 py-4 text-sm font-bold text-white transition hover:bg-slate-900"
        >
          Ajukan Cuti
        </button>
      </div>
    </form>
  );
}
