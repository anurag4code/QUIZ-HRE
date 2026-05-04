// ============================================================
//  HRE QUIZ — QUESTION BANK  (expanded + harder)
//  PRIVATE — never sent to any browser client
//
//  Round 1 (Round Robin):  50 questions
//  Round 2 (Buzzer Round): 30 questions
//  Round 3 (Rapid Fire):   5 sets × 8 questions = 40
// ============================================================

const questions = [

  // ══════════════════════════════════════════════════════════
  //  ROUND 1 — ROUND ROBIN  (50 questions)
  // ══════════════════════════════════════════════════════════

  // ── STRUCTURAL ENGINEERING ───────────────────────────────
  {
    round:1, category:"Structural Engineering", difficulty:"hard", timeout:45,
    question:"Under AISC 360 LRFD, what is the resistance factor φ for flexural yielding of compact W-sections?",
    options:{A:"0.85",B:"0.90",C:"0.75",D:"0.95"},
    correct:"B"
  },
  {
    round:1, category:"Structural Engineering", difficulty:"hard", timeout:45,
    question:"A simply-supported beam spans 24 ft with factored load combination 1.2D+1.6L where wD=1.5 k/ft and wL=2.0 k/ft. What is the factored midspan moment in kip-ft?",
    options:{A:"486",B:"504",C:"518",D:"432"},
    correct:"B"
  },
  {
    round:1, category:"Structural Engineering", difficulty:"hard", timeout:45,
    question:"Per ACI 318-19, what is the minimum longitudinal reinforcement ratio for a tied column?",
    options:{A:"0.005",B:"0.001",C:"0.010",D:"0.008"},
    correct:"A"
  },
  {
    round:1, category:"Structural Engineering", difficulty:"hard", timeout:45,
    question:"In a moment-resisting steel frame, panel zone shear demand is most critically governed by which condition?",
    options:{A:"Gravity loads at beam flanges",B:"Unbalanced beam moments at the column face",C:"Column axial compression exceeding 50% of yield",D:"Shear tab connection slip at bolt holes"},
    correct:"B"
  },
  {
    round:1, category:"Structural Engineering", difficulty:"hard", timeout:45,
    question:"Which correctly describes the difference between Cd and R in ASCE 7 seismic design?",
    options:{A:"R amplifies forces; Cd reduces displacements",B:"R reduces design forces; Cd amplifies elastic displacements to estimate inelastic displacements",C:"Both are ductility factors applied to base shear",D:"R applies to drift limits; Cd applies to force levels"},
    correct:"B"
  },
  {
    round:1, category:"Structural Engineering", difficulty:"hard", timeout:45,
    question:"For a slender rectangular HSS column with KL/r = 120, which buckling mode typically governs?",
    options:{A:"Local buckling of the web",B:"Flexural buckling",C:"Torsional buckling",D:"Lateral-torsional buckling"},
    correct:"B"
  },
  {
    round:1, category:"Structural Engineering", difficulty:"medium", timeout:45,
    question:"A post-tensioned slab has a 400-kip prestress force at 4 inches below the centroid of a 12-inch deep slab. What is the net bottom fiber stress due to prestress alone?",
    options:{A:"333 psi compression",B:"833 psi compression",C:"500 psi tension",D:"667 psi compression"},
    correct:"B"
  },
  {
    round:1, category:"Structural Engineering", difficulty:"hard", timeout:45,
    question:"Capacity design in seismic engineering specifically intends to prevent which failure mechanism in RC frames?",
    options:{A:"Beam hinging before column hinging",B:"Column shear failure before beam flexural yielding",C:"Foundation sliding before superstructure damage",D:"Diaphragm yielding before vertical element yielding"},
    correct:"B"
  },
  {
    round:1, category:"Structural Engineering", difficulty:"hard", timeout:45,
    question:"Per AISC 360, the nominal shear strength of an unstiffened web is limited to 0.6FyAw when Cv1 equals what value?",
    options:{A:"0.5",B:"0.75",C:"1.0",D:"0.9"},
    correct:"C"
  },
  {
    round:1, category:"Structural Engineering", difficulty:"medium", timeout:45,
    question:"What is the primary function of a viscous fluid damper in a seismic isolation system?",
    options:{A:"Increases the natural period of the structure",B:"Dissipates energy through fluid resistance independent of displacement magnitude",C:"Provides restoring force to return the structure to original position",D:"Amplifies the first mode response to reduce higher mode participation"},
    correct:"B"
  },

  // ── ASCE / IBC CODES ─────────────────────────────────────
  {
    round:1, category:"ASCE / IBC Codes", difficulty:"hard", timeout:45,
    question:"Under ASCE 7-22, what is the allowable story drift ratio for an SDC D office building with a moment frame system?",
    options:{A:"0.020hsx",B:"0.025hsx",C:"0.015hsx",D:"0.010hsx"},
    correct:"A"
  },
  {
    round:1, category:"ASCE / IBC Codes", difficulty:"hard", timeout:45,
    question:"Which condition does NOT qualify a diaphragm as rigid per ASCE 7?",
    options:{A:"Cast-in-place concrete slab over metal deck",B:"Untopped steel deck with span-to-depth ratio greater than 3",C:"Precast concrete diaphragm with full composite connection",D:"Concrete slab on ground with shear studs"},
    correct:"B"
  },
  {
    round:1, category:"ASCE / IBC Codes", difficulty:"hard", timeout:45,
    question:"For a Risk Category IV essential facility in SDC E, what is the minimum base shear per ASCE 7 equivalent lateral force?",
    options:{A:"0.5% of W",B:"1.0% of W",C:"1.5% of W",D:"0.75% of W"},
    correct:"B"
  },
  {
    round:1, category:"ASCE / IBC Codes", difficulty:"hard", timeout:45,
    question:"ASCE 7 assigns ρ = 1.3 for SDC D-F buildings when which condition is NOT satisfied?",
    options:{A:"No single element removal increases story drift by more than 33%",B:"The building has fewer than four bays in each direction",C:"The structure has less than three stories above grade",D:"Shear walls are present on every floor"},
    correct:"A"
  },
  {
    round:1, category:"ASCE / IBC Codes", difficulty:"medium", timeout:45,
    question:"Under IBC, which Risk Category requires a seismic importance factor Ie of 1.5?",
    options:{A:"Risk Category II hospitals",B:"Risk Category IV essential and post-disaster structures",C:"Risk Category III assembly occupancies over 300 persons",D:"All buildings in SDC C or above"},
    correct:"B"
  },
  {
    round:1, category:"ASCE / IBC Codes", difficulty:"hard", timeout:45,
    question:"The ASCE 7 vertical seismic effect Ev = 0.2 SDS D. For which load combination is Ev subtracted rather than added?",
    options:{A:"When checking uplift or overturning where dead load is stabilising",B:"When the seismic mass includes partition loads",C:"When the structure is classified as non-building",D:"When the site class is D or worse"},
    correct:"A"
  },
  {
    round:1, category:"ASCE / IBC Codes", difficulty:"hard", timeout:45,
    question:"Per ACI 318-19, which condition triggers a special moment frame requirement regardless of SDC classification?",
    options:{A:"Concrete compressive strength below 3000 psi",B:"Structural walls with height-to-length ratio less than 2",C:"A building where all lateral resistance is provided by gravity columns",D:"Coupling beams with span-to-depth ratio less than 2"},
    correct:"C"
  },

  // ── FAMOUS STRUCTURES ────────────────────────────────────
  {
    round:1, category:"Famous Structures", difficulty:"hard", timeout:45,
    question:"The Millau Viaduct in France holds which structural record?",
    options:{A:"Longest cable-stayed bridge span",B:"Tallest bridge pier in the world",C:"Longest continuous prestressed concrete deck",D:"Highest suspension bridge deck above sea level"},
    correct:"B"
  },
  {
    round:1, category:"Famous Structures", difficulty:"hard", timeout:45,
    question:"What distinguishes the Hearst Tower in New York from a conventional diagrid building?",
    options:{A:"It uses a concrete core with outrigger trusses instead of perimeter columns",B:"It features a six-story diagrid base podium supporting a conventional steel frame above",C:"Its diagrid uses recycled steel without any welded connections",D:"It cantilevers 40 feet beyond its base footprint using post-tensioned trusses"},
    correct:"B"
  },
  {
    round:1, category:"Famous Structures", difficulty:"medium", timeout:45,
    question:"The Tacoma Narrows Bridge collapse (1940) is attributed to which aerodynamic phenomenon?",
    options:{A:"Flutter instability from coupled torsional-flexural modes",B:"Resonance from traffic-induced harmonic loading",C:"Vortex shedding at the natural frequency of the bridge deck",D:"Galloping oscillation due to ice accumulation on cables"},
    correct:"A"
  },
  {
    round:1, category:"Famous Structures", difficulty:"medium", timeout:45,
    question:"What is the primary structural system of the Burj Khalifa that resists wind and seismic loads?",
    options:{A:"Outrigger truss with perimeter mega-columns",B:"Buttressed core with Y-shaped floor plate and setback geometry",C:"Tube-in-tube system with concrete inner core and steel outer tube",D:"Diagrid exoskeleton tied to a central concrete shear wall"},
    correct:"B"
  },
  {
    round:1, category:"Famous Structures", difficulty:"hard", timeout:45,
    question:"The Sydney Harbour Bridge — what is its structural system and approximate main span?",
    options:{A:"Through-arch bridge, approximately 503 metres",B:"Deck-arch bridge, approximately 290 metres",C:"Through-arch bridge, approximately 134 metres",D:"Half-through arch bridge, approximately 440 metres"},
    correct:"A"
  },
  {
    round:1, category:"Famous Structures", difficulty:"medium", timeout:45,
    question:"Fallingwater by Frank Lloyd Wright uses which structural principle to cantilever the terraces?",
    options:{A:"Prestressed concrete cantilevers anchored to the cliff face",B:"Reinforced concrete trays cantilevering from a masonry core with trellis reinforcement",C:"Steel moment frames concealed within the concrete parapets",D:"Post-tensioned slabs with external steel rods along terrace edges"},
    correct:"B"
  },

  // ── NEPAL GEOGRAPHY & AFFAIRS ────────────────────────────
  {
    round:1, category:"Nepal Geography & Affairs", difficulty:"medium", timeout:45,
    question:"Which of these rivers does NOT originate from the Tibetan Plateau and is sourced entirely within Nepal?",
    options:{A:"Koshi",B:"Karnali",C:"Rapti",D:"Arun"},
    correct:"C"
  },
  {
    round:1, category:"Nepal Geography & Affairs", difficulty:"medium", timeout:45,
    question:"The Gorkha earthquake of April 2015 (Mw 7.8) was generated by which fault type?",
    options:{A:"Strike-slip fault along the Indus-Tsangpo Suture Zone",B:"Thrust fault along the Main Frontal Thrust",C:"Normal fault associated with the South Tibetan Detachment",D:"Blind thrust fault along the Main Himalayan Thrust"},
    correct:"D"
  },
  {
    round:1, category:"Nepal Geography & Affairs", difficulty:"easy", timeout:45,
    question:"Nepal borders which two countries?",
    options:{A:"India and Bangladesh",B:"India and China",C:"India and Bhutan",D:"China and Pakistan"},
    correct:"B"
  },
  {
    round:1, category:"Nepal Geography & Affairs", difficulty:"medium", timeout:45,
    question:"Which is the deepest lake in Nepal?",
    options:{A:"Phewa Lake",B:"Rara Lake",C:"Tilicho Lake",D:"Shey Phoksundo Lake"},
    correct:"D"
  },
  {
    round:1, category:"Nepal Geography & Affairs", difficulty:"hard", timeout:45,
    question:"Nepal's federal structure under the 2015 Constitution designates Karnali Province as which number?",
    options:{A:"Province No. 4",B:"Province No. 5",C:"Province No. 6",D:"Province No. 7"},
    correct:"C"
  },
  {
    round:1, category:"Nepal Geography & Affairs", difficulty:"medium", timeout:45,
    question:"The Mechi River forms the border between Nepal and which Indian state?",
    options:{A:"Sikkim",B:"West Bengal",C:"Bihar",D:"Uttar Pradesh"},
    correct:"B"
  },

  // ── NEPAL ACCOUNTING & TAXATION ──────────────────────────
  {
    round:1, category:"Nepal Accounting & Taxation", difficulty:"hard", timeout:45,
    question:"Under Nepal's Income Tax Act 2058, below what annual tax liability is a taxpayer exempt from advance tax?",
    options:{A:"Rs 5,000",B:"Rs 7,500",C:"Rs 10,000",D:"Rs 2,500"},
    correct:"C"
  },
  {
    round:1, category:"Nepal Accounting & Taxation", difficulty:"hard", timeout:45,
    question:"Nepal's VAT Act requires a registered person to file returns within how many days after the end of each tax period?",
    options:{A:"15 days",B:"25 days",C:"30 days",D:"10 days"},
    correct:"B"
  },
  {
    round:1, category:"Nepal Accounting & Taxation", difficulty:"hard", timeout:45,
    question:"Under Nepal's Income Tax Act 2058, which payment is specifically classified as a final withholding payment?",
    options:{A:"Salary income of resident employees",B:"Rental income paid by a resident entity to an individual",C:"Dividend payments from a resident company to resident individuals",D:"Professional fees paid to a resident individual under Rs 50,000"},
    correct:"C"
  },
  {
    round:1, category:"Nepal Accounting & Taxation", difficulty:"medium", timeout:45,
    question:"Which body in Nepal is responsible for setting accounting standards and has adopted NFRS?",
    options:{A:"Nepal Rastra Bank",B:"Inland Revenue Department",C:"Accounting Standards Board of Nepal (ASB)",D:"Institute of Chartered Accountants of Nepal (ICAN)"},
    correct:"C"
  },
  {
    round:1, category:"Nepal Accounting & Taxation", difficulty:"medium", timeout:45,
    question:"Under Nepal's Company Act, a private limited company must hold its AGM within how many months after fiscal year end?",
    options:{A:"3 months",B:"6 months",C:"9 months",D:"12 months"},
    correct:"B"
  },
  {
    round:1, category:"Nepal Accounting & Taxation", difficulty:"hard", timeout:45,
    question:"Under Nepal's Income Tax Act 2058, what depreciation method is mandated for tax purposes?",
    options:{A:"Straight-line method",B:"Written-down value (declining balance) on pooled asset classes",C:"Sum-of-years-digits method",D:"Units-of-production method"},
    correct:"B"
  },

  // ── GENERAL KNOWLEDGE ────────────────────────────────────
  {
    round:1, category:"General Knowledge", difficulty:"medium", timeout:45,
    question:"Which correctly describes the difference between stress and strain?",
    options:{A:"Stress is dimensionless; strain has units of force per area",B:"Stress is force per unit area; strain is the ratio of deformation to original dimension",C:"Both are dimensionless ratios but strain is always larger",D:"Stress describes deformation; strain describes the internal force state"},
    correct:"B"
  },
  {
    round:1, category:"General Knowledge", difficulty:"medium", timeout:45,
    question:"How does the moment magnitude scale (Mw) differ from the Richter scale for large earthquakes?",
    options:{A:"Richter is logarithmic; Mw is linear",B:"Richter saturates above Mw 7; Mw remains accurate for large and distant events",C:"Richter measures ground acceleration; Mw measures energy release directly",D:"They are identical above magnitude 7.0 and diverge only for small events"},
    correct:"B"
  },
  {
    round:1, category:"General Knowledge", difficulty:"medium", timeout:45,
    question:"Carbon fibre reinforced polymer (CFRP) has a tensile strength approximately how many times greater than structural steel by unit weight?",
    options:{A:"2 times",B:"5 times",C:"10 times",D:"20 times"},
    correct:"C"
  },
  {
    round:1, category:"General Knowledge", difficulty:"medium", timeout:45,
    question:"Factor of safety in structural design is most accurately described as:",
    options:{A:"The ratio of ultimate load to working load",B:"The inverse of the probability of failure",C:"A multiplier applied to material strength to account for uncertainty",D:"The ratio of structural capacity to demand under service conditions"},
    correct:"A"
  },
  {
    round:1, category:"General Knowledge", difficulty:"hard", timeout:45,
    question:"In finite element analysis, what does ill-conditioning of the stiffness matrix typically indicate?",
    options:{A:"Insufficient mesh density in high-stress regions",B:"Near-singular matrix due to mechanisms, rigid body modes, or extreme aspect ratios",C:"Incompatible displacement fields between adjacent elements",D:"Numerical round-off error exceeding the solver tolerance"},
    correct:"B"
  },
  {
    round:1, category:"General Knowledge", difficulty:"medium", timeout:45,
    question:"Which material has the highest thermal expansion coefficient, making it most susceptible to thermal movement?",
    options:{A:"Structural steel",B:"Aluminium",C:"Reinforced concrete",D:"Timber"},
    correct:"B"
  },
  {
    round:1, category:"General Knowledge", difficulty:"medium", timeout:45,
    question:"Poisson's ratio for most structural steels is approximately:",
    options:{A:"0.20",B:"0.25",C:"0.30",D:"0.35"},
    correct:"C"
  },
  {
    round:1, category:"General Knowledge", difficulty:"medium", timeout:45,
    question:"A transfer plate in a high-rise building primarily serves which function?",
    options:{A:"A thick slab transferring column loads to an outrigger truss",B:"A rigid diaphragm redistributing lateral loads between cores",C:"A heavily reinforced floor transferring loads from discontinuous columns above to different members below",D:"A post-tensioned plate spanning between shear walls to reduce deflection"},
    correct:"C"
  },
  {
    round:1, category:"General Knowledge", difficulty:"medium", timeout:45,
    question:"The modulus of elasticity of structural steel is approximately how many times greater than normal-weight concrete?",
    options:{A:"5 times",B:"7 times",C:"10 times",D:"14 times"},
    correct:"C"
  },
  {
    round:1, category:"General Knowledge", difficulty:"medium", timeout:45,
    question:"In soil mechanics, liquefaction potential of saturated sandy soil under seismic loading is primarily governed by which index?",
    options:{A:"Relative density and fines content alone",B:"Cyclic stress ratio (CSR) compared to cyclic resistance ratio (CRR)",C:"Cone penetration resistance and groundwater depth independently",D:"Atterberg limits and plasticity index"},
    correct:"B"
  },
  {
    round:1, category:"General Knowledge", difficulty:"hard", timeout:45,
    question:"The Great Wall of China in its Ming Dynasty sections is primarily constructed of which material?",
    options:{A:"Quarried granite blocks with lime mortar",B:"Fired brick and tamped earth with lime and sticky rice mortar",C:"Mass concrete with rubble aggregate",D:"Dry-stacked basalt with no mortar binding"},
    correct:"B"
  },
  {
    round:1, category:"General Knowledge", difficulty:"medium", timeout:45,
    question:"What does full composite action in a steel-concrete composite beam mean?",
    options:{A:"The steel beam reaches its plastic moment before the concrete crushes",B:"Sufficient shear connectors fully transfer horizontal shear at the interface with no slip",C:"The concrete slab carries 100% of compression and steel 100% of tension",D:"The neutral axis lies exactly at the steel-concrete interface"},
    correct:"B"
  },
  {
    round:1, category:"General Knowledge", difficulty:"medium", timeout:45,
    question:"Which country has the highest number of UNESCO World Heritage Sites as of 2024?",
    options:{A:"China",B:"Italy",C:"Spain",D:"France"},
    correct:"B"
  },
  {
    round:1, category:"Nepal Geography & Affairs", difficulty:"medium", timeout:45,
    question:"Which of Nepal's provinces shares a border with India on three sides and China on one side?",
    options:{A:"Province No. 1",B:"Madhesh Province",C:"Lumbini Province",D:"Karnali Province"},
    correct:"A"
  },
  {
    round:1, category:"Structural Engineering", difficulty:"hard", timeout:45,
    question:"In reinforced concrete design, which condition defines a tension-controlled section per ACI 318?",
    options:{A:"Net tensile strain at extreme tension steel is at least 0.002",B:"Net tensile strain at extreme tension steel is at least 0.005",C:"The neutral axis depth is less than half the effective depth",D:"The reinforcement ratio is below 0.75 times the balanced ratio"},
    correct:"B"
  },

  // ══════════════════════════════════════════════════════════
  //  ROUND 2 — BUZZER ROUND  (30 questions)
  // ══════════════════════════════════════════════════════════

  {
    round:2, category:"Structural Engineering", difficulty:"hard", timeout:30,
    question:"What is the effective length factor K for a column fixed at the base and free to translate and rotate at the top?",
    options:{A:"0.5",B:"0.7",C:"1.0",D:"2.0"},
    correct:"D"
  },
  {
    round:2, category:"Structural Engineering", difficulty:"hard", timeout:30,
    question:"In plastic analysis of a propped cantilever under uniform load, how many plastic hinges form a mechanism?",
    options:{A:"1",B:"2",C:"3",D:"4"},
    correct:"B"
  },
  {
    round:2, category:"Structural Engineering", difficulty:"hard", timeout:30,
    question:"Which correctly defines the strong axis of a W-section?",
    options:{A:"The axis about which the section has the smaller moment of inertia",B:"The X-X axis parallel to the flanges about which bending resistance is greatest",C:"The axis that minimises lateral-torsional buckling susceptibility",D:"The axis perpendicular to the web used for minor-axis bending"},
    correct:"B"
  },
  {
    round:2, category:"Structural Engineering", difficulty:"hard", timeout:30,
    question:"Per ACI 318, development length of a straight tension bar is most influenced by which parameters?",
    options:{A:"Bar diameter and concrete unit weight",B:"Bar yield strength and concrete compressive strength alone",C:"Bar spacing and concrete cover through the confinement term alone",D:"Bar diameter, confinement index, and the combined fy divided by root f-prime-c term"},
    correct:"D"
  },
  {
    round:2, category:"Structural Engineering", difficulty:"medium", timeout:30,
    question:"What does the shear centre of a cross-section represent?",
    options:{A:"The point through which shear force must act to produce no twisting",B:"The centroid of the shear stress distribution",C:"The point equidistant from the extreme shear flow lines",D:"The intersection of principal stress trajectories"},
    correct:"A"
  },
  {
    round:2, category:"Structural Engineering", difficulty:"hard", timeout:30,
    question:"Moment redistribution in continuous RC beams is predicated on which structural behaviour?",
    options:{A:"Elastic shortening of compression steel",B:"Ductile rotation capacity at yielded sections allowing load redistribution to under-stressed regions",C:"Creep relaxation reducing peak moments over time",D:"Tension stiffening between cracks increasing effective stiffness"},
    correct:"B"
  },
  {
    round:2, category:"ASCE / IBC Codes", difficulty:"hard", timeout:30,
    question:"What is the ASCE 7 live load for hospital operating rooms and laboratories?",
    options:{A:"60 psf",B:"80 psf",C:"100 psf",D:"40 psf"},
    correct:"B"
  },
  {
    round:2, category:"ASCE / IBC Codes", difficulty:"hard", timeout:30,
    question:"Under ASCE 7, Site Class F is assigned when which condition exists?",
    options:{A:"Average shear wave velocity less than 200 ft/s",B:"More than 10 ft of soft clay with plasticity index greater than 20",C:"Liquefiable soils, quick sensitive clays, or collapsible weakly cemented soils",D:"Average SPT N-value less than 15 for the top 100 ft"},
    correct:"C"
  },
  {
    round:2, category:"ASCE / IBC Codes", difficulty:"hard", timeout:30,
    question:"Which structural system has the highest Response Modification Factor R in ASCE 7?",
    options:{A:"Special moment-resisting frame — R = 8",B:"Special steel concentrically braced frame — R = 6",C:"Bearing wall with special reinforced concrete shear walls — R = 5",D:"Dual system with SMRF and special concrete shear walls — R = 7"},
    correct:"A"
  },
  {
    round:2, category:"Famous Structures", difficulty:"hard", timeout:30,
    question:"The Petronas Twin Towers were unusual at the time of construction because their perimeter frame was made of what material?",
    options:{A:"High-strength structural steel with composite decks",B:"High-performance reinforced concrete with an 80 MPa mix design",C:"A hybrid steel-concrete tube with post-tensioned ring beams",D:"Prefabricated titanium-clad steel panels with hidden moment connections"},
    correct:"B"
  },
  {
    round:2, category:"Famous Structures", difficulty:"medium", timeout:30,
    question:"The Leaning Tower of Pisa leans primarily due to which soil condition?",
    options:{A:"Expansive clay swelling unevenly beneath the foundation",B:"Differential settlement in soft alluvial deposits of varying compressibility on the south side",C:"Erosion of foundation limestone on the north side by groundwater",D:"Inadequate pile depth on the south side during original construction"},
    correct:"B"
  },
  {
    round:2, category:"Nepal Geography & Affairs", difficulty:"medium", timeout:30,
    question:"The Araniko Highway connects Kathmandu to which point at the Nepal-China border?",
    options:{A:"Lhasa",B:"Shigatse",C:"Nyalam",D:"Kodari — the Nepalese border town at Rasuwa"},
    correct:"D"
  },
  {
    round:2, category:"Nepal Geography & Affairs", difficulty:"hard", timeout:30,
    question:"Which Nepalese district has the highest Human Development Index score per recent Nepal HDI reports?",
    options:{A:"Kathmandu",B:"Bhaktapur",C:"Lalitpur",D:"Kaski"},
    correct:"A"
  },
  {
    round:2, category:"Nepal Accounting & Taxation", difficulty:"hard", timeout:30,
    question:"Under Nepal's Income Tax Act 2058, what depreciation method is mandated for tax purposes?",
    options:{A:"Straight-line method",B:"Written-down value (declining balance) on pooled asset classes",C:"Sum-of-years-digits method",D:"Units-of-production method"},
    correct:"B"
  },
  {
    round:2, category:"Nepal Accounting & Taxation", difficulty:"medium", timeout:30,
    question:"Nepal's double taxation avoidance agreements are based primarily on which model treaty?",
    options:{A:"OECD Model Tax Convention",B:"UN Model Double Taxation Convention",C:"US Model Income Tax Convention",D:"Commonwealth Secretariat Model"},
    correct:"B"
  },
  {
    round:2, category:"General Knowledge", difficulty:"medium", timeout:30,
    question:"Modulus of elasticity of structural steel at 200 GPa is approximately how many times greater than normal-weight concrete?",
    options:{A:"5 times",B:"7 times",C:"10 times",D:"14 times"},
    correct:"C"
  },
  {
    round:2, category:"Structural Engineering", difficulty:"hard", timeout:30,
    question:"In cable-stayed bridge design, what is the primary function of the compression ring at deck level at mid-span?",
    options:{A:"To resist the horizontal component of stay cable forces that would otherwise shorten the deck",B:"To transfer shear between the deck and the pylon",C:"To resist uplift from asymmetric cable loading patterns",D:"To act as a tie rod preventing deck rotation about the pylon base"},
    correct:"A"
  },
  {
    round:2, category:"Structural Engineering", difficulty:"hard", timeout:30,
    question:"Which statement about flat plate punching shear is correct per ACI 318?",
    options:{A:"Punching shear strength is independent of column aspect ratio",B:"The critical perimeter is taken at d/2 from the column face where d is effective slab depth",C:"Flexural reinforcement does not contribute to punching shear resistance",D:"Punching shear failure is ductile and provides adequate warning before collapse"},
    correct:"B"
  },
  {
    round:2, category:"ASCE / IBC Codes", difficulty:"hard", timeout:30,
    question:"The ASCE 7 overstrength factor Ω₀ is used for which specific design check?",
    options:{A:"Amplifying seismic forces for elements that must remain elastic, such as collectors and connections",B:"Reducing required reinforcement quantities in ductile elements",C:"Verifying drift compatibility between structural and non-structural systems",D:"Increasing dead load factors for tension-controlled failure modes"},
    correct:"A"
  },
  {
    round:2, category:"Famous Structures", difficulty:"hard", timeout:30,
    question:"The Centre Pompidou in Paris — what is its primary structural system carrying floor loads?",
    options:{A:"Externally exposed diagonal steel bracing carrying floor beams via hanger rods",B:"Gerberette cast steel brackets on external columns supporting floor girders via tension rods",C:"Prestressed concrete cores with external post-tensioned slab cantilevers",D:"A space frame spanning between two mega-trusses at roof and ground level"},
    correct:"B"
  },
  {
    round:2, category:"Structural Engineering", difficulty:"medium", timeout:30,
    question:"What is the purpose of closely spaced transverse ties in the plastic hinge zone of a seismic RC column?",
    options:{A:"To increase axial load capacity by confining the concrete alone",B:"To prevent bar buckling, confine the concrete core, and improve ductility",C:"To prevent diagonal cracking under cyclic shear loading",D:"To transfer longitudinal shear between column and beam at the joint"},
    correct:"B"
  },
  {
    round:2, category:"General Knowledge", difficulty:"medium", timeout:30,
    question:"Nepal's only ICC-approved international cricket ground is located in which city?",
    options:{A:"Lalitpur",B:"Pokhara",C:"Kathmandu — Tribhuvan University Cricket Ground",D:"Bharatpur"},
    correct:"C"
  },
  {
    round:2, category:"Nepal Accounting & Taxation", difficulty:"medium", timeout:30,
    question:"What is the current corporate income tax rate for banks and financial institutions in Nepal?",
    options:{A:"25%",B:"30%",C:"35%",D:"20%"},
    correct:"B"
  },
  {
    round:2, category:"Structural Engineering", difficulty:"hard", timeout:30,
    question:"Which correctly describes tension field action in a steel plate girder?",
    options:{A:"Post-buckling diagonal tension resistance in web panels after shear buckling",B:"Catenary action in the bottom flange under large deflection",C:"Pre-tensioning of the web plate to delay buckling onset",D:"Residual stress redistribution after local yielding at load introduction points"},
    correct:"A"
  },
  {
    round:2, category:"Famous Structures", difficulty:"medium", timeout:30,
    question:"What innovation was critical to managing heat of hydration in the Hoover Dam's massive concrete pours?",
    options:{A:"Use of pozzolanic fly ash to reduce cement content",B:"Cooling by circulating chilled water through embedded pipes in fresh concrete",C:"Night-time-only pours during cooler temperatures",D:"Pre-cooling of aggregate with liquid nitrogen before batching"},
    correct:"B"
  },
  {
    round:2, category:"ASCE / IBC Codes", difficulty:"medium", timeout:30,
    question:"Under IBC, which structures must satisfy special seismic detailing requirements?",
    options:{A:"Any structure in SDC A or B",B:"Structures in SDC C through F",C:"Structures in SDC D through F only",D:"Only essential facilities in SDC C"},
    correct:"C"
  },
  {
    round:2, category:"Nepal Geography & Affairs", difficulty:"medium", timeout:30,
    question:"The Seti River, which flows underground near Pokhara, eventually joins which major river?",
    options:{A:"Gandaki (Narayani)",B:"Karnali",C:"Trishuli",D:"Marsyangdi"},
    correct:"A"
  },
  {
    round:2, category:"Structural Engineering", difficulty:"hard", timeout:30,
    question:"What is the limiting width-to-thickness ratio λp for a compact W-section flange in A992 steel (Fy = 50 ksi) per AISC?",
    options:{A:"7.22",B:"9.15",C:"11.00",D:"6.42"},
    correct:"B"
  },
  {
    round:2, category:"General Knowledge", difficulty:"medium", timeout:30,
    question:"Which country has the world's longest coastline?",
    options:{A:"Russia",B:"Australia",C:"Canada",D:"Norway"},
    correct:"C"
  },
  {
    round:2, category:"Structural Engineering", difficulty:"hard", timeout:30,
    question:"What does phi = 0.75 apply to in reinforced concrete design per ACI 318-19?",
    options:{A:"Axial compression with ties",B:"Shear and torsion",C:"Flexure of tension-controlled sections",D:"Bearing on concrete"},
    correct:"B"
  },

  // ══════════════════════════════════════════════════════════
  //  ROUND 3 — RAPID FIRE  (5 sets × 8 questions = 40)
  //  No options — verbal answers only.
  //  answer field is what the host sees and uses to judge.
  // ══════════════════════════════════════════════════════════

  // ── SET 1 ─────────────────────────────────────────────────
  {round:3, set:1, order:1, category:"Rapid Fire", difficulty:"medium", timeout:60,
   question:"What is the minimum design live load for a residential dwelling floor per ASCE 7?",
   answer:"40 psf"},
  {round:3, set:1, order:2, category:"Rapid Fire", difficulty:"medium", timeout:60,
   question:"Name the failure mode where a long slender column fails before reaching material yield strength.",
   answer:"Elastic buckling — Euler buckling"},
  {round:3, set:1, order:3, category:"Rapid Fire", difficulty:"easy", timeout:60,
   question:"What is the capital city of Nepal's Gandaki Province?",
   answer:"Pokhara"},
  {round:3, set:1, order:4, category:"Rapid Fire", difficulty:"medium", timeout:60,
   question:"What does SMRF stand for in seismic design?",
   answer:"Special Moment-Resisting Frame"},
  {round:3, set:1, order:5, category:"Rapid Fire", difficulty:"medium", timeout:60,
   question:"What is the approximate yield strength of ASTM A992 steel used for W-sections?",
   answer:"50 ksi or 345 MPa"},
  {round:3, set:1, order:6, category:"Rapid Fire", difficulty:"easy", timeout:60,
   question:"Which river forms the far-western border between India and Nepal?",
   answer:"Mahakali River"},
  {round:3, set:1, order:7, category:"Rapid Fire", difficulty:"medium", timeout:60,
   question:"What is the minimum clear cover for reinforcement in a concrete slab not exposed to weather per ACI 318?",
   answer:"Three-quarters of an inch — 20 mm"},
  {round:3, set:1, order:8, category:"Rapid Fire", difficulty:"medium", timeout:60,
   question:"Was the fault movement in the 2015 Gorkha earthquake normal, reverse, or strike-slip?",
   answer:"Reverse — thrust fault"},

  // ── SET 2 ─────────────────────────────────────────────────
  {round:3, set:2, order:1, category:"Rapid Fire", difficulty:"medium", timeout:60,
   question:"Per ASCE 7, what Risk Category applies to a primary school with 400 students?",
   answer:"Risk Category III"},
  {round:3, set:2, order:2, category:"Rapid Fire", difficulty:"easy", timeout:60,
   question:"What is the national bird of Nepal?",
   answer:"Himalayan Monal — Danphe"},
  {round:3, set:2, order:3, category:"Rapid Fire", difficulty:"medium", timeout:60,
   question:"In structural steel design, what does compact section mean?",
   answer:"Width-to-thickness ratios allow the full plastic moment to be reached before local buckling"},
  {round:3, set:2, order:4, category:"Rapid Fire", difficulty:"medium", timeout:60,
   question:"What is the approximate self-weight of normal-weight reinforced concrete in kN per cubic metre?",
   answer:"24 to 25 kN per cubic metre — 150 pcf"},
  {round:3, set:2, order:5, category:"Rapid Fire", difficulty:"easy", timeout:60,
   question:"Name the tallest peak in the world.",
   answer:"Mount Everest — Sagarmatha"},
  {round:3, set:2, order:6, category:"Rapid Fire", difficulty:"hard", timeout:60,
   question:"What is the phi factor for shear in reinforced concrete per ACI 318-19?",
   answer:"0.75"},
  {round:3, set:2, order:7, category:"Rapid Fire", difficulty:"medium", timeout:60,
   question:"What tax is levied on goods and services at the point of consumption in Nepal and at what flat rate?",
   answer:"VAT — Value Added Tax — at 13 percent"},
  {round:3, set:2, order:8, category:"Rapid Fire", difficulty:"medium", timeout:60,
   question:"How many districts does Nepal have under its current federal structure?",
   answer:"77 districts"},

  // ── SET 3 ─────────────────────────────────────────────────
  {round:3, set:3, order:1, category:"Rapid Fire", difficulty:"medium", timeout:60,
   question:"Name the redistribution of stresses in a steel section after first yield, allowing it to carry additional load.",
   answer:"Plastic redistribution — reaching the plastic moment Mp"},
  {round:3, set:3, order:2, category:"Rapid Fire", difficulty:"medium", timeout:60,
   question:"Name the two primary components of foundation settlement on clay soil.",
   answer:"Immediate elastic settlement and consolidation settlement"},
  {round:3, set:3, order:3, category:"Rapid Fire", difficulty:"medium", timeout:60,
   question:"What does ductility mean for structural steel?",
   answer:"The ability to undergo large plastic deformation without fracture"},
  {round:3, set:3, order:4, category:"Rapid Fire", difficulty:"hard", timeout:60,
   question:"What is the approximate basic wind speed for Risk Category II buildings in most of the central United States per ASCE 7-22?",
   answer:"115 mph — accept 110 to 120 mph"},
  {round:3, set:3, order:5, category:"Rapid Fire", difficulty:"easy", timeout:60,
   question:"What country has the world's longest coastline?",
   answer:"Canada"},
  {round:3, set:3, order:6, category:"Rapid Fire", difficulty:"medium", timeout:60,
   question:"What is Nepal's fiscal year start month in the Gregorian calendar?",
   answer:"Mid-July — Shrawan 1 of the Nepali calendar"},
  {round:3, set:3, order:7, category:"Rapid Fire", difficulty:"medium", timeout:60,
   question:"What is the name of the structural system of the Eiffel Tower that allows it to flex in wind by up to 9 cm?",
   answer:"Open wrought iron lattice frame"},
  {round:3, set:3, order:8, category:"Rapid Fire", difficulty:"hard", timeout:60,
   question:"Name any three of the five primary causes of prestress loss in a post-tensioned concrete member.",
   answer:"Elastic shortening, creep, shrinkage, friction losses, anchor set or slip — any three accepted"},

  // ── SET 4 ─────────────────────────────────────────────────
  {round:3, set:4, order:1, category:"Rapid Fire", difficulty:"hard", timeout:60,
   question:"Per AISC, what is the limiting flange width-to-thickness ratio λp for a compact W-section in A992 steel?",
   answer:"9.15 — equals 0.38 times the square root of E over Fy"},
  {round:3, set:4, order:2, category:"Rapid Fire", difficulty:"easy", timeout:60,
   question:"What is the official language of Nepal?",
   answer:"Nepali"},
  {round:3, set:4, order:3, category:"Rapid Fire", difficulty:"hard", timeout:60,
   question:"What is the minimum standard edge distance for a bolt hole in a steel plate per AISC?",
   answer:"1.25 times the nominal bolt diameter — see AISC Table J3.4"},
  {round:3, set:4, order:4, category:"Rapid Fire", difficulty:"easy", timeout:60,
   question:"Who were the first two people to summit Mount Everest?",
   answer:"Tenzing Norgay and Edmund Hillary — both must be named"},
  {round:3, set:4, order:5, category:"Rapid Fire", difficulty:"medium", timeout:60,
   question:"What is the angle of internal friction a measure of in geotechnical engineering?",
   answer:"The shear strength of granular soil — the angle at which soil shears relative to the normal stress on the failure plane"},
  {round:3, set:4, order:6, category:"Rapid Fire", difficulty:"medium", timeout:60,
   question:"What is the current corporate income tax rate for banks and financial institutions in Nepal?",
   answer:"30 percent"},
  {round:3, set:4, order:7, category:"Rapid Fire", difficulty:"medium", timeout:60,
   question:"What does TDS stand for in Nepal's tax system?",
   answer:"Tax Deducted at Source"},
  {round:3, set:4, order:8, category:"Rapid Fire", difficulty:"hard", timeout:60,
   question:"What is the strouhal number used to predict in wind engineering for a high-rise building?",
   answer:"The vortex shedding frequency — St equals f times D divided by V"},

  // ── SET 5 ─────────────────────────────────────────────────
  {round:3, set:5, order:1, category:"Rapid Fire", difficulty:"hard", timeout:60,
   question:"What is the primary structural difference between a plate girder and a rolled wide-flange beam?",
   answer:"A plate girder is fabricated by welding flange plates to a web plate — not hot-rolled — typically with a deeper thinner web"},
  {round:3, set:5, order:2, category:"Rapid Fire", difficulty:"easy", timeout:60,
   question:"Name the highest navigable lake in the world.",
   answer:"Lake Titicaca"},
  {round:3, set:5, order:3, category:"Rapid Fire", difficulty:"hard", timeout:60,
   question:"In geotechnical engineering, what does dynamic compaction involve?",
   answer:"Repeatedly dropping a heavy weight or tamper from height to densify loose granular soils using impact energy"},
  {round:3, set:5, order:4, category:"Rapid Fire", difficulty:"medium", timeout:60,
   question:"What is the approximate height of the rebuilt Dharahara tower in Kathmandu?",
   answer:"72 metres — the original destroyed in 2015 was approximately 62 metres"},
  {round:3, set:5, order:5, category:"Rapid Fire", difficulty:"medium", timeout:60,
   question:"What is the effective length factor K for a column that is pinned at both ends with no lateral sway?",
   answer:"1.0"},
  {round:3, set:5, order:6, category:"Rapid Fire", difficulty:"medium", timeout:60,
   question:"What VAT rate applies to most goods and services in Nepal?",
   answer:"13 percent"},
  {round:3, set:5, order:7, category:"Rapid Fire", difficulty:"hard", timeout:60,
   question:"In wind tunnel testing, what relationship does the Strouhal number St describe?",
   answer:"St equals fD over V — relating vortex shedding frequency f, building width D, and wind speed V"},
  {round:3, set:5, order:8, category:"Rapid Fire", difficulty:"medium", timeout:60,
   question:"Name the three types of seismic structural irregularities that can increase design forces in ASCE 7.",
   answer:"Vertical irregularities and horizontal irregularities — examples include torsional, re-entrant corner, soft storey, weak storey, mass, geometric — accept any three valid types"}

];

module.exports = questions;
