"use client";

import { useEffect, useState } from "react";
import { getPitStopOptions, predictPitStop, getLapTimeOptions } from "@/lib/api";

const LOADING_DURATION_MS = 4600;

export default function usePitStopModel() {
  const [options, setOptions] = useState(null);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [error, setError] = useState(null);
  const predicting = phase === "loading";

  useEffect(() => {
    Promise.all([getPitStopOptions(), getLapTimeOptions()])
      .then(([pitOptions, lapTimeOptions]) => {
        setOptions({ ...pitOptions, drivers: lapTimeOptions.drivers ?? [] });
        setLoadingOptions(false);
      })
      .catch((reason) => { setError(reason.message); setLoadingOptions(false); });
  }, []);

  async function runPrediction(payload) {
    setError(null);
    setPhase("loading");
    const started = Date.now();
    try {
      const result = await predictPitStop(payload);
      const remaining = Math.max(LOADING_DURATION_MS - (Date.now() - started), 0);
      await new Promise((resolve) => setTimeout(resolve, remaining));
      setPrediction(result);
      setPhase("revealed");
      return result;
    } catch (reason) {
      setError(reason.message);
      setPhase("idle");
      return null;
    }
  }

  function resetPrediction() { setPrediction(null); setPhase("idle"); }

  return { options, loadingOptions, prediction, phase, predicting, error, runPrediction, resetPrediction };
}