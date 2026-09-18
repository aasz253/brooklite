export interface AdminActionState {
  ok: boolean;
  message: string;
}

export function initialState(): AdminActionState {
  return { ok: true, message: "" };
}

export function successState(message: string): AdminActionState {
  return { ok: true, message };
}

export function errorState(message: string): AdminActionState {
  return { ok: false, message };
}