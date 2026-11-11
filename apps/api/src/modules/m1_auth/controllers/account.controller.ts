import type { RequestHandler } from "express";
import { clearAuthCookies } from "../../../shared/auth/cookies.js";
import { ok } from "../../../shared/http/envelope.js";
import { aiKeyBody, deleteMeBody, optInParams, updateMeBody } from "../schemas/account.schemas.js";
import * as account from "../services/account.service.js";
import * as aiKey from "../services/ai-key.service.js";
import { exportData } from "../services/data-export.service.js";

export const updateMe: RequestHandler = async (req, res) => {
  res.json(ok({ user: await account.updateProfile(req.auth!, updateMeBody.parse(req.body)) }));
};

export const listConsents: RequestHandler = async (req, res) => {
  res.json(ok({ consents: await account.listConsents(req.auth!.userId) }));
};

export const optIn: RequestHandler = async (req, res) => {
  await account.optIn(req.auth!.userId, optInParams.parse(req.params).kind);
  res.status(204).end();
};

export const optOut: RequestHandler = async (req, res) => {
  await account.optOut(req.auth!.userId, optInParams.parse(req.params).kind);
  res.status(204).end();
};

// A file to keep, not an API reply: no envelope, indented to be readable, never cached (shared computers).
export const downloadData: RequestHandler = async (req, res) => {
  const data = await exportData(req.auth!.userId);
  res.attachment("ai-tutor-my-data.json").set("Cache-Control", "no-store").send(JSON.stringify(data, null, 2));
};

// 202: the deletion is booked, not done. This browser is logged out at once, like every other.
export const deleteMe: RequestHandler = async (req, res) => {
  const result = await account.requestDeletion(req.auth!.userId, deleteMeBody.parse(req.body).password);
  clearAuthCookies(res);
  res.status(202).json(ok(result));
};

// The learner's own AI key (ADR-0025): never sent back, only what it is and how it's doing.
export const getAiKey: RequestHandler = async (req, res) => {
  res.json(ok({ aiKey: await aiKey.keyView(req.auth!.userId) }));
};

export const saveAiKey: RequestHandler = async (req, res) => {
  res.json(ok({ aiKey: await aiKey.saveKey(req.auth!.userId, aiKeyBody.parse(req.body)) }));
};

export const removeAiKey: RequestHandler = async (req, res) => {
  await aiKey.removeKey(req.auth!.userId);
  res.status(204).end();
};
