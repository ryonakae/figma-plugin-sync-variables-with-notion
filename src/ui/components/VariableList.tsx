/** @jsx h */
import { Fragment, type JSX, h } from 'preact'
import { useRef, useState } from 'preact/hooks'

import {
  Button,
  Container,
  Divider,
  Textbox,
  VerticalSpace,
} from '@create-figma-plugin/ui'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useList, useMount } from 'react-use'

import useSettings from '@/ui/hooks/useSettings'

export default function VariableList() {
  const { settings, updateSettings } = useSettings()
  const [variables, setVariables] = useState<VariableForUI[]>([])
  const [listItems, { filter, reset }] = useList<VariableForUI>(variables)
  const listWrapperRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

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

  // マウント時にfilterStringが入力されていたらリストをフィルター
  useMount(() => {
    console.log('VariableList mounted')
    if (settings.filterString.length > 0) {
      filterList(settings.filterString)
    }
  })

  return (
    <div>
      {/* filter */}
      <Container space="medium">
        <VerticalSpace space="extraSmall" />

        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faFilter} />

          <div className="flex-1">
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
        className="h-[500px] overflow-y-auto overflow-x-hidden"
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
                {/* <VariableListItem
                  variable={items[virtualItem.index]}
                  onClick={onRowClick}
                  selected={
                    items[virtualItem.index].id === settings.selectedListItemId
                  }
                /> */}
                <div>
                  <div>{virtualItem.index}</div>
                </div>
              </div>
            ))}
          </ul>
        ) : (
          // empty
          <div className="flex h-full flex-col items-center justify-center text-secondary">
            No variables available
          </div>
        )}
      </div>
    </div>
  )
}
