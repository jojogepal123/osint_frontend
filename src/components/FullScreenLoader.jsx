import { InfinitySpin } from "react-loader-spinner";

const FullScreenLoader = ({ text }) => {
  return (
    <>
      <div className="fixed inset-0 z-[100] flex flex-col justify-center items-center backdrop-blur-sm bg-black/80">
        <InfinitySpin
          visible={true}
          width="200"
          color="#22d3ee"
          ariaLabel="infinity-spin-loading"
        />
        <span className="text-cyan-400/70 text-xl font-medium mt-4">{text}</span>
      </div>
    </>
  );
};

export default FullScreenLoader;
