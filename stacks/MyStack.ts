import { StackContext, Api, EventBus } from "sst/constructs";
import {  getTata } from "@my-sst-app/helpers";
import {  getToto } from "@my-sst-app/helpers";

export function API({ stack }: StackContext) {
  console.log("getToto", getToto());
  console.log("getTata", getTata());
  const bus = new EventBus(stack, "bus", {
    defaults: {
      retries: 10,
    },
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [bus],
      },
    },
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
      "GET /todo": "packages/functions/src/todo.list",
      "POST /todo": "packages/functions/src/todo.create",
    },
  });

  bus.subscribe("todo.created", {
    handler: "packages/functions/src/events/todo-created.handler",
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
