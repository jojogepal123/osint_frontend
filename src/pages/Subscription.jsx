import React from "react";
import useAuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import back from "../assets/back.png";
const Subscription = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  return (
    <>
      {user && (
        <div className="px-4 md:px-10 lg:px-20">
          <div id="pricing_plan_box">
            <div className="mx-auto flex flex-col text-white gap-10 pt-20 md:grid md:grid-cols-12 lg:grid lg:grid-cols-12">
              <div className="flex flex-col col-span-12 items-center justify-center">
                <h1 className="text-4xl font-bold z-40">Pricing Plans</h1>
              </div>
              <div className="border border-gray-700   shadow-sm relative col-span-12 flex h-[638px] flex-col justify-between rounded-3xl bg-gray-700 bg-opacity-30 backdrop-blur-lg p-6 md:col-span-6 lg:col-span-4 lg:m-auto lg:w-full">
                <div className="p-6 pt-0 px-0 pb-0">
                  <div className="flex flex-row items-center gap-4 border-b border-b-gray-600 pb-6">
                    <img src="" />
                    <span className="font-display text-4xl font-semibold">
                      Monthly
                    </span>
                  </div>
                  <div className=" flex flex-col gap-9 pt-4">
                    <div className="font-display text-4xl font-semibold">
                      ₹599.00/Month
                    </div>
                    <div className="flex flex-col gap-4 text-sm font-normal">
                      <span>Features</span>
                      <div className="flex flex-row gap-2">
                        <img src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Linear%20/%20Messages,%20Conversation%20/%20Check%20Read'%3e%3cpath%20id='Vector'%20d='M4%2012.9L7.14286%2016.5L15%207.5'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M20.0002%207.5625L11.4286%2016.5625L11.0002%2016'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e" />
                        Single identity monitoring
                      </div>
                      <div className="flex flex-row gap-2">
                        <img src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Linear%20/%20Messages,%20Conversation%20/%20Check%20Read'%3e%3cpath%20id='Vector'%20d='M4%2012.9L7.14286%2016.5L15%207.5'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M20.0002%207.5625L11.4286%2016.5625L11.0002%2016'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e" />
                        Breach score - 1 per week
                      </div>
                      <div className="flex flex-row gap-2">
                        <img src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Linear%20/%20Messages,%20Conversation%20/%20Check%20Read'%3e%3cpath%20id='Vector'%20d='M4%2012.9L7.14286%2016.5L15%207.5'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M20.0002%207.5625L11.4286%2016.5625L11.0002%2016'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e" />
                        Breach remediation actions &amp; tips
                      </div>
                    </div>
                  </div>
                </div>
                <button className="items-center justify-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-700 hover:bg-background hover:text-accent-foreground h-10 px-4 py-2 flex flex-row gap-2.5 rounded-full bg-gray-700 font-semibold">
                  Register Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-right-circle "
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="m10 8 4 4-4 4"></path>
                  </svg>
                </button>
              </div>
              <div className="shadow-sm border border-gray-700 relative col-span-12 flex h-[638px] flex-col justify-between rounded-3xl bg-gray-700 bg-opacity-30 backdrop-blur-lg p-6 md:col-span-6 lg:col-span-4 lg:m-auto lg:w-full">
                <img
                  src="data:image/svg+xml,%3csvg%20width='34'%20height='39'%20viewBox='0%200%2034%2039'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M0.585786%200.585786C0%201.17157%200%202.11438%200%204V33.2987C0%2036.2894%200%2037.7847%200.974929%2038.3667C1.94986%2038.9486%203.26606%2038.2389%205.89846%2036.8195L15.1015%2031.857L15.1016%2031.857C16.0306%2031.356%2016.4951%2031.1056%2017%2031.1056C17.5049%2031.1056%2017.9694%2031.356%2018.8985%2031.857L28.1015%2036.8195C30.7339%2038.2389%2032.0501%2038.9486%2033.0251%2038.3667C34%2037.7847%2034%2036.2894%2034%2033.2987V4C34%202.11438%2034%201.17157%2033.4142%200.585786C32.8284%200%2031.8856%200%2030%200H4C2.11438%200%201.17157%200%200.585786%200.585786ZM10.1157%206.4995C10.085%206.39392%209.89727%206.39455%209.86728%206.50033C9.73033%206.98338%209.47518%207.69774%209.0847%208.09087C8.69422%208.48399%207.98161%208.74396%207.4995%208.88417C7.39392%208.91487%207.39455%209.10264%207.50033%209.13263C7.98338%209.26957%208.69774%209.52472%209.09087%209.9152C9.48399%2010.3057%209.74396%2011.0183%209.88417%2011.5004C9.91487%2011.606%2010.1026%2011.6054%2010.1326%2011.4996C10.2696%2011.0165%2010.5247%2010.3022%2010.9152%209.90904C11.3057%209.51591%2012.0183%209.25594%2012.5004%209.11574C12.606%209.08503%2012.6054%208.89727%2012.4996%208.86728C12.0165%208.73033%2011.3022%208.47518%2010.909%208.0847C10.5159%207.69422%2010.2559%206.98161%2010.1157%206.4995ZM17.5%209C16.6952%209%2016.1568%209.96571%2015.0802%2011.8971L14.8016%2012.3968C14.4957%2012.9456%2014.3427%2013.2201%2014.1042%2013.4011C13.8657%2013.5822%2013.5686%2013.6494%2012.9745%2013.7838L12.4336%2013.9062C10.3429%2014.3793%209.29751%2014.6158%209.04881%2015.4156C8.8001%2016.2153%209.51276%2017.0487%2010.9381%2018.7154L11.3068%2019.1466C11.7119%2019.6203%2011.9144%2019.8571%2012.0055%2020.1501C12.0966%2020.443%2012.066%2020.759%2012.0047%2021.3909L11.949%2021.9662C11.7335%2024.19%2011.6258%2025.3019%2012.2769%2025.7962C12.928%2026.2905%2013.9068%2025.8398%2015.8643%2024.9385L16.3708%2024.7053C16.927%2024.4492%2017.2052%2024.3211%2017.5%2024.3211C17.7948%2024.3211%2018.073%2024.4492%2018.6292%2024.7053L19.1357%2024.9385L19.1357%2024.9385C21.0932%2025.8398%2022.072%2026.2905%2022.7231%2025.7962C23.3742%2025.3019%2023.2665%2024.19%2023.051%2021.9662L22.9953%2021.3909C22.934%2020.759%2022.9034%2020.443%2022.9945%2020.1501C23.0856%2019.8571%2023.2881%2019.6203%2023.6932%2019.1466L24.0619%2018.7154L24.0619%2018.7154C25.4872%2017.0487%2026.1999%2016.2153%2025.9512%2015.4156C25.7025%2014.6158%2024.6571%2014.3793%2022.5664%2013.9062L22.0255%2013.7838C21.4314%2013.6494%2021.1343%2013.5822%2020.8958%2013.4011C20.6573%2013.2201%2020.5043%2012.9456%2020.1984%2012.3968L19.9198%2011.8971C18.8432%209.96571%2018.3048%209%2017.5%209ZM24%207.25C24.4142%207.25%2024.75%207.58579%2024.75%208V8.25H25C25.4142%208.25%2025.75%208.58579%2025.75%209C25.75%209.41421%2025.4142%209.75%2025%209.75H24.75V10C24.75%2010.4142%2024.4142%2010.75%2024%2010.75C23.5858%2010.75%2023.25%2010.4142%2023.25%2010V9.75H23C22.5858%209.75%2022.25%209.41421%2022.25%209C22.25%208.58579%2022.5858%208.25%2023%208.25H23.25V8C23.25%207.58579%2023.5858%207.25%2024%207.25Z'%20fill='url(%23paint0_linear_1175_51175)'/%3e%3cdefs%3e%3clinearGradient%20id='paint0_linear_1175_51175'%20x1='0'%20y1='0'%20x2='38.2657'%20y2='33.7313'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='%233DB8FA'/%3e%3cstop%20offset='1'%20stop-color='%2354E9E2'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e"
                  className=" absolute right-6 top-0 h-8 w-8"
                />
                <div className="p-6 pt-0 px-0 pb-0">
                  <div className="flex flex-row items-center gap-4 border-b border-b-gray-600 pb-6">
                    <img src="" />
                    <span className="font-display text-4xl font-semibold">
                      Half Yearly
                    </span>
                  </div>
                  <div className=" flex flex-col gap-9 pt-4">
                    <div className="font-display text-4xl font-semibold">
                      ₹2499.00/Month
                    </div>
                    <div className="flex flex-col gap-4 text-sm font-normal">
                      <span>Features</span>
                      <div className="flex flex-row gap-2">
                        <img src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Linear%20/%20Messages,%20Conversation%20/%20Check%20Read'%3e%3cpath%20id='Vector'%20d='M4%2012.9L7.14286%2016.5L15%207.5'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M20.0002%207.5625L11.4286%2016.5625L11.0002%2016'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e" />
                        Identity monitoring (up to 7)
                      </div>
                      <div className="flex flex-row gap-2">
                        <img src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Linear%20/%20Messages,%20Conversation%20/%20Check%20Read'%3e%3cpath%20id='Vector'%20d='M4%2012.9L7.14286%2016.5L15%207.5'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M20.0002%207.5625L11.4286%2016.5625L11.0002%2016'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e" />
                        Breach score - unlimited
                      </div>
                      <div className="flex flex-row gap-2">
                        <img src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Linear%20/%20Messages,%20Conversation%20/%20Check%20Read'%3e%3cpath%20id='Vector'%20d='M4%2012.9L7.14286%2016.5L15%207.5'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M20.0002%207.5625L11.4286%2016.5625L11.0002%2016'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e" />
                        Education content
                      </div>
                      <div className="flex flex-row gap-2">
                        <img src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Linear%20/%20Messages,%20Conversation%20/%20Check%20Read'%3e%3cpath%20id='Vector'%20d='M4%2012.9L7.14286%2016.5L15%207.5'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M20.0002%207.5625L11.4286%2016.5625L11.0002%2016'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e" />
                        24/7 monitoring
                      </div>
                      <div className="flex flex-row gap-2">
                        <img src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Linear%20/%20Messages,%20Conversation%20/%20Check%20Read'%3e%3cpath%20id='Vector'%20d='M4%2012.9L7.14286%2016.5L15%207.5'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M20.0002%207.5625L11.4286%2016.5625L11.0002%2016'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e" />
                        Breach notifications - email
                      </div>
                      <div className="flex flex-row gap-2">
                        <img src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Linear%20/%20Messages,%20Conversation%20/%20Check%20Read'%3e%3cpath%20id='Vector'%20d='M4%2012.9L7.14286%2016.5L15%207.5'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M20.0002%207.5625L11.4286%2016.5625L11.0002%2016'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e" />
                        Breach analytics
                      </div>
                      <div className="flex flex-row gap-2">
                        <img src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Linear%20/%20Messages,%20Conversation%20/%20Check%20Read'%3e%3cpath%20id='Vector'%20d='M4%2012.9L7.14286%2016.5L15%207.5'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M20.0002%207.5625L11.4286%2016.5625L11.0002%2016'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e" />
                        Breach remediation actions &amp; tips
                      </div>
                    </div>
                  </div>
                </div>
                <button className="items-center justify-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-700 hover:bg-background hover:text-accent-foreground h-10 px-4 py-2 flex flex-row gap-2.5 rounded-full bg-gray-700 font-semibold">
                  Subscribe Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-right-circle "
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="m10 8 4 4-4 4"></path>
                  </svg>
                </button>
              </div>
              <div className="border border-gray-700 shadow-sm relative col-span-12 flex h-[638px] flex-col justify-between rounded-3xl bg-gray-700 bg-opacity-30 backdrop-blur-lg p-6 md:col-span-6 lg:col-span-4 lg:m-auto lg:w-full">
                <div className="p-6 pt-0 px-0 pb-0">
                  <div className="flex flex-row items-center gap-4 border-b border-b-gray-600 pb-6">
                    <img src="" />
                    <span className="font-display text-4xl font-semibold">
                      Yearly
                    </span>
                  </div>
                  <div className=" flex flex-col gap-9 pt-4">
                    <div className="font-display text-4xl font-semibold">
                      ₹5999.00/Month
                    </div>
                    <div className="flex flex-col gap-4 text-sm font-normal">
                      <span>Features</span>
                      <div className="flex flex-row gap-2">
                        <img src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Linear%20/%20Messages,%20Conversation%20/%20Check%20Read'%3e%3cpath%20id='Vector'%20d='M4%2012.9L7.14286%2016.5L15%207.5'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M20.0002%207.5625L11.4286%2016.5625L11.0002%2016'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e" />
                        Identity monitoring (up to 7)
                      </div>
                      <div className="flex flex-row gap-2">
                        <img src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Linear%20/%20Messages,%20Conversation%20/%20Check%20Read'%3e%3cpath%20id='Vector'%20d='M4%2012.9L7.14286%2016.5L15%207.5'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M20.0002%207.5625L11.4286%2016.5625L11.0002%2016'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e" />
                        Breach score - unlimited
                      </div>
                      <div className="flex flex-row gap-2">
                        <img src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Linear%20/%20Messages,%20Conversation%20/%20Check%20Read'%3e%3cpath%20id='Vector'%20d='M4%2012.9L7.14286%2016.5L15%207.5'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M20.0002%207.5625L11.4286%2016.5625L11.0002%2016'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e" />
                        Education content
                      </div>
                      <div className="flex flex-row gap-2">
                        <img src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Linear%20/%20Messages,%20Conversation%20/%20Check%20Read'%3e%3cpath%20id='Vector'%20d='M4%2012.9L7.14286%2016.5L15%207.5'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M20.0002%207.5625L11.4286%2016.5625L11.0002%2016'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e" />
                        24/7 monitoring
                      </div>
                      <div className="flex flex-row gap-2">
                        <img src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Linear%20/%20Messages,%20Conversation%20/%20Check%20Read'%3e%3cpath%20id='Vector'%20d='M4%2012.9L7.14286%2016.5L15%207.5'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M20.0002%207.5625L11.4286%2016.5625L11.0002%2016'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e" />
                        Breach notifications - email
                      </div>
                      <div className="flex flex-row gap-2">
                        <img src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Linear%20/%20Messages,%20Conversation%20/%20Check%20Read'%3e%3cpath%20id='Vector'%20d='M4%2012.9L7.14286%2016.5L15%207.5'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M20.0002%207.5625L11.4286%2016.5625L11.0002%2016'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e" />
                        Breach analytics
                      </div>
                      <div className="flex flex-row gap-2">
                        <img src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Linear%20/%20Messages,%20Conversation%20/%20Check%20Read'%3e%3cpath%20id='Vector'%20d='M4%2012.9L7.14286%2016.5L15%207.5'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20id='Vector_2'%20d='M20.0002%207.5625L11.4286%2016.5625L11.0002%2016'%20stroke='%2312B870'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3c/svg%3e" />
                        Breach remediation actions &amp; tips
                      </div>
                    </div>
                  </div>
                </div>
                <button className="items-center justify-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-700 hover:bg-background hover:text-accent-foreground h-10 px-4 py-2 flex flex-row gap-2.5 rounded-full bg-gray-700 font-semibold">
                  Subscribe Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-right-circle "
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="m10 8 4 4-4 4"></path>
                  </svg>
                </button>
              </div>
              <button
                type="button"
                className="z-40 px-4 py-2 rounded-full  flex items-center space-x-2  mt-4"
                onClick={() => navigate("/dashboard")}
              >
                <img
                  src={back}
                  alt="Back"
                  className="w-8 h-8 md:w-10 md:h-10"
                />
                <span className="text-xl md:text-2xl font-semibold">
                  Dashboard
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Subscription;
