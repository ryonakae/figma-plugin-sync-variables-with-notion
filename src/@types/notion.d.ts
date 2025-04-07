declare global {
  type NotionTitle = {
    type: 'title'
    title: { plain_text: string }[]
  }

  type NotionFomula = {
    type: 'formula'
    formula: {
      string: string
    }
  }

  type NotionRichText = {
    type: 'rich_text'
    rich_text: { plain_text: string }[]
  }

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
