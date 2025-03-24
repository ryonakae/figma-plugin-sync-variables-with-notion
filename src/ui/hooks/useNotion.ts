type useNotionProps = {
  databaseId: string
  integrationToken: string
  keyPropertyName: string
  valuePropertyName: string
  collectionName: string
}

export default function useNotion(props: useNotionProps) {
  function getPropertyValue(
    property: NotionTitle | NotionFomula | NotionRichText,
  ): string {
    let value: string

    if (property.type === 'title') {
      if (property.title.length) {
        value = property.title[0].plain_text
      } else {
        value = ''
      }
    } else if (property.type === 'rich_text') {
      if (property.rich_text.length) {
        value = property.rich_text[0].plain_text
      } else {
        value = ''
      }
    } else if (property.type === 'formula') {
      value = property.formula.string
    } else {
      value = ''
    }

    return value
  }

  async function fetchNotion(options: {
    nextCursor?: string
    keyValuesArray: NotionKeyValue[]
  }) {
    console.log('fetchNotion', props, options)

    // proxyUrlから末尾のスラッシュを削除
    const proxyUrl = process.env.PROXY_URL?.replace(/\/$/, '')

    // パラメータを定義
    // 引数nextCursorがある場合は、start_cursorを設定
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
    ).catch(() => {
      throw new Error('Failed to fetch database.')
    })
    const resJson = await res.json()
    console.log(resJson)
    const pages = resJson.results as NotionPage[]

    if (!pages) {
      // pagesが無かったら処理中断
      throw new Error('No pages in this database.')
    }

    // pageごとに処理実行
    for (const row of pages) {
      // keyPropertyNameと同じプロパティが無かったら処理中断
      if (!row.properties[props.keyPropertyName]) {
        throw new Error('Key property name is wrong.')
      }

      // valuePropertyNameと同じプロパティが無かったら処理中断
      if (!row.properties[props.valuePropertyName]) {
        throw new Error('Value property name is wrong.')
      }

      // keyPropertyNameからpropertyを探す
      const keyProperty = row.properties[props.keyPropertyName]
      // keyのtypeがtitle, formula, textでない場合は処理中断
      if (
        keyProperty.type !== 'title' &&
        keyProperty.type !== 'rich_text' &&
        keyProperty.type !== 'formula'
      ) {
        throw new Error('Key property type is wrong.')
      }
      // propertyのtypeを判別してkeyを取得する
      const key = getPropertyValue(keyProperty)

      // valuePropertyNameからpropertyを探す
      const valueProperty = row.properties[props.valuePropertyName]
      // valueのtypeがtitle, formula, textでない場合は処理中断
      if (
        valueProperty.type !== 'title' &&
        valueProperty.type !== 'rich_text' &&
        valueProperty.type !== 'formula'
      ) {
        throw new Error('Value property type is wrong.')
      }
      // propertyのtypeを判別してvalueを取得する
      const value = getPropertyValue(valueProperty)

      // keyValuesの配列にkeyとvalueを追加
      options.keyValuesArray.push({
        id: row.id,
        key,
        value,
        created_time: row.created_time,
        last_edited_time: row.last_edited_time,
        url: row.url,
      })
    }

    // resのhas_moreフラグがtrueなら、nextCursorに値を入れて再度fetchNotion関数を実行
    // falseなら終了
    if (resJson.has_more) {
      await fetchNotion({ ...options, nextCursor: resJson.next_cursor })
    } else {
      return
    }
  }

  return { fetchNotion }
}
