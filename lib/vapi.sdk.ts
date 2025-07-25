// Web Speech API implementation to replace VAPI
import {
  MessageTypeEnum,
  MessageRoleEnum,
  TranscriptMessageTypeEnum,
  Message,
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
} from "@/types/vapi";

class WebSpeechAPI {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening = false;
  private isProcessing = false; // Add this to prevent multiple simultaneous requests
  private onMessageCallback: ((message: Message) => void) | null = null;
  private onCallStartCallback: (() => void) | null = null;
  private onCallEndCallback: (() => void) | null = null;
  private onSpeechStartCallback: (() => void) | null = null;
  private onSpeechEndCallback: (() => void) | null = null;
  private onErrorCallback: ((error: Error) => void) | null = null;
  private currentAssistant: any = null;
  private conversationMessages: any[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      this.synthesis = window.speechSynthesis;
      this.initializeSpeechRecognition();
    }
  }

  private initializeSpeechRecognition() {
    if (
      typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      const SpeechRecognitionConstructor =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      this.recognition = new SpeechRecognitionConstructor();

      if (this.recognition) {
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = "en-US";

        this.recognition.onstart = () => {
          this.isListening = true;
          console.log("Speech recognition started");
        };

        this.recognition.onresult = (event) => {
          console.log("Speech recognition result received:", event);
          let finalTranscript = "";
          let interimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            console.log(
              `Result ${i}: "${transcript}" (final: ${event.results[i].isFinal})`
            );
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          console.log("Final transcript:", finalTranscript);
          console.log("Interim transcript:", interimTranscript);

          if (
            finalTranscript.trim() &&
            this.onMessageCallback &&
            !this.isProcessing
          ) {
            // Send user message
            const message: Message = {
              type: MessageTypeEnum.TRANSCRIPT,
              transcriptType: TranscriptMessageTypeEnum.FINAL,
              role: MessageRoleEnum.USER,
              transcript: finalTranscript.trim(),
            };
            this.onMessageCallback(message);

            // Process with AI and respond
            this.processUserInput(finalTranscript.trim());
          }
        };

        this.recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          if (this.onErrorCallback) {
            this.onErrorCallback(
              new Error(`Speech recognition error: ${event.error}`)
            );
          }
        };

        this.recognition.onend = () => {
          if (this.isListening) {
            // Restart recognition if it stopped but we're still in a call
            try {
              this.recognition?.start();
            } catch (error) {
              console.log("Recognition restart failed:", error);
            }
          }
        };
      }
    } else {
      console.warn("Speech recognition not supported in this browser");
      if (this.onErrorCallback) {
        this.onErrorCallback(
          new Error("Speech recognition not supported in this browser")
        );
      }
    }
  }

  private async processUserInput(userInput: string) {
    if (this.isProcessing) {
      console.log("Already processing, ignoring duplicate request");
      return;
    }

    this.isProcessing = true;

    try {
      console.log("Processing user input:", userInput);

      // Add user message to conversation
      this.conversationMessages.push({ role: "user", content: userInput });

      const messagesToSend = [
        ...(this.currentAssistant?.model?.messages || []),
        ...this.conversationMessages,
      ];

      console.log("Messages to send:", messagesToSend);

      // Get AI response using your existing OpenAI API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messagesToSend,
        }),
      });

      console.log("API Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("API Response data:", data);

        const aiResponse = data.content || "I understand. Please continue.";

        // Add AI response to conversation
        this.conversationMessages.push({
          role: "assistant",
          content: aiResponse,
        });

        // Send AI message to callback
        if (this.onMessageCallback) {
          const message: Message = {
            type: MessageTypeEnum.TRANSCRIPT,
            transcriptType: TranscriptMessageTypeEnum.FINAL,
            role: MessageRoleEnum.ASSISTANT,
            transcript: aiResponse,
          };
          this.onMessageCallback(message);
        }

        // Speak the AI response
        this.speak(aiResponse);
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("API Error:", response.status, errorData);
        throw new Error(
          `API request failed: ${response.status} - ${
            errorData.error || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error processing user input:", error);
      const fallbackResponse =
        "I'm sorry, I'm having trouble processing your response. Could you please try again?";
      this.speak(fallbackResponse);

      if (this.onErrorCallback) {
        this.onErrorCallback(error as Error);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private speak(text: string) {
    if (typeof window === "undefined" || !this.synthesis) return;

    if (this.onSpeechStartCallback) {
      this.onSpeechStartCallback();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to use a female voice if available
    const voices = this.synthesis.getVoices();
    const femaleVoice = voices.find(
      (voice) =>
        voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("sarah") ||
        voice.name.toLowerCase().includes("samantha") ||
        (voice as any).gender === "female"
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onend = () => {
      if (this.onSpeechEndCallback) {
        this.onSpeechEndCallback();
      }
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
      if (this.onErrorCallback) {
        this.onErrorCallback(
          new Error(`Speech synthesis error: ${event.error}`)
        );
      }
    };

    this.synthesis.speak(utterance);
  }

  async start(
    assistant: any,
    options?: { variableValues?: Record<string, any> }
  ) {
    this.currentAssistant = assistant;

    if (this.onCallStartCallback) {
      this.onCallStartCallback();
    }

    // Initialize conversation with system prompt and variables
    if (assistant && typeof assistant === "object") {
      let systemMessage = assistant.model?.messages?.[0]?.content || "";

      // Replace variables in the system message
      if (options?.variableValues) {
        Object.entries(options.variableValues).forEach(([key, value]) => {
          systemMessage = systemMessage.replace(
            new RegExp(`{{${key}}}`, "g"),
            value
          );
        });
      }

      this.conversationMessages = [
        {
          role: "system",
          content: systemMessage,
        },
      ];

      // Speak the first message if available
      if (assistant.firstMessage) {
        setTimeout(() => {
          this.speak(assistant.firstMessage);
          if (this.onMessageCallback) {
            const message: Message = {
              type: MessageTypeEnum.TRANSCRIPT,
              transcriptType: TranscriptMessageTypeEnum.FINAL,
              role: MessageRoleEnum.ASSISTANT,
              transcript: assistant.firstMessage,
            };
            this.onMessageCallback(message);
          }
        }, 1000);
      }
    }

    // Start speech recognition
    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (error) {
        console.error("Failed to start speech recognition:", error);
        if (this.onErrorCallback) {
          this.onErrorCallback(error as Error);
        }
      }
    } else {
      const error = new Error("Speech recognition not available");
      if (this.onErrorCallback) {
        this.onErrorCallback(error);
      }
    }
  }

  stop() {
    this.isListening = false;
    this.isProcessing = false; // Reset processing flag
    if (this.recognition) {
      this.recognition.stop();
    }
    if (typeof window !== "undefined" && this.synthesis) {
      this.synthesis.cancel();
    }

    if (this.onCallEndCallback) {
      this.onCallEndCallback();
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    switch (event) {
      case "call-start":
        this.onCallStartCallback = callback;
        break;
      case "call-end":
        this.onCallEndCallback = callback;
        break;
      case "message":
        this.onMessageCallback = callback;
        break;
      case "speech-start":
        this.onSpeechStartCallback = callback;
        break;
      case "speech-end":
        this.onSpeechEndCallback = callback;
        break;
      case "error":
        this.onErrorCallback = callback;
        break;
    }
  }

  off(event: string) {
    switch (event) {
      case "call-start":
        this.onCallStartCallback = null;
        break;
      case "call-end":
        this.onCallEndCallback = null;
        break;
      case "message":
        this.onMessageCallback = null;
        break;
      case "speech-start":
        this.onSpeechStartCallback = null;
        break;
      case "speech-end":
        this.onSpeechEndCallback = null;
        break;
      case "error":
        this.onErrorCallback = null;
        break;
    }
  }
}

export const vapi = new WebSpeechAPI();
