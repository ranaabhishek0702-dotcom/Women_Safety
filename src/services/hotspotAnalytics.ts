import { HotspotZone, SafetyRoute } from '../types';
import { MOCK_HOTSPOTS, MOCK_SAFE_ROUTES } from '../constants/mockHotspots';

export interface PatrolRecommendation {
  unitId: string;
  recommendedHotspot: HotspotZone;
  priority: 'URGENT' | 'HIGH' | 'ROUTINE';
  reason: string;
  suggestedAction: string;
}

export class HotspotAnalyticsService {
  public static getAllHotspots(): HotspotZone[] {
    return [...MOCK_HOTSPOTS];
  }

  public static getSafeRoutes(): SafetyRoute[] {
    return [...MOCK_SAFE_ROUTES];
  }

  public static getTopVulnerableHotspots(limit: number = 3): HotspotZone[] {
    return [...MOCK_HOTSPOTS]
      .sort((a, b) => b.incidentCount - a.incidentCount)
      .slice(0, limit);
  }

  /**
   * Generates strategic deployment recommendations for Bharat Electronics Limited (BEL)
   * command & control center to dispatch PCR vans to vulnerable areas.
   */
  public static generatePatrolRecommendations(): PatrolRecommendation[] {
    const highRiskHotspots = MOCK_HOTSPOTS.filter((h) => h.riskRating === 'HIGH');

    return highRiskHotspots.map((hs, index) => {
      const isTop = index === 0;
      return {
        unitId: `BEL-PCR-${101 + index}`,
        recommendedHotspot: hs,
        priority: isTop ? 'URGENT' : 'HIGH',
        reason: `${hs.incidentCount} historical incidents reported. Vulnerability peak: ${hs.peakVulnerableHours}. Primary threat: ${hs.primaryThreat}`,
        suggestedAction: `Station static interceptor patrol van near ${hs.nearestPatrolUnit} with live thermal camera feed enabled.`,
      };
    });
  }

  /**
   * Computes city safety index across all monitored zones
   */
  public static getOverallCitySafetyMetrics() {
    const totalZones = MOCK_HOTSPOTS.length;
    const highRiskCount = MOCK_HOTSPOTS.filter((h) => h.riskRating === 'HIGH').length;
    const mediumRiskCount = MOCK_HOTSPOTS.filter((h) => h.riskRating === 'MEDIUM').length;
    const lowRiskCount = MOCK_HOTSPOTS.filter((h) => h.riskRating === 'LOW').length;

    const totalIncidents = MOCK_HOTSPOTS.reduce((acc, curr) => acc + curr.incidentCount, 0);
    const averageSafetyScore = Math.round(
      MOCK_HOTSPOTS.reduce((acc, curr) => acc + curr.safetyScore, 0) / totalZones
    );
    const totalActiveCCTV = MOCK_HOTSPOTS.reduce((acc, curr) => acc + curr.activeCCTVCount, 0);

    return {
      totalZones,
      highRiskCount,
      mediumRiskCount,
      lowRiskCount,
      totalIncidents,
      averageSafetyScore,
      totalActiveCCTV,
    };
  }
}
