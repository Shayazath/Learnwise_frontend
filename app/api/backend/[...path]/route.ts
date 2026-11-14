
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_BASE_URL!;

const COOKIE_NAME = "learnwise_access_token";

async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await context.params;
    const endpoint = path.join("/");

    // Prevent cross-origin requests to cookie-authenticated routes.
    const origin = request.headers.get("origin");

    if (
      origin &&
      origin !== request.nextUrl.origin
    ) {
      return NextResponse.json(
        { detail: "Invalid request origin." },
        { status: 403 },
      );
    }

    const token = request.cookies.get(COOKIE_NAME)?.value;

    const backendUrl = new URL(
      `/api/${path.map(encodeURIComponent).join("/")}`,
      API_URL,
    );

    backendUrl.search = request.nextUrl.search;

    const headers = new Headers();

    const contentType = request.headers.get("content-type");
    if (contentType) {
      headers.set("Content-Type", contentType);
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const body =
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.arrayBuffer();

    const backendResponse = await fetch(backendUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });

    const responseBody = await backendResponse.arrayBuffer();

    const responseHeaders = new Headers();

    const responseContentType =
      backendResponse.headers.get("content-type");

    const disposition =
      backendResponse.headers.get("content-disposition");

    if (responseContentType) {
      responseHeaders.set("Content-Type", responseContentType);
    }

    if (disposition) {
      responseHeaders.set("Content-Disposition", disposition);
    }

    const isAuthTokenResponse =
      endpoint === "auth/login" ||
      endpoint === "auth/verify-email" ||
      endpoint === "auth/change-password";

    let responseData: any = null;

    if (isAuthTokenResponse && backendResponse.ok) {
      responseData = JSON.parse(
        new TextDecoder().decode(responseBody),
      );

      const result = NextResponse.json(
        Object.fromEntries(
          Object.entries(responseData).filter(
            ([key]) => key !== "access_token",
          ),
        ),
        { status: backendResponse.status },
      );

      if (responseData.access_token) {
        result.cookies.set({
          name: COOKIE_NAME,
          value: responseData.access_token,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: responseData.expires_in,
        });
      }

      return result;
    }

    const response = new NextResponse(responseBody, {
      status: backendResponse.status,
      headers: responseHeaders,
    });

    if (
      endpoint === "auth/logout" &&
      backendResponse.ok
    ) {
      response.cookies.delete(COOKIE_NAME);
    }

    return response;
  } catch (error) {
    console.error("Backend proxy error:", error);

    return NextResponse.json(
      { detail: "Backend service unavailable." },
      { status: 502 },
    );
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
