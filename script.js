// ============================================
// Mind Map Visualization using vis.js
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Get references to DOM elements
  const container = document.getElementById('mind-map-container');
  const zoomOutBtn = document.getElementById('zoom-out-btn');
  const modal = document.getElementById('content-modal');
  const modalContent = document.getElementById('modal-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  
  // Main connections between nodes
  const mainConnections = [
    ['node-ankap', 'node-amen'],
    ['node-ankap', 'node-ekonomie'],
    ['node-ankap', 'node-polemika']
  ];

  // URL mapping for sub-nodes to Urza.cz chapters
  const URL_MAPPING = {
    'sub-node-uvod': 'uvod',
    'sub-node-ceny': 'vzacne-zdroje-a-system-cen',
    'sub-node-planovani': 'proc-selhava-centralni-planovani',
    'sub-node-kalkulace': 'nemoznost-ekonomicke-kalkulace',
    'sub-node-kalkulace-jednotlivec': 'problem-kalkulace-ocima-jednotlivce',
    'sub-node-nap': 'princip-neagrese',
    'sub-node-nezodpovednost': 'podpora-nezodpovednosti',
    'sub-node-penize': 'penize',
    'sub-node-hasici': 'hasici',
    'sub-node-kultura': 'umeni-a-kultura',
    'sub-node-skolstvi': 'skolstvi',
    'sub-node-skolstvi-svoboda': 'skolstvi-a-svoboda',
    'sub-node-propaganda': 'vzdelavani-a-propaganda',
    'sub-node-social': 'socialni-system',
    'sub-node-zdravi': 'zdravotnictvi',
    'sub-node-prostranstvi': 'verejna-prostranstvi-a-svoboda-slova',
    'sub-node-silnice': 'silnice-a-dopravni-pravidla',
    'sub-node-zivotni': 'zivotni-prostredi',
    'sub-node-soudy': 'soudnictvi',
    'sub-node-soudy-nap': 'svobodne-soudnictvi-a-princip-neagrese',
    'sub-node-vymahani': 'vymahani-prava',
    'sub-node-trest': 'zlocin-a-trest',
    'sub-node-armada': 'armada',
    'sub-node-myty': 'boreni-mytu',
    'sub-node-zaver': 'zaver',
    'sub-node-drogy': 'drogy',
    'sub-node-zbrane': 'zbrane',
    'sub-node-veda': 'veda',
    'sub-node-prace': 'prace',
    'sub-node-etika': 'etika',
    'sub-node-prava': 'lidska-prava',
    'sub-node-nasili': 'anarchie-je-nasilna',
    'sub-node-agrese': 'agrese',
    'sub-node-jednani': 'lidske-jednani',
    'sub-node-nezodpovednost2': 'nezodpovednost',
    'sub-node-monopoly': 'monopoly',
    'sub-node-kartely': 'kartely',
    'sub-node-dumping': 'dumpingove-ceny',
    'sub-node-spekulanti': 'spekulanti',
    'sub-node-statky': 'verejne-statky',
    'sub-node-nekvalitni': 'nekvalitni-soukrome-instituce',
    'sub-node-praxe': 'teorie-a-praxe',
    'sub-node-vlastnosti': 'vlastnosti-lidi',
    'sub-node-tradice': 'tradice-statu',
    'sub-node-inzenyrstvi': 'socialni-inzenyrstvi',
    'sub-node-chyby': 'chyby-anarchokapitalismu',
    'sub-node-byrokracie': 'byrokracie-v-anarchokapitalismu'
  };

  // Content data for each node
  // NOTE: Full content should be scraped from https://ankap.urza.cz/
  // Current content is placeholder - update with actual HTML content from source
  const contentData = {
    'node-ankap': '<h2>Anarchokapitalismus</h2><p>Hlavní texty vysvětlující principy a fungování bezstátní společnosti.</p>',
    'node-amen': '<h2>AMEN</h2><p>Anarchokapitalistický měsíčník. Rozšiřující eseje a úvahy.</p>',
    'node-ekonomie': '<h2>Ekonomie</h2><p>Ekonomické argumenty, mýty a principy.</p>',
    'node-polemika': '<h2>Polemika</h2><p>Odpovědi na časté námitky a kritiky.</p>',
    // Sub-nodes for Anarchokapitalismus
    'sub-node-uvod': '<h2>Úvod</h2><p>Anarchokapitalismus je politická filosofie, která prosazuje bezstátní společnost založenou na dobrovolné výměně a soukromém vlastnictví. Základem je princip neagrese a víra v to, že všechny služby, které dnes poskytuje stát, mohou být efektivněji zajištěny na svobodném trhu.</p>',
    'sub-node-ceny': '<h2>Vzácné zdroje a systém cen</h2><p>Ceny jsou signály vzácnosti zdrojů a koordinují ekonomickou aktivitu bez nutnosti centrální autority. Svobodný systém cen umožňuje efektivní alokaci zdrojů podle skutečných preferencí lidí, zatímco státní zásahy ceny zkreslují a vedou k plýtvání.</p>',
    'sub-node-planovani': '<h2>Proč selhává centrální plánování</h2><p>Centrální plánovači nemohou mít dostatek informací o preferencích všech jednotlivců a změnách v ekonomice. Bez systému cen chybí zpětná vazba, což vede k chronickému nedostatku některých zboží a přebytku jiného. Historie socialistických států toto opakovaně prokázala.</p>',
    'sub-node-kalkulace': '<h2>Nemožnost ekonomické kalkulace</h2><p>Ludwig von Mises prokázal, že bez soukromého vlastnictví výrobních prostředků a svobodného trhu nelze provádět racionální ekonomickou kalkulaci. Socialismus je proto ekonomicky nemožný - bez cen vznikajících na trhu nelze určit, které projekty jsou ekonomicky smysluplné.</p>',
    'sub-node-kalkulace-jednotlivec': '<h2>Problém kalkulace očima jednotlivce</h2><p>Každý jednotlivec denně provádí ekonomické kalkulace - porovnává náklady a přínosy svých rozhodnutí. Na svobodném trhu má k dispozici cenové signály, které mu umožňují činit informovaná rozhodnutí. Stát svými zásahy tyto signály narušuje a znemožňuje racionální volbu.</p>',
    'sub-node-nap': '<h2>Princip neagrese</h2><p>Princip neagrese (NAP) je základním etickým axiomem anarchokapitalismu: nikdo nesmí iniciovat užití síly nebo hrozby silou proti osobě nebo majetku jiného. Všechny lidské interakce by měly být dobrovolné. Stát je inherentně v rozporu s tímto principem, protože funguje na základě donucení.</p>',
    'sub-node-nezodpovednost': '<h2>Podpora nezodpovědnosti</h2><p>Státní intervence často podporují nezodpovědné chování tím, že privatizují zisky a socializují ztráty. Bailouty bank, sociální dávky bez podmínek a státní pojištění vytváří morální hazard. V anarchokapitalismu každý nese plné důsledky svých rozhodnutí, což podporuje zodpovědnost.</p>',
    'sub-node-penize': '<h2>Peníze</h2><p>V anarchokapitalismu by peníze vznikaly spontánně na trhu, pravděpodobně by se vrátila zlatá nebo jiná komoditní měna. Centrální banky a státní monopol na měnu umožňují inflaci a manipulaci ekonomiky. Soukromé peníze by byly stabilnější a chráněny před politickými zásahy.</p>',
    'sub-node-hasici': '<h2>Hasiči</h2><p>Požární ochrana může efektivně fungovat jako soukromá služba, stejně jako dnes funguje soukromá bezpečnost. Pojišťovny by měly silnou motivaci zajistit kvalitní požární prevenci a zásah. Historicky mnoho hasičských sborů vzniklo jako soukromé nebo dobrovolné organizace.</p>',
    'sub-node-kultura': '<h2>Umění a kultura</h2><p>Umění a kultura nepotřebují státní dotace - prosperují lépe, když jsou financovány dobrovolně těmi, kdo je oceňují. Státní financování vede k politizaci kultury a podporuje mediokritu. Svobodný trh odměňuje skutečný talent a diverzitu, bez nutnosti kulturních komisařů.</p>',
    'sub-node-skolstvi': '<h2>Školství</h2><p>Soukromé školství by bylo diverzifikované, konkurenceschopné a přizpůsobené potřebám žáků a rodičů. Bez státního monopolu by vznikly různé pedagogické přístupy a školy by musely skutečně vzdělávat, aby přežily. Chudší rodiny by měly přístup ke vzdělání díky stipendiím, charitě a levnějším alternativám.</p>',
    'sub-node-skolstvi-svoboda': '<h2>Školství a svoboda</h2><p>Povinná školní docházka je forma donucení. Rodiče by měli mít svobodu rozhodovat o vzdělání svých dětí - zda je budou učit doma, posílat do soukromých škol nebo vybrat jinou cestu. Svoboda ve vzdělávání vede k lepším výsledkům než byrokratický systém.</p>',
    'sub-node-propaganda': '<h2>Vzdělávání a propaganda</h2><p>Státní školy nevyhnutelně slouží k šíření státní ideologie a indoktrinaci dětí v poslušnosti vůči autoritě. Učí verzi historie, která glorifikuje stát a ospravedlňuje jeho existenci. Svobodné vzdělávání by umožnilo kritické myšlení místo konformity.</p>',
    'sub-node-social': '<h2>Sociální systém</h2><p>Státní sociální systém je neudržitelný, neefektivní a vytvářející závislost. V anarchokapitalismu by pomoc potřebným zajišťovaly rodiny, komunity, charity a vzájemně prospěšné společnosti. Taková pomoc by byla efektivnější a nepodporovala by parazitismus jako nucená redistribuce.</p>',
    'sub-node-zdravi': '<h2>Zdravotnictví</h2><p>Státní regulace a zásahy do zdravotnictví zvyšují ceny a snižují kvalitu péče. Volný trh ve zdravotnictví by vedl k inovacím, konkurenci a dostupným cenám. Soukromé pojištění a přímá péče by byly efektivnější než byrokratické systémy. Historie ukazuje, že před státními zásahy bylo zdravotnictví dostupnější.</p>',
    'sub-node-prostranstvi': '<h2>Veřejná prostranství a svoboda slova</h2><p>Koncept "veřejného prostranství" je problematický - ve skutečnosti jde o státní majetek. V anarchokapitalismu by všechna prostranství měla soukromé vlastníky, kteří by určovali pravidla jejich užívání. Svoboda slova znamená právo mluvit, ne právo na cizí majetek pro vaše projevy.</p>',
    'sub-node-silnice': '<h2>Silnice a dopravní pravidla</h2><p>Soukromé silnice by byly lépe udržované a efektivněji spravované než státní infrastruktura. Vlastníci silnic by měli přímou motivaci zajistit bezpečnost a plynulost dopravy. Dopravní pravidla by vznikala na základě tržních mechanismů a dohod mezi vlastníky, nikoliv byrokratickým nařizováním.</p>',
    'sub-node-zivotni': '<h2>Životní prostředí</h2><p>Ochrana životního prostředí je nejlepší zajištěna jasně definovanými vlastnickými právy. Znečištění je porušení vlastnických práv jiných osob. Stát často chrání znečišťovatele před soudními žalobami. Soukromí vlastníci mají silnou motivaci chránit hodnotu svého majetku včetně přírodních zdrojů.</p>',
    'sub-node-soudy': '<h2>Soudnictví</h2><p>Soukromé soudnictví a arbitráž mohou efektivně řešit spory bez státu. Stávající systém mezinárodní arbitráže ukazuje, že to funguje. Soutěžící soudní systémy by byly spravedlivější a efektivnější než státní monopol, kde nelze odvolat špatné rozhodnutí změnou poskytovatele.</p>',
    'sub-node-soudy-nap': '<h2>Svobodné soudnictví a princip neagrese</h2><p>Svobodné soudy by vycházely z principu neagrese a respektovaly soukromé vlastnictví. Jejich legitimita by plynula z dobrovolného uznání, ne z donucení. Precedenty a reputace by byly důležitější než státní moc. Právní řád by byl decentralizovaný a konkurenční.</p>',
    'sub-node-vymahani': '<h2>Vymáhání práva</h2><p>Soukromé bezpečnostní agentury by zajišťovaly vymáhání práva efektivněji než policie. Musely by jednat profesionálně, jinak by přišly o klienty. Jejich odpovědnost by byla přímá - za škody způsobené nezákonným jednáním by musely platit. To je zásadní rozdíl oproti policii chráněné státní imunitou.</p>',
    'sub-node-trest': '<h2>Zločin a trest</h2><p>Zločin je porušení práv jiné osoby. Trest by měl být restituční - zaměřený na odškodnění oběti, ne na pomstu či "převýchovu". Současný státní systém je zaměřen na trestání symbolických přestupků proti státu, zatímco reálné oběti jsou ignorovány. Soukromý systém by kladl důraz na náhradu škod.</p>',
    'sub-node-armada': '<h2>Armáda</h2><p>Obrana může být zajištěna soukromě - pojišťovnami, bezpečnostními firmami a dobrovolnými obrannými spolky. Anarchokapitalistická společnost by byla méně atraktivní pro agresory - nemá centralizovanou moc k dobytí. Historie ukazuje, že státy jsou hlavními válečnými agresory, ne obránci.</p>',
    'sub-node-myty': '<h2>Boření mýtů</h2><p>Mezi časté mýty patří: "Bez státu by byl chaos", "Chudí by zemřeli", "Vznikly by monopoly". Realita je opačná - stát vytváří chaos, chudé drtí daněmi a regulacemi, a monopoly jsou udržovány státní mocí. Anarchokapitalismus nabízí mírovou, prosperující společnost založenou na dobrovolné spolupráci.</p>',
    'sub-node-zaver': '<h2>Závěr</h2><p>Anarchokapitalismus je konzistentní filosofie svobody a prosperity. Všechny služby poskytované státem mohou být zajištěny lépe a morálněji na dobrovolném trhu. Stát je zastaralá instituce založená na agresi a parazitismu. Budoucnost patří svobodě, míru a dobrovolné spolupráci.</p>',
    'sub-node-drogy': '<h2>Drogy</h2><p>Válka proti drogám je neúspěšná, nákladná a porušuje lidská práva. V anarchokapitalismu by každý měl právo rozhodovat o svém těle. Prohibice vytváří kriminalitu a nebezpečné černé trhy. Legalizace a svobodný trh by vedly k čistším produktům, lepší prevenci a menší společenské škodě.</p>',
    'sub-node-zbrane': '<h2>Zbraně</h2><p>Právo nosit zbraně je základním právem sebeobrany. Zbraně v rukou občanů jsou pojistkou proti tyranii a násilí. Statistiky ukazují, že legální držení zbraní snižuje kriminalitu. V anarchokapitalismu by neexistovala státní restrikce zbrojení - každý by mohl bránit svá práva účinně.</p>',
    'sub-node-veda': '<h2>Věda</h2><p>Vědecký výzkum nepotřebuje státní financování - nejdůležitější objevy vznikly často soukromě. Státní granty vedou k politizaci vědy a plýtvání zdroji na nesmyslné projekty. Soukromé financování by směřovalo do praktického výzkumu s reálnými přínosy, ne do byrokratických projektů.</p>',
    'sub-node-prace': '<h2>Práce</h2><p>Pracovní trh by bez státní regulace fungoval efektivněji. Minimální mzdy vytváří nezaměstnanost, odborové monopoly škodí ekonomice. Svobodné pracovní smlouvy by odrážely skutečnou hodnotu práce. Ochrana zaměstnanců by plynula z konkurence mezi zaměstnavateli, ne z donucujících zákonů.</p>',
    // Sub-nodes for AMEN
    'sub-node-etika': '<h2>Etika</h2><p>Anarchokapitalistická etika je založena na principu sebevlastnictví - každý vlastní sám sebe a plody své práce. Z toho vyplývá, že veškeré donucení je nelegitimní. Etický systém musí být univerzální a platit pro všechny stejně - stát porušuje tento princip, protože si nárokuje práva, která odepírá ostatním.</p>',
    'sub-node-prava': '<h2>Lidská práva</h2><p>Jediná skutečná lidská práva jsou negativní práva - právo nebýt okraden, napadán nebo donucován. Pozitivní "práva" na zdravotní péči, vzdělání či bydlení nejsou práva, ale nároky na práci jiných. Pravá svoboda znamená, že nikdo nemá právo na náklady někoho jiného.</p>',
    'sub-node-nasili': '<h2>Anarchie je násilná</h2><p>Tento častý argument je ironický - právě stát je institucí systematického násilí. Anarchie není chaos, ale absence vládnoucí autority. Bezstátní společnost by byla mírová, protože by neexistovala centralizovaná moc schopná vést války a brutálně potlačovat vlastní občany.</p>',
    'sub-node-agrese': '<h2>Agrese</h2><p>Agrese je iniciace síly nebo hrozby proti osobě nebo jejímu legitimnímu majetku. Obrana není agrese. Stát je založen na agresi - daně jsou krádež, regulace jsou donucení, války jsou masová vražda. Anarchokapitalismus odmítá veškerou agresi a uznává pouze obranu.</p>',
    'sub-node-jednani': '<h2>Lidské jednání</h2><p>Lidské jednání je účelové chování zaměřené na dosažení cílů. Rakouská ekonomická škola analyzuje ekonomiku deduktivně z axiomů o lidském jednání. Lidé jednají, aby zlepšili svou situaci podle vlastních preferencí. Stát toto přirozené jednání narušuje donucením a regulacemi.</p>',
    'sub-node-nezodpovednost2': '<h2>Nezodpovědnost</h2><p>Státní systém osvobozuje lidi od odpovědnosti za jejich činy. Politici slibují nerealistické věci bez osobní odpovědnosti, byrokraté rozhodují o cizích životech bez rizika, špatné firmy jsou zachraňovány bailouty. V anarchokapitalismu každý plně odpovídá za své jednání.</p>',
    // Sub-nodes for Ekonomie
    'sub-node-monopoly': '<h2>Monopoly</h2><p>Skutečné monopoly vznikají díky státní ochraně, ne svobodnému trhu. Standard Oil, často citovaný jako příklad "tržního monopolu", ve skutečnosti snižoval ceny a zlepšoval služby. Státní monopoly a regulace jsou hlavními zdroji neefektivity. Volný trh spontánně bortí monopoly skrze konkurenci.</p>',
    'sub-node-kartely': '<h2>Kartely</h2><p>Kartely jsou inherentně nestabilní bez státní podpory. Jakmile se členové kartelu dohodnou na vysokých cenách, mají všichni silnou motivaci tajně ceny snížit a získat více zákazníků. Historie ukazuje, že většina kartelů se rychle rozpadá. Právě antimonopolní zákony často kartely chrání.</p>',
    'sub-node-dumping': '<h2>Dumpingové ceny</h2><p>Kritici tvrdí, že velké firmy mohou dočasně snížit ceny, zničit konkurenci a pak ceny zvýšit. Tato strategie je ekonomicky neudržitelná - ztrácíte peníze v naději, že nová konkurence nevznikne. Historie téměř nezná případy úspěšného predátorského pricingu. Nízké ceny prospívají spotřebitelům.</p>',
    'sub-node-spekulanti': '<h2>Spekulanti</h2><p>Spekulanti jsou často démonizováni, ale plní důležitou ekonomickou funkci - vyhlazují výkyvy v cenách tím, že nakupují levně a prodávají draho. Tím stabilizují trhy a zlepšují alokaci zdrojů v čase. Úspěšní spekulanti jsou odměněni, špatní ruinováni - trh automaticky třídí dobré od špatných.</p>',
    'sub-node-statky': '<h2>Veřejné statky</h2><p>Teorie veřejných statků tvrdí, že některé služby nemohou být poskytovány trhem kvůli problému "černého pasažéra". To je mýtus - majáky, bezpečnost, silnice a další údajně "veřejné" statky byly historicky poskytovány soukromě. Trh nachází kreativní řešení, pokud mu to stát nedovoluje.</p>',
    'sub-node-nekvalitni': '<h2>Nekvalitní soukromé instituce</h2><p>Argument "co když budou soukromé soudy/policie nekvalitní?" ignoruje, že špatné soukromé služby zkrachují. Nemáte-li výběr (jako u státu), máte zaručenou nekvalitu. Se svobodnou volbou dostanete kvalitu, protože poskytovatelé musí soutěžit o vaše peníze. Konkurence je nejlepší garance kvality.</p>',
    // Sub-nodes for Polemika
    'sub-node-praxe': '<h2>Teorie a praxe</h2><p>Námitka "v teorii to zní hezky, ale v praxi..." je nepochopení. Anarchokapitalismus je založen na realitě lidského jednání a ekonomických zákonech, ne na utopických představách. Naopak statismus vyžaduje, aby lidé jednali proti svým zájmům. Praxi bez správné teorie je jen chaotické tápání.</p>',
    'sub-node-vlastnosti': '<h2>Vlastnosti lidí</h2><p>Kritici tvrdí: "Lidé jsou chamtiví/hloupí/zlí, proto potřebujeme stát." Ale kdo bude ve státě? Tytéž chamtivé, hloupé, zlé lidi - jen s mocí nad ostatními! Anarchokapitalismus nepředpokládá dokonalé lidi, jen uznává, že dát někomu monopol na násilí je horší než nechat lidi svobodně jednat.</p>',
    'sub-node-tradice': '<h2>Tradice státu</h2><p>"Stát tu byl vždycky" je špatný argument. Také tu vždycky bylo otroctví, nevolnictví a absolutní monarchie. Tradice neznamená správnost. Moderní stát je relativně nový vynález. Lidstvo většinu své existence fungovalo bez centralizované státní moci a často lépe než dnes.</p>',
    'sub-node-inzenyrstvi': '<h2>Sociální inženýrství</h2><p>Anarchokapitalismus není sociální inženýrství - je to odmítnutí inženýrství. Nesnažíme se navrhnout dokonalou společnost, jen chceme ukončit násilné vměšování do dobrovolných interakcí. Spontánní řád vznikající ze svobodného jednání je lepší než jakýkoliv plánovaný systém.</p>',
    'sub-node-chyby': '<h2>Chyby anarchokapitalismu</h2><p>V anarchokapitalismu budou chyby - lidé jsou nedokonalí. Rozdíl je, že chyby na trhu jsou lokalizované a samoopravitelné. Špatné rozhodnutí podnikatele ruinuje jeho firmu, ne celou zemi. Státní chyby jsou systémové, rozsáhlé a neopravitelné, protože stát nemá konkurenci ani zpětnou vazbu trhu.</p>',
    'sub-node-byrokracie': '<h2>Byrokracie v anarchokapitalismu</h2><p>Soukromé firmy mají byrokratické procedury, ale zásadní rozdíl je konkurence. Přebujelá byrokracie ve firmě vede k vyšším nákladům a ztrátě zákazníků. Státní byrokracie nemá žádné omezení - nemůže zkrachovat, nemá konkurenci, a může vás donutit platit za své neefektivní služby.</p>'
  };

  // ============================================
  // Parse Data from HTML
  // ============================================
  function parseDataFromDOM() {
    const nodes = [];
    const edges = [];
    
    // Parse main nodes
    const mainNodeElements = document.querySelectorAll('#data-source .node');
    mainNodeElements.forEach(nodeEl => {
      const id = nodeEl.id;
      const title = nodeEl.querySelector('.node-title')?.textContent || '';
      
      // Add main node
      nodes.push({
        id: id,
        label: title,
        shape: 'circle',
        size: 30,
        font: { size: 16, color: '#4D9DE0', face: 'IBM Plex Mono' },
        color: {
          background: '#111522cc',
          border: '#4D9DE088',
          highlight: { background: '#111522ee', border: '#E15554' },
          hover: { background: '#111522ee', border: '#E15554' }
        },
        borderWidth: 2,
        group: 'main'
      });
      
      // Parse sub-nodes
      const subNodeElements = nodeEl.querySelectorAll('.sub-node');
      subNodeElements.forEach(subNodeEl => {
        const subId = subNodeEl.id;
        const subTitle = subNodeEl.querySelector('.sub-node-title')?.textContent || '';
        
        nodes.push({
          id: subId,
          label: subTitle,
          shape: 'box',
          size: 20,
          font: { size: 12, color: '#D0D0E0', face: 'IBM Plex Mono' },
          color: {
            background: '#111522cc',
            border: '#4D9DE088',
            highlight: { background: '#111522ee', border: '#E15554' },
            hover: { background: '#111522ee', border: '#E15554' }
          },
          borderWidth: 2,
          hidden: true, // Initially hidden
          group: 'sub',
          parent: id
        });
        
        // Add edge from parent to child
        edges.push({
          from: id,
          to: subId,
          color: { color: '#4D9DE033', highlight: '#4D9DE088', hover: '#4D9DE088' },
          width: 2,
          smooth: { type: 'curvedCW', roundness: 0.2 },
          hidden: true
        });
      });
    });
    
    // Add main connections
    mainConnections.forEach(conn => {
      edges.push({
        from: conn[0],
        to: conn[1],
        color: { color: '#4D9DE033', highlight: '#4D9DE0', hover: '#4D9DE0' },
        width: 2,
        dashes: [4, 2],
        smooth: { type: 'continuous' }
      });
    });
    
    return { nodes, edges };
  }

  // ============================================
  // Initialize vis-network
  // ============================================
  const { nodes: nodesArray, edges: edgesArray } = parseDataFromDOM();
  
  const nodesDataset = new vis.DataSet(nodesArray);
  const edgesDataset = new vis.DataSet(edgesArray);
  
  const data = {
    nodes: nodesDataset,
    edges: edgesDataset
  };
  
  const options = {
    layout: {
      hierarchical: false
    },
    physics: {
      enabled: true,
      stabilization: {
        enabled: true,
        iterations: 200,
        updateInterval: 25
      },
      barnesHut: {
        gravitationalConstant: -8000,
        centralGravity: 0.3,
        springLength: 200,
        springConstant: 0.04,
        damping: 0.09,
        avoidOverlap: 0.5
      }
    },
    interaction: {
      hover: true,
      zoomView: true,
      dragView: true,
      navigationButtons: false,
      keyboard: {
        enabled: false
      }
    },
    edges: {
      smooth: {
        enabled: true,
        type: 'continuous'
      }
    },
    nodes: {
      borderWidthSelected: 3
    }
  };
  
  const network = new vis.Network(container, data, options);
  
  // Track the currently focused node
  let currentFocusedNode = null;
  let visibleSubNodes = new Set();
  
  // ============================================
  // Event Handlers
  // ============================================
  
  // Click event handler
  network.on('click', (params) => {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      const node = nodesDataset.get(nodeId);
      
      if (node.group === 'main') {
        if (nodeId === currentFocusedNode) {
          // Node is already open, collapse it
          zoomOutBtn.click(); // Programmatically click the zoom-out button
        } else {
          // Main node clicked - focus and show sub-nodes
          handleMainNodeClick(nodeId);
        }
      } else if (node.group === 'sub') {
        // Sub-node clicked - show content modal
        handleSubNodeClick(nodeId);
      }
    }
  });
  
  function handleMainNodeClick(nodeId) {
    currentFocusedNode = nodeId;
    
    // Focus on the main node
    network.focus(nodeId, {
      scale: 1.2,
      animation: {
        duration: 800,
        easingFunction: 'easeInOutQuad'
      }
    });
    
    // Show sub-nodes for this main node
    const allNodes = nodesDataset.get();
    allNodes.forEach(node => {
      if (node.parent === nodeId) {
        nodesDataset.update({ id: node.id, hidden: false });
        visibleSubNodes.add(node.id);
        
        // Show edges to this sub-node
        const connectedEdges = edgesDataset.get({
          filter: edge => edge.from === nodeId && edge.to === node.id
        });
        connectedEdges.forEach(edge => {
          edgesDataset.update({ id: edge.id, hidden: false });
        });
      }
    });
    
    // Show zoom out button
    zoomOutBtn.style.opacity = '1';
    zoomOutBtn.style.visibility = 'visible';
  }
  
  function handleSubNodeClick(nodeId) {
    // Get base content for this node
    let content = contentData[nodeId] || '<p>Obsah není dostupný</p>';
    
    // Get the URL slug from the mapping
    const urlSlug = URL_MAPPING[nodeId];
    
    if (urlSlug) {
      const fullUrl = `https://ankap.urza.cz/${urlSlug}/`;
      const linkHtml = `<a href="${fullUrl}" target="_blank" class="urza-link">Více na Urza.cz</a>`;
      content += linkHtml; // Append the link
    }
    
    // Show modal
    modalContent.innerHTML = content;
    modal.style.display = 'block';
    
    // Scroll modal to top
    document.getElementById('modal-content-wrapper').scrollTop = 0;
  }
  
  // Modal close handler
  modalCloseBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // Close modal when clicking overlay
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.id === 'modal-overlay') {
      modal.style.display = 'none';
    }
  });
  
  // Zoom out button handler
  zoomOutBtn.addEventListener('click', () => {
    if (currentFocusedNode) {
      // Hide all sub-nodes
      visibleSubNodes.forEach(subNodeId => {
        nodesDataset.update({ id: subNodeId, hidden: true });
        
        // Hide edges
        const connectedEdges = edgesDataset.get({
          filter: edge => edge.to === subNodeId
        });
        connectedEdges.forEach(edge => {
          edgesDataset.update({ id: edge.id, hidden: true });
        });
      });
      
      visibleSubNodes.clear();
      currentFocusedNode = null;
    }
    
    // Fit the view to show all main nodes
    network.fit({
      animation: {
        duration: 800,
        easingFunction: 'easeInOutQuad'
      }
    });
    
    // Hide zoom out button
    zoomOutBtn.style.opacity = '0';
    zoomOutBtn.style.visibility = 'hidden';
  });
  
  // ============================================
  // Initialization
  // ============================================
  
  // Wait for stabilization and then fit the view
  network.once('stabilizationIterationsDone', () => {
    network.fit({
      animation: {
        duration: 1000,
        easingFunction: 'easeInOutQuad'
      }
    });
  });
  
  // Stop physics after stabilization for better performance
  network.on('stabilizationIterationsDone', () => {
    network.setOptions({ physics: { enabled: false } });
  });
});
