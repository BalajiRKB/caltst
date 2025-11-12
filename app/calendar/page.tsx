"use client";

import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const events = [
  {
    title: "Board meeting",
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000),
  },
  {
    title: "Lunch",
    start: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    end: new Date(new Date().getTime() + 25 * 60 * 60 * 1000),
  },
];

export default function CalendarPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 12 }}>Calendar</h1>
      <div style={{ height: 600 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
        />
      </div>
    </div>
  );
}
