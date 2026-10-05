export interface ConfigurationItem {
  id: string;
  name: string;
  type: string;
  superArea: string;
  carpetArea: string;
  balconyArea: string;
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  highlights: string[];
  startingPrice: string;
  floorPlanImg: string;
  badge?: string;
  description: string;
}

export interface MasterPlanHotspot {
  id: number;
  title: string;
  category: 'tower' | 'clubhouse' | 'amenity' | 'green' | 'entrance';
  x: number; // percentage from left
  y: number; // percentage from top
  description: string;
  tag: string;
}

export interface AmenityCategory {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  heroImage: string;
  items: {
    title: string;
    description: string;
    tag?: string;
  }[];
}

export interface SpecificationCategory {
  category: string;
  icon: string;
  items: { feature: string; detail: string }[];
}

export interface LocationPoint {
  category: 'Connectivity' | 'Metro' | 'Hospitals' | 'Education' | 'Retail & Leisure' | 'Business Hubs';
  name: string;
  distance: string;
  travelTime: string;
  description: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'all' | 'architecture' | 'interiors' | 'amenities' | 'greens' | 'masterplan';
  image: string;
  description: string;
}

export interface IvoryFaqItem {
  question: string;
  answer: string;
  category: 'General' | 'Pricing & Payment' | 'Amenities & Handover' | 'Legal & RERA';
}

export const IVORY_COUNTY_DATA = {
  projectOverview: {
    name: 'Ivory County',
    tagline: 'A New Expression of Architectural Grandeur',
    subHeadline: 'Ultra-Luxury 3, 4 & 5 BHK Residences in Sector 115, Central Noida',
    location: 'Sector 115, Noida, Uttar Pradesh 201301',
    developer: 'County Group',
    promoter: 'Themecounty Private Limited (UPRERAPRM206951)',
    landArea: 'Approx. 28 Acres',
    greenCover: '11+ Acres of Continuous Landscaped Greens',
    totalTowers: '24 Iconic Towers',
    totalResidences: '2,372 Premium Residences',
    clubhouses: '2 Magnificent Clubhouses (Club Ivor & Club Aurus)',
    status: 'Phase-wise Development (Under Active Construction)',
    possession: 'Phase-wise from 2028 onwards (Verify on UP RERA)',
    reraNumbers: {
      phase1: 'UPRERAPRJ256314',
      phase2: 'UPRERAPRJ115902',
      phase3: 'UPRERAPRJ507062',
      portalUrl: 'https://www.up-rera.in',
    },
    contact: {
      phone: '+91 96543 22224',
      phoneRaw: '+919654322224',
      whatsapp: '+91 96543 22224',
      email: 'sales@agarwalandgehlotrealtors.com',
      officeAddress: 'Agarwal & Gehlot Realtors, Sector 115 / Central Noida Office, Noida, UP',
    },
    paymentPlan: '40:60 Flexible Construction Linked & Special Payment Schemes Available',
    pricingNote: 'Prices starting from ₹2.95 Cr* onwards (Subject to unit availability & floor choice)',
  },

  keyStats: [
    { value: '28', unit: 'Acres', label: 'Grand Master Estate' },
    { value: '11', unit: 'Acres', label: 'Continuous Biophilic Greens' },
    { value: '2', unit: 'Landmarks', label: 'Ultra-Luxury Clubhouses' },
    { value: '2,372', unit: 'Residences', label: 'Limited Luxury Units' },
    { value: '40:60', unit: 'Plan', label: 'Convenient Payment Plan' },
  ],

  aboutStory: {
    headline: 'Where Timeless Architecture Meets Biophilic Splendor',
    paragraph1:
      'Spread gracefully across 28 sprawling acres in the heart of Sector 115, Noida, Ivory County represents the pinnacle of County Group’s luxury legacy. Conceived as a low-density sanctuary enveloped by over 11 acres of landscaped botanical gardens and curated sculpture courts, it redefines the paradigm of modern NCR living.',
    paragraph2:
      'Every residence is sculpted with expansive wraparound balconies, 11-foot finished ceiling heights, corner-to-corner cross ventilation, and panoramic vistas of pristine greens. Home to dual grand clubhouses—Club Ivor and the exclusive Club Aurus—residents enjoy an unmatched suite of hospitality, wellness, sporting, and social privileges.',
    quote: '“Ivory County is not merely a residence; it is an enduring family legacy crafted with immaculate craftsmanship and bespoke luxury.”',
    bullets: [
      'Over 11 acres of curated botanical gardens and pedestrian-only central greens',
      'Dual clubhouses spanning over 1,00,000+ sq. ft. of elite recreational amenities',
      'Ivory Gold: An elite ultra-luxury collection of 4 & 5 BHK bespoke palatial residences',
      'Strategic Sector 115 location with immediate access to FNG, Metro, and Expressway corridors',
    ],
  },

  configurations: [
    {
      id: '3bhk-regular',
      name: '3 BHK Luxury Suite',
      type: '3 BHK + 3 Toilets',
      superArea: '2,034 Sq. Ft.',
      carpetArea: '1,320 Sq. Ft.',
      balconyArea: '360 Sq. Ft.',
      bedrooms: 3,
      bathrooms: 3,
      balconies: 3,
      startingPrice: '₹ 2.95 Cr*',
      floorPlanImg: '/project-details/ivory building.webp',
      badge: 'Popular Choice',
      description: 'Generously proportioned 3 BHK designed with an expansive living-dining hall, private master suite with walk-in wardrobe, and three expansive balconies providing triple-side ventilation.',
      highlights: ['Corner-to-corner natural daylight', 'Separate wet and dry kitchen layout', 'Expansive 6-foot wide balconies', 'Imported marble flooring in living spaces'],
    },
    {
      id: '3bhk-utility',
      name: '3 BHK + Utility Grand',
      type: '3 BHK + 3 Toilets + Maid Room',
      superArea: '2,304 Sq. Ft.',
      carpetArea: '1,495 Sq. Ft.',
      balconyArea: '410 Sq. Ft.',
      bedrooms: 3,
      bathrooms: 4,
      balconies: 4,
      startingPrice: '₹ 3.35 Cr*',
      floorPlanImg: '/project-details/ivory gaarden.png',
      badge: 'Most Preferred',
      description: 'Engineered for families needing dedicated support quarters. Features an independent maid room with private toilet, oversized foyer, and seamless indoor-outdoor terrace living.',
      highlights: ['Dedicated utility & servant room with separate entry', 'Double-height deck balcony for master suite', 'VRV central air conditioning provision', 'Powder room for visiting guests'],
    },
    {
      id: '4bhk-classic',
      name: '4 BHK Grand Residence',
      type: '4 BHK + 4 Toilets + Maid Room',
      superArea: '2,727 Sq. Ft.',
      carpetArea: '1,780 Sq. Ft.',
      balconyArea: '490 Sq. Ft.',
      bedrooms: 4,
      bathrooms: 5,
      balconies: 4,
      startingPrice: '₹ 3.98 Cr*',
      floorPlanImg: '/project-details/ivory garden.webp',
      badge: 'Family Luxury',
      description: 'A lavish 4-bedroom sanctuary featuring distinct formal and informal living zones, master bedroom with private deck and dressing gallery, and 4 en-suite bathrooms.',
      highlights: ['4 luxury en-suite bedrooms with attached baths', 'Oversized living lounge opening to continuous greens', 'Italian marble flooring in all major living areas', 'Dedicated servant quarters with service lift access'],
    },
    {
      id: '4bhk-estate',
      name: '4 BHK Estate Suite',
      type: '4 BHK + 5 Toilets + Family Lounge + Maid Room',
      superArea: '3,195 Sq. Ft.',
      carpetArea: '2,110 Sq. Ft.',
      balconyArea: '580 Sq. Ft.',
      bedrooms: 4,
      bathrooms: 5,
      balconies: 5,
      startingPrice: '₹ 4.65 Cr*',
      floorPlanImg: '/project-details/ivory sitting.jpg',
      badge: 'Signature Estate',
      description: 'Sprawling high-floor residence boasting double master suites, central family entertainment lounge, gourmet island kitchen, and wraparound panoramic sky decks.',
      highlights: ['Dual master suites with luxury bathtubs', 'Gourmet kitchen with island breakfast counter', 'Extra spacious 580 sq ft total deck balconies', 'Unobstructed panoramic forest & clubhouse views'],
    },
    {
      id: 'ivory-gold-4bhk',
      name: 'Ivory Gold 4 BHK Palatial',
      type: 'Ivory Gold • 4 BHK + Family Lounge + Study + 2 Maid Rooms',
      superArea: '3,987 Sq. Ft. & 4,707 Sq. Ft.',
      carpetArea: '2,650 - 3,120 Sq. Ft.',
      balconyArea: '780 - 950 Sq. Ft.',
      bedrooms: 4,
      bathrooms: 6,
      balconies: 5,
      startingPrice: 'Price on Request',
      floorPlanImg: '/cover/ivory-county.webp',
      badge: 'Ultra-Luxury • Ivory Gold',
      description: 'Part of the ultra-exclusive Ivory Gold tower collection. Private high-speed elevator arrival lobby, double-height living room ceilings, private plunge deck, and bespoke designer finishes.',
      highlights: ['Private elevator lobby with biometric entry', 'Grand double-height ceiling in formal living salon', 'Dedicated family lounge plus private executive study', 'Access to exclusive Club Aurus VIP concierge'],
    },
    {
      id: 'ivory-gold-5bhk',
      name: 'Ivory Gold 5 BHK Presidential Penthouse',
      type: 'Ivory Gold • 5 BHK + 2 Family Lounges + Private Terrace + 2 Maid Rooms',
      superArea: '6,939 Sq. Ft.',
      carpetArea: '4,650 Sq. Ft.',
      balconyArea: '1,450 Sq. Ft.',
      bedrooms: 5,
      bathrooms: 7,
      balconies: 6,
      startingPrice: 'Price on Request',
      floorPlanImg: '/project-details/IVORY BANNER.webp',
      badge: 'The Presidential Sky Villa',
      description: 'The crowning jewel of Sector 115 Noida. Nearly 7,000 sq ft of bespoke vertical luxury featuring dual family lounges, private heated plunge pool on sky terrace, and private gym suite.',
      highlights: ['Private rooftop sky terrace with private plunge pool', '5 ultra-spacious suites with bespoke walk-in dressing rooms', 'High-end VRV/VRF heating and cooling infrastructure', '3 reserved covered basement car parking slots'],
    },
  ] as ConfigurationItem[],

  amenitiesCategories: [
    {
      id: 'wellness',
      title: 'Hydro Wellness & Spa',
      subtitle: 'Restorative sanctuaries designed to rejuvenate mind, body, and spirit.',
      iconName: 'Sparkles',
      heroImage: '/project-details/ivory sitting.jpg',
      items: [
        { title: 'Temperature-Controlled Indoor Pool', description: 'Year-round climate-controlled all-weather lap pool with underwater mood lighting.' },
        { title: 'Olympic-Style Outdoor Swimming Pool', description: 'Expansive 50m outdoor infinity pool framed with sunken loungers and cabanas.' },
        { title: 'Luxury Spa & Swedish Steam Saunas', description: 'Separate ladies and gents therapy rooms with aromatherapy and jacuzzi suites.' },
        { title: 'Open-Air Yoga & Meditation Pavilion', description: 'Shaded wooden deck amidst tranquil water features and fragrant zen gardens.' },
        { title: 'State-of-the-Art Gymnasium', description: 'TechnoGym equipment, cardio studio, spin classes, and personal trainer zone.' },
      ],
    },
    {
      id: 'sports',
      title: 'Active Sports Arena',
      subtitle: 'Professional-grade courts and fields for athletic pursuits at every skill level.',
      iconName: 'Trophy',
      heroImage: '/project-details/ivory gaarden.png',
      items: [
        { title: 'All-Weather Synthetic Tennis Courts', description: 'Tournament-spec floodlit tennis courts for day and night games.' },
        { title: 'Air-Conditioned Indoor Badminton Courts', description: 'Multi-court indoor stadium with shock-absorbing wooden flooring.' },
        { title: 'Pickleball & Padel Courts', description: 'Modern racquets arena built to international competitive standards.' },
        { title: 'Cricket Pitch with Automated Bowling Nets', description: 'Dedicated floodlit cricket practice enclosure with speed tracking.' },
        { title: 'Squash Court & Table Tennis Lounge', description: 'Glass-back regulation squash arena and premium recreation lounge.' },
        { title: 'Dedicated Jogging & Cycling Tracks', description: '2.5 km rubberized track weaving through the uninterrupted 11-acre green spine.' },
      ],
    },
    {
      id: 'social',
      title: 'Club Ivor & Club Aurus',
      subtitle: 'Over 1,00,000 sq. ft. of elite social, dining, and celebratory venues.',
      iconName: 'Crown',
      heroImage: '/cover/ivory-county.webp',
      items: [
        { title: 'Grand Banquet Ballroom', description: 'Lavish high-ceiling banquet hall with pre-function lawn for grand weddings and private galas.' },
        { title: 'Fine Dining Restaurant & Alfresco Cafe', description: 'Gourmet multi-cuisine restaurant managed by premier hospitality operators.' },
        { title: 'Private 32-Seater Dolby Cinema', description: 'Private screening theater with plush leather recliners and acoustic sound isolation.' },
        { title: 'Executive Business Lounge & Co-Working', description: 'High-speed meeting pods, conference rooms, video-conferencing, and quiet workstations.' },
        { title: 'Luxury Guest Suites', description: 'Hotel-grade serviced suites for hosting visiting friends and extended family members.' },
      ],
    },
    {
      id: 'kids',
      title: 'Children’s Kingdom & Play',
      subtitle: 'Safe, stimulating environments designed for learning, joy, and physical activity.',
      iconName: 'Smile',
      heroImage: '/project-details/ivory garden.webp',
      items: [
        { title: 'Interactive Kids Wet-Play Water Park', description: 'Splash pads, shallow fountains, and water cannons with non-slip safety surfacing.' },
        { title: 'Theme Adventure Play Park', description: 'Timber treehouses, rope courses, ziplines, and sandpits with soft rubber flooring.' },
        { title: 'Toddlers Indoor Creche & Play Area', description: 'Nurturing daycare zone with sensory toys, soft-play walls, and CCTV monitoring.' },
        { title: 'Skating Rink & BMX Skate Park', description: 'Smooth finished ramp and circuit for roller-skating, inline blading, and skateboarding.' },
      ],
    },
    {
      id: 'landscape',
      title: 'Biophilic 11-Acre Landscape',
      subtitle: 'A verdant green ecosystem with 10,000+ native trees and calming waterbodies.',
      iconName: 'Trees',
      heroImage: '/project-details/IVORY BANNER.webp',
      items: [
        { title: 'Central Sculpture Promenade', description: 'Majestic art installations surrounded by formal fountains and evening accent lights.' },
        { title: 'Festival Court & Amphitheatre', description: 'Open-air stepped amphitheater for community cultural performances and movie nights.' },
        { title: 'Reflexology Pathways & Herb Garden', description: 'Textured stone sensory walkways winding through curated medicinal herbal flora.' },
        { title: 'Pet Park with Agility Trail', description: 'Fenced dedicated off-leash lawn with agility hurdles, drinking stations, and waste pods.' },
      ],
    },
  ] as AmenityCategory[],

  masterPlanHotspots: [
    { id: 1, title: 'Grand Grandeur Entrance & Gateway', category: 'entrance', x: 12, y: 88, description: 'Triple-height monumental arrival portico with 24/7 RFID security and biometric boom barriers.', tag: 'Gate 1' },
    { id: 2, title: 'Club Ivor (Flagship Clubhouse)', category: 'clubhouse', x: 28, y: 52, description: '65,000 sq. ft. club featuring indoor heated pool, grand banquet, bowling alley, and fine dining.', tag: 'Main Club' },
    { id: 3, title: 'Club Aurus (Exclusive Gold Club)', category: 'clubhouse', x: 74, y: 38, description: 'Exclusive VIP club catering to the Ivory Gold tower residents with cigar lounge and private dining.', tag: 'Gold Club' },
    { id: 4, title: '11-Acre Central Landscaped Forest Spine', category: 'green', x: 50, y: 50, description: 'Continuous car-free central green belt with oxygen-rich flora, water cascades, and reflexology paths.', tag: 'Eco Spine' },
    { id: 5, title: 'Olympic-Spec Outdoor Infinity Pool & Deck', category: 'amenity', x: 38, y: 44, description: '50-meter outdoor lap pool with submerged daybeds, poolside bar counter, and jacuzzi jets.', tag: 'Hydro Zone' },
    { id: 6, title: 'Sports Arena: Tennis & Padel Courts', category: 'amenity', x: 82, y: 72, description: 'All-weather floodlit tennis courts, twin pickleball courts, and outdoor basketball half-court.', tag: 'Sports Hub' },
    { id: 7, title: 'Festival Court & Open-Air Amphitheatre', category: 'green', x: 44, y: 68, description: 'Stepped seating amphitheatre hosting weekend concerts, movie screenings, and festivals.', tag: 'Cultural Court' },
    { id: 8, title: 'Towers 1-12: Ivory Luxury Residences', category: 'tower', x: 24, y: 25, description: '3 & 4 BHK residences with optimal sun orientation and continuous balcony views over Central Noida.', tag: 'Luxury Towers' },
    { id: 9, title: 'Towers 14-24: Ivory Gold Collection', category: 'tower', x: 68, y: 22, description: 'Large-format 4 & 5 BHK palatial residences with private elevators and expansive double-height decks.', tag: 'Ivory Gold' },
    { id: 10, title: 'High-Street Retail & Convenience Plaza', category: 'entrance', x: 88, y: 88, description: 'Curated daily retail, gourmet grocer, salon, boutique pharmacy, and ATM facilities on perimeter.', tag: 'Retail Plaza' },
  ] as MasterPlanHotspot[],

  lifestyleStorylines: [
    {
      title: 'LIVE',
      tagline: 'Expansive Grandeur in Every Footstep',
      description: 'Step into residences engineered with 11-foot finished ceilings, wrap-around decks, imported Italian marble, and frameless floor-to-ceiling glass that blurs the boundary between indoor luxury and outdoor landscapes.',
      image: '/project-details/ivory building.webp',
      pill: 'Palatial Interiors',
    },
    {
      title: 'RELAX',
      tagline: 'A Rejuvenating Oasis of Serenity',
      description: 'Indulge in year-round hydrotherapy at the climate-controlled indoor heated pool, unwind with a Swedish deep-tissue massage in the private spa, or practice sunrise yoga in the zen garden.',
      image: '/project-details/ivory sitting.jpg',
      pill: 'Dual Clubhouses',
    },
    {
      title: 'CONNECT',
      tagline: 'A Refined Social Circle of Achievers',
      description: 'Gather with like-minded neighbours at Club Aurus’s private lounge, host memorable birthday dinners at the multi-cuisine restaurant, or collaborate effortlessly in the executive business suites.',
      image: '/cover/ivory-county.webp',
      pill: 'Elite Community',
    },
    {
      title: 'ENTERTAIN',
      tagline: 'Memories Celebrated with Splendour',
      description: 'Host glamorous soirees in the 600-capacity Grand Ballroom, enjoy a private movie screening with friends in the 32-seat Dolby cinema, or celebrate outdoors on the manicured banquet lawn.',
      image: '/project-details/ivory gaarden.png',
      pill: 'Celebration Venues',
    },
    {
      title: 'UNWIND',
      tagline: '11 Acres of Nature at Your Doorstep',
      description: 'Stroll along the 2.5 km canopy jogging path, watch your children splash in the safe water theme park, or spend peaceful evenings beside cascading fountains in the central sculpture court.',
      image: '/project-details/IVORY BANNER.webp',
      pill: 'Biophilic Greens',
    },
  ],

  locationConnectivity: {
    address: 'Sector 115, Noida, Uttar Pradesh',
    overview: 'Sector 115 is Noida’s most promising centrally situated residential hub. Situated at the junction of the 75m wide FNG Expressway and the Master Plan road network, it provides seamless 10-minute connectivity to Central Noida (Sector 50/78), 15-minute access to the Noida-Greater Noida Expressway, and direct access to Delhi via DND Flyway.',
    mapImage: '/project-details/ivory map.webp',
    highlights: [
      { category: 'Connectivity', name: 'FNG Expressway Corridor', distance: '0.8 km', travelTime: '2 mins', description: 'Immediate signal-free access connecting Ghaziabad, Noida, and Faridabad.' },
      { category: 'Metro', name: 'Sector 76 & Sector 101 Metro Stations', distance: '3.2 km', travelTime: '5 mins', description: 'Direct Aqua Line access linking to Blue Line interchange at Sector 52/51.' },
      { category: 'Retail & Leisure', name: 'Sector 50 Market & Spectrum Mall', distance: '4.5 km', travelTime: '7 mins', description: 'Multiplexes, international culinary dining, hypermarkets, and shopping.' },
      { category: 'Connectivity', name: 'Noida-Greater Noida Expressway', distance: '7.5 km', travelTime: '10 mins', description: 'High-speed gateway to Knowledge Park, Advant Navis, and commercial sectors.' },
      { category: 'Business Hubs', name: 'Sector 62 / 63 IT Commercial District', distance: '8.0 km', travelTime: '12 mins', description: 'Home to leading MNCs, tech parks, and corporate headquarters.' },
      { category: 'Connectivity', name: 'DND Flyway (Delhi Entrance)', distance: '14.0 km', travelTime: '18 mins', description: 'Smooth transit to South Delhi, Nehru Place, and Mathura Road.' },
      { category: 'Education', name: 'DPS Noida, Genesis Global & Lotus Valley', distance: '5 - 9 km', travelTime: '10-14 mins', description: 'Top-tier international baccalaureate and CBSE schools within easy reach.' },
      { category: 'Hospitals', name: 'Yatharth & Fortis Super-Speciality Hospitals', distance: '3.5 - 7 km', travelTime: '8-12 mins', description: '24/7 world-class emergency care, trauma centers, and medical institutes.' },
      { category: 'Connectivity', name: 'Noida International Airport (Jewar)', distance: '48 km', travelTime: '45 mins', description: 'Direct corridor via upcoming FNG & Yamuna Expressway expressway grid.' },
    ] as LocationPoint[],
  },

  specifications: [
    {
      category: 'Structure & Architecture',
      icon: 'Building',
      items: [
        { feature: 'Foundation & Framing', detail: 'Earthquake-resistant RCC framed structure designed to Seismic Zone IV standards with aluminium formwork (Mivan) shuttering.' },
        { feature: 'Ceiling Height', detail: 'Magnificent 11-foot finished ceiling height ensuring enhanced spatial volume and superior air circulation.' },
        { feature: 'External Facade', detail: 'Double-glazed low-E thermal insulation glass with weather-proof premium silicone acrylic exterior paint and stone cladding accents.' },
      ],
    },
    {
      category: 'Living, Dining & Foyer',
      icon: 'Home',
      items: [
        { feature: 'Flooring', detail: 'Large-slab imported Italian marble (Bottochino / Statuario / Dyana) with precision polish and zero-grout finish.' },
        { feature: 'Walls & Ceiling', detail: 'Acrylic emulsion paint over premium POP punning with false ceiling and indirect ambient cove lighting fixtures.' },
        { feature: 'Main Door', detail: '8-foot high grand teakwood veneer panel door with smart digital biometric lock (Yale / Hafele).' },
      ],
    },
    {
      category: 'Master Bedroom & Suites',
      icon: 'Bed',
      items: [
        { feature: 'Flooring', detail: 'Imported engineered wood flooring / European laminated wooden planks in all master bedrooms.' },
        { feature: 'Wardrobe Zone', detail: 'Dedicated walk-in wardrobe dressing area with integrated LED sensors and soft-close German hardware.' },
        { feature: 'Deck Balcony', detail: 'Attached double-depth private viewing deck with anti-skid vitrified tiles and toughened glass safety railings.' },
      ],
    },
    {
      category: 'Gourmet Kitchen',
      icon: 'Utensils',
      items: [
        { feature: 'Cabinetry', detail: 'Full German modular kitchen with soft-close drawers, pull-out pantry, and quartz / granite composite countertops.' },
        { feature: 'Appliances', detail: 'Under-mount stainless steel double bowl sink (Franke/Carysil), chimney & 4-burner glass cooktop (Bosch/Siemens/Faber).' },
        { feature: 'Piped Gas & Water', detail: 'Provision for piped natural gas (PNG), RO drinking water purification unit, and separate utility balcony.' },
      ],
    },
    {
      category: 'Bathrooms & Sanitaryware',
      icon: 'Droplet',
      items: [
        { feature: 'Fittings & Fixtures', detail: 'Wall-hung concealed cistern WCs and thermostatic diverters from Kohler / Toto / Grohe.' },
        { feature: 'Shower Enclosure', detail: 'Frameless toughened 10mm glass shower partition with rain shower and steam outlet provision in master bath.' },
        { feature: 'Hot Water Supply', detail: 'Central solar water heating system coupled with high-capacity concealed instant water geyser points.' },
      ],
    },
    {
      category: 'HVAC & Electrical',
      icon: 'Zap',
      items: [
        { feature: 'Air Conditioning', detail: 'Energy-efficient VRV / VRF inverter central air-conditioning system (Daikin / Mitsubishi) covering all rooms.' },
        { feature: 'Electrical Wiring', detail: 'Concealed fire-retardant copper wiring (Polycab/Finolex) with modular switches (Legrand/Schneider).' },
        { feature: 'Power Backup', detail: '100% full DG power backup with automatic transfer switch (AMF) for continuous uninterrupted power.' },
      ],
    },
    {
      category: 'Smart Home & 5-Tier Security',
      icon: 'ShieldCheck',
      items: [
        { feature: 'Home Automation', detail: 'Smart touch panels controlling lighting scenes, fan speeds, AC temperatures, and curtain motors.' },
        { feature: 'Surveillance', detail: '24/7 high-resolution IP CCTV cameras with night vision covering all entry gates, lobbies, basements, and perimeter.' },
        { feature: 'Perimeter & Access', detail: 'Boom barriers with FASTag / RFID vehicle detection, smart video door phone connected to 24/7 security concierge.' },
      ],
    },
  ] as SpecificationCategory[],

  gallery: [
    { id: 'g1', title: 'Grand Architectural Front Elevation', category: 'architecture', image: '/cover/ivory-county.webp', description: 'Iconic neo-classical facade rising gracefully over Sector 115 Noida.' },
    { id: 'g2', title: 'Monumental Entrance Gate & Arrival', category: 'architecture', image: '/project-details/IVORY BANNER.webp', description: 'Triple-height royal portico with water cascades and lush avenue palm trees.' },
    { id: 'g3', title: 'Club Ivor Grand Reception & Social Lounge', category: 'interiors', image: '/project-details/ivory sitting.jpg', description: 'Lavish clubhouse foyer featuring soaring ceilings and designer chandelier lighting.' },
    { id: 'g4', title: 'Olympic-Spec Outdoor Infinity Pool', category: 'amenities', image: '/project-details/ivory gaarden.png', description: 'Heated outdoor swimming pool flanked with sunken loungers and cabanas.' },
    { id: 'g5', title: '11-Acre Central Botanical Forest & Park', category: 'greens', image: '/project-details/ivory garden.webp', description: 'Pristine central landscaped green corridor with reflexology walkways.' },
    { id: 'g6', title: 'Ivory Gold Tower Elevation & Sky Decks', category: 'architecture', image: '/project-details/ivory building.webp', description: 'Exclusive large-format residences with wrap-around balconies.' },
    { id: 'g7', title: 'Master Layout & Sector 115 Location Plan', category: 'masterplan', image: '/project-details/ivory map.webp', description: '28-acre master planning layout showcasing tower distribution and green belts.' },
  ] as GalleryItem[],

  developerStory: {
    title: 'County Group: 30+ Years of Transforming NCR Skylines',
    subtitle: 'A Legacy Built on Timely Delivery, Uncompromising Quality, and Architectural Masterpieces',
    description:
      'County Group (formerly part of ABA Corp) is one of Delhi NCR’s most revered luxury developers. Renowned for creating landmark developments that blend themed architectural magnificence with green living, County Group boasts an impeccable track record of delivering over 10,000+ luxury homes on time.',
    stats: [
      { num: '30+', label: 'Years of Experience' },
      { num: '10,000+', label: 'Happy Families Delivered' },
      { num: '15M+', label: 'Sq. Ft. Area Delivered' },
      { num: '100%', label: 'RERA Compliance Record' },
    ],
    deliveredLandmarks: [
      { name: 'County 107', sector: 'Sector 107, Noida', type: 'Ultra-Luxury 4 & 5 BHK Ready to Move', highlight: 'India’s first aerial walkway and vertical green towers' },
      { name: 'Cleo County', sector: 'Sector 121, Noida', type: 'Luxury Egyptian Themed Community', highlight: '25-acre resort lifestyle with 5 cascading swimming pools' },
      { name: 'Ivy County', sector: 'Sector 75, Noida', type: 'Completed Premium Community', highlight: '546 residences with lush manicured gardens and Club Celavi' },
      { name: 'Orange County & Olive County', sector: 'Indirapuram & Vasundhara', type: 'Completed Iconic Townships', highlight: 'Award-winning master developments in Ghaziabad' },
      { name: 'Jade County', sector: 'Wave City, Ghaziabad', type: 'Under Construction Luxury Project', highlight: '13-acre development with 7-level cascading water features' },
      { name: 'Clove County', sector: 'Sector 151, Noida', type: 'Under Construction Ultra-Luxury', highlight: 'Biophilic curved architecture with Club Celavi hydro wellness' },
    ],
  },

  faqs: [
    {
      category: 'General',
      question: 'What is Ivory County and where is it located in Noida?',
      answer:
        'Ivory County is an ultra-luxury residential master development spanning approx. 28 acres in Sector 115, Noida. It features 24 towers offering large-format 3, 4, and 5 BHK residences, over 11 acres of landscaped greens, and two opulent clubhouses (Club Ivor and Club Aurus).',
    },
    {
      category: 'Legal & RERA',
      question: 'What are the UP RERA registration numbers for Ivory County?',
      answer:
        'Ivory County is registered with the Uttar Pradesh Real Estate Regulatory Authority (UP RERA) across multiple phases: Phase 1 (UPRERAPRJ256314), Phase 2 (UPRERAPRJ115902), and Phase 3 (UPRERAPRJ507062). The promoter is Themecounty Private Limited (UPRERAPRM206951). All project details can be verified on www.up-rera.in.',
    },
    {
      category: 'General',
      question: 'What apartment configurations and sizes are available at Ivory County?',
      answer:
        'Ivory County offers a variety of spacious layouts: 3 BHK (2,034 sq ft), 3 BHK + Utility (2,304 sq ft), 4 BHK (2,727 & 3,195 sq ft), and the exclusive Ivory Gold collection featuring 4 BHK Palatial (3,987 & 4,707 sq ft) and 5 BHK Presidential Penthouses (6,939 sq ft).',
    },
    {
      category: 'Pricing & Payment',
      question: 'What is the starting price and available payment plan for Ivory County?',
      answer:
        'Prices start from ₹ 2.95 Cr* onwards for 3 BHK luxury residences, varying with tower elevation, floor choice, and configuration. Flexible payment options including construction-linked plans (CLP) and special 40:60 payment schemes are available through A&G Realtors. Contact us for the current unit-specific cost sheet.',
    },
    {
      category: 'Amenities & Handover',
      question: 'What clubhouses and recreational amenities are provided?',
      answer:
        'Ivory County features dual grand clubhouses spanning over 1,00,000 sq ft: Club Ivor (general residents club) and Club Aurus (exclusive to Ivory Gold residents). Key amenities include indoor heated and outdoor Olympic pools, spa & steam saunas, floodlit tennis and padel courts, a 32-seater Dolby cinema, banquet ballroom, co-working business lounges, and 11 acres of car-free gardens.',
    },
    {
      category: 'Amenities & Handover',
      question: 'What is the expected possession timeline for Ivory County Sector 115?',
      answer:
        'Construction is proceeding at an accelerated pace with modern Mivan aluminium shuttering technology. Phase-wise handovers are scheduled from 2028 onwards as per registered RERA timelines. Contact A&G Realtors for the latest quarterly construction milestone report.',
    },
    {
      category: 'General',
      question: 'How does Sector 115 compare with other luxury sectors in Noida?',
      answer:
        'Sector 115 offers an optimal balance of central convenience and high capital appreciation potential. It enjoys direct frontage on the FNG Expressway, 5-minute access to the Aqua Line Metro (Sector 76/101), 10 minutes to the Noida-Greater Noida Expressway, and close proximity to top schools (DPS, Genesis) and hospitals (Yatharth, Fortis).',
    },
    {
      category: 'Pricing & Payment',
      question: 'How do I book a private site visit or reserve an apartment at Ivory County?',
      answer:
        'You can arrange a private VIP site tour with Agarwal & Gehlot Realtors by calling +91 96543 22224, messaging us on WhatsApp, or submitting the consultation form on this page. Our senior luxury property advisors provide comprehensive site tours, sample flat walkthroughs, and end-to-end booking guidance with zero brokerage.',
    },
  ] as IvoryFaqItem[],
};
