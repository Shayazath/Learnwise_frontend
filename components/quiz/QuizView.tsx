"use client";

import { FormEvent } from "react";
import { ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
type Props = {
  topic: string;
  questionCount: number;
  useDocs: boolean;
  busy: boolean;
  result: string;
  onTopicChange: (value: string) => void;
  onQuestionCountChange: (value: number) => void;
  onUseDocsChange: (value: boolean) => void;
  onGenerate: (event: FormEvent) => void;
};

export function QuizView({
  topic,
  questionCount,
  useDocs,
  busy,
  result,
  onTopicChange,
  onQuestionCountChange,
  onUseDocsChange,
  onGenerate,
}: Props) {
  return (
    <section className="view active-view">
      <div className="page-heading compact-heading">
        <div>
          <p className="eyebrow">LEARN BY PRACTISING</p>
          <h1>
            Practice <span>Quiz</span>
          </h1>
          <p className="subtitle">
            Turn your study topics into questions that help knowledge stick.
          </p>
        </div>
      </div>

      <div className="quiz-layout">
        <form className="quiz-builder" onSubmit={onGenerate}>
          <div className="quiz-icon">✎</div>
          <h2>Create a practice quiz</h2>
          <p>
            Choose a topic and LearnYah will prepare questions with answers and
            explanations.
          </p>

          <label htmlFor="topic">What would you like to practise?</label>
          <input
            id="topic"
            value={topic}
            onChange={(event) => onTopicChange(event.target.value)}
            maxLength={300}
            placeholder="e.g. Python functions, cell biology…"
            required
          />

          <label htmlFor="count">Number of questions</label>
          <select
            id="count"
            value={questionCount}
            onChange={(event) =>
              onQuestionCountChange(Number(event.target.value))
            }
          >
            <option value={3}>3 questions · Quick practice</option>
            <option value={5}>5 questions · Standard</option>
            <option value={10}>10 questions · Deep practice</option>
          </select>

          <label className="source-toggle quiz-source">
            <input
              type="checkbox"
              checked={useDocs}
              onChange={(event) => onUseDocsChange(event.target.checked)}
            />
            <span className="toggle-ui" />
            <span>Use my uploaded materials when relevant</span>
          </label>

          <button
            type="submit"
            className="primary-button full-button"
            disabled={busy || !topic.trim()}
          >
            {busy ? "Generating…" : "Generate my quiz"}{" "}
            <ChevronRight size={15} />
          </button>
        </form>

        <div className="quiz-output">
          {result ? (
            <div
              className="
  quiz-result-text
  markdown-content
  space-y-2
  text-sm
  leading-7
  [&_p]:mb-2
  [&_h1]:text-xl
  [&_h1]:font-bold
  [&_h2]:text-lg
  [&_h2]:font-semibold
  [&_h2]:mt-4
  [&_ol]:my-2
  [&_ol]:list-decimal
  [&_ol]:pl-6
  [&_ul]:my-2
  [&_ul]:list-disc
  [&_ul]:pl-6
  [&_li]:my-1
  [&_strong]:font-bold
"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {result.replace(/<br\s*\/?>/gi, "\n")}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="output-placeholder">
              <span>☷</span>
              <strong>Your quiz will appear here</strong>
              <p>
                Choose a topic and generate a set of practice questions to
                begin.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
