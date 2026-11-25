import type { AuthError } from "../../lib/auth/types";
import type { HistorySyncErrorCode } from "../../lib/history/engine";
import { messagesFor, type Locale } from "../../lib/i18n";

/** Formats a typed AuthError into localized user-facing copy. */
export function formatAuthError(error: AuthError | null, locale: Locale = "vi"): string | null {
  if (!error) return null;
  const errs = messagesFor(locale).account.errors;
  switch (error.code) {
    case "not_configured":
      return errs.notConfigured;
    case "access_denied":
      return errs.accessDenied;
    case "invalid_redirect_uri":
      return errs.invalidRedirectUri;
    case "network":
      return errs.network;
    case "session_expired":
      return errs.sessionExpired;
    case "unknown":
      return error.raw ? errs.genericWithReason(error.raw) : errs.generic;
  }
}

/** Formats a typed HistorySyncErrorCode into localized user-facing copy. */
export function formatSyncError(code: HistorySyncErrorCode | null, locale: Locale = "vi"): string | null {
  if (!code) return null;
  const errs = messagesFor(locale).account.errors;
  switch (code) {
    case "sync_failed":
      return errs.syncFailed;
    case "visit_failed":
      return errs.visitSyncFailed;
    case "complete_failed":
      return errs.completeSyncFailed;
    case "delete_log_failed":
      return errs.deleteLogFailed;
    case "clear_failed":
      return errs.clearFailed;
  }
}
