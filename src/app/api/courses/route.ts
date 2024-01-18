export async function POST(request: Request): Promise<Response> {
    const blob = await request.blob();
  
    console.log(blob);
  
    return new Response();
}