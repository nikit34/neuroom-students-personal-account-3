/**
 * Analytics module for tracking key business metrics via PostHog.
 *
 * Key metrics (from product requirements):
 * 1. AI tutor conversion (goal: >40%)
 * 2. Completed assignments rate (goal: >70%)
 * 3. Full learning cycle completion (goal: >25%)
 * 4. Feedback views (goal: >80%)
 * 5. Retention DAU/MAU (goal: >0.3)
 *
 * Setup: Replace POSTHOG_API_KEY with your key from https://app.posthog.com
 */

import PostHog from 'posthog-react-native';

// TODO: Replace with your PostHog API key
const POSTHOG_API_KEY = 'phc_N4PSonBY0k9Pgb1FGUZjyPOSxXbRYqw98BCBoXpAog9';
const POSTHOG_HOST = 'https://app.posthog.com';

let posthog: PostHog | null = null;

export async function initAnalytics() {
  if (POSTHOG_API_KEY === '__YOUR_POSTHOG_API_KEY__') {
    if (__DEV__) {
      console.log('[Analytics] PostHog not configured — using console logging only. Set POSTHOG_API_KEY in utils/analytics.ts');
    }
    return;
  }

  posthog = new PostHog(POSTHOG_API_KEY, {
    host: POSTHOG_HOST,
    enableSessionReplay: false,
  });
}

type EventName =
  | 'screen_view'
  | 'assignment_opened'
  | 'photo_uploaded'
  | 'sent_to_parent'
  | 'parent_link_copied'
  | 'sent_to_teacher'
  | 'feedback_viewed'
  | 'ai_tutor_opened'
  | 'ai_tutor_message_sent'
  | 'quiz_started'
  | 'quiz_completed'
  | 'quiz_answer'
  | 'achievement_earned'
  | 'grades_viewed'
  | 'parent_mode_entered';

interface AnalyticsEvent {
  name: EventName;
  params?: Record<string, string | number | boolean>;
  timestamp: string;
}

const eventLog: AnalyticsEvent[] = [];

export function trackEvent(name: EventName, params?: Record<string, string | number | boolean>) {
  const event: AnalyticsEvent = {
    name,
    params,
    timestamp: new Date().toISOString(),
  };

  eventLog.push(event);

  // Send to PostHog
  if (posthog) {
    posthog.capture(name, params);
  }

  // Log in dev for debugging
  if (__DEV__) {
    console.log(`[Analytics] ${name}`, params ?? '');
  }
}

export function trackScreen(screenName: string) {
  if (posthog) {
    posthog.screen(screenName);
  }
  trackEvent('screen_view', { screen: screenName });
}

export function identifyUser(userId: string, properties?: Record<string, string>) {
  if (posthog) {
    posthog.identify(userId, properties);
  }
}

export function getEventLog(): AnalyticsEvent[] {
  return [...eventLog];
}

// Computed metrics helpers
export function getConversionRate(fromEvent: EventName, toEvent: EventName): number {
  const fromCount = eventLog.filter((e) => e.name === fromEvent).length;
  const toCount = eventLog.filter((e) => e.name === toEvent).length;
  if (fromCount === 0) return 0;
  return Math.round((toCount / fromCount) * 100);
}
