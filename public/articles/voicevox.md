# VOICEVOXとの連携について
[VOICEVOX](https://voicevox.hiroshiba.jp/)との連携機能があります。
VOICEVOXを起動しておくことで、歌声合成機能を使用することができます。

## VOICEVOXについて
VOICEVOXはhiho氏が開発した無料で使えるテキスト読み上げ・歌声合成ソフトウェアです。

## しくみ
VOICEVOXを起動すると、エンジンが起動します。
ポート50021でVOICEVOXのAPIを利用しています。

## VOICEVOXのAllow Origin設定
クロスドメイン制約に引っかかるため、設定が必要となります。
設定後は再起動が必要となります。