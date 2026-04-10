export class SynthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SynthError";
  }
}
