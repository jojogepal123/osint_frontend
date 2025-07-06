import { InfinitySpin } from "react-loader-spinner";

const FullScreenLoader = ({ text }) => {
  return (
    <>
      <div className="min-w-screen min-h-screen fixed inset-0 z-[100] flex flex-col justify-center items-center backdrop-blur-sm bg-black bg-opacity-80 ms-0">
        <span className="text-gray-500 text-2xl font-medium">{text}</span>
        <InfinitySpin
          visible={true}
          width="200"
          color="#abde64"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    </>
  );
};

export default FullScreenLoader;
