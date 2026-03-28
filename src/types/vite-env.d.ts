/// <reference types="vite/client" />

declare module "process" {
  const process: NodeJS.Process;
  export default process;
}

interface Window {
  global: Window;
  Buffer: typeof Buffer;
  process: NodeJS.Process;
}
