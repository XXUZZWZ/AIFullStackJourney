import { useDrop } from 'react-dnd'

import {
  useComponentsStore
} from '../stores/components'
import {
  useComponentConfigStore
} from '../stores/component-config'

export function useMaterialDrop(accept: string[], id?: number) {
  const { addComponent } = useComponentsStore()

  const { componentConfig } = useComponentConfigStore()

  const [{ canDrop }, drop] = useDrop(() => (
    (
      {
        accept,
        drop: (item: { name: string }, monitor) => {
          const didDrop = monitor.didDrop()
          if (didDrop) return;
          const config = componentConfig[item.name]
          if (!config) {
            console.warn('Unknown material dropped:', item)
            return
          }
          const props = config.defaultProps;
          console.log(item, "ITEM")
          addComponent({
            id: new Date().getTime(),
            props,
            name: item.name,
            children: []
          }, id)
        },
        collect: (monitor) => ({
          canDrop: monitor.canDrop()
        })
      }
    )
  )
  )

  return {
    canDrop,
    drop
  }
}