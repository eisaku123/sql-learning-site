"use client";

import { useEffect } from "react";
import "driver.js/dist/driver.css";

const TOUR_KEY = "lesson_tour_done";

export default function LessonTour() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(TOUR_KEY)) return;

    let driver: ReturnType<typeof import("driver.js")["driver"]> | null = null;

    const startTour = async () => {
      const { driver: createDriver } = await import("driver.js");

      driver = createDriver({
        animate: true,
        smoothScroll: true,
        allowClose: true,
        overlayOpacity: 0.6,
        stagePadding: 8,
        stageRadius: 10,
        disableActiveInteraction: true,
        nextBtnText: "次へ →",
        prevBtnText: "← 戻る",
        doneBtnText: "始める！",
        onDestroyed: () => {
          const btn = document.getElementById("tour-toggle-explanation");
          if (btn) btn.style.pointerEvents = "";
          localStorage.setItem(TOUR_KEY, "1");
        },
        steps: [
          {
            popover: {
              title: `<div style="background:linear-gradient(135deg,#667eea,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:1.3rem;font-weight:800;letter-spacing:0.02em">SQLLearnへようこそ！</div>`,
              description: `
                <div style="padding:0.5rem 0 0.5rem">
                  <p style="color:#1a1a3e;font-size:1.05rem;font-weight:700;margin-bottom:0.6rem;line-height:1.7;letter-spacing:0.01em">
                    ブラウザだけで本格的なSQLが学べるサービスです。
                  </p>
                  <p style="color:#2a2a4e;font-size:1rem;margin-bottom:1rem;line-height:1.7">
                    簡単な使い方を <strong style="background:linear-gradient(135deg,#667eea,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:1.15rem;font-weight:900">9ステップ</strong> でご紹介します。
                  </p>
                  <p style="color:#666680;font-size:0.8rem">スキップしたい場合は右上の × を押してください</p>
                </div>
              `,
              side: "over",
              align: "center",
            },
          },
          {
            element: "#tour-exercise-panel",
            popover: {
              title: "① 練習問題に挑戦",
              description:
                "問題文を読んで、正しいSQLを書いてみましょう。複数問ある場合は番号で切り替えられます。",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#tour-sql-editor",
            popover: {
              title: "② SQLを入力する",
              description:
                "ここにSQLを入力します。Ctrl+Enter（Mac: ⌘+Enter）でも実行できます。",
              side: "top",
              align: "start",
            },
          },
          {
            element: "#tour-sql-buttons",
            popover: {
              title: "③ ショートカットボタン",
              description:
                "キーワード・テーブル名・カラム名・記号のボタンをクリックするだけでSQLに挿入できます。タイピングの手間が省けるので活用してみてください。",
              side: "top",
              align: "start",
            },
          },
          {
            element: "#tour-run-button",
            popover: {
              title: "④ 実行する",
              description:
                "「▶ 実行」ボタンを押すと右側に結果が表示されます。まず自分のSQLを実行してみましょう。",
              side: "top",
              align: "start",
            },
          },
          {
            element: "#tour-check-button",
            popover: {
              title: "⑤ 答え合わせ",
              description:
                "SQLを書いたら「答え合わせ」ボタンで正誤を確認できます。正解するとチェックマークが付きます。",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#tour-hint-button",
            popover: {
              title: "⑥ ヒントを見る",
              description:
                "わからない時は「ヒント」ボタンで考え方のヒントを確認できます。",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#tour-table-viewer",
            onHighlightStarted: (_el: Element | undefined, _step: unknown, { driver }: { driver: { refresh: () => void } }) => {
              window.scrollTo({ top: 0, behavior: "instant" });
              setTimeout(() => {
                window.scrollTo({ top: 200, behavior: "smooth" });
                setTimeout(() => driver.refresh(), 400);
              }, 10);
            },
            popover: {
              title: "⑦ サンプルテーブルを確認",
              description:
                "右側でサンプルデータのテーブル構造を常に確認できます。タブでテーブルを切り替えたり、ER図でリレーションを確認できます。SQL実行後は「⚡ 実行結果」タブに自動で切り替わります。",
              side: "left",
              align: "start",
            },
          },
          {
            element: "#tour-toggle-explanation",
            onHighlightStarted: (el: Element | undefined, _step: unknown, { driver }: { driver: { refresh: () => void } }) => {
              if (el) (el as HTMLElement).style.pointerEvents = "none";
              window.scrollTo({ top: 0, behavior: "instant" });
              window.dispatchEvent(new CustomEvent("lesson-tour-explanation", { detail: { open: true } }));
              setTimeout(() => driver.refresh(), 100);
            },
            onDeselected: (el: Element | undefined) => {
              if (el) (el as HTMLElement).style.pointerEvents = "";
              // 次へ・戻るどちらでも一度閉じる（step⑧のonHighlightStartedで必要なら再開）
              window.dispatchEvent(new CustomEvent("lesson-tour-explanation", { detail: { open: false } }));
            },
            popover: {
              title: "⑧ 解説を読む",
              description:
                "「📖 解説を読む」ボタンで構文の解説を表示できます。次へ進むと解説の中身を確認できます。",
              side: "bottom",
              align: "end",
            },
          },
          {
            element: "#tour-lesson-content",
            onHighlightStarted: (_el, _step, { driver }) => {
              // パネルを開いてからトランジション完了後に位置を再測定
              window.dispatchEvent(new CustomEvent("lesson-tour-explanation", { detail: { open: true } }));
              setTimeout(() => driver.refresh(), 400);
            },
            onDeselected: () => {
              window.dispatchEvent(new CustomEvent("lesson-tour-explanation", { detail: { open: false } }));
            },
            popover: {
              title: "⑨ 解説パネル",
              description:
                "構文の説明やサンプルコードを確認しながら練習問題に取り組めます。「✕ 閉じる」で非表示にできます。",
              side: "left",
              align: "start",
            },
          },
          {
            popover: {
              title: "準備完了！",
              description: `
                <div style="line-height:1.8;font-size:0.88rem;color:#1a1a3e">
                  以上が基本的な使い方です。まずは問題1から挑戦してみましょう！<br><br>
                  <div style="background:rgba(102,126,234,0.1);border:1px solid rgba(102,126,234,0.35);border-radius:8px;padding:0.6rem 0.85rem;margin-top:0.25rem">
                    🎆 <strong style="color:#5a4fcf">ログインして全問正解すると花火が打ち上がります！</strong><br>
                    <span style="color:#666680;font-size:0.8rem">進捗も保存されるので、ぜひ無料登録してみてください。</span>
                  </div>
                </div>
              `,
              side: "over",
              align: "center",
            },
          },
        ],
      });

      // 要素が描画されるまで少し待つ
      setTimeout(() => {
        // ツアー開始時に解説パネルを必ず閉じる
        window.dispatchEvent(new CustomEvent("lesson-tour-explanation", { detail: { open: false } }));
        driver?.drive();
      }, 800);
    };

    startTour();

    return () => {
      driver?.destroy();
    };
  }, []);

  return null;
}
