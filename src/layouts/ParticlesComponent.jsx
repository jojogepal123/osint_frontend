import React from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useState } from "react";
import { loadSlim } from "@tsparticles/slim";
import backgroundImage from "../assets/background2.png";

const particlesOptions = {
  background: {
    image: `url(${backgroundImage})`,
    position: "50% 50%",
    repeat: "no-repeat",
    size: "cover",
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "grab",
      },
      onClick: {
        enable: false,
        mode: "push",
      },
    },
    modes: {
      grab: {
        distance: 180,
        links: {
          opacity: 0.4,
        },
      },
      push: {
        quantity: 2,
      },
    },
  },
  particles: {
    color: {
      value: "#9acc14",
    },
    links: {
      color: "#9acc14",
      distance: 120,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1,
      random: true,
      outModes: {
        default: "bounce",
      },
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 100,
    },
    opacity: {
      value: 0.7,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 3 },
    },
  },
  detectRetina: true,
};

const ParticlesComponent = React.memo((props) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log("Particles Loaded:", container);
  };

  return (
    <Particles
      id={props.id}
      init={particlesLoaded}
      options={particlesOptions}
    />
  );
});

export default ParticlesComponent;
// import Particles, { initParticlesEngine } from "@tsparticles/react";
// import { useEffect, useMemo, useState } from "react";
// import { loadSlim } from "@tsparticles/slim";
// import backgroundImage from "../assets/background.png";
// const ParticlesComponent = (props) => {
//   const [init, setInit] = useState(false);

//   useEffect(() => {
//     initParticlesEngine(async (engine) => {
//       await loadSlim(engine);
//     }).then(() => {
//       setInit(true);
//     });
//   }, []);

//   const particlesLoaded = (container) => {
//     console.log("Particles Loaded:", container);
//   };

//   const options = useMemo(
//     () => ({
//       // background: {
//       //   image:
//       //     "url('https://raw.githubusercontent.com/JulianLaval/canvas-particle-network/master/img/demo-bg.jpg')",
//       //   position: "50% 50%",
//       //   repeat: "no-repeat",
//       //   size: "cover",
//       // },
//       // background: {
//       //   color: {
//       //     value: "#151b23", // You can change this to any color you want
//       //   },
//       // },
//       background: {
//         image: `url(${backgroundImage})`,
//         position: "50% 50%",
//         repeat: "no-repeat",
//         size: "cover",
//       },
//       fpsLimit: 120,
//       interactivity: {
//         events: {
//           onHover: {
//             enable: true,
//             mode: "grab",
//           },
//           onClick: {
//             enable: true,
//             mode: "push",
//           },
//         },
//         modes: {
//           grab: {
//             distance: 180,
//             links: {
//               opacity: 0.4,
//             },
//           },
//           push: {
//             quantity: 2,
//           },
//         },
//       },
//       particles: {
//         color: {
//           value: "#9acc14",
//         },
//         links: {
//           color: "#9acc14",
//           distance: 120,
//           enable: true,
//           opacity: 0.5,
//           width: 1,
//         },
//         move: {
//           enable: true,
//           speed: 1,
//           random: true,
//           outModes: {
//             default: "bounce",
//           },
//         },
//         number: {
//           density: {
//             enable: true,
//             area: 800,
//           },
//           value: 100,
//         },
//         opacity: {
//           value: 0.7,
//         },
//         shape: {
//           type: "circle",
//         },
//         size: {
//           value: { min: 1, max: 3 },
//         },
//       },
//       detectRetina: true,
//     }),
//     []
//   );

//   return <Particles id={props.id} init={particlesLoaded} options={options} />;
// };

// export default ParticlesComponent;
