import { NextResponse } from "next/server";
import { getPlatformAccessSession } from "@/lib/billing/require-platform-access";

export async function POST(req: Request) {
  try {
    const access = await getPlatformAccessSession();
    if ("error" in access) {
      return access.error;
    }

    const { source_code, language_id, stdin } = await req.json();

    if (!source_code || !language_id) {
      return NextResponse.json({ error: "Missing source code or compiler ID" }, { status: 400 });
    }

    // 1. Create Runner
    const createUrl = "https://api.paiza.io/runners/create";
    const createResponse = await fetch(createUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_code,
        language: language_id,
        input: stdin || "",
        api_key: "guest",
      }),
    });
    
    const createData = await createResponse.json();

    if (createData.error) {
      return NextResponse.json({
         stdout: null,
         stderr: typeof createData.error === 'string' ? createData.error : JSON.stringify(createData.error),
         compile_output: null,
         status: { id: 13, description: "API Error" }
       });
    }

    // 2. Poll for completion
    let details: any = null;
    let attempts = 0;
    while (attempts < 15) { // 15 seconds max timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      const detailsRes = await fetch(`https://api.paiza.io/runners/get_details?id=${createData.id}&api_key=guest`);
      details = await detailsRes.json();
      
      if (details.status === "completed") {
        break;
      }
      attempts++;
    }

    if (!details || details.status !== "completed") {
      return NextResponse.json({
        stdout: null,
        stderr: "Execution timed out.",
        compile_output: null,
        status: { id: 5, description: "Time Limit Exceeded" }
      });
    }

    let statusId = 3; // Accepted
    let statusDesc = "Accepted";

    if (details.build_exit_code !== 0 && details.build_exit_code !== "0" && details.build_exit_code !== null) {
      statusId = 6;
      statusDesc = "Compilation Error";
    } else if (details.exit_code !== 0 && details.exit_code !== "0") {
      statusId = 13;
      statusDesc = "Runtime Error";
    }

    return NextResponse.json({
      stdout: details.stdout || null,
      stderr: details.stderr || null,
      compile_output: details.build_stderr || details.build_stdout || null,
      status: { id: statusId, description: statusDesc },
      time: details.time || "0.01",
      memory: details.memory ? Math.round(Number(details.memory) / 1024) : 0
    });

  } catch (error: any) {
    console.error("[ExecuteRoute] Error:", error);
    return NextResponse.json(
      {
        stdout: null,
        stderr: "Internal server error occurred while trying to execute code.",
        status: { id: 13, description: "Internal Error" }
      },
      { status: 500 }
    );
  }
}
