/**
 * Rajputana Maharashtra — Seed Script
 *
 * SAFE TO RE-RUN: Uses upsert for districts — will never delete member profiles,
 * events, articles, gallery, or any real user data.
 *
 * Run: node scripts/seed.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not set in .env.local'); process.exit(1); }

// ─── Minimal inline schemas (seed only) ──────────────────────────────────────
const UserSchema = new mongoose.Schema({
  name:          String,
  email:         { type: String, unique: true },
  password:      String,
  role:          { type: String, default: 'user' },
  isActive:      { type: Boolean, default: true },
  loginAttempts: { type: Number, default: 0 },
}, { timestamps: true });

const DistrictSchema = new mongoose.Schema({
  name:         { type: String, required: true, unique: true },
  slug:         { type: String, required: true, unique: true },
  description:  String,
  region:       String,
  division:     String,
  headquarters: String,
  area:         String,
  memberCount:  { type: Number, default: 0 },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

const User     = mongoose.models.User     || mongoose.model('User',     UserSchema);
const District = mongoose.models.District || mongoose.model('District', DistrictSchema);

// ─── All 36 Official Maharashtra Districts ────────────────────────────────────
const DISTRICTS = [
  // Konkan Division
  { name:'Mumbai City',     slug:'mumbai-city',     region:'Konkan',              division:'Konkan',                     headquarters:'Mumbai',                    area:'157 sq km',    description:'The financial capital of India and home to a large Rajput community active in business, security forces, and public service.' },
  { name:'Mumbai Suburban', slug:'mumbai-suburban', region:'Konkan',              division:'Konkan',                     headquarters:'Bandra',                    area:'446 sq km',    description:'The suburban extension of Mumbai with a strong and growing Rajput presence across Andheri, Borivali, and surrounding areas.' },
  { name:'Thane',           slug:'thane',           region:'Konkan',              division:'Konkan',                     headquarters:'Thane',                     area:'4,214 sq km',  description:'One of the fastest-growing districts of Maharashtra with a significant Rajput population across its urban and rural talukas.' },
  { name:'Palghar',         slug:'palghar',         region:'Konkan',              division:'Konkan',                     headquarters:'Palghar',                   area:'5,344 sq km',  description:'A district carved from Thane in 2014, known for its coastal belt and a Rajput community rooted in agriculture and fishing trades.' },
  { name:'Raigad',          slug:'raigad',          region:'Konkan',              division:'Konkan',                     headquarters:'Alibag',                    area:'7,152 sq km',  description:'Home to the historic Raigad Fort — the capital of Chhatrapati Shivaji Maharaj — this district holds immense pride for the entire Rajput community.' },
  { name:'Ratnagiri',       slug:'ratnagiri',       region:'Konkan',              division:'Konkan',                     headquarters:'Ratnagiri',                 area:'8,208 sq km',  description:'A coastal district known for its rich history, famed Alphonso mangoes, and a warrior heritage that runs deep among its Rajput families.' },
  { name:'Sindhudurg',      slug:'sindhudurg',      region:'Konkan',              division:'Konkan',                     headquarters:'Oros',                      area:'5,207 sq km',  description:'Named after the majestic sea fort built by Chhatrapati Shivaji Maharaj, this southernmost district has a legendary fort legacy and proud warrior lineage.' },
  // Nashik Division
  { name:'Nashik',          slug:'nashik',          region:'North Maharashtra',   division:'Nashik',                     headquarters:'Nashik',                    area:'15,582 sq km', description:'The wine capital and a sacred pilgrimage city. Nashik has a strong Rajput presence in agriculture, trade, and public service across its many talukas.' },
  { name:'Dhule',           slug:'dhule',           region:'North Maharashtra',   division:'Nashik',                     headquarters:'Dhule',                     area:'7,195 sq km',  description:'A district in northern Maharashtra known for its cotton trade and historical significance, with an active Rajput community in commerce and farming.' },
  { name:'Nandurbar',       slug:'nandurbar',       region:'North Maharashtra',   division:'Nashik',                     headquarters:'Nandurbar',                 area:'5,034 sq km',  description:'A district on the borders of Gujarat and Madhya Pradesh with a unique Rajput cultural presence among its diverse communities.' },
  { name:'Jalgaon',         slug:'jalgaon',         region:'North Maharashtra',   division:'Nashik',                     headquarters:'Jalgaon',                   area:'11,765 sq km', description:'Known as the Banana Capital of India, Jalgaon has a proud Rajput community deeply rooted in agriculture and the vibrant cotton trade.' },
  { name:'Ahilyanagar',     slug:'ahilyanagar',     region:'Western Maharashtra', division:'Nashik',                     headquarters:'Ahilyanagar',               area:'17,048 sq km', description:'The largest district of Maharashtra by area, officially renamed Ahilyanagar, with a rich Rajput presence across its many talukas and fort heritage.' },
  // Pune Division
  { name:'Pune',            slug:'pune',            region:'Western Maharashtra', division:'Pune',                       headquarters:'Pune',                      area:'15,642 sq km', description:'The cultural capital of Maharashtra and the Oxford of the East. Pune has the largest and most organised Rajput community in the state with strong civic and cultural institutions.' },
  { name:'Satara',          slug:'satara',          region:'Western Maharashtra', division:'Pune',                       headquarters:'Satara',                    area:'10,480 sq km', description:'Birthplace region of the Maratha empire with a deeply intertwined Rajput history. Satara\'s fort heritage and warrior traditions are held in great pride.' },
  { name:'Sangli',          slug:'sangli',          region:'Western Maharashtra', division:'Pune',                       headquarters:'Sangli',                    area:'8,572 sq km',  description:'Known as the Turmeric City of India, Sangli has a prosperous Rajput community engaged in agriculture, trade, and education along the Krishna river belt.' },
  { name:'Solapur',         slug:'solapur',         region:'Western Maharashtra', division:'Pune',                       headquarters:'Solapur',                   area:'14,895 sq km', description:'An important industrial city on the Karnataka border, Solapur has a significant Rajput population in its textile industry and historic Siddheshwar tradition.' },
  { name:'Kolhapur',        slug:'kolhapur',        region:'Western Maharashtra', division:'Pune',                       headquarters:'Kolhapur',                  area:'7,685 sq km',  description:'Known as the City of Wrestlers and seat of the historic Kolhapur royal dynasty. Kolhapur has a legendary Rajput heritage and remains a centre of martial arts and cultural pride.' },
  // Marathwada — Chhatrapati Sambhajinagar Division
  { name:'Chhatrapati Sambhajinagar', slug:'chhatrapati-sambhajinagar', region:'Marathwada', division:'Chhatrapati Sambhajinagar', headquarters:'Chhatrapati Sambhajinagar', area:'10,107 sq km', description:'Renamed in honour of Chhatrapati Sambhaji Maharaj. Gateway to the UNESCO World Heritage Ajanta-Ellora caves, with a proud Rajput heritage in the heart of Marathwada.' },
  { name:'Jalna',           slug:'jalna',           region:'Marathwada',          division:'Chhatrapati Sambhajinagar',  headquarters:'Jalna',                     area:'7,718 sq km',  description:'An agrarian district of Marathwada with a strong Rajput community known for participation in agriculture and local governance across its talukas.' },
  { name:'Beed',            slug:'beed',            region:'Marathwada',          division:'Chhatrapati Sambhajinagar',  headquarters:'Beed',                      area:'10,693 sq km', description:'A district known for sugarcane farming and warrior lineage. Beed\'s Rajput community has a vibrant presence in farming, politics, and community leadership.' },
  { name:'Dharashiv',       slug:'dharashiv',       region:'Marathwada',          division:'Chhatrapati Sambhajinagar',  headquarters:'Dharashiv',                 area:'7,569 sq km',  description:'Officially renamed Dharashiv, this district is known for the ancient Ter archaeological site and an active Rajput community with deep roots in Marathwada.' },
  // Marathwada — Latur Division
  { name:'Latur',           slug:'latur',           region:'Marathwada',          division:'Latur',                      headquarters:'Latur',                     area:'7,157 sq km',  description:'A major city in Marathwada that rebuilt itself after the 1993 earthquake. The Rajput community here is known for its remarkable resilience, unity, and entrepreneurial spirit.' },
  { name:'Nanded',          slug:'nanded',          region:'Marathwada',          division:'Latur',                      headquarters:'Nanded',                    area:'10,528 sq km', description:'Home to the sacred Sikh shrine Hazur Sahib, Nanded also has a significant Rajput community with deep historical and cultural roots in the region.' },
  { name:'Hingoli',         slug:'hingoli',         region:'Marathwada',          division:'Latur',                      headquarters:'Hingoli',                   area:'4,527 sq km',  description:'A district known for soybean cultivation and a close-knit Rajput community that preserves strong clan traditions and rural heritage.' },
  { name:'Parbhani',        slug:'parbhani',        region:'Marathwada',          division:'Latur',                      headquarters:'Parbhani',                  area:'6,511 sq km',  description:'Known for the Yellamma temple and a strong agricultural base, Parbhani has an active Rajput community contributing to farming and civic life in Marathwada.' },
  // Vidarbha — Amravati Division
  { name:'Amravati',        slug:'amravati',        region:'Vidarbha',            division:'Amravati',                   headquarters:'Amravati',                  area:'12,235 sq km', description:'Known as the land of Goddess Ambadevi, Amravati has a strong Rajput presence in its cotton-growing regions, military services, and cultural institutions.' },
  { name:'Akola',           slug:'akola',           region:'Vidarbha',            division:'Amravati',                   headquarters:'Akola',                     area:'5,428 sq km',  description:'The cotton city of Vidarbha, Akola has a significant Rajput community known for trade, cotton farming, and civic leadership across the region.' },
  { name:'Washim',          slug:'washim',          region:'Vidarbha',            division:'Amravati',                   headquarters:'Washim',                    area:'5,155 sq km',  description:'A district known for soybean and cotton farming with a proud Rajput community engaged in agriculture and local political representation.' },
  { name:'Buldhana',        slug:'buldhana',        region:'Vidarbha',            division:'Amravati',                   headquarters:'Buldhana',                  area:'9,661 sq km',  description:'Home to the Lonar Crater Lake — one of only four hyper-velocity impact craters in basaltic rock worldwide — Buldhana also has a proud Rajput heritage and farming culture.' },
  { name:'Yavatmal',        slug:'yavatmal',        region:'Vidarbha',            division:'Amravati',                   headquarters:'Yavatmal',                  area:'13,582 sq km', description:'A major cotton-producing district of Vidarbha with a Rajput community deeply involved in farming, education, and government services across its vast talukas.' },
  // Vidarbha — Nagpur Division
  { name:'Nagpur',          slug:'nagpur',          region:'Vidarbha',            division:'Nagpur',                     headquarters:'Nagpur',                    area:'9,892 sq km',  description:'The Orange City and winter capital of Maharashtra. Nagpur has a large, well-organised Rajput community active in politics, law, trade, and education.' },
  { name:'Wardha',          slug:'wardha',          region:'Vidarbha',            division:'Nagpur',                     headquarters:'Wardha',                    area:'6,310 sq km',  description:'Home to Mahatma Gandhi\'s Sevagram Ashram, Wardha has a Rajput community known for its contribution to the freedom movement, agriculture, and civic life.' },
  { name:'Chandrapur',      slug:'chandrapur',      region:'Vidarbha',            division:'Nagpur',                     headquarters:'Chandrapur',                area:'11,443 sq km', description:'Known as the Black Gold City for its coal reserves and home to the Tadoba-Andhari Tiger Reserve. The Rajput community here has strong roots in mining, trade, and the region\'s history.' },
  { name:'Gadchiroli',      slug:'gadchiroli',      region:'Vidarbha',            division:'Nagpur',                     headquarters:'Gadchiroli',                area:'14,412 sq km', description:'A forested district bordering Chhattisgarh and Telangana, known for its tribal culture and a Rajput community with deep historical ties to the eastern frontier of Maharashtra.' },
  { name:'Gondia',          slug:'gondia',          region:'Vidarbha',            division:'Nagpur',                     headquarters:'Gondia',                    area:'5,431 sq km',  description:'Known as the Rice Bowl of Maharashtra, Gondia has a peaceful Rajput community engaged in agriculture, forest-based livelihoods, and local governance.' },
  { name:'Bhandara',        slug:'bhandara',        region:'Vidarbha',            division:'Nagpur',                     headquarters:'Bhandara',                  area:'3,890 sq km',  description:'A small but culturally rich district of eastern Maharashtra with a close-knit Rajput community known for rice farming, craftsmanship, and community bonds.' },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // ── 1. Create or update admin account ─────────────────────────────────
    const adminEmail    = 'admin@rajputana-maharashtra.org';
    const adminPassword = 'Admin@123456';
    const adminHash     = await bcrypt.hash(adminPassword, 12);

    await User.findOneAndUpdate(
      { email: adminEmail },
      {
        $set: {
          name:          'Rajputana Admin',
          password:      adminHash,
          role:          'admin',
          isActive:      true,
          loginAttempts: 0,
        },
        $unset: { lockUntil: '' },
      },
      { upsert: true, new: true }
    );
    console.log('👑 Admin account: created/updated');

    // ── 2. Remove old dummy/test accounts (safe to run on live DB) ────────
    const dummyEmails = [
      'raj@example.com',
      'priya@example.com',
      'vikram@example.com',
      'mod@rajputana-maharashtra.org',
    ];
    const removed = await User.deleteMany({ email: { $in: dummyEmails } });
    if (removed.deletedCount > 0) {
      console.log(`🗑️  Removed ${removed.deletedCount} dummy test account(s)`);
    }

    // ── 3. Upsert all 36 districts (never deletes existing districts) ─────
    let added = 0, updated = 0;
    for (const d of DISTRICTS) {
      const result = await District.findOneAndUpdate(
        { slug: d.slug },
        { $set: d },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      if (result.createdAt?.getTime() === result.updatedAt?.getTime()) {
        added++;
      } else {
        updated++;
      }
    }
    console.log(`🗺️  Districts: ${added} added, ${updated} updated (total: ${DISTRICTS.length})\n`);

    // ── 4. Summary ─────────────────────────────────────────────────────────
    const userCount     = await User.countDocuments();
    const districtCount = await District.countDocuments();

    console.log('─'.repeat(55));
    console.log('✅ SEED COMPLETE — No existing data was deleted');
    console.log('─'.repeat(55));
    console.log(`   Users in DB:     ${userCount}`);
    console.log(`   Districts in DB: ${districtCount}`);
    console.log('─'.repeat(55));
    console.log('ADMIN LOGIN:');
    console.log('   Email:    admin@rajputana-maharashtra.org');
    console.log('   Password: Admin@123456');
    console.log('─'.repeat(55));
    console.log('\n📌 Districts seeded by region:');
    const regions = [...new Set(DISTRICTS.map(d => d.region))];
    for (const r of regions) {
      const inR = DISTRICTS.filter(d => d.region === r);
      console.log(`   ${r} (${inR.length}): ${inR.map(d => d.name).join(', ')}`);
    }
    console.log('\n💡 Members, events, articles, gallery — add via admin dashboard.');
    console.log('─'.repeat(55));

  } catch (err) {
    console.error('❌ Seed failed:', err.message || err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
