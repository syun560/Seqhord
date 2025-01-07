# VOICEVOXで歌声合成を行う（実験的機能）
[VOICEVOX](https://voicevox.hiroshiba.jp/)はhiho氏が開発した無料で使えるテキスト読み上げ・歌声合成ソフトウェアです。

本アプリを利用するPCでVOICEVOXを起動しておくことで、歌声合成機能を使用することができます。

## 音声合成方法
1. VOICEVOXを起動した状態で、「VOICEVOXに接続」ボタンを押します。
1. 歌声合成するキャラクターをリストから選択します。
1. 「Synth」ボタンで歌声合成を開始します。

<img alt="VOICEVOX設定" src="/images/voi.png" style="width: 500px" />

## 初回設定（VOICEVOXのAllow Origin設定）
初回のみVOICEVOXエンジンの設定が必要となります。

<img alt="VOICEVOX設定" src="/images/voivo.png" style="width: 500px" />

VOICEVOXを起動した状態で[VOICEVOX設定](http://localhost:50021/setting) を開き、Allow Originに **https://seqhord.com** を設定

設定後はVOICEVOXの再起動が必要となります。


## 仕組み（技術的な話）
VOICEVOXを起動すると、localhostの50021番ポートでVOICEVOXのAPIサーバが起動します。
本アプリは、起動したVOICEVOXの歌声合成APIにクエリを投げ、結果の音声データを取得しています。