import { useState } from "react";
import { momentLocalizer, Calendar } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useFetcher } from "react-router";

const localizer = momentLocalizer(moment);

const CustomEvent = ({ event }: any) => {
  if (event.type === "start") {
    return <div className="text-green-600">🏁 시작</div>;
  }
  if (event.type === "end") {
    return <div className="text-red-600">🏁 종료</div>;
  }
  if (event.type === "attendable") {
    return (
      <button
        className="text-blue-600 underline"
        onClick={(e) => {
          e.preventDefault();
          event.onAttend();
        }}
      >
        출석하기
      </button>
    );
  }
  if (event.type === "absence") {
    return <div className="absence-event">결석</div>;
  }
  return <div className="custom-event">출석</div>;
};

const MyCalendar = ({
  classId,
  attendance,
  startAt,
  endAt,
}: {
  classId: string;
  startAt: string;
  endAt: string;
  attendance: {
    class_post_id: number;
    date: string;
    profile_id: string | null;
    is_attended: boolean;
  }[];
}) => {
  const fetcher = useFetcher();
  const today = moment().startOf("day");
  const calendarStart = moment(startAt).startOf("day");
  const calendarEnd = moment(endAt).endOf("day");

  const hasAttendedToday = attendance.some(
    (a) => a.is_attended && moment(a.date).isSame(today, "day")
  );

  const attendedEvents = attendance
    .filter((a) => a.is_attended)
    .map((a) => ({
      title: "출석",
      start: moment(a.date).toDate(),
      end: moment(a.date).toDate(),
      type: "attended",
    }));

  const flagEvents = [
    {
      title: "🏁 클래스 시작",
      start: calendarStart.toDate(),
      end: calendarStart.toDate(),
      type: "start",
    },
    {
      title: "🏁 클래스 종료",
      start: calendarEnd.toDate(),
      end: calendarEnd.toDate(),
      type: "end",
    },
  ];

  const absenceEvents = [];
  for (
    let m = calendarStart.clone();
    m.isBefore(calendarEnd);
    m.add(1, "day")
  ) {
    const date = m.format("YYYY-MM-DD");
    if (
      m.isBefore(today, "day") &&
      !attendance.some(
        (a) => a.is_attended && moment(a.date).isSame(date, "day")
      )
    ) {
      absenceEvents.push({
        title: "결석",
        start: m.toDate(),
        end: m.toDate(),
        type: "absence",
      });
    }
  }

  const handleAttend = () => {
    const newEvent = {
      title: "출석",
      start: today.toDate(),
      end: today.toDate(),
      type: "attended",
    };

    fetcher.submit(
      { date: today.format("YYYY-MM-DD") },
      { method: "post", action: `/classes/${classId}/attendance` }
    );

    setEvents((prev) => [
      ...prev.filter((e) => e.type !== "attendable"),
      newEvent,
    ]);
  };

  const todayEvent =
    !hasAttendedToday && today.isBetween(calendarStart, calendarEnd, null, "[]")
      ? [
          {
            title: "출석하기",
            start: today.toDate(),
            end: today.toDate(),
            type: "attendable",
            onAttend: handleAttend,
          },
        ]
      : [];

  const [events, setEvents] = useState([
    ...attendedEvents,
    ...flagEvents,
    ...todayEvent,
    ...absenceEvents,
  ]);

  const handleDateClick = (arg: any) => {
    const clickedDate = moment(arg.start).startOf("day");
    if (
      clickedDate.isAfter(calendarStart, "day") &&
      clickedDate.isBefore(calendarEnd, "day") &&
      !clickedDate.isSame(today, "day")
    ) {
      alert("아직 출석 기간이 아닙니다~");
      return;
    }
    if (
      clickedDate.isBefore(calendarStart, "day") ||
      clickedDate.isAfter(calendarEnd, "day")
    ) {
      return;
    }
    const alreadyAttended = attendance.some(
      (a) => a.is_attended && moment(a.date).isSame(clickedDate, "day")
    );
    if (alreadyAttended) {
      alert("이미 출석되었습니다!");
      return;
    }

    handleAttend();
  };

  const CustomToolbar = ({ label, onNavigate, date }: any) => {
    const prevMonth = moment(date).subtract(1, "month");
    const nextMonth = moment(date).add(1, "month");

    const disablePrev = prevMonth.isBefore(calendarStart, "month");
    const disableNext = nextMonth.isAfter(calendarEnd, "month");

    return (
      <div className="rbc-toolbar">
        <button onClick={() => onNavigate("TODAY")}>Today</button>
        <button
          onClick={() => !disablePrev && onNavigate("PREV")}
          disabled={disablePrev}
        >
          {"<"}
        </button>
        <button
          onClick={() => !disableNext && onNavigate("NEXT")}
          disabled={disableNext}
        >
          {">"}
        </button>
        <span className="rbc-toolbar-label">{label}</span>
      </div>
    );
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectSlot={handleDateClick}
        onSelectEvent={handleDateClick}
        selectable
        defaultView="month"
        style={{ height: 500 }}
        min={calendarStart.toDate()}
        max={calendarEnd.toDate()}
        components={{
          event: CustomEvent,
          toolbar: CustomToolbar,
        }}
        eventPropGetter={() => ({
          className: "",
          style: {
            backgroundColor: "transparent",
            padding: 0,
            border: "none",
            boxShadow: "none",
          },
        })}
      />
    </div>
  );
};

export default MyCalendar;
