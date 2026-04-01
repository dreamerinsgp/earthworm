import { useCourse } from "@/store/course";
import { playChinesePronunciation } from "@/lib/chineseTts";
import { useCallback } from "react";

export function usePlaySound() {
  const { currentStatement } = useCourse();
  const chinese = currentStatement?.chinese?.trim() ?? "";

  const playSound = useCallback(() => {
    void playChinesePronunciation(chinese);
  }, [chinese]);

  return { playSound };
}
