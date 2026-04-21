"use client";

import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { SAMPLE_DB_SQL } from "@/lib/curriculum";

interface QueryResult {
  columns: string[];
  rows: (string | number | null)[][];
}

export interface SqlEditorHandle {
  runSql: (sql: string) => { columns: string[]; rows: (string | number | null)[][] } | null;
  resetDb: () => void;
  execSetupSql: (sql: string) => void; // 現在のdbRef.currentに直接実行（setupSql用）
  runCurrentSql: () => { result: { columns: string[]; rows: (string | number | null)[][] } | null; error: string | null };
  clearQuery: () => void;
  queryTable: (tableName: string) => { columns: string[]; rows: (string | number | null)[][] } | null;
  getCurrentQuery: () => string;
  focusEditor: () => void;
}

interface SqlEditorProps {
  initialQuery?: string;
  onResult?: (columns: string[], rows: (string | number | null)[][]) => void;
  onResultError?: () => void;
  onReady?: () => void;
  showTableButton?: boolean;
  hideResults?: boolean;
}

const SqlEditor = forwardRef<SqlEditorHandle, SqlEditorProps>(function SqlEditor(
  { initialQuery = "", onResult, onResultError, onReady, showTableButton, hideResults = false },
  ref
) {
  const [query, setQuery] = useState(initialQuery);
  const queryRef = useRef(initialQuery);
  const [results, setResults] = useState<QueryResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "running">("loading");
  const [isUpper, setIsUpper] = useState(true);
  const [colTable, setColTable] = useState<"users" | "products" | "orders" | "order_products">("users");

  // カスタムボタン
  type CustomButton = { id: string; label: string; text: string };
  const CUSTOM_BTN_KEY = "sql_custom_buttons";
  const MAX_CUSTOM_BUTTONS = 10;
  const [customButtons, setCustomButtons] = useState<CustomButton[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(CUSTOM_BTN_KEY) ?? "[]") as CustomButton[]; } catch { return []; }
  });
  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [editingCustomBtn, setEditingCustomBtn] = useState<CustomButton | null>(null);
  const [modalLabel, setModalLabel] = useState("");
  const [modalText, setModalText] = useState("");
  const dbRef = useRef<{ exec: (sql: string) => { columns?: string[]; values?: (string | number | null)[][] }[] } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sqlConstructorRef = useRef<{ Database: new () => { exec: (s: string) => { columns?: string[]; values?: (string | number | null)[][] }[] } } | null>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  const TABLE_COLS: Record<string, string[]> = {
    users:          ["id", "name", "email", "city"],
    products:       ["id", "name", "category", "price", "stock"],
    orders:         ["id", "user_id", "order_date", "status"],
    order_products: ["id", "order_id", "product_id", "quantity", "price"],
  };

  const KEYWORDS = [
    "SELECT ", "FROM ", "WHERE ", "AND ", "OR ",
    "ORDER BY ", "GROUP BY ", "HAVING ", "LIMIT ",
    "JOIN ", "LEFT JOIN ", "IS NULL", "LIKE ",
  ];

  // カーソル位置にテキストを挿入
  const insertText = useCallback((text: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? query.length;
    const end = ta.selectionEnd ?? query.length;
    const newValue = query.substring(0, start) + text + query.substring(end);
    setQuery(newValue);
    queryRef.current = newValue;
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + text.length, start + text.length);
    });
  }, [query]);

  // カスタムボタン helpers
  const saveCustomButtons = (btns: CustomButton[]) => {
    setCustomButtons(btns);
    if (typeof window !== "undefined") localStorage.setItem(CUSTOM_BTN_KEY, JSON.stringify(btns));
  };
  const openCustomModal = (btn?: CustomButton) => {
    setEditingCustomBtn(btn ?? null);
    setModalLabel(btn?.label ?? "");
    setModalText(btn?.text ?? "");
    setShowCustomModal(true);
  };
  const closeCustomModal = () => {
    setShowCustomModal(false);
    setEditingCustomBtn(null);
    setModalLabel("");
    setModalText("");
  };
  const handleSaveCustomBtn = () => {
    const label = modalLabel.trim();
    const text = modalText.trim();
    if (!label || !text) return;
    if (editingCustomBtn) {
      saveCustomButtons(customButtons.map((b) => b.id === editingCustomBtn.id ? { ...b, label, text } : b));
    } else {
      saveCustomButtons([...customButtons, { id: Date.now().toString(), label, text }]);
    }
    closeCustomModal();
  };

  // sql.js をロード
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const mod = await import("sql.js");
        const initSqlJs = (mod as unknown as { default: (cfg: object) => Promise<unknown> }).default ?? mod;
        const SQL = await (initSqlJs as (cfg: object) => Promise<{ Database: new () => { run: (s: string) => void; exec: (s: string) => { columns?: string[]; values?: (string | number | null)[][] }[] } }>)({
          locateFile: (f: string) => `/${f}`,
        });
        if (cancelled) return;
        sqlConstructorRef.current = SQL as unknown as { Database: new () => { exec: (s: string) => { columns?: string[]; values?: (string | number | null)[][] }[] } };
        const db = new SQL.Database();
        db.exec(SAMPLE_DB_SQL);
        dbRef.current = db;
        setStatus("ready");
        onReadyRef.current?.();
      } catch (e) {
        if (!cancelled) {
          setError("読み込みエラー: " + (e as Error).message);
          setStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // 外部から任意のSQLを実行できるメソッドをrefで公開
  useImperativeHandle(ref, () => ({
    // 模範解答の比較用：フレッシュDBで実行
    runSql: (sql: string) => {
      if (!sqlConstructorRef.current) return null;
      try {
        const freshDb = new sqlConstructorRef.current.Database();
        freshDb.exec(SAMPLE_DB_SQL);
        const statements = sql.split(";").map(s => s.trim()).filter(Boolean);
        let lastSelectResult: { columns: string[]; rows: (string | number | null)[][] } | null = null;
        for (const stmt of statements) {
          const res = freshDb.exec(stmt);
          if (res.length > 0 && res[0].columns && res[0].columns.length > 0) {
            lastSelectResult = { columns: res[0].columns, rows: res[0].values ?? [] };
          }
        }
        return lastSelectResult ?? { columns: [], rows: [] };
      } catch {
        return null;
      }
    },
    // 問題切り替え時にDBをリセット
    resetDb: () => {
      if (!sqlConstructorRef.current) return;
      const db = new sqlConstructorRef.current.Database();
      db.exec(SAMPLE_DB_SQL);
      dbRef.current = db;
    },
    // setupSql用：現在のdbRef.currentに直接実行（フレッシュDBを作らない）
    execSetupSql: (sql: string) => {
      if (!dbRef.current) return;
      try { dbRef.current.exec(sql); } catch { /* 無視 */ }
    },
    // エディタの入力・結果をクリア
    clearQuery: () => {
      setQuery("");
      queryRef.current = "";
      setResults([]);
      setError(null);
    },
    // 現在のエディタ入力をそのまま現在のDBで実行して結果を返す
    runCurrentSql: () => {
      const currentQuery = queryRef.current.trim();
      if (!dbRef.current || !currentQuery) return { result: null, error: null };
      try {
        const db = dbRef.current as {
          exec: (sql: string) => { columns?: string[]; values?: (string | number | null)[][] }[];
        };
        const statements = currentQuery.split(";").map((s) => s.trim()).filter(Boolean);
        let lastSelectResult: { columns: string[]; rows: (string | number | null)[][] } | null = null;
        for (const stmt of statements) {
          const res = db.exec(stmt);
          if (res.length > 0 && res[0].columns && res[0].columns.length > 0) {
            lastSelectResult = { columns: res[0].columns, rows: res[0].values ?? [] };
          }
        }
        return { result: lastSelectResult ?? { columns: [], rows: [] }, error: null };
      } catch (e) {
        return { result: null, error: translateError((e as Error).message) };
      }
    },
    // サンプルテーブルを全件取得（SampleTableViewer用）
    queryTable: (tableName: string) => {
      if (!dbRef.current) return null;
      try {
        const db = dbRef.current as {
          exec: (sql: string) => { columns?: string[]; values?: (string | number | null)[][] }[];
        };
        const res = db.exec(`SELECT * FROM "${tableName}"`);
        if (res.length > 0) {
          return { columns: res[0].columns ?? [], rows: res[0].values ?? [] };
        }
        return { columns: [], rows: [] };
      } catch {
        return null;
      }
    },
    // 現在のエディタ入力テキストを返す（パネル切り替え時の保存用）
    getCurrentQuery: () => queryRef.current,
    // テキストエリアにフォーカスを当てる（再レンダリング後に実行）
    focusEditor: () => requestAnimationFrame(() => textareaRef.current?.focus()),
  }));

  const runQuery = useCallback(() => {
    if (!query.trim()) return;

    if (!dbRef.current) {
      setError("SQLエンジンがまだ読み込まれていません。少し待ってから再試行してください。");
      return;
    }

    setStatus("running");
    setError(null);
    setResults([]);

    try {
      const db = dbRef.current as {
        exec: (sql: string) => { columns?: string[]; values?: (string | number | null)[][] }[];
      };

      const statements = query.split(";").map((s) => s.trim()).filter(Boolean);
      const allResults: QueryResult[] = [];
      let dmlCount = 0;

      for (const stmt of statements) {
        const isSelect = /^\s*select\b/i.test(stmt);
        const res = db.exec(stmt);
        if (res.length > 0) {
          const columns = Array.isArray(res[0]?.columns) ? res[0].columns! : [];
          const rows = Array.isArray(res[0]?.values) ? res[0].values! : [];
          if (columns.length > 0) {
            allResults.push({ columns, rows });
          } else {
            dmlCount++;
          }
        } else if (isSelect) {
          allResults.push({ columns: [], rows: [] });
        } else {
          dmlCount++;
        }
      }

      setResults(allResults);

      if (allResults.length > 0 && onResult) {
        const last = allResults[allResults.length - 1];
        onResult(last.columns, last.rows);
      }

      if (allResults.length === 0 && dmlCount > 0) {
        setError(`✅ ${dmlCount}件のクエリを実行しました（結果なし）`);
      }
    } catch (e) {
      setError(translateError((e as Error).message));
      if (onResultError) onResultError();
    } finally {
      setStatus("ready");
    }
  }, [query, onResult]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runQuery();
    }
  };

  const isLoading = status === "loading";
  const isRunning = status === "running";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* エディタ */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "0.5rem 1rem",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: isLoading ? "#fbbf24" : status === "error" ? "#f87171" : "#34d399",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          <span style={{ color: "#8888aa", fontSize: "0.75rem" }}>
            {isLoading ? "読み込み中..." : status === "error" ? "エラー" : "SQL Editor"}
          </span>
          <span style={{ color: "#546e7a", fontSize: "0.7rem", marginLeft: "auto" }}>
            Ctrl+Enter で実行
          </span>
        </div>
        <textarea
          id="tour-sql-editor"
          ref={textareaRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); queryRef.current = e.target.value; }}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          disabled={isLoading}
          style={{
            width: "100%",
            minHeight: "120px",
            padding: "1rem",
            background: "transparent",
            border: "none",
            outline: "none",
            color: isLoading ? "#546e7a" : "#e0e0f0",
            fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
            fontSize: "1rem",
            lineHeight: 1.6,
            resize: "vertical",
          }}
        />

        {/* ショートカットボタンエリア */}
        <div id="tour-sql-buttons">

        {/* 行1: 実行・クリア ｜ 大小文字トグル ｜ キーワード */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "0.5rem 0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.38rem",
            flexWrap: "wrap",
            background: "rgba(255,255,255,0.01)",
          }}
        >
          <button
            id="tour-run-button"
            onClick={runQuery}
            disabled={isLoading || isRunning}
            style={{
              background: isLoading || isRunning ? "rgba(102,126,234,0.2)" : "linear-gradient(135deg,#667eea,#764ba2)",
              color: isLoading || isRunning ? "#8888aa" : "#fff",
              border: "none", borderRadius: "7px",
              padding: "0.42rem 1rem",
              cursor: isLoading || isRunning ? "not-allowed" : "pointer",
              fontWeight: 600, fontSize: "0.85rem",
              transition: "all 0.2s", whiteSpace: "nowrap", flexShrink: 0,
            }}
          >
            {isLoading ? "⏳ 読み込み中..." : isRunning ? "⚙️ 実行中..." : "▶ 実行"}
          </button>
          <button
            onClick={() => { setQuery(""); queryRef.current = ""; setResults([]); setError(null); }}
            disabled={isLoading || isRunning}
            style={{
              background: "rgba(255,255,255,0.04)",
              color: isLoading || isRunning ? "#546e7a" : "#8888aa",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: "7px",
              padding: "0.42rem 0.8rem",
              cursor: isLoading || isRunning ? "not-allowed" : "pointer",
              fontWeight: 600, fontSize: "0.85rem", flexShrink: 0,
            }}
          >
            ✕ クリア
          </button>
          {showTableButton && (
            <button
              id="tour-table-button"
              onClick={() => window.open("/table-reference", "table-reference", "width=820,height=560,resizable=yes,scrollbars=yes")}
              style={{
                background: "rgba(255,255,255,0.04)", color: "#8888aa",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: "7px",
                padding: "0.42rem 0.8rem", cursor: "pointer",
                fontWeight: 600, fontSize: "0.85rem", whiteSpace: "nowrap", flexShrink: 0,
              }}
            >
              📋 テーブル
            </button>
          )}
          {/* 区切り */}
          <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.1)", flexShrink: 0, margin: "0 0.05rem" }} />
          {/* 大小文字トグル */}
          <div style={{ display: "flex", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "7px", overflow: "hidden", flexShrink: 0 }}>
            {(["ABC", "abc"] as const).map((label) => {
              const active = label === "ABC" ? isUpper : !isUpper;
              return (
                <button
                  key={label}
                  onClick={() => setIsUpper(label === "ABC")}
                  style={{
                    padding: "0.3rem 0.65rem", fontSize: "0.75rem", fontWeight: 700,
                    cursor: "pointer", border: "none",
                    fontFamily: "'Fira Code','Consolas',monospace",
                    background: active ? "rgba(102,126,234,0.3)" : "transparent",
                    color: active ? "#c0cfff" : "#546e7a",
                    transition: "all 0.12s",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {/* 区切り */}
          <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.1)", flexShrink: 0, margin: "0 0.05rem" }} />
          {/* キーワードボタン */}
          {KEYWORDS.map((kw) => (
            <button
              key={kw}
              onClick={() => insertText(isUpper ? kw : kw.toLowerCase())}
              style={{
                background: "rgba(102,126,234,0.08)",
                border: "1px solid rgba(102,126,234,0.25)",
                borderRadius: "6px", color: "#a0b4f8",
                padding: "0.28rem 0.58rem", fontSize: "0.78rem",
                fontFamily: "'Fira Code','Consolas',monospace",
                fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                transition: "all 0.12s", flexShrink: 0,
              }}
            >
              {isUpper ? kw.trim() : kw.trim().toLowerCase()}
            </button>
          ))}
        </div>

        {/* 行2: テーブル名挿入（黄） */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "0.45rem 0.75rem",
            display: "flex", alignItems: "center", gap: "0.38rem", flexWrap: "wrap",
            background: "rgba(255,255,255,0.005)",
          }}
        >
          <span style={{ color: "#546e7a", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap", flexShrink: 0 }}>
            テーブル名
          </span>
          {(["users", "products", "orders", "order_products"] as const).map((tbl) => (
            <button
              key={tbl}
              onClick={() => insertText(tbl)}
              style={{
                background: "rgba(251,191,36,0.07)",
                border: "1px solid rgba(251,191,36,0.2)",
                borderRadius: "6px", color: "#d4a844",
                padding: "0.28rem 0.6rem", fontSize: "0.78rem",
                fontFamily: "'Fira Code','Consolas',monospace",
                fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                transition: "all 0.12s", flexShrink: 0,
              }}
            >
              {tbl}
            </button>
          ))}
        </div>

        {/* 行3: カラム絞り込みタブ（挿入なし）＋カラム名挿入（緑） */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "0.45rem 0.75rem",
            display: "flex", alignItems: "center", gap: "0.38rem", flexWrap: "wrap",
            background: "rgba(255,255,255,0.005)",
          }}
        >
          <span style={{ color: "#546e7a", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap", flexShrink: 0 }}>
            カラム
          </span>
          {(["users", "products", "orders", "order_products"] as const).map((tbl) => (
            <button
              key={tbl}
              onClick={() => setColTable(tbl)}
              style={{
                background: colTable === tbl ? "rgba(52,211,153,0.1)" : "transparent",
                border: `1px solid ${colTable === tbl ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "6px",
                color: colTable === tbl ? "#34d399" : "#8888aa",
                padding: "0.25rem 0.52rem", fontSize: "0.72rem",
                fontFamily: "'Fira Code','Consolas',monospace",
                fontWeight: colTable === tbl ? 700 : 500,
                cursor: "pointer", whiteSpace: "nowrap",
                transition: "all 0.12s", flexShrink: 0,
              }}
            >
              {tbl === "order_products" ? "op" : tbl}
            </button>
          ))}
          <div style={{ width: "1px", height: "18px", background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />
          {TABLE_COLS[colTable].map((col) => (
            <button
              key={col}
              onClick={() => insertText(col)}
              style={{
                background: "rgba(52,211,153,0.07)",
                border: "1px solid rgba(52,211,153,0.2)",
                borderRadius: "6px", color: "#34d399",
                padding: "0.28rem 0.6rem", fontSize: "0.78rem",
                fontFamily: "'Fira Code','Consolas',monospace",
                fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
                transition: "all 0.12s", flexShrink: 0,
              }}
            >
              {col}
            </button>
          ))}
        </div>

        {/* 行4: 記号ボタン（シアン） */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "0.45rem 0.75rem",
            display: "flex", alignItems: "center", gap: "0.38rem", flexWrap: "wrap",
            background: "rgba(255,255,255,0.005)",
          }}
        >
          <span style={{ color: "#546e7a", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap", flexShrink: 0 }}>
            記号
          </span>
          {([
            { label: "''",  action: () => { const ta = textareaRef.current; if (!ta) return; const s = ta.selectionStart ?? query.length; const e = ta.selectionEnd ?? query.length; const nv = query.substring(0, s) + "''" + query.substring(e); setQuery(nv); queryRef.current = nv; requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(s + 1, s + 1); }); } },
            { label: "<",   action: () => insertText("<") },
            { label: ">",   action: () => insertText(">") },
            { label: "=",   action: () => insertText("=") },
            { label: "*",   action: () => insertText("*") },
            { label: "↵",   action: () => insertText("\n") },
            { label: "␣",   action: () => insertText(" ") },
            { label: ",",   action: () => insertText(",") },
          ] as { label: string; action: () => void }[]).map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              style={{
                background: "rgba(34,211,238,0.07)",
                border: "1px solid rgba(34,211,238,0.22)",
                borderRadius: "6px", color: "#22d3ee",
                padding: "0.28rem 0.7rem",
                fontSize: label === "<" || label === ">" || label === "=" ? "1rem" : "0.85rem",
                fontFamily: "'Fira Code','Consolas',monospace",
                fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                transition: "all 0.12s", flexShrink: 0,
                minWidth: "2.2rem", textAlign: "center",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 行5: カスタムボタン（オレンジ） */}
        <div
          style={{
            borderTop: "1px dashed rgba(251,146,60,0.25)",
            padding: "0.4rem 0.75rem",
            display: "flex", alignItems: "center", gap: "0.38rem", flexWrap: "wrap",
            background: "rgba(251,146,60,0.015)",
          }}
        >
          <span style={{ color: "rgba(251,146,60,0.55)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap", flexShrink: 0 }}>
            カスタム
          </span>

          {/* カスタムボタン一覧 */}
          {customButtons.map((btn) =>
            isEditingCustom ? (
              <div key={btn.id} style={{ display: "inline-flex", alignItems: "center", border: "1px solid rgba(251,146,60,0.4)", borderRadius: "7px", overflow: "hidden", flexShrink: 0 }}>
                <button
                  onClick={() => openCustomModal(btn)}
                  style={{ background: "rgba(251,146,60,0.08)", border: "none", color: "#fb923c", padding: "0.28rem 0.7rem", fontSize: "0.82rem", fontFamily: "'Fira Code','Consolas',monospace", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  {btn.label}
                </button>
                <button
                  onClick={() => saveCustomButtons(customButtons.filter((b) => b.id !== btn.id))}
                  style={{ background: "rgba(239,68,68,0.15)", border: "none", color: "#f87171", padding: "0.28rem 0.4rem", cursor: "pointer", fontSize: "0.8rem" }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                key={btn.id}
                onClick={() => insertText(btn.text)}
                style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.25)", borderRadius: "6px", color: "#fb923c", padding: "0.28rem 0.7rem", fontSize: "0.82rem", fontFamily: "'Fira Code','Consolas',monospace", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.12s", flexShrink: 0 }}
              >
                {btn.label}
              </button>
            )
          )}

          {/* 区切り */}
          {customButtons.length > 0 && (
            <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.08)", flexShrink: 0 }} />
          )}

          {/* 編集トグル */}
          {customButtons.length > 0 && (
            <button
              onClick={() => setIsEditingCustom((v) => !v)}
              style={{ background: isEditingCustom ? "rgba(251,146,60,0.2)" : "transparent", border: "1px solid rgba(251,146,60,0.3)", borderRadius: "6px", color: "#fb923c", padding: "0.2rem 0.5rem", fontSize: "0.72rem", cursor: "pointer", flexShrink: 0, display: "inline-flex", alignItems: "center", gap: "0.2rem" }}
            >
              {isEditingCustom ? "✏️ 完了" : "✏️ 編集"}
            </button>
          )}

          {/* 追加ボタン */}
          {customButtons.length < MAX_CUSTOM_BUTTONS && (
            <button
              onClick={() => openCustomModal()}
              style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.18)", borderRadius: "6px", color: "#8888aa", padding: "0.2rem 0.55rem", fontSize: "0.78rem", cursor: "pointer", flexShrink: 0, transition: "all 0.12s" }}
            >
              {customButtons.length === 0 ? "＋ ボタンを追加" : "＋"}
            </button>
          )}
        </div>
        </div>{/* /tour-sql-buttons */}
      </div>

      {/* カスタムボタン追加・編集モーダル */}
      {showCustomModal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={(e) => { if (e.target === e.currentTarget) closeCustomModal(); }}
        >
          <div style={{ background: "#131325", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "1.5rem", width: "340px", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#e0e0f0", marginBottom: "1.1rem" }}>
              {editingCustomBtn ? "✏️ カスタムボタンを編集" : "＋ カスタムボタンを追加"}
            </div>

            <div style={{ marginBottom: "0.9rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", color: "#8888aa", marginBottom: "0.3rem" }}>
                ボタンのラベル <span style={{ color: "#f87171" }}>*</span>
              </label>
              <input
                type="text"
                value={modalLabel}
                onChange={(e) => setModalLabel(e.target.value)}
                placeholder="例: 東京、price > 1000"
                maxLength={20}
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#e0e0f0", padding: "0.55rem 0.75rem", fontSize: "0.88rem", outline: "none", fontFamily: "'Fira Code','Consolas',monospace" }}
              />
              {modalLabel.trim() && (
                <div style={{ fontSize: "0.72rem", color: "#8888aa", marginTop: "0.3rem" }}>
                  プレビュー:{" "}
                  <span style={{ display: "inline-block", background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.3)", borderRadius: "5px", color: "#fb923c", padding: "0.1rem 0.4rem", fontSize: "0.78rem", fontFamily: "monospace" }}>
                    {modalLabel.trim()}
                  </span>
                </div>
              )}
            </div>

            <div style={{ marginBottom: "0.9rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", color: "#8888aa", marginBottom: "0.3rem" }}>
                挿入するSQLテキスト <span style={{ color: "#f87171" }}>*</span>
              </label>
              <textarea
                value={modalText}
                onChange={(e) => setModalText(e.target.value)}
                placeholder={"例: '東京'\n例: price > 1000\n例: IS NOT NULL"}
                rows={3}
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#e0e0f0", padding: "0.55rem 0.75rem", fontSize: "0.88rem", outline: "none", fontFamily: "'Fira Code','Consolas',monospace", resize: "vertical" }}
              />
              <div style={{ fontSize: "0.72rem", color: "#546e7a", marginTop: "0.25rem" }}>
                クリックするとカーソル位置に挿入されます
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.6rem", marginTop: "1.25rem" }}>
              {editingCustomBtn && (
                <button
                  onClick={() => { saveCustomButtons(customButtons.filter((b) => b.id !== editingCustomBtn.id)); closeCustomModal(); }}
                  style={{ background: "transparent", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", color: "#f87171", fontSize: "0.85rem", padding: "0.65rem 0.85rem", cursor: "pointer" }}
                >
                  削除
                </button>
              )}
              <button
                onClick={closeCustomModal}
                style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#8888aa", fontSize: "0.88rem", padding: "0.65rem", cursor: "pointer" }}
              >
                キャンセル
              </button>
              <button
                onClick={handleSaveCustomBtn}
                disabled={!modalLabel.trim() || !modalText.trim()}
                style={{ flex: 1, background: modalLabel.trim() && modalText.trim() ? "linear-gradient(135deg,#fb923c,#f97316)" : "rgba(251,146,60,0.2)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "0.88rem", fontWeight: 700, padding: "0.65rem", cursor: modalLabel.trim() && modalText.trim() ? "pointer" : "not-allowed" }}
              >
                {editingCustomBtn ? "更新する" : "追加する"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* エラー / DML フィードバック */}
      {error && (
        <div
          style={{
            background: error.startsWith("✅")
              ? "rgba(52,211,153,0.08)"
              : "rgba(248,113,113,0.1)",
            border: `1px solid ${error.startsWith("✅") ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            color: error.startsWith("✅") ? "#34d399" : "#f87171",
            fontSize: "0.85rem",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
          }}
        >
          {error}
        </div>
      )}

      {/* 結果テーブル（hideResults=true のときは右パネルのタブに表示するため非表示） */}
      {!hideResults && results.map((result, i) => (
        <div key={i} style={{ overflowX: "auto" }}>
          <div style={{ color: "#8888aa", fontSize: "0.75rem", marginBottom: "0.4rem" }}>
            {result.rows.length} 件
          </div>
          {result.columns.length === 0 ? (
            <div style={{ color: "#546e7a", fontSize: "0.85rem", padding: "0.75rem", textAlign: "center" }}>
              条件に一致するデータがありません
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr>
                  {result.columns.map((col, ci) => (
                    <th
                      key={ci}
                      style={{
                        padding: "0.5rem 0.75rem",
                        background: "rgba(102,126,234,0.15)",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                        color: "#667eea",
                        textAlign: "left",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        style={{
                          padding: "0.4rem 0.75rem",
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
          )}
        </div>
      ))}

      {!hideResults && results.length === 0 && !error && status === "ready" && (
        <div
          style={{ color: "#546e7a", fontSize: "0.85rem", textAlign: "center", padding: "1rem" }}
        >
          SQLを入力して実行ボタンを押してください
        </div>
      )}
    </div>
  );
});

export default SqlEditor;

function translateError(msg: string): string {
  if (msg.includes("no such table")) {
    const table = msg.match(/no such table: (\w+)/)?.[1];
    return `テーブル "${table}" が存在しません。テーブル名を確認してください。`;
  }
  if (msg.includes("syntax error")) {
    return `SQL構文エラーです。キーワードのスペルや括弧を確認してください。\n詳細: ${msg}`;
  }
  if (msg.includes("no such column")) {
    const col = msg.match(/no such column: (.+)/)?.[1];
    return `カラム "${col}" が存在しません。カラム名を確認してください。`;
  }
  return msg;
}
