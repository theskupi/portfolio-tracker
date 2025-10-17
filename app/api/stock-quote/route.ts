import { NextRequest, NextResponse } from "next/server";

const finnhub = require("finnhub");

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
  }

  // const apiKey = process.env.FINNHUB_API_KEY;
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    console.log(`[API] Fetching quote for symbol: ${symbol}`);
    console.log(`[API] API Key present: ${!!apiKey}`);

    // Initialize the API client properly
    // const api_key = finnhub.ApiClient.instance.authentications["api_key"];
    // api_key.apiKey = apiKey;

    // const finnhubClient = new finnhub.DefaultApi();

    const finnhubClient = new finnhub.DefaultApi(process.env.FINNHUB_API_KEY);

    return new Promise((resolve) => {
      finnhubClient.quote(symbol, (error: any, data: any, response: any) => {
        if (error) {
          console.error(`[API] Finnhub API error for ${symbol}:`, error);
          resolve(
            NextResponse.json(
              { error: "Failed to fetch stock data", details: error.message },
              { status: 500 }
            )
          );
        } else {
          console.log(`[API] Successfully fetched quote for ${symbol}:`, data);
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
