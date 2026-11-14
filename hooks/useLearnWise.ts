
"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { apiRequest } from "@/lib/api";
import { getDocuments } from "@/lib/document.service";

import type {
  ChatMessage,
  DocumentItem,
  QuizResponse,
  SourceItem,
  ThemeName,
  ViewName,
} from "@/types";

export function useLearnWise() {
  const [view, setView] = useState<ViewName>("tutor");

  // Theme
  const [theme, setTheme] = useState<ThemeName>("dark");

  // Documents
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(
    null,
  );

  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [useDocs, setUseDocs] = useState(true);
  const [busy, setBusy] = useState(false);

  // Quiz
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [quizUseDocs, setQuizUseDocs] = useState(true);
  const [quizBusy, setQuizBusy] = useState(false);
  const [quizResult, setQuizResult] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ------------------------------------
  // Theme
  // ------------------------------------

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");

    window.localStorage.setItem("learnwise-theme", theme);
  }, [theme]);

  // ------------------------------------
  // Refresh documents
  // ------------------------------------

  const refreshDocuments = useCallback(async () => {
    try {
      const result = await getDocuments();
      setDocuments(result);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
  }, []);

  useEffect(() => {
    void refreshDocuments();
  }, [refreshDocuments]);

  // ------------------------------------
  // Navigation
  // ------------------------------------

  const navigate = useCallback(
    (next: ViewName) => {
      setView(next);

      if (next === "library") {
        void refreshDocuments();
      }
    },
    [refreshDocuments],
  );

  // ------------------------------------
  // Start new chat
  // ------------------------------------

  const startNewChat = useCallback(() => {
    setMessages([]);
    setMessage("");
    setView("tutor");
  }, []);

  // ------------------------------------
  // Use suggested prompt
  // ------------------------------------

  const usePrompt = useCallback((prompt: string) => {
    setMessage(prompt);

    requestAnimationFrame(() => {
      textareaRef.current?.focus();

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(
          textareaRef.current.scrollHeight,
          180,
        )}px`;
      }
    });
  }, []);

  // ------------------------------------
  // Send chat message
  // ------------------------------------

  const sendMessage = useCallback(
    async (event?: FormEvent, preset?: string) => {
      event?.preventDefault();

      const question = (preset ?? message).trim();

      if (!question || busy) return;

      setMessages((current) => [
        ...current,
        { role: "user", text: question },
      ]);

      setMessage("");

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      setBusy(true);

      try {
        const result = await apiRequest<{
          answer: string;
          sources: SourceItem[];
        }>("/chat", {
          method: "POST",
          data: {
            message: question,
            use_documents: useDocs,
          },
        });

        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            text: result.answer,
            sources: result.sources,
          },
        ]);
      } catch (error) {
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            text: `I couldn't complete that request: ${
              (error as Error).message
            }`,
          },
        ]);
      } finally {
        setBusy(false);
      }
    },
    [busy, message, useDocs],
  );

  // ------------------------------------
  // Upload document
  // ------------------------------------

  const uploadDocument = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (!selectedFile || uploading) return;

      setUploading(true);
      setUploadStatus("Uploading and indexing your document…");

      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const result = await apiRequest<{
          id: string;
          filename: string;
          chunk_count: number;
        }>("/documents", {
          method: "POST",
          data: formData,
        });

        setUploadStatus(
          `Added ${result.filename} · ${result.chunk_count} text chunks indexed.`,
        );

        setSelectedFile(null);

        await refreshDocuments();
      } catch (error) {
        console.error("Document upload failed:", error);

        setUploadStatus(
          (error as Error).message || "Failed to upload document.",
        );
      } finally {
        setUploading(false);
      }
    },
    [refreshDocuments, selectedFile, uploading],
  );

  // ------------------------------------
  // Delete document
  // ------------------------------------

  const deleteDocument = useCallback(
    async (documentId: string) => {
      if (deletingDocumentId) return;

      setDeletingDocumentId(documentId);
      setUploadStatus("");

      try {
        await apiRequest(`/documents/${documentId}`, {
          method: "DELETE",
        });

        setDocuments((current) =>
          current.filter((doc) => String(doc.id) !== documentId),
        );

        setUploadStatus("Document deleted successfully.");
      } catch (error) {
        console.error("Document deletion failed:", error);

        setUploadStatus(
          (error as Error).message || "Failed to delete document.",
        );
      } finally {
        setDeletingDocumentId(null);
      }
    },
    [deletingDocumentId],
  );

  // ------------------------------------
  // Generate quiz
  // ------------------------------------

  const generateQuiz = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (!topic.trim() || quizBusy) return;

      setQuizBusy(true);
      setQuizResult("Preparing your practice questions…");

      try {
        const result = await apiRequest<QuizResponse>("/quiz", {
          method: "POST",
          data: {
            topic: topic.trim(),
            question_count: questionCount,
            use_documents: quizUseDocs,
          },
        });

        setQuizResult(
          result.quiz +
            (result.sources.length
              ? `\n\nBased on: ${result.sources.join(", ")}`
              : ""),
        );
      } catch (error) {
        setQuizResult(
          `Could not generate quiz: ${(error as Error).message}`,
        );
      } finally {
        setQuizBusy(false);
      }
    },
    [questionCount, quizBusy, quizUseDocs, topic],
  );

  // ------------------------------------
  // Theme toggle
  // ------------------------------------

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  // ------------------------------------
  // Return
  // ------------------------------------

  return {
    view,
    theme,

    // Documents
    documents,
    selectedFile,
    uploading,
    uploadStatus,
    deletingDocumentId,

    // Chat
    messages,
    message,
    useDocs,
    busy,

    // Quiz
    topic,
    questionCount,
    quizUseDocs,
    quizBusy,
    quizResult,

    // Refs
    textareaRef,

    // Setters
    setMessage,
    setUseDocs,
    setSelectedFile,
    setTopic,
    setQuestionCount,
    setQuizUseDocs,

    // Actions
    navigate,
    startNewChat,
    usePrompt,
    sendMessage,
    uploadDocument,
    deleteDocument,
    generateQuiz,
    refreshDocuments,
    toggleTheme,
  };
}
