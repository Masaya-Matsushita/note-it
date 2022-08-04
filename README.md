# Note It
### 【暗記に特化したメモアプリ】<br />
- ジャンル別、本別で簡単整理<br />
- 「自分が覚えたいところだけ」を保存<br />
- 自分だけの括弧抜き文章で暗記効率UP

[プロダクトのリンクはこちら](https://note-it-five.vercel.app/)

![mac-top](https://user-images.githubusercontent.com/97160510/182673355-c6bad813-f7bb-4e46-811f-88999df8e843.jpg)

### PC版

![ 2022:08:04 2 41 31](https://user-images.githubusercontent.com/97160510/182674011-44e11f50-1f52-4b80-bb2b-a9d3cd2a114a.jpg)

### スマホ版(iPhone11 & iPhoneSE2)
<br />

## 💭 作成の背景
### 自分自身がプログラミングの学習をする中で、「要点だけを見返すことができるツール」が欲しいと感じたから。

### ① 書籍ごとに要点のリストを作成したい。
- プログラミング学習では、書籍や記事、動画教材など、多くの情報を行き来する。
- そのため、ある内容を見返したいと思ったときに、それがどこに書いてあったのか分からず、容易に見返すことができない。

### ② 「学習」に特化したサービスにしたい。
- 他のメモアプリとの差別化を図るため、より「学習」に特化したサービスにしたい。
- 重要な語句・概念に関しては、「見返せる」だけでなく「覚える」必要もあるのではないか。
- そこで、文章を任意の箇所で括弧抜きにできる機能を追加。見返すついでにアウトプット学習も兼ねることができる。

### ③ サービスの対象をより広く「学習者」へ
- 自身の学生としての経験や友達へのヒアリングから、プログラミング学習者以外にとっても需要はあるのではないかと考えた。
- サービスの対象をより広く「学習者」とし、ペルソナを「①2週間後に期末試験を控える高校生」、「②業務の傍ら、資格勉強に勤しむ社会人」の2人に設定。
- サービスの内容を「学習者」向けに考え直し、作成しました。
<br />

## 🏗 使用技術

<p align="left">
  <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="60" height="60"/> </a>
  <a href="https://reactjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="60" height="60"/> </a>
  <a href="https://nextjs.org/" target="_blank" rel="noreferrer"> <img src="https://cdn.worldvectorlogo.com/logos/nextjs-2.svg" alt="nextjs" width="60" height="60"/> </a>
  <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="tailwind" width="60" height="60"/> </a>
  <a href="" rel="noreferrer"> <img src="https://user-images.githubusercontent.com/97160510/182665367-4535d655-e05d-43a8-ba21-1c6bfb355420.svg" alt="mantine" width="60" height="60" /> </a>
  <a href="https://firebase.google.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" alt="firebase" width="60" height="60"/> </a>
  <a href="" rel="noreferrer"> <img src="https://user-images.githubusercontent.com/97160510/182664742-ba94662a-363e-4e4b-aece-cf5969ae4884.svg" alt="vercel" width="80" height="60" /> </a>
</p>

|領域|使用技術|
|:--|:--|
|フロントエンド|TypeScript/Next.js(React)|
|バックエンド|Firebase|
|スタイル|TailwindCSS/Mantine|
|Hosting|Vercel|
|認証|Firebase Authentication|
|データベース|Cloud Firestore|
|ストレージ|Cloud Storage for Firebase|
|その他|react-easy-crop (画像トリミング) <br /> react-icons/tabler-icons-react (アイコン) <br /> zod (バリデーション) <br /> eslint (リンター)|
<br />

## 💡 工夫した点

- 取得したデータをクライアント側で受け渡すことで、Firestoreからのデータ参照回数を削減した
  - useRouterのqueryで参照データのidを受け渡し
  - sessionStorageで表示するデータを受け渡し

- 再レンダリングを抑制し、パフォーマンス改善に努めた
  - useCallbackやReact.memoで関数とコンポーネントをメモ化
  - 状態管理はuseReducerを積極的に用いた
<br />

## 📱 機能一覧

- 認証
  - メールアドレス&パスワード
    - メールリンクで承認後、サービス利用可能
    - パスワード再設定メール
  - サードパーティ認証
    - Google
    - Twitter
    - GitHub
  - 認証状態でリダイレクト
- アカウント
  - ユーザーネーム
  - アイコン
    - トリミング
- コンテンツ
  - Book(書籍名、バッジ、詳細)
    - 登録、更新、削除
  - Note(ラベル、ページ、内容、括弧抜き)
    - 登録、更新、削除
