/** @jsx h */
import { type JSX, h } from 'preact'
import { useCallback, useEffect, useRef, useState } from 'preact/hooks'

import {
  Button,
  Container,
  Divider,
  Textbox,
  VerticalSpace,
} from '@create-figma-plugin/ui'
import { faCircleInfo, faFilter } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  useDebounce,
  useList,
  useMount,
  useUnmount,
  useUpdateEffect,
} from 'react-use'

import Empty from '@/ui/components/Empty'
import VariableListItem from '@/ui/components/VariableListItem'
import useCollection from '@/ui/hooks/useCollection'
import useSettings from '@/ui/hooks/useSettings'

type VariableListProps = {
  variables: VariableForUI[]
}

export default function VariableList({ variables }: VariableListProps) {
  const { settings, updateSettings } = useSettings()
  const { isLocalVariableCollection } = useCollection()
  const listWrapperRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [listItems, { filter, reset }] = useList<VariableForUI>(variables)
  const [tmpScrollPosition, setTmpScrollPosition] = useState(0)
  const [scrollPositionRestored, setScrollPositionRestored] = useState(false)

  const virtualizer = useVirtualizer({
    count: listItems.length,
    horizontal: false,
    // overscan: 3,
    getScrollElement: () => listWrapperRef.current,
    estimateSize: () => 66,
  })

  function handleInput(event: JSX.TargetedEvent<HTMLInputElement>) {
    const inputValue = event.currentTarget.value
    console.log('handleInput', inputValue)
    updateSettings({
      filterString: inputValue,
    })
  }

  function handleClear() {
    console.log('handleClear')
    updateSettings({
      filterString: '',
    })
    // リストをリセット
    reset()
  }

  function filterList(filterString: string) {
    console.log('filterList', filterString)

    // リストをリセット
    reset()

    // filterStringがkeyもしくはvalue propertyを含んでいたらそれに絞り込む
    filter(listItems => {
      const nameProperty = listItems.name.toLowerCase()

      let valueProperty: string
      if (settings.listDisplayModeId) {
        valueProperty = listItems.valuesByMode[settings.listDisplayModeId]
          .toString()
          .toLowerCase()
      } else {
        valueProperty = ''
      }

      return (
        nameProperty.includes(filterString.toLowerCase()) ||
        valueProperty.includes(filterString.toLowerCase())
      )
    })
  }

  // itemをクリックした時に実行する関数
  const handleItemClick = useCallback(
    (id: string) => {
      console.log('handleItemClick', id, settings.selectedListItems)

      const targetCollection = settings.listTargetCollection
      if (!targetCollection) return

      const collectionId = isLocalVariableCollection(targetCollection)
        ? targetCollection.id
        : targetCollection.key
      const selectedListItemId = settings.selectedListItems[collectionId]

      // 選択されてなければ選択済みにする
      // すでに選択済みだったら選択解除
      if (id !== selectedListItemId) {
        updateSettings({
          selectedListItems: {
            ...settings.selectedListItems,
            [collectionId]: id,
          },
        })
      } else {
        updateSettings({
          selectedListItems: {
            ...settings.selectedListItems,
            [collectionId]: null,
          },
        })
      }
    },
    [settings.selectedListItems, settings.listTargetCollection],
  )

  // スクロール時にscrollPositionを更新する関数
  const handleScroll = useCallback(() => {
    if (listWrapperRef.current) {
      setTmpScrollPosition(listWrapperRef.current.scrollTop)
    }
  }, [])

  // 選択状態を判定する関数
  const isSelected = (index: number) => {
    const targetCollection = settings.listTargetCollection
    if (!targetCollection) return false

    const collectionId = isLocalVariableCollection(targetCollection)
      ? targetCollection.id
      : targetCollection.key

    return settings.selectedListItems[collectionId] === listItems[index].id
  }

  // tmpScrollPositionが更新されたらdebounceさせてからStoreに保存
  // scrollPositionRestoredがtrueのときだけ
  useDebounce(
    () => {
      if (scrollPositionRestored) {
        const targetCollection = settings.listTargetCollection
        if (!targetCollection) return

        console.log('scrollPosition update (debounced)', tmpScrollPosition)

        const collectionId = isLocalVariableCollection(targetCollection)
          ? targetCollection.id
          : targetCollection.key

        updateSettings({
          scrollPositions: {
            ...settings.scrollPositions,
            [collectionId]: tmpScrollPosition,
          },
        })
      }
    },
    100,
    [tmpScrollPosition],
  )

  useMount(() => {
    console.log('VariableList mounted', variables)

    // マウント時にfilterStringが入力されていたらリストをフィルター
    if (settings.filterString.length > 0) {
      filterList(settings.filterString)
    }
  })

  useUnmount(() => {
    console.log('VariableList unmounted')
  })

  // filterStringがアップデートされたら配列をフィルター
  useUpdateEffect(() => {
    console.log('filterString update', settings.filterString)
    filterList(settings.filterString)
  }, [settings.filterString])

  // virtualizerが変更されたら(listItemsが更新されたら)
  // スクロール位置が復元されていない→スクロール位置を復元
  // スクロール位置が復元済み（フィルター or ソート時）→スクロール位置を0にする
  useEffect(() => {
    console.log(
      'items updated',
      `scrollPositionRestored: ${scrollPositionRestored}`,
    )

    if (!scrollPositionRestored) {
      const targetCollection = settings.listTargetCollection
      if (!targetCollection) return

      const collectionId = isLocalVariableCollection(targetCollection)
        ? targetCollection.id
        : targetCollection.key
      const savedPosition = settings.scrollPositions[collectionId] ?? 0

      console.log('restore scroll position', savedPosition)

      virtualizer.scrollToOffset(savedPosition)
      setTmpScrollPosition(savedPosition)

      setScrollPositionRestored(true)
    } else {
      console.log('reset scroll position to top')
      virtualizer.scrollToOffset(0)
      setTmpScrollPosition(0)
    }
  }, [virtualizer])

  // listItemsが変更される度にスクロールにイベントリスナを再設定
  useEffect(() => {
    const listElement = listWrapperRef.current

    if (listElement) {
      listElement.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (listElement) {
        listElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [listItems])

  return (
    <div className="flex h-full flex-col">
      {/* filter */}
      <Container space="medium">
        <VerticalSpace space="extraSmall" />

        <div className="flex items-center gap-1">
          <FontAwesomeIcon icon={faFilter} className="text-text-secondary" />

          <div className="ml-1 flex-1">
            <Textbox
              onInput={handleInput}
              value={settings.filterString}
              placeholder="Filter by name or value"
            />
          </div>

          {/* clear button */}
          {settings.filterString.length > 0 && (
            <Button onClick={handleClear}>Clear</Button>
          )}
        </div>

        <VerticalSpace space="extraSmall" />
      </Container>

      <Divider />

      {/* list */}
      <div
        ref={listWrapperRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
      >
        {listItems.length > 0 ? (
          <ul
            ref={listRef}
            className="relative"
            style={{
              height: `${virtualizer.getTotalSize()}px`,
            }}
          >
            {virtualizer.getVirtualItems().map(virtualItem => (
              <div
                data-index={virtualItem.index}
                key={virtualItem.key}
                ref={virtualizer.measureElement}
                className="absolute top-0 left-0 w-full"
                style={{
                  // height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <VariableListItem
                  variable={listItems[virtualItem.index]}
                  onClick={handleItemClick}
                  selected={isSelected(virtualItem.index)}
                />
              </div>
            ))}
          </ul>
        ) : (
          <Empty>No variables available</Empty>
        )}
      </div>

      <Divider />

      {/* bottom status */}
      <div className="flex h-8 items-center justify-between px-2 text-text-secondary">
        <div className="flex items-center gap-1">
          <FontAwesomeIcon icon={faCircleInfo} />
          <span>Click a row to assign or copy the variable to the text</span>
        </div>
        <span>{listItems.length} items</span>
      </div>
    </div>
  )
}
