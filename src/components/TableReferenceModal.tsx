"use client";

export default function TableReferenceModal() {
  const openPopup = () => {
    window.open(
      "/table-reference",
      "table-reference",
      "width=820,height=560,resizable=yes,scrollbars=yes"
    );
  };

  return (
    <button
      id="tour-table-button"
      onClick={openPopup}
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        border: "none",
        borderRadius: "12px",
        color: "#fff",
        padding: "0.6rem 1.1rem",
        fontWeight: 700,
        fontSize: "0.85rem",
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(102,126,234,0.4)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
      }}
    >
      📋 テーブル
    </button>
  );
}
