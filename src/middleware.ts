import routes from "virtual:file-routes";
import { createAPIHandler } from "filesystem-routing/api";

// Answers the GET exports of route modules: the JSON data files and the ebooks.
export default [createAPIHandler(routes)];
