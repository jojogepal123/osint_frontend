# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

{zehefResults && (

<div
className={`w-full ${
                      !profile &&
                      Array.isArray(hibpResults) &&
                      hibpResults.length > 0
                        ? "md:w-1/2"
                        : "md:w-full"
                    } dark:bg-gray-800 dark:hover:bg-gray-600 p-4 rounded-lg shadow-md text-white p-4`} >
<div className="flex gap-3 items-center justify-start w-full h-20 rounded-t-lg">
<div className="rounded-xl p-1 bg-[#313544] flex justify-center items-center">
<img
                          src="https://gravatar.com/images/favicon-192x192.png"
                          alt="Skype"
                          className="w-12 h-12"
                        />
</div>
<span className="ml-3 text-lg md:text-xl text-white font-semibold">
Gravatar
</span>
</div>
{zehefResults.filter((item) => item.status === "found")
.length > 0 ? (
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
{zehefResults
.filter(
(item) =>
item.status === "found" &&
item.source !== "Gravatar"
)
.map((item, index) => (
<div
                              key={index}
                              className="border p-4 rounded-lg shadow-md bg-gray-900 bg-opacity-30 backdrop-blur-sm"
                            >
{/_ Source Name _/}
<h3 className="text-lg font-semibold">
{item.source}
</h3>

                              {/* Status */}
                              <p className="text-sm text-green-600">
                                {item.status}
                              </p>

                              {/* Logo (If Available) */}
                              {item.logo && (
                                <img
                                  src={`http://localhost:8000/assets/${item.logo
                                    .split("/")
                                    .pop()}`}
                                  alt={`${item.source} logo`}
                                  className="w-16 h-16 mx-auto my-2"
                                />
                              )}

                              {/* Username (If Available) */}
                              {item.username && (
                                <p className="text-sm font-medium">
                                  Username: {item.username}
                                </p>
                              )}

                              {/* Profile Link (If Available) */}
                              {item.profile_url && (
                                <a
                                  href={item.profile_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 text-sm hover:underline"
                                >
                                  View Profile
                                </a>
                              )}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p>No Zehef data found.</p>
                    )}
                  </div>
                )}
