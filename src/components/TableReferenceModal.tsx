"use client";

import { useState } from "react";

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

export default function TableReferenceModal() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TableKey>("employees");

  const table = TABLES[activeTab];

  return (
    <>
      {/* フローティングボタン */}
      <button
        onClick={() => setOpen(true)}
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

      {/* モーダル背景 */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          {/* モーダル本体 */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0f0f23",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              width: "760px",
              height: "520px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* ヘッダー */}
            <div
              style={{
                padding: "1rem 1.5rem",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: "#e0e0f0", fontWeight: 700, fontSize: "0.95rem" }}>
                テーブル参照
              </span>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#8888aa",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            {/* タブ */}
            <div
              style={{
                display: "flex",
                gap: "0.25rem",
                padding: "0.75rem 1.5rem 0",
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
                    borderRadius: "8px 8px 0 0",
                    color: activeTab === key ? "#667eea" : "#8888aa",
                    padding: "0.4rem 0.9rem",
                    cursor: "pointer",
                    fontSize: "0.82rem",
                    fontWeight: activeTab === key ? 700 : 400,
                    fontFamily: "monospace",
                  }}
                >
                  {TABLES[key].label}
                </button>
              ))}
            </div>

            {/* テーブルデータ */}
            <div style={{ overflowY: "auto", padding: "1rem 1.5rem 1.5rem" }}>
              <p style={{ color: "#8888aa", fontSize: "0.78rem", marginBottom: "0.75rem" }}>
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
