
declare global {
  interface Window {
    fbq: (action: string, eventName: string, parameters?: any) => void;
  }
}

export {};
