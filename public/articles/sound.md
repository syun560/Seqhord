# サウンド関連
生成したサウンドのプレビュー方法として、WEB MIDI APIとWEB AUDIO APIの２つの方法を用意している。  
開発段階では、WEB MIDI APIを利用したが、環境の用意が大変である。
→WEB AUDIO API + SoundFontを検討する。

また、音声のプレビューとしては、VOICEVOXの音声合成機能を使用している。

## WEB MIDI API
MIDIキーボードによるステップ入力・リアルタイム入力等の機能も追加したい。


### 関連リンク
- [Web MIDI APIで楽曲再生](https://qiita.com/MizunagiKB/items/e40043b9fd5a5b161182)

## WEB AUDIO API
サウンドフォントを読み込み使用する

### サウンドフォントの再生
- [react-soundfont-player](https://github.com/rakannimer/react-soundfont-player)を使う
- CDNで使用する。

## VOICEVOXとの連携


### 関連リンク
- [個人開発で爆速な音楽再生サイトを作った](https://zenn.dev/marmooo/articles/b46d01cdf1b1bb)
- [Web 上で使えるサウンドフォントをたくさん作った](https://marmooo.blogspot.com/2023/02/web-soundfonts.html)
- [Web Audio APIを使ってDAW（っぽいもの）を作ってみる](https://qiita.com/ymgd-a/items/e189dd27e5e479e519a7)
- [js-synthesizer で MIDI の新時代が来る](https://marmooo.blogspot.com/2023/03/js-synthesizer-midi.html)
- [無料で利用しやすいサウンドフォントまとめ](https://marmooo.blogspot.com/2023/02/free-soundfonts.html)
- [ブラウザで動くアゲアゲなシンセサイザーをWeb Audio APIで作った話](https://qiita.com/naberyo34/items/7aa5e2f610b5895e9f6b)