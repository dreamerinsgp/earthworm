import { useCourse } from "@/store/course";
import UnderlineInput from "./UnderlineInput";

interface Props {
  onShowAnswer: () => void;
}

export function Question({ onShowAnswer }: Props) {
  const { currentStatement, checkCorrect } = useCourse();
  const { chinese = "", pinyin = "", englishGloss } = currentStatement || {};
  const gloss = englishGloss?.trim();
  const prompt = gloss || chinese;
  const promptLang = gloss ? "en" : "zh";
  const lineNum = pinyin.trim() ? pinyin.trim().split(/\s+/).length : 1;

  function handleCheckAnswer(input: string) {
    if (checkCorrect(input)) {
      onShowAnswer();
    }
  }

  return (
    <div className="text-center mb-20 mt-10 px-4">
      <div
        className="text-fuchsia-500 dark:text-gray-50 max-w-3xl mx-auto leading-tight mb-2"
        lang={promptLang}
      >
        <p
          className={
            gloss
              ? "text-3xl sm:text-4xl font-medium"
              : "text-5xl"
          }
        >
          {prompt}
        </p>
        {!gloss ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-normal">
            No English cue in data — type pinyin for this Chinese.
          </p>
        ) : null}
      </div>
      <UnderlineInput
        onCheckAnswer={handleCheckAnswer}
        lineNum={lineNum}
      ></UnderlineInput>
    </div>
  );
}
