export function GET(request: Request) {
  return Response.redirect(new URL("/restoranas", request.url), 308);
}
