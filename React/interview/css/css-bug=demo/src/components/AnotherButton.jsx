import styles from  './AnotherButton.module.scss'
const AnotherButton = () => {
  return (
    <>
    <button
      className={styles.button}
      onClick={() => {
        console.log("Clicked!");
      }}
    >
    AnotherButton
   </button>
    </>
  )
}
export default AnotherButton;