export async function POST(request: Request) {
  try {
    const body = await request.formData();
    const email = body.get('email');
    
    // In production, integrate with Beehiiv or your newsletter provider
    // For now, log and return success
    console.log('Newsletter signup:', email);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Newsletter API Error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
