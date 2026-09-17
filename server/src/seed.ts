import bcrypt from 'bcryptjs';
import { getDb, query, queryOne } from './config/database.js';
import { v4 as uuidv4 } from 'uuid';
import { logger } from './utils/logger.js';

export async function seedDatabase() {
  await getDb(); // Ensure tables are initialized

  const userCount = await queryOne<{ count: string }>('SELECT COUNT(*) as count FROM users');
  if (parseInt(userCount?.count || '0', 10) > 0) {
    logger.info('Database already seeded. Skipping initial seed.');
    return;
  }

  logger.info('Seeding RANDERE database with initial collections, stories, and transformations...');

  // 1. Create Users
  const salt = await bcrypt.genSalt(10);
  const adminPassHash = await bcrypt.hash('randere2026', salt);
  const customerPassHash = await bcrypt.hash('randere2026', salt);

  const adminId = uuidv4();
  await query(
    `INSERT INTO users (id, email, password_hash, full_name, phone, role)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [adminId, 'admin@randere.studio', adminPassHash, 'RANDERE Creative Lead', '+254712000001', 'ADMIN']
  );

  const customer1Id = uuidv4();
  await query(
    `INSERT INTO users (id, email, password_hash, full_name, phone, role)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [customer1Id, 'kevo@randere.studio', customerPassHash, 'Kevo Mwangi', '+254722111222', 'CUSTOMER']
  );

  const customer2Id = uuidv4();
  await query(
    `INSERT INTO users (id, email, password_hash, full_name, phone, role)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [customer2Id, 'shiko@randere.studio', customerPassHash, 'Shiko Wambui', '+254733444555', 'CUSTOMER']
  );

  // Address for Customer 1
  await query(
    `INSERT INTO addresses (id, user_id, full_name, phone, street_address, estate, city, country, is_default)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      uuidv4(),
      customer1Id,
      'Kevo Mwangi',
      '+254722111222',
      'Studio 4B, Kilimani Creative Hub',
      'Kilimani',
      'Nairobi',
      'Kenya',
      true,
    ]
  );

  // 2. Create Categories
  const categories = [
    { id: uuidv4(), name: 'All Drops', slug: 'all', description: 'Complete archive of drops & releases', sortOrder: 0 },
    { id: uuidv4(), name: 'Curated', slug: 'curated', description: 'Hand-picked archive pieces in exceptional vintage condition', sortOrder: 1 },
    { id: uuidv4(), name: 'Remade', slug: 'remade', description: 'Deconstructed, tailored, and structurally altered originals', sortOrder: 2 },
    { id: uuidv4(), name: 'Arted', slug: 'arted', description: 'Wearable art featuring hand-painted pigments and textile artwork', sortOrder: 3 },
    { id: uuidv4(), name: 'Accessories', slug: 'accessories', description: 'Zero-waste objects made from salvaged denim and cut-offs', sortOrder: 4 },
  ];

  for (const cat of categories) {
    await query(
      `INSERT INTO categories (id, name, slug, description, sort_order)
       VALUES ($1, $2, $3, $4, $5)`,
      [cat.id, cat.name, cat.slug, cat.description, cat.sortOrder]
    );
  }

  const catCurated = categories[1].id;
  const catRemade = categories[2].id;
  const catArted = categories[3].id;
  const catAccessories = categories[4].id;

  // High quality fashion images from Unsplash (fashion, denim, streetwear, studio photography)
  const productsData = [
    {
      id: uuidv4(),
      name: 'R-01 "Nairobi Echo" Hand-Painted Trucker',
      slug: 'r-01-nairobi-echo-hand-painted-trucker',
      description: 'Heavyweight vintage 14oz indigo trucker jacket, deconstructed for a boxy drop-shoulder fit. Features hand-painted abstract architectural brushwork using heat-set Japanese textile pigment.',
      categoryId: catArted,
      productType: 'ARTED',
      price: 9500,
      currency: 'KES',
      size: 'L',
      measurements: { chest: '24 in', length: '23 in', shoulder: '21 in', sleeve: '25 in' },
      condition: 'Grade A - Custom Rework',
      status: 'PUBLISHED',
      stockQuantity: 1,
      oneOfOne: true,
      materials: '100% Upcycled Vintage Cotton Denim, Acrylic Textile Medium',
      careInstructions: 'Cold hand wash inside out. Hang dry in shade. Do not iron directly on paint.',
      transformationDescription: 'Original oversized 90s jacket deconstructed, hem cropped by 4 inches, distressed cuffs re-bound with herringbone tape, finished with hand-painted kinetic stroke art.',
      originalGarmentDescription: 'Sourced in Gikomba market as an XL faded utility trucker with torn cuffs.',
      featured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80', isPrimary: true, sortOrder: 0, altText: 'Front view hand-painted denim jacket' },
        { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80', isPrimary: false, sortOrder: 1, altText: 'Back detail kinetic brushwork' },
        { url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80', isPrimary: false, sortOrder: 2, altText: 'Textile texture closeup' },
      ],
    },
    {
      id: uuidv4(),
      name: 'R-02 Asymmetric Split Collar Poplin Shirt',
      slug: 'r-02-asymmetric-split-collar-poplin-shirt',
      description: 'Constructed by fusing two vintage crisp dress shirts (one chalk white, one subtle French blue stripe). Re-engineered with an exaggerated offset chest pocket and raw staggered hemline.',
      categoryId: catRemade,
      productType: 'REMADE',
      price: 6800,
      currency: 'KES',
      size: 'M',
      measurements: { chest: '22.5 in', length: '28 in', shoulder: '19.5 in', sleeve: '24.5 in' },
      condition: 'Grade A - Remade Studio Spec',
      status: 'PUBLISHED',
      stockQuantity: 1,
      oneOfOne: true,
      materials: '100% Egyptian Cotton Broadcloth',
      careInstructions: 'Machine wash delicate cold. Hang dry. Medium steam.',
      transformationDescription: 'Two deadstock dress shirts disassembled along the back yoke, re-spliced with double flat-felled contrast seams and relocated collar tabs.',
      originalGarmentDescription: 'Two discarded business shirts with outdated sleeve plackets.',
      featured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80', isPrimary: true, sortOrder: 0, altText: 'Asymmetric split collar shirt front' },
        { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80', isPrimary: false, sortOrder: 1, altText: 'Split shirt collar closeup' },
      ],
    },
    {
      id: uuidv4(),
      name: 'R-03 1994 Washed Heavyweight Canvas Work Chore',
      slug: 'r-03-1994-washed-heavyweight-canvas-work-chore',
      description: 'Authentic 90s chore coat in sun-bleached tobacco duck canvas. Cleaned, graded, button shanks reinforced with waxed thread, and treated with organic beeswax seam seal.',
      categoryId: catCurated,
      productType: 'CURATED',
      price: 7200,
      currency: 'KES',
      size: 'XL',
      measurements: { chest: '26 in', length: '30 in', shoulder: '22 in', sleeve: '26 in' },
      condition: 'Grade A - Curated Vintage Archive',
      status: 'PUBLISHED',
      stockQuantity: 1,
      oneOfOne: true,
      materials: '100% Duck Canvas Cotton, Corduroy Collar Trim',
      careInstructions: 'Spot clean recommended. Cold gentle cycle when necessary.',
      transformationDescription: 'Deep ultrasonic sanitization, triple-stitch cuff reinforcement, natural garment softening treatment.',
      originalGarmentDescription: 'Vintage workwear coat with pristine patina and zero structural tears.',
      featured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80', isPrimary: true, sortOrder: 0, altText: 'Vintage canvas work chore jacket' },
        { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80', isPrimary: false, sortOrder: 1, altText: 'Chore coat patina closeup' },
      ],
    },
    {
      id: uuidv4(),
      name: 'R-04 Spliced Cargo Flared Trousers',
      slug: 'r-04-spliced-cargo-flared-trousers',
      description: 'Reconstructed from two pairs of secondhand olive drab utility trousers. Engineered flare insert along the lateral inseam creating a progressive streetwear stack over sneakers.',
      categoryId: catRemade,
      productType: 'REMADE',
      price: 7500,
      currency: 'KES',
      size: '32',
      measurements: { waist: '32 in', inseam: '32 in', rise: '12 in', thigh: '13 in', legOpening: '10 in' },
      condition: 'Grade A - Structural Rework',
      status: 'PUBLISHED',
      stockQuantity: 1,
      oneOfOne: true,
      materials: 'Heavyweight Cotton Ripstop, Heavy Duty Brass Hardware',
      careInstructions: 'Machine wash cold inside out. Tumble dry low.',
      transformationDescription: 'Deconstructed outseams, inserted flared wedge triangular panels, replaced faulty zip with heavy metal pull.',
      originalGarmentDescription: 'Standard straight-leg surplus trousers with awkward knee bagging.',
      featured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80', isPrimary: true, sortOrder: 0, altText: 'Spliced flare cargo trousers on model' },
        { url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80', isPrimary: false, sortOrder: 1, altText: 'Pocket detail and stack hem' },
      ],
    },
    {
      id: uuidv4(),
      name: 'R-05 "Kilimani Concrete" Distressed Heavy Hoodie',
      slug: 'r-05-kilimani-concrete-distressed-heavy-hoodie',
      description: 'Curated 450GSM reverse-weave fleece sweatshirt in washed cement grey. Micro-distressed cuffs and hem with tonal hand-stitched bar-tacks throughout.',
      categoryId: catCurated,
      productType: 'CURATED',
      price: 5400,
      currency: 'KES',
      size: 'L',
      measurements: { chest: '25 in', length: '27 in', shoulder: '21 in', sleeve: '25.5 in' },
      condition: 'Grade A - Restored Heavy Fleece',
      status: 'PUBLISHED',
      stockQuantity: 1,
      oneOfOne: true,
      materials: '90% Cotton, 10% Poly French Terry Fleece',
      careInstructions: 'Cold wash, gentle dry.',
      transformationDescription: 'Enzyme wash strip, collar rib mended with tonal cotton thread, edge distressing.',
      originalGarmentDescription: 'Overlooked heavy fleece with stained cuffs cleaned and reworked.',
      featured: false,
      images: [
        { url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80', isPrimary: true, sortOrder: 0, altText: 'Grey heavyweight hoodie' },
      ],
    },
    {
      id: uuidv4(),
      name: 'R-06 Zero-Waste Denim Studio Tote',
      slug: 'r-06-zero-waste-denim-studio-tote',
      description: 'Crafted entirely from raw denim off-cuts and trouser pocket linings left over from the R-01 and R-04 rework projects. Double reinforced webbing handles with inner key loop.',
      categoryId: catAccessories,
      productType: 'ACCESSORY',
      price: 3200,
      currency: 'KES',
      size: 'OS',
      measurements: { width: '17 in', height: '16 in', strapDrop: '12 in' },
      condition: 'Brand New from Salvaged Off-Cuts',
      status: 'PUBLISHED',
      stockQuantity: 4,
      oneOfOne: false,
      materials: '100% Upcycled Cotton Denim & Herringbone Twill',
      careInstructions: 'Machine wash cold, air dry.',
      transformationDescription: 'Pieced together from 14 individual scrap panels, reinforced with industrial box-x stitching.',
      originalGarmentDescription: 'Fabric remnants from alteration studio floor.',
      featured: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80', isPrimary: true, sortOrder: 0, altText: 'Denim patchwork tote bag' },
      ],
    },
    {
      id: uuidv4(),
      name: 'R-07 "Botanical Glitch" Hand-Painted Chore Vest',
      slug: 'r-07-botanical-glitch-hand-painted-chore-vest',
      description: 'Sleeveless utility vest tailored from a heavy vintage safari jacket. Illustrated with native Kenyan flora rendered in glitch typography and deep black sumi ink.',
      categoryId: catArted,
      productType: 'ARTED',
      price: 8800,
      currency: 'KES',
      size: 'M',
      measurements: { chest: '22 in', length: '24 in', shoulder: '18 in' },
      condition: 'Grade A - Bespoke Art Piece',
      status: 'PUBLISHED',
      stockQuantity: 1,
      oneOfOne: true,
      materials: '100% Heavy Cotton Twill, Permanent Archival Pigment',
      careInstructions: 'Hand wash cold. Do not dry clean.',
      transformationDescription: 'Sleeves removed and armholes faced with bias tape, custom artwork applied across back panel.',
      originalGarmentDescription: 'Vintage khaki field jacket with fraying sleeves.',
      featured: false,
      images: [
        { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80', isPrimary: true, sortOrder: 0, altText: 'Front of utility vest' },
        { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80', isPrimary: false, sortOrder: 1, altText: 'Back art detail' },
      ],
    },
    {
      id: uuidv4(),
      name: 'R-08 Double-Pleat Wide Leg Raw Hem Chino',
      slug: 'r-08-double-pleat-wide-leg-raw-hem-chino',
      description: 'Vintage pleated military trousers re-cut into an ultra-wide flowing silhouette. Finished with a clean raw stitched hem and vintage horn button fly.',
      categoryId: catRemade,
      productType: 'REMADE',
      price: 6400,
      currency: 'KES',
      size: '30',
      measurements: { waist: '30 in', inseam: '31 in', rise: '13 in', legOpening: '11 in' },
      condition: 'Grade A - Tailored Rework',
      status: 'PUBLISHED',
      stockQuantity: 1,
      oneOfOne: true,
      materials: '100% Cotton Chino Twill',
      careInstructions: 'Machine wash warm, hang dry.',
      transformationDescription: 'Waist taken in 2 inches, rise relaxed, deep front pleats knife-pressed.',
      originalGarmentDescription: 'Deadstock oversized uniform trousers.',
      featured: false,
      images: [
        { url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1000&q=80', isPrimary: true, sortOrder: 0, altText: 'Wide leg pleated chinos' },
      ],
    },
  ];

  for (const p of productsData) {
    const { images, ...productFields } = p;
    await query(
      `INSERT INTO products (
        id, name, slug, description, category_id, product_type, price, currency,
        size, measurements, condition, status, stock_quantity, one_of_one,
        materials, care_instructions, transformation_description, original_garment_description,
        featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
      [
        productFields.id,
        productFields.name,
        productFields.slug,
        productFields.description,
        productFields.categoryId,
        productFields.productType,
        productFields.price,
        productFields.currency,
        productFields.size,
        JSON.stringify(productFields.measurements),
        productFields.condition,
        productFields.status,
        productFields.stockQuantity,
        productFields.oneOfOne,
        productFields.materials,
        productFields.careInstructions,
        productFields.transformationDescription,
        productFields.originalGarmentDescription,
        productFields.featured,
      ]
    );

    for (const img of images) {
      await query(
        `INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [uuidv4(), productFields.id, img.url, img.altText, img.isPrimary, img.sortOrder]
      );
    }
  }

  // 3. Transformations Showcase (FOUND -> PROCESS -> MADE)
  const transformationsData = [
    {
      id: uuidv4(),
      title: 'From Oversized 1990s Denim to "Nairobi Echo" Boxy Art Piece',
      slug: 'oversized-denim-to-nairobi-echo',
      garmentType: 'Denim Trucker Jacket',
      originalGarmentDescription: 'Heavy 90s vintage denim jacket found in Gikomba market. Had severely torn sleeve cuffs and an unflattering, dated 28-inch torso length.',
      originalGarmentImageUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=80',
      processDescription: 'The garment was cleaned in an ozone wash, cropped by 5 inches at the hemline, and fitted with custom-cut side hem tab adjusters. The artist then spent 6 hours hand-painting dynamic geometric typography with heat-cured Japanese pigment.',
      processImageUrls: [
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&w=1000&q=80',
      ],
      finalGarmentDescription: 'A modern, boxy, runway-ready streetwear centerpiece that stands completely alone. Only one exists in the world.',
      finalGarmentImageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80',
      techniques: ['Cropped hem re-tailoring', 'Cuff deconstruction', 'Hand-applied textile pigment', 'Heat-curing at 160°C', 'Waxed thread bar-tacking'],
      artistAttribution: 'RANDERE Studio Art Lab',
      tailorAttribution: 'Master Tailor Omondi (Nairobi)',
      relatedProductId: productsData[0].id,
      published: true,
    },
    {
      id: uuidv4(),
      title: 'Two Discarded Business Shirts Become One Kinetic Asymmetric Collar',
      slug: 'two-business-shirts-become-asymmetric-collar',
      garmentType: 'Poplin Oxford Shirts',
      originalGarmentDescription: 'Two ordinary office shirts discarded due to damaged cuffs and outdated boxy tailoring.',
      originalGarmentImageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
      processDescription: 'Split along the spine and front plackets, recombined using contrast French seams, with relocated pockets and an offset collar stance.',
      processImageUrls: [
        'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80',
      ],
      finalGarmentDescription: 'An editorial statement piece bridging formal elegance and urban deconstruction.',
      finalGarmentImageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80',
      techniques: ['Pattern deconstruction', 'Split-yoke recombination', 'Raw-edge contrast stitching', 'Pocket relocation'],
      artistAttribution: null,
      tailorAttribution: 'RANDERE Tailor Collective',
      relatedProductId: productsData[1].id,
      published: true,
    },
  ];

  for (const tf of transformationsData) {
    await query(
      `INSERT INTO transformations (
        id, title, slug, garment_type,
        original_garment_description, original_garment_image_url,
        process_description, process_image_urls,
        final_garment_description, final_garment_image_url,
        techniques, artist_attribution, tailor_attribution,
        related_product_id, published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      [
        tf.id,
        tf.title,
        tf.slug,
        tf.garmentType,
        tf.originalGarmentDescription,
        tf.originalGarmentImageUrl,
        tf.processDescription,
        JSON.stringify(tf.processImageUrls),
        tf.finalGarmentDescription,
        tf.finalGarmentImageUrl,
        JSON.stringify(tf.techniques),
        tf.artistAttribution,
        tf.tailorAttribution,
        tf.relatedProductId,
        tf.published,
      ]
    );
  }

  // 4. Stories / Editorial Journal
  const storiesData = [
    {
      id: uuidv4(),
      title: 'Nobody Wanted This Jacket: The Anatomy of R-001',
      slug: 'nobody-wanted-this-jacket-anatomy-of-r001',
      excerpt: 'How a 30-year-old water-stained trucker jacket discarded in Gikomba became the centerpiece of our debut drop.',
      body: `When we found this denim jacket at the bottom of a bale in early August, it was practically invisible. The right cuff had been chewed by wear, the hem was dragged, and the collar had that stubborn thrift crease that repels casual buyers.

Most people walk past these garments. We see a blank canvas with thirty years of genuine fading that no synthetic chemical wash can replicate in a factory.

The first step was structural: taking five inches off the vertical hem to give it a sharp, boxy European silhouette while retaining the dropped 90s shoulders. The frayed cuffs were stabilized with heavy-duty herringbone twill from salvaged military tents.

Then came the paint. Drawing inspiration from Nairobi's brutalist architecture and raw street signage, the studio applied Japanese textile medium directly onto the cotton twill, cured at 160 degrees celsius.

The result isn't just an upcycled jacket. It is a one-of-one wearable artifact that sparks the only question that matters: "Who plugged you?"`,
      coverImage: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=80',
      author: 'RANDERE Studio Journal',
      tags: ['Transformation', 'Denim', 'Wearable Art', 'Behind The Scenes'],
      contentType: 'transformation',
      published: true,
      readTimeMinutes: 4,
    },
    {
      id: uuidv4(),
      title: 'From Gikomba to Runway: The Circular Moat',
      slug: 'from-gikomba-to-runway-the-circular-moat',
      excerpt: 'Why conventional thrift stores compete on volume, and why RANDERE chooses the slow path of creative engineering.',
      body: `Secondhand fashion in East Africa has traditionally existed as a volume game: import bales, break them down, hang them up, sell as quickly as possible.

While this system democratizes access to cheap apparel, it discards an immense amount of latent value. An oversized dress shirt with damaged buttons sells for 200 shillings or ends up in a waste pile.

When that same shirt is deconstructed, spliced with crisp Egyptian broadcloth, and re-tailored into an asymmetric silhouette, its value multiplies tenfold. More importantly, it creates something that cannot be bought in any high-street department store.

Our strategic principle is unwavering: Do not scale the inventory before scaling the value. Every single piece that leaves our studio carries intent, craftsmanship, and a story.`,
      coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
      author: 'Creative Director',
      tags: ['Manifesto', 'Circular Economy', 'Streetwear Culture'],
      contentType: 'story',
      published: true,
      readTimeMinutes: 5,
    },
    {
      id: uuidv4(),
      title: 'In The Lab: Testing Textile Pigments on 14oz Denim',
      slug: 'in-the-lab-testing-textile-pigments',
      excerpt: 'A technical deep-dive into how we ensure our hand-painted artwork survives friction, rain, and repeated washing.',
      body: `A recurring concern with painted garments is durability: "Will the artwork peel when I wash it?"

At RANDERE, we spent four months developing our pigment curing workflow before launching our first drop. We do not use standard acrylics or spray paints that crack under tension.

Instead, we blend micro-ground textile pigments with an elastic synthetic binder that penetrates deep between the cotton fibers rather than sitting on top of the surface. Once painted, garments undergo a three-stage heat fixation process that fuses the pigment molecularly with the yarn.

The result is wearable art that ages with you—developing soft fades and vintage character without peeling or bleeding onto your white t-shirts.`,
      coverImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80',
      author: 'Lab Team',
      tags: ['Craftsmanship', 'Art Lab', 'Technical'],
      contentType: 'behind_the_scenes',
      published: true,
      readTimeMinutes: 3,
    },
  ];

  for (const st of storiesData) {
    await query(
      `INSERT INTO stories (
        id, title, slug, excerpt, body, cover_image, author, tags, content_type, published, read_time_minutes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        st.id,
        st.title,
        st.slug,
        st.excerpt,
        st.body,
        st.coverImage,
        st.author,
        JSON.stringify(st.tags),
        st.contentType,
        st.published,
        st.readTimeMinutes,
      ]
    );
  }

  // 5. Sample Custom & Styling Requests for testing admin workflows
  await query(
    `INSERT INTO custom_requests (
      id, user_id, customer_name, customer_email, customer_phone,
      garment_type, service_types, budget, deadline, description,
      garment_photos, inspiration_photos, status, quote_amount, admin_notes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
    [
      uuidv4(),
      customer1Id,
      'Kevo Mwangi',
      'kevo@randere.studio',
      '+254722111222',
      'Vintage Levi 501s',
      JSON.stringify(['patchwork', 'painting', 'distressing']),
      6000,
      new Date(Date.now() + 14 * 86400000).toISOString(),
      'I have a pair of 90s light-wash Levi 501s with worn knees. I want you to reconstruct them with dark indigo sashiko patchwork and paint an abstract tribal graphic on the right back pocket.',
      JSON.stringify(['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80']),
      JSON.stringify(['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80']),
      'REVIEWING',
      5500,
      'Client dropped off pants at studio. Great denim weight, ready for artist sketch approval.',
    ]
  );

  await query(
    `INSERT INTO styling_requests (
      id, user_id, customer_name, customer_email, customer_phone,
      occasion, event_date, budget, preferred_aesthetic, size,
      presentation_preference, color_preferences, additional_notes, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
    [
      uuidv4(),
      customer2Id,
      'Shiko Wambui',
      'shiko@randere.studio',
      '+254733444555',
      'Album Release Showcase',
      new Date(Date.now() + 21 * 86400000).toISOString(),
      15000,
      'Deconstructed Streetwear / Raw Brutalism',
      'M',
      'Unisex / Streetwear',
      'Charcoal, bone white, subtle acid lime pop',
      'Headlining a live DJ set at Alchemist. Need an outfit that commands stage presence under ultraviolet and tungsten lighting.',
      'SUBMITTED',
    ]
  );

  logger.info('Database seeded successfully!');
}

if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  seedDatabase().catch((err) => {
    logger.error('Seed failed:', err);
    process.exit(1);
  });
}

