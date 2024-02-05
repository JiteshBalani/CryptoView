import { useRouteError } from "react-router-dom";
import '../index.css'

const ErrorPage = () => {

  const err = useRouteError();
  console.log(err);
  const handleRefresh = () => {
    window.location.reload(true);
  };

  return (
    <div>
      <img
        alt="Error_Image"
        src="https://cdn-icons-png.flaticon.com/512/179/179386.png"
      ></img>
      <h1>OOPS!</h1>
      <h1>Something went wrong. Please <a href="#" onClick={handleRefresh}>refresh the page</a> or check your internet connection.</h1>
      <h1>{err.status} : {err.statusText}</h1>
    </div>
  )
}

export default ErrorPage