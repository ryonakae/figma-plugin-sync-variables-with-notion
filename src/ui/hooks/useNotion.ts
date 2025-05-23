/**
 * Notion APIを使用するためのカスタムフック
 * データベースからの読み込みと処理を行う
 */

/**
 * カスタムフックの引数の型定義
 */
type useNotionProps = {
  databaseId: string
  integrationToken: string
  keyPropertyName: string
  valuePropertyNames: string[]
  figmaCollectionName: string
}

// NotionのプロパティタイプをUnion型として定義
type NotionPropertyType = 'title' | 'rich_text' | 'formula'
type SupportedNotionProperty = NotionTitle | NotionFomula | NotionRichText

/**
 * Notion APIを操作するためのカスタムフック
 * @param props Notionデータベースへの接続情報
 */
export default function useNotion(props: useNotionProps) {
  /**
   * Notionプロパティから値を取得する関数
   * @param property Notionのプロパティオブジェクト
   * @returns プロパティの値（文字列）
   */
  function getPropertyValue(property: SupportedNotionProperty): string {
    // プロパティタイプに応じて値を抽出
    switch (property.type) {
      case 'title':
        return property.title.length ? property.title[0].plain_text : ''
      case 'rich_text':
        return property.rich_text.length ? property.rich_text[0].plain_text : ''
      case 'formula':
        return property.formula.string
      default:
        return ''
    }
  }

  /**
   * プロパティタイプが有効かチェックする型ガード関数
   * @param type チェックするタイプ
   * @returns タイプが有効な場合true
   */
  function isValidPropertyType(type: string): type is NotionPropertyType {
    return ['title', 'rich_text', 'formula'].includes(type)
  }

  // エラーメッセージを標準化
  const errorMessages = {
    fetchFailed: 'Failed to fetch database.',
    noPages: 'No pages in this database.',
    invalidKeyProperty: 'Key property name is wrong.',
    invalidValueProperty: (name: string) =>
      `Value property '${name}' not found.`,
    invalidPropertyType: (name: string) =>
      `Property '${name}' has invalid type. Expected 'title', 'rich_text', or 'formula'.`,
  }

  /**
   * Notionの行データを処理してキーと値のペアを作成する関数
   * @param row Notionの行データ
   * @param keyValuesArray 結果を格納する配列
   * @throws プロパティが見つからないか、無効なタイプの場合エラーをスロー
   */
  async function processNotionRow(
    row: NotionPage,
    keyValuesArray: NotionKeyValue[],
  ) {
    // keyプロパティの検証
    if (!row.properties[props.keyPropertyName]) {
      throw new Error(errorMessages.invalidKeyProperty)
    }

    // キープロパティを取得
    const keyProperty = row.properties[props.keyPropertyName]

    // キープロパティタイプの検証
    if (!isValidPropertyType(keyProperty.type)) {
      throw new Error(errorMessages.invalidPropertyType(props.keyPropertyName))
    }

    const key = getPropertyValue(keyProperty as SupportedNotionProperty)

    // 各valueプロパティを処理して値を取得
    const values: Record<string, string> = {}

    for (const propertyName of props.valuePropertyNames) {
      // 各valueプロパティが存在するか確認
      if (!row.properties[propertyName]) {
        throw new Error(errorMessages.invalidValueProperty(propertyName))
      }

      const valueProperty = row.properties[propertyName]

      // 各valueプロパティのタイプを検証
      if (!isValidPropertyType(valueProperty.type)) {
        throw new Error(errorMessages.invalidPropertyType(propertyName))
      }

      // 値を取得
      const value = getPropertyValue(valueProperty as SupportedNotionProperty)

      values[propertyName] = value
    }

    // 結果をキーバリューの配列に追加
    keyValuesArray.push({
      id: row.id,
      key,
      values,
      created_time: row.created_time,
      last_edited_time: row.last_edited_time,
      url: row.url,
    })
  }

  /**
   * Notionデータベースからデータを取得する関数
   * ページネーション対応で、全ページを再帰的に取得
   * @param options オプション（次のカーソルと結果を格納する配列）
   * @throws データ取得に失敗した場合エラーをスロー
   */
  async function fetchNotion(options: {
    nextCursor?: string
    keyValuesArray: NotionKeyValue[]
  }) {
    console.log('[useNotion] fetchNotion', props, options)
    // proxyUrlから末尾のスラッシュを削除
    const proxyUrl = process.env.PROXY_URL?.replace(/\/$/, '')

    // パラメータを定義
    const reqParams = {
      page_size: 100,
      start_cursor: options.nextCursor || undefined,
    }

    // データベースをfetchしてpageの配列を取得
    const res = await fetch(
      `${proxyUrl}/https://api.notion.com/v1/databases/${props.databaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${props.integrationToken}`,
          'Notion-Version': '2021-08-16',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqParams),
      },
    ).catch((e: Error) => {
      throw new Error(`${errorMessages.fetchFailed}: ${e.message}`)
    })

    if (!res.ok) {
      throw new Error(`${errorMessages.fetchFailed} (${res.status})`)
    }

    const resJson = await res.json()
    console.log('[useNotion] resJson', resJson)
    const pages = resJson.results as NotionPage[]

    if (!pages) {
      throw new Error(errorMessages.noPages)
    }

    // pageごとに処理実行
    for (const row of pages) {
      await processNotionRow(row, options.keyValuesArray)
    }

    // 再帰的にページネーション処理
    if (resJson.has_more) {
      await fetchNotion({ ...options, nextCursor: resJson.next_cursor })
    }
  }

  return { fetchNotion }
}
