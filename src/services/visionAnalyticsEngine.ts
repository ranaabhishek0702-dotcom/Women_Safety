import { DetectedPerson, SceneAnalytics, RiskLevel } from '../types';

export interface ProximityThreatLink {
  femaleId: string;
  maleId: string;
  femaleCoord: { x: number; y: number };
  maleCoord: { x: number; y: number };
  distance: number;
}

export class VisionAnalyticsEngine {
  private static SURROUNDED_DISTANCE_THRESHOLD = 26; // percentage distance in frame
  private static SURROUNDED_MIN_MEN_COUNT = 3;

  /**
   * Analyzes detected persons and returns comprehensive scene analytics,
   * gender distribution, lone woman detection, and surrounded woman threat detection.
   */
  public static analyzeScene(
    persons: DetectedPerson[],
    isNightTime: boolean
  ): {
    analytics: SceneAnalytics;
    enrichedPersons: DetectedPerson[];
    proximityLinks: ProximityThreatLink[];
  } {
    const totalPersons = persons.length;
    const men = persons.filter((p) => p.gender === 'male');
    const women = persons.filter((p) => p.gender === 'female');

    const menCount = men.length;
    const womenCount = women.length;

    const maleToFemaleRatio =
      womenCount > 0 ? parseFloat((menCount / womenCount).toFixed(1)) : menCount;

    const proximityLinks: ProximityThreatLink[] = [];
    let surroundedWomanDetected = false;
    let loneWomanDetected = false;

    // Deep copy persons to enrich them with analytics metadata
    const enrichedPersons: DetectedPerson[] = persons.map((p) => ({ ...p }));

    // Check for "Woman Surrounded by Men" using spatial clustering & proximity
    for (const female of enrichedPersons.filter((p) => p.gender === 'female')) {
      const fCx = female.bbox.x + female.bbox.width / 2;
      const fCy = female.bbox.y + female.bbox.height / 2;

      let nearbyMenCount = 0;
      let minDistance = 999;

      for (const male of enrichedPersons.filter((p) => p.gender === 'male')) {
        const mCx = male.bbox.x + male.bbox.width / 2;
        const mCy = male.bbox.y + male.bbox.height / 2;

        const distance = Math.hypot(fCx - mCx, fCy - mCy);
        if (distance < minDistance) {
          minDistance = distance;
        }

        if (distance <= this.SURROUNDED_DISTANCE_THRESHOLD) {
          nearbyMenCount++;
          proximityLinks.push({
            femaleId: female.id,
            maleId: male.id,
            femaleCoord: { x: fCx, y: fCy },
            maleCoord: { x: mCx, y: mCy },
            distance,
          });
        }
      }

      female.distanceToNearestFemale = minDistance < 999 ? parseFloat((minDistance / 100).toFixed(2)) : undefined;

      // Threshold: 3 or more men in immediate proximity or 2+ in high isolation
      if (nearbyMenCount >= this.SURROUNDED_MIN_MEN_COUNT) {
        female.isSurrounded = true;
        surroundedWomanDetected = true;
      } else {
        female.isSurrounded = false;
      }
    }

    // Check for "Lone Woman at Night"
    // Criteria: At least 1 female, 0 males or distance to nearest person is high, and night time
    if (womenCount === 1 && menCount === 0 && isNightTime) {
      loneWomanDetected = true;
      const soleWoman = enrichedPersons.find((p) => p.gender === 'female');
      if (soleWoman) {
        soleWoman.isLoneWoman = true;
      }
    } else if (womenCount >= 1 && isNightTime) {
      // Check if any female is solitary (far from anyone)
      for (const female of enrichedPersons.filter((p) => p.gender === 'female')) {
        const otherPeople = enrichedPersons.filter((p) => p.id !== female.id);
        if (otherPeople.length === 0) {
          female.isLoneWoman = true;
          loneWomanDetected = true;
        } else {
          const fCx = female.bbox.x + female.bbox.width / 2;
          const fCy = female.bbox.y + female.bbox.height / 2;
          const minDistanceToAny = Math.min(
            ...otherPeople.map((op) =>
              Math.hypot(
                fCx - (op.bbox.x + op.bbox.width / 2),
                fCy - (op.bbox.y + op.bbox.height / 2)
              )
            )
          );
          if (minDistanceToAny > 45) {
            female.isLoneWoman = true;
            loneWomanDetected = true;
          }
        }
      }
    }

    // Calculate Dynamic Safety Score (0-100) and Risk Level
    let baseSafetyScore = 95;

    if (surroundedWomanDetected) {
      baseSafetyScore -= 65;
    } else if (loneWomanDetected) {
      baseSafetyScore -= 45;
    }

    if (isNightTime && womenCount > 0 && menCount > 2 && maleToFemaleRatio >= 3) {
      baseSafetyScore -= 20;
    }

    if (totalPersons > 8) {
      baseSafetyScore -= 10;
    }

    const safetyScore = Math.max(5, Math.min(100, Math.round(baseSafetyScore)));

    let riskLevel: RiskLevel = 'SAFE';
    if (safetyScore <= 35 || surroundedWomanDetected) {
      riskLevel = 'CRITICAL';
    } else if (safetyScore <= 55 || loneWomanDetected) {
      riskLevel = 'HIGH';
    } else if (safetyScore <= 75) {
      riskLevel = 'MEDIUM';
    } else if (safetyScore < 90) {
      riskLevel = 'LOW';
    } else {
      riskLevel = 'SAFE';
    }

    let densityIndex: 'SPARSE' | 'NORMAL' | 'CROWDED' | 'DANGEROUS' = 'NORMAL';
    if (totalPersons <= 1) densityIndex = 'SPARSE';
    else if (totalPersons <= 5) densityIndex = 'NORMAL';
    else if (totalPersons <= 9) densityIndex = 'CROWDED';
    else densityIndex = 'DANGEROUS';

    let activeThreatCount = 0;
    if (surroundedWomanDetected) activeThreatCount++;
    if (loneWomanDetected) activeThreatCount++;

    return {
      analytics: {
        totalPersons,
        menCount,
        womenCount,
        maleToFemaleRatio,
        riskLevel,
        safetyScore,
        isNightTime,
        loneWomanDetected,
        surroundedWomanDetected,
        sosGestureDetected: false,
        densityIndex,
        activeThreatCount,
      },
      enrichedPersons,
      proximityLinks,
    };
  }

  /**
   * Generates natural micro-movements for simulated persons to mimic live CCTV stream
   */
  public static jitterPositions(persons: DetectedPerson[]): DetectedPerson[] {
    return persons.map((p) => {
      const dx = (Math.random() - 0.5) * 0.8;
      const dy = (Math.random() - 0.5) * 0.5;
      const newX = Math.max(5, Math.min(80, p.bbox.x + dx));
      const newY = Math.max(10, Math.min(75, p.bbox.y + dy));
      return {
        ...p,
        confidence: Math.min(0.99, Math.max(0.82, p.confidence + (Math.random() - 0.5) * 0.02)),
        bbox: {
          ...p.bbox,
          x: parseFloat(newX.toFixed(2)),
          y: parseFloat(newY.toFixed(2)),
        },
      };
    });
  }
}
