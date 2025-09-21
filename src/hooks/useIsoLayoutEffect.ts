import { useEffect, useLayoutEffect } from "react";

export const useIsoLayoutEffect: typeof useEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
