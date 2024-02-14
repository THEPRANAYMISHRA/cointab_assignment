const Navbar = () => {
  const image = "https://i.ibb.co/QJshy3x/cointab-icon.jpg";
  return (
    <nav className="navbar bg-body-tertiary border bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img
            src={image}
            alt="Logo"
            width="30"
            height="30"
            className="d-inline-block align-text-top p-1"
          />
          Cointab SE-ASSIGNMENT
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
