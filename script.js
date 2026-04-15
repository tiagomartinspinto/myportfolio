const cargoImage = (hash, file, width = 1200) =>
  `https://freight.cargo.site/w/${width}/i/${hash}/${file}`;

const projects = [
  {
    title: "Kuperkeikka",
    year: "2024-2025",
    tags: ["podcast", "youth work", "art education"],
    thumb: cargoImage("O2636691801978688398635942960389", "kuperkeikka_logo.png"),
    images: [cargoImage("O2636691801978688398635942960389", "kuperkeikka_logo.png")],
    description: [
      "Kuperkeikka is a podcast series that amplifies the voices of immigrant and immigrant-background teenagers, exploring how Finland's education system and society can better support them.",
      "Through open conversations and personal stories, the podcast looks at the challenges they face and the changes needed to make learning more inclusive."
    ],
    links: [{ label: "Listen on Spotify", url: "https://open.spotify.com/show/2itv5aRXDMaBTgLUOo389W?si=4d4df1ae65e543bf" }]
  },
  {
    title: "Cooler Planet 2024",
    year: "2024",
    tags: ["exhibition design", "project management", "visual design"],
    thumb: cargoImage("G2304258516373167433283317161221", "cooler1.png"),
    images: [
      cargoImage("L2304258516391614177357026712837", "cooler2.png"),
      cargoImage("G2304258516373167433283317161221", "cooler1.png"),
      cargoImage("Q2304258516428507665504445816069", "cooler4.png"),
      cargoImage("V2304258516410060921430736264453", "cooler3.png")
    ],
    description: [
      "Aalto University and VTT presented Bioeconomy 2.0 at Helsinki Design Week 2024 as part of the Makers of the Impossible exhibitions at Designs for a Cooler Planet.",
      "The showcase explored innovative bio-based materials in textiles, health technology, and high-performance applications."
    ],
    links: [{ label: "More info", url: "https://www.aalto.fi/en/events/bioeconomy-20" }]
  },
  {
    title: "Sattuma.com",
    year: "2023-2024",
    tags: ["project management", "visual design", "web development"],
    thumb: cargoImage("J2304258516557634874020412677381", "sattuma1.png"),
    images: [
      cargoImage("O2304258516594528362167831780613", "sattuma3.png"),
      cargoImage("E2304258516576081618094122228997", "sattuma2.png"),
      cargoImage("J2304258516557634874020412677381", "sattuma1.png"),
      cargoImage("D2304258516612975106241541332229", "sattuma4.png")
    ],
    description: [
      "Sattuma is a hybrid card game developed as part of the Taiteet ja Digi project, a collaboration between Aalto University and the Academy of Fine Arts, Helsinki.",
      "My role involved full-stack web development and visual design, including the implementation of game mechanics and illustrations."
    ],
    links: [
      { label: "Play Sattuma", url: "https://sattumacards.onrender.com" },
      { label: "GitHub repo", url: "https://github.com/ptiagomp2/sattumacards" }
    ]
  },
  {
    title: "Carried by Invisible Bodies",
    year: "2022",
    tags: ["visual design", "av production"],
    thumb: cargoImage("K2304258516299380456988478954757", "bodies1.png"),
    images: [
      cargoImage("U2304258516354720689209607609605", "bodies4.png"),
      cargoImage("K2304258516299380456988478954757", "bodies1.png"),
      cargoImage("J2304258516317827201062188506373", "bodies2.png"),
      cargoImage("Z2304258516336273945135898057989", "bodies3.png")
    ],
    description: [
      "Carried by Invisible Bodies is a performance exploring memory, movement, and materiality through dance, sculpture, poetry, and live harp music.",
      "As visual designer and editor, I created video documentation and teasers that captured the performance's interplay of body, material, and sound."
    ]
  },
  {
    title: "From the Dead Air Orgy",
    year: "2020-2021",
    tags: ["av production", "project management"],
    thumb: cargoImage("L2304258516483847897725574470917", "fromdeadair2.png"),
    images: [
      cargoImage("W2304258516502294641799284022533", "fromdeadair3.png"),
      cargoImage("B2304258516520741385872993574149", "fromdeadair4.png"),
      cargoImage("A2304258516465401153651864919301", "fromdeadair1.png"),
      cargoImage("L2304258516483847897725574470917", "fromdeadair2.png")
    ],
    description: [
      "Produced and edited live-streamed video episodes, blending multicam feeds with pre-recorded footage using OBS Studio.",
      "I co-coordinated and directed performers on the main stage and remote stages, managing multiple live feeds for a theatrical performance."
    ]
  },
  {
    title: "Eating Together",
    year: "2018-2019",
    tags: ["art education", "research"],
    thumb: cargoImage("K2304250612349160218362059840773", "66648292_2430254997302289_3071132277858631680_o-edited-1.jpg_3.jpeg"),
    images: [cargoImage("K2304250612349160218362059840773", "66648292_2430254997302289_3071132277858631680_o-edited-1.jpg_3.jpeg")],
    description: [
      "I explored communal experiences through cooking as a community-based artist and researcher.",
      "At MAKING | INSEA 2019 at the University of British Columbia, I presented collaborative research and performed Eating Together: A Reflection on Togetherness Through Cooking a Soup."
    ]
  },
  {
    title: "Tyohuonella / SWAP",
    year: "2022",
    tags: ["av production", "visual design"],
    thumb: cargoImage("U2305399870607095187726752177413", "tyohuoneella.jpg"),
    images: [cargoImage("U2305399870607095187726752177413", "tyohuoneella.jpg")],
    description: [
      "Produced and edited video for the Tyohuoneella exhibition at Seinajoen Taidehalli, documenting collaborative creative processes across disciplines.",
      "The work was commissioned by Rea-Liina Brunou, Pauliina Haasjoki, Anne Naukkarinen, and Piia Rinne."
    ]
  },
  {
    title: "Flying Duets",
    year: "2017",
    tags: ["art education", "youth work", "research"],
    thumb: cargoImage("G2305407882913490115323077483781", "1714652855529.jpeg"),
    images: [cargoImage("G2305407882913490115323077483781", "1714652855529.jpeg")],
    description: [
      "Under the artistic direction of Vassia Valkanioti and funded by the Robert Bosch Stiftung, I produced conceptual videos for the START - Create Cultural Change program.",
      "The work explored interactions between German and Polish teenagers through themes of borders and multiculturalism."
    ],
    links: [{ label: "Project site", url: "https://flyingduets.wordpress.com/" }]
  },
  {
    title: "BQG",
    year: "2013-2015",
    tags: ["art education", "youth work"],
    thumb: cargoImage("I2304156031003907129957893430533", "semtitulo_2109.jpg_7.jpeg"),
    images: [cargoImage("I2304156031003907129957893430533", "semtitulo_2109.jpg_7.jpeg")],
    description: [
      "BQG a Preto e Branco was the culmination of four months of photography sessions with young people from Bairro Quinta Grande in Lisbon.",
      "Participants reflected on their neighborhood, explored its boundaries, and selected photographs for an exhibition at Casa dos Mundos."
    ],
    links: [{ label: "Projecto Claquete", url: "https://youtu.be/vhMKGt1EqvY?si=f3UkkBLKGSVdAuUY" }]
  },
  {
    title: "Sagrada Familia",
    year: "2013-2015",
    tags: ["youth work", "research"],
    thumb: cargoImage("Q2304251784473725405940679073029", "IMG_2724.jpg_6.jpeg"),
    images: [
      cargoImage("Q2304251784473725405940679073029", "IMG_2724.jpg_6.jpeg"),
      cargoImage("B2305416234787549951764828937477", "IMG_2719.jpg"),
      cargoImage("T2305416234769103207691119385861", "IMG_2707.jpg"),
      cargoImage("G2305416234750656463617409834245", "IMG_2705.jpg")
    ],
    description: [
      "Sagrada Familia is rooted in the concept of home, what it means to feel at home, and who we choose to welcome into our personal spaces.",
      "Over time, residents invited me into their homes for family portraits, which were framed and gifted back to the families."
    ],
    links: [{ label: "More info", url: "https://youtu.be/vhMKGt1EqvY?si=1nF1nbrBvy6TECxa" }]
  }
];

const grid = document.querySelector("#projects");
const workList = document.querySelector("#work-list");
const dialog = document.querySelector("#project-dialog");
const dialogMedia = document.querySelector("#dialog-media");
const dialogTitle = document.querySelector("#dialog-title");
const dialogYear = document.querySelector("#dialog-year");
const dialogTags = document.querySelector("#dialog-tags");
const dialogDescription = document.querySelector("#dialog-description");
const dialogLinks = document.querySelector("#dialog-links");

const renderProjects = () => {
  grid.innerHTML = projects
    .map((project, index) => `
      <button class="project-card" type="button" data-index="${index}" data-tags="${project.tags.join("|")}">
        <img class="project-thumb" src="${project.thumb}" alt="" loading="lazy">
        <span class="project-card-body">
          <span class="project-number">${String(index + 1).padStart(2, "0")}</span>
          <span class="project-title-row">
            <h3>${project.title}</h3>
            <span class="tag-list">${project.tags.join(" / ")}</span>
          </span>
          <span class="project-meta">
            <span>${project.year}</span>
            <span>Open</span>
          </span>
        </span>
      </button>
    `)
    .join("");

  workList.innerHTML = projects
    .map((project, index) => `
      <button class="work-list-item" type="button" data-index="${index}">
        ${project.title}
      </button>
    `)
    .join("");
};

const openProject = (project) => {
  dialogTitle.textContent = project.title;
  dialogYear.textContent = project.year;
  dialogTags.textContent = project.tags.join(" / ");
  dialogDescription.innerHTML = project.description.map((paragraph) => `<p>${paragraph}</p>`).join("");
  dialogMedia.innerHTML = project.images
    .map((image, index) => `<img src="${image}" alt="${project.title} project image ${index + 1}" loading="lazy">`)
    .join("");
  dialogLinks.innerHTML = (project.links || [])
    .map((link) => `<a href="${link.url}" target="_blank" rel="noreferrer">${link.label}</a>`)
    .join("");
  dialog.showModal();
};

renderProjects();

grid.addEventListener("click", (event) => {
  const card = event.target.closest(".project-card");
  if (!card) return;
  openProject(projects[Number(card.dataset.index)]);
});

workList.addEventListener("click", (event) => {
  const item = event.target.closest(".work-list-item");
  if (!item) return;
  openProject(projects[Number(item.dataset.index)]);
});

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll(".filter").forEach((item) => item.classList.toggle("active", item === button));
    document.querySelectorAll(".project-card").forEach((card) => {
      const tags = card.dataset.tags.split("|");
      card.hidden = filter !== "all" && !tags.includes(filter);
    });
  });
});
