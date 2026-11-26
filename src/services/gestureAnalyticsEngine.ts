import { GestureDetectionState, GestureType } from '../types';

export class GestureAnalyticsEngine {
  /**
   * The Universal Signal for Help (SOS Hand Gesture) comprises 3 sequential stages:
   * Stage 1: Open palm facing camera with four fingers extended upward.
   * Stage 2: Thumb tucked into the palm.
   * Stage 3: Four fingers curled downward over the thumb, enclosing it into a fist.
   */
  public static getStageDescription(stage: 0 | 1 | 2 | 3): string {
    switch (stage) {
      case 1:
        return 'Stage 1/3: Open Palm Facing Camera (Fingers Up, Thumb Out)';
      case 2:
        return 'Stage 2/3: Thumb Tucked Inside Palm';
      case 3:
        return 'Stage 3/3: Fingers Folded Over Thumb (Universal Help Signal)';
      case 0:
      default:
        return 'No distress gesture detected. Keep hand in frame.';
    }
  }

  /**
   * Evaluates gesture analytics state based on sequence and time
   */
  public static evaluateGesture(
    currentStage: 0 | 1 | 2 | 3,
    gestureType: GestureType,
    manualTrigger: boolean = false
  ): GestureDetectionState {
    if (manualTrigger) {
      return {
        gestureType: 'SIGNAL_FOR_HELP',
        stage: 3,
        stageDescription: 'SOS Distress Signal Confirmed! Emergency broadcast initiated.',
        confidence: 99,
        isDistressTriggered: true,
        countdownSeconds: 0,
        lastDetectedTimestamp: Date.now(),
      };
    }

    if (gestureType === 'SIGNAL_FOR_HELP') {
      const isComplete = currentStage === 3;
      const confidence = currentStage === 3 ? 96 : currentStage === 2 ? 82 : currentStage === 1 ? 65 : 0;

      return {
        gestureType: 'SIGNAL_FOR_HELP',
        stage: currentStage,
        stageDescription: this.getStageDescription(currentStage),
        confidence,
        isDistressTriggered: isComplete,
        countdownSeconds: isComplete ? 3 : 0,
        lastDetectedTimestamp: Date.now(),
      };
    }

    if (gestureType === 'RAISED_HANDS') {
      return {
        gestureType: 'RAISED_HANDS',
        stage: 2,
        stageDescription: 'Distress Raised Hands Detected (Surrender / Alarm posture)',
        confidence: 88,
        isDistressTriggered: true,
        countdownSeconds: 3,
        lastDetectedTimestamp: Date.now(),
      };
    }

    return {
      gestureType: 'NONE',
      stage: 0,
      stageDescription: this.getStageDescription(0),
      confidence: 0,
      isDistressTriggered: false,
      countdownSeconds: 0,
      lastDetectedTimestamp: Date.now(),
    };
  }
}
