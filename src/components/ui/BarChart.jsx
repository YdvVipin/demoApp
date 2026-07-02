/**
 * Lightweight dependency-free bar chart.
 * data: [{ label, value }]
 */
export default function BarChart({ data, color = 'bg-indigo-500', valuePrefix = '', valueSuffix = '', testId = 'bar-chart' }) {
  const max = Math.max(...data.map(d => d.value), 1)

  return (
    <div className="flex items-end gap-3 h-48 pt-4" data-testid={testId}>
      {data.map(d => {
        const heightPct = Math.round((d.value / max) * 100)
        return (
          <div
            key={d.label}
            className="flex-1 flex flex-col items-center justify-end gap-2 group"
            data-testid={`${testId}-bar-${d.label}`}
          >
            <span
              className="text-xs font-semibold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
              data-testid={`${testId}-value-${d.label}`}
            >
              {valuePrefix}{d.value.toLocaleString()}{valueSuffix}
            </span>
            <div
              className={`w-full rounded-t-md ${color} transition-all duration-500 hover:opacity-80`}
              style={{ height: `${heightPct}%`, minHeight: '4px' }}
              title={`${d.label}: ${valuePrefix}${d.value.toLocaleString()}${valueSuffix}`}
            />
            <span className="text-[11px] text-slate-400 font-medium" data-testid={`${testId}-label-${d.label}`}>
              {d.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
