import React, { useEffect, useState } from 'react';

interface TimerProps {
  workStartedAt?: string; // ISO timestamp when work began
  time_spent_minutes: number; // already accumulated minutes
}

interface TimerProps {
  workStartedAt?: string; // ISO timestamp when work last started (or undefined)
  time_spent_minutes: number; // total seconds already spent
}

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
