# エディタについて
ハイライトシンタックス（色付け）のために、Microsoft提供のWebコードエディタ、[Monaco Editor](https://microsoft.github.io/monaco-editor/docs.html)を使用している（MITライセンス）。

## 関連コンポーネント
- app/component/SMMLEditor.tsx

## onChangeの挙動
onChangeでタイマーが作動し、5秒間次の更新がなかった場合に、compile関数にテキストを渡しコンパイルを行う



