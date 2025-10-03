"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import Script from "next/script";

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

  if (phasePercentage < 0.03 || phasePercentage > 0.97) return { lunarPhase: "new", lunarPhaseName: "Lua Nova" };
  if (phasePercentage < 0.22) return { lunarPhase: "waxing-crescent", lunarPhaseName: "Crescente" };
  if (phasePercentage < 0.28) return { lunarPhase: "first-quarter", lunarPhaseName: "Quarto Crescente" };
  if (phasePercentage < 0.47) return { lunarPhase: "waxing-gibbous", lunarPhaseName: "Gibbosa Crescente" };
  if (phasePercentage < 0.53) return { lunarPhase: "full", lunarPhaseName: "Lua Cheia" };
  if (phasePercentage < 0.72) return { lunarPhase: "waning-gibbous", lunarPhaseName: "Gibbosa Minguante" };
  if (phasePercentage < 0.78) return { lunarPhase: "last-quarter", lunarPhaseName: "Quarto Minguante" };
  return { lunarPhase: "waning-crescent", lunarPhaseName: "Minguante" };
};

interface CalendarDay {
  date: Date;
  isCurrentMonth?: boolean;
  isToday?: boolean;
  lunarPhase: string;
  lunarPhaseName: string;
}

const LunarCalendar = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const years = Array.from({ length: 21 }, (_, i) => 2020 + i);
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days: CalendarDay[] = [];

    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Mês anterior
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const prevMonthLastDay = new Date(prevMonthYear, prevMonth + 1, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(prevMonthYear, prevMonth, prevMonthLastDay - i);
      days.push({ date: d, isCurrentMonth: false, isToday: false, ...getLunarPhase(d) });
    }

    // Mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({ date: d, isCurrentMonth: true, isToday: d.toDateString() === today.toDateString(), ...getLunarPhase(d) });
    }

    // Próximo mês
    const totalCells = 42;
    const nextMonthDays = totalCells - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: d, isCurrentMonth: false, isToday: false, ...getLunarPhase(d) });
    }

    setCalendarDays(days);
  };

  useEffect(() => {
    generateCalendar(currentDate);
    setSelectedMonth(currentDate.getMonth());
    setSelectedYear(currentDate.getFullYear());
  }, [currentDate]);

  // Sincroniza selects com o calendário
  useEffect(() => {
    setCurrentDate(new Date(selectedYear, selectedMonth, 1));
  }, [selectedMonth, selectedYear]);

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  const goToToday = () => setCurrentDate(today);

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <Card className="max-w-4xl mx-auto relative z-10 bg-black/60 backdrop-blur-md border border-purple-700 p-4">
      {/* AdSense global script */}
      <Script
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        data-ad-client="ca-pub-3729829871518422" // substitua pelo seu ID
        crossOrigin="anonymous"
      />

      <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-2">
        <CardTitle className="text-2xl font-bold text-purple-200">
          Calendário Lunar - {currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
        </CardTitle>
        <div className="flex gap-2 items-center">
          <button onClick={() => navigateMonth("prev")} className="text-2xl px-3 py-1 rounded-lg hover:bg-purple-700 hover:text-white">←</button>
          <button onClick={goToToday} className="px-3 py-1 rounded-lg bg-purple-600 text-white hover:bg-purple-500">Hoje</button>
          <button onClick={() => navigateMonth("next")} className="text-2xl px-3 py-1 rounded-lg hover:bg-purple-700 hover:text-white">→</button>
          <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} className="ml-2 p-1 rounded border border-purple-500 text-white bg-black">
            {monthNames.map((name, idx) => <option key={name} value={idx}>{name}</option>)}
          </select>
          <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="ml-2 p-1 rounded border border-purple-500 text-white bg-black">
            {years.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map(day => <div key={day} className="text-center font-medium text-purple-300 py-2">{day}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center p-2 rounded-lg
                ${day.isCurrentMonth ? "bg-black/40" : "opacity-40"}
                ${day.isToday ? "bg-purple-600 text-white font-bold" : ""}`}
              title={day.lunarPhaseName}
            >
              <span className="text-sm">{day.date.getDate()}</span>
              <span className="text-2xl drop-shadow-[0_0_8px_rgba(255,255,200,0.8)]">{lunarEmojis[day.lunarPhase]}</span>
            </div>
          ))}
        </div>

        {/* Bloco de anúncio AdSense */}
        <div className="my-4 text-center">
          <ins className="adsbygoogle"
               style={{ display: "block" }}
               data-ad-client="ca-pub-3729829871518422" // substitua pelo seu ID
               data-ad-slot="1234567890" // seu slot do anúncio
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <Script>{`(adsbygoogle = window.adsbygoogle || []).push({});`}</Script>
        </div>

        <footer className="mt-4 text-center text-purple-300 text-sm border-t border-purple-700 pt-2">
          Desenvolvido por Esther Rodrigues &mdash; 🌙✨  
          <a href="https://github.com/sth3r" target="_blank" className="underline hover:text-white ml-1">GitHub</a> | 
          <a href="https://www.linkedin.com/in/esther-rodrigues/" target="_blank" className="underline hover:text-white ml-1">LinkedIn</a> |
          <a href="https://www.behance.net/esthervrodrigues" target="_blank" className="underline hover:text-white ml-1">Behance</a>
        </footer>
      </CardContent>
    </Card>
  );
};

export default LunarCalendar;
