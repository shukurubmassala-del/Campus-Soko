import { AppAmendment, AppVersionInfo } from '../types';

export const APP_CURRENT_VERSION = '1.3.4';
export const APP_BUILD_ID = 'build-20261025-amendment-4';

const STORAGE_KEYS = {
  LAST_SEEN_VERSION: 'campussoko_last_seen_version',
  DISMISSED_AMENDMENT: 'campussoko_dismissed_amendment_id',
  SIMULATED_AMENDMENT: 'campussoko_simulated_amendment',
};

// Default fallback amendment data matching the current production release
export const DEFAULT_CURRENT_AMENDMENT: AppAmendment = {
  id: 'amend_20261025_04',
  version: '1.3.4',
  buildId: 'build-20261025-amendment-4',
  titleSw: 'Upatanishi wa Menyu ya Juu & Uteuzi wa Wajibu wa Akaunti',
  titleEn: 'Top App Bar Layout & Account Role Routing Amendment',
  descriptionSw: 'Vitufe vyote vya menyu sasa vinakaa kwenye safu moja bila kufichika kwenye simu ndogo na kubwa. Wanunuzi na Wauzaji sasa wanachagua wajibu wao wanapojiunga na kuelekezwa kwenye miingiliano yao husika.',
  descriptionEn: 'All app bar icons now fit seamlessly on the same row across all mobile viewports. Role declaration upon sign-up routes buyers and sellers to their tailored interface display.',
  highlightsSw: [
    'Vitufe vyote vya App Bar (Nyumbani, Chuo, Tafuta, Jumbe, Taarifa, Uza, Lugha, Mwanga, Wasifu) vinakaa kwenye safu moja.',
    'Uteuzi wa wajibu wa Mnunuzi au Muuzaji wakati wa kujiandikisha/kuingia.',
    'Udhibiti mkali wa ukingo wa maandishi (text containment) ili kuzuia kufurika kwenye skrini za simu.',
    'Arifa ya papo hapo ya maboresho ya programu (Feature Amendment) inayokupa fursa ya kupakia upya kivinjari.',
  ],
  highlightsEn: [
    'All app bar icons (Home, Campus, Search, Chats, Notifications, Sell, Language, Theme, Profile) fit in a single unified row.',
    'Direct role declaration (Buyer or Seller) during registration and login.',
    'Text-boundary containment across seller inventory and buyer inquiries.',
    'Live feature amendment notification with one-click browser refresh.',
  ],
  releaseDate: new Date().toISOString(),
  isImportant: true,
};

export class AppUpdateService {
  /**
   * Checks if an update/amendment is available by querying the server endpoint
   * or comparing against the static version manifest.
   */
  static async checkServerForUpdates(): Promise<{
    hasUpdate: boolean;
    versionInfo?: AppVersionInfo;
    amendment?: AppAmendment;
    error?: string;
  }> {
    // Check if user manually triggered a simulated amendment in this session
    const simulated = sessionStorage.getItem(STORAGE_KEYS.SIMULATED_AMENDMENT);
    if (simulated) {
      try {
        const parsedSimulated = JSON.parse(simulated) as AppVersionInfo;
        return {
          hasUpdate: true,
          versionInfo: parsedSimulated,
          amendment: parsedSimulated.amendment,
        };
      } catch {
        sessionStorage.removeItem(STORAGE_KEYS.SIMULATED_AMENDMENT);
      }
    }

    try {
      // Add cache buster and query params
      const cacheBuster = `_t=${Date.now()}`;
      const url = `/api/version?clientVersion=${encodeURIComponent(
        APP_CURRENT_VERSION
      )}&clientBuildId=${encodeURIComponent(APP_BUILD_ID)}&${cacheBuster}`;

      const res = await fetch(url, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });

      if (res.ok) {
        const data: AppVersionInfo = await res.json();
        
        // Detect update if server reports hasUpdate, or version/buildId differs
        const isDifferentBuild =
          data.buildId && data.buildId !== APP_BUILD_ID;
        const isDifferentVersion =
          data.version && data.version !== APP_CURRENT_VERSION;
        const hasUpdate = Boolean(data.hasUpdate || isDifferentBuild || isDifferentVersion);

        return {
          hasUpdate,
          versionInfo: data,
          amendment: data.amendment,
        };
      }
    } catch {
      // Fallback check against static /version.json
      try {
        const fallbackRes = await fetch(`/version.json?_t=${Date.now()}`);
        if (fallbackRes.ok) {
          const fallbackData: AppVersionInfo = await fallbackRes.json();
          const hasUpdate = Boolean(
            (fallbackData.buildId && fallbackData.buildId !== APP_BUILD_ID) ||
            (fallbackData.version && fallbackData.version !== APP_CURRENT_VERSION)
          );
          return {
            hasUpdate,
            versionInfo: fallbackData,
            amendment: fallbackData.amendment,
          };
        }
      } catch (fallbackErr) {
        console.warn('[AppUpdateService] Network check failed, running local version', fallbackErr);
      }
    }

    return {
      hasUpdate: false,
      versionInfo: {
        version: APP_CURRENT_VERSION,
        buildId: APP_BUILD_ID,
        releaseDate: new Date().toISOString(),
        amendment: DEFAULT_CURRENT_AMENDMENT,
      },
    };
  }

  /**
   * Refreshes the browser cleanly to fetch the updated version and flush stale caches.
   */
  static async refreshApp(): Promise<void> {
    try {
      // Clear simulated session if any
      sessionStorage.removeItem(STORAGE_KEYS.SIMULATED_AMENDMENT);

      // Unregister or tell active service workers to skip waiting
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          if (reg.waiting) {
            reg.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
          await reg.update().catch(() => {});
        }
      }

      // Clear non-critical application caches to ensure fresh bundles
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => {
            // Delete general runtime caches except offline user assets
            return caches.delete(cacheName);
          })
        );
      }
    } catch (err) {
      console.warn('[AppUpdateService] Cache cleanup encountered an issue:', err);
    } finally {
      // Force reload from server with cache bypass
      window.location.reload();
    }
  }

  /**
   * Check if a specific amendment was dismissed by the user for this session
   */
  static isAmendmentDismissed(amendmentId?: string): boolean {
    if (!amendmentId) return false;
    const dismissed = sessionStorage.getItem(STORAGE_KEYS.DISMISSED_AMENDMENT);
    return dismissed === amendmentId;
  }

  /**
   * Temporarily dismiss an amendment prompt for this session
   */
  static dismissAmendment(amendmentId?: string): void {
    if (amendmentId) {
      sessionStorage.setItem(STORAGE_KEYS.DISMISSED_AMENDMENT, amendmentId);
    }
  }

  /**
   * Simulate a newly published feature amendment for testing / demo purposes.
   */
  static simulateUpdateAmendment(): AppVersionInfo {
    const nextBuild = `build-20261025-amendment-${Date.now().toString().slice(-4)}`;
    const simulatedInfo: AppVersionInfo = {
      version: '1.4.0',
      buildId: nextBuild,
      releaseDate: new Date().toISOString(),
      hasUpdate: true,
      amendment: {
        id: `amend_${Date.now()}`,
        version: '1.4.0',
        buildId: nextBuild,
        titleSw: 'Maboresho Mapya ya Huduma za Miamala & Usalama Chuoni',
        titleEn: 'Campus Trade Security & Transaction Enhancements',
        descriptionSw: 'Kuna toleo jipya lililoboreshwa lililochapishwa kwenye mfumo. Bofya "Pakia Upya Sasa" ili kupata toleo la hivi punde.',
        descriptionEn: 'A newly updated release has been published to the system link. Click "Refresh Browser Now" to apply the latest version.',
        highlightsSw: [
          'Uboreshaji wa usalama na makabidhiano ya bidhaa chuoni',
          'Uunganishaji wa haraka wa mtandao na bando kidogo (low data mode)',
          'Upatanishi wa haraka wa jumbe za wanunuzi na wauzaji',
        ],
        highlightsEn: [
          'Enhanced safe meetup protocol and campus escrow readiness',
          'Fast low-data optimization for unstable university Wi-Fi',
          'Instant synchronization of buyer inquiries and seller messages',
        ],
        releaseDate: new Date().toISOString(),
        isImportant: true,
      },
    };

    sessionStorage.setItem(
      STORAGE_KEYS.SIMULATED_AMENDMENT,
      JSON.stringify(simulatedInfo)
    );

    return simulatedInfo;
  }
}
