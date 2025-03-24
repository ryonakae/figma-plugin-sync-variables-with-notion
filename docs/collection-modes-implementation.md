# Collection Modes Implementation Plan

## Component Structure

### CollectionModesList
親コンポーネントとして以下の責務を持ちます：
- `notionValuePropertyNames`の状態管理
- settings更新処理の実装
- 入力UI（Textbox + Button）の配置
- dnd-kitによるドラッグ&ドロップ機能の提供

### CollectionModeItem
個別の言語アイテムとして以下の要素を含みます：
- ドラッグハンドル（FontAwesomeアイコン使用）
- 言語名の表示
- 削除ボタン

## 実装の注意点

### 機能面
- 空文字列の入力防止
- 重複する言語名の防止
- ドラッグ&ドロップ操作の安定性確保
- 削除時の確認不要（すぐに削除可能）

### パフォーマンス
- メモ化による不要な再レンダリングの防止
- ドラッグ中のアニメーションの最適化

### スタイリング
- Tailwind CSSによる一貫したデザイン
- @create-figma-plugin/uiコンポーネントとの視覚的な統一性
- レスポンシブな配置とスペーシング

## 実装手順

1. 基本コンポーネント構造の実装
2. dnd-kitの統合
3. イベントハンドラーの実装（追加・削除・並び替え）
4. エラー処理の実装
5. スタイリングの調整
6. パフォーマンス最適化