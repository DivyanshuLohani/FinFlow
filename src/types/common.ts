import { z } from "zod";

export const ZString = z.string();

export const ZNumber = z.number();

export const ZOptionalNumber = z.number().optional();

export const ZOptionalString = z.string().optional();

export const ZColor = z.string().regex(/^#(?:[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);

export const ZPlacement = z.enum([
  "bottomLeft",
  "bottomRight",
  "topLeft",
  "topRight",
  "center",
]);

export type TPlacement = z.infer<typeof ZPlacement>;

export const ZAllowedFileExtension = z.enum([
  "png",
  "jpeg",
  "jpg",
  "webp",
  "pdf",
  "doc",
  "plain",
]);

export type TAllowedFileExtension = z.infer<typeof ZAllowedFileExtension>;

export const ZId = z.string().cuid();

export const ZUuid = z.string().uuid();

export type TTimeFrame = {
  startDate: Date;
  endDate: Date;
};
