import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
  }

  const apiKey = process.env.BRANDFETCH_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Brandfetch API key not configured" },
      { status: 500 }
    );
  }

  try {
    // Use the symbol as the identifier (company domain or name)
    // You might need to map stock symbols to company domains
    const url = `https://api.brandfetch.io/v2/brands/${symbol}`;
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Brand not found" },
          { status: 404 }
        );
      }
      
      const errorText = await response.text();
      console.error(`[Brandfetch API] Error for ${symbol}:`, errorText);
      
      return NextResponse.json(
        { error: "Failed to fetch brand data", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`[Brandfetch API] Exception for ${symbol}:`, error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
