import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const Main = () => {
  return (
    <>
      <div className="lg:h-screen flex flex-col lg:flex-row justify-center items-center space-y-4 md:px-24 2xl:px-32 relative shadow-sm z-10">
        <Navbar />
        <div className="w-full md:max-w-[80%] lg:max-w-[60%] md:h-[75%] bg-gray-800 bg-opacity-30 backdrop-blur-sm p-8 rounded-md md:rounded-r-md overflow-hidden">
          <div
            id="home"
            className="w-full h-full flex flex-col justify-center items-start tab-content divide-y animate-slide-up"
          >
            <h2 className="text-2xl text-white md:text-3xl mb-3 px-2">
              WELCOME TO
              <span className="text-2xl md:text-3xl text-lime-300 font-bold">
                &nbsp;{import.meta.env.VITE_APP_NAME}
              </span>
            </h2>
            <div className="px-4 py-8 flex flex-col justify-center items-start h-full">
              <p className="text-lg md:text-2xl xl:text-3xl font-medium text-white">
                Empowering Decision-Makers with Actionable Intelligence
              </p>
              <br />
              <p className="text-md md:text-lg xl:text-xl text-white paragraph text-justify">
                In the digital age, open-source intelligence (OSINT) is an
                essential resource for law enforcement, investigators, and
                journalists to uncover hidden information, track online
                activity, and analyze digital footprints.
                <span className="text-lime-300  font-semibold">
                  &nbsp;{import.meta.env.VITE_APP_NAME}&nbsp;
                </span>
                specializes in collecting and analyzing data from publicly
                available sources and collection APIs, delivering actionable
                intelligence to support investigations, research, and security
                assessments. Whether identifying leaked personal data, tracking
                persons of interest, or mapping online connections,
                <span className="text-lime-300  font-semibold">
                  &nbsp;{import.meta.env.VITE_APP_NAME}&nbsp;
                </span>
                provides the insights needed to navigate complex digital
                landscapes. As cyber threats, misinformation, and data
                vulnerabilities continue to evolve, having access to accurate
                and timely intelligence is critical for making informed
                decisions and strengthening investigative capabilities.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Main;
