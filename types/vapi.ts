export enum MessageTypeEnum {
  TRANSCRIPT = "transcript",
  FUNCTION_CALL = "function-call",
  FUNCTION_CALL_RESULT = "function-call-result",
  ADD_MESSAGE = "add-message",
}

export enum MessageRoleEnum {
  USER = "user",
  SYSTEM = "system",
  ASSISTANT = "assistant",
}

export enum TranscriptMessageTypeEnum {
  PARTIAL = "partial",
  FINAL = "final",
}

export interface BaseMessage {
  type: MessageTypeEnum;
}

export interface TranscriptMessage extends BaseMessage {
  type: MessageTypeEnum.TRANSCRIPT;
  role: MessageRoleEnum;
  transcriptType: TranscriptMessageTypeEnum;
  transcript: string;
}

export interface FunctionCallMessage extends BaseMessage {
  type: MessageTypeEnum.FUNCTION_CALL;
  functionCall: {
    name: string;
    parameters: unknown;
  };
}

export interface FunctionCallResultMessage extends BaseMessage {
  type: MessageTypeEnum.FUNCTION_CALL_RESULT;
  functionCallResult: {
    forwardToClientEnabled?: boolean;
    result: unknown;
    [a: string]: unknown;
  };
}

export type Message =
  | TranscriptMessage
  | FunctionCallMessage
  | FunctionCallResultMessage;

// Web Speech API type declarations for browsers
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

export interface SpeechRecognitionResult {
  isFinal: boolean;
  0: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
  start(): void;
  stop(): void;
}
