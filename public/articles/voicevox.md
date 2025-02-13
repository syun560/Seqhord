# VOICEVOXで歌声合成を行う（実験的機能）
[VOICEVOX](https://voicevox.hiroshiba.jp/)はhiho氏が開発した無料で使えるテキスト読み上げ・歌声合成ソフトウェアです。

本アプリを利用するPCでVOICEVOXを起動しておくことで、歌声合成機能を使用することができます。
（VOICEVOXを起動すると、localhostの50021番ポートでVOICEVOXエンジンのAPIサーバが起動します。
本アプリは、起動したVOICEVOXエンジンの歌声合成APIにクエリを投げ、結果として返された音声データを利用しています）


## 初回設定（VOICEVOXのAllow Origin設定）
音声合成機能を利用するには、初回のみVOICEVOXエンジンの設定が必要となります。

<img alt="VOICEVOX設定" src="/images/voivo.png" style="width: 500px" />

VOICEVOXを起動した状態で[VOICEVOX設定](http://localhost:50021/setting) を開き、Allow Originに **https://seqhord.com** を設定

設定後はVOICEVOXの再起動が必要となります。
