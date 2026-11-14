
"use client";

import { useRef, useState, type FormEvent, type DragEvent } from "react";
import {
  FileText,
  FileType,
  RefreshCw,
  Upload,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  CloudUpload,
  File,
  Loader2,
  BookOpen,
} from "lucide-react";
import type { DocumentItem } from "@/types";

type Props = {
  documents: DocumentItem[];
  selectedFile: File | null;
  uploading: boolean;
  uploadStatus: string;
  deletingDocumentId: string | null;
  onSelectFile: (file: File | null) => void;
  onUpload: (event: FormEvent) => void;
  onRefresh: () => void;
  onDelete: (documentId: string) => void;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function LibraryView({
  documents,
  selectedFile,
  uploading,
  uploadStatus,
  deletingDocumentId,
  onSelectFile,
  onUpload,
  onRefresh,
  onDelete,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleFile = (file?: File) => {
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!["pdf", "txt"].includes(extension || "")) {
      onSelectFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      onSelectFile(null);
      return;
    }

    onSelectFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  const handleDelete = (documentId: string) => {
    onDelete(documentId);
    setConfirmDeleteId(null);
  };

  const statusIsError =
    /failed|error|unable|invalid|exceeds/i.test(uploadStatus);

  return (
    <section className="view active-view w-full min-w-0 space-y-6 pb-6 pt-6 sm:space-y-8 sm:pt-8">

      {/* Page heading */}
      <div className="space-y-2 sm:space-y-3">
        <p className="text-[10px] font-bold tracking-[0.2em] text-violet-400 sm:text-xs">
          YOUR KNOWLEDGE BASE
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          My <span className="text-violet-400">Library</span>
        </h1>

        <p className="max-w-xl text-xs leading-6 text-slate-400 sm:text-sm">
          Manage your study materials and build your personal AI knowledge base.
        </p>
      </div>

      {/* Upload section */}
      <form onSubmit={onUpload} className="space-y-3">
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              setIsDragging(false);
            }
          }}
          onDrop={handleDrop}
          className={`relative flex min-w-0 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed px-5 py-7 text-center transition-all sm:gap-5 sm:p-10 ${
            isDragging
              ? "border-violet-400 bg-violet-500/15"
              : "border-violet-400/30 bg-[#211d2e] hover:border-violet-400/70 hover:bg-violet-500/[0.06]"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.txt,application/pdf,text/plain"
            hidden
            disabled={uploading}
            onChange={(event) => {
              handleFile(event.target.files?.[0]);
              event.currentTarget.value = "";
            }}
          />

          {/* Upload icon */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400 sm:h-16 sm:w-16">
            {uploading ? (
              <Loader2 size={26} className="animate-spin sm:h-[30px] sm:w-[30px]" />
            ) : (
              <CloudUpload size={26} className="sm:h-[30px] sm:w-[30px]" />
            )}
          </div>

          {/* Upload information */}
          <div className="w-full max-w-lg space-y-2">
            <h2 className="text-base font-semibold text-white sm:text-lg">
              {uploading ? "Uploading your document..." : "Add study materials"}
            </h2>

            <p className="mx-auto max-w-sm text-xs leading-6 text-slate-400 sm:text-sm">
              Drag and drop your files here, or browse from your computer.
              LearnYah will extract and index the content for your AI tutor.
            </p>

            <p className="text-[10px] text-slate-500 sm:text-xs">
              PDF and TXT supported · Maximum 10 MB per file
            </p>
          </div>

          {/* Browse button */}
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <Upload size={16} />
            Browse files
          </button>

          <p className="text-[10px] text-slate-500 sm:hidden">
            Select a PDF or TXT file from your device
          </p>
        </div>

        {/* Selected file */}
        {selectedFile && (
          <div className="flex min-w-0 flex-wrap items-center gap-3 rounded-xl border border-violet-400/20 bg-[#211d2e] p-3 sm:p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400 sm:h-11 sm:w-11">
              <FileText size={21} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white sm:text-sm">
                {selectedFile.name}
              </p>
              <p className="mt-1 text-[10px] text-slate-400 sm:text-xs">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>

            {!uploading && (
              <button
                type="button"
                onClick={() => onSelectFile(null)}
                aria-label="Remove selected file"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={17} />
              </button>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50 sm:ml-auto sm:w-auto sm:text-sm"
            >
              {uploading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Uploading
                </>
              ) : (
                <>
                  <Upload size={15} />
                  Upload document
                </>
              )}
            </button>
          </div>
        )}
      </form>

      {/* Upload status */}
      {uploadStatus && (
        <div
          role="status"
          className={`flex min-w-0 items-start gap-3 break-words rounded-xl px-4 py-3 text-xs sm:text-sm ${
            statusIsError
              ? "border border-rose-500/20 bg-rose-500/10 text-rose-400"
              : "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          }`}
        >
          {statusIsError ? (
            <AlertCircle size={17} className="shrink-0" />
          ) : (
            <CheckCircle2 size={17} className="shrink-0" />
          )}
          {uploadStatus}
        </div>
      )}

      {/* Collection heading */}
      <div className="flex min-w-0 items-center justify-between gap-3 pt-1">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold tracking-[0.18em] text-violet-400 sm:text-xs">
            YOUR COLLECTION
          </p>

          <h2 className="mt-1.5 text-lg font-bold text-white sm:mt-2 sm:text-xl">
            Your documents
          </h2>

          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            {documents.length} document
            {documents.length === 1 ? "" : "s"} in your library
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          aria-label="Refresh documents"
          title="Refresh documents"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-medium text-slate-300 transition hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white sm:px-4"
        >
          <RefreshCw size={14} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Document cards */}
      {documents.length > 0 ? (
        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {documents.map((doc) => {
            const isPdf = doc.filename.toLowerCase().endsWith(".pdf");
            const documentId = String(doc.id);
            const isDeleting = deletingDocumentId === documentId;
            const isConfirming = confirmDeleteId === documentId;

            return (
              <article
                key={doc.id}
                className="group min-w-0 rounded-2xl border border-white/10 bg-[#211d2e] p-4 transition duration-200 hover:border-violet-400/40 hover:shadow-xl hover:shadow-violet-950/20 sm:p-5 sm:hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${
                      isPdf
                        ? "bg-rose-500/10 text-rose-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {isPdf ? <FileType size={23} /> : <FileText size={23} />}
                  </div>

                  <span
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-bold tracking-wider ${
                      isPdf
                        ? "bg-rose-500/10 text-rose-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {isPdf ? "PDF" : "TXT"}
                  </span>
                </div>

                <div className="mt-4 min-w-0 sm:mt-5">
                  <h3
                    title={doc.filename}
                    className="truncate text-sm font-semibold text-white"
                  >
                    {doc.filename}
                  </h3>

                  <p className="mt-2 flex items-center gap-2 text-[11px] text-slate-400 sm:text-xs">
                    <BookOpen size={14} className="shrink-0" />
                    {doc.chunk_count} indexed text chunks
                  </p>
                </div>

                <div className="mt-4 border-t border-white/10 pt-3 sm:mt-5 sm:pt-4">
                  {isConfirming ? (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-300">
                        Are you sure you want to delete this document?
                      </p>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          disabled={isDeleting}
                          className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(documentId)}
                          disabled={isDeleting}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-500 disabled:opacity-50"
                        >
                          {isDeleting ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-500 sm:text-[11px]">
                        Available for AI learning
                      </span>

                      <button
                        type="button"
                        title="Delete document"
                        aria-label={`Delete ${doc.filename}`}
                        onClick={() => setConfirmDeleteId(documentId)}
                        disabled={!!deletingDocumentId}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-400 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {isDeleting ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty library */
        <div className="flex min-h-[190px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#211d2e]/60 px-5 py-7 text-center sm:min-h-[250px] sm:px-6 sm:py-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400 sm:h-14 sm:w-14">
            <File size={25} />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-white sm:mt-5">
            Your library is waiting
          </h3>

          <p className="mt-2 max-w-sm text-xs leading-5 text-slate-400 sm:leading-6">
            Upload your first study document and start learning with your AI tutor.
          </p>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-violet-400/30 bg-violet-500/10 px-4 py-2.5 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/20 sm:mt-5"
          >
            <Upload size={15} />
            Add your first document
          </button>
        </div>
      )}
    </section>
  );
}
