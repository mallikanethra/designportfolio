// Centralized Assets Directory for all static portfolio images, videos, banners, logos, and default links.

export function getFullPreviewUrl(url: string, maxWidth = 1000): string {
  if (!url) return "";
  if (url.includes("cloudinary.com") && url.includes("/upload/")) {
    const clean = url.replace(/\/upload\/c_[^/]+\//, "/upload/").replace(/\/upload\/f_auto[^/]*\//, "/upload/");
    return clean.replace("/upload/", `/upload/c_fit,w_${maxWidth},f_auto,q_auto/`);
  }
  return url;
}

export function getCircleThumbnailUrl(url: string, size = 240): string {
  if (!url) return "";
  if (url.includes("cloudinary.com") && url.includes("/upload/")) {
    const clean = url.replace(/\/upload\/c_[^/]+\//, "/upload/").replace(/\/upload\/f_auto[^/]*\//, "/upload/");
    return clean.replace("/upload/", `/upload/c_fill,w_${size},h_${size},f_auto,q_auto/`);
  }
  return url;
}

export function getOptimizedImageUrl(url: string, width = 240, height = 240): string {
  return getCircleThumbnailUrl(url, width);
}

export interface MetroStationAsset {
  id: string;
  name: string;
  thumbnail: string;
  link: string;
  lineId: "product" | "furniture" | "transport" | "experience" | "visual";
  cx: number;
  cy: number;
}

export const METRO_STATIONS_DATA: MetroStationAsset[] = [
  // =========================================================================
  // 1. NAVY BLUE: PRODUCT LINE (8 STATIONS)
  // =========================================================================
  {
    id: "p1",
    name: "masaire",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005308/29_kzfdra.png",
    link: "https://www.behance.net/gallery/252124009/masaire",
    lineId: "product",
    cx: 130,
    cy: 220,
  },
  {
    id: "p2",
    name: "electrosync",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005309/36_f77xhe.png",
    link: "https://www.behance.net/gallery/252124105/electrosync",
    lineId: "product",
    cx: 290,
    cy: 290,
  },
  {
    id: "p3",
    name: "luminuos",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005308/40_yddagf.png",
    link: "https://www.behance.net/gallery/252124149/luminous-cmf",
    lineId: "product",
    cx: 460,
    cy: 360,
  },
  {
    id: "p4",
    name: "powertool",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005313/42_vgrb3i.png",
    link: "https://www.behance.net/gallery/252124229/powertool",
    lineId: "product",
    cx: 620,
    cy: 470,
  },
  {
    id: "p5",
    name: "BFG",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005313/45_j8ql3p.png",
    link: "https://www.behance.net/gallery/252125035/bfg",
    lineId: "product",
    cx: 800,
    cy: 470,
  },
  {
    id: "p6",
    name: "Noire",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005310/47_b5bezh.png",
    link: "https://www.behance.net/gallery/252125131/fan-design",
    lineId: "product",
    cx: 970,
    cy: 570,
  },
  {
    id: "p7",
    name: "Sol",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005313/51_ovnce3.png",
    link: "https://www.behance.net/gallery/252125231/Sol",
    lineId: "product",
    cx: 1140,
    cy: 680,
  },
  {
    id: "p8",
    name: "Rainmaker",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005311/54_auu3jf.png",
    link: "https://www.behance.net/gallery/252189125/rainmaker",
    lineId: "product",
    cx: 1290,
    cy: 800,
  },

  // =========================================================================
  // 2. ELECTRIC PURPLE: FURNITURE LINE (6 STATIONS)
  // =========================================================================
  {
    id: "f1",
    name: "enso",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005308/9_jwxlrj.png",
    link: "https://www.behance.net/gallery/252123135/Enso",
    lineId: "furniture",
    cx: 180,
    cy: 780,
  },
  {
    id: "f2",
    name: "kalpavriksha",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005310/16_b0pysp.png",
    link: "https://www.behance.net/gallery/252123343/Kalpavriksha",
    lineId: "furniture",
    cx: 380,
    cy: 670,
  },
  {
    id: "f3",
    name: "paperplane",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005306/18_osv1iq.png",
    link: "https://www.behance.net/gallery/252123521/paperplane",
    lineId: "furniture",
    cx: 580,
    cy: 670,
  },
  {
    id: "f4",
    name: "warp and weft",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005307/20_syl3gb.png",
    link: "https://www.behance.net/gallery/252123659/Warp-and-Weft",
    lineId: "furniture",
    cx: 800,
    cy: 670,
  },
  {
    id: "f5",
    name: "stamp station",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005306/24_stx34s.png",
    link: "https://www.behance.net/gallery/252123731/Stamp-station",
    lineId: "furniture",
    cx: 1030,
    cy: 440,
  },
  {
    id: "f6",
    name: "yogic shelf",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005312/26_gsuqzn.png",
    link: "https://www.behance.net/gallery/252123903/yogic-shelf",
    lineId: "furniture",
    cx: 1240,
    cy: 440,
  },

  // =========================================================================
  // 3. EMERALD GREEN: TRANSPORT LINE (2 STATIONS)
  // =========================================================================
  {
    id: "t1",
    name: "vande bharat",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005327/58_va7egn.png",
    link: "https://www.behance.net/gallery/252125359/vande-bharat-lavatory",
    lineId: "transport",
    cx: 660,
    cy: 90,
  },
  {
    id: "t2",
    name: "calcutta metro",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005332/61_zevrgq.png",
    link: "https://www.behance.net/gallery/252125431/Calcutta-metro-livery",
    lineId: "transport",
    cx: 660,
    cy: 810,
  },

  // =========================================================================
  // 4. TEAL: EXPERIENCE LINE (6 STATIONS)
  // =========================================================================
  {
    id: "e1",
    name: "Blood Battery",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005329/81_e2n9j9.png",
    link: "https://www.behance.net/gallery/252126253/Blood-battery",
    lineId: "experience",
    cx: 120,
    cy: 520,
  },
  {
    id: "e2",
    name: "Terrarium",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005329/90_oorcun.png",
    link: "https://www.behance.net/gallery/252422551/terrarium",
    lineId: "experience",
    cx: 280,
    cy: 520,
  },
  {
    id: "e3",
    name: "Svara sudoku",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005331/83_otk90j.png",
    link: "https://www.behance.net/gallery/252131307/Svara-Sudoku",
    lineId: "experience",
    cx: 440,
    cy: 470,
  },
  {
    id: "e4",
    name: "Yoga Tower",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005331/93_dli0d2.png",
    link: "https://www.behance.net/gallery/252131203/Yoga-Tower",
    lineId: "experience",
    cx: 660,
    cy: 330,
  },
  {
    id: "e5",
    name: "Van De graff",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005332/98_s8oteb.png",
    link: "https://www.behance.net/gallery/252184309/Van-De-Graff",
    lineId: "experience",
    cx: 880,
    cy: 330,
  },
  {
    id: "e6",
    name: "Rename",
    thumbnail: "https://res.cloudinary.com/uirrtsa0/image/upload/c_fill,w_240,h_240,f_auto,q_auto/100_subehp",
    link: "https://www.behance.net/gallery/253162231/Rename",
    lineId: "experience",
    cx: 1180,
    cy: 240,
  },

  // =========================================================================
  // 5. SKY BLUE: VISUAL LINE (5 STATIONS)
  // =========================================================================
  {
    id: "v1",
    name: "museum of vanished things",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005328/77_n1vcej.png",
    link: "https://museum-of-vanished-things-1044192438730.asia-southeast1.run.app/",
    lineId: "visual",
    cx: 240,
    cy: 100,
  },
  {
    id: "v2",
    name: "Parameters for Dignity",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005329/69_f3xwhp.png",
    link: "https://mallikanethra039.wixsite.com/website",
    lineId: "visual",
    cx: 440,
    cy: 100,
  },
  {
    id: "v3",
    name: "Phone toh uthao",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005327/72_rfbv7t.png",
    link: "https://www.behance.net/gallery/252125903/phone-toh-uthao",
    lineId: "visual",
    cx: 660,
    cy: 210,
  },
  {
    id: "v4",
    name: "Kavad Blend",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005332/65_moiank.png",
    link: "https://www.behance.net/gallery/252125605/Kavad-blend",
    lineId: "visual",
    cx: 900,
    cy: 100,
  },
  {
    id: "v5",
    name: "Gk publications",
    thumbnail: "https://res.cloudinary.com/si0bugwt/image/upload/c_fill,w_240,h_240,f_auto,q_auto/v1784005328/74_t30rsl.png",
    link: "https://www.behance.net/gallery/252125957/gk-publications",
    lineId: "visual",
    cx: 1120,
    cy: 100,
  },
];

export const APP_ASSETS = {
  // Main Site Branding
  favicon: "https://res.cloudinary.com/si0bugwt/image/upload/v1784004339/Beige_Blue_Gradient_Motivation_Qoute_Instagram_Post_2_t3fvv6.png",
  websiteLogo: "https://res.cloudinary.com/jbc9dxsc/image/upload/v1784210489/2-removebg-preview_jmrklq.png",

  // Profile Section
  profileImage: "https://res.cloudinary.com/si0bugwt/image/upload/v1784004451/1779881839193_xqxckt.png",
  profileVideoBanner: "https://res.cloudinary.com/si0bugwt/video/upload/v1784004809/download_lo5szd.mp4",

  // Contact Section
  contactVideoBanner: "https://res.cloudinary.com/si0bugwt/video/upload/v1784005174/total_c3mnit.mp4",

  // Resume & Main Portfolio Link
  resumeImage: "https://res.cloudinary.com/si0bugwt/image/upload/v1784006238/mallika_resume2026_wo0x5j.png",
  portfolio26Link: "https://www.behance.net/gallery/252185431/Portfolio26",

  // 16:9 Category Templates
  categoryTemplates: {
    product: "https://res.cloudinary.com/si0bugwt/image/upload/v1784005011/29_sl7rma.png",
    furniture: "https://res.cloudinary.com/si0bugwt/image/upload/v1784005052/9_uiye2u.png",
    transport: "https://res.cloudinary.com/si0bugwt/image/upload/v1784005033/61_cgo9wn.png",
    visual: "https://res.cloudinary.com/si0bugwt/image/upload/v1784005035/69_qodepk.png",
    experience: "https://res.cloudinary.com/si0bugwt/image/upload/v1784005037/90_i0xcdn.png"
  },

  // Metro Stations Central Collection
  metroStations: METRO_STATIONS_DATA,

  // Vertical Carousel Thumbnails
  carouselSlides: {
    product: [
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005308/29_kzfdra.png",
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005309/36_f77xhe.png",
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005308/40_yddagf.png",
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005313/42_vgrb3i.png",
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005313/45_j8ql3p.png",
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005310/47_b5bezh.png",
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005313/51_ovnce3.png",
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005311/54_auu3jf.png"
    ],
    furniture: [
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005308/9_jwxlrj.png",
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005310/16_b0pysp.png",
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005306/18_osv1iq.png",
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005307/20_syl3gb.png",
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005306/24_stx34s.png",
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005312/26_gsuqzn.png"
    ],
    transport: [
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005327/58_va7egn.png",
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005332/61_zevrgq.png"
    ],
    visual: [
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005328/77_n1vcej.png",
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005329/69_f3xwhp.png",
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005327/72_rfbv7t.png",
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005332/65_moiank.png",
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005328/74_t30rsl.png"
    ],
    experience: [
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005329/81_e2n9j9.png",
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005329/90_oorcun.png",
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005331/83_otk90j.png",
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005331/93_dli0d2.png",
      "https://res.cloudinary.com/si0bugwt/image/upload/v1784005332/98_s8oteb.png",
      "https://res.cloudinary.com/uirrtsa0/image/upload/f_auto,q_auto/100_subehp"
    ]
  },

  // Vertical Carousel Click Links
  carouselLinks: {
    product: [
      "https://www.behance.net/gallery/252124009/masaire",
      "https://www.behance.net/gallery/252124105/electrosync",
      "https://www.behance.net/gallery/252124149/luminous-cmf",
      "https://www.behance.net/gallery/252124229/powertool",
      "https://www.behance.net/gallery/252125035/bfg",
      "https://www.behance.net/gallery/252125131/fan-design",
      "https://www.behance.net/gallery/252125231/Sol",
      "https://www.behance.net/gallery/252189125/rainmaker"
    ],
    furniture: [
      "https://www.behance.net/gallery/252123135/Enso",
      "https://www.behance.net/gallery/252123343/Kalpavriksha",
      "https://www.behance.net/gallery/252123521/paperplane",
      "https://www.behance.net/gallery/252123659/Warp-and-Weft",
      "https://www.behance.net/gallery/252123731/Stamp-station",
      "https://www.behance.net/gallery/252123903/yogic-shelf"
    ],
    transport: [
      "https://www.behance.net/gallery/252125359/vande-bharat-lavatory",
      "https://www.behance.net/gallery/252125431/Calcutta-metro-livery"
    ],
    visual: [
      "https://museum-of-vanished-things-1044192438730.asia-southeast1.run.app/",
      "https://mallikanethra039.wixsite.com/website",
      "https://www.behance.net/gallery/252125903/phone-toh-uthao",
      "https://www.behance.net/gallery/252125605/Kavad-blend",
      "https://www.behance.net/gallery/252125957/gk-publications"
    ],
    experience: [
      "https://www.behance.net/gallery/252126253/Blood-battery",
      "https://www.behance.net/gallery/252422551/terrarium",
      "https://www.behance.net/gallery/252131307/Svara-Sudoku",
      "https://www.behance.net/gallery/252131203/Yoga-Tower",
      "https://www.behance.net/gallery/252184309/Van-De-Graff",
      "https://www.behance.net/gallery/253162231/Rename"
    ]
  },

  // Experience Partner Logos and Links (param, wipro, gkp, havells, desmania, kaboom)
  experienceLogos: [
    {
      name: "param",
      logo: "https://res.cloudinary.com/jbc9dxsc/image/upload/v1784178445/param_foundation_wstibb.png",
      url: "https://paramfoundation.org/"
    },
    {
      name: "wipro",
      logo: "https://res.cloudinary.com/jbc9dxsc/image/upload/v1784178443/wipro_tp4f8j.png",
      url: "https://wipropari.com/"
    },
    {
      name: "gkp",
      logo: "https://res.cloudinary.com/jbc9dxsc/image/upload/v1784178443/gkp_ztpaty.png",
      url: "https://gkpublications.com/?srsltid=AfmBOookSXHU1R6Yy6UJa8pkK-MzNuHp1YPigFCTAZiUM08ZPjdUcg6p"
    },
    {
      name: "havells",
      logo: "https://res.cloudinary.com/jbc9dxsc/image/upload/v1784178443/havells_qhkkfy.png",
      url: "https://havells.com/?gad_source=1&gad_campaignid=23973376227&gbraid=0AAAAAC1QLD4SD_uhU8hU518iz8eaRIrxr&gclid=CjwKCAjw1IHTBhAaEiwA4AYNFruY2bzbFsG8QQhyB2yPCNo0z_ZsuidXrawQsK4KqL4TPia4xy2lHRoCDNYQAvD_BwE"
    },
    {
      name: "desmania",
      logo: "https://res.cloudinary.com/jbc9dxsc/image/upload/v1784178393/desmania_ltfpz7.png",
      url: "https://desmania.com/"
    },
    {
      name: "kaboom",
      logo: "https://res.cloudinary.com/jbc9dxsc/image/upload/v1784178444/kaboom_sc_u9uyck.png",
      url: "https://www.kaboomsocialchange.com/"
    }
  ]
};
