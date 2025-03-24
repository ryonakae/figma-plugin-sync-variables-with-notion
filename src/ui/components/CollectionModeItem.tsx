/** @jsx h */
import { h } from 'preact'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { faGripLines, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Props {
  id: string
  value: string
  onRemove: (id: string) => void
}

export default function CollectionModeItem({ id, value, onRemove }: Props) {
  // dnd-kitのuseSortableフックを使用してドラッグ&ドロップ機能を実装
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-4 bg-bg-selected hover:bg-bg-selected-hover"
    >
      <div
        className="flex flex-1 items-center gap-2 px-2 py-2"
        {...listeners}
        {...(attributes as any)}
      >
        {/* ドラッグハンドル */}
        <FontAwesomeIcon icon={faGripLines} className="text-text-tertiary" />

        {/* 言語名 */}
        <div className="flex-1">{value}</div>
      </div>

      {/* 削除ボタン */}
      <button type="button" onClick={() => onRemove(id)} className="h-6 w-6">
        <FontAwesomeIcon icon={faXmark} className="text-text-tertiary" />
      </button>
    </div>
  )
}
