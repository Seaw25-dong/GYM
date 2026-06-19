"use client";

import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";

import { getWorkoutLogs, updateWorkoutLog } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

function useWorkoutRealtime() {
  const [logs, setLogs] = useState([]);
  const [connected, setConnected] = useState(false);

  const mergeLog = useCallback((incoming) => {
    setLogs((current) => {
      const index = current.findIndex((log) => log.scheduledDate === incoming.scheduledDate);
      if (index < 0) return [...current, incoming];
      return current.map((log, itemIndex) => (itemIndex === index ? incoming : log));
    });
  }, []);

  useEffect(() => {
    let active = true;
    getWorkoutLogs()
      .then((data) => {
        if (active) setLogs(Array.isArray(data) ? data : []);
      })
      .catch(() => {});

    const socket = io(apiBaseUrl, {
      auth: { token: getAuthToken() },
      transports: ["websocket", "polling"],
    });
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("workout:updated", mergeLog);

    return () => {
      active = false;
      socket.disconnect();
    };
  }, [mergeLog]);

  const saveLog = useCallback(
    async (scheduledDate, payload) => {
      const log = await updateWorkoutLog(scheduledDate, payload);
      mergeLog(log);
      return log;
    },
    [mergeLog]
  );

  return { connected, logs, saveLog };
}

export { useWorkoutRealtime };
