"use client";

import { useState } from "react";

const TABLE_LABELS: Record<string, string> = {
  employees: "社員",
  departments: "部署",
  products: "商品",
  orders: "注文",
};

const TABLES = {
  employees: {
    label: "employees",
    columns: ["id", "name", "department_id", "salary", "hire_date"],
    rows: [
      [1, "田中 太郎", 1, 450000, "2020-04-01"],
      [2, "鈴木 花子", 2, 520000, "2019-07-15"],
      [3, "佐藤 次郎", 2, 480000, "2021-01-10"],
      [4, "山田 美咲", 3, 380000, "2022-04-01"],
      [5, "中村 健一", 1, 550000, "2018-10-01"],
      [6, "小林 さくら", 4, 420000, "2020-09-01"],
      [7, "加藤 雄一", 2, 600000, "2017-04-01"],
      [8, "吉田 陽子", 5, 460000, "2021-07-01"],
      [9, "渡辺 勇", 1, 390000, "2023-04-01"],
      [10, "松本 智子", 3, 410000, "2019-04-01"],
      [11, "井上 拓也", 2, 530000, "2020-01-15"],
      [12, "木村 麻衣", 5, 440000, "2022-10-01"],
      [13, "林 浩二", 4, 470000, "2018-07-01"],
      [14, "清水 奈々", 1, 360000, "2023-10-01"],
      [15, "山口 博", 2, 580000, "2016-04-01"],
    ],
  },
  departments: {
    label: "departments",
    columns: ["id", "name", "location"],
    rows: [
      [1, "営業部", "東京"],
      [2, "開発部", "大阪"],
      [3, "人事部", "東京"],
      [4, "経理部", "名古屋"],
      [5, "マーケティング部", "東京"],
    ],
  },
  products: {
    label: "products",
    columns: ["id", "name", "category", "price", "stock"],
    rows: [
      [1, "ノートPC", "パソコン", 120000, 50],
      [2, "マウス", "周辺機器", 3500, 200],
      [3, "キーボード", "周辺機器", 8000, 150],
      [4, "モニター", "ディスプレイ", 45000, 30],
      [5, "USBハブ", "周辺機器", 2500, 300],
      [6, "デスクトップPC", "パソコン", 180000, 20],
      [7, "ヘッドセット", "周辺機器", 12000, 80],
      [8, "Webカメラ", "周辺機器", 7500, 60],
      [9, "タブレット", "パソコン", 65000, 40],
      [10, "プリンター", "周辺機器", 25000, 25],
    ],
  },
  orders: {
    label: "orders",
    columns: ["id", "product_id", "quantity", "order_date", "customer_name"],
    rows: [
      [1, 1, 2, "2024-01-15", "株式会社ABC"],
      [2, 2, 10, "2024-01-20", "田中商事"],
      [3, 3, 5, "2024-02-01", "鈴木工業"],
      [4, 1, 1, "2024-02-10", "山田商店"],
      [5, 4, 3, "2024-02-15", "株式会社XYZ"],
      [6, 5, 20, "2024-03-01", "佐藤商会"],
      [7, 2, 15, "2024-03-10", "中村企業"],
      [8, 7, 4, "2024-03-15", "小林商店"],
      [9, 1, 3, "2024-04-01", "加藤株式会社"],
      [10, 9, 2, "2024-04-10", "吉田商事"],
      [11, 3, 8, "2024-04-20", "渡辺工業"],
      [12, 6, 1, "2024-05-01", "松本商会"],
      [13, 4, 2, "2024-05-10", "井上企業"],
      [14, 8, 6, "2024-05-20", "木村商店"],
      [15, 10, 3, "2024-06-01", "林商事"],
    ],
  },
} as const;

type TableKey = keyof typeof TABLES;
type Tab = TableKey | "er";

function ErDiagram() {
  // テーブルボックスの定義
  const tables = [
    {
      name: "departments", label: "部署", x: 30, y: 60,
      cols: [
        { name: "id", note: "PK" },
        { name: "name", note: "" },
        { name: "location", note: "" },
      ],
    },
    {
      name: "employees", label: "社員", x: 320, y: 30,
      cols: [
        { name: "id", note: "PK" },
        { name: "name", note: "" },
        { name: "department_id", note: "FK" },
        { name: "salary", note: "" },
        { name: "hire_date", note: "" },
      ],
    },
    {
      name: "products", label: "商品", x: 30, y: 300,
      cols: [
        { name: "id", note: "PK" },
        { name: "name", note: "" },
        { name: "category", note: "" },
        { name: "price", note: "" },
        { name: "stock", note: "" },
      ],
    },
    {
      name: "orders", label: "注文", x: 320, y: 300,
      cols: [
        { name: "id", note: "PK" },
        { name: "product_id", note: "FK" },
        { name: "quantity", note: "" },
        { name: "order_date", note: "" },
        { name: "customer_name", note: "" },
      ],
    },
  ];

  const rowH = 22;
  const headerH = 30;
  const boxW = 200;

  return (
    <div>
      <p style={{ color: "#8888aa", fontSize: "0.75rem", marginBottom: "0.75rem" }}>
        テーブル間のリレーション（外部キー）を示しています
      </p>
      <svg viewBox="0 0 600 500" style={{ width: "100%", maxWidth: "600px", display: "block" }}>
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#667eea" />
          </marker>
        </defs>

        {/* リレーション線: employees.department_id → departments.id */}
        {/* employees box left edge (320, 30+30+22) → departments box right edge (30+200, 60+30+0) */}
        <line
          x1={320} y1={30 + headerH + rowH * 2 + rowH / 2}
          x2={30 + boxW} y2={60 + headerH + rowH / 2}
          stroke="#667eea" strokeWidth="1.5" strokeDasharray="5,3"
          markerEnd="url(#arrow)"
        />
        <text x={210} y={110} fill="#667eea" fontSize="10" textAnchor="middle">N</text>
        <text x={280} y={90} fill="#667eea" fontSize="10" textAnchor="middle">1</text>

        {/* リレーション線: orders.product_id → products.id */}
        <line
          x1={320} y1={300 + headerH + rowH + rowH / 2}
          x2={30 + boxW} y2={300 + headerH + rowH / 2}
          stroke="#34d399" strokeWidth="1.5" strokeDasharray="5,3"
          markerEnd="url(#arrow)"
        />
        <text x={310} y={340} fill="#34d399" fontSize="10" textAnchor="middle">N</text>
        <text x={240} y={328} fill="#34d399" fontSize="10" textAnchor="middle">1</text>

        {/* テーブルボックス */}
        {tables.map((t) => {
          return (
            <g key={t.name}>
              {/* ヘッダー */}
              <rect x={t.x} y={t.y} width={boxW} height={headerH} rx="4" ry="4"
                fill="rgba(102,126,234,0.25)" stroke="rgba(102,126,234,0.6)" strokeWidth="1" />
              <text x={t.x + boxW / 2} y={t.y + 19} fill="#e0e0f0" fontSize="12"
                fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                {t.name}
              </text>
              <text x={t.x + boxW / 2} y={t.y + 19} fill="#8888aa" fontSize="10"
                textAnchor="middle" fontFamily="sans-serif" dy="0">
              </text>
              {/* カラム行 */}
              <rect x={t.x} y={t.y + headerH} width={boxW} height={t.cols.length * rowH}
                fill="rgba(255,255,255,0.03)" stroke="rgba(102,126,234,0.3)" strokeWidth="1" />
              {t.cols.map((col, i) => (
                <g key={col.name}>
                  {i > 0 && (
                    <line x1={t.x} y1={t.y + headerH + i * rowH}
                      x2={t.x + boxW} y2={t.y + headerH + i * rowH}
                      stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  )}
                  {col.note && (
                    <text x={t.x + 8} y={t.y + headerH + i * rowH + 15}
                      fill={col.note === "PK" ? "#fbbf24" : "#34d399"}
                      fontSize="9" fontFamily="monospace" fontWeight="bold">
                      {col.note}
                    </text>
                  )}
                  <text x={t.x + (col.note ? 32 : 10)} y={t.y + headerH + i * rowH + 15}
                    fill={col.note === "FK" ? "#34d399" : "#c0c0d8"}
                    fontSize="11" fontFamily="monospace">
                    {col.name}
                  </text>
                </g>
              ))}
              {/* テーブル名（日本語） */}
              <text x={t.x + boxW + 6} y={t.y + headerH / 2 + 5}
                fill="#8888aa" fontSize="10" fontFamily="sans-serif">
                （{t.label}）
              </text>
            </g>
          );
        })}
      </svg>

      {/* 凡例 */}
      <div style={{ display: "flex", gap: "1.25rem", marginTop: "0.75rem", fontSize: "0.75rem", color: "#8888aa" }}>
        <span><span style={{ color: "#fbbf24", fontWeight: 700 }}>PK</span> 主キー</span>
        <span><span style={{ color: "#34d399", fontWeight: 700 }}>FK</span> 外部キー</span>
        <span style={{ color: "#667eea" }}>──── </span><span>employees → departments</span>
        <span style={{ color: "#34d399" }}>──── </span><span>orders → products</span>
      </div>
    </div>
  );
}

export default function TableReferencePage() {
  const [activeTab, setActiveTab] = useState<Tab>("employees");
  const table = activeTab !== "er" ? TABLES[activeTab] : null;

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
                            color: "#c0c0d8",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {String(cell)}
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
