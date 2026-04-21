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
  dbVersion?: number; // setupSql実行後などDB内容が変わった時にインクリメント
}

// ER図コンポーネント（/table-reference と共通）
function ErDiagram() {
  const rowH = 22;
  const headerH = 30;
  const boxW = 190;

  const tbls = [
    {
      key: "users", label: "ユーザー", x: 20, y: 20,
      cols: [
        { name: "id",    note: "PK" },
        { name: "name",  note: "" },
        { name: "email", note: "" },
        { name: "city",  note: "" },
      ],
    },
    {
      key: "orders", label: "注文", x: 430, y: 20,
      cols: [
        { name: "id",         note: "PK" },
        { name: "user_id",    note: "FK" },
        { name: "order_date", note: "" },
        { name: "status",     note: "" },
      ],
    },
    {
      key: "order_products", label: "注文明細（中間テーブル）", x: 220, y: 230,
      cols: [
        { name: "id",         note: "PK" },
        { name: "order_id",   note: "FK" },
        { name: "product_id", note: "FK" },
        { name: "quantity",   note: "" },
        { name: "price",      note: "" },
      ],
    },
    {
      key: "products", label: "商品", x: 20, y: 370,
      cols: [
        { name: "id",       note: "PK" },
        { name: "name",     note: "" },
        { name: "category", note: "" },
        { name: "price",    note: "" },
        { name: "stock",    note: "" },
      ],
    },
  ];

  const rowY = (tblIdx: number, colIdx: number) =>
    tbls[tblIdx].y + headerH + colIdx * rowH + rowH / 2;
  const rowX = (tblIdx: number, side: "left" | "right") =>
    side === "left" ? tbls[tblIdx].x : tbls[tblIdx].x + boxW;

  return (
    <div style={{ padding: "0.75rem" }}>
      <p style={{ color: "#8888aa", fontSize: "0.72rem", marginBottom: "0.75rem" }}>
        テーブル間のリレーション（外部キー）を示しています
      </p>
      <svg viewBox="0 0 660 540" style={{ width: "100%", display: "block" }}>
        <defs>
          <marker id="arr-blue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#667eea" />
          </marker>
          <marker id="arr-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#34d399" />
          </marker>
          <marker id="arr-purple" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#a78bfa" />
          </marker>
        </defs>

        {/* orders.user_id → users.id */}
        <line
          x1={rowX(1, "left")} y1={rowY(1, 1)}
          x2={rowX(0, "right")} y2={rowY(0, 0)}
          stroke="#667eea" strokeWidth="1.5" strokeDasharray="5,3"
          markerEnd="url(#arr-blue)"
        />
        <text x={390} y={rowY(1, 1) - 4} fill="#667eea" fontSize="9" textAnchor="middle">N</text>
        <text x={248} y={rowY(0, 0) - 4} fill="#667eea" fontSize="9" textAnchor="middle">1</text>

        {/* order_products.order_id → orders.id */}
        <line
          x1={rowX(2, "right")} y1={rowY(2, 1)}
          x2={rowX(1, "left")} y2={rowY(1, 0)}
          stroke="#34d399" strokeWidth="1.5" strokeDasharray="5,3"
          markerEnd="url(#arr-green)"
        />
        <text x={438} y={rowY(2, 1) - 4} fill="#34d399" fontSize="9" textAnchor="middle">N</text>
        <text x={422} y={rowY(1, 0) + 12} fill="#34d399" fontSize="9" textAnchor="middle">1</text>

        {/* order_products.product_id → products.id */}
        <line
          x1={rowX(2, "left")} y1={rowY(2, 2)}
          x2={rowX(3, "right")} y2={rowY(3, 0)}
          stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="5,3"
          markerEnd="url(#arr-purple)"
        />
        <text x={208} y={rowY(2, 2) - 4} fill="#a78bfa" fontSize="9" textAnchor="middle">N</text>
        <text x={228} y={rowY(3, 0) - 4} fill="#a78bfa" fontSize="9" textAnchor="middle">1</text>

        {/* テーブルボックス */}
        {tbls.map((t, ti) => {
          void ti;
          const isJunction = t.key === "order_products";
          return (
            <g key={t.key}>
              <rect
                x={t.x} y={t.y} width={boxW} height={headerH} rx="4" ry="4"
                fill={isJunction ? "rgba(167,139,250,0.25)" : "rgba(102,126,234,0.2)"}
                stroke={isJunction ? "rgba(167,139,250,0.6)" : "rgba(102,126,234,0.5)"}
                strokeWidth="1"
              />
              <text
                x={t.x + boxW / 2} y={t.y + 19}
                fill="#e0e0f0" fontSize="11" fontWeight="bold"
                textAnchor="middle" fontFamily="monospace"
              >
                {t.key}
              </text>
              <rect
                x={t.x} y={t.y + headerH}
                width={boxW} height={t.cols.length * rowH}
                fill="rgba(255,255,255,0.02)"
                stroke={isJunction ? "rgba(167,139,250,0.25)" : "rgba(102,126,234,0.25)"}
                strokeWidth="1"
              />
              {t.cols.map((col, i) => (
                <g key={col.name}>
                  {i > 0 && (
                    <line
                      x1={t.x} y1={t.y + headerH + i * rowH}
                      x2={t.x + boxW} y2={t.y + headerH + i * rowH}
                      stroke="rgba(255,255,255,0.05)" strokeWidth="1"
                    />
                  )}
                  {col.note && (
                    <text
                      x={t.x + 8} y={t.y + headerH + i * rowH + 15}
                      fill={col.note === "PK" ? "#fbbf24" : "#34d399"}
                      fontSize="9" fontFamily="monospace" fontWeight="bold"
                    >
                      {col.note}
                    </text>
                  )}
                  <text
                    x={t.x + (col.note ? 32 : 10)} y={t.y + headerH + i * rowH + 15}
                    fill={col.note === "FK" ? "#34d399" : "#c0c0d8"}
                    fontSize="11" fontFamily="monospace"
                  >
                    {col.name}
                  </text>
                </g>
              ))}
              <text
                x={t.x + boxW + 6} y={t.y + headerH / 2 + 5}
                fill={isJunction ? "#a78bfa" : "#8888aa"}
                fontSize="10" fontFamily="sans-serif"
              >
                （{t.label}）
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", fontSize: "0.72rem", color: "#8888aa", flexWrap: "wrap" }}>
        <span><span style={{ color: "#fbbf24", fontWeight: 700 }}>PK</span> 主キー</span>
        <span><span style={{ color: "#34d399", fontWeight: 700 }}>FK</span> 外部キー</span>
        <span><span style={{ color: "#667eea" }}>────</span> orders → users</span>
        <span><span style={{ color: "#34d399" }}>────</span> order_products → orders</span>
        <span><span style={{ color: "#a78bfa" }}>────</span> order_products → products</span>
      </div>
    </div>
  );
}

export default function SampleTableViewer({ sqlEditorRef, lastResult, dbReady, dbVersion }: Props) {
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
    if (activeTab === "er") {
      setTableData(null);
      return;
    }
    if (!dbReady || !sqlEditorRef.current) {
      setTableData(null);
      return;
    }
    const data = sqlEditorRef.current.queryTable(activeTab);
    setTableData(data);
  }, [activeTab, dbReady, lastResult, sqlEditorRef, dbVersion]);

  const hasResult = lastResult !== null;

  const tabBtn = (
    key: string,
    label: string,
    color: string,
    activeBg: string,
    opacity?: number
  ) => {
    const isActive = activeTab === key;
    return (
      <button
        key={key}
        onClick={() => setActiveTab(key)}
        style={{
          padding: "0.55rem 1rem",
          fontSize: "0.85rem",
          color,
          background: isActive ? activeBg : "transparent",
          border: "none",
          borderBottom: isActive ? `2px solid ${color}` : "2px solid transparent",
          cursor: "pointer",
          whiteSpace: "nowrap",
          fontWeight: isActive ? 600 : 400,
          opacity: opacity !== undefined && !isActive ? opacity : 1,
          transition: "all 0.15s",
          flexShrink: 0,
        }}
      >
        {label}
      </button>
    );
  };

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
        {TABLES.map((t) =>
          tabBtn(t.key, t.label, "#667eea", "rgba(102,126,234,0.08)")
        )}
        {tabBtn("er", "📊 ER図", "#fbbf24", "rgba(251,191,36,0.08)")}
        {hasResult &&
          tabBtn("result", "⚡ 実行結果", "#34d399", "rgba(52,211,153,0.08)", 0.6)}
      </div>

      {/* コンテンツ */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {activeTab === "er" ? (
          <ErDiagram />
        ) : !dbReady && activeTab !== "result" ? (
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
                fontSize: "0.78rem",
                padding: "0.4rem 0.85rem",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              {tableData.rows.length} 件
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead>
                <tr>
                  {tableData.columns.map((col, ci) => (
                    <th
                      key={ci}
                      style={{
                        padding: "0.5rem 0.85rem",
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
                  <tr key={ri} style={{ background: ri % 2 === 1 ? "rgba(255,255,255,0.035)" : "transparent" }}>
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        style={{
                          padding: "0.42rem 0.85rem",
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
