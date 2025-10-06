import React, { useEffect, useRef, useState } from 'react';

interface TimerProps {
  workStartedAt?: string; // ISO timestamp when work last started (or undefined)
  time_spent_minutes: number; // total seconds already spent
}

// interface TimerProps {
//   workStartedAt?: string; // ISO timestamp when work began
//   time_spent_minutes: number; // accumulated seconds before this session
//   businessHoursStart: number; // e.g. 9 for 9:00
//   businessHoursEnd: number; // e.g. 17 for 17:00
// }

interface BusinessCountdownProps {
  workStartedAt: string; // e.g. "2025-09-26T11:08:01.740Z"
  totalSlaHours: number; // e.g. 8
  businessStartTime: string; // e.g. "09:00" or "09:00:00"
  businessEndTime: string; // e.g. "19:00" or "19:00:00"
}

const parseTimeString = (time: string) => {
  // Accept "HH:MM" or "HH:MM:SS"
  const parts = time.split(':').map(Number);
  return {
    hours: parts[0] || 0,
    minutes: parts[1] || 0,
    seconds: parts[2] || 0
  };
};

export const BusinessCountdown: React.FC<BusinessCountdownProps> = ({
  workStartedAt,
  totalSlaHours,
  businessStartTime,
  businessEndTime
}) => {
  const slaSeconds = totalSlaHours * 3600;

  const { hours: startH, minutes: startM, seconds: startS } = parseTimeString(businessStartTime);
  const { hours: endH, minutes: endM, seconds: endS } = parseTimeString(businessEndTime);

  // Sum business‐hour seconds elapsed since workStartedAt
  const computeElapsedBusiness = (): number => {
    const startDate = new Date(workStartedAt);
    const now = new Date();
    let elapsed = 0;
    const msPerDay = 24 * 3600 * 1000;

    // Iterate each calendar day
    for (
      let day = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      day <= now;
      day = new Date(day.getTime() + msPerDay)
    ) {
      const windowStart = new Date(day);
      windowStart.setHours(startH, startM, startS, 0);
      const windowEnd = new Date(day);
      windowEnd.setHours(endH, endM, endS, 0);

      const intervalStart = new Date(Math.max(startDate.getTime(), windowStart.getTime()));
      const intervalEnd = new Date(Math.min(now.getTime(), windowEnd.getTime()));

      if (intervalEnd > intervalStart) {
        elapsed += (intervalEnd.getTime() - intervalStart.getTime()) / 1000;
      }
    }
    return Math.floor(elapsed);
  };

  const initialRemaining = Math.max(slaSeconds - computeElapsedBusiness(), 0);
  const [remaining, setRemaining] = useState<number>(initialRemaining);
  const intervalRef = useRef<number>();

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const todayStart = new Date(now);
      todayStart.setHours(startH, startM, startS, 0);
      const todayEnd = new Date(now);
      todayEnd.setHours(endH, endM, endS, 0);

      if (remaining > 0 && now >= todayStart && now < todayEnd) {
        setRemaining(prev => Math.max(prev - 1, 0));
      }
    };

    intervalRef.current = window.setInterval(tick, 1000);
    return () => void clearInterval(intervalRef.current);
  }, [remaining, startH, startM, startS, endH, endM, endS]);

  const hh = String(Math.floor(remaining / 3600)).padStart(2, '0');
  const mm = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');

  return (
    <div
      title="Resolution Timer"
      className="inline-flex items-center space-x-3 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-full font-medium text-xl"
    >
      <span className="animate-pulse block h-3 w-3 bg-red-700 rounded-full" />
      <span>
        {hh}:{mm}:{ss}
      </span>
    </div>
  );
};

export const Timer: React.FC<TimerProps> = ({ workStartedAt, time_spent_minutes }) => {
  if (!workStartedAt) return null;

  const startMs = new Date(workStartedAt).getTime();
  const initialOffsetMs = time_spent_minutes * 1000;

  // elapsedMs = priorSpentMs + (now - startMs)
  const [elapsedMs, setElapsedMs] = useState<number>(Date.now() - startMs + initialOffsetMs);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setElapsedMs(Date.now() - startMs + initialOffsetMs);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [startMs, initialOffsetMs]);

  // Format ms → HH:MM:SS
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const ss = String(totalSeconds % 60).padStart(2, '0');

  return (
    <div className="inline-flex items-center space-x-2 bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1 rounded-full font-mono text-lg">
      <span className="animate-pulse block h-3 w-3 bg-orange-600 rounded-full" />
      <span>
        {hh}:{mm}:{ss}
      </span>
    </div>
  );
};

export const TimeSpentTimer: React.FC<TimerProps> = ({ workStartedAt, time_spent_minutes }) => {
  // Convert accumulated seconds to milliseconds
  const accumulatedMs = time_spent_minutes * 1000;

  // Compute live elapsed milliseconds: if workStartedAt exists, add session time
  const getElapsedMs = () => {
    if (workStartedAt) {
      const sessionMs = Date.now() - new Date(workStartedAt).getTime();
      return accumulatedMs + sessionMs;
    }
    return accumulatedMs;
  };

  const [elapsedMs, setElapsedMs] = useState<number>(getElapsedMs());

  useEffect(() => {
    // Update every second if session active; otherwise no updates needed
    if (!workStartedAt) return;

    const id = setInterval(() => {
      setElapsedMs(getElapsedMs());
    }, 1000);

    return () => clearInterval(id);
  }, [workStartedAt, accumulatedMs]);

  // Format elapsedMs → HH:MM:SS
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const ss = String(totalSeconds % 60).padStart(2, '0');

  return (
    <div className="inline-flex items-center space-x-2 bg-gray-100 border border-gray-300 text-gray-800 px-3 py-1 rounded-full font-mono text-lg">
      {<span className="animate-pulse block h-3 w-3 bg-gray-800 rounded-full" />}
      <span>
        {hh}:{mm}:{ss}
      </span>
    </div>
  );
};
