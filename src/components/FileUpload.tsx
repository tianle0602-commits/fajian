"use client";

import { useState, useRef, useCallback, type DragEvent } from "react";

interface FileUploadProps {
  accept: string;
  maxSizeMB: number;
  hint: string;
  formats: string;
  onUpload?: (file: File) => void;
  disabled?: boolean;
}

export default function FileUpload({
  accept,
  maxSizeMB,
  hint,
  formats,
  onUpload,
  disabled,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (f: File): boolean => {
      const allowedTypes = accept.split(",").map((t) => t.trim());
      const fileExt = "." + f.name.split(".").pop()?.toLowerCase();
      const isValidType = allowedTypes.some(
        (t) => f.type === t || t === fileExt || t.endsWith(fileExt)
      );

      if (!isValidType) {
        setError(`不支持的文件格式，请上传 ${formats} 文件`);
        return false;
      }

      if (f.size > maxSizeMB * 1024 * 1024) {
        setError(`文件大小不能超过 ${maxSizeMB}MB`);
        return false;
      }

      setError("");
      return true;
    },
    [accept, formats, maxSizeMB]
  );

  const handleFile = useCallback(
    (f: File) => {
      if (validateFile(f)) {
        setFile(f);
        onUpload?.(f);
      }
    },
    [validateFile, onUpload]
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile, disabled]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) handleFile(selectedFile);
    },
    [handleFile]
  );

  const removeFile = () => {
    setFile(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && !file && inputRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all sm:p-10 ${
          disabled
            ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-70"
            : dragOver
              ? "border-gold bg-gold/5 shadow-lg"
              : file
                ? "border-green-400 bg-green-50/30"
                : "border-gray-300 bg-white hover:border-gold hover:bg-gold/5"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        {!file ? (
          <>
            <div className="mb-4 flex justify-center">
              <svg
                className="h-14 w-14 text-gold"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>
            <p className="mb-1 text-lg font-semibold text-primary">
              {hint}
            </p>
            <p className="text-sm text-gray-400">
              支持 {formats} 格式，文件大小不超过 {maxSizeMB}MB
            </p>
          </>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <svg
              className="h-10 w-10 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
            <div className="text-left">
              <p className="font-semibold text-primary truncate max-w-[300px]">
                {file.name}
              </p>
              <p className="text-sm text-gray-400">{formatSize(file.size)}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="ml-2 rounded-full p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}