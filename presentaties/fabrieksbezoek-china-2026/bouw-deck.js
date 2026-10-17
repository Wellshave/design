// Introductiedeck voor de fabrieksbezoeken in China, Engels + vereenvoudigd Chinees.
//
//   npm install
//   node bouw-deck.js                       bouwt een deck per bezoek uit fabrieken.json
//   node bouw-deck.js GlobalBestWay-Fanke   bouwt alleen die ene
//
// Producten, volumes en reviews per bezoek staan in fabrieken.json. Een bezoek kan meer
// bedrijven tegelijk hebben ("bedrijven"). Hebben de producten een "foto", dan toont het deck
// een productoverzicht met foto's en per product een slide uit "productslides" in plaats van
// het algemene assortiment en het reviewoverzicht.
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const md = require("react-icons/md");
const JSZip = require(require.resolve("jszip", { paths: [require.resolve("pptxgenjs")] }));

const A = (f) => path.join(__dirname, "assets", f);
const OUT = path.join(__dirname, "uitvoer");

const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, "fabrieken.json"), "utf8"));
const FACTORIES = CONFIG.fabrieken.map((f) => ({
  key: f.bestand,
  name: f.naam,
  companies: f.bedrijven || [{ en: f.bedrijf_en, cn: f.bedrijf_cn, contact: f.contact }],
  products: f.producten,
  reviews: f.reviews,
  productSlides: f.productslides,
  standaard: !!f.standaard,
  upgrades: f.upgrades,
  pillars: f.pijlers,
  pillarNotes: f.pijlers_notities,
  visual: f.producten.every((p) => p.foto),
  cover: f.cover || { foto: "cover.jpg", alt: "Wellshave hair clipper with battery display" },
  why: f.waarom || {
    en: "our customers get a 100-day trial and a 2-year warranty, so every weak battery becomes a return and a bad review.",
    cn: "我们为客户提供 100 天试用和 2 年保修，每一个电池问题都会变成退货和差评。",
  },
}));
const nf = (n) => n.toLocaleString("en-US");
const VISIT_EN = CONFIG.bezoek_en;
const VISIT_CN = CONFIG.bezoek_cn;

// ---------- huisstijl (wellshave.com, zie wellshave-merklaag.md) ----------
const HEX = {
  ink: "111111", paper: "FFFFFF", carbon: "191816", sand: "F5F1EA",
  bronze: "B0742A", gold: "F5D18A", sandDeep: "EDE6DA", bronzeDeep: "8C5A1A",
  card: "24221F", muted: "6B655D",
};
const THEME = {
  name: "Wellshave",
  headFontFace: "Montserrat",
  bodyFontFace: "Montserrat",
  colors: {
    dk1: HEX.ink, lt1: HEX.paper, dk2: HEX.carbon, lt2: HEX.sand,
    accent1: HEX.bronze, accent2: HEX.gold, accent3: HEX.sandDeep, accent4: HEX.bronzeDeep,
    accent5: HEX.card, accent6: HEX.muted, hlink: HEX.bronze, folHlink: HEX.bronzeDeep,
  },
};
const CN = "Microsoft YaHei"; // Chinese tekst; waar YaHei ontbreekt valt het systeem terug op PingFang of Noto

const W = 13.333, H = 7.5, M = 0.6, CW = W - 2 * M;

// pptxgenjs schrijft altijd het Office-palet in het thema; zet daar de merkkleuren in.
async function applyTheme(file, theme) {
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const part = "ppt/theme/theme1.xml";
  const slots = ["dk1", "lt1", "dk2", "lt2", "accent1", "accent2", "accent3", "accent4", "accent5", "accent6", "hlink", "folHlink"];
  const scheme = `<a:clrScheme name="${theme.name}">` + slots.map((k) => `<a:${k}><a:srgbClr val="${theme.colors[k]}"/></a:${k}>`).join("") + "</a:clrScheme>";
  const xml = (await zip.file(part).async("string"))
    .replace(/<a:clrScheme\b[\s\S]*?<\/a:clrScheme>/, () => scheme)
    .replace(/(<a:(?:theme|fontScheme)\b[^>]*?\bname=")[^"]*"/g, (_, head) => `${head}${theme.name}"`);
  zip.file(part, xml);
  fs.writeFileSync(file, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}

async function icon(Comp, hex, px = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + hex, size: px }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

async function build(f) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = `Wellshave · Factory visit · ${f.name}`;
  pres.author = "Wellshave";
  pres.company = "Wellshave BV";
  const C = pres.SchemeColor;

  // ---------- layouts ----------
  const titlePh = (color) => ({ placeholder: { options: { name: "title", type: "title", x: M, y: 0.42, w: CW, h: 0.66, fontSize: 32, bold: true, color, align: "left", valign: "bottom", margin: 0 }, text: "" } });
  const cnPh = (color) => ({ placeholder: { options: { name: "cn", type: "body", x: M, y: 1.1, w: CW, h: 0.48, fontSize: 20, bold: true, color, fontFace: CN, align: "left", valign: "top", margin: 0 }, text: "" } });

  pres.defineSlideMaster({
    title: "Cover",
    background: { color: C.text2 },
    objects: [],
  });
  pres.defineSlideMaster({
    title: "Content Sand",
    background: { color: C.background2 },
    objects: [
      titlePh(C.text1), cnPh(C.accent1),
      { image: { path: A("logo_dark.png"), x: M, y: 6.98, w: 1.5, h: 0.24 } },
    ],
    slideNumber: { x: W - M - 0.6, y: 6.94, w: 0.6, h: 0.3, fontSize: 10, color: C.accent6, align: "right", margin: 0 },
  });
  pres.defineSlideMaster({
    title: "Content Dark",
    background: { color: C.text2 },
    objects: [
      titlePh(C.background1), cnPh(C.accent2),
      { image: { path: A("logo_light.png"), x: M, y: 6.98, w: 1.5, h: 0.24 } },
    ],
    slideNumber: { x: W - M - 0.6, y: 6.94, w: 0.6, h: 0.3, fontSize: 10, color: C.accent3, align: "right", margin: 0 },
  });

  // small helpers
  const card = (s, name, x, y, w, h, fill, line) =>
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: name, x, y, w, h, rectRadius: 0.16, fill: { color: fill }, line: line ? { color: line, width: 0.75 } : { type: "none" } });
  const txt = (s, name, runs, o) => s.addText(runs, { objectName: name, isTextBox: true, margin: 0, valign: "top", ...o });
  const en = (text, o = {}) => ({ text, options: { ...o } });
  const cn = (text, o = {}) => ({ text, options: { fontFace: CN, ...o } });

  const iconCache = {};
  const ic = async (name, hex) => (iconCache[name + hex] ??= await icon(md[name], hex));

  // =====================================================================
  // 1. COVER
  // =====================================================================
  pres.addSection({ title: "Introduction" });
  {
    const s = pres.addSlide({ masterName: "Cover", sectionTitle: "Introduction" });
    s.addImage({ objectName: "Cover photo", path: A(f.cover.foto), x: 7.0, y: 0, w: W - 7.0, h: H, altText: f.cover.alt });
    s.addImage({ objectName: "Logo", path: A("logo_light.png"), x: 0.75, y: 0.75, w: 2.75, h: 0.44, altText: "Wellshave logo" });
    // Elk extra bedrijf schuift de titel omhoog om ruimte te maken voor de naam eronder.
    const up = 0.5 * (f.companies.length - 1);
    txt(s, "Eyebrow", [en("FACTORY VISIT", { bold: true, charSpacing: 4 }), en("   ·   "), cn("工厂拜访", { bold: true, charSpacing: 2 })],
      { x: 0.75, y: 2.05 - up, w: 5.9, h: 0.35, fontSize: 12, color: C.accent2 });
    txt(s, "Title", "Introducing\nWellshave", { x: 0.75, y: 2.5 - up, w: 6.0, h: 1.75, fontSize: 52, bold: true, color: C.background1, lineSpacingMultiple: 0.92 });
    txt(s, "Title CN", [en("Wellshave ", { bold: true }), cn("品牌介绍", { bold: true })], { x: 0.75, y: 4.3 - up, w: 6.0, h: 0.6, fontSize: 30, color: C.accent2 });
    txt(s, "Subtitle", [
      en("Dutch men's grooming brand  ·  Netherlands & Belgium", { breakLine: true }),
      cn("荷兰男士理容品牌  ·  主营荷兰与比利时市场"),
    ], { x: 0.75, y: 5.1 - up, w: 6.0, h: 0.75, fontSize: 14, color: C.accent3, paraSpaceAfter: 4 });
    const guests = f.companies.flatMap((c) => [
      en(c.en, { bold: true, fontSize: 13, color: C.background1, breakLine: true }),
      cn(c.cn, { fontSize: 12, color: C.accent3 }), cn("   ·   " + c.contact, { fontSize: 12, color: C.accent3, breakLine: true }),
    ]);
    txt(s, "Prepared for", [
      en("PREPARED FOR", { bold: true, charSpacing: 3, fontSize: 10, color: C.accent2 }), cn("   ·   拜访对象", { bold: true, fontSize: 10, color: C.accent2, breakLine: true }),
      ...guests,
      en(VISIT_EN, { fontSize: 11, color: C.accent3 }), cn("   ·   " + VISIT_CN, { fontSize: 11, color: C.accent3 }),
    ], { x: 0.75, y: 5.9 - up, w: 6.0, h: 1.15 + up, paraSpaceAfter: 3 });
    s.addNotes(`Opening. Thank ${f.companies.map((c) => c.contact).join(" and ")} (${f.name}) for hosting us. One sentence: who we are and why we came.`);
  }

  // =====================================================================
  // 2. ABOUT WELLSHAVE
  // =====================================================================
  pres.addSection({ title: "About Wellshave" });
  {
    const s = pres.addSlide({ masterName: "Content Sand", sectionTitle: "About Wellshave" });
    s.addText("About Wellshave", { placeholder: "title" });
    s.addText([cn("关于 "), en("Wellshave", { fontFace: "Montserrat" })], { placeholder: "cn" });

    // left: story
    const LX = M, LW = 6.1;
    txt(s, "Story", [
      en("Wellshave is a Dutch men's grooming brand, founded in 2021. We design and sell shavers, trimmers and clippers that give men premium quality at a fair price.", { breakLine: true }),
      cn("Wellshave 是一家荷兰男士理容品牌，成立于 2021 年。我们设计并销售剃须刀、修剪器和理发器，以合理的价格为男士提供高端品质。"),
    ], { x: LX, y: 1.95, w: LW, h: 1.75, fontSize: 15, color: C.text1, paraSpaceAfter: 8, lineSpacingMultiple: 1.1 });

    txt(s, "Feedback head", [en("Driven by customer feedback", { bold: true }), cn("  ·  以客户反馈为驱动", { bold: true, color: C.accent1 })],
      { x: LX, y: 3.85, w: LW, h: 0.35, fontSize: 15, color: C.text1 });
    txt(s, "Feedback", [
      en("Every product upgrade starts with what customers return, miss or want better.", { breakLine: true }),
      cn("每一次产品升级都源于客户反馈：退货原因、缺少的功能或希望改进的地方。"),
    ], { x: LX, y: 4.25, w: LW, h: 1.0, fontSize: 14, color: C.text1, paraSpaceAfter: 6 });

    // promise chips
    const chips = [
      ["MdOutlineEventAvailable", "100-day trial", "100 天试用"],
      ["MdOutlineVerifiedUser", "2-year warranty", "2 年保修"],
      ["MdOutlineLocalShipping", "Next-day delivery", "次日送达"],
    ];
    const chW = (LW - 2 * 0.2) / 3;
    for (let i = 0; i < 3; i++) {
      const x = LX + i * (chW + 0.2), y = 5.5;
      card(s, `Promise ${i + 1}`, x, y, chW, 1.05, HEX.paper);
      s.addImage({ objectName: `Promise icon ${i + 1}`, data: await ic(chips[i][0], HEX.bronze), x: x + 0.18, y: y + 0.2, w: 0.36, h: 0.36 });
      txt(s, `Promise text ${i + 1}`, [en(chips[i][1], { bold: true, breakLine: true }), cn(chips[i][2], { color: C.accent1 })],
        { x: x + 0.18, y: y + 0.6, w: chW - 0.3, h: 0.42, fontSize: 11, color: C.text1 });
    }

    // right: stat grid
    const RX = 7.25, RW = W - M - RX, gap = 0.2, sw = (RW - gap) / 2, sh = 1.38;
    const stats = [
      ["2021", "Founded in Helmond (NL)", "成立于荷兰海尔蒙德"],
      ["NL + BE", "Main markets", "主要市场"],
      ["≈ €2.5M", "bol.com revenue 2026", "bol.com 2026 年营业额"],
      ["≈ €0.6M", "Own webshop 2026", "自营官网 2026 年营业额"],
    ];
    stats.forEach((st, i) => {
      const x = RX + (i % 2) * (sw + gap), y = 1.95 + Math.floor(i / 2) * (sh + gap);
      card(s, `Stat ${i + 1}`, x, y, sw, sh, HEX.paper);
      txt(s, `Stat value ${i + 1}`, st[0], { x: x + 0.25, y: y + 0.2, w: sw - 0.4, h: 0.55, fontSize: 28, bold: true, color: C.text1 });
      txt(s, `Stat label ${i + 1}`, [en(st[1], { breakLine: true }), cn(st[2], { color: C.accent1 })],
        { x: x + 0.25, y: y + 0.8, w: sw - 0.35, h: 0.5, fontSize: 11, color: C.accent6 });
    });
    const ty = 1.95 + 2 * (sh + gap);
    card(s, "Trustpilot", RX, ty, RW, 1.12, HEX.paper);
    txt(s, "Trustpilot value", "4.4 / 5", { x: RX + 0.25, y: ty + 0.22, w: 1.7, h: 0.55, fontSize: 28, bold: true, color: C.text1 });
    txt(s, "Trustpilot label", [en("Trustpilot score, 1,000+ customer reviews", { breakLine: true }), cn("Trustpilot 评分，1000 多条客户评价", { color: C.accent1 })],
      { x: RX + 2.05, y: ty + 0.28, w: RW - 2.25, h: 0.6, fontSize: 11, color: C.accent6 });
    txt(s, "bol note", [en("bol.com is the largest online marketplace in the Netherlands and Belgium.  "), cn("bol.com 是荷兰和比利时最大的电商平台。")],
      { x: RX, y: ty + 1.22, w: RW, h: 0.45, fontSize: 10, color: C.accent6 });
    s.addNotes("Revenue figures are approximate for 2026. Remove the two revenue tiles if you prefer not to share them.");
  }

  // =====================================================================
  // 3. PRODUCT RANGE (niet in decks met productfoto's: die tonen alleen de eigen producten)
  // =====================================================================
  if (!f.visual) {
    const s = pres.addSlide({ masterName: "Content Sand", sectionTitle: "About Wellshave" });
    s.addText("Our product range", { placeholder: "title" });
    s.addText("我们的产品系列", { placeholder: "cn" });
    const items = [
      ["groom-guard-pro", "Body groomers", "身体修剪器", "Groom Guard™ PRO"],
      ["wellshave-scheerapparaat-elite", "Electric shavers", "电动剃须刀", "The Gentleman Shaver™"],
      ["wellshave-5-in-1-scheerapparaat-mannen-deluxe", "Head shavers", "光头剃须刀", "Head Shaver Deluxe"],
      ["6-in-1-baardtrimmer-supreme", "Beard trimmers", "胡须修剪器", "Men Shaper Supreme™ 6-in-1"],
      ["wellshave-tondeuse-elegant", "Hair clippers", "理发器", "Tondeuse Elegant™"],
      ["wellshave-4-in-1-neustrimmer-ultimate", "Nose trimmers", "鼻毛修剪器", "Neustrimmer Ultimate™ 4-in-1"],
    ];
    const gap = 0.3, cw = (CW - 2 * gap) / 3, ch = 2.0, img = 1.6;
    items.forEach((it, i) => {
      const x = M + (i % 3) * (cw + gap), y = 1.92 + Math.floor(i / 3) * (ch + 0.25);
      card(s, `Range card ${i + 1}`, x, y, cw, ch, HEX.paper);
      s.addImage({ objectName: `Range photo ${i + 1}`, path: A(`p_${it[0]}.png`), x: x + 0.2, y: y + 0.2, w: img, h: img, altText: it[3] });
      const tx = x + 0.2 + img + 0.22, tw = cw - img - 0.6;
      txt(s, `Range text ${i + 1}`, [
        en(it[1], { bold: true, fontSize: 14, breakLine: true }),
        cn(it[2], { fontSize: 14, color: C.accent1, breakLine: true }),
        en(" ", { fontSize: 6, breakLine: true }),
        en(it[3], { fontSize: 10, color: C.accent6 }),
      ], { x: tx, y: y + 0.2, w: tw, h: img, valign: "middle", color: C.text1, paraSpaceAfter: 2 });
    });
    txt(s, "Range note", [en("Also: safety razors, replacement blades, accessories and value bundles.   "), cn("另有：安全剃须刀、替换刀片、配件及超值套装。", { color: C.accent1 })],
      { x: M, y: 6.48, w: CW, h: 0.32, fontSize: 12, color: C.text1 });
    s.addNotes("Keep it short. Point at the categories this factory makes for us.");
  }

  // =====================================================================
  // 4. VISIT TEAM
  // =====================================================================
  pres.addSection({ title: "The visit" });
  {
    const s = pres.addSlide({ masterName: "Content Sand", sectionTitle: "The visit" });
    s.addText("Today's visit team", { placeholder: "title" });
    s.addText("今日拜访团队", { placeholder: "cn" });
    const team = [
      ["DG", "Dustin Gibson", "Founder & CEO", "创始人兼首席执行官", "Brand vision, 2027 plans and final decisions", "品牌愿景、2027 年计划与最终决策"],
      ["WG", "Willem de Groot", "Creative Strategist & Operations Manager", "创意策略师兼运营经理", "Customer insights, product presentation and operations", "客户洞察、产品呈现与运营"],
      ["L", "Leo", "Supply Chain Manager, China", "中国供应链经理", "Your local contact for orders, quality and follow-up", "订单、品质与后续跟进的本地联系人"],
    ];
    const gap = 0.3, cw = (CW - 2 * gap) / 3, ch = 4.35, y = 1.95;
    team.forEach((t, i) => {
      const x = M + i * (cw + gap);
      card(s, `Team card ${i + 1}`, x, y, cw, ch, HEX.paper);
      s.addShape(pres.shapes.OVAL, { objectName: `Avatar ${i + 1}`, x: x + 0.35, y: y + 0.35, w: 1.0, h: 1.0, fill: { color: C.accent2 }, line: { type: "none" } });
      txt(s, `Initials ${i + 1}`, t[0], { x: x + 0.35, y: y + 0.35, w: 1.0, h: 1.0, fontSize: 24, bold: true, color: C.text2, align: "center", valign: "middle" });
      txt(s, `Name ${i + 1}`, t[1], { x: x + 0.35, y: y + 1.55, w: cw - 0.7, h: 0.45, fontSize: 20, bold: true, color: C.text1 });
      txt(s, `Role ${i + 1}`, [en(t[2], { bold: true, breakLine: true }), cn(t[3], { color: C.accent1 })],
        { x: x + 0.35, y: y + 2.05, w: cw - 0.7, h: 0.85, fontSize: 13, color: C.text1, paraSpaceAfter: 3 });
      s.addShape(pres.shapes.LINE, { objectName: `Divider ${i + 1}`, x: x + 0.35, y: y + 3.05, w: cw - 0.7, h: 0, line: { color: C.accent3, width: 1 } });
      txt(s, `Visit role ${i + 1}`, [
        en("DURING THE VISIT  ·  ", { fontSize: 9, bold: true, charSpacing: 2, color: C.accent6 }), cn("拜访角色", { fontSize: 9, bold: true, color: C.accent6, breakLine: true }),
        en(t[4], { fontSize: 12, breakLine: true }), cn(t[5], { fontSize: 12, color: C.accent1 }),
      ], { x: x + 0.35, y: y + 3.2, w: cw - 0.6, h: 1.05, color: C.text1, paraSpaceAfter: 3 });
    });
    txt(s, "Team note", [en("One team, in the Netherlands and in China.   "), cn("荷兰与中国，同一个团队。", { color: C.accent1 })],
      { x: M, y: 6.48, w: CW, h: 0.32, fontSize: 12, color: C.text1 });
  }

  // =====================================================================
  // 5. PURPOSE OF THE VISIT
  // =====================================================================
  {
    const s = pres.addSlide({ masterName: "Content Sand", sectionTitle: "The visit" });
    s.addText("Why we are visiting", { placeholder: "title" });
    s.addText("本次拜访目的", { placeholder: "cn" });
    const steps = [
      ["Get to know each other", "相互了解", "We introduce Wellshave, our customers and how we work.", "介绍 Wellshave、我们的客户和工作方式。"],
      ["Review current data", "回顾当前数据", "Sales, reviews and returns of the products we buy from you.", "回顾我们向贵司采购产品的销量、评价和退货情况。"],
      ["Share our 2027 plans", "分享 2027 年计划", "Our growth plans and what they mean for your factory.", "我们的增长计划及其对贵厂的意义。"],
      ["Improve the range together", "共同优化产品", "Better quality, better prices and new models.", "更好的品质、更优的价格和新款产品。"],
    ];
    const gap = 0.24, cw = (CW - 3 * gap) / 4, ch = 3.45, y = 1.95;
    steps.forEach((st, i) => {
      const x = M + i * (cw + gap);
      card(s, `Step card ${i + 1}`, x, y, cw, ch, HEX.paper);
      txt(s, `Step number ${i + 1}`, String(i + 1).padStart(2, "0"), { x: x + 0.28, y: y + 0.28, w: 1.0, h: 0.6, fontSize: 32, bold: true, color: C.accent1 });
      txt(s, `Step title ${i + 1}`, [en(st[0], { bold: true, fontSize: 16, breakLine: true }), cn(st[1], { bold: true, fontSize: 15, color: C.accent1 })],
        { x: x + 0.28, y: y + 1.0, w: cw - 0.5, h: 0.95, color: C.text1, paraSpaceAfter: 3 });
      txt(s, `Step text ${i + 1}`, [en(st[2], { breakLine: true }), cn(st[3], { color: C.accent6 })],
        { x: x + 0.28, y: y + 2.0, w: cw - 0.45, h: 1.35, fontSize: 13, color: C.text1, paraSpaceAfter: 5 });
    });
    const by = y + ch + 0.3;
    card(s, "Outcome box", M, by, CW, 0.82, HEX.sandDeep);
    s.addImage({ objectName: "Outcome icon", data: await ic("MdOutlineFlag", HEX.bronze), x: M + 0.28, y: by + 0.22, w: 0.38, h: 0.38 });
    txt(s, "Outcome", [
      en("A good visit: ", { bold: true }), en("we leave with samples, your recommendations and clear next steps for 2027.", { breakLine: true }),
      cn("成功的拜访：", { bold: true, color: C.accent4 }), cn("我们带着样品、您的建议和清晰的 2027 年下一步计划回去。", { color: C.accent4 }),
    ], { x: M + 0.85, y: by + 0.12, w: CW - 1.1, h: 0.62, fontSize: 13, color: C.text1, paraSpaceAfter: 2 });
  }

  // =====================================================================
  // 6. YOUR PRODUCTS AT WELLSHAVE (data per factory)
  // =====================================================================
  pres.addSection({ title: "Your products" });
  const sold = f.products.reduce((a, p) => a + p.verkocht, 0);
  if (f.visual) {
    // productoverzicht met foto's, drie kolommen
    const s = pres.addSlide({ masterName: "Content Sand", sectionTitle: "Your products" });
    s.addText("Your products at Wellshave", { placeholder: "title" });
    s.addText([cn("贵司产品在 "), en("Wellshave", { fontFace: "Montserrat" }), cn(" 的表现")], { placeholder: "cn" });
    const cols = 3, gx = 0.22, gy = 0.18, top = 1.75, areaH = 4.75, rows = Math.ceil(f.products.length / cols);
    const cw = (CW - (cols - 1) * gx) / cols, ch = (areaH - (rows - 1) * gy) / rows, img = ch - 0.28;
    f.products.forEach((p, i) => {
      const x = M + (i % cols) * (cw + gx), y = top + Math.floor(i / cols) * (ch + gy);
      card(s, `Product card ${i + 1}`, x, y, cw, ch, HEX.paper);
      s.addImage({ objectName: `Product photo ${i + 1}`, path: A(p.foto), x: x + 0.14, y: y + 0.14, w: img, h: img, altText: p.titel });
      const tx = x + 0.14 + img + 0.18;
      txt(s, `Product text ${i + 1}`, [
        en(p.product, { bold: true, fontSize: 12.5, breakLine: true }),
        cn(p.product_cn, { fontSize: 10.5, color: C.accent1, breakLine: true }),
        en(p.model, { fontSize: 9, color: C.accent6, breakLine: true }),
        en(nf(p.verkocht), { bold: true, fontSize: 12 }), en(" sold  ·  ", { fontSize: 10 }),
        en(p.retour.toFixed(1) + "%", { bold: true, fontSize: 12 }), en(" returns", { fontSize: 10, breakLine: true }),
        cn(`销量 ${nf(p.verkocht)}  ·  退货率 ${p.retour.toFixed(1)}%`, { fontSize: 9, color: C.accent6 }),
      ], { x: tx, y: y + 0.1, w: x + cw - tx - 0.1, h: ch - 0.2, valign: "middle", color: C.text1, paraSpaceAfter: 2 });
    });
    txt(s, "Data source", [
      en(`Total ${nf(sold)} units sold on bol.com, 1 January to 15 October 2026. Return rate counts all return reasons. Webshop sales not included. We share our 2027 forecast in the meeting.`, { breakLine: true }),
      cn(`合计 ${nf(sold)} 件。数据来源：bol.com，2026年1月1日至10月15日。退货率包含所有退货原因，不含官网销量。2027年预测将在会议中分享。`),
    ], { x: M, y: top + areaH + 0.08, w: CW, h: 0.34, fontSize: 9, color: C.accent6, paraSpaceAfter: 1 });
    s.addNotes("Only the products we buy from you. Sales are bol.com units (about 80% of our revenue). Next slides go product by product.");
  } else {
    const s = pres.addSlide({ masterName: "Content Sand", sectionTitle: "Your products" });
    s.addText("Your products at Wellshave", { placeholder: "title" });
    s.addText([cn("贵司产品在 "), en("Wellshave", { fontFace: "Montserrat" }), cn(" 的表现")], { placeholder: "cn" });

    const pad = [0.06, 0.15, 0.06, 0.15];
    const head = (e, c, align = "left") => ({ text: [en(e, { bold: true, breakLine: true }), cn(c, { color: C.accent2 })], options: { fill: { color: C.text2 }, color: C.background1, fontSize: 12, valign: "middle", align, margin: pad } });
    const cell = (t, o = {}) => ({ text: t, options: { fill: { color: C.background1 }, color: C.text1, fontSize: 13, valign: "middle", margin: pad, ...o } });
    const tot = { fill: { color: C.accent3 }, bold: true };
    const rows = [[head("Product", "产品"), head("Model", "型号"), head("Sold in 2026 *", "2026 年销量 *", "right"), head("Return rate *", "退货率 *", "right")]];
    f.products.forEach((p) => rows.push([
      cell(p.product, { bold: true }), cell(p.model || "", { color: C.accent6, fontSize: 12 }),
      cell(nf(p.verkocht), { align: "right" }), cell(p.retour.toFixed(1) + "%", { align: "right" }),
    ]));
    rows.push([cell([en("Total  "), cn("合计")], tot), cell("", tot), cell(nf(sold), { ...tot, align: "right" }), cell("", tot)]);
    const rh = f.products.length <= 4 ? 0.56 : 0.48;
    s.addTable(rows, {
      objectName: "Products table", x: M, y: 1.95, w: CW, colW: [5.0, 2.6, 2.3, 2.23], rowH: [0.72, ...rows.slice(1).map(() => rh)],
      border: { type: "solid", pt: 1, color: HEX.sandDeep }, fontFace: "Montserrat",
    });
    const fy = 1.95 + 0.72 + (rows.length - 1) * rh + 0.22;
    txt(s, "Data source", [
      en("* bol.com, 1 January to 15 October 2026. Return rate counts all return reasons. Webshop sales not included. We share our 2027 forecast in the meeting.", { breakLine: true }),
      cn("* 数据来源：bol.com，2026年1月1日至10月15日。退货率包含所有退货原因，不含官网销量。2027年预测将在会议中分享。"),
    ], { x: M, y: fy, w: CW, h: 0.6, fontSize: 10, color: C.accent6, paraSpaceAfter: 3 });
    s.addNotes("Only the products we buy through this partner. Sales are bol.com units (about 80% of our revenue).");
  }

  // =====================================================================
  // 7. PER PRODUCT: foto, cijfers, focuspunt, klachten en onze vraag
  //    Een productslide toont een product breed of twee producten naast elkaar.
  //    Batterijproblemen staan in een donker vlak, zodat ze er altijd uitspringen.
  // =====================================================================
  const FOCUS = {
    batterij: { icon: "MdBatteryAlert", en: "BATTERY", cn: "电池", dark: true },
    issue: { icon: "MdOutlineReportProblem", en: "MAIN ISSUE", cn: "主要问题" },
    retour: { icon: "MdOutlineAssignmentReturn", en: "RETURNS", cn: "退货" },
    kwaliteit: { icon: "MdOutlineBuild", en: "QUALITY", cn: "品质" },
  };
  const PT = 1.75, PH = 4.75; // bovenkant en hoogte van het productvlak

  // categorieën uit het defectenlogboek van de klantenservice
  const DEFECT = {
    accu: ["Battery or charging", "电池或充电"],
    stroom: ["Won't start, cuts out", "无法启动或断电"],
    schakelaar: ["On/off switch faults", "开关故障"],
    kop: ["Head or parts break", "刀头或部件损坏"],
    motor: ["Weak motor, pulls hairs", "动力不足，拉扯毛发"],
    overig: ["Other", "其他"],
  };
  const accuOf = (p) => (p.defecten?.categorieen.find((c) => c.key === "accu") || { aantal: 0 }).aantal;
  const stats3 = (p) => [
    [nf(p.verkocht), "sold in 2026", "2026 年销量"],
    [p.retour.toFixed(1) + "%", "return rate", "退货率"],
    p.defecten ? [String(p.defecten.totaal), "defect reports", "故障报告"] : [String(p.kritisch), "critical reviews", "差评数"],
  ];

  const focusBox = async (s, p, x, y, w, h, wide) => {
    const fc = FOCUS[p.focus.soort], dark = !!fc.dark;
    const head = dark ? C.background1 : C.text1, sub = dark ? C.accent2 : C.accent1, qcn = dark ? C.accent3 : C.accent6;
    card(s, `Focus ${p.key}`, x, y, w, h, dark ? HEX.carbon : HEX.sandDeep);
    const pad = wide ? 0.25 : 0.18, b = wide ? 0.62 : 0.46;
    s.addShape(pres.shapes.OVAL, { objectName: `Focus badge ${p.key}`, x: x + pad, y: y + pad, w: b, h: b, fill: { color: dark ? C.accent2 : C.accent1 }, line: { type: "none" } });
    s.addImage({ objectName: `Focus icon ${p.key}`, data: await ic(fc.icon, dark ? HEX.carbon : HEX.paper), x: x + pad + b * 0.2, y: y + pad + b * 0.2, w: b * 0.6, h: b * 0.6 });
    const tx = x + pad + b + (wide ? 0.25 : 0.18), tw = x + w - tx - pad;
    const eyebrow = [en(fc.en, { bold: true, charSpacing: 2, color: sub }), cn("  ·  " + fc.cn, { bold: true, color: sub, breakLine: true })];
    if (wide) {
      const subline = p.focus.sub_en ? [en(p.focus.sub_en, { fontSize: 10.5, color: qcn }), cn("   ·   " + p.focus.sub_cn, { fontSize: 10, color: qcn })] : [];
      txt(s, `Focus head ${p.key}`, [
        ...eyebrow,
        en(p.focus.en, { bold: true, fontSize: 17, color: head, breakLine: true }),
        cn(p.focus.cn, { bold: true, fontSize: 15, color: sub, breakLine: subline.length > 0 }),
        ...subline,
      ], { x: tx, y: y + pad - 0.03, w: tw, h: 1.0, fontSize: 10, paraSpaceAfter: 2 });
      const qs = p.focus.quotes, qy = y + (subline.length ? 1.32 : 1.12), qg = 0.25, qw = (w - 2 * pad - (qs.length - 1) * qg) / qs.length;
      qs.forEach((q, i) => {
        const qx = x + pad + i * (qw + qg);
        s.addShape(pres.shapes.LINE, { objectName: `Focus quote rule ${p.key} ${i + 1}`, x: qx, y: qy + 0.04, w: 0, h: y + h - qy - 0.24, line: { color: sub, width: 1.5 } });
        txt(s, `Focus quote ${p.key} ${i + 1}`, [
          en("“" + q.en + "”", { italic: true, color: head }), cn(q.cn, { softBreakBefore: true, color: qcn, fontSize: 9.5 }),
        ], { x: qx + 0.13, y: qy, w: qw - 0.13, h: y + h - qy - 0.1, fontSize: 10 });
      });
    } else {
      const q = p.focus.quotes[0];
      txt(s, `Focus text ${p.key}`, [
        ...eyebrow,
        en(p.focus.en, { bold: true, fontSize: 13, color: head, breakLine: true }),
        cn(p.focus.cn, { bold: true, fontSize: 11.5, color: sub, breakLine: true }),
        en("“" + q.en + "”", { italic: true, fontSize: 10, color: head, breakLine: true }),
        cn(q.cn, { fontSize: 9.5, color: qcn }),
      ], { x: tx, y: y + pad - 0.04, w: tw, h: h - 2 * pad + 0.08, fontSize: 9, paraSpaceAfter: 2 });
    }
  };

  // Twee lijstjes naast elkaar: wat de klantenservice binnenkrijgt en wat in de bol.com-reviews staat.
  const twoLists = (s, p, x, y, w, rowH, big) => {
    const cols = [];
    if (p.defecten) cols.push({
      en: "DEFECT REPORTS", cn: "售后故障", n: p.defecten.totaal,
      rows: p.defecten.categorieen.filter((c) => c.key !== "overig").slice(0, 3).map((c) => ({ en: DEFECT[c.key][0], cn: DEFECT[c.key][1], aantal: c.aantal, accu: c.key === "accu" })),
    });
    cols.push({ en: "BOL.COM REVIEWS", cn: "差评", n: p.kritisch, rows: p.klachten.slice(0, 3) });
    const gap = 0.3, cw = (w - gap * (cols.length - 1)) / cols.length, nw = big ? 0.5 : 0.36;
    cols.forEach((c, j) => {
      const cx = x + j * (cw + gap);
      txt(s, `List head ${p.key} ${j + 1}`, [en(c.en, { bold: true, charSpacing: 1.5 }), cn("  ·  " + c.cn, { bold: true }), en(`   ${c.n}`, { bold: true, color: C.text1 })],
        { x: cx, y, w: cw, h: 0.2, fontSize: big ? 9.5 : 8.5, color: C.accent6 });
      c.rows.forEach((r, i) => {
        const ry = y + 0.25 + i * rowH;
        txt(s, `List count ${p.key} ${j + 1} ${i + 1}`, String(r.aantal), { x: cx, y: ry, w: nw, h: rowH - 0.04, fontSize: big ? 16 : 12.5, bold: true, color: r.accu ? C.accent1 : C.text1, valign: "middle" });
        txt(s, `List item ${p.key} ${j + 1} ${i + 1}`, [en(r.en, { bold: true, breakLine: true }), cn(r.cn, { color: C.accent1, fontSize: big ? 10 : 8.5 })],
          { x: cx + nw + 0.05, y: ry, w: cw - nw - 0.05, h: rowH - 0.04, fontSize: big ? 11 : 9.5, color: C.text1, valign: "middle", paraSpaceAfter: 0 });
      });
    });
  };

  // een product over de volle breedte
  const productWide = async (s, p) => {
    const LW = 4.25;
    card(s, "Product photo card", M, PT, LW, PH, HEX.paper);
    const img = 3.2;
    s.addImage({ objectName: "Product photo", path: A(p.foto), x: M + (LW - img) / 2, y: PT + 0.22, w: img, h: img, altText: p.titel });
    txt(s, "Model", [en("Model  ", { color: C.accent6 }), en(p.model, { bold: true }), cn("   型号", { color: C.accent6 })],
      { x: M + 0.2, y: PT + 3.52, w: LW - 0.4, h: 0.25, fontSize: 10.5, color: C.text1, align: "center" });
    const sw = (LW - 0.3) / 3;
    stats3(p).forEach((v, i) => txt(s, `Product stat ${i + 1}`, [
      en(v[0], { bold: true, fontSize: 19, breakLine: true }), en(v[1], { fontSize: 9.5, color: C.accent6, breakLine: true }), cn(v[2], { fontSize: 9.5, color: C.accent1 }),
    ], { x: M + 0.15 + i * sw, y: PT + 3.88, w: sw, h: 0.78, align: "center", color: C.text1, paraSpaceAfter: 1 }));

    const RX = M + LW + 0.3, RW = W - M - RX, fh = 2.25;
    await focusBox(s, p, RX, PT, RW, fh, true);
    twoLists(s, p, RX, PT + fh + 0.14, RW, 0.38, true);

    const ah = 0.85, ay = PT + PH - ah, aw = (RW - 0.5 - 0.4) / 3;
    card(s, "Ask card", RX, ay, RW, ah, HEX.paper);
    txt(s, "Ask head", [en("OUR ASK", { bold: true, charSpacing: 2 }), cn("  ·  我们的期望", { bold: true })], { x: RX + 0.25, y: ay + 0.12, w: RW - 0.5, h: 0.2, fontSize: 9.5, color: C.accent1 });
    p.vragen.forEach((v, i) => txt(s, `Ask ${i + 1}`, [en(v.en, { bold: true, fontSize: 11, breakLine: true }), cn(v.cn, { fontSize: 10, color: C.accent1 })],
      { x: RX + 0.25 + i * (aw + 0.2), y: ay + 0.34, w: aw, h: 0.46, color: C.text1, paraSpaceAfter: 1 }));
  };

  // twee producten naast elkaar
  const productHalf = async (s, p, x, w) => {
    card(s, `Product card ${p.key}`, x, PT, w, PH, HEX.paper);
    const pad = 0.2, img = 1.3;
    s.addImage({ objectName: `Product photo ${p.key}`, path: A(p.foto), x: x + pad, y: PT + 0.16, w: img, h: img, altText: p.titel });
    const tx = x + pad + img + 0.2, tw = x + w - tx - 0.18;
    txt(s, `Product name ${p.key}`, [
      en(p.titel, { bold: true, fontSize: 14.5, breakLine: true }), cn(p.product_cn, { fontSize: 12, color: C.accent1, breakLine: true }),
      en("Model " + p.model, { fontSize: 9.5, color: C.accent6 }),
    ], { x: tx, y: PT + 0.12, w: tw, h: 0.78, color: C.text1, paraSpaceAfter: 1 });
    const sw = tw / 3;
    stats3(p).forEach((v, i) => txt(s, `Product stat ${p.key} ${i + 1}`, [
      en(v[0], { bold: true, fontSize: 15, breakLine: true }), en(v[1], { fontSize: 9, color: C.accent6, breakLine: true }), cn(v[2], { fontSize: 9, color: C.accent1 }),
    ], { x: tx + i * sw, y: PT + 0.92, w: sw, h: 0.6, color: C.text1, paraSpaceAfter: 0 }));

    await focusBox(s, p, x + pad, PT + 1.6, w - 2 * pad, 1.2, false);
    twoLists(s, p, x + pad, PT + 2.87, w - 2 * pad, 0.29, false);

    const ay = PT + PH - 0.66;
    card(s, `Ask card ${p.key}`, x + pad, ay, w - 2 * pad, 0.55, HEX.sand);
    txt(s, `Ask ${p.key}`, [
      en("OUR ASK", { bold: true, charSpacing: 2, fontSize: 8.5, color: C.accent1 }), cn("  ·  我们的期望", { bold: true, fontSize: 8.5, color: C.accent1, breakLine: true }),
      ...p.vragen.flatMap((v, i) => [en("→  " + v.en, { bold: true }), cn("   " + v.cn, { color: C.accent1, fontSize: 9.5, breakLine: i < p.vragen.length - 1 })]),
    ], { x: x + pad + 0.15, y: ay + 0.06, w: w - 2 * pad - 0.3, h: 0.46, fontSize: 10, color: C.text1, paraSpaceAfter: 1 });
  };

  // Overzicht van het defectenlogboek: per product alle meldingen, met het deel over accu en opladen.
  const defectSlide = async () => {
    const ps = f.products.filter((p) => p.defecten).sort((a, b) => accuOf(b) - accuOf(a) || b.defecten.totaal - a.defecten.totaal);
    const tot = ps.reduce((a, p) => a + p.defecten.totaal, 0), acc = ps.reduce((a, p) => a + accuOf(p), 0), repl = ps.reduce((a, p) => a + p.defecten.vervangen, 0);
    const med = ps.filter((p) => accuOf(p) >= 5).map((p) => p.defecten.mediaan_mnd);
    const s = pres.addSlide({ masterName: "Content Sand", sectionTitle: "Your products" });
    s.addText("Customer service: the battery is the #1 defect", { placeholder: "title" });
    s.addText("售后数据：电池是头号故障", { placeholder: "cn" });

    const LW = 7.75, top = 1.85;
    card(s, "Defect chart card", M, top, LW, 4.65, HEX.paper);
    // legenda
    const lg = [[HEX.bronze, "Battery or charging", "电池或充电"], [HEX.sandDeep, "Other defects", "其他故障"]];
    lg.forEach((l, i) => {
      const lx = M + 0.3 + i * 2.9;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: `Legend swatch ${i + 1}`, x: lx, y: top + 0.27, w: 0.22, h: 0.14, rectRadius: 0.04, fill: { color: l[0] }, line: { type: "none" } });
      txt(s, `Legend ${i + 1}`, [en(l[1], { bold: true }), cn("  " + l[2], { color: C.accent6 })], { x: lx + 0.3, y: top + 0.22, w: 2.5, h: 0.24, fontSize: 10, color: C.text1 });
    });
    const rowH = (4.65 - 0.75) / ps.length, LBL = 2.35, bx = M + 0.3 + LBL, bwMax = LW - 0.6 - LBL - 0.95;
    const max = Math.max(...ps.map((p) => p.defecten.totaal));
    ps.forEach((p, i) => {
      const ry = top + 0.62 + i * rowH, bh = Math.min(0.24, rowH * 0.5), by = ry + (rowH - bh) / 2;
      txt(s, `Defect label ${i + 1}`, [en(p.product, { bold: true, breakLine: true }), cn(p.product_cn, { fontSize: 8.5, color: C.accent1 })],
        { x: M + 0.3, y: ry, w: LBL - 0.1, h: rowH, fontSize: 10.5, color: C.text1, valign: "middle", paraSpaceAfter: 0 });
      const wAll = Math.max(0.08, bwMax * p.defecten.totaal / max), wAcc = bwMax * accuOf(p) / max;
      s.addShape(pres.shapes.RECTANGLE, { objectName: `Defect bar all ${i + 1}`, x: bx, y: by, w: wAll, h: bh, fill: { color: C.accent3 }, line: { type: "none" } });
      if (wAcc > 0) s.addShape(pres.shapes.RECTANGLE, { objectName: `Defect bar battery ${i + 1}`, x: bx, y: by, w: wAcc, h: bh, fill: { color: C.accent1 }, line: { type: "none" } });
      txt(s, `Defect count ${i + 1}`, [en(String(accuOf(p)), { bold: true, color: C.accent1 }), en(` / ${p.defecten.totaal}`, { color: C.text1 })],
        { x: bx + wAll + 0.1, y: ry, w: 0.9, h: rowH, fontSize: 11.5, valign: "middle" });
    });

    const RX = M + LW + 0.3, RW = W - M - RX, gap = 0.18, ch = (4.65 - 2 * gap) / 3;
    const tiles = [
      [Math.round(100 * acc / tot) + "%", `${acc} of ${tot} defect reports are about the battery or charging`, `${tot} 起故障报告中有 ${acc} 起与电池或充电有关`],
      [`${Math.floor(Math.min(...med))} to ${Math.round(Math.max(...med))} months`, "median time from purchase to a battery report", "从购买到电池故障的中位时间"],
      [Math.round(100 * repl / tot) + "%", "of reports: we send the customer a new device", "的报告需要为客户寄送新机"],
    ];
    tiles.forEach((t, i) => {
      const y = top + i * (ch + gap);
      card(s, `Defect stat ${i + 1}`, RX, y, RW, ch, i === 0 ? HEX.carbon : HEX.paper);
      txt(s, `Defect stat text ${i + 1}`, [
        en(t[0], { bold: true, fontSize: 26, color: i === 0 ? C.accent2 : C.text1, breakLine: true }),
        en(t[1], { fontSize: 10.5, color: i === 0 ? C.background1 : C.text1, breakLine: true }),
        cn(t[2], { fontSize: 9.5, color: i === 0 ? C.accent3 : C.accent1 }),
      ], { x: RX + 0.25, y: y + 0.12, w: RW - 0.45, h: ch - 0.24, valign: "middle", paraSpaceAfter: 2 });
    });
    txt(s, "Defect source", [
      en("Source: Wellshave customer service defect log, 1 January to 15 October 2026, webshop and bol.com customers. Category taken from the customer's complaint.", { breakLine: true }),
      cn("数据来源：Wellshave 售后故障记录，2026年1月1日至10月15日，含官网和 bol.com 客户。类别依据客户的投诉内容划分。"),
    ], { x: M, y: top + 4.65 + 0.08, w: CW, h: 0.34, fontSize: 9, color: C.accent6, paraSpaceAfter: 1 });
    s.addNotes(`Every product we buy from you has the same main defect: the battery or charging. ${acc} of ${tot} defect reports this year. Most fail well within the 2-year warranty, and nearly every report means we send a new device at our cost.`);
  };

  if (f.productSlides) {
    if (f.products.some((p) => p.defecten)) await defectSlide();
    const byKey = Object.fromEntries(f.products.map((p) => [p.key, p]));
    for (const g of f.productSlides) {
      const s = pres.addSlide({ masterName: "Content Sand", sectionTitle: "Your products" });
      s.addText(g.en, { placeholder: "title" });
      s.addText(g.cn, { placeholder: "cn" });
      const ps = g.producten.map((k) => byKey[k]);
      if (ps.length === 1) await productWide(s, ps[0]);
      else {
        const gap = 0.3, w = (CW - gap) / 2;
        for (let i = 0; i < ps.length; i++) await productHalf(s, ps[i], M + i * (w + gap), w);
      }
      txt(s, "Review source", [
        en("Sources: bol.com sales, returns and 1 to 3 star reviews; Wellshave customer service defect log. All 1 January to 15 October 2026. Quotes translated from Dutch.", { breakLine: true }),
        cn("数据来源：bol.com 销量、退货及 1 至 3 星评价；Wellshave 售后故障记录。时间均为 2026 年 1 月 1 日至 10 月 15 日。引文译自荷兰语。"),
      ], { x: M, y: PT + PH + 0.08, w: CW, h: 0.34, fontSize: 9, color: C.accent6, paraSpaceAfter: 1 });
      s.addNotes(g.notes);
    }
  } else {
    const s = pres.addSlide({ masterName: "Content Sand", sectionTitle: "Your products" });
    s.addText("What our customers tell us", { placeholder: "title" });
    s.addText("客户反馈", { placeholder: "cn" });
    const r = f.reviews, top = 1.8, areaH = 4.65;

    // links: drie kerncijfers
    const LW = 3.5;
    card(s, "Stats card", M, top, LW, areaH, HEX.paper);
    const stats = [
      [nf(sold), "units sold on bol.com in 2026", "2026年bol.com销量"],
      [String(r.kritisch), "critical reviews (1 to 3 stars)", "差评数（1至3星）"],
      [(r.kritisch / sold * 1000).toFixed(1), "critical reviews per 1,000 units", "每千件产品的差评数"],
    ];
    stats.forEach((st, i) => {
      const y = top + 0.32 + i * 1.45;
      txt(s, `Stat value ${i + 1}`, st[0], { x: M + 0.3, y, w: LW - 0.5, h: 0.6, fontSize: 30, bold: true, color: C.text1 });
      txt(s, `Stat label ${i + 1}`, [en(st[1], { breakLine: true }), cn(st[2], { color: C.accent1 })], { x: M + 0.3, y: y + 0.62, w: LW - 0.5, h: 0.5, fontSize: 11, color: C.accent6 });
    });

    // rechts: thema's met balk en een citaat
    const RX = M + LW + 0.4, RW = W - M - RX, n = r.themas.length, rowH = Math.min(1.05, areaH / n);
    const max = Math.max(...r.themas.map((t) => t.aantal));
    r.themas.forEach((t, i) => {
      const y = top + i * rowH;
      txt(s, `Theme ${i + 1}`, [en(t.en, { bold: true }), cn("   " + t.cn, { color: C.accent1, fontSize: 12.5 })], { x: RX, y, w: RW - 0.9, h: 0.28, fontSize: 13.5, color: C.text1 });
      txt(s, `Theme count ${i + 1}`, String(t.aantal), { x: RX + RW - 0.9, y: y - 0.02, w: 0.9, h: 0.32, fontSize: 16, bold: true, color: C.text1, align: "right" });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: `Theme track ${i + 1}`, x: RX, y: y + 0.33, w: RW, h: 0.1, rectRadius: 0.05, fill: { color: C.accent3 }, line: { type: "none" } });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: `Theme bar ${i + 1}`, x: RX, y: y + 0.33, w: Math.max(0.12, RW * t.aantal / max), h: 0.1, rectRadius: 0.05, fill: { color: C.accent1 }, line: { type: "none" } });
      txt(s, `Theme quote ${i + 1}`, [
        en("“" + t.quote_en + "”", { italic: true }), cn(t.quote_cn, { softBreakBefore: true, color: C.accent6 }),
      ], { x: RX, y: y + 0.47, w: RW, h: 0.36, fontSize: 10, color: C.text1 });
    });
    txt(s, "Review source", [
      en("Source: bol.com reviews with 1 to 3 stars on your products, January to October 2026. One review can mention several topics.", { breakLine: true }),
      cn("数据来源：2026年1月至10月bol.com上贵司产品的1至3星评价，一条评价可能涉及多个问题。"),
    ], { x: M, y: top + areaH + 0.1, w: CW, h: 0.36, fontSize: 9, color: C.accent6, paraSpaceAfter: 1 });
    s.addNotes("Themes are tagged by hand from the bol.com review texts. Quotes are translated from Dutch.");
  }

  // =====================================================================
  // 8. THREE PRIORITIES (dark)
  // =====================================================================
  pres.addSection({ title: "Working together" });
  {
    const s = pres.addSlide({ masterName: "Content Dark", sectionTitle: "Working together" });
    s.addText("What we want to improve together", { placeholder: "title" });
    s.addText("我们希望共同改进的方向", { placeholder: "cn" });
    const cols = f.pillars || [
      ["MdBatteryChargingFull", "Better quality", "更好的品质", "Focus: batteries & charging", "重点：电池与充电", [
        ["Longer battery life and lifespan", "续航更长，电池寿命更长"],
        ["Certified adapter with fixed cable", "标配认证的一体式适配器", "So customers always charge correctly", "确保客户始终正确充电"],
        ["Fewer defects and returns", "减少故障和退货"],
      ]],
      ["MdOutlineSell", "Better prices", "更优的价格", "Focus: current range", "重点：现有产品", [
        ["Lower purchase prices", "降低现有产品的采购价格"],
        ["Cost ideas that keep the quality", "在保证品质前提下的降本方案"],
        ["Prices based on 2027 volumes", "基于 2027 年采购量报价"],
      ]],
      ["MdOutlineLightbulb", "New models", "新款产品", "Focus: co-development", "重点：共同开发", [
        ["Develop new models together", "共同开发新款产品"],
        ["Upgrades of our best-sellers", "升级我们的畅销款"],
        ["Your newest technology", "贵司的最新技术"],
      ]],
    ];
    const gap = 0.3, cw = (CW - 2 * gap) / 3, ch = 3.98, y = 1.92;
    for (let i = 0; i < 3; i++) {
      const c = cols[i], x = M + i * (cw + gap);
      card(s, `Priority card ${i + 1}`, x, y, cw, ch, HEX.card);
      s.addShape(pres.shapes.OVAL, { objectName: `Priority badge ${i + 1}`, x: x + 0.3, y: y + 0.3, w: 0.72, h: 0.72, fill: { color: C.accent2 }, line: { type: "none" } });
      s.addImage({ objectName: `Priority icon ${i + 1}`, data: await ic(c[0], HEX.carbon), x: x + 0.46, y: y + 0.46, w: 0.4, h: 0.4 });
      txt(s, `Priority title ${i + 1}`, [en(c[1], { bold: true, fontSize: 20, breakLine: true }), cn(c[2], { bold: true, fontSize: 17, color: C.accent2 })],
        { x: x + 1.2, y: y + 0.26, w: cw - 1.4, h: 0.85, color: C.background1, paraSpaceAfter: 1 });
      txt(s, `Priority focus ${i + 1}`, [en(c[3].toUpperCase(), { bold: true, charSpacing: 1, breakLine: true }), cn(c[4], { bold: true, fontSize: 11 })],
        { x: x + 0.3, y: y + 1.22, w: cw - 0.5, h: 0.5, fontSize: 10, color: C.accent2, paraSpaceAfter: 1 });
      const runs = [];
      // Een punt kan een korte toelichting in goud meekrijgen (b[2] en b[3]).
      c[5].forEach((b, j) => {
        const last = j === c[5].length - 1;
        runs.push(en(b[0], { paraSpaceAfter: 8 }));
        runs.push(cn(b[1], { color: C.accent3, fontSize: 13, softBreakBefore: true, breakLine: !last && !b[2] }));
        if (b[2]) {
          runs.push(en(b[2], { color: C.accent2, fontSize: 11, softBreakBefore: true }));
          runs.push(cn(b[3], { color: C.accent2, fontSize: 11, softBreakBefore: true, breakLine: !last }));
        }
      });
      txt(s, `Priority points ${i + 1}`, runs, { x: x + 0.3, y: y + 1.88, w: cw - 0.5, h: 2.0, fontSize: 14, color: C.background1, paraSpaceAfter: 8 });
    }
    txt(s, "Why it matters", [
      en("Why this matters: ", { bold: true, color: C.accent2 }), en(f.why.en, { breakLine: true }),
      cn("原因：", { bold: true, color: C.accent2 }), cn(f.why.cn, { color: C.accent3 }),
    ], { x: M, y: 6.08, w: CW, h: 0.68, fontSize: 13, color: C.background1, paraSpaceAfter: 3 });
    s.addNotes(f.pillarNotes || "Certified adapter: from now on every device ships with a certified adapter whose cable is fixed to it, so customers always charge with the right adapter for that device. Wrong adapters damage batteries and lead to returns.");
  }

  // =====================================================================
  // 8b. DE WELLSHAVE-STANDAARD: wat voortaan voor elk product geldt
  // =====================================================================
  if (f.standaard) {
    const s = pres.addSlide({ masterName: "Content Sand", sectionTitle: "Working together" });
    s.addText("The Wellshave standard for every product", { placeholder: "title" });
    s.addText("Wellshave 全系产品标准", { placeholder: "cn" });
    const items = [
      ["MdOutlinePower", "The right adapter in every box", "每台配备匹配的适配器",
        "CE and GS certified, EU plug, fixed cable, exactly the current the device needs.", "CE 和 GS 认证，欧标插头，线缆一体，输出电流与设备匹配。"],
      ["MdBatteryChargingFull", "A battery that keeps the promise", "电池达到承诺的续航",
        "Branded grade A cell. The real runtime matches what we advertise. At least 500 cycles.", "品牌 A 级电芯，实际续航与宣传一致，循环寿命至少 500 次。"],
      ["MdOutlineShield", "Safe charging", "安全充电",
        "Protection against overcharge, deep discharge, short circuit and heat. Over-voltage protection on the input.", "防过充、过放、短路和过热保护，充电输入端过压保护。"],
      ["MdUsb", "USB-C on every product", "全系产品采用 USB-C",
        "Charges with any USB-C cable. A silicone cap keeps water out.", "任何 USB-C 线都能充电，硅胶盖防止进水。"],
      ["MdOutlineInventory2", "A complete box, every time", "每一台都包装齐全",
        "Cable, adapter and every attachment checked before sealing. The manual matches the product.", "封箱前检查数据线、适配器和所有配件，说明书与产品一致。"],
      ["MdOutlineFactCheck", "Tested before shipping", "出货前测试",
        "100% charge and run test, battery aging test, and our inspection before every shipment.", "100% 充电与运行测试、电池老化测试，每批出货前由我方验货。"],
    ];
    const cols = 3, gx = 0.25, gy = 0.22, top = 1.8, cw = (CW - 2 * gx) / cols, ch = 1.72;
    for (let i = 0; i < items.length; i++) {
      const it = items[i], x = M + (i % cols) * (cw + gx), y = top + Math.floor(i / cols) * (ch + gy);
      card(s, `Standard card ${i + 1}`, x, y, cw, ch, HEX.paper);
      s.addShape(pres.shapes.OVAL, { objectName: `Standard badge ${i + 1}`, x: x + 0.25, y: y + 0.25, w: 0.56, h: 0.56, fill: { color: C.accent1 }, line: { type: "none" } });
      s.addImage({ objectName: `Standard icon ${i + 1}`, data: await ic(it[0], HEX.paper), x: x + 0.37, y: y + 0.37, w: 0.32, h: 0.32 });
      txt(s, `Standard title ${i + 1}`, [en(it[1], { bold: true, fontSize: 13.5, breakLine: true }), cn(it[2], { bold: true, fontSize: 12, color: C.accent1 })],
        { x: x + 0.95, y: y + 0.2, w: cw - 1.1, h: 0.66, color: C.text1, valign: "middle", paraSpaceAfter: 1 });
      txt(s, `Standard text ${i + 1}`, [en(it[3], { breakLine: true }), cn(it[4], { color: C.accent6, fontSize: 9.5 })],
        { x: x + 0.25, y: y + 0.92, w: cw - 0.45, h: ch - 1.0, fontSize: 10.5, color: C.text1, paraSpaceAfter: 2 });
    }
    const by = top + 2 * ch + gy + 0.2, bh = PT + PH + 0.42 - by;
    card(s, "Documents box", M, by, CW, bh, HEX.sandDeep);
    s.addImage({ objectName: "Documents icon", data: await ic("MdOutlineGavel", HEX.bronze), x: M + 0.25, y: by + 0.2, w: 0.36, h: 0.36 });
    txt(s, "Documents", [
      en("Please share per product: ", { bold: true }), en("CE (LVD and EMC), RoHS, battery IEC 62133-2, UN38.3 and MSDS, adapter certificates. "),
      en("New EU rule from 18 February 2027: ", { bold: true }), en("batteries in new products must be replaceable. Let's design the 2027 models for it.", { breakLine: true }),
      cn("请提供每款产品的 CE（LVD 与 EMC）、RoHS、电池 IEC 62133-2、UN38.3 与 MSDS 报告及适配器认证。欧盟自 2027 年 2 月 18 日起要求新产品电池可更换，2027 年新款请按此设计。", { color: C.accent4 }),
    ], { x: M + 0.8, y: by + 0.12, w: CW - 1.0, h: bh - 0.22, fontSize: 10.5, color: C.text1, paraSpaceAfter: 3, valign: "middle" });
    s.addNotes("USB-C: the port must charge with any USB-C charger and a C-to-C cable (correct CC resistors), otherwise customers think the device is broken. The adapter: every box gets a certified adapter with the cable fixed to it, matched to the device, so customers never charge with a wrong or fast charger. Today the manuals say 'only use the included charger' while there is none in the box. Battery: the Elite cell is 600 mAh with 60 minutes official runtime, while we advertise 90. EU Battery Regulation: check the final rules for washable devices with our compliance contact.");
  }

  // =====================================================================
  // 8c. UPGRADE-IDEEËN PER PRODUCT: eerst oplossen, dan toevoegen of verbeteren
  // =====================================================================
  if (f.upgrades) {
    const byKey = Object.fromEntries(f.products.map((p) => [p.key, p]));
    for (const g of f.upgrades) {
      const s = pres.addSlide({ masterName: "Content Sand", sectionTitle: "Working together" });
      s.addText(g.en, { placeholder: "title" });
      s.addText(g.cn, { placeholder: "cn" });
      const PW = 3.0, FX = M + PW + 0.15, FW = (CW - PW - 0.15 - 0.2) / 2, AX = FX + FW + 0.2, top = 1.78;
      const heads = [["MdOutlineBuild", "FIX FIRST", "优先解决", FX], ["MdOutlineAddCircleOutline", "ADD OR IMPROVE", "新增或改进", AX]];
      for (const [i, h] of heads.entries()) {
        s.addImage({ objectName: `Upgrade head icon ${i + 1}`, data: await ic(h[0], HEX.bronze), x: h[3] + 0.2, y: top, w: 0.22, h: 0.22 });
        txt(s, `Upgrade head ${i + 1}`, [en(h[1], { bold: true, charSpacing: 2 }), cn("  ·  " + h[2], { bold: true })], { x: h[3] + 0.5, y: top, w: FW - 0.5, h: 0.24, fontSize: 10, color: C.accent1 });
      }
      // Een groep met "extra" krijgt onder de rijen een blok met een open vraag aan de fabriek.
      const areaTop = top + 0.36, areaH = PT + PH - areaTop - (g.concept ? 1.3 : 0), rowH = Math.min(g.concept ? 1.0 : 1.2, areaH / g.rijen.length);
      g.rijen.forEach((r, i) => {
        const p = byKey[r.key], y = areaTop + i * rowH, h = rowH - 0.1;
        card(s, `Upgrade row ${i + 1}`, M, y, CW, h, HEX.paper);
        const img = Math.min(0.72, h - 0.14);
        s.addImage({ objectName: `Upgrade photo ${i + 1}`, path: A(p.foto), x: M + 0.12, y: y + (h - img) / 2, w: img, h: img, altText: p.titel });
        txt(s, `Upgrade product ${i + 1}`, [en(p.product, { bold: true, fontSize: 12, breakLine: true }), cn(p.product_cn, { fontSize: 9.5, color: C.accent1 })],
          { x: M + 0.12 + img + 0.15, y, w: PW - img - 0.3, h, valign: "middle", color: C.text1, paraSpaceAfter: 1 });
        const cell = (items) => items.flatMap((t, j) => [
          en(t[0], { bold: j === 0, fontSize: 10.5, breakLine: true }), cn(t[1], { fontSize: 9.5, color: C.accent6, breakLine: j < items.length - 1 }),
        ]);
        txt(s, `Upgrade fix ${i + 1}`, cell(r.fix), { x: FX + 0.2, y, w: FW - 0.3, h, valign: "middle", color: C.text1, paraSpaceAfter: 1 });
        txt(s, `Upgrade add ${i + 1}`, cell(r.add), { x: AX + 0.2, y, w: FW - 0.3, h, valign: "middle", color: C.text1, paraSpaceAfter: 1 });
        s.addShape(pres.shapes.LINE, { objectName: `Upgrade divider ${i + 1}`, x: AX, y: y + 0.14, w: 0, h: h - 0.28, line: { color: C.accent3, width: 1 } });
        s.addShape(pres.shapes.LINE, { objectName: `Upgrade divider fix ${i + 1}`, x: FX, y: y + 0.14, w: 0, h: h - 0.28, line: { color: C.accent3, width: 1 } });
      });
      // Schets van het nieuwe mesje: nu, nieuw en zijaanzicht.
      if (g.concept) {
        const ey = areaTop + g.rijen.length * rowH + 0.05, eh = PT + PH - ey, ih = 0.85;
        card(s, "Concept box", M, ey, CW, eh, HEX.sandDeep);
        const pics = [["blade_old.png", 1375 / 875, g.concept.labels[0]], ["blade_new.png", 1375 / 875, g.concept.labels[1]], ["blade_side.png", 1917 / 792, g.concept.labels[2]]];
        let px = M + CW - 0.2;
        const placed = pics.slice().reverse().map(([file, ratio, label]) => {
          const pw = ih * ratio; px -= pw;
          const at = { file, x: px, w: pw, label };
          px -= 0.25;
          return at;
        });
        placed.forEach((pc, k) => {
          s.addImage({ objectName: `Concept image ${k + 1}`, path: A(pc.file), x: pc.x, y: ey + 0.1, w: pc.w, h: ih, altText: pc.label[0] });
          txt(s, `Concept label ${k + 1}`, [en(pc.label[0], { bold: true }), cn("  ·  " + pc.label[1], { color: C.accent1 })],
            { x: pc.x - 0.1, y: ey + 0.1 + ih + 0.02, w: pc.w + 0.2, h: 0.22, fontSize: 9, color: C.text1, align: "center" });
        });
        const tx = M + 0.25, tw = px + 0.25 - 0.25 - tx;
        txt(s, "Concept", [
          en(g.concept.en_kop, { bold: true, fontSize: 13.5 }), cn("  ·  " + g.concept.cn_kop, { bold: true, fontSize: 12.5, color: C.accent1, breakLine: true }),
          en(g.concept.en, { fontSize: 11, breakLine: true }), cn(g.concept.cn, { fontSize: 10, color: C.accent4 }),
        ], { x: tx, y: ey + 0.08, w: tw, h: eh - 0.16, color: C.text1, valign: "middle", paraSpaceAfter: 3 });
      }
      txt(s, "Upgrade source", [
        en("Sources: Wellshave customer service defect log and bol.com reviews, 1 January to 15 October 2026; battery specifications from the factory pro forma invoices.", { breakLine: true }),
        cn("数据来源：Wellshave 售后故障记录与 bol.com 评价（2026年1月1日至10月15日）；电池规格来自工厂形式发票。"),
      ], { x: M, y: PT + PH + 0.08, w: CW, h: 0.34, fontSize: 9, color: C.accent6, paraSpaceAfter: 1 });
      s.addNotes(g.notes || "");
    }
  }

  // =====================================================================
  // 8. SAMPLES, RECOMMENDATIONS, THANK YOU (dark)
  // =====================================================================
  {
    const s = pres.addSlide({ masterName: "Content Dark", sectionTitle: "Working together" });
    s.addText("What we would love to see", { placeholder: "title" });
    s.addText("我们最期待看到的", { placeholder: "cn" });
    const asks = [
      ["MdOutlineInventory2", "Samples", "样品", "Improved batteries, the certified adapter and new models. We like to test them ourselves.", "改进后的电池、认证适配器和新款产品。我们希望亲手测试。"],
      ["MdOutlineRecommend", "Your recommendations", "您的推荐", "What sells well in other markets? Which new features can you offer us?", "哪些产品在其他市场卖得好？贵司能为我们提供哪些新功能？"],
    ];
    const lw = 7.3, ch = 1.85;
    for (let i = 0; i < 2; i++) {
      const a = asks[i], y = 1.95 + i * (ch + 0.25);
      card(s, `Ask card ${i + 1}`, M, y, lw, ch, HEX.card);
      s.addShape(pres.shapes.OVAL, { objectName: `Ask badge ${i + 1}`, x: M + 0.3, y: y + 0.3, w: 0.72, h: 0.72, fill: { color: C.accent2 }, line: { type: "none" } });
      s.addImage({ objectName: `Ask icon ${i + 1}`, data: await ic(a[0], HEX.carbon), x: M + 0.46, y: y + 0.46, w: 0.4, h: 0.4 });
      txt(s, `Ask text ${i + 1}`, [
        en(a[1], { bold: true, fontSize: 18 }), cn("  " + a[2], { bold: true, fontSize: 16, color: C.accent2, breakLine: true }),
        en(a[3], { fontSize: 13, breakLine: true }), cn(a[4], { fontSize: 13, color: C.accent3 }),
      ], { x: M + 1.25, y: y + 0.3, w: lw - 1.5, h: ch - 0.45, color: C.background1, paraSpaceAfter: 5 });
    }
    txt(s, "No prep", [en("No preparation needed: we mainly come to listen.  "), cn("无需特别准备：我们主要是来倾听的。", { color: C.accent3 })],
      { x: M, y: 6.3, w: lw, h: 0.35, fontSize: 12, color: C.background1 });

    // thank-you panel
    const px = M + lw + 0.4, pw = W - M - px;
    card(s, "Thanks panel", px, 1.95, pw, 4.7, HEX.sand);
    txt(s, "Thanks", [en("Thank you", { bold: true, fontSize: 36, breakLine: true }), cn("谢谢", { bold: true, fontSize: 36, color: C.accent1 })],
      { x: px + 0.4, y: 2.3, w: pw - 0.8, h: 1.55, color: C.text1, paraSpaceAfter: 2 });
    txt(s, "Looking forward", [en("We look forward to growing together.", { breakLine: true }), cn("期待与贵司共同成长。", { color: C.accent1 })],
      { x: px + 0.4, y: 3.95, w: pw - 0.8, h: 0.8, fontSize: 14, color: C.text1, paraSpaceAfter: 3 });
    s.addShape(pres.shapes.LINE, { objectName: "Contact divider", x: px + 0.4, y: 4.95, w: pw - 0.8, h: 0, line: { color: C.accent3, width: 1 } });
    txt(s, "Contact", [
      en("Dustin Gibson", { bold: true }), en("  ·  Founder & CEO", { color: C.accent6, breakLine: true }),
      en("dustin@wellshave.com", { breakLine: true }),
      en("wellshave.com", { color: C.accent1 }),
    ], { x: px + 0.4, y: 5.12, w: pw - 0.8, h: 1.2, fontSize: 12, color: C.text1, paraSpaceAfter: 4 });
  }

  const file = path.join(OUT, `Wellshave_Factory_Visit_${f.key}.pptx`);
  await pres.writeFile({ fileName: file });
  await applyTheme(file, THEME);
  console.log("wrote", file);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const only = process.argv[2];
  for (const f of FACTORIES) if (!only || f.key === only) await build(f);
})();
