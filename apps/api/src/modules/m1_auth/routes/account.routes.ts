import { Router } from "express";
import { authenticate } from "../../../shared/middlewares/authenticate.js";
import { aiKeysByUser, consentsByUser, dataExportByUser, deletionByUser } from "../../../shared/middlewares/rate-limit.js";
import { deleteMe, downloadData, getAiKey, listConsents, optIn, optOut, removeAiKey, saveAiKey, updateMe } from "../controllers/account.controller.js";

// The learner's own data rights (DPDP s.11–13; DOCS/legal/dpdp-compliance.md §5), and their own AI key (ADR-0025).
export const accountRouter = Router()
  .patch("/", authenticate, updateMe)
  .delete("/", authenticate, deletionByUser, deleteMe)
  .get("/data", authenticate, dataExportByUser, downloadData)
  .get("/consents", authenticate, listConsents)
  .put("/consents/:kind", authenticate, consentsByUser, optIn)
  .delete("/consents/:kind", authenticate, consentsByUser, optOut)
  .get("/ai-key", authenticate, getAiKey)
  .put("/ai-key", authenticate, aiKeysByUser, saveAiKey)
  .delete("/ai-key", authenticate, removeAiKey);
