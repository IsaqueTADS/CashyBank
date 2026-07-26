import { FastifyInstance } from "fastify";

import FastifyMultipart from "@fastify/multipart"

export const multipartPlugin = async (fastify: FastifyInstance) => {
  fastify.register(FastifyMultipart, {
    limits: {
      fileSize: 10 * 1024 * 1024 //10mb
    }
  })

}