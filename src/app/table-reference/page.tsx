"use client";

import { useState } from "react";

const TABLE_LABELS: Record<string, string> = {
  users: "ユーザー",
  products: "商品",
  orders: "注文",
  order_products: "注文明細",
};

const TABLES = {
  users: {
    label: "users",
    columns: ["id", "name", "email", "city"],
    rows: [
      [1,  "田中 太郎",   "tanaka@example.com",    "東京"],
      [2,  "鈴木 花子",   "suzuki@example.com",    "大阪"],
      [3,  "佐藤 次郎",   "sato@example.com",      "東京"],
      [4,  "山田 美咲",   "yamada@example.com",    "名古屋"],
      [5,  "中村 健一",   "nakamura@example.com",  "東京"],
      [6,  "小林 さくら", "kobayashi@example.com", "福岡"],
      [7,  "加藤 雄一",   "kato@example.com",      "大阪"],
      [8,  "吉田 陽子",   "yoshida@example.com",   "東京"],
      [9,  "渡辺 勇",     "watanabe@example.com",  "名古屋"],
      [10, "松本 智子",   "matsumoto@example.com", "大阪"],
      [11, "井上 拓也",   "inoue@example.com",     "東京"],
      [12, "木村 麻衣",   null,                    "福岡"],
      [13, "林 浩二",     "hayashi@example.com",   "大阪"],
      [14, "清水 理恵",   null,                    null],
      [15, "山口 誠",     "yamaguchi@example.com", "東京"],
    ],
  },
  products: {
    label: "products",
    columns: ["id", "name", "category", "price", "stock"],
    rows: [
      [1,  "Laptop",   "PC",         120000, 50],
      [2,  "Mouse",    "Accessory",  3500,   200],
      [3,  "Keyboard", "Accessory",  8000,   150],
      [4,  "Monitor",  "Display",    45000,  30],
      [5,  "USB Hub",  "Accessory",  2500,   300],
      [6,  "Desktop",  "PC",         180000, 20],
      [7,  "Headset",  "Accessory",  12000,  80],
      [8,  "Webcam",   "Accessory",  7500,   60],
      [9,  "Tablet",   "PC",         65000,  null],
      [10, "Printer",  "Peripheral", 25000,  null],
    ],
  },
  orders: {
    label: "orders",
    columns: ["id", "user_id", "order_date", "status"],
    rows: [
      [1,  1,  "2024-01-15", "completed"],
      [2,  2,  "2024-01-20", "completed"],
      [3,  3,  "2024-02-01", "completed"],
      [4,  1,  "2024-02-10", "completed"],
      [5,  4,  "2024-02-15", "pending"],
      [6,  5,  "2024-03-01", "completed"],
      [7,  2,  "2024-03-10", "completed"],
      [8,  6,  "2024-03-15", "cancelled"],
      [9,  1,  "2024-04-01", "completed"],
      [10, 7,  "2024-04-10", "pending"],
      [11, 3,  "2024-04-20", "completed"],
      [12, 8,  "2024-05-01", "completed"],
      [13, 4,  "2024-05-10", "completed"],
      [14, 9,  "2024-05-20", "pending"],
      [15, 10, "2024-06-01", "completed"],
    ],
  },
  order_products: {
    label: "order_products",
    columns: ["id", "order_id", "product_id", "quantity", "price"],
    rows: [
      [1,  1,  1, 2,  120000],
      [2,  1,  2, 1,  3500],
      [3,  2,  3, 3,  8000],
      [4,  3,  4, 1,  45000],
      [5,  4,  2, 5,  3500],
      [6,  5,  1, 1,  120000],
      [7,  5,  3, 2,  8000],
      [8,  6,  5, 10, 2500],
      [9,  7,  7, 2,  12000],
      [10, 8,  2, 3,  3500],
      [11, 9,  1, 1,  120000],
      [12, 9,  4, 1,  45000],
      [13, 10, 9, 1,  65000],
      [14, 11, 3, 4,  8000],
      [15, 12, 6, 1,  180000],
      [16, 13, 4, 2,  45000],
      [17, 14, 8, 3,  7500],
      [18, 15, 10, 2, 25000],
      [19, 6,  2, 5,  3500],
      [20, 7,  1, 1,  120000],
    ],
  },
} as const;

type TableKey = keyof typeof TABLES;
type Tab = TableKey | "er";

function ErDiagram() {
  const rowH = 22;
  const headerH = 30;
  const boxW = 190;

  // テーブル定義
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

  // 各テーブルの特定カラムのy座標を計算
  const rowY = (tblIdx: number, colIdx: number) =>
    tbls[tblIdx].y + headerH + colIdx * rowH + rowH / 2;
  const rowX = (tblIdx: number, side: "left" | "right") =>
    side === "left" ? tbls[tblIdx].x : tbls[tblIdx].x + boxW;

  return (
    <div>
      <p style={{ color: "#8888aa", fontSize: "0.75rem", marginBottom: "0.75rem" }}>
        テーブル間のリレーション（外部キー）を示しています
      </p>
      <svg viewBox="0 0 660 540" style={{ width: "100%", maxWidth: "660px", display: "block" }}>
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
          const isJunction = t.key === "order_products";
          return (
            <g key={t.key}>
              {/* ヘッダー */}
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
              {/* カラム行 */}
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
              {/* 日本語ラベル */}
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

      {/* 凡例 */}
      <div style={{ display: "flex", gap: "1.25rem", marginTop: "0.75rem", fontSize: "0.75rem", color: "#8888aa", flexWrap: "wrap" }}>
        <span><span style={{ color: "#fbbf24", fontWeight: 700 }}>PK</span> 主キー</span>
        <span><span style={{ color: "#34d399", fontWeight: 700 }}>FK</span> 外部キー</span>
        <span><span style={{ color: "#667eea" }}>────</span> orders → users</span>
        <span><span style={{ color: "#34d399" }}>────</span> order_products → orders</span>
        <span><span style={{ color: "#a78bfa" }}>────</span> order_products → products</span>
      </div>
    </div>
  );
}

export default function TableReferencePage() {
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const table = activeTab !== "er" ? TABLES[activeTab as TableKey] : null;

  return (
    <div
      style={{
        background: "#0a0a1a",
        minHeight: "100vh",
        color: "#e0e0f0",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          padding: "0.75rem 1.25rem",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <span style={{ fontSize: "1rem" }}>📋</span>
        <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>テーブル参照</span>
        <span style={{ color: "#546e7a", fontSize: "0.78rem", marginLeft: "auto" }}>
          SQLLearn サンプルDB
        </span>
      </div>

      {/* タブ */}
      <div
        style={{
          display: "flex",
          gap: "0.25rem",
          padding: "0.6rem 1.25rem 0",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexWrap: "wrap",
        }}
      >
        {(Object.keys(TABLES) as TableKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              background: activeTab === key ? "rgba(102,126,234,0.2)" : "transparent",
              border: activeTab === key ? "1px solid rgba(102,126,234,0.5)" : "1px solid transparent",
              borderBottom: "none",
              borderRadius: "6px 6px 0 0",
              color: activeTab === key ? "#667eea" : "#8888aa",
              padding: "0.35rem 0.85rem",
              cursor: "pointer",
              fontSize: "0.82rem",
              fontWeight: activeTab === key ? 700 : 400,
              fontFamily: "monospace",
            }}
          >
            {TABLES[key].label}
            <span style={{ marginLeft: "0.35rem", fontSize: "0.75rem", opacity: 0.7, fontFamily: "sans-serif" }}>
              {TABLE_LABELS[key]}
            </span>
          </button>
        ))}
        <button
          onClick={() => setActiveTab("er")}
          style={{
            background: activeTab === "er" ? "rgba(251,191,36,0.15)" : "transparent",
            border: activeTab === "er" ? "1px solid rgba(251,191,36,0.4)" : "1px solid transparent",
            borderBottom: "none",
            borderRadius: "6px 6px 0 0",
            color: activeTab === "er" ? "#fbbf24" : "#8888aa",
            padding: "0.35rem 0.85rem",
            cursor: "pointer",
            fontSize: "0.82rem",
            fontWeight: activeTab === "er" ? 700 : 400,
          }}
        >
          ER図
        </button>
      </div>

      {/* コンテンツ */}
      <div style={{ padding: "1rem 1.25rem", overflowY: "auto", flex: 1 }}>
        {activeTab === "er" ? (
          <ErDiagram />
        ) : table ? (
          <>
            <p style={{ color: "#8888aa", fontSize: "0.75rem", marginBottom: "0.6rem" }}>
              {table.rows.length} 件
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "0.83rem" }}>
                <thead>
                  <tr>
                    {table.columns.map((col) => (
                      <th
                        key={col}
                        style={{
                          background: "rgba(102,126,234,0.12)",
                          color: "#667eea",
                          padding: "0.4rem 0.75rem",
                          textAlign: "left",
                          border: "1px solid rgba(255,255,255,0.07)",
                          fontFamily: "monospace",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, i) => (
                    <tr
                      key={i}
                      style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}
                    >
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          style={{
                            padding: "0.35rem 0.75rem",
                            border: "1px solid rgba(255,255,255,0.05)",
                            color: cell === null ? "#546e7a" : "#c0c0d8",
                            fontStyle: cell === null ? "italic" : "normal",
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
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
