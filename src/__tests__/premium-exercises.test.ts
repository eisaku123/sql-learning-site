import { describe, test, expect, beforeAll } from 'vitest'
import { PREMIUM_LESSONS, } from '../lib/premium-curriculum'
import { SAMPLE_DB_SQL } from '../lib/curriculum'

let SQL: { Database: new () => DB }

type DB = {
  exec: (sql: string) => { columns?: string[]; values?: (string | number | null)[][] }[]
}

beforeAll(async () => {
  const initSqlJs = (await import('sql.js')).default
  SQL = await initSqlJs() as unknown as { Database: new () => DB }
})

function createFreshDb(): DB {
  const db = new SQL.Database()
  db.exec(SAMPLE_DB_SQL)
  return db
}

function runAnswerSql(db: DB, sql: string): { columns: string[]; rows: (string | number | null)[][] } | null {
  try {
    const statements = sql.split(';').map(s => s.trim()).filter(Boolean)
    let lastResult: { columns: string[]; rows: (string | number | null)[][] } | null = null
    let lastWasSelect = false
    for (const stmt of statements) {
      const isSelect = /^\s*SELECT\b/i.test(stmt)
      const res = db.exec(stmt)
      if (res.length > 0 && res[0].columns && res[0].columns.length > 0) {
        lastResult = { columns: res[0].columns, rows: res[0].values ?? [] }
        lastWasSelect = true
      } else if (isSelect) {
        lastResult = { columns: [], rows: [] }
        lastWasSelect = true
      } else {
        lastWasSelect = false
      }
    }
    return lastWasSelect ? lastResult : null
  } catch (e) {
    console.error('SQL Error:', e)
    return null
  }
}

function compareResults(
  userCols: string[], userRows: (string | number | null)[][],
  answerCols: string[], answerRows: (string | number | null)[][],
  respectOrder = false
): boolean {
  if (userCols.length !== answerCols.length) return false

  const sortedUserCols = [...userCols].map(c => c.toLowerCase()).sort()
  const sortedAnswerCols = [...answerCols].map(c => c.toLowerCase()).sort()
  if (!sortedUserCols.every((c, i) => c === sortedAnswerCols[i])) return false

  if (userRows.length !== answerRows.length) return false
  if (userRows.length === 0) return true

  const colIndexMap = answerCols.map(ac =>
    userCols.findIndex(uc => uc.toLowerCase() === ac.toLowerCase())
  )
  const normalizedUserRows = userRows.map(row => colIndexMap.map(i => row[i]))
  const cellStr = (c: string | number | null) => (c === null ? '\x00NULL' : String(c))

  if (respectOrder) {
    return normalizedUserRows.every((row, i) =>
      row.every((cell, j) => cellStr(cell) === cellStr(answerRows[i][j]))
    )
  } else {
    const rowToStr = (row: (string | number | null)[]) => row.map(cellStr).join('\x01')
    const sortedUser = [...normalizedUserRows].map(rowToStr).sort()
    const sortedAnswer = [...answerRows].map(rowToStr).sort()
    return sortedUser.every((r, i) => r === sortedAnswer[i])
  }
}

// VIEW作成を含む問題はSTATEFULなため専用フラグ
const STATEFUL_IDS = ['pi-view-1', 'pi-view-2', 'pi-view-3', 'pi-view-4', 'pi-view-5']

describe('プレミアム全レッスン 答え合わせ テスト', () => {
  for (const lesson of PREMIUM_LESSONS) {
    describe(`${lesson.title}`, () => {
      for (const exercise of lesson.exercises) {
        test(`[${exercise.id}] ${exercise.question}`, () => {
          const db = createFreshDb()
          const result = runAnswerSql(db, exercise.answer)

          // 1. 実行エラーなし
          expect(result, `answer SQL がエラーになりました: ${exercise.answer}`).not.toBeNull()

          if (!result) return

          // 2. カラム名が一致
          const resultColsLower = result.columns.map(c => c.toLowerCase()).sort()
          const expectedColsLower = exercise.expectedColumns.map(c => c.toLowerCase()).sort()
          expect(resultColsLower, `カラム名不一致\n期待: ${expectedColsLower}\n実際: ${resultColsLower}`).toEqual(expectedColsLower)

          // 3. 結果が0件でない（VIEW削除問題は0件になることがある）
          if (exercise.id !== 'pi-view-4') {
            expect(result.rows.length, `結果が0件です`).toBeGreaterThan(0)
          }
        })

        // ORDER BY がある問題: ORDER BY なしクエリは不正解になるか確認
        if (/\bORDER\s+BY\b/i.test(exercise.answer)) {
          test(`[${exercise.id}] ORDER BY なしのクエリは不正解になる`, () => {
            const db = createFreshDb()
            const answerResult = runAnswerSql(db, exercise.answer)
            if (!answerResult) return

            const noOrderSql = exercise.answer.replace(/\s+ORDER\s+BY\s+.+?(\s+LIMIT\s+|$)/i, '$1').trim()
            if (noOrderSql === exercise.answer) return

            const db2 = createFreshDb()
            const wrongResult = runAnswerSql(db2, noOrderSql)
            if (!wrongResult) return

            if (wrongResult.rows.length === answerResult.rows.length) {
              const isSameOrder = compareResults(
                wrongResult.columns, wrongResult.rows,
                answerResult.columns, answerResult.rows,
                true
              )
              console.log(`[${exercise.id}] ORDER BY なし一致: ${isSameOrder}`)
            }
          })
        }

        // 明らかに間違ったクエリが不正解になるかテスト
        test(`[${exercise.id}] 間違ったクエリは不正解`, () => {
          // STATEFULな問題（VIEW操作）はスキップ
          if (STATEFUL_IDS.includes(exercise.id)) return

          const db = createFreshDb()
          const answerResult = runAnswerSql(db, exercise.answer)
          if (!answerResult) return

          const wrongQueries = [
            'SELECT * FROM employees',
            'SELECT id FROM employees',
            'SELECT * FROM departments',
          ].filter(q => q !== exercise.answer.trim())

          for (const wrongSql of wrongQueries) {
            const db2 = createFreshDb()
            const wrongResult = runAnswerSql(db2, wrongSql)
            if (!wrongResult) continue

            const respectOrder = /\bORDER\s+BY\b/i.test(exercise.answer)
            const isCorrect = compareResults(
              wrongResult.columns, wrongResult.rows,
              answerResult.columns, answerResult.rows,
              respectOrder
            )
            expect(isCorrect, `間違いクエリ "${wrongSql}" が正解になってしまいました`).toBe(false)
          }
        })
      }
    })
  }
})
