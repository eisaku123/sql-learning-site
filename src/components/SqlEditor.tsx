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
  runCurrentSql: () => { columns: string[]; rows: (string | number | null)[][] } | null;
  clearQuery: () => void;
}

interface SqlEditorProps {
  initialQuery?: string;
  onResult?: (columns: string[], rows: (string | number | null)[][]) => void;
  showExplanation?: boolean;
  onToggleExplanation?: () => void;
}

const SqlEditor = forwardRef<SqlEditorHandle, SqlEditorProps>(function SqlEditor(
  { initialQuery = "", onResult, showExplanation, onToggleExplanation },
  ref
) {
  const [query, setQuery] = useState(initialQuery);
  const queryRef = useRef(initialQuery);
  const [results, setResults] = useState<QueryResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "running">("loading");
  const dbRef = useRef<unknown>(null);
  const sqlConstructorRef = useRef<{ Database: new () => { exec: (s: string) => { columns?: string[]; values?: (string | number | null)[][] }[] } } | null>(null);

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
      if (!dbRef.current || !currentQuery) return null;
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
        return lastSelectResult ?? { columns: [], rows: [] };
      } catch {
        return null;
      }
    },
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
      if (onResult) onResult([], []);
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
            fontSize: "0.9rem",
            lineHeight: 1.6,
            resize: "vertical",
          }}
        />
      </div>

      {/* 実行ボタン・クリアボタン */}
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <button
          id="tour-run-button"
          onClick={runQuery}
          disabled={isLoading || isRunning}
          style={{
            background:
              isLoading || isRunning
                ? "rgba(102,126,234,0.2)"
                : "linear-gradient(135deg, #667eea, #764ba2)",
            color: isLoading || isRunning ? "#8888aa" : "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "0.6rem 1.5rem",
            cursor: isLoading || isRunning ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: "0.9rem",
            transition: "all 0.2s",
          }}
        >
          {isLoading ? "⏳ 読み込み中..." : isRunning ? "⚙️ 実行中..." : "▶ 実行"}
        </button>
        <button
          onClick={() => {
            setQuery("");
            setResults([]);
            setError(null);
          }}
          disabled={isLoading || isRunning}
          style={{
            background: "rgba(255,255,255,0.05)",
            color: isLoading || isRunning ? "#546e7a" : "#8888aa",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            padding: "0.6rem 1rem",
            cursor: isLoading || isRunning ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: "0.9rem",
            transition: "all 0.2s",
          }}
        >
          ✕ クリア
        </button>
        {onToggleExplanation && (
          <button
            id="tour-toggle-explanation"
            onClick={onToggleExplanation}
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "#8888aa",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              padding: "0.6rem 1rem",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            {showExplanation ? "解説を隠す ←" : "→ 解説を表示"}
          </button>
        )}
      </div>

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

      {/* 結果テーブル */}
      {results.map((result, i) => (
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
                  {result.columns.map((col) => (
                    <th
                      key={col}
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

      {results.length === 0 && !error && status === "ready" && (
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
