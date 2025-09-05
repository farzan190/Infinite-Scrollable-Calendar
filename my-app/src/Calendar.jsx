import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  startOfWeek,
  endOfWeek,
  addDays,
  parse,
} from "date-fns";
import { useState, useEffect, useRef } from "react";
import data from "./assets/data";
import Carousel from "./Card";

export default function Calendar() {
  const [days, setDays] = useState([]);
  const [firstMonthAdded, setFirstMonthAdded] = useState(null);
  const [lastMonthAdded, setLastMonthAdded] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedIndex, setSelectedIndex] = useState(null);
  const containerRef = useRef(null);
  const isLoadingTop = useRef(false);

  const eventsMap = data.reduce((acc, ev, idx) => {
    const parsed = parse(ev.date, "dd/MM/yyyy", new Date());
    const key = parsed.toISOString().split("T")[0];
    acc[key] = { ...ev, index: idx };
    return acc;
  }, {});

  useEffect(() => {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const nextMonthStart = addMonths(thisMonthStart, 1);

    const start = startOfWeek(thisMonthStart, { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(nextMonthStart), { weekStartsOn: 0 });

    const initialDays = eachDayOfInterval({ start, end });
    setDays(initialDays);
    setFirstMonthAdded(thisMonthStart);
    setLastMonthAdded(nextMonthStart);
    setCurrentMonth(thisMonthStart);
  }, []);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    // Update header month based on top visible day
    const topVisible = Array.from(el.querySelectorAll(".calendar-day")).find(
      (d) => d.getBoundingClientRect().top >= el.getBoundingClientRect().top
    );
    if (topVisible) {
      const date = new Date(topVisible.dataset.date);
      setCurrentMonth(startOfMonth(date));
    }

    // Load NEXT month (scroll down)
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 150) {
      setDays((prevDays) => {
        if (!lastMonthAdded) return prevDays;

        const nextMonthStart = addMonths(lastMonthAdded, 1);
        const blockStart = addDays(prevDays[prevDays.length - 1], 1);
        const blockEnd = endOfWeek(endOfMonth(nextMonthStart), {
          weekStartsOn: 0,
        });

        if (blockStart > blockEnd) return prevDays;

        const newDays = eachDayOfInterval({ start: blockStart, end: blockEnd });
        setLastMonthAdded(nextMonthStart);

        return [...prevDays, ...newDays];
      });
    }

    // Load PREVIOUS month (scroll up, smooth)
    if (el.scrollTop <= 150 && !isLoadingTop.current) {
      isLoadingTop.current = true;

      setDays((prevDays) => {
        if (!firstMonthAdded) {
          isLoadingTop.current = false;
          return prevDays;
        }

        const prevMonthStart = addMonths(firstMonthAdded, -1);
        const blockStart = startOfWeek(startOfMonth(prevMonthStart), {
          weekStartsOn: 0,
        });
        const blockEnd = addDays(prevDays[0], -1);

        if (blockEnd < blockStart) {
          isLoadingTop.current = false;
          return prevDays;
        }

        const newDays = eachDayOfInterval({ start: blockStart, end: blockEnd });
        if (!newDays.length) {
          isLoadingTop.current = false;
          return prevDays;
        }

        setFirstMonthAdded(prevMonthStart);

        // Preserve scroll position exactly
        const prevScrollHeight = el.scrollHeight;
        const prevScrollTop = el.scrollTop;

        requestAnimationFrame(() => {
          const newScrollHeight = el.scrollHeight;
          const heightDiff = newScrollHeight - prevScrollHeight;
          el.scrollTop = prevScrollTop + heightDiff;
          isLoadingTop.current = false;
        });

        return [...newDays, ...prevDays];
      });
    }
  };

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div style={{ height: "600px", display: "flex", flexDirection: "column" }}>
      {selectedIndex !== null ? (
        <Carousel
          activeIndex={selectedIndex}
          onBack={() => setSelectedIndex(null)}
        />
      ) : (
        <>
          <div className="static-header">
            <div className="month-label">{format(currentMonth, "MMMM yyyy")}</div>
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

                  const key = day.toISOString().split("T")[0];
                  const event = eventsMap[key];

                  return (
                    <div
                      key={day.toISOString()}
                      className={`calendar-day ${
                        isCurrentMonth ? "highlight-month" : "other-month"
                      }`}
                      data-date={day.toISOString()}
                    >
                      <div className="day-number">{format(day, "d")}</div>
                      {event && (
                        <img
                          src={event.imgUrl}
                          alt=""
                          className="clrimg"
                          onClick={() => setSelectedIndex(event.index)}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
