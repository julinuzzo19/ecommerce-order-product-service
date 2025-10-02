import newrelic from "newrelic";

export class NewRelicMonitoring {
  // Custom Metrics
  static recordMetric(name: string, value: number): void {
    try {
      newrelic.recordMetric(name, value);
    } catch (error) {
      console.error("Failed to record metric:", error);
    }
  }

  // Custom Events
  static recordEvent(eventType: string, attributes: Record<string, any>): void {
    try {
      newrelic.recordCustomEvent(eventType, attributes);
    } catch (error) {
      console.error("Failed to record event:", error);
    }
  }

  // Distributed Tracing
  static startSegment<T>(name: string, callback: () => T): T {
    return newrelic.startSegment(name, true, callback);
  }

  // Error Tracking
  static noticeError(
    error: Error,
    customAttributes?: Record<string, any>
  ): void {
    try {
      newrelic.noticeError(error, customAttributes);
    } catch (err) {
      console.error("Failed to notice error:", err);
    }
  }

  // Transaction naming
  static setTransactionName(name: string): void {
    try {
      newrelic.setTransactionName(name);
    } catch (error) {
      console.error("Failed to set transaction name:", error);
    }
  }

  // Add custom attributes to current transaction
  static addCustomAttribute(
    key: string,
    value: string | number | boolean
  ): void {
    try {
      newrelic.addCustomAttribute(key, value);
    } catch (error) {
      console.error("Failed to add custom attribute:", error);
    }
  }
}
