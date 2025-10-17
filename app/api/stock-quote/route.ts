import { NextRequest, NextResponse } from "next/server";

const finnhub = require("finnhub");

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
  }

  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const finnhubClient = new finnhub.DefaultApi(process.env.FINNHUB_API_KEY);

    return new Promise<NextResponse>((resolve) => {
      finnhubClient.quote(symbol, (error: any, data: any, response: any) => {
        if (error) {
          resolve(
            NextResponse.json(
              { error: "Failed to fetch stock data", details: error.message },
              { status: 500 }
            )
          );
        } else {
          resolve(NextResponse.json(data));
        }
      });
    });
  } catch (error) {
    console.error(`[API] Exception for ${symbol}:`, error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
