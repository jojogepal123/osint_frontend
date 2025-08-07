import "../css/Loader.css";

const Loader = () => {
  return (
    <div className="loader-container">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle className="circle inner" cx="50" cy="50" r="25" />
      </svg>
    </div>
  );
};

export default Loader;
