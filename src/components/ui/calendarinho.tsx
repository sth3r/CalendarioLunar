"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

const lunarEmojis: Record<string, string> = {
  "new": "🌑",
  "waxing-crescent": "🌒",
  "first-quarter": "🌓",
  "waxing-gibbous": "🌔",
  "full": "🌕",
  "waning-gibbous": "🌖",
  "last-quarter": "🌗",
  "waning-crescent": "🌘",
};

const getLunarPhase = (date: Date) => {
  const referenceNewMoon = new Date("2024-01-11");
  const daysSinceReference = Math.floor(
    (date.getTime() - referenceNewMoon.getTime()) / (1000 * 60 * 60 * 24)
  );
  const phasePercentage = (daysSinceReference % 29.53) / 29.53;

  if (phasePercentage < 0.03 || phasePercentage > 0.97) return { lunarPhase: "new", lunarPhaseName: "New Moon" };
  if (phasePercentage < 0.22) return { lunarPhase: "waxing-crescent", lunarPhaseName: "Waxing Crescent" };
  if (phasePercentage < 0.28) return { lunarPhase: "first-quarter", lunarPhaseName: "First Quarter" };
  if (phasePercentage < 0.47) return { lunarPhase: "waxing-gibbous", lunarPhaseName: "Waxing Gibbous" };
  if (phasePercentage < 0.53) return { lunarPhase: "full", lunarPhaseName: "Full Moon" };
  if (phasePercentage < 0.72) return { lunarPhase: "waning-gibbous", lunarPhaseName: "Waning Gibbous" };
  if (phasePercentage < 0.78) return { lunarPhase: "last-quarter", lunarPhaseName: "Last Quarter" };
  return { lunarPhase: "waning-crescent", lunarPhaseName: "Waning Crescent" };
};

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  lunarPhase: string;
  lunarPhaseName: string;
}

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const years = Array.from({ length: 21 }, (_, i) => 2020 + i);

const Calendarinho = () => {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  useEffect(() => {
    const days: CalendarDay[] = [];
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    const startDay = firstDayOfMonth.getDay();
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    // Dias do mês anterior
    const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const prevMonthYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
    const prevMonthLastDay = new Date(prevMonthYear, prevMonth + 1, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(prevMonthYear, prevMonth, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        ...getLunarPhase(date),
      });
    }

    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(selectedYear, selectedMonth, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        ...getLunarPhase(date),
      });
    }

    setCalendarDays(days);
  }, [selectedYear, selectedMonth]);

  const prevMonth = () => {
    setSelectedMonth(selectedMonth === 0 ? 11 : selectedMonth - 1);
    if (selectedMonth === 0) setSelectedYear(selectedYear - 1);
  };

  const nextMonth = () => {
    setSelectedMonth(selectedMonth === 11 ? 0 : selectedMonth + 1);
    if (selectedMonth === 11) setSelectedYear(selectedYear + 1);
  };

  return (
    <Card className="p-4 max-w-xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          {/* Seta mês anterior */}
          <button
            onClick={prevMonth}
            className="text-2xl px-2 py-1 rounded hover:bg-gray-200 hover:text-gray-800"
            aria-label="Mês anterior"
          >
            ←
          </button>

          {/* Seleção de mês e ano */}
          <CardTitle className="flex gap-2 items-center">
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {monthNames.map((name, idx) => (
                <option key={name} value={idx}>{name}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </CardTitle>

          {/* Seta próximo mês */}
          <button
            onClick={nextMonth}
            className="text-2xl px-2 py-1 rounded hover:bg-gray-200 hover:text-gray-800"
            aria-label="Próximo mês"
          >
            →
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, idx) => (
            <div
              key={idx}
              title={day.lunarPhaseName}
              className={`
                flex flex-col items-center p-2 rounded
                ${day.isCurrentMonth ? '' : 'opacity-50'}
                ${day.isToday ? 'bg-blue-300 text-white font-bold' : ''}
              `}
            >
              <span className="text-sm">{day.date.getDate()}</span>
              <span className="text-2xl">{lunarEmojis[day.lunarPhase]}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Calendarinho;
