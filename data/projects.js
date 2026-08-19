export const PROJECT_DISPLAY_FILTERS = [
  "all",
  "learning",
  "community",
  "research",
  "exhibitions",
  "web",
  "moving image"
];

export const PROJECTS = [
  {
    slug: "programming-for-visual-artists",
    title: "PVA",
    year: "2026",
    projectType: "Teaching / Creative Coding / Education",
    role: "Course author, lecturer, material development, and creative coding facilitation",
    categories: [
      "learning",
      "research",
      "web"
    ],
    tags: [
      "Aalto",
      "creative coding",
      "p5.js",
      "Processing",
      "teaching"
    ],
    shortDescription: "Aalto course archive for drawing with code and treating software as studio material.",
    fullDescription: [
      "Programming for Visual Artists is an Aalto University course and public archive for learning code through visual practice, using Processing, JavaScript, and p5.js as studio materials.",
      "The sessions move from coordinates, color, and interaction toward loops, noise, functions, particles, and small systems. The teaching asks artists to observe how a rule becomes an image, how a sketch becomes a method, and how programming can stay close to experimentation.",
      "The site gathers slides, exercises, source sketches, and browser-based examples so students can return to the material during and after the course."
    ],
    links: [
      {
        label: "Course archive",
        url: "https://tiagomartinspinto.github.io/aalto-programming-visual-artists/"
      },
      {
        label: "GitHub repository",
        url: "https://github.com/tiagomartinspinto/aalto-programming-visual-artists"
      }
    ],
    media: [
      {
        type: "image",
        src: "assets/projects/programming-for-visual-artists/site-preview.png",
        thumbnail: "assets/projects/programming-for-visual-artists/site-preview-thumb.jpg",
        alt: "Programming for Visual Artists course website landing page",
        width: 1200,
        height: 630,
        caption: "Current public course archive landing page."
      },
      {
        type: "image",
        src: "assets/projects/programming-for-visual-artists/particles-noise-sketch.png",
        thumbnail: "assets/projects/programming-for-visual-artists/particles-noise-sketch-thumb.jpg",
        alt: "Generative sketch of pale particle trails drifting across a black canvas",
        width: 780,
        height: 780,
        caption: "Particles with Noise, a generative sketch from the course."
      },
      {
        type: "image",
        src: "assets/projects/programming-for-visual-artists/spiral-spins-sketch.png",
        thumbnail: "assets/projects/programming-for-visual-artists/spiral-spins-sketch-thumb.jpg",
        alt: "A red spiral traced on a black canvas using polar coordinates",
        width: 780,
        height: 780,
        caption: "Spiral Spins, exploring polar coordinates."
      }
    ],
    thumbnailPosition: "50% 50%"
  },
  {
    slug: "kuperkeikka",
    title: "Kuperkeikka",
    year: "2025",
    projectType: "Podcast series",
    role: "Podcast concept, facilitation, editing, and youth-centered development",
    categories: [
      "learning",
      "community"
    ],
    tags: [
      "podcast",
      "participatory media",
      "inclusion",
      "education"
    ],
    shortDescription: "Podcast with immigrant-background teenagers on school, belonging, and being heard.",
    fullDescription: [
      "Kuperkeikka is a podcast series made with immigrant and immigrant-background teenagers, asking how schools and communities can listen and respond with more care.",
      "The project brings together public pedagogy, youth work, and participatory media. The podcast is built around the teenagers' own perspectives on school and belonging."
    ],
    links: [
      {
        label: "Listen on Spotify",
        url: "https://open.spotify.com/show/2itv5aRXDMaBTgLUOo389W?si=4d4df1ae65e543bf"
      }
    ],
    media: [
      {
        type: "image",
        src: "assets/projects/kuperkeikka/kuperkeikka-logo.png",
        thumbnail: "assets/projects/kuperkeikka/kuperkeikka-logo-thumb.jpg",
        alt: "Kuperkeikka podcast artwork with silhouetted figures and title",
        width: 1600,
        height: 1600,
        caption: "Podcast artwork for the youth-centered series."
      }
    ]
  },
  {
    slug: "cooler-planet-2024",
    title: "FinnCERES",
    year: "2024-2026",
    projectType: "Exhibition installation",
    role: "Exhibition and spatial design, prop design and fabrication, project coordination, and visual communication",
    categories: [
      "exhibitions",
      "research"
    ],
    tags: [
      "bioeconomy",
      "Helsinki Design Week",
      "materials research",
      "installation"
    ],
    shortDescription: "Exhibition design and fabricated props for FinnCERES bio-based materials research, first shown in 2024 and reused in a 2026 presentation.",
    fullDescription: [
      "Aalto University and VTT presented Bioeconomy 2.0 during Helsinki Design Week 2024 as part of Designs for a Cooler Planet.",
      "I designed the FinnCERES exhibition area, including the wall, spatial layout, props, and display elements, and fabricated part of the installation. The design translated FinnCERES and VTT research on bio-based materials into a physical exhibition environment.",
      "In May 2026, several of the fabricated props, including the SolarSafe mask and pathogen sculptures, were remounted in a new FinnCERES presentation at Marsio, shown alongside the documentary premiere Innovation in Every Fiber."
    ],
    links: [
      {
        label: "Event information",
        url: "https://www.aalto.fi/en/events/bioeconomy-20"
      },
      {
        label: "Innovation in Every Fiber premiere",
        url: "https://www.finnceres.fi/post/premiere-of-innovation-in-every-fiber"
      }
    ],
    media: [
      {
        type: "image",
        src: "assets/projects/cooler-planet-2024/cooler-planet-01.png",
        thumbnail: "assets/projects/cooler-planet-2024/cooler-planet-01-thumb.jpg",
        alt: "Cooler Planet 2024 exhibition view with dark sculptural display",
        width: 645,
        height: 644,
        caption: "The FinnCERES exhibition area, designed for Bioeconomy 2.0."
      },
      {
        type: "image",
        src: "assets/projects/cooler-planet-2024/cooler-planet-04.png",
        thumbnail: "assets/projects/cooler-planet-2024/cooler-planet-04-thumb.jpg",
        alt: "The SolarSafe display at Cooler Planet 2024, with sculptural virus-like props and a masked mannequin head",
        width: 1126,
        height: 1432,
        caption: "The SolarSafe project display, with props illustrating light-activated, self-sterilizing cellulosic materials."
      },
      {
        type: "image",
        src: "assets/projects/cooler-planet-2024/finnceres-2026-01.jpg",
        thumbnail: "assets/projects/cooler-planet-2024/finnceres-2026-01-thumb.jpg",
        alt: "A wall of bio-based material samples and screens at the 2026 FinnCERES presentation, including wood blocks and jars of pulp",
        width: 1600,
        height: 1200,
        caption: "Material samples on display in the FinnCERES presentation at Marsio in 2026."
      },
      {
        type: "image",
        src: "assets/projects/cooler-planet-2024/finnceres-2026-02.jpg",
        thumbnail: "assets/projects/cooler-planet-2024/finnceres-2026-02-thumb.jpg",
        alt: "The SolarSafe masked head and pathogen sculptures mounted on a wall at the 2026 FinnCERES presentation",
        width: 1600,
        height: 1200,
        caption: "SolarSafe props remounted in the FinnCERES presentation at Marsio in 2026."
      }
    ],
    thumbnailPosition: "58% center"
  },
  {
    slug: "sattuma-com",
    title: "Sattuma",
    year: "2024",
    projectType: "Hybrid card game and web tool",
    role: "Full-stack web development, visual design, and interaction design",
    categories: [
      "learning",
      "web"
    ],
    tags: [
      "game interface",
      "creative tools",
      "digital pedagogy",
      "collaboration"
    ],
    shortDescription: "Hybrid card game and web tool for collaborative play, chance, and pedagogy.",
    fullDescription: [
      "Sattuma is a hybrid card game and web tool developed in Taiteet ja digi (2021-2023). The project was coordinated by Uniarts Helsinki with Aalto University and funded by the Finnish Ministry of Education and Culture.",
      "I worked on the project's web development, visual design, and game mechanics, alongside Tomi Slotte Dufva, Mikael Brygger, and Tomi Humalisto. The project moved between artistic process, interface design, and accessible online play as a shared space for making."
    ],
    links: [
      {
        label: "Sattuma",
        url: "https://sattuma.com/"
      },
      {
        label: "GitHub repository",
        url: "https://github.com/tiagomartinspinto/sattumacards"
      },
      {
        label: "Taiteet ja digi",
        url: "https://www.uniarts.fi/projektit/taiteet-ja-digi/"
      }
    ],
    media: [
      {
        type: "image",
        src: "assets/projects/sattuma-com/sattuma-01.png",
        thumbnail: "assets/projects/sattuma-com/sattuma-01-thumb.jpg",
        alt: "Sattuma project cover with handwritten yellow logo on dark background",
        width: 675,
        height: 452,
        caption: "Sattuma project cover artwork."
      },
      {
        type: "image",
        src: "assets/projects/sattuma-com/sattuma-02.png",
        thumbnail: "assets/projects/sattuma-com/sattuma-02-thumb.jpg",
        alt: "Sattuma interface showing illustrated cards and game layout",
        width: 809,
        height: 707,
        caption: "Sattuma web interface mid-session, with two cards revealed."
      },
      {
        type: "image",
        src: "assets/projects/sattuma-com/sattuma-03.png",
        thumbnail: "assets/projects/sattuma-com/sattuma-03-thumb.jpg",
        alt: "The printed Sattuma card deck fanned out beside its box",
        width: 1500,
        height: 974,
        caption: "The printed Sattuma card deck beside its box."
      },
      {
        type: "image",
        src: "assets/projects/sattuma-com/sattuma-04.png",
        thumbnail: "assets/projects/sattuma-com/sattuma-04-thumb.jpg",
        alt: "The illustrated card-back design for the printed Sattuma deck",
        width: 750,
        height: 1107,
        caption: "The card-back design for the printed Sattuma deck."
      }
    ]
  },
  {
    slug: "carried-by-invisible-bodies",
    title: "Carried by Invisible Bodies",
    year: "2022",
    projectType: "Performance documentation",
    role: "Video and sound design, editing, teasers, and video documentation",
    categories: [
      "moving image"
    ],
    tags: [
      "performance",
      "memory",
      "movement",
      "poetry",
      "documentation"
    ],
    shortDescription: "Visual identity and documentation for a performance of memory, body, and sound.",
    fullDescription: [
      "Carried by Invisible Bodies, created by Anne Naukkarinen, explores memory, movement, and materiality through dance, sculpture, poetry, and live harp music by Natalia Castrillón.",
      "The work developed through residencies at Arts Centre BUDA in Kortrijk and Ehkä-production's Contemporary Art Space Kutomo in Turku. It premiered at Titanik, Turku, on 28 and 29 May 2022, and was later shown at MAA-tila, Helsinki, in September 2022.",
      "My video and sound design, editing, teasers, and documentation stayed close to the performance's shifting relation between body, material, space, and sound.",
      "I was also a conversation partner during the work's development, alongside Laura Cemin, Sara Grotenfelt, and Venla Helenius."
    ],
    links: [
      {
        label: "Project page",
        url: "https://www.buda.be/en/residentie/carried-by-invisible-bodies/"
      }
    ],
    media: [
      {
        type: "image",
        src: "assets/projects/carried-by-invisible-bodies/carried-by-invisible-bodies-02.png",
        thumbnail: "assets/projects/carried-by-invisible-bodies/carried-by-invisible-bodies-02-thumb.jpg",
        alt: "Detail from the Carried by Invisible Bodies teaser video, showing a performer's hands in motion",
        width: 1538,
        height: 921,
        caption: "Hands in motion, from the teaser video."
      },
      {
        type: "video",
        src: "assets/projects/carried-by-invisible-bodies/carried-by-invisible-bodies-05.mp4",
        thumbnail: "assets/projects/carried-by-invisible-bodies/carried-by-invisible-bodies-05-poster.jpg",
        alt: "Teaser video for Carried by Invisible Bodies, showing black-and-white movement, body, typography, and sculptural detail",
        width: 1920,
        height: 1080,
        caption: "Teaser for Carried by Invisible Bodies, with harp music by Natalia Castrillón."
      },
      {
        type: "image",
        src: "assets/projects/carried-by-invisible-bodies/carried-by-invisible-bodies-01.png",
        thumbnail: "assets/projects/carried-by-invisible-bodies/carried-by-invisible-bodies-01-thumb.jpg",
        alt: "Carried by Invisible Bodies title image with pale typography on white field",
        width: 1053,
        height: 705,
        caption: "Title card from the teaser."
      },
      {
        type: "image",
        src: "assets/projects/carried-by-invisible-bodies/carried-by-invisible-bodies-04.png",
        thumbnail: "assets/projects/carried-by-invisible-bodies/carried-by-invisible-bodies-04-thumb.jpg",
        alt: "Carried by Invisible Bodies performance teaser frame",
        width: 1538,
        height: 921,
        caption: "A sculptural detail from the performance."
      }
    ],
    thumbnailPosition: "50% 100%"
  },
  {
    slug: "tyohuoneella-swap",
    title: "SWAP / Työhuoneella",
    year: "2020–2022",
    projectType: "Exhibition documentation",
    role: "Video production, editing, and visual documentation",
    categories: [
      "moving image",
      "exhibitions"
    ],
    tags: [
      "exhibition",
      "studio process",
      "collaboration",
      "documentation"
    ],
    shortDescription: "Video documentation across exhibition, studio, and shared process.",
    fullDescription: [
      "SWAP at Gallery Oksasenkatu 11 in Helsinki in 2020 brought together four artists working across performance, poetry, costume, and visual art.",
      "That process continued into Työhuoneella at Seinäjoen Taidehalli, where I produced and edited a video that was screened in 2022. The documentation follows the work across exhibition, performance, and shared process."
    ],
    links: [
      {
        label: "Research portal",
        url: "https://research.aalto.fi/en/publications/ty%C3%B6huoneella-videon%C3%A4yt%C3%B6s/"
      },
      {
        label: "SWAP exhibition",
        url: "https://oksasenkatu11.fi/rea-liina-brunou-pauliina-haasjoki-anne-naukkarinen-piia-rinne-swap-eng"
      }
    ],
    media: [
      {
        type: "image",
        src: "assets/projects/tyohuoneella-swap/tyohuoneella-swap-01.jpg",
        thumbnail: "assets/projects/tyohuoneella-swap/tyohuoneella-swap-01-thumb.jpg",
        alt: "Performers writing and painting text on the walls during SWAP at Gallery Oksasenkatu 11",
        width: 1600,
        height: 1067,
        caption: "Performers during SWAP at Gallery Oksasenkatu 11."
      },
      {
        type: "image",
        src: "assets/projects/tyohuoneella-swap/tyohuoneella-swap-02.jpg",
        thumbnail: "assets/projects/tyohuoneella-swap/tyohuoneella-swap-02-thumb.jpg",
        alt: "Exterior signage for the SWAP exhibition at Galleria Oksasenkatu 11, Helsinki",
        width: 1600,
        height: 1068,
        caption: "The SWAP exhibition space in Helsinki, 2020."
      },
      {
        type: "image",
        src: "assets/projects/tyohuoneella-swap/tyohuoneella-swap-05.jpg",
        thumbnail: "assets/projects/tyohuoneella-swap/tyohuoneella-swap-05-thumb.jpg",
        alt: "A video installation in a second exhibition space during SWAP",
        width: 1600,
        height: 1068,
        caption: "A video installation in the exhibition's second space."
      },
      {
        type: "video",
        src: "assets/projects/tyohuoneella-swap/tyohuoneella-swap-06.mp4",
        thumbnail: "assets/projects/tyohuoneella-swap/tyohuoneella-swap-06-poster.jpg",
        alt: "Video documentation of the SWAP exhibition, Helsinki, 2020",
        width: 1920,
        height: 1080,
        caption: "Video documentation of the SWAP exhibition, Helsinki, 2020."
      }
    ]
  },
  {
    slug: "from-the-dead-air-orgy",
    title: "From the Dead Air Orgy",
    year: "2021",
    projectType: "Distributed live performance broadcast",
    role: "Live video production, technical design, coordination, and live switching",
    categories: [
      "moving image"
    ],
    tags: [
      "livestream",
      "OBS",
      "distributed performance",
      "multicam"
    ],
    shortDescription: "Live video production for distributed performance and remote stages.",
    fullDescription: [
      "From the Dead Air Orgy was a five-night distributed live broadcast performance conceived and directed by Simon Vincenzi for BAD HOUSE Festival, combining multicam live feeds, pre-recorded material, and remote performance spaces.",
      "For the technical production, I built a recording system using cellphone cameras and WiFi across a full building, coordinated multiple stages, and live-mixed the broadcast in OBS."
    ],
    links: [
      {
        label: "Broadcasts",
        url: "https://fromthedeadairorgy.hotglue.me/?broadcasts/"
      }
    ],
    media: [
      {
        type: "image",
        src: "assets/projects/from-the-dead-air-orgy/from-the-dead-air-orgy-01.png",
        thumbnail: "assets/projects/from-the-dead-air-orgy/from-the-dead-air-orgy-01-thumb.jpg",
        alt: "Overhead view of The Lost Survivalist asleep in the reception, surrounded by the broadcast's circle of chairs",
        width: 1441,
        height: 1012,
        caption: "The Lost Survivalist asleep in the reception, surrounded by a circle of chairs."
      },
      {
        type: "image",
        src: "assets/projects/from-the-dead-air-orgy/from-the-dead-air-orgy-02.png",
        thumbnail: "assets/projects/from-the-dead-air-orgy/from-the-dead-air-orgy-02-thumb.jpg",
        alt: "Sybil in the Sauna reciting into a microphone before an orange slash curtain",
        width: 1538,
        height: 1052,
        caption: "Sybil in the Sauna, reciting into a microphone."
      },
      {
        type: "image",
        src: "assets/projects/from-the-dead-air-orgy/from-the-dead-air-orgy-03.png",
        thumbnail: "assets/projects/from-the-dead-air-orgy/from-the-dead-air-orgy-03-thumb.jpg",
        alt: "Overhead view of The Pole Dancer/The Core performing beneath the fixed camera",
        width: 1052,
        height: 554,
        caption: "The Pole Dancer performing an aerial routine."
      },
      {
        type: "image",
        src: "assets/projects/from-the-dead-air-orgy/from-the-dead-air-orgy-04.png",
        thumbnail: "assets/projects/from-the-dead-air-orgy/from-the-dead-air-orgy-04-thumb.jpg",
        alt: "A night-time aerial drone shot of the broadcast venue's exterior",
        width: 1538,
        height: 1052,
        caption: "A night-time drone shot by Aukusti Heinonen, used between sections of the live broadcast."
      }
    ]
  },
  {
    slug: "tulevaisuus-milta-se-nayttaa",
    title: "Tulevaisuus miltä se näyttää",
    year: "2021",
    projectType: "Music video",
    role: "Music video production",
    categories: [
      "community",
      "learning",
      "moving image"
    ],
    tags: [
      "music video",
      "climate",
      "youth",
      "Lasten ja nuorten säätiö"
    ],
    shortDescription: "Music video for a climate-themed song written and performed by school students.",
    fullDescription: [
      "\"Tulevaisuus miltä se näyttää\" is a climate-themed song written and performed by 8th-grade students at Puistopolun peruskoulu in Helsinki as part of Lasten ja nuorten säätiö's Sanoita parempi maailma programme.",
      "I made the music video for the project. The songwriting process was led by artist mentor Rauhatäti (Hanna Yli-Tepsa), with the finished track produced and released through Lasten ja nuorten säätiö."
    ],
    links: [
      {
        label: "Music video",
        url: "https://www.youtube.com/watch?v=Lmf--_xlXz0"
      },
      {
        label: "Listen on Spotify",
        url: "https://open.spotify.com/album/6ZJxScY8vP21warmXmEmIl"
      }
    ],
    media: [
      {
        type: "image",
        src: "assets/projects/tulevaisuus-milta-se-nayttaa/tulevaisuus-milta-se-nayttaa-still-group.jpg",
        thumbnail: "assets/projects/tulevaisuus-milta-se-nayttaa/tulevaisuus-milta-se-nayttaa-still-group-thumb.jpg",
        alt: "The group of 8th-grade performers seated together in the music video, in black and white",
        width: 1600,
        height: 900,
        caption: "Video still with the group of performers."
      },
      {
        type: "image",
        src: "assets/projects/tulevaisuus-milta-se-nayttaa/tulevaisuus-milta-se-nayttaa-still-solo.jpg",
        thumbnail: "assets/projects/tulevaisuus-milta-se-nayttaa/tulevaisuus-milta-se-nayttaa-still-solo-thumb.jpg",
        alt: "A solo performer against a magenta background in the music video",
        width: 1600,
        height: 900,
        caption: "Video still from the colour-block sequence."
      }
    ]
  },
  {
    slug: "chladni-plate-assembly",
    title: "Chladni Particle Assembly",
    year: "2020–2021",
    projectType: "Scientific illustration and video editing",
    role: "3D scientific illustration, figure preparation, and video editing",
    categories: [
      "research",
      "moving image"
    ],
    tags: [
      "scientific illustration",
      "3D rendering",
      "video editing",
      "Aalto"
    ],
    shortDescription: "Scientific illustration and video editing for a Science Advances paper on programmable particle assembly.",
    fullDescription: [
      "Programmable Assembly of Particles on a Chladni Plate is research by Artur Kopitca, Kourosh Latifi, and Quan Zhou at Aalto University, published in Science Advances in 2021. The system uses controlled vibrations to move small particles across a plate and assemble them into predetermined shapes.",
      "I created the 3D schematic illustration and prepared figures for the publication, and edited experimental footage into videos showing the particle-assembly procedure, including particles forming different shapes and spelling \"AALTO.\" My contribution was the visual communication and video editing, not the scientific research itself."
    ],
    links: [
      {
        label: "Science Advances paper",
        url: "https://www.science.org/doi/10.1126/sciadv.abi7716"
      },
      {
        label: "Aalto research page",
        url: "https://research.aalto.fi/en/publications/programmable-assembly-of-particles-on-a-chladni-plate/"
      }
    ],
    media: [
      {
        type: "image",
        src: "assets/projects/chladni-plate-assembly/chladni-01.jpg",
        thumbnail: "assets/projects/chladni-plate-assembly/chladni-01-thumb.jpg",
        alt: "3D scientific illustration of a Chladni plate with particles, motion paths, and an overhead camera",
        width: 1599,
        height: 1600,
        caption: "3D illustration explaining the particle-assembly system."
      },
      {
        type: "video",
        src: "assets/projects/chladni-plate-assembly/chladni-02.mp4",
        thumbnail: "assets/projects/chladni-plate-assembly/chladni-02-poster.jpg",
        alt: "Experimental footage of particles reorganising into a triangle on a vibrating plate",
        width: 1280,
        height: 720,
        caption: "Particles reorganising into a triangle on the plate."
      },
      {
        type: "video",
        src: "assets/projects/chladni-plate-assembly/chladni-03.mp4",
        thumbnail: "assets/projects/chladni-plate-assembly/chladni-03-poster.jpg",
        alt: "Experimental footage of particles forming the letters AALTO on a vibrating plate",
        width: 1280,
        height: 720,
        caption: "Particles spelling the letters AALTO."
      }
    ]
  },
  {
    slug: "body-interrupted",
    title: "Body Interrupted",
    year: "2019",
    projectType: "Theatre performance",
    role: "Set design with Virpi Velin; prop making",
    categories: [
      "community",
      "exhibitions"
    ],
    tags: [
      "theatre",
      "scenography",
      "prop making",
      "Caisa",
      "Helsinki"
    ],
    shortDescription: "Shared set design with Virpi Velin and prop making for a theatre performance at Caisa in Helsinki.",
    fullDescription: [
      "Body Interrupted is a feminist theatre performance by UtoUto, created by Anna Olkinuora and Katia Skylar, exploring expectations around the female body and body image through video, live sound, text, spoken word, and butoh-inspired movement.",
      "For the 2019 production at Kulttuurikeskus Caisa in Helsinki, I shared the set design with Virpi Velin and worked on prop making."
    ],
    links: [
      {
        label: "Performance video",
        url: "https://www.youtube.com/watch?v=WABGmp_dLTU"
      },
      {
        label: "UtoUto",
        url: "https://www.tinfo.fi/fi/Teatterihaku/1132/UtoUto"
      }
    ],
    media: [
      {
        type: "image",
        src: "assets/projects/body-interrupted/body-interrupted-01.jpeg",
        thumbnail: "assets/projects/body-interrupted/body-interrupted-01-thumb.jpg",
        alt: "Empty theatre stage lit in blue, with two open frame structures, suspended pale body-shaped forms, and a chair at centre stage",
        width: 1600,
        height: 1200,
        caption: "The Body Interrupted stage set at Caisa."
      },
      {
        type: "image",
        src: "assets/projects/body-interrupted/body-interrupted-02.jpeg",
        thumbnail: "assets/projects/body-interrupted/body-interrupted-02-thumb.jpg",
        alt: "Two performers standing inside open frame structures on opposite sides of a dark stage, with a cellist at centre beneath suspended body-shaped forms",
        width: 1598,
        height: 1200,
        caption: "A performer stands inside each frame, with a live cellist between them."
      },
      {
        type: "image",
        src: "assets/projects/body-interrupted/body-interrupted-03.jpeg",
        thumbnail: "assets/projects/body-interrupted/body-interrupted-03-thumb.jpg",
        alt: "Two performers on the floor together, with the cellist playing in the background",
        width: 1200,
        height: 1600,
        caption: "A closer, more physical moment between the performers, with the cellist playing on."
      },
      {
        type: "image",
        src: "assets/projects/body-interrupted/body-interrupted-04.jpeg",
        thumbnail: "assets/projects/body-interrupted/body-interrupted-04-thumb.jpg",
        alt: "Wide view of the stage, with three performers and both frame structures",
        width: 1600,
        height: 1200,
        caption: "The performers and the set together, in a wider view of the stage."
      }
    ]
  },
  {
    slug: "off-the-lab",
    title: "Off the Lab",
    year: "2019",
    projectType: "Collaborative performance and installation",
    role: "Co-creation, performance, and prop making",
    categories: [
      "community",
      "exhibitions"
    ],
    tags: [
      "performance",
      "installation",
      "sound",
      "collaboration"
    ],
    shortDescription: "Collaborative performance and installation at EMMA responding to Michael Jackson: On the Wall.",
    fullDescription: [
      "Off the Lab brought together seven artists selected through an open call by G.A.P. and EMMA – Espoo Museum of Modern Art to respond to Michael Jackson: On the Wall. On Espoo Day 2019, the group presented two connected works: the performance In Recognition of Their Desperation and the installation Unlearning MJ.",
      "The group was Natalia Castrillón, Majella Clarke, Tiago Martins Pinto, Anna Olkinuora, Sade Risku, Camila Rosa, and Laura Sariola.",
      "I co-created and performed in both works, and made props for the project. One of them was a hand-cranked record player with a Michael Jackson vinyl, used as a noise-making instrument. The performance ended with a procession through the gallery."
    ],
    links: [
      {
        label: "EMMA project page",
        url: "https://emmamuseum.fi/en/off-the-lab-brought-together-a-diverse-group-of-artists-the-outcome-is-performed-on-espoo-day/"
      },
      {
        label: "Michael Jackson: On the Wall",
        url: "https://emmamuseum.fi/en/exhibitions/michael-jackson-on-the-wall/"
      }
    ],
    media: [
      {
        type: "image",
        src: "assets/projects/off-the-lab/off-the-lab-01.jpeg",
        thumbnail: "assets/projects/off-the-lab/off-the-lab-01-thumb.jpg",
        alt: "Tiago Martins Pinto performing with the hand-cranked record-player box he built, Off the Lab, EMMA, 2019",
        width: 1600,
        height: 1200,
        caption: "Performing with the hand-cranked record-player box I built."
      },
      {
        type: "image",
        src: "assets/projects/off-the-lab/off-the-lab-05.jpeg",
        thumbnail: "assets/projects/off-the-lab/off-the-lab-05-thumb.jpg",
        alt: "The hand-cranked record-player box Tiago Martins Pinto built for Off the Lab, EMMA, 2019, shown with its crank mechanism",
        width: 901,
        height: 1600,
        caption: "The record-player box I built."
      },
      {
        type: "image",
        src: "assets/projects/off-the-lab/off-the-lab-02.jpeg",
        thumbnail: "assets/projects/off-the-lab/off-the-lab-02-thumb.jpg",
        alt: "Unlearning MJ installation at Off the Lab, EMMA, 2019, with Tiago Martins Pinto performing with a tuning fork",
        width: 960,
        height: 540,
        caption: "Unlearning MJ with a tuning-fork performance."
      },
      {
        type: "image",
        src: "assets/projects/off-the-lab/off-the-lab-03.jpeg",
        thumbnail: "assets/projects/off-the-lab/off-the-lab-03-thumb.jpg",
        alt: "One of the white wheeled figures Tiago Martins Pinto made as props for Off the Lab, EMMA, 2019",
        width: 760,
        height: 1024,
        caption: "One of the wheeled figures I made for the performance."
      }
    ],
    thumbnailPosition: "80% 60%"
  },
  {
    slug: "eating-together",
    title: "Eating Together",
    year: "2019",
    projectType: "Research performance",
    role: "Authorship and performance",
    categories: [
      "learning",
      "community",
      "research"
    ],
    tags: [
      "community",
      "cooking",
      "participatory practice",
      "conference"
    ],
    shortDescription: "Community research through cooking, performance, and shared ritual.",
    fullDescription: [
      "Eating Together explored togetherness through cooking as both artistic practice and research method.",
      "Eating Together grew out of \"Visual arts in context,\" a Nordic doctoral course held at the University of Agder in November 2018 and taught by Helene Illeris, Mira Kallio-Tavin (Aalto University), and Anette Göthlund (Konstfack).",
      "Eating Together was my individual contribution, presented the following year at MAKING | INSEA 2019 in Vancouver as part of a six-author collaborative paper."
    ],
    links: [],
    media: [
      {
        type: "image",
        src: "assets/projects/eating-together/eating-together-01.jpeg",
        thumbnail: "assets/projects/eating-together/eating-together-01-thumb.jpg",
        alt: "Conference participants around a table, each holding red string connecting across the room, with a small pot of soup and cooking materials on the table",
        width: 1532,
        height: 1147,
        caption: "Participants connected by a shared red string, with the soup prepared for Eating Together."
      }
    ]
  },
  {
    slug: "flying-duets",
    title: "Flying Duets",
    year: "2017",
    projectType: "Performance and video art project",
    role: "Videography and video editing",
    categories: [
      "community",
      "learning",
      "moving image"
    ],
    tags: [
      "Goethe-Institut",
      "multiculturalism",
      "borders",
      "young people"
    ],
    shortDescription: "Performance and video project exploring contact through paired movement.",
    fullDescription: [
      "Flying Duets was a performance and video art project conceived and directed by Vassia Valkanioti at Schloss Bröllin, Germany, in 2017, supported through START, Create Cultural Change (Robert Bosch Stiftung). The project brought participants from different backgrounds into two-person movement duets, exploring contact and connection through shared movement.",
      "I worked as videographer and video editor, filming and editing a series of short videos from the project, alongside fellow videographer Judith Ferreira."
    ],
    links: [
      {
        label: "Project site",
        url: "https://flyingduets.wordpress.com/"
      }
    ],
    media: [
      {
        type: "image",
        src: "assets/projects/flying-duets/flying-duets-01.jpeg",
        thumbnail: "assets/projects/flying-duets/flying-duets-01-thumb.jpg",
        alt: "Two people on a large wooden A-frame structure at Schloss Brollin, Germany",
        width: 789,
        height: 368,
        caption: "Two performers in a movement duet at Schloss Bröllin, Germany."
      },
      {
        type: "video",
        src: "assets/projects/flying-duets/flying-duets-02.mp4",
        thumbnail: "assets/projects/flying-duets/flying-duets-02-poster.jpg",
        alt: "Two participants moving on a wooden A-frame structure in the grounds of Schloss Bröllin, Germany",
        width: 1280,
        height: 720,
        caption: "Movement and contact between two performers, from one of the Flying Duets videos."
      },
      {
        type: "video",
        src: "assets/projects/flying-duets/flying-duets-03.mp4",
        thumbnail: "assets/projects/flying-duets/flying-duets-03-poster.jpg",
        alt: "Two participants in a field, engaging in a close physical movement and contact exercise",
        width: 1280,
        height: 720,
        caption: "Two participants exploring contact and exchange through movement in Flying Duets."
      }
    ],
    thumbnailPosition: "56% center"
  },
  {
    slug: "bqg",
    title: "BQG",
    year: "2014–2015",
    projectType: "Participatory photography project",
    role: "Art mediation, photography facilitation, and project coordination",
    categories: [
      "learning",
      "community"
    ],
    tags: [
      "Lisbon",
      "photography",
      "community",
      "participatory practice"
    ],
    shortDescription: "Participatory photography with young people in Lisbon.",
    fullDescription: [
      "BQG was a participatory photography project with young people from Bairro Quinta Grande in Lisbon, developed within Projeto Claquete E5G as part of Programa Escolhas. I worked as a mediator, facilitating the photography process while the participants photographed their own neighbourhood.",
      "The young people selected and curated their photographs for the exhibition Quinta Grande a Preto e Branco, presented at Casa dos Mundos in Lisbon in November 2015."
    ],
    links: [],
    media: [
      {
        type: "image",
        src: "assets/projects/bqg/bqg-01.jpg",
        thumbnail: "assets/projects/bqg/bqg-01-thumb.jpg",
        alt: "Black-and-white photograph by a BQG participant showing a boy on a low wall in Bairro Quinta Grande",
        width: 1600,
        height: 1142,
        caption: "A participant's photograph of a boy on a low wall, Bairro Quinta Grande."
      },
      {
        type: "image",
        src: "assets/projects/bqg/bqg-04.jpg",
        thumbnail: "assets/projects/bqg/bqg-04-thumb.jpg",
        alt: "Black-and-white photograph by a BQG participant showing two boys playing marbles on the ground",
        width: 1600,
        height: 1142,
        caption: "A participant's photograph of two boys playing, Bairro Quinta Grande."
      },
      {
        type: "image",
        src: "assets/projects/bqg/bqg-05.jpg",
        thumbnail: "assets/projects/bqg/bqg-05-thumb.jpg",
        alt: "Documentation of a group gathering around a shared meal in Bairro Quinta Grande",
        width: 960,
        height: 640,
        caption: "Exhibition vernissage group photo."
      },
      {
        type: "image",
        src: "assets/projects/bqg/bqg-06.jpg",
        thumbnail: "assets/projects/bqg/bqg-06-thumb.jpg",
        alt: "Young people gathered at the entrance to the Quinta Grande a Preto e Branco exhibition, with a poster of one of the participants' photographs on the wall",
        width: 960,
        height: 640,
        caption: "Arriving at the Quinta Grande a Preto e Branco exhibition."
      }
    ]
  },
  {
    slug: "sagrada-familia",
    title: "Sagrada Família",
    year: "2015",
    projectType: "Community portrait project",
    role: "Concept and portrait photography",
    categories: [
      "community",
      "research"
    ],
    tags: [
      "portraiture",
      "home",
      "community",
      "belonging"
    ],
    shortDescription: "Portrait project about home, trust, and invitation.",
    fullDescription: [
      "Sagrada Família grew from questions of home, privacy, and who gets invited across the threshold into family space. Developed in Bairro da Quinta Grande, Lisbon, the project involved portraits made inside residents' homes.",
      "Diogo P. and Filipa F. helped me build the trust that made these visits possible. The portraits were returned to the families afterward, and the visits were audio-recorded as part of the process."
    ],
    links: [],
    media: [
      {
        type: "image",
        src: "assets/projects/sagrada-familia/sagrada-familia-01.jpeg",
        thumbnail: "assets/projects/sagrada-familia/sagrada-familia-01-thumb.jpg",
        alt: "Eight family members sitting together in their home in Bairro da Quinta Grande, with a vivid pink wall and pale neutral interior",
        width: 1600,
        height: 1143,
        caption: "Eight family members together in their home in Bairro da Quinta Grande, Lisbon."
      },
      {
        type: "image",
        src: "assets/projects/sagrada-familia/sagrada-familia-02.jpg",
        thumbnail: "assets/projects/sagrada-familia/sagrada-familia-02-thumb.jpg",
        alt: "Three family members sitting together with the television on, in their home in Bairro da Quinta Grande",
        width: 750,
        height: 536,
        caption: "Three family members, the television still on, at home in Bairro da Quinta Grande."
      },
      {
        type: "image",
        src: "assets/projects/sagrada-familia/sagrada-familia-03.jpg",
        thumbnail: "assets/projects/sagrada-familia/sagrada-familia-03-thumb.jpg",
        alt: "Four family members and their cat sitting together at home in Bairro da Quinta Grande, with a green wall behind them",
        width: 750,
        height: 536,
        caption: "A family of four with their cat at home in Bairro da Quinta Grande."
      },
      {
        type: "image",
        src: "assets/projects/sagrada-familia/sagrada-familia-04.jpg",
        thumbnail: "assets/projects/sagrada-familia/sagrada-familia-04-thumb.jpg",
        alt: "Three family members sitting together in their living room in Bairro da Quinta Grande",
        width: 750,
        height: 536,
        caption: "Three family members in their living room, Bairro da Quinta Grande."
      }
    ]
  },
  {
    slug: "viagem-de-volta",
    title: "Viagem de Volta",
    year: "2012",
    projectType: "Installation",
    role: "Concept, installation, and electronics",
    categories: [
      "exhibitions"
    ],
    tags: [
      "installation",
      "arduino",
      "migration",
      "Aveiro"
    ],
    shortDescription: "Installation about return migration after Portuguese decolonization, built around a suitcase and fog.",
    fullDescription: [
      "Viagem de Volta reflects on the return of Portuguese emigrants from former African colonies after decolonization, using a real suitcase connected to a family's return from Guinea during that period.",
      "I designed the installation and an Arduino-controlled timer that cycled a fog machine, gradually filling the space with mist around the suitcase. The work was shown at Museu de Aveiro in 2012 as part of the University of Aveiro's Mestrado em Criação Artística Contemporânea."
    ],
    links: [],
    media: [
      {
        type: "image",
        src: "assets/projects/viagem-de-volta/viagem-de-volta-01.jpg",
        thumbnail: "assets/projects/viagem-de-volta/viagem-de-volta-01-thumb.jpg",
        alt: "A suitcase standing alone in a fog-filled room, lit warmly and casting a long shadow across the floor",
        width: 1600,
        height: 1066,
        caption: "The suitcase at the centre of Viagem de Volta, part of the installation at Museu de Aveiro."
      },
      {
        type: "image",
        src: "assets/projects/viagem-de-volta/viagem-de-volta-02.jpg",
        thumbnail: "assets/projects/viagem-de-volta/viagem-de-volta-02-thumb.jpg",
        alt: "The Viagem de Volta installation room without fog, showing the suitcase alone on the floor",
        width: 1600,
        height: 1066,
        caption: "Viagem de Volta before the fog cycle."
      },
      {
        type: "image",
        src: "assets/projects/viagem-de-volta/viagem-de-volta-03.jpg",
        thumbnail: "assets/projects/viagem-de-volta/viagem-de-volta-03-thumb.jpg",
        alt: "Hand-drawn circuit diagram for an Arduino-controlled relay and fog-machine timer",
        width: 640,
        height: 336,
        caption: "Hand-drawn circuit for the timed fog-machine control."
      }
    ]
  }
];
