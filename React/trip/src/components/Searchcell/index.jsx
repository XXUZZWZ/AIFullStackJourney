import styles from './searchcell.module.css'
import { Navigate } from 'react-router-dom'

import useSearchStore from '../../store/useSearchStore'
const Searchcell = ({ text }) => {

  const { setSearchText } = useSearchStore();
  const handleClick = () => {
    // console.log(e)
    // console.log(text);
    console.log(text);
    setSearchText(text);
    // navigate('/search')
  }
  return (
    <div className={styles.searchcell} onClick={handleClick}>
      {text}
    </div>
  )
}

export default Searchcell