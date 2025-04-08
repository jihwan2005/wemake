import { DateTime } from "luxon";
import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export default function Countdown({ startAt }: { startAt: string }) {
  const days = useMotionValue(0);
  const hours = useMotionValue(0);
  const minutes = useMotionValue(0);
  const seconds = useMotionValue(0);

  const rDays = useTransform(days, (val) =>
    String(Math.floor(val)).padStart(2, "0")
  );
  const rHours = useTransform(hours, (val) =>
    String(Math.floor(val)).padStart(2, "0")
  );
  const rMinutes = useTransform(minutes, (val) =>
    String(Math.floor(val)).padStart(2, "0")
  );
  const rSeconds = useTransform(seconds, (val) =>
    String(Math.floor(val)).padStart(2, "0")
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = DateTime.now();
      const target = DateTime.fromISO(startAt);
      const diff = target.diff(now, ["days", "hours", "minutes", "seconds"]);

      if (diff.toMillis() <= 0) {
        clearInterval(interval);
        animate(days, 0);
        animate(hours, 0);
        animate(minutes, 0);
        animate(seconds, 0);
      } else {
        animate(days, diff.days);
        animate(hours, diff.hours);
        animate(minutes, diff.minutes);
        animate(seconds, diff.seconds);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startAt]);

  return (
    <div className="flex gap-2 text-lg font-semibold">
      <motion.pre>{rDays}</motion.pre> : <motion.pre>{rHours}</motion.pre>:
      <motion.pre>{rMinutes}</motion.pre> : <motion.pre>{rSeconds}</motion.pre>
    </div>
  );
}
