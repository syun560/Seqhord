# シーケンス関連

## 関連コンポーネント
- app/hooks/useSequencer.tsx

## issue
- 16分音符以外の長さの音列に対応したい。
- パフォーマンス・チューニング（コンポーネントの再描画コスト+音列のfilter時間）
- 

## 処理の流れ
- isPlayingがtrueのとき　→ proceed関数

## settimeoutを使用している
- settimeoutは正確ではない。

## 参考
- [【React】重い処理のあるコンポーネントはパフォーマンスチューニングまで忘れずに](https://zenn.dev/spacemarket/articles/3ee5fe0597ff3e)