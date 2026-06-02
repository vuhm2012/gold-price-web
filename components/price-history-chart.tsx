"use client";

import apiClient, { JEW002 } from "@/data/api-client";
import { BaseEntity } from "@/data/entities/base-entity";
import {
  PriceHistoryDataPoint,
  PriceHistoryResponse,
} from "@/data/entities/price-history-entity";
import { TrendingDown, TrendingUp, BarChart3 } from "lucide-react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Types ──────────────────────────────────────────────────────────
type Period = "1w" | "1m" | "3m" | "6m" | "1y";

interface PriceTypeConfig {
  key: string;
  label: string;
  sellingKey: string;
  buyingKey: string;
}

// ─── Constants ──────────────────────────────────────────────────────
const PERIODS: { value: Period; label: string }[] = [
  { value: "1w", label: "1 Tuần" },
  { value: "1m", label: "1 Tháng" },
  { value: "3m", label: "3 Tháng" },
  { value: "6m", label: "6 Tháng" },
  { value: "1y", label: "1 Năm" },
];

const PRICE_TYPES: PriceTypeConfig[] = [
  {
    key: "gold_ring",
    label: "Nhẫn tròn trơn",
    sellingKey: "gold_ring_selling_price",
    buyingKey: "gold_ring_buying_price",
  },
  {
    key: "gold_jewelry",
    label: "Trang sức",
    sellingKey: "gold_jewelry_selling_price",
    buyingKey: "gold_jewelry_buying_price",
  },
  {
    key: "gold_alloy",
    label: "Vàng tây",
    sellingKey: "gold_alloy_selling_price",
    buyingKey: "gold_alloy_buying_price",
  },
  {
    key: "silver",
    label: "Bạc",
    sellingKey: "silver_selling_price",
    buyingKey: "silver_buying_price",
  },
];

// ─── Helpers ────────────────────────────────────────────────────────
const formatPrice = (value: number): string => {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    // Drop ".0" for whole numbers (e.g. 5.0 → 5), keep decimals (e.g. 5.5 → 5.5)
    return `${parseFloat(millions.toFixed(1))}M`;
  }
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toLocaleString("en-US");
};

const formatDateLabel = (
  time: string,
  period: Period,
  startDate?: string
): string => {
  if (period === "1y") {
    // time comes as "YYYY-MM" for monthly buckets
    const src = time.length === 7 ? time + "-01T00:00:00" : time.split("T")[0] + "T00:00:00";
    const date = new Date(src);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" });
    }
    return time;
  }

  if (period === "3m" || period === "6m") {
    // Use startDate of the weekly bucket for accuracy
    const src = startDate ?? time;
    const datePart = src.split("T")[0];
    const date = new Date(datePart + "T00:00:00");
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
    }
    return time;
  }

  // 1w / 1m — daily buckets
  const datePart = time.split("T")[0];
  const date = new Date(datePart + "T00:00:00");
  if (isNaN(date.getTime())) return time;
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
};

// ─── Custom Tooltip ─────────────────────────────────────────────────
interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
  dataKey: string;
}

type ChartDataMap = Record<string, { startDate: string; endDate: string }>;

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
  period: Period;
  chartDataMap: ChartDataMap;
}

const formatTooltipTitle = (
  time: string,
  period: Period,
  chartDataMap: ChartDataMap
): string => {
  const point = chartDataMap[time];

  if (period === "3m" || period === "6m") {
    if (point?.startDate && point?.endDate) {
      const startStr = point.startDate.split("T")[0];
      const endStr = point.endDate.split("T")[0];
      const start = new Date(startStr + "T00:00:00");
      const end = new Date(endStr + "T00:00:00");
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const fmt = (d: Date) => d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
        const yearEnd = end.toLocaleDateString("vi-VN", { year: "numeric" });
        return `${fmt(start)} – ${fmt(end)}/${yearEnd}`;
      }
    }
  }

  if (period === "1y") {
    // time = "YYYY-MM"
    const src = time.length === 7 ? time + "-01T00:00:00" : time.split("T")[0] + "T00:00:00";
    const date = new Date(src);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
    }
  }

  // 1w / 1m — single day
  const datePart = time.split("T")[0];
  const date = new Date(datePart + "T00:00:00");
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString("vi-VN", {
      weekday: period === "1w" ? "short" : undefined,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
  return time;
};

const CustomTooltip: FC<CustomTooltipProps> = ({ active, payload, label, period, chartDataMap }) => {
  if (!active || !payload?.length || !label) return null;

  const title = formatTooltipTitle(label, period, chartDataMap);
  const byKey = Object.fromEntries(payload.map((e) => [e.dataKey, e.value]));

  const rows: { label: string; color: string; latest: number; min: number; max: number }[] = [];
  if (byKey.sellingLatest !== undefined) {
    rows.push({ label: "Giá bán", color: "#f59e0b", latest: byKey.sellingLatest, min: byKey.sellingMin ?? 0, max: byKey.sellingMax ?? 0 });
  }
  if (byKey.buyingLatest !== undefined) {
    rows.push({ label: "Giá mua", color: "#22d3ee", latest: byKey.buyingLatest, min: byKey.buyingMin ?? 0, max: byKey.buyingMax ?? 0 });
  }

  return (
    <div className="bg-stone-900/95 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-3 md:p-4 shadow-2xl shadow-black/50 min-w-[220px]">
      <p className="text-amber-200 text-xs font-semibold mb-2.5 tracking-wider uppercase border-b border-yellow-500/15 pb-2">
        {title}
      </p>
      {rows.map((row) => (
        <div key={row.label} className="mb-2 last:mb-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
            <span className="text-xs font-bold" style={{ color: row.color }}>{row.label}</span>
          </div>
          <div className="grid grid-cols-3 gap-1 pl-4.5">
            <div className="text-center">
              <p className="text-amber-100/40 text-[10px] uppercase tracking-wide">Cao</p>
              <p className="text-amber-50 text-xs font-semibold tabular-nums">{row.max > 0 ? formatPrice(row.max) : "—"}</p>
            </div>
            <div className="text-center">
              <p className="text-amber-100/40 text-[10px] uppercase tracking-wide">Mới</p>
              <p className="text-amber-50 text-xs font-bold tabular-nums">{row.latest > 0 ? formatPrice(row.latest) : "—"}</p>
            </div>
            <div className="text-center">
              <p className="text-amber-100/40 text-[10px] uppercase tracking-wide">Thấp</p>
              <p className="text-amber-50 text-xs font-semibold tabular-nums">{row.min > 0 ? formatPrice(row.min) : "—"}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────
const PriceHistoryChart: FC = () => {
  const [period, setPeriod] = useState<Period>("1m");
  const [selectedType, setSelectedType] = useState(PRICE_TYPES[0]);
  const [historyData, setHistoryData] = useState<PriceHistoryDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchHistory = useCallback(async (p: Period) => {
    setLoading(true);
    setError(false);
    try {
      const response = await apiClient.get<
        BaseEntity<PriceHistoryResponse>
      >(JEW002, {
        period: p,
      });

      if (response?.result === "OK") {
        const data = response.data as PriceHistoryResponse;
        setHistoryData(data.data ?? []);
      } else {
        setHistoryData([]);
        setError(true);
      }
    } catch {
      setHistoryData([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(period);
  }, [period, fetchHistory]);

  // ─── Compute chart data ────────────────────────────────────────
  const chartData = useMemo(() => {
    const data = historyData.map((point) => {
      const sellingVal = point[selectedType.sellingKey as keyof PriceHistoryDataPoint] as
        | { min: number; max: number; latest: number }
        | undefined;
      const buyingVal = point[selectedType.buyingKey as keyof PriceHistoryDataPoint] as
        | { min: number; max: number; latest: number }
        | undefined;

      return {
        time: point.time,
        startDate: point.startDate,
        endDate: point.endDate,
        sellingLatest: sellingVal?.latest ?? 0,
        sellingMin: sellingVal?.min ?? 0,
        sellingMax: sellingVal?.max ?? 0,
        buyingLatest: buyingVal?.latest ?? 0,
        buyingMin: buyingVal?.min ?? 0,
        buyingMax: buyingVal?.max ?? 0,
      };
    });

    return data;
  }, [historyData, selectedType, period]);

  // ─── Lookup map: time → {startDate, endDate} for tooltip & X-axis ───
  const chartDataMap = useMemo<ChartDataMap>(() => {
    return Object.fromEntries(
      chartData.map((d) => [d.time, { startDate: d.startDate, endDate: d.endDate }])
    );
  }, [chartData]);

  // ─── Stats ─────────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (chartData.length < 2) return null;
    const first = chartData[0];
    const last = chartData[chartData.length - 1];
    const change = last.sellingLatest - first.sellingLatest;
    const changePercent =
      first.sellingLatest > 0
        ? ((change / first.sellingLatest) * 100).toFixed(2)
        : "0.00";
    const allPrices = chartData.map((d) => d.sellingLatest).filter((p) => p > 0);
    const highest = allPrices.length > 0 ? Math.max(...allPrices) : 0;
    const lowest = allPrices.length > 0 ? Math.min(...allPrices) : 0;

    return {
      current: last.sellingLatest,
      change,
      changePercent,
      isUp: change >= 0,
      highest,
      lowest,
    };
  }, [chartData]);

  // ─── Render ────────────────────────────────────────────────────
  return (
    <div
      id="price-history-chart"
      className="bg-red-950/30 backdrop-blur-xl rounded-3xl border border-yellow-500/20 shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-300 hover:shadow-[0_0_60px_rgba(234,179,8,0.08)]"
    >
      {/* ──── Header ──── */}
      <div className="px-4 md:px-8 pt-5 md:pt-7 pb-3 md:pb-4">
        <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-600/10 border border-yellow-500/20 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-amber-100 tracking-wide">
                Biến động giá
              </h2>
              <p className="text-xs text-amber-200/40 mt-0.5">
                Giá bán & mua theo thời gian
              </p>
            </div>
          </div>

          {/* Stats badges */}
          {stats && !loading && (
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                  stats.isUp
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {stats.isUp ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span>
                  {stats.isUp ? "+" : ""}
                  {stats.changePercent}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ──── Controls ──── */}
      <div className="px-4 md:px-8 pb-4 md:pb-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {/* Product type selector */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none -mx-1 px-1">
          {PRICE_TYPES.map((type) => (
            <button
              key={type.key}
              id={`type-btn-${type.key}`}
              onClick={() => setSelectedType(type)}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedType.key === type.key
                  ? "bg-gradient-to-r from-amber-500/20 to-yellow-600/15 text-yellow-300 border border-yellow-500/30 shadow-lg shadow-amber-900/20"
                  : "text-amber-200/40 hover:text-amber-200/70 hover:bg-red-900/30 border border-transparent"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Period selector */}
        <div className="flex gap-1 bg-red-950/50 rounded-xl p-1 border border-yellow-500/10 self-start sm:self-auto">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              id={`period-btn-${p.value}`}
              onClick={() => setPeriod(p.value)}
              className={`px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                period === p.value
                  ? "bg-gradient-to-r from-yellow-500/20 to-amber-600/15 text-yellow-300 shadow-inner"
                  : "text-amber-200/40 hover:text-amber-200/60"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ──── Chart area ──── */}
      <div className="px-2 md:px-6 pb-4 md:pb-7">
        <div className="h-[260px] sm:h-[300px] md:h-[360px] lg:h-[400px] w-full">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-yellow-500/30 border-t-yellow-400 rounded-full animate-spin" />
                <span className="text-amber-200/40 text-sm">Đang tải dữ liệu...</span>
              </div>
            </div>
          ) : error || chartData.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-center px-4">
                <BarChart3 className="w-10 h-10 text-amber-200/20" />
                <span className="text-amber-200/40 text-sm">
                  {error
                    ? "Không thể tải dữ liệu. Vui lòng thử lại sau."
                    : "Chưa có dữ liệu cho khoảng thời gian này."}
                </span>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="sellingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="sellingRangeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.04} />
                  </linearGradient>
                  <linearGradient id="buyingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="buyingRangeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 6"
                  stroke="rgba(234,179,8,0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  tickFormatter={(val) =>
                    formatDateLabel(val, period, chartDataMap[val]?.startDate)
                  }
                  tick={{ fill: "rgba(217,178,120,0.4)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(234,179,8,0.1)" }}
                  dy={8}
                  interval="preserveStartEnd"
                  minTickGap={40}
                />
                <YAxis
                  tickFormatter={formatPrice}
                  tick={{ fill: "rgba(217,178,120,0.4)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={55}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  content={<CustomTooltip period={period} chartDataMap={chartDataMap} />}
                  cursor={{
                    stroke: "rgba(234,179,8,0.15)",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                />
                {/* ── Buying range band (max → min) ── */}
                <Area
                  type="monotone"
                  dataKey="buyingMax"
                  stroke="none"
                  fill="url(#buyingRangeGradient)"
                  fillOpacity={1}
                  name="Cao nhất (mua)"
                  dot={false}
                  activeDot={false}
                  legendType="none"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="buyingMin"
                  stroke="rgba(34,211,238,0.25)"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  fill="white"
                  fillOpacity={0}
                  name="Thấp nhất (mua)"
                  dot={false}
                  activeDot={false}
                  legendType="none"
                  isAnimationActive={false}
                />
                {/* ── Buying latest line ── */}
                <Area
                  type="monotone"
                  dataKey="buyingLatest"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  fill="url(#buyingGradient)"
                  fillOpacity={1}
                  name="Giá mua"
                  dot={false}
                  activeDot={{ r: 5, stroke: "#22d3ee", strokeWidth: 2, fill: "#1c1917" }}
                  isAnimationActive={true}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
                {/* ── Selling range band (max → min) ── */}
                <Area
                  type="monotone"
                  dataKey="sellingMax"
                  stroke="none"
                  fill="url(#sellingRangeGradient)"
                  fillOpacity={1}
                  name="Cao nhất (bán)"
                  dot={false}
                  activeDot={false}
                  legendType="none"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="sellingMin"
                  stroke="rgba(245,158,11,0.3)"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  fill="white"
                  fillOpacity={0}
                  name="Thấp nhất (bán)"
                  dot={false}
                  activeDot={false}
                  legendType="none"
                  isAnimationActive={false}
                />
                {/* ── Selling latest line ── */}
                <Area
                  type="monotone"
                  dataKey="sellingLatest"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fill="url(#sellingGradient)"
                  fillOpacity={1}
                  name="Giá bán"
                  dot={false}
                  activeDot={{ r: 5, stroke: "#f59e0b", strokeWidth: 2, fill: "#1c1917" }}
                  isAnimationActive={true}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ──── Compact legend below chart ──── */}
        {!loading && !error && chartData.length > 0 && (
          <div className="mt-3 flex items-center justify-end gap-4 flex-wrap px-2">
            {/* Shared symbol guide */}
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-[2px] rounded-full bg-amber-400 inline-block" />
              <span className="w-5 h-[2px] rounded-full bg-cyan-400 inline-block" />
              <span className="text-[10px] text-amber-200/35 ml-0.5">Giá mới nhất</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-2.5 rounded-sm bg-amber-500/20 border border-amber-500/25 inline-block" />
              <span className="w-5 h-2.5 rounded-sm bg-cyan-500/15 border border-cyan-500/20 inline-block" />
              <span className="text-[10px] text-amber-200/35 ml-0.5">Cao nhất</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="20" height="6" className="shrink-0">
                <line x1="0" y1="3" x2="20" y2="3" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" strokeDasharray="3 2" />
              </svg>
              <svg width="20" height="6" className="shrink-0">
                <line x1="0" y1="3" x2="20" y2="3" stroke="rgba(34,211,238,0.45)" strokeWidth="1.5" strokeDasharray="3 2" />
              </svg>
              <span className="text-[10px] text-amber-200/35 ml-0.5">Thấp nhất</span>
            </div>
            <span className="w-px h-3 bg-yellow-500/15" />
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              <span className="text-[10px] text-amber-300/50">Bán</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block" />
              <span className="text-[10px] text-cyan-300/50">Mua</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceHistoryChart;
