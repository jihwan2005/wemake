import { useState } from "react";
import { momentLocalizer, Calendar } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useFetcher } from "react-router";

const localizer = momentLocalizer(moment);

const CustomEvent = ({ event }: any) => {
  return <div className="custom-event">출석</div>;
};

const MyCalendar = ({
  classId,
  attendance,
}: {
  classId: string;
  attendance: {
    class_post_id: number;
    date: string;
    profile_id: string | null;
    is_attended: boolean;
  }[];
}) => {
  const fetcher = useFetcher();
  const today = moment().startOf("day").toDate();
  const attendedEvents = attendance
    .filter((a) => a.is_attended)
    .map((a) => ({
      title: "출석 완료!",
      start: moment(a.date).toDate(),
      end: moment(a.date).toDate(),
    }));
  const [events, setEvents] = useState(attendedEvents);
  const handleDateClick = (arg: any) => {
    const clickedDate = moment(arg.start).startOf("day");
    const todayDate = moment().startOf("day");

    if (!clickedDate.isSame(todayDate)) {
      alert("오늘만 선택할 수 있어요!");
      return;
    }

    const alreadyAttended = attendance.some(
      (a) => a.is_attended && moment(a.date).isSame(clickedDate, "day")
    );
    if (alreadyAttended) {
      alert("이미 출석되었습니다!");
      return;
    }

    const newEvent = {
      title: "출석 완료!",
      start: clickedDate.toDate(),
      end: clickedDate.toDate(),
    };
    setEvents([...events, newEvent]);
    fetcher.submit(
      {
        date: clickedDate.format("YYYY-MM-DD"),
      },
      {
        method: "post",
        action: `/classes/${classId}/attendance`,
      }
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
        selectable="ignoreEvents"
        defaultView="month"
        style={{ height: 500 }}
        min={today}
        max={today}
        components={{
          event: CustomEvent,
          toolbar: ({ label, onNavigate }) => (
            <div className="rbc-toolbar">
              <button onClick={() => onNavigate("TODAY")}>Today</button>
              <button onClick={() => onNavigate("PREV")}>{"<"}</button>
              <button onClick={() => onNavigate("NEXT")}>{">"}</button>
              <span className="rbc-toolbar-label">{label}</span>
            </div>
          ),
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
