import { Client, Journal, Treatment } from "../types";

export const formatJournalDate = (date?: string) => {
  if (!date) return "-";

  const parsed = new Date(date);

  if (isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("sv-SE").format(parsed);
};

export const getJournalClient = (journal: Journal) => {
  if (!journal.clientId || typeof journal.clientId === "string") return null;

  return journal.clientId as Client;
};

export const getJournalClientName = (journal: Journal) => {
  const client = getJournalClient(journal);

  if (!client) return "Borttagen kund";

  return `${client.name} ${client.lastName}`;
};

export const getTreatmentName = (
  treatment: Journal["treatments"][number]["treatmentId"],
) => {
  if (typeof treatment === "string") return "Behandling";

  return (treatment as Treatment).tname || "Behandling";
};

export const getJournalTreatmentNames = (journal: Journal) => {
  return journal.treatments
    .map((session) => getTreatmentName(session.treatmentId))
    .join(", ");
};

export const hasJournalMedicalHistory = (journal: Journal) => {
  return Boolean(journal.medicalHistoryId);
};

export const hasJournalConsentForm = (journal: Journal) => {
  return Boolean(journal.consentFormId);
};