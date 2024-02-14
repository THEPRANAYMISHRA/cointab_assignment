import { useEffect, useState } from "react";
import axios from "axios";

const Post = () => {
  const urlSearchString = window.location.search;
  const params = new URLSearchParams(urlSearchString);
  const id = params.get("userId");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataPresent, setIsDataPresent] = useState(true);
  const [error, setError] = useState(null);
  const [userId] = useState(id);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
      );
      const value = await axios.get(
        `http://localhost:4500/check/?id=${userId}`
      );
      setIsDataPresent(value?.status === 200 ? true : false);
      setData(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addBulk = async () => {
    try {
      let payload = { userId: userId, posts: data };
      let res = await axios.post("http://localhost:4500/add", payload);
      console.log(res.data);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  const downloadExcel = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4500/download/?userId=${userId}`,
        { responseType: "blob" }
      );
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
      {isDataPresent ? (
        <button className="btn btn-success mx-1" onClick={downloadExcel}>
          Download In Excel
        </button>
      ) : (
        <button className="btn btn-light mx-1" onClick={addBulk}>
          Bulk Add
        </button>
      )}

      {isLoading ? (
        <h3 className="text-light">Loading...</h3>
      ) : error ? (
        <h3 className="text-light">Error: {error}</h3>
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