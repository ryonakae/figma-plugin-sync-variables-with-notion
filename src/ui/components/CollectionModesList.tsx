/** @jsx h */
import { h } from 'preact'
import { useCallback, useState } from 'preact/hooks'

import { Button, Textbox } from '@create-figma-plugin/ui'
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import CollectionModeItem from '@/ui/components/CollectionModeItem'

interface Props {
  values: string[]
  onChange: (values: string[]) => void
}

export default function CollectionModesList({ values, onChange }: Props) {
  const [inputValue, setInputValue] = useState('')

  // dnd-kitのセンサー設定
  const sensors = useSensors(useSensor(PointerSensor))

  // 新しい言語の追加
  const handleAddClick = useCallback(() => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue && !values.includes(trimmedValue)) {
      onChange([...values, trimmedValue])
      setInputValue('')
    }
  }, [inputValue, values, onChange])

  // 言語の削除
  const handleRemove = useCallback(
    (idToRemove: string) => {
      onChange(values.filter((_, index) => index.toString() !== idToRemove))
    },
    [values, onChange],
  )

  // ドラッグ終了時の処理
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (over && active.id !== over.id) {
        const oldIndex = Number.parseInt(active.id.toString())
        const newIndex = Number.parseInt(over.id.toString())
        onChange(arrayMove(values, oldIndex, newIndex))
      }
    },
    [values, onChange],
  )

  return (
    <div className="flex flex-col gap-2 overflow-hidden">
      {/* 入力フォーム */}
      <div className="flex gap-1">
        <div className="flex-1">
          <Textbox value={inputValue} onValueInput={setInputValue} />
        </div>
        <Button onClick={handleAddClick} disabled={!inputValue}>
          <span className="flex items-center gap-1">
            <FontAwesomeIcon icon={faPlus} />
            <span>Add</span>
          </span>
        </Button>
      </div>

      {/* 並び替え可能なリスト */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={values.map((_, index) => index.toString())}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-1">
            {values.map((value, index) => (
              <CollectionModeItem
                key={`${index}-${value}`}
                id={index.toString()}
                value={value}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
