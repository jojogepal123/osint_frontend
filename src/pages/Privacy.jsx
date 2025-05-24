import React from "react";
import Navbar from "../components/Navbar";

const Privacy = () => {
  return (
    <div className="lg:h-screen flex flex-col lg:flex-row justify-center items-center space-y-4 md:px-24 2xl:px-32 relative z-10">
      <Navbar />

      <div className="w-full md:max-w-[80%] lg:max-w-[60%] md:h-[75%] bg-gray-700 bg-opacity-30 backdrop-blur-sm p-8 rounded-md md:rounded-r-md overflow-hidden shadow-2xl ">
        {/* <!-- Tab Contents --> */}

        <div
          id="home"
          className="w-full h-full flex flex-col justify-center items-start tab-content divide-y animate-slide-up"
        >
          {" "}
          <h1 className="text-2xl md:text-3xl px-2 py-2 text-[#9acc14]">
            Privacy Policy –
            <span className="text-2xl md:text-3xl text-[#9acc14]  font-bold">
              &nbsp;OSINT WORK
            </span>
          </h1>
          <p className="text-md md:text-lg xl:text-xl text-white px-2 py-2 custom-scrollbar text-justify overflow-auto">
            At Osintwork, we value your privacy and are committed to protecting
            any information collected through our platform. This Privacy Policy
            explains how we collect, use, and safeguard data when you use our
            services.
            <br />
            <br />
            1. Information We Collect
            <br />
            Osintwork collects information in the following ways:
            <br />
            Publicly Available Data: We gather data from open
            sources and collection APIs for investigative and research purposes.
            <br />
            User-Provided Information: When you interact with our
            platform, such as contacting us or subscribing to services, we may
            collect basic details like your email or name.
            <br />
            Usage Data: We collect non-personal information such as
            IP addresses, browser type, and device details to improve our
            platform’s performance and security.
            <br />
            <br />
            2. How We Use Your Information
            <br />
            We use the collected information to:
            <br />
            Provide OSINT-based investigative services to law
            enforcement, investigators, and journalists.
            <br />
            Enhance our platform's functionality and security.
            <br />
            Improve user experience by analyzing trends and usage
            patterns.
            <br />
            Ensure compliance with legal and ethical standards.
            <br />
            <br />
            3. Data Protection & Security
            <br />
            We implement industry-standard security measures to protect data
            from unauthorized access, misuse, or disclosure. While we strive to
            safeguard information, we cannot guarantee complete security due to
            the nature of the internet.
            <br />
            <br />
            4. Data Sharing & Third-Party Access
            <br />
            We do not sell or trade personal information.
            <br />
            Certain publicly available data may be analyzed using
            third-party services for enhanced intelligence gathering.
            <br />
            We comply with legal requests if required by law
            enforcement or regulatory authorities.
            <br />
            <br />
            5. Your Rights & Choices
            <br />
            Depending on your location, you may have rights regarding your data,
            including:
            <br />
            The right to access, correct, or delete personal data
            we hold.
            <br />
            The right to opt out of certain data processing
            activities.
            <br />
            The right to request details about how your data is
            used.
            <br />
            <br />
            6. Compliance & Legal Considerations
            <br />
            Osintwork operates within the framework of legal and ethical
            intelligence gathering. We do not engage in unauthorized data
            collection or violate privacy laws. If contact us immediately.
            <br />
            <br />
            7. Changes to This Privacy Policy
            <br />
            We may update this Privacy Policy as needed. Any changes will be
            posted on this page with a revised "Last Updated" date. We encourage
            users to review this policy users to review this policy
            periodically.
            <br />
            <br />
            8. Contact Us
            <br />
            For any privacy-related inquiries, please reach out to:
            <br />
            <br />
            📧 <span className="text-[#9acc14]">info@osintwork.com</span> 🌐
            <span className="text-[#9acc14]">osintwork.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
