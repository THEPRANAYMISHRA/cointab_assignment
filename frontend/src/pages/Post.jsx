import { useEffect, useState } from "react";
import axios from "axios";

const Post = () => {
  const urlSearchString = window.location.search;
  const params = new URLSearchParams(urlSearchString);
  const id = params.get("userId");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataPresent, setIsDataPresent] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(false);
  const [userId] = useState(id);
  const baseUrl = "https://cointab-5uh7.onrender.com";

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
      );
      const value = await axios.get(`${baseUrl}/check/?id=${userId}`);
      setIsDataPresent(value.data);
      setData(res.data);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addBulk = async () => {
    try {
      let payload = { userId: userId, posts: data };
      let res = await axios.post(`${baseUrl}/add`, payload);
      console.log(res);
      setAlert(true);
      fetchPosts();
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  const downloadExcel = async () => {
    try {
      const res = await axios.get(`${baseUrl}/download/?userId=${userId}`, {
        responseType: "blob",
      });
      if (res.status === 200) {
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "users.xlsx");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error(
          `Failed to download Excel file. Server responded with status ${res.status}`
        );
        setError(
          `Failed to download Excel file. Server responded with status ${res.status}`
        );
      }
    } catch (error) {
      console.error("Error downloading Excel file:", error);
      setError("Error downloading Excel file. Please try again later.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="overflow-auto p-2" style={{ height: "100%" }}>
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show w-100"
          role="alert"
        >
          <strong>Alert!</strong> {error}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
      )}
      {alert && (
        <div
          className="alert alert-success alert-dismissible fade show w-100"
          role="alert"
        >
          <strong>Alert!</strong>Data uploaded successfully
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setAlert(false)}
          ></button>
        </div>
      )}

      {!error && isDataPresent ? (
        <button
          className="btn btn-success mx-1"
          disabled={isLoading}
          onClick={downloadExcel}
        >
          Download In Excel
        </button>
      ) : !error && !isDataPresent ? (
        <button
          className="btn btn-light mx-1"
          disabled={isLoading}
          onClick={addBulk}
        >
          Bulk Add
        </button>
      ) : null}

      {isLoading ? (
        <h3 className="text-light">Loading...</h3>
      ) : (
        data.map((post) => (
          <div className="card w-100 my-1" key={post.id}>
            <div className="card-body">
              <h5 className="card-title">{post.id}</h5>
              <h6 className="card-subtitle mb-2 text-body-secondary">
                {post.title}
              </h6>
              <p className="card-text">{post.body}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Post;
