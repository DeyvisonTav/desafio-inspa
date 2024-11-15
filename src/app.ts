import fastify from "fastify";
import { z } from "zod";
import { prisma } from "./lib/prisma";
import { compare, hash } from "bcrypt";
export const app = fastify();

app.post("/teachers", async (request, reply) => {
  const createTeacherBody = z.object({
    nameTeacher: z.string(),
    emailTeacher: z.string().email(),
    passwordTeacher: z.string().min(8),
  });

  const { nameTeacher, emailTeacher, passwordTeacher } =
    createTeacherBody.parse(request.body);

  const passwordHash = await hash(passwordTeacher, 6);
  await prisma.teacher.create({
    data: {
      name: nameTeacher,
      email: emailTeacher,
      password: passwordHash,
    },
  });

  return reply.status(201).send();
});

app.post("/auth", async (request, reply) => {
  const loginTeacherBody = z.object({
    emailTeacher: z.string().email(),
    passwordTeacher: z.string(),
  });

  const { emailTeacher, passwordTeacher } = loginTeacherBody.parse(
    request.body
  );

  const teacher = await prisma.teacher.findUnique({
    where: {
      email: emailTeacher,
    },
  });

  if (!teacher) {
    return reply.status(401).send({
      message: "Teacher not found",
    });
  }

  const matchPassword = await compare(passwordTeacher, teacher.password);

  if (!matchPassword) {
    return reply.status(401).send({
      message: "Teacher not found",
    });
  }

  return reply.status(200).send({
    id: teacher.id,
    name: teacher.name,
    email: teacher.email,
  });
});
