import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { toast } from 'sonner';

export interface CalendarEvent {
  id: string;
  title: string;
  category: 'festival' | 'gala' | 'party' | 'holiday' | 'reminder';
  date: string; // YYYY-MM-DD
  time?: string;
  organizer?: string;
  attendeesCount?: number;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Pending';
  description?: string;
  location?: string;
  client?: string;
  site?: string;
  eventPeriod?: string;
}

interface FlowCalendarViewProps {
  onSelectTab?: (tabId: string) => void;
}

export const FlowCalendarView: React.FC<FlowCalendarViewProps> = ({ onSelectTab }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 8, 8)); // Sept 8, 2026
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // New event form state (matching design spec in uploaded modal image)
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventClient, setNewEventClient] = useState('');
  const [newEventSite, setNewEventSite] = useState('');
  const [newEventPeriod, setNewEventPeriod] = useState('');

  // Date Range Picker Modal State (for Event Period popout)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('Custom');
  const [pickerStartDate, setPickerStartDate] = useState<string>('12/09/2026');
  const [pickerEndDate, setPickerEndDate] = useState<string>('28/09/2026');
  const [pickerMonth1, setPickerMonth1] = useState<Date>(new Date(2026, 8, 1)); // Sept 2026
  const [pickerMonth2, setPickerMonth2] = useState<Date>(new Date(2026, 9, 1)); // Oct 2026

  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    const now = new Date(2026, 8, 8); // Sept 8, 2026
    const fmt = (d: Date) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    
    if (preset === 'Today') {
      setPickerStartDate(fmt(now));
      setPickerEndDate(fmt(now));
    } else if (preset === 'Yesterday') {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      setPickerStartDate(fmt(y));
      setPickerEndDate(fmt(y));
    } else if (preset === 'Last 7 days') {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      setPickerStartDate(fmt(d));
      setPickerEndDate(fmt(now));
    } else if (preset === 'Last 30 days') {
      const d = new Date(now);
      d.setDate(d.getDate() - 30);
      setPickerStartDate(fmt(d));
      setPickerEndDate(fmt(now));
    } else if (preset === 'Last 90 days') {
      const d = new Date(now);
      d.setDate(d.getDate() - 90);
      setPickerStartDate(fmt(d));
      setPickerEndDate(fmt(now));
    } else if (preset === 'Last 12 months') {
      const d = new Date(now);
      d.setFullYear(d.getFullYear() - 1);
      setPickerStartDate(fmt(d));
      setPickerEndDate(fmt(now));
    } else if (preset === 'Last week') {
      setPickerStartDate('31/08/2026');
      setPickerEndDate('06/09/2026');
    } else if (preset === 'Last month') {
      setPickerStartDate('01/08/2026');
      setPickerEndDate('31/08/2026');
    }
  };

  const handlePickerDayClick = (day: number, monthObj: Date) => {
    setSelectedPreset('Custom');
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(monthObj.getMonth() + 1).padStart(2, '0');
    const yearStr = monthObj.getFullYear();
    const formatted = `${dayStr}/${monthStr}/${yearStr}`;

    if (!pickerStartDate || (pickerStartDate && pickerEndDate)) {
      setPickerStartDate(formatted);
      setPickerEndDate('');
    } else {
      setPickerEndDate(formatted);
    }
  };

  // Purely Event, Festival & Celebration Data
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 'evt-1',
      title: 'Annual Founder’s Celebration',
      category: 'party',
      date: '2026-09-08',
      time: '12:30 PM',
      organizer: 'Staff & Team Lead',
      attendeesCount: 85,
      status: 'Confirmed',
      description: 'Annual corporate anniversary & founder birthday social celebration.',
      location: 'Central Lounge & Courtyard',
    },
    {
      id: 'evt-2',
      title: 'Corporate Excellence Awards & Gala',
      category: 'gala',
      date: '2026-09-12',
      time: '06:00 PM',
      organizer: 'Executive Board',
      attendeesCount: 250,
      status: 'Scheduled',
      description: 'Black-tie annual awards gala honoring top performers and partners.',
      location: 'Grand Ballroom Hall A',
    },
    {
      id: 'evt-3',
      title: 'Outdoor Community Movie Night',
      category: 'party',
      date: '2026-09-15',
      time: '08:00 PM',
      organizer: 'Events Committee',
      attendeesCount: 180,
      status: 'Confirmed',
      description: 'Under the stars outdoor film screening with drinks and refreshments.',
      location: 'South Lawn Amphitheater',
    },
    {
      id: 'evt-4',
      title: 'Autumn Equinox Bank Holiday',
      category: 'holiday',
      date: '2026-09-18',
      time: 'All Day',
      organizer: 'Public Observance',
      attendeesCount: 0,
      status: 'Confirmed',
      description: 'Official seasonal autumn holiday observance day.',
      location: 'National Observance',
    },
    {
      id: 'evt-5',
      title: 'Festival Ticket & RSVP Deadline',
      category: 'reminder',
      date: '2026-09-22',
      time: '05:00 PM',
      organizer: 'Ticket Desk',
      attendeesCount: 500,
      status: 'Scheduled',
      description: 'Final deadline for guest RSVPs and catering headcount confirmation.',
      location: 'Events Portal',
    },
    {
      id: 'evt-6',
      title: 'Grand Autumn Harvest Festival',
      category: 'festival',
      date: '2026-09-24',
      time: '05:00 PM',
      organizer: 'Community & Cultural Hub',
      attendeesCount: 450,
      status: 'Scheduled',
      description: 'Annual harvest festival with live music, food stalls, and games.',
      location: 'Central Festival Grounds',
    },
    {
      id: 'evt-7',
      title: 'Festival of Lights Cultural Gala',
      category: 'festival',
      date: '2026-09-28',
      time: '06:30 PM',
      organizer: 'Cultural Diversity Team',
      attendeesCount: 300,
      status: 'Scheduled',
      description: 'Evening of light installations, cultural performances, and traditional feast.',
      location: 'Grand Pavilion Hall',
    },
    {
      id: 'evt-8',
      title: 'Halloween Gala & Costume Night',
      category: 'party',
      date: '2026-09-30',
      time: '07:00 PM',
      organizer: 'Social Club',
      attendeesCount: 220,
      status: 'Scheduled',
      description: 'Themed Halloween party with costume contest and DJ performance.',
      location: 'Main Event Arena',
    },
  ]);

  // Color mapping per event category - linked to dynamic color theme
  const categoryStyles = {
    festival: {
      bg: 'bg-theme-light',
      border: 'border-theme-primary',
      text: 'text-theme-primary font-bold',
      badge: 'bg-theme-primary text-white',
      dot: 'bg-theme-primary',
      label: 'Festivals & Cultural',
    },
    gala: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-500',
      text: 'text-indigo-700 dark:text-indigo-300 font-bold',
      badge: 'bg-indigo-500 text-white',
      dot: 'bg-indigo-500',
      label: 'Galas & Ceremonies',
    },
    party: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-500',
      text: 'text-emerald-700 dark:text-emerald-300 font-bold',
      badge: 'bg-emerald-500 text-white',
      dot: 'bg-emerald-500',
      label: 'Parties & Gatherings',
    },
    holiday: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-500',
      text: 'text-amber-700 dark:text-amber-300 font-bold',
      badge: 'bg-amber-500 text-white',
      dot: 'bg-amber-500',
      label: 'Holidays & Observances',
    },
    reminder: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-500',
      text: 'text-rose-700 dark:text-rose-300 font-bold',
      badge: 'bg-rose-500 text-white',
      dot: 'bg-rose-500',
      label: 'Event Reminders',
    },
  };

  // Date Navigation for Month, Week, and Day
  const prevMonth = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    } else if (viewMode === 'day') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      setCurrentDate(d);
    }
  };

  const nextMonth = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    } else if (viewMode === 'day') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      setCurrentDate(d);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date(2026, 8, 8));
  };

  // Helper for 7-day Week calculation
  const getWeekDays = (baseDate: Date) => {
    const currentDayOfWeek = baseDate.getDay();
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(baseDate.getDate() - currentDayOfWeek);

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Month Grid Calculation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Export event to standard .ics file
  const exportToICS = (event: CalendarEvent) => {
    const formatDate = (dateStr: string) => dateStr.replace(/[-:]/g, '') + 'T180000Z';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Flow Platform//Flow Events Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || 'Flow Event'} - Organizer: ${event.organizer || 'N/A'}`,
      `LOCATION:${event.location || 'Event Location'}`,
      `DTSTART:${formatDate(event.date)}`,
      `DTEND:${formatDate(event.date)}`,
      `STATUS:${event.status.toUpperCase()}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Event .ics downloaded!', {
      description: 'You can import this event into Google Calendar, Apple Calendar, or Outlook.',
    });
  };

  const openGoogleCalendar = (event: CalendarEvent) => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`${event.description || ''} | Organizer: ${event.organizer || ''}`);
    const location = encodeURIComponent(event.location || '');
    const dateStr = event.date.replace(/-/g, '');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateStr}T180000Z/${dateStr}T210000Z`;
    window.open(url, '_blank');
  };

  const openOutlookCalendar = (event: CalendarEvent) => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`${event.description || ''} | Organizer: ${event.organizer || ''}`);
    const location = encodeURIComponent(event.location || '');
    const url = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${title}&body=${details}&location=${location}&startdt=${event.date}T18:00:00Z&enddt=${event.date}T10:00:00Z`;
    window.open(url, '_blank');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const created: CalendarEvent = {
      id: `evt-${Date.now()}`,
      title: newEventTitle,
      category: 'festival',
      date: newEventPeriod || '2026-09-12',
      time: '09:00 AM',
      organizer: newEventClient || 'Derby County Football Club',
      attendeesCount: 150,
      status: 'Scheduled',
      description: newEventDescription || 'Event details including schedule and location.',
      location: newEventSite || 'Pride Park Stadium',
      client: newEventClient,
      site: newEventSite,
      eventPeriod: newEventPeriod,
    };

    setEvents((prev) => [...prev, created]);
    setIsAddEventOpen(false);
    setNewEventTitle('');
    setNewEventDescription('');
    setNewEventClient('');
    setNewEventSite('');
    setNewEventPeriod('');

    toast.success('Event Added!', {
      description: `"${created.title}" successfully added for ${created.client || 'client'}.`,
    });
  };

  const filteredEvents = events.filter(
    (evt) => selectedCategory === 'all' || evt.category === selectedCategory
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      {/* Top Events Workspace Navigation Bar */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d131f] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        {/* Left Title & Live Sync Status */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Flow Events & Festival Calendar
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-theme-light text-theme-primary flex items-center gap-1 border border-theme-primary/30">
              <span className="w-1.5 h-1.5 rounded-full bg-theme-primary animate-pulse" />
              Events Live Sync Active
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track festivals, cultural galas, social parties & personal holidays with Google & Outlook sync
          </p>
        </div>

        {/* Right Actions & Sync Center */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sync Now Button */}
          <button
            onClick={() => {
              toast.success('Syncing Events...', {
                description: 'Events & calendar schedules successfully synced in real-time.',
              });
            }}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <Icon name="RefreshCw" size={14} className="text-theme-primary" />
            <span>Sync Now</span>
          </button>

          {/* Add New Event Button */}
          <button
            onClick={() => setIsAddEventOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary-hover shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Icon name="Plus" size={15} />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Main Events Body Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Calendar View Area (Full Width) */}
        <div className="flex-1 flex flex-col overflow-y-auto p-5 space-y-4">
          {/* Controls Bar: View Switcher, Month Navigation & Category Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0d131f] p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            {/* Left Prev / Next / Today & Categories Dropdown beside Month */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={goToToday}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Today
              </button>
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                <button
                  onClick={prevMonth}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  <Icon name="ChevronLeft" size={16} />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  <Icon name="ChevronRight" size={16} />
                </button>
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white px-1">
                {monthNames[month]} {year}
              </h2>

              {/* Categories Dropdown right beside September 2026 */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1.5 rounded-xl border border-theme-primary/30 bg-theme-light text-theme-primary text-xs font-bold focus:outline-none focus:border-theme-primary cursor-pointer shadow-2xs transition-all"
                >
                  <option value="all">All Categories ({events.length})</option>
                  <option value="festival">Festivals & Cultural ({events.filter(e => e.category === 'festival').length})</option>
                  <option value="gala">Galas & Ceremonies ({events.filter(e => e.category === 'gala').length})</option>
                  <option value="party">Parties & Gatherings ({events.filter(e => e.category === 'party').length})</option>
                  <option value="holiday">Holidays & Observances ({events.filter(e => e.category === 'holiday').length})</option>
                  <option value="reminder">Event Reminders ({events.filter(e => e.category === 'reminder').length})</option>
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-theme-primary">
                  <Icon name="ChevronDown" size={14} />
                </div>
              </div>
            </div>

            {/* Right View Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(['month', 'week', 'day', 'agenda'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                    viewMode === mode
                      ? 'bg-white dark:bg-[#141b27] text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* MONTH VIEW GRID */}
          {viewMode === 'month' && (
            <div className="flex-1 bg-white dark:bg-[#0d131f] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs flex flex-col">
              {/* Day Name Headers */}
              <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 text-center text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/40 py-2.5">
                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
              </div>

              {/* Month Cells */}
              <div className="flex-1 grid grid-cols-7 grid-rows-5 divide-x divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                {/* Empty cells before month start */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`blank-${i}`} className="bg-slate-50/30 dark:bg-slate-900/10 p-1.5 min-h-[100px]" />
                ))}

                {/* Days of current month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                  const dayEvents = filteredEvents.filter((e) => e.date === dateString);
                  const isToday = dayNum === 8 && month === 8 && year === 2026;

                  return (
                    <div
                      key={dayNum}
                      onClick={() => {
                        setNewEventPeriod(dateString);
                        setIsAddEventOpen(true);
                      }}
                      className={`p-2 min-h-[120px] flex flex-col justify-between hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group ${
                        isToday ? 'bg-theme-light' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isToday
                              ? 'bg-theme-primary text-white shadow-2xs'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {dayNum}
                        </span>
                        <span className="text-[10px] text-slate-400 group-hover:opacity-100 opacity-0 transition-opacity font-bold">
                          + Event
                        </span>
                      </div>

                      {/* Day Events Stack */}
                      <div className="space-y-1.5 overflow-y-auto flex-1 max-h-[85px] pr-0.5">
                        {dayEvents.map((evt) => {
                          const style = categoryStyles[evt.category];
                          return (
                            <div
                              key={evt.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(evt);
                              }}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all hover:scale-[1.02] ${style.bg} ${style.text} ${style.border} shadow-2xs cursor-pointer flex items-center justify-between gap-1`}
                            >
                              <span className="truncate flex-1">{evt.title}</span>
                              {evt.attendeesCount ? (
                                <span className="shrink-0 opacity-80 text-[9px] font-extrabold flex items-center gap-0.5">
                                  <Icon name="Users" size={10} />
                                  <span>{evt.attendeesCount}</span>
                                </span>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AGENDA / LIST VIEW */}
          {viewMode === 'agenda' && (
            <div className="bg-white dark:bg-[#0d131f] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Icon name="Calendar" size={16} className="text-theme-primary" />
                <span>Upcoming Festivals & Events Schedule</span>
              </h3>

              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredEvents.map((evt) => {
                  const style = categoryStyles[evt.category];
                  return (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 px-3 rounded-xl transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl ${style.bg} ${style.text} border ${style.border}`}>
                          <Icon name="Calendar" size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                              {evt.title}
                            </h4>
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase ${style.badge}`}>
                              {evt.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {evt.description}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                            <span>Date: {evt.date} at {evt.time}</span>
                            <span>Location: {evt.location}</span>
                            {evt.attendeesCount ? <span>Guests: {evt.attendeesCount} Expected</span> : null}
                          </div>
                        </div>
                      </div>

                      {/* Export & Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            exportToICS(evt);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
                        >
                          <Icon name="Download" size={12} /> .ics
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openGoogleCalendar(evt);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-theme-light text-theme-primary text-[11px] font-bold flex items-center gap-1 hover:bg-theme-primary/20 transition-colors"
                        >
                          Google
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* WEEK VIEW GRID */}
          {viewMode === 'week' && (() => {
            const weekDays = getWeekDays(currentDate);

            return (
              <div className="flex-1 bg-white dark:bg-[#0d131f] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs flex flex-col">
                {/* 7-Column Day Headers */}
                <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 text-center text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/40 py-3">
                  {weekDays.map((d) => {
                    const isSelectedDay = d.toDateString() === currentDate.toDateString();
                    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                    const dateFormatted = `${d.getMonth() + 1}/${d.getDate()}`;
                    return (
                      <div key={d.toISOString()} className="flex flex-col items-center gap-1">
                        <span className="text-[11px] uppercase">{dayName}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                            isSelectedDay
                              ? 'bg-theme-primary text-white shadow-2xs'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {dateFormatted}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Week Columns & Events Grid */}
                <div className="flex-1 grid grid-cols-7 divide-x divide-slate-200 dark:divide-slate-800 overflow-y-auto text-xs min-h-[400px]">
                  {weekDays.map((d) => {
                    const yearNum = d.getFullYear();
                    const monthNum = String(d.getMonth() + 1).padStart(2, '0');
                    const dayNum = String(d.getDate()).padStart(2, '0');
                    const dateStr = `${yearNum}-${monthNum}-${dayNum}`;
                    const dayEvts = filteredEvents.filter((e) => e.date === dateStr);

                    return (
                      <div
                        key={dateStr}
                        onClick={() => {
                          setNewEventPeriod(dateStr);
                          setIsAddEventOpen(true);
                        }}
                        className="p-2 space-y-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                      >
                        <div className="text-[10px] text-slate-400 font-bold mb-1 border-b border-slate-100 dark:border-slate-800/60 pb-1 flex justify-between">
                          <span>{dayEvts.length} {dayEvts.length === 1 ? 'Event' : 'Events'}</span>
                        </div>

                        {dayEvts.map((evt) => {
                          const style = categoryStyles[evt.category];
                          return (
                            <div
                              key={evt.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(evt);
                              }}
                              className={`p-2 rounded-xl text-xs border transition-all hover:scale-[1.02] ${style.bg} ${style.text} ${style.border} shadow-2xs cursor-pointer space-y-1`}
                            >
                              <div className="font-extrabold truncate">{evt.title}</div>
                              <div className="text-[10px] opacity-80 flex items-center justify-between">
                                {evt.attendeesCount ? (
                                  <span className="flex items-center gap-0.5">
                                    <Icon name="Users" size={10} />
                                    <span>{evt.attendeesCount}</span>
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          );
                        })}

                        {dayEvts.length === 0 && (
                          <div className="h-full flex items-center justify-center text-[10px] text-slate-300 dark:text-slate-600 font-medium py-8">
                            + Event
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* DAY VIEW DETAIL SCHEDULE */}
          {viewMode === 'day' && (() => {
            const yearNum = currentDate.getFullYear();
            const monthNum = String(currentDate.getMonth() + 1).padStart(2, '0');
            const dayNum = String(currentDate.getDate()).padStart(2, '0');
            const dateStr = `${yearNum}-${monthNum}-${dayNum}`;
            const dayEvts = filteredEvents.filter((e) => e.date === dateStr);
            const formattedDayTitle = currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

            return (
              <div className="flex-1 bg-white dark:bg-[#0d131f] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs flex flex-col space-y-4">
                {/* Day Title Header Banner */}
                <div className="p-4 rounded-xl bg-theme-light border border-theme-primary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-theme-primary uppercase tracking-wider">Day Schedule</span>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {formattedDayTitle}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setNewEventPeriod(dateStr);
                      setIsAddEventOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary-hover transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
                  >
                    + Add Event for Today
                  </button>
                </div>

                {/* Events Timeline List for the Selected Day */}
                <div className="flex-1 overflow-y-auto space-y-3">
                  {dayEvts.map((evt) => {
                    const style = categoryStyles[evt.category];
                    return (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className={`p-4 rounded-xl border transition-all hover:shadow-xs cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${style.bg} ${style.border}`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${style.badge}`}>
                              {evt.category}
                            </span>
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white">{evt.time}</span>
                          </div>
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                            {evt.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            {evt.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-3.5 text-xs text-slate-500 dark:text-slate-400 pt-1.5">
                            <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
                              <Icon name="MapPin" size={12} className="text-theme-primary" />
                              <span>{evt.location}</span>
                            </span>
                            <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
                              <Icon name="User" size={12} className="text-theme-primary" />
                              <span>{evt.organizer}</span>
                            </span>
                            {evt.attendeesCount ? (
                              <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
                                <Icon name="Users" size={12} className="text-theme-primary" />
                                <span>{evt.attendeesCount} Guests</span>
                              </span>
                            ) : null}
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2 self-end md:self-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              exportToICS(evt);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                          >
                            .ics
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openGoogleCalendar(evt);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary-hover transition-all cursor-pointer"
                          >
                            Google Calendar
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {dayEvts.length === 0 && (
                    <div className="p-12 text-center space-y-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                        <Icon name="Calendar" size={20} />
                      </div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Events Scheduled for This Day</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        You have no active events or festivals listed for {formattedDayTitle}.
                      </p>
                      <button
                        onClick={() => {
                          setNewEventPeriod(dateStr);
                          setIsAddEventOpen(true);
                        }}
                        className="px-4 py-1.5 rounded-xl bg-theme-primary text-white text-xs font-bold hover:bg-theme-primary-hover transition-all shadow-2xs cursor-pointer"
                      >
                        + Schedule an Event
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* MODAL 1: ADD EVENT MODAL (MATCHING EXACT DESIGN SPECIFICATION) */}
      {isAddEventOpen && (
        <div className="fixed inset-0 bg-[rgba(15,15,15,0.4)] backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d131f] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Add Event
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Add event details including schedule and location.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddEventOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-medium cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              {/* EVENT NAME* */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  EVENT NAME*
                </label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Enter event name"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
                  required
                />
              </div>

              {/* DESCRIPTION* */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  DESCRIPTION*
                </label>
                <textarea
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value.slice(0, 100))}
                  placeholder="Enter description"
                  maxLength={100}
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all resize-none"
                  required
                />
                <div className="text-right text-[11px] text-slate-400 mt-1 font-medium">
                  {newEventDescription.length}/100 Characters
                </div>
              </div>

              {/* CLIENT* & SITE(S)* */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CLIENT* */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    CLIENT*
                  </label>
                  <div className="relative">
                    <select
                      value={newEventClient}
                      onChange={(e) => setNewEventClient(e.target.value)}
                      className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select client</option>
                      <option value="Derby County Football Club">Derby County Football Club</option>
                      <option value="Derby LIVE">Derby LIVE</option>
                      <option value="Electric Daisy">Electric Daisy</option>
                    </select>
                    <Icon name="ChevronDown" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* SITE(S)* */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    SITE(S)*
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <select
                        value={newEventSite}
                        onChange={(e) => setNewEventSite(e.target.value)}
                        className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 cursor-pointer"
                        required
                      >
                        <option value="" disabled>Select sites</option>
                        <option value="Pride Park Stadium">Pride Park Stadium</option>
                        <option value="Derby Arena">Derby Arena</option>
                        <option value="Central Plaza">Central Plaza</option>
                      </select>
                      <Icon name="ChevronDown" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <button
                      type="button"
                      title="Add new site"
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <div className="relative flex items-center justify-center">
                        <Icon name="MapPin" size={15} />
                        <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-200 ml-0.5">+</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* EVENT PERIOD* */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  EVENT PERIOD*
                </label>
                <div
                  onClick={() => setIsDatePickerOpen(true)}
                  className="relative cursor-pointer group"
                >
                  <Icon name="Calendar" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors pointer-events-none" />
                  <input
                    type="text"
                    value={newEventPeriod}
                    onClick={() => setIsDatePickerOpen(true)}
                    readOnly
                    placeholder="Select event date range"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all cursor-pointer"
                    required
                  />
                </div>
              </div>

              {/* FOOTER ACTION BUTTONS */}
              <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="w-36 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-36 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DATE RANGE PICKER POPOUT (MATCHING SCREENSHOT) */}
      {isDatePickerOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[70] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d131f] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Body layout: Left Presets Sidebar | Right Custom Range Calendar */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Sidebar: Preset Periods */}
              <div className="w-full md:w-48 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Preset Periods
                </h4>
                <div className="flex flex-col gap-1.5 max-h-[340px] overflow-y-auto pr-1">
                  {[
                    'Today',
                    'Yesterday',
                    'Last 7 days',
                    'Last 30 days',
                    'Last 90 days',
                    'Last 12 months',
                    'Last week',
                    'Last month',
                    'Custom',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        selectedPreset === preset
                          ? 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-2xs'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="hidden md:block w-px bg-slate-200 dark:bg-slate-800 self-stretch" />

              {/* Right Panel: Custom Range & Dual Month Calendar */}
              <div className="flex-1 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Custom Range
                </h4>

                {/* Input Fields Row */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Start date (DD/MM/YYYY)"
                      value={pickerStartDate}
                      onChange={(e) => {
                        setPickerStartDate(e.target.value);
                        setSelectedPreset('Custom');
                      }}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <span className="text-slate-400 font-bold">→</span>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="End date (DD/MM/YYYY)"
                      value={pickerEndDate}
                      onChange={(e) => {
                        setPickerEndDate(e.target.value);
                        setSelectedPreset('Custom');
                      }}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Dual Month Calendar View */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  {/* Month 1: September 2026 */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <button
                        type="button"
                        onClick={() => setPickerMonth1(new Date(pickerMonth1.getFullYear(), pickerMonth1.getMonth() - 1, 1))}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-bold cursor-pointer"
                      >
                        ‹
                      </button>
                      <span className="text-xs font-bold text-slate-800 dark:text-white">
                        {pickerMonth1.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPickerMonth1(new Date(pickerMonth1.getFullYear(), pickerMonth1.getMonth() + 1, 1))}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-bold cursor-pointer"
                      >
                        ›
                      </button>
                    </div>

                    {/* Days Header */}
                    <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-slate-400">
                      <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                    </div>

                    {/* Month 1 Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
                      {Array.from({ length: new Date(pickerMonth1.getFullYear(), pickerMonth1.getMonth(), 1).getDay() }).map((_, i) => (
                        <div key={`empty-m1-${i}`} />
                      ))}

                      {Array.from({ length: new Date(pickerMonth1.getFullYear(), pickerMonth1.getMonth() + 1, 0).getDate() }).map((_, i) => {
                        const dayNum = i + 1;
                        const dayStr = `${String(dayNum).padStart(2, '0')}/${String(pickerMonth1.getMonth() + 1).padStart(2, '0')}/${pickerMonth1.getFullYear()}`;
                        const isStart = pickerStartDate === dayStr;
                        const isEnd = pickerEndDate === dayStr;

                        return (
                          <button
                            key={`m1-day-${dayNum}`}
                            type="button"
                            onClick={() => handlePickerDayClick(dayNum, pickerMonth1)}
                            className={`h-7 w-7 mx-auto rounded-full flex items-center justify-center text-xs transition-colors cursor-pointer ${
                              isStart || isEnd
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            {dayNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Month 2: October 2026 */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <button
                        type="button"
                        onClick={() => setPickerMonth2(new Date(pickerMonth2.getFullYear(), pickerMonth2.getMonth() - 1, 1))}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-bold cursor-pointer"
                      >
                        ‹
                      </button>
                      <span className="text-xs font-bold text-slate-800 dark:text-white">
                        {pickerMonth2.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPickerMonth2(new Date(pickerMonth2.getFullYear(), pickerMonth2.getMonth() + 1, 1))}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-bold cursor-pointer"
                      >
                        ›
                      </button>
                    </div>

                    {/* Days Header */}
                    <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-slate-400">
                      <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                    </div>

                    {/* Month 2 Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
                      {Array.from({ length: new Date(pickerMonth2.getFullYear(), pickerMonth2.getMonth(), 1).getDay() }).map((_, i) => (
                        <div key={`empty-m2-${i}`} />
                      ))}

                      {Array.from({ length: new Date(pickerMonth2.getFullYear(), pickerMonth2.getMonth() + 1, 0).getDate() }).map((_, i) => {
                        const dayNum = i + 1;
                        const dayStr = `${String(dayNum).padStart(2, '0')}/${String(pickerMonth2.getMonth() + 1).padStart(2, '0')}/${pickerMonth2.getFullYear()}`;
                        const isStart = pickerStartDate === dayStr;
                        const isEnd = pickerEndDate === dayStr;

                        return (
                          <button
                            key={`m2-day-${dayNum}`}
                            type="button"
                            onClick={() => handlePickerDayClick(dayNum, pickerMonth2)}
                            className={`h-7 w-7 mx-auto rounded-full flex items-center justify-center text-xs transition-colors cursor-pointer ${
                              isStart || isEnd
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            {dayNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
              <button
                type="button"
                onClick={() => setIsDatePickerOpen(false)}
                className="px-6 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (pickerStartDate && pickerEndDate) {
                    setNewEventPeriod(`${pickerStartDate} - ${pickerEndDate}`);
                  } else if (pickerStartDate) {
                    setNewEventPeriod(pickerStartDate);
                  }
                  setIsDatePickerOpen(false);
                }}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EVENT DETAILS & EXPORT */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d131f] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${categoryStyles[selectedEvent.category].badge}`}>
                  {selectedEvent.category}
                </span>
                <span className="text-xs font-bold text-slate-500">ID: {selectedEvent.id}</span>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {selectedEvent.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {selectedEvent.description}
              </p>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedEvent.date} at {selectedEvent.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedEvent.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Organizer:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedEvent.organizer}</span>
                </div>
                {selectedEvent.attendeesCount ? (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Expected Guests:</span>
                    <span className="font-bold text-theme-primary">{selectedEvent.attendeesCount} Attendees</span>
                  </div>
                ) : null}
              </div>

              <div className="space-y-2 pt-1">
                <span className="block font-bold text-slate-700 dark:text-slate-300">Sync with Personal Calendar:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => exportToICS(selectedEvent)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-center font-bold transition-all cursor-pointer"
                  >
                    .ics File
                  </button>
                  <button
                    onClick={() => openGoogleCalendar(selectedEvent)}
                    className="p-2 rounded-xl bg-theme-light text-theme-primary hover:bg-theme-primary/20 text-center font-bold transition-all cursor-pointer"
                  >
                    Google
                  </button>
                  <button
                    onClick={() => openOutlookCalendar(selectedEvent)}
                    className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 hover:bg-blue-100 text-center font-bold transition-all cursor-pointer"
                  >
                    Outlook
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
