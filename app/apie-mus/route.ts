export function GET(request: Request) {
  return Response.redirect(new URL("/apie", request.url), 308);
}
