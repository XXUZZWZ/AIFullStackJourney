import { ArrowDown, ArrowUp, DeleteO } from '@react-vant/icons'
import { Flex, Tabbar } from 'react-vant'
import styles from './cellgroup.module.css'
import { useState } from 'react'
const CellGroup = ({ children, onDelete }) => {
  const [isOpen, setIsOpen] = useState(true)
  const handleClick = () => {
    setIsOpen(!isOpen)
  }
  return (
    <div>
      <Tabbar style={{ left: '0px', top: '138px', }}>
        <Tabbar.Item>综合</Tabbar.Item>
        <Tabbar.Item>文章</Tabbar.Item>
        <Tabbar.Item>用户</Tabbar.Item>
        <Tabbar.Item>其他</Tabbar.Item>
      </Tabbar>
      <Flex justify='between'  >
        <Flex.Item span={8} className={styles.title} >
          &nbsp;&nbsp;&nbsp;搜索历史  {isOpen ? <ArrowDown className='pt-2' fontSize='24px' onClick={handleClick} /> : <ArrowUp className='pt-2' fontSize='24px' onClick={handleClick} />}
        </Flex.Item>
        <Flex.Item span={3}>
          <DeleteO
            fontSize='30px'
            className='pt-2'
            onClick={onDelete}
          />
        </Flex.Item>
      </Flex>
      <div className={styles.hidden}
        style={{ visibility: isOpen ? 'visible' : 'hidden' }}
      ></div>
      <div className={styles.cellgroup}>{children}</div>
    </div>
  )

}

export default CellGroup