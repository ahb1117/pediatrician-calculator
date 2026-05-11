export default function Attribution() {
  return (
    <div className="mt-12 border-t border-slate-200 pt-8">
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
          About This Tool
        </div>
        <p className="text-sm text-slate-600 mb-1">
          An upgraded version rebuilt by
        </p>
        <p className="text-lg font-bold text-slate-800">
          Dr. Ahmed Hussain Buzaid
        </p>
        <p className="text-sm font-medium text-blue-700 mb-6">
          Neonatology Consultant
        </p>

        <div className="border-t border-slate-200 pt-5">
          <p className="text-sm text-slate-500 mb-2 font-medium">إهداء</p>
          <p
            className="text-base font-semibold text-slate-700 leading-relaxed"
            dir="rtl"
            lang="ar"
          >
            يُهدى ثواب هذا العمل إلى روح المرحوم الدكتور أحمد يوسف بوعلي
          </p>
          <p className="text-xs text-slate-400 mt-2">رحمه الله وأسكنه فسيح جناته</p>
        </div>
      </div>
    </div>
  );
}
