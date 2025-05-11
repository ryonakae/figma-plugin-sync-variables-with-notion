/**
 * Notion API 関連の型定義
 * NotionデータベースとFigma変数の同期に必要な型を定義
 */
declare global {
  /**
   * Notionのタイトルプロパティの型
   */
  type NotionTitle = {
    type: 'title'
    title: { plain_text: string }[]
  }

  /**
   * Notionの数式プロパティの型
   */
  type NotionFomula = {
    type: 'formula'
    formula: {
      string: string
    }
  }

  /**
   * Notionのリッチテキストプロパティの型
   */
  type NotionRichText = {
    type: 'rich_text'
    rich_text: { plain_text: string }[]
  }

  /**
   * Notionのページ（データベースの行）の型
   */
  type NotionPage = {
    object: 'page'
    id: string
    properties: {
      [key: string]: NotionTitle | NotionFomula | NotionRichText
    }
    created_time: string
    last_edited_time: string
    url: string
  }

  /**
   * Notionのキーと値のペアを表す型
   * FigmaのVariable作成時に使用
   */
  type NotionKeyValue = {
    id: string
    key: string
    values: Record<string, string>
    created_time: string
    last_edited_time: string
    url: string
  }
}

export {}
