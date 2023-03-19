import axios from "axios";
import { useEffect, useState } from "react";

const Spcl = () => {
const [data, setData] = useState(undefined)


useEffect(() => {

  const uploadData = () => {
    axios
        .get(
            `${process.env.NEXT_PUBLIC_API_URL}/uploadData`
        )
        .then((res) => {
            console.log(res.json())
           setData(res.json())
        })
  }
  uploadData()
},[])

return (
  <>
   {data}
  </>
  )


}


export default Spcl