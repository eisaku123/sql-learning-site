"use client";

import type { CSSProperties, ReactNode } from "react";

interface LoadingButtonProps {
  loading: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  style?: CSSProperties;
  loadingStyle?: CSSProperties;
  children: ReactNode;
  loadingText?: string;
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function LoadingButton({
  loading,
  onClick,
  type = "button",
  disabled,
  style,
  loadingStyle,
  children,
  loadingText,
  onMouseEnter,
  onMouseLeave,
}: LoadingButtonProps) {
  const isDisabled = loading || disabled;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      style={{
        cursor: isDisabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        ...(loading ? loadingStyle : {}),
        ...style,
        ...(loading ? { opacity: 0.75 } : {}),
      }}
      onMouseEnter={!loading ? onMouseEnter : undefined}
      onMouseLeave={!loading ? onMouseLeave : undefined}
    >
      {loading && <span className="spinner" />}
      {loading && loadingText ? loadingText : children}
    </button>
  );
}
