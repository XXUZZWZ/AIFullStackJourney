import useImageStore from "../../store/useImageStore"
import Waterfall from "../../components/Waterfall"
import { useEffect } from "react";
const Collection = () => {
  const { loading, images, fetchMore } = useImageStore();
  useEffect(() => {
    fetchMore();
  }, [])
  return (
    <div>

      <Waterfall images={images} loading={loading} fetchMore={fetchMore} />
    </div>
  )
}
export default Collection