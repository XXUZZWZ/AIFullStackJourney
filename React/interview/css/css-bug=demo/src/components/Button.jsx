import styles  from './Button.module.scss'
// 工程化
const Button = ()=>{
  console.log(styles)
  return (
    <>
    <button
      className={styles.button}
      onClick={() => {
        console.log("Clicked!");
      }}
    >
    Button
    </button>
    </>
  )
}

export default Button;