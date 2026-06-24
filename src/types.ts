/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ParticipantName = 'Eric' | 'Oliver' | 'Elin';

export interface Participant {
  name: ParticipantName;
  slots: number;
  color: string;
  gradient: string;
  hoverColor: string;
  borderColor: string;
  textColor: string;
  avatarColor: string;
}

export interface Segment {
  id: number;
  name: ParticipantName;
  angleStart: number;
  angleEnd: number;
  color: string;
  textColor: string;
  iconName: string;
}

export interface SpinResult {
  id: string;
  winner: ParticipantName;
  topic: string;
  timestamp: string;
}
