import redirect from "nextjs-redirect";

const Redirect = redirect("/"); // By default, it sends a 301 status code so not need to specify

export default function Custom404() {
  return <Redirect />;
}
