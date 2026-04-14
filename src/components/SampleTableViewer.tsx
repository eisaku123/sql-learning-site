"use client";

import { useState, useEffect, useRef } from "react";
import type { SqlEditorHandle } from "@/components/SqlEditor";

const TABLES = [
  { key: "users", label: "👤 users" },
  { key: "products", label: "📦 products" },
  { key: "orders", label: "🛒 orders" },
  { key: "order_products", label: "🔗 order_products" },
];

interface Props {
  sqlEditorRef: React.RefObject<SqlEditorHandle | null>;
  lastResult: { columns: string[]; rows: (string | number | null)[][] } | null;
  dbReady: boolean;
}

export default function SampleTableViewer({ sqlEditorRef, lastResult, dbReady }: Props) {
  const [activeTab, setActiveTab] = useState("users");
  const [tableData, setTableData] = useState<{ columns: string[]; rows: (string | number | null)[][] } | null>(null);
  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;

  // lastResult が来たら実行結果タブへ、null になったら（問題切替など）テーブルタブへ戻す
  useEffect(() => {
    if (lastResult !== null) {
      setActiveTab("result");
    } else if (activeTabRef.current === "result") {
      setActiveTab("users");
    }
  }, [lastResult]);

  // タブ切り替えまたは DB 準備完了時にデータ取得
  useEffect(() => {
    if (activeTab === "result") {
      setTableData(lastResult);
      return;
    }
    if (!dbReady || !sqlEditorRef.current) {
      setTableData(null);
      return;
    }
    const data = sqlEditorRef.current.queryTable(activeTab);
    setTableData(data);
  }, [activeTab, dbReady, lastResult, sqlEditorRef]);

  const hasResult = lastResult !== null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      {/* タブバー */}
      <div
        style={{
          display: "flex",
          background: "rgba(255,255,255,0.02)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          overflowX: "auto",
          flexShrink: 0,
        }}
      >
        {TABLES.map((t) => {
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                padding: "0.5rem 0.9rem",
                fontSize: "0.78rem",
                color: isActive ? "#667eea" : "#8888aa",
                background: isActive ? "rgba(102,126,234,0.08)" : "transparent",
                border: "none",
                borderBottom: isActive ? "2px solid #667eea" : "2px solid transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontWeight: isActive ? 600 : 400,
                transition: "all 0.15s",
              }}
            >
              {t.label}
            </button>
          );
        })}
        {hasResult && (
          <button
            onClick={() => setActiveTab("result")}
            style={{
              padding: "0.5rem 0.9rem",
              fontSize: "0.78rem",
              color: "#34d399",
              background: activeTab === "result" ? "rgba(52,211,153,0.08)" : "transparent",
              border: "none",
              borderBottom: activeTab === "result" ? "2px solid #34d399" : "2px solid transparent",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontWeight: activeTab === "result" ? 600 : 400,
              opacity: activeTab === "result" ? 1 : 0.6,
              transition: "all 0.15s",
            }}
          >
            ⚡ 実行結果
          </button>
        )}
      </div>

      {/* テーブルコンテンツ */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {!dbReady && activeTab !== "result" ? (
          <div style={{ color: "#546e7a", fontSize: "0.82rem", padding: "1.5rem", textAlign: "center" }}>
            読み込み中...
          </div>
        ) : tableData === null ? (
          <div style={{ color: "#546e7a", fontSize: "0.82rem", padding: "1.5rem", textAlign: "center" }}>
            データがありません
          </div>
        ) : tableData.columns.length === 0 ? (
          <div style={{ color: "#546e7a", fontSize: "0.82rem", padding: "1.5rem", textAlign: "center" }}>
            条件に一致するデータがありません
          </div>
        ) : (
          <>
            <div
              style={{
                color: "#546e7a",
                fontSize: "0.7rem",
                padding: "0.35rem 0.75rem",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              {tableData.rows.length} 件
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
              <thead>
                <tr>
                  {tableData.columns.map((col, ci) => (
                    <th
                      key={ci}
                      style={{
                        padding: "0.42rem 0.75rem",
                        background: "rgba(102,126,234,0.12)",
                        borderBottom: "1px solid rgba(255,255,255,0.07)",
                        color: "#667eea",
                        textAlign: "left",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        position: "sticky",
                        top: 0,
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        style={{
                          padding: "0.33rem 0.75rem",
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                          color: cell === null ? "#546e7a" : "#e0e0f0",
                          fontFamily: "monospace",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {cell === null ? "NULL" : String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
