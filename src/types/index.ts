export type Language = 'en' | 'hi';

export interface ActionItem {
  id: string;
  title: string;
  context: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'held';
  category: string;
  urgency: 'high' | 'medium' | 'low';
}

export interface Anomaly {
  id: string;
  title: string;
  details: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium';
  status: 'active' | 'muted' | 'resolved';
}

export interface SystemStats {
  activeShipments: number;
  criticalQueueSize: number;
  slaBreachCountdown: number; // in seconds
  avgQueueAgeSeconds: number; // ticked live
  temperatureDeviation: number;
}
