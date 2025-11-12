"use client";

import React, { useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay } from "date-fns";
import { enUS } from "date-fns/locale";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

type EventItem = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  description?: string;
};

function CustomToolbar({ date, label, onNavigate, onView }: any) {
  return (
    <div className="rbc-toolbar" style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div className="rbc-btn-group">
        <button onClick={() => onNavigate('PREV')}>‹</button>
        <button onClick={() => onNavigate('TODAY')}>Today</button>
        <button onClick={() => onNavigate('NEXT')}>›</button>
      </div>
      <div style={{ flex: 1, textAlign: "center" }}>
        <span className="calendar-title">{label}</span>
      </div>
      <div className="rbc-btn-group">
        <button onClick={() => onView('month')}>Month</button>
        <button onClick={() => onView('week')}>Week</button>
        <button onClick={() => onView('day')}>Day</button>
        <button onClick={() => onView('agenda')}>Agenda</button>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const [events, setEvents] = useState<EventItem[]>(() => {
    const now = new Date();
    return [
      {
        id: "1",
        title: "Board meeting",
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 30),
        color: "#1a73e8",
        description: "Quarterly planning meeting",
      },
      {
        id: "2",
        title: "Lunch with Sam",
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 12, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 13, 0),
        color: "#0f9d58",
      },
      {
        id: "3",
        title: "Project review",
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0),
        color: "#f2994a",
      },
    ];
  });

  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [slotSelection, setSlotSelection] = useState<{ start: Date; end: Date } | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSelectEvent = (ev: any) => {
    setSelectedEvent(ev as EventItem);
    setShowModal(true);
  };

  const handleSelectSlot = (slotInfo: any) => {
    setSlotSelection({ start: slotInfo.start, end: slotInfo.end });
    setSelectedEvent(null);
    setShowModal(true);
  };

  const addEvent = (title: string, description?: string, color?: string) => {
    if (!slotSelection) return;
    const newEvent: EventItem = {
      id: String(Date.now()),
      title,
      start: slotSelection.start,
      end: slotSelection.end,
      color: color || "#1a73e8",
      description,
    };
    setEvents((s) => [...s, newEvent]);
    setShowModal(false);
    setSlotSelection(null);
  };

  const deleteEvent = (id: string) => {
    setEvents((s) => s.filter((e) => e.id !== id));
    setShowModal(false);
  };

  const eventStyleGetter = (event: EventItem) => {
    const backgroundColor = event.color || "#1a73e8";
    const style: React.CSSProperties = {
      backgroundColor,
      borderRadius: "8px",
      opacity: 1,
      color: "#fff",
      border: "none",
      padding: "4px 6px",
    };
    return { style };
  };

  const components = useMemo(() => ({ toolbar: () => null }), []);

  // top header controls state
  const [view, setView] = useState<string>("month");

  return (
    <div className="calendar-shell">
      <div className="calendar-top">
        <div className="brand">
          <div className="logo" />
          <div style={{ color: '#bfe3a9', fontWeight: 800 }}>Starcast</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div className="center-title">NOVEMBER <span style={{ color: '#fff' }}>2025</span> <span style={{ marginLeft: 8, color: '#fff' }}>‹ ›</span></div>
        </div>

        <div className="top-controls">
          <div className={`pill ${view === 'day' ? 'active' : ''}`} onClick={() => setView('day')}>Day</div>
          <div className={`pill ${view === 'week' ? 'active' : ''}`} onClick={() => setView('week')}>Week</div>
          <div className={`pill ${view === 'month' ? 'active' : ''}`} onClick={() => setView('month')}>Month</div>
          <div style={{ width: 40, height: 40, borderRadius: 20, border: '2px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
        </div>
      </div>

      <div className="calendar-layout">
        <aside className="sidebar">
          <div className="mini-month">
            <MiniMonth currentDate={new Date()} onChange={() => {}} />
          </div>

          <div className="talents">
            <h3 style={{ color: '#9cff5a' }}>Tallents</h3>
            <div className="talent-box">
              {[
                ['John', '#ff4d4d'],
                ['Jane', '#1aff9c'],
                ['Steve', '#5ac8ff'],
                ['Robin', '#ff66d4'],
                ['Thanos', '#a64dff'],
                ['Tony', '#ffd166'],
                ['chriss', '#8cff00'],
                ['Donald', '#c6ff00'],
                ['Elon', '#00ffd5'],
                ['Larry', '#fff44d'],
              ].map(([name, color]) => (
                <div key={String(name)} className="talent-item">
                  <div className="dot" style={{ background: String(color) }} />
                  <div className="talent-name">{name}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main>
          <div style={{ borderRadius: 14, overflow: 'hidden' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              selectable
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              style={{ height: 720 }}
              components={components}
              eventPropGetter={eventStyleGetter}
              view={view as any}
            />
          </div>
        </main>
      </div>

      {showModal && (
        <EventModal
          event={selectedEvent}
          slot={slotSelection}
          onClose={() => {
            setShowModal(false);
            setSelectedEvent(null);
            setSlotSelection(null);
          }}
          onCreate={addEvent}
          onDelete={deleteEvent}
        />
      )}
    </div>
  );
}

function EventModal({ event, slot, onClose, onCreate, onDelete }: any) {
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [color, setColor] = useState(event?.color || "#1a73e8");

  const isEditing = Boolean(event);

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{isEditing ? "Event details" : "Create event"}</h3>
        <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
          {isEditing
            ? `${format(new Date(event.start), "PPpp")} — ${format(new Date(event.end), "PPpp")}`
            : slot
            ? `${format(new Date(slot.start), "PPpp")} — ${format(new Date(slot.end), "PPpp")}`
            : ""}
        </div>

        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Description</label>
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>Color</label>
        <select value={color} onChange={(e) => setColor(e.target.value)}>
          <option value="#1a73e8">Blue</option>
          <option value="#0f9d58">Green</option>
          <option value="#f2994a">Orange</option>
          <option value="#9b59b6">Purple</option>
        </select>

        <div className="actions">
          <button onClick={onClose}>Cancel</button>
          {isEditing ? (
            <>
              <button onClick={() => onDelete(event.id)} style={{ background: "#e53935", color: "#fff" }}>
                Delete
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                if (!title) return;
                onCreate(title, description, color);
              }}
              style={{ background: "#1a73e8", color: "#fff" }}
            >
              Create
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniMonth({ currentDate, onChange }: any) {
  const [month, setMonth] = useState<Date>(startOfMonth(currentDate));

  React.useEffect(() => setMonth(startOfMonth(currentDate)), [currentDate]);

  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });

  const prev = () => setMonth((m) => subMonths(m, 1));
  const next = () => setMonth((m) => addMonths(m, 1));

  return (
    <div style={{ padding: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <button onClick={prev} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>‹</button>
        <div style={{ fontWeight: 700 }}>{format(month, 'MMMM yyyy')}</div>
        <button onClick={next} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>›</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, fontSize: 12, color: '#64748b', marginBottom: 6 }}>
        {['S','M','T','W','T','F','S'].map((d) => (
          <div key={d} style={{ textAlign: 'center', fontWeight: 700 }}>{d}</div>
        ))}
      </div>
      <div className="mini-month" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
        {days.map((d) => {
          const cls = [] as string[];
          if (!isSameMonth(d, month)) cls.push('other');
          if (isSameDay(d, new Date())) cls.push('today');
          return (
            <div key={d.toISOString()} className={cls.join(' ')} onClick={() => onChange(d)} style={{ padding: 8, textAlign: 'center', borderRadius: 8 }}>
              {format(d, 'd')}
            </div>
          );
        })}
      </div>
    </div>
  );
}
