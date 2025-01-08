# Seqhordについて

<iframe width="560" height="315" src="https://www.youtube.com/embed/Uhj9IiNYFsk?si=cztyFTFL1FCMFYBk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

---

Seqhordはテキストエディタの記述を解釈（コンパイル）し、演奏データを生成する、
**サウンドプログラミングミュージックシーケンサ**です。
操作に関する簡単な説明は上の動画をご視聴ください。

## 特徴
### その① 独自言語によるサウンドプログラミング
本アプリでは基本的に音の波形データではなく、MIDIシーケンサのように、楽譜データを取り扱います。
楽譜データの記述には、**SMML**という独自の記法を用います。
SMMLは、MML（Music Macro Language）で使用されていたABC記法を簡略化した記法です。

### その② 音楽理論＋サウンドプログラミングによる、楽曲作成の抽象化、単純化
音やコードは調（スケール）に対しての相対的な音を入力するため、
入力する音は基本的に７つの音のみに単純化することができます。
これにより、移調などを簡単に行うことができます。

また、プログラミングで言うところの変数の概念を取り入れており、パターンを定義することで
繰り返しの記述を減らし、抽象的に楽曲を記述できることができます。

### その③ 外部DTMソフト・音声合成システムとの連携
本アプリで作成した楽譜データはMIDIデータとして書き出すことが出来ます。
これにより、各種DTMにソフトに読み込ませて編集を続けることが出来ます。
また、歌詞付きのMusicXMLファイルを書き出すことができるため、NEUTRINOや、VOICEVOX等音声合成システムとも簡単に連携することが出来ます。

## 歌声合成機能（VOICEVOX）の利用について
[VOICEVOXの利用規約](https://voicevox.hiroshiba.jp/term/)に準じます。
各音声ライブラリの利用規約をよくご確認の上、ご利用ください。

## お問い合わせ
作者X: [@keymon561](https://x.com/keymon561)

感想や機能要望、バグ報告など、お気軽にお問い合わせください。

## 支援者
- NBCG/檀エディ 様
- あたなよく 様

本プロジェクトをご支援いただき、大変感謝いたします。