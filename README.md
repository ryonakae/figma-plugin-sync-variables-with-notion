# Sync Variables with Notion (Figma Plugin)

![](./cover.png)

Sync variables from Notion database to Figma document's Variable Collection.
Useful when managing app text in Notion or for multilingual support.

## 🔥 How to use

### Sync collection tab
Connects a Notion database with a Figma Variable Collection and synchronizes the values. Settings are saved per Figma document.

#### 1. Database ID
Specify the Notion database ID ([Reference](https://developers.notion.com/reference/retrieve-a-database)).

#### 2. Integration token
First, create a new integration in Notion ([Reference](https://developers.notion.com/docs/create-a-notion-integration#create-your-integration-in-notion)).
Next, give your integration page permissions ([Reference](https://developers.notion.com/docs/create-a-notion-integration#give-your-integration-page-permissions)).
Input the copied token.

#### 3. Key property name
Specify the name of the property that serves as the key for the variables (e.g., Name, Key, ID).  
Currently, title, formula and text properties are supported.

#### 5. Collection name to create or update
Specify the name of the Figma Variable Collection to sync with. If it doesn't exist, it will be created.

#### 6. Add or reorder modes
You can set property names (modes) when retrieving values from the Notion database. These correspond to Figma Variable Modes.

- **Adding modes**:
  1. Enter a mode name in the textbox (e.g., `ja`, `en`, or other property names in your Notion database).
  2. Click the "Add" button to add it to the list.
- **Reordering modes**: Modes in the list can be reordered using drag and drop. This order will be reflected in the order of Figma Variable modes.
- **Removing modes**: Click the X icon to the right of each mode name to remove that mode from the list.

After entering the information for steps 1-5, click the "Sync variable collection with notion" button to synchronize. This process may take some time depending on the number of items in the database and variables.

### List tab
#### About list tab
Displays the variables from the synchronized Collection. You can copy keys and values.
You can also filter by key or value.  
Click on a row to display the following button.

##### "Apply variable to selected text" button
Select text layers in Figma and click the button to apply the variable.

#### About caching
When the target collection is a library collection, this plugin caches the collection information in client storage.  
This is because retrieving library collections with a large number of variables can take a significant amount of time and may hit Figma's API limitations.  
Clicking the Refresh button will clear the cache and re-fetch the variables.

### Utilities tab
Several actions are available to help synchronize Notion text with Figma.

#### Target collection
Select the Variable Collection to target for the actions. You can choose a collection or all collections.

#### Target text range
Select the range of text layers to be the target of the action. You can choose from the selected elements, the current page, or all pages.  
You can also choose to include text in components or instances.

#### "Bulk apply variables" button
Bulk apply variables to text. Applies variables when the text string matches the variable value. Searches across multiple modes if available.

#### "Highlight text" button
Visualize variable applications in text. Text with applied variables will be highlighted in blue, while text without applications will be highlighted in red.

## 📮 Support

If you have any problem or feedback, please use the [GitHub Issues](https://github.com/ryonakae/figma-plugin-sync-variables-with-notion/issues).

---

This plugin is made by Ryo Nakae 🙎‍♂️.

- https://brdr.jp
- https://x.com/ryo_dg
- https://github.com/ryonakae