import { useCourse } from "@/store/course";
import UnderlineInput from "./UnderlineInput";

interface Props {
  onShowAnswer: () => void;
}

export function Question({ onShowAnswer }: Props) {
  const { currentStatement, checkCorrect } = useCourse();
  const { chinese = "", pinyin = "" } = currentStatement || {};
  const word = chinese;
  const lineNum = pinyin.trim() ? pinyin.trim().split(/\s+/).length : 1;

  function handleCheckAnswer(input: string) {
    if (checkCorrect(input)) {
      onShowAnswer();
    }
  }

  return (
    <div className="text-5xl text-center mb-20 mt-10">
      <div className="text-fuchsia-500 dark:text-gray-50">{word}</div>
      <UnderlineInput
        onCheckAnswer={handleCheckAnswer}
        lineNum={lineNum}
      ></UnderlineInput>
    </div>
  );
}
