import { SynthError } from "./synth-error";

export class TransportError extends SynthError {
  constructor(message: string) {
    super(message);
    this.name = "TransportError";
  }
}
