# シーケンス SetTimer 時間

## issue
- 16分音符で時間が動いている。
- さまざまな音列に対応したい。
- 処理の重さ（コンポーネントの更新、音列の検索）
- 

## 処理の流れ
- isPlayingがtrueのとき　→ proceed関数

## 関連コンポーネント
- app/hooks/useSequencer.tsx

## SetTimerを使用している
- SetTimerは正確ではない。

## 参考
- [【React】重い処理のあるコンポーネントはパフォーマンスチューニングまで忘れずに](https://zenn.dev/spacemarket/articles/3ee5fe0597ff3e)