import { createServer } from "miragejs";
import { mockVideos } from "../mockData";

export function makeServer({ environment = "development" } = {}) {
  return createServer({
    environment,

    routes() {
      this.namespace = "api";
      this.timing = 800;

      this.get("/videos", () => {
        return mockVideos;
      });

      this.post("/progress", () => {
        return {
          message: "Progress updated",
        };
      });

      this.get("/progress", () => {
        return {
          message: "Progress updated",
        };
      });

      this.namespace = "";
      this.passthrough((request) => !request.url.includes("/api"));
    },
  });
}
