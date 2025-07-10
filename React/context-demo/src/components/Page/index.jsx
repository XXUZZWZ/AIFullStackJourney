import Child from '../Child';
import {useTheme} from '../../hooks/useTheme';
const Page = () =>{
  const theme = useTheme();
  console.log(theme);
  return (
    <>
    <h1 className={theme}>Page</h1>
    <h1>{theme}</h1>
    <Child/>
    </>
  )
}

export default Page