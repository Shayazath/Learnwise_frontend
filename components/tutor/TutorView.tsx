"use client";

import { FormEvent, RefObject } from "react";
import {
  BookOpen,
  ChevronRight,
  FileText,
  RefreshCw,
  Send,
  Sparkles,
} from "lucide-react";
import AiOrb from "@/app/components/AiOrb";
import LearningScene from "@/app/components/LearningScene";
import type { ChatMessage } from "@/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  messages: ChatMessage[];
  message: string;
  useDocs: boolean;
  busy: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  messageEndRef: RefObject<HTMLDivElement | null>;
  onMessageChange: (value: string) => void;
  onUseDocsChange: (value: boolean) => void;
  onUsePrompt: (prompt: string) => void;
  onSendMessage: (event?: FormEvent, preset?: string) => void;
  onStartNewChat: () => void;
  onOpenQuiz: () => void;
};

const starterPrompts = [
  {
    icon: "🧠",
    title: "Decode AI",
    description: "How do LLMs actually work?",
    prompt:
      "Teach me how large language models work, starting with a simple analogy.",
  },
  {
    icon: "🐍",
    title: "Level up coding",
    description: "Learn a concept by doing",
    prompt:
      "Teach me Python decorators with a simple example, then give me a small exercise.",
  },
  {
    icon: "📚",
    title: "Study my notes",
    description: "Turn documents into clarity",
    prompt:
      "Use my uploaded materials to create a concise study guide with the most important concepts.",
  },
];

export function TutorView({
  messages,
  message,
  useDocs,
  busy,
  textareaRef,
  messageEndRef,
  onMessageChange,
  onUseDocsChange,
  onUsePrompt,
  onSendMessage,
  onStartNewChat,
  onOpenQuiz,
}: Props) {
  const handleSubmit = (event: FormEvent) => onSendMessage(event);

  return (
    <section
      className={`view active-view ${messages.length > 0 ? "conversation-active" : "conversation-landing"}`}
    >
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR PERSONAL LEARNING SPACE</p>
          <h1>
            What would you like to <span>learn today?</span>
          </h1>
          <p className="subtitle">
            Ask questions, explore your notes, and turn what you learn into
            lasting knowledge.
          </p>
        </div>
        <LearningScene />
      </div>

      <div className="suggestion-grid">
        <button
          className="suggestion-card"
          onClick={() =>
            onUsePrompt(
              "Explain a difficult concept in simple terms, with an everyday example.",
            )
          }
        >
          <span className="suggestion-icon purple">✧</span>
          <strong>Explain a concept</strong>
          <small>Make difficult topics easy to understand</small>
          <span className="card-arrow">↗</span>
        </button>
        <button
          className="suggestion-card"
          onClick={() =>
            onUsePrompt(
              "Create a step-by-step study guide for learning a new topic.",
            )
          }
        >
          <span className="suggestion-icon peach">▤</span>
          <strong>Create a study guide</strong>
          <small>Break a topic into manageable steps</small>
          <span className="card-arrow">↗</span>
        </button>
        <button className="suggestion-card" onClick={onOpenQuiz}>
          <span className="suggestion-icon mint">✓</span>
          <strong>Test my knowledge</strong>
          <small>Practice and understand your mistakes</small>
          <span className="card-arrow">↗</span>
        </button>
      </div>

      <section className="chat-section tutor-workspace">
        <div className="tutor-intro-row">
          <div className="tutor-intro-copy">
            <div className="tutor-kicker">
              <span className="tutor-spark">✦</span> YOUR AI STUDY SIDEKICK
            </div>
            <h2>
              Big question? <span>Let's get into it.</span>
            </h2>
            <p>
              Ask naturally. Learn at your pace. Your notes are one click away.
            </p>
          </div>
          <div className="tutor-presence">
            <span className="presence-orb" />
            <span>
              <strong>Ready when you are</strong>
              <small>Groq · running cloud</small>
            </span>
          </div>
        </div>

        <div className="tutor-prompt-row" aria-label="Quick prompt ideas">
          <button
            type="button"
            onClick={() =>
              onUsePrompt(
                "Explain this concept like I'm completely new to it, using a relatable analogy.",
              )
            }
          >
            <span>✳</span> Explain simply
          </button>
          <button
            type="button"
            onClick={() =>
              onUsePrompt(
                "Give me a practical, real-world example and walk me through it step by step.",
              )
            }
          >
            <span>↗</span> Real-world examples
          </button>
          <button
            type="button"
            onClick={() =>
              onUsePrompt(
                "Summarize the key ideas from my uploaded study materials in clear bullet points.",
              )
            }
          >
            <span>▤</span> Summarize my notes
          </button>
          <button type="button" onClick={onOpenQuiz}>
            <span>✓</span> Quiz me
          </button>
        </div>

        <div className="chat-card tutor-chat-card">
          <div className="chat-toolbar">
            <div className="session-identity">
              <span className="session-avatar">
                <Sparkles size={15} />
              </span>
              <span>
                <strong>Study room</strong>
                <small>
                  {messages.length
                    ? `${messages.length} messages in this session`
                    : "A fresh space for curious minds"}
                </small>
              </span>
            </div>
            <div className="session-actions">
              <span className="session-secure">
                <span className="status-dot" /> Private
              </span>
              <button className="icon-button" onClick={onStartNewChat}>
                <RefreshCw size={13} /> New chat
              </button>
            </div>
          </div>

          <div
            className={`chat-messages tutor-messages ${messages.length ? "has-messages" : "is-empty"}`}
            aria-live="polite"
          >
            {messages.length === 0 ? (
              <div className="tutor-welcome">
                <AiOrb />
                <div className="welcome-copy">
                  <span className="welcome-pill">
                    HEY, CURIOUS HUMAN <span>✦</span>
                  </span>
                  <h3>
                    What’s on your <em>mind?</em>
                  </h3>
                  <p>
                    Drop a question, a tricky topic, or a wild idea. We’ll
                    unpack it together.
                  </p>
                </div>
                <div className="starter-grid">
                  {starterPrompts.map((item) => (
                    <button
                      type="button"
                      key={item.title}
                      onClick={() => onUsePrompt(item.prompt)}
                    >
                      <span className="starter-emoji">{item.icon}</span>
                      <span>
                        <strong>{item.title}</strong>
                        <small>{item.description}</small>
                      </span>
                      <ChevronRight size={16} />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((item, index) => (
                <div
                  className={`message-item ${item.role}`}
                  key={`${item.role}-${index}`}
                >
                  {item.role === "assistant" && (
                    <span className="message-avatar">
                      <Sparkles size={14} />
                    </span>
                  )}
                  <div className={`bubble ${item.role}`}>
                    {item.role === "assistant" && (
                      <strong>
                        LearnYah <span>· AI tutor</span>
                      </strong>
                    )}
                    <div
                      className="
  markdown-content
  space-y-2
  text-[14px]
  leading-7
  [&_p]:mb-2
  [&_h1]:text-xl
  [&_h1]:font-bold
  [&_h1]:mt-4
  [&_h2]:text-lg
  [&_h2]:font-semibold
  [&_h2]:mt-4
  [&_h3]:text-base
  [&_h3]:font-semibold
  [&_ul]:my-2
  [&_ul]:list-disc
  [&_ul]:pl-6
  [&_ol]:my-2
  [&_ol]:list-decimal
  [&_ol]:pl-6
  [&_li]:my-1
  [&_strong]:font-bold
  [&_table]:w-full
  [&_table]:my-3
  [&_th]:p-2
  [&_td]:p-2
  [&_pre]:my-3
  [&_pre]:rounded-xl
  [&_pre]:p-4
"
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {item.text.replace(/<br\s*\/?>/gi, "\n")}
                      </ReactMarkdown>
                    </div>
                    {item.sources?.length ? (
                      <div className="source-list">
                        <strong>Sources used</strong>
                        {item.sources.map((source, sourceIndex) => (
                          <div
                            key={`${source.filename}-${source.chunk}-${sourceIndex}`}
                          >
                            • {source.filename}, chunk {source.chunk}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  {item.role === "user" && (
                    <span className="user-message-avatar">Y</span>
                  )}
                </div>
              ))
            )}
            {busy && (
              <div className="message-item assistant">
                <span className="message-avatar">
                  <Sparkles size={14} />
                </span>
                <div className="bubble assistant typing-bubble">
                  <strong>
                    LearnYah <span>· thinking</span>
                  </strong>
                  <div className="typing-dots">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>

          <form className="composer tutor-composer" onSubmit={handleSubmit}>
            <div className="composer-topline">
              <span className="composer-label">
                <Sparkles size={13} /> MESSAGE YOUR AI TUTOR
              </span>
              <span className="composer-limit">{message.length}/5000</span>
            </div>
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(event) => {
                onMessageChange(event.target.value);
                event.currentTarget.style.height = "auto";
                event.currentTarget.style.height = `${Math.min(event.currentTarget.scrollHeight, 180)}px`;
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  onSendMessage();
                }
              }}
              rows={2}
              maxLength={5000}
              placeholder="Ask anything… e.g. Explain RAG with a real-world analogy."
              required
            />
            <div className="composer-bottom">
              <div className="composer-tools">
                <label
                  className={`source-toggle ${useDocs ? "source-enabled" : ""}`}
                  title="When enabled, answers can use your indexed documents"
                >
                  <input
                    type="checkbox"
                    checked={useDocs}
                    onChange={(event) => onUseDocsChange(event.target.checked)}
                  />
                  <span className="toggle-ui" />
                  <span>
                    <BookOpen size={13} /> Use my notes
                  </span>
                </label>
                <span className="composer-shortcut">
                  ↵ Send <kbd>Shift</kbd> + <kbd>↵</kbd> new line
                </span>
              </div>
              <div className="composer-actions">
                <span className="privacy-hint">Local & private</span>
                <button
                  className="send-button tutor-send"
                  type="submit"
                  disabled={busy || !message.trim()}
                  aria-label="Send message"
                >
                  <Send size={16} />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </form>
        </div>
        <p className="disclaimer">
          <span>✦</span> LearnYah can make mistakes. Use trusted sources for
          important decisions.
        </p>
      </section>
    </section>
  );
}
