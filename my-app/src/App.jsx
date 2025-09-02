// App.jsx
import "./App.css";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  startOfWeek,
  endOfWeek,
  addDays,
} from "date-fns";
import { useState, useEffect, useRef } from "react";

export default function App() {
  const [days, setDays] = useState([]);
  const [lastMonthAdded, setLastMonthAdded] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef(null);

  useEffect(() => {
    const now = new Date();
    const firstMonthStart = startOfMonth(now);
    const secondMonthStart = addMonths(firstMonthStart, 1);

    const start = startOfWeek(firstMonthStart, { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(secondMonthStart), { weekStartsOn: 0 });

    const initialDays = eachDayOfInterval({ start, end });
    setDays(initialDays);
    setLastMonthAdded(secondMonthStart);
    setCurrentMonth(firstMonthStart);
  }, []);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    
    const topVisible = Array.from(el.querySelectorAll(".calendar-day")).find(
      (d) => d.getBoundingClientRect().top >= el.getBoundingClientRect().top
    );
    if (topVisible) {
      const date = new Date(topVisible.dataset.date);
      setCurrentMonth(startOfMonth(date));
    }

    
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
      setDays((prevDays) => {
        if (!lastMonthAdded) return prevDays;

        const nextMonthStart = addMonths(lastMonthAdded, 1);
        let blockStart = startOfWeek(nextMonthStart, { weekStartsOn: 0 });
        const lastDisplayed = prevDays[prevDays.length - 1];
        if (blockStart.getTime() <= lastDisplayed.getTime()) {
          blockStart = addDays(lastDisplayed, 1);
        }

        const blockEnd = endOfWeek(endOfMonth(nextMonthStart), {
          weekStartsOn: 0,
        });

        if (blockStart.getTime() > blockEnd.getTime()) return prevDays;

        const newDays = eachDayOfInterval({ start: blockStart, end: blockEnd });
        setLastMonthAdded(nextMonthStart);

        return [...prevDays, ...newDays];
      });
    }
  };

  
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div style={{ height: "600px", display: "flex", flexDirection: "column" }}>
      
      <div className="static-header">
        <div className="month-label">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <div className="weekday-row">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="weekday-cell">
              {d}
            </div>
          ))}
        </div>
      </div>

      
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ flex: 1, overflowY: "auto", padding: 12 }}
      >
        {weeks.map((week, wi) => (
          <div key={wi} className="calendar-week">
            {week.map((day) => {
              const isCurrentMonth =
                day.getMonth() === currentMonth.getMonth() &&
                day.getFullYear() === currentMonth.getFullYear();

              return (
                <div
                  key={day.toISOString()}
                  className={`calendar-day ${
                    isCurrentMonth ? "current-month" : "other-month"
                  }`}
                  data-date={day.toISOString()}
                >
                  {format(day, "d")}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
