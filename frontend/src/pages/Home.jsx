import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(false);
  const navigate = useNavigate();
  const baseUrl = "https://cointab-5uh7.onrender.com";

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("https://jsonplaceholder.typicode.com/users");
      const results = await axios.get(baseUrl);
      const resultEmails = results?.data.map((user) => user.email);

      const newData = res.data.map((user) => {
        if (resultEmails.includes(user.email)) {
          return { ...user, isPresent: true };
        } else {
          return { ...user, isPresent: false };
        }
      });
      setData(newData);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToDataBase = async (ele) => {
    try {
      let res = await axios.post(baseUrl, ele);
      setAlert(true);
      fetchUsers();
      return console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowUser = (id) => {
    navigate(`/post/?userId=${id}`);
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center h-auto gap-1">
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
      <button
        className="btn btn-warning w-100 mt-1"
        disabled={isLoading}
        onClick={fetchUsers}
      >
        {isLoading ? "wait.." : "All users"}
      </button>
      <table
        className="table w-100 overflow-scroll"
        style={{ maxWidth: "100%", height: "100%" }}
      >
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Phone</th>
            <th scope="col">Website</th>
            <th scope="col">City</th>
            <th scope="col">Company</th>
            <th scope="col">Info</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, index) => (
            <tr key={index}>
              <th scope="row">{user.id}</th>
              <td>{user.name}</td>
              <td>{user.phone}</td>
              <td>{user.website}</td>
              <td>{user.address.city}</td>
              <td>{user.company.name}</td>
              <td>
                {user.isPresent ? (
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleShowUser(user.id)}
                  >
                    Open
                  </button>
                ) : (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleSaveToDataBase(user)}
                  >
                    ADD
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
