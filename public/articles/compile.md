# コンパイルについて

独自言語SMMMLを解釈し、音列へ変換することを、本アプリでは「コンパイル」と呼ぶ

## 関連コンポーネント
- app/compile/
  - compile.ts
  - compile_melody.ts
  - compile_lyric.ts
  - compile_vars.ts
  - expand_vars.ts

## キーワード
- 字句解析、構文解析、意味解析、BNF記法

## コンパイルの流れ(compile.ts)
1. 入力の受け取り
1. サブトラックの変数解析(compile_var)
1. 上から1行ごとにMainトラックの文字列を解析
    1. 行頭が「@」の場合 → @命令解析
    1. 行頭が「#」の場合 → コメント行（無視）
    1. 行頭が「c」の場合 → コード解析(compile_chord.ts)
    1. 行頭が「n」の場合 → ノート解析(compile_melody.ts)
    1. 行頭が「k」の場合 → 歌詞解析(compile_lyric.ts)
    1. 行頭が数値の場合 → サブトラックへ変数展開(expand_vars.ts)
1. 結果のリターン

