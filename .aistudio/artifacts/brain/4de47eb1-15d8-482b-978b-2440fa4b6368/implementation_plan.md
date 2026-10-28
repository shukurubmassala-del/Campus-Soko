# CampusSoko: Tanzanian Campus Marketplace Implementation Plan

CampusSoko is a mobile-first, bilingual (Swahili & English) peer-to-peer campus marketplace and wanted-board launched initially at the **University of Dar es Salaam (UDSM)**. It empowers students across UDSM (Mlimani Main Campus, COICT Kijitonyama, Mabibo Hostels, Halls 1–7, Magufuli Hostels, and DUCE) to buy and sell dorm essentials, textbooks, electronics, fashion, food, and student services safely with zero middleman fees.

### Confirmed MVP Decisions

> [!IMPORTANT]
> The following core product decisions are locked for MVP execution:
> - **Launch Scope**: Launch exclusively focused on **University of Dar es Salaam (UDSM)** and its constituent campuses/hostels (Mlimani, COICT Kijitonyama, Mabibo, Magufuli, DUCE), designed with an extensible multi-university registry ready to unlock other universities in Phase 2.
> - **Payment Method**: Cash on delivery or student-to-student Mobile Money (M-Pesa, Tigo Pesa, Airtel Money, HaloPesa) in person outside the app upon inspection at verified safe campus meeting spots.
> - **Bilingual Support**: First-class Swahili (Kiswahili) and English language toggle across all views, forms, search indexing, and safety advisories.
> - **Authentication & Badging**: Tanzanian phone number (+255) with OTP verification and university email (`@udsm.ac.tz`), with "Verified Student" badging via email domain or student ID card upload.
> - **Zero AI-Gimmicks**: Clean, human-designed aesthetic with tabular numbers, zero decorative star/sparkle clutter, and compliance with Tanzania's Personal Data Protection Act (PDPA).

---

### Final MVP Feature List (What's In)

1. **Authentication & Onboarding**:
   - Sign in via Tanzanian mobile number (+255 for Vodacom, Tigo, Airtel, Halotel) with 4-digit OTP.
   - Alternative sign-in using university academic email (`@udsm.ac.tz`).
   - Campus & hostel selector (Mlimani Main Campus, COICT Kijitonyama, Mabibo Hostels, Magufuli Hostels, DUCE).
2. **Student Identity & Trust Badging**:
   - "Verified Student" checkmark earned through university email validation or student ID card upload.
   - Compliance with Tanzania Personal Data Protection Act (PDPA): student credentials kept confidential.
3. **Listings Management**:
   - Create, edit, mark as sold, and delete listings.
   - Fields: Title, description, category, price in TZS, condition (Brand New, Like New, Good, Fair), photos (up to 5), campus zone, and safe pickup point.
   - Client-side canvas image downsampling (reducing raw camera uploads to <150KB for slow mobile connections).
4. **Search, Discovery & Filtering**:
   - Fast keyword search indexing both English and Swahili terms.
   - Filter by category, condition, price range in TZS, and specific UDSM campus zone.
   - Sorting by newest, price (low-high / high-low), and most viewed.
5. **Buyer-Seller Communication**:
   - In-app direct chat thread with listing preview and timestamped messaging.
   - "Propose Safe Meeting Point" action with UDSM-specific safe hubs (Dr. Wilbert Chagula Library, Nkurumah Hall Steps, COICT Cafeteria, Mabibo Gate).
   - "Contact via WhatsApp" link generator with pre-filled localized inquiry message and phone privacy shielding.
6. **"Wanted" (*Nahitaji*) Board**:
   - Feed of active student requests with student budget in TZS.
   - Direct "I Have This Item" response action connecting sellers to buyers.
7. **Trust & Safety Controls**:
   - Report listing or user modal with categorization (fraud, prohibited items, counterfeit, harassment).
   - User blocking capability.
   - Automated prohibited-content keyword filter (blocking exam leaks, cheating services, drugs, weapons).
   - Transaction safety guide modal outlining daylight meeting rules and inspection before payment.
8. **Peer Ratings & Reviews**:
   - Post-transaction review submission with a clean 1-to-5 segmented score and comment.
9. **Saved Items (Wishlist)**:
   - One-tap bookmarking to track items of interest.
10. **Moderation Center**:
    - Review pending reports, delist fraudulent items, ban repeat offenders, and run keyword compliance audits.

---

### Updated 6-Stage Build Roadmap

```
┌────────────────────────────────────────────────────────────────────────┐
│ Stage 1: UDSM Architecture, Bilingual Engine & Domain Schemas         │
│ (UDSM zones & pickup spots, TZS formatting, EN/SW dictionary, storage) │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ Stage 2: UDSM Discovery, Clean Search & Category Filtering             │
│ (Hero overview, category tabs, price filters, responsive listing grid) │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ Stage 3: Low-Data Listing Creator & "Wanted" Board (*Nahitaji*)        │
│ (Canvas image compressor <150KB, prohibited content check, buyer feed) │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ Stage 4: In-App Chat, WhatsApp Gateway & Safe Meetup System            │
│ (Direct messaging, meeting spot proposals, masked WhatsApp links)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ Stage 5: Student Verification, PDPA Privacy & Peer Reviews             │
│ (Student ID upload, @udsm.ac.tz verification, reviews & profile)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ Stage 6: Campus Moderation, Production Verification & Offline Cache    │
│ (Report resolution queue, keyword compliance tester, compilation audit)│
└────────────────────────────────────────────────────────────────────────┘
```

#### Detailed Stages:
- **Stage 1 (Completed & Verified)**: Configured core data models, persistent storage, and bilingual English/Swahili engine centered on UDSM campus zones (Mlimani, COICT, Mabibo, Magufuli, DUCE) with Tanzanian Shilling (`TZS`) formatting.
- **Stage 2 (Completed & Verified)**: Built responsive discovery interface with search, zone filtering, and unboxed typography adhering to anti-slop guidelines.
- **Stage 3 (Completed & Verified)**: Implemented multi-step listing creator with client-side canvas compression and the "Wanted" (*Nahitaji*) board.
- **Stage 4 (Completed & Verified)**: Delivered in-app chat, UDSM safe meeting point picker, and privacy-shielded WhatsApp deep-linking.
- **Stage 5 (Completed & Verified)**: Deployed student ID and `@udsm.ac.tz` institutional email verification, student profile management, and segmented 5-point peer review forms.
- **Stage 6 (Completed & Verified)**: Activated full administrative dashboard with multi-role checks (client and server), metrics analytics, and audit log.
- **Stage 7 (Completed & Verified - Mobile-First Quality & Accessibility)**: Comprehensive screen-by-screen audit and remediation:
  - **Touch Target Sizing**: Enforced 44px–48px minimum touch targets across all mobile interactive controls.
  - **Dark Mode Consistency**: Rebalanced color contrasts, borders, and badge styling across dark theme.
  - **Accessibility (A11y)**: Added explicit `aria-label`, `aria-expanded`, and `aria-pressed` attributes; provided screen-reader accessible form labels with `htmlFor` bindings; and added visible high-contrast focus rings.
- **Stage 8 (Completed & Verified - Typography & Character Harmonization)**: Standardized application typography across all UI screens according to the design specification table:
  - **App name / logo**: 22–26 px, Bold (700) (`BrandLogo.tsx`, `.cs-app-logo`)
  - **Screen title**: 22–24 px, Semibold (600) (`ListingDetailModal`, `WantedBoard`, `ProfileView`, `SearchView`, `AdminView`, `SellerView`)
  - **Section heading**: 18–20 px, Semibold (600) (`ListingGrid`, `JijiCategorySidebar`, `JijiRightSidebar`, `ProfileView`, `ChatDrawer`, `SellerView`)
  - **Product name**: 14–16 px, Medium (500) (`ListingCard`, `ListingDetailModal`, `ProfileView`, `SellerView`, `JijiRightSidebar`)
  - **Product price**: 16–18 px, Bold (700) (`ListingCard`, `ListingDetailModal`, `ProfileView`, `SellerView`, `WantedBoard`)
  - **Body text**: 14–16 px, Regular (400) (Descriptions, safety guidelines, chat messages, form notices)
  - **Buttons**: 14–16 px, Semibold (600) (CTAs, filter actions, chat proposal, navigation controls)
  - **Labels / metadata**: 12–13 px, Regular (400–500) (Badges, university indicators, timestamps, hints)
  - **Clean Design Discipline**: Eradicated aggressive `font-black` (900) and oversized headline classes (`text-3xl`, `text-4xl`) in favor of humanized viewport proportions and reusable typography utility tokens in `src/index.css`.
- **Stage 9 (Completed & Verified - Actual Domain Icons for Beauty & Live Buyer Demand)**:
  - **Beauty & Hair**: Replaced decorative star (`Sparkles`) icon with actual salon styling & grooming `Scissors` icon across `categories.ts` and `CategoryIcon.tsx`.
  - **Live Buyer Demands**: Replaced star (`Sparkles`) icon with actual broadcast `Megaphone` icon across `SellerView.tsx`, `BottomNav.tsx`, and `JijiRightSidebar.tsx`.
  - **Quality & Verification**: Verified build with `compile_applet` and `lint_applet` with zero errors.
- **Stage 10 (Completed & Verified - Hero Banner Segment Icons & Targeted Bolding)**:
  - **Campus Safety First**: Added `Lock` icon to the safety badge segment and applied `font-bold` to `Campus safety first` / `Usalama chuoni kwanza`.
  - **Quick Student Cash**: Added `Zap` (quick online) icon to the cash-conversion banner and applied `font-bold` to `Quick student cash` / `Pata pesa ya haraka`.
  - **Campus Market**: Added `Store` (marketplace) icon to the university market badge and applied `font-bold` to `Campus market` / `Soko la wanafunzi`, keeping the university prefix unbolded.
  - **Zero Emoji Verification**: Replaced all remaining raw emojis (`⚖️` with `Scale`, `🤖` with `Bot`) ensuring a 100% clean, professional icon-driven UI.
  - **Build Verification**: Verified zero TypeScript or build errors via `compile_applet` and `lint_applet`.
- **Stage 11 (Completed & Verified - Navy Blue (#2C3E50) + Orange (#E67E22) Palette with University Identity Preservation)**:
  - **Global App Theme & Framing**: Established Navy Blue (`#2C3E50`) for headers, institutional trust banners, and core navigation; High-Converting Orange (`#E67E22`, hover `#D35400`) for primary action buttons (Sell button, In-App Chat, search submit, mobile FAB, Studio shortcuts); and crisp White background.
  - **University Color Identity Registry (`universityColors.ts`)**: Created a dedicated color identity engine mapping each Tanzanian institution to its authentic academic heraldry:
    - **UDSM**: Royal Blue (`#0B4F9C`) & Gold (`#D4AF37`)
    - **UDOM**: Maroon / Wine (`#800020`) & Sun Yellow (`#D4AC0D`)
    - **SUA**: Agricultural Forest Green (`#1B5E20`) & Yellow (`#F1C40F`)
    - **MUHAS**: Medical Deep Teal (`#008080`) & Light Teal (`#48C9B0`)
    - **Ardhi**: Terracotta Earth Red (`#B23B23`) & Ochre (`#D35400`)
    - **Mzumbe**: Plum Purple (`#5E2D79`) & Gold (`#F39C12`)
    - **SAUT**: Marian Cobalt Blue (`#154360`) & Sky Blue (`#5DADE2`)
    - **CBE**: Deep Commerce Navy (`#1A365D`) & Bright Blue (`#2980B9`)
  - **Listings & Campus Boundaries**: Retained authentic university color badges, indicator dots, and border tags on every listing card (`ListingCard.tsx`), listing details header (`ListingDetailModal.tsx`), and campus selector dropdown (`Navbar.tsx`).
  - **Build & Quality Audit**: Verified clean compilation with zero errors via `lint_applet` (`tsc --noEmit`) and `compile_applet` (`vite build`).
- **Stage 12 (Completed & Verified - Background-Only Role Architecture & Zero Visible Role Switchers)**:
  - **Removed Visible Role Segmenters from UI**: Completely removed the desktop and mobile 3-role view segmenter docks (`Buyer`, `Seller`, `Admin`) from the main header navigation (`Navbar.tsx`), giving the search bar expanded room (`max-w-2xl`).
  - **Removed Role Switchers from Admin & Seller Views**: Replaced explicit "Buyer" and "Seller" switcher buttons in `BottomNav.tsx`, `AdminView.tsx`, and `SellerView.tsx` with standard navigation links (`BackHomeButton` / "Back to Marketplace" and administrative functional tabs like Demands & Messages).
  - **Maintained 100% in Backend**: Full role typing (`roleView: RoleView`), context state (`setRoleView`), permissions, verification protocols, and admin authorization remain completely intact and active in the backend logic.
- **Stage 13 (Completed & Verified - Mandatory Role Declaration on Signing & Respective Interface Display)**:
  - **Mandatory Role Declaration in AuthModal**: Added prominent, interactive role declaration selector cards (`Mnunuzi` / Buyer vs `Muuzaji` / Seller) with clear icons, descriptions, and active status indicators right on the sign-in/sign-up screen (`AuthModal.tsx`).
  - **Automatic Routing to Respective Display**: Once declared and signed in (via Phone OTP +255, university email `.ac.tz`, or fast demo login), the application automatically sets `roleView` to the declared role, sets `activeTab` to `'market'`, persists the choice via `StorageService.saveRoleView`, and routes the user into their respective interface display:
    - **Buyer**: Lands directly on the Campus Marketplace (`BuyerView.tsx`) with product feed, category chips, wanted requests, and search.
    - **Seller**: Lands directly on the Seller Studio workspace (`SellerView.tsx`) with inventory management, add listing button, quick performance statistics, and incoming buyer leads.
  - **Onboarding Alignment**: Extended `OnboardingModal.tsx` to include campus role declaration so first-time visitors are also directed into their respective interface upon finishing onboarding.

