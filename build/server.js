"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_fastify = __toESM(require("fastify"));
var import_zod = require("zod");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/app.ts
var app = (0, import_fastify.default)();
app.post("/teachers", async (request, reply) => {
  const createTeacherBody = import_zod.z.object({
    nameTeacher: import_zod.z.string(),
    emailTeacher: import_zod.z.string().email(),
    passwordTeacher: import_zod.z.string().min(8)
  });
  const { nameTeacher, emailTeacher, passwordTeacher } = createTeacherBody.parse(request.body);
  await prisma.teacher.create({
    data: {
      name: nameTeacher,
      email: emailTeacher,
      password: passwordTeacher
    }
  });
  return reply.status(201).send();
});

// src/server.ts
app.listen(
  {
    host: "0.0.0.0",
    port: 3333
  },
  () => {
    console.log("HTTP Server running on http://localhost:3333");
  }
);
