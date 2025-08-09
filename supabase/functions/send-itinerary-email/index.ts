// Deno.serve is built-in, no need to import

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string;
  itinerary: any;
  senderName?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, itinerary, senderName }: EmailRequest = await req.json()

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate HTML email content
    const emailHTML = generateEmailHTML(itinerary, senderName)

    // Send email using Resend (you'll need to add RESEND_API_KEY to your Supabase secrets)
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    
    if (!resendApiKey) {
      console.log('RESEND_API_KEY not found, using mock email service')
      // For demo purposes, return success without actually sending
      return new Response(
        JSON.stringify({ success: true, messageId: 'demo-' + Date.now(), message: 'Email would be sent in production' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'TripCraft <noreply@tripcraft.app>',
        to: [to],
        subject: `Your ${itinerary.destination} Travel Itinerary - ${itinerary.title}`,
        html: emailHTML,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text()
      console.error('Resend API error:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const result = await emailResponse.json()

    return new Response(
      JSON.stringify({ success: true, messageId: result.id }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function generateEmailHTML(itinerary: any, senderName?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${itinerary.title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #2563eb, #3b82f6);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: 700;
        }
        .header-info {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            margin-top: 15px;
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 30px 20px;
        }
        .overview {
            background: #f1f5f9;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #2563eb;
        }
        .day-card {
            margin-bottom: 25px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
        }
        .day-header {
            background: linear-gradient(135deg, #2563eb, #3b82f6);
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .day-content {
            padding: 20px;
        }
        .activities {
            margin-bottom: 15px;
        }
        .activity {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 8px;
            font-size: 14px;
        }
        .time-badge {
            background: #e0e7ff;
            color: #3730a3;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            min-width: 30px;
            text-align: center;
        }
        .meals-accommodation {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 15px;
        }
        .info-box {
            background: #f8fafc;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }
        .info-box h4 {
            margin: 0 0 8px 0;
            font-size: 12px;
            font-weight: 600;
            color: #374151;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .info-box p {
            margin: 0;
            font-size: 13px;
            color: #6b7280;
        }
        .tips {
            background: #fef3c7;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
            border-left: 4px solid #f59e0b;
        }
        .tips h3 {
            margin: 0 0 15px 0;
            color: #92400e;
            font-size: 18px;
        }
        .tip {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-bottom: 8px;
            font-size: 14px;
            color: #78350f;
        }
        .footer {
            background: #f1f5f9;
            padding: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb, #3b82f6);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
        }
        @media (max-width: 600px) {
            .header-info {
                flex-direction: column;
                gap: 8px;
            }
            .meals-accommodation {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${itinerary.title}</h1>
            <div class="header-info">
                <span>📍 ${itinerary.destination}</span>
                <span>⏱️ ${itinerary.duration}</span>
                <span>💰 ${itinerary.totalBudget}</span>
            </div>
            ${senderName ? `<p style="margin-top: 15px; font-size: 14px; opacity: 0.9;">Shared by ${senderName}</p>` : ''}
        </div>

        <div class="content">
            <div class="overview">
                <h3 style="margin: 0 0 10px 0; color: #1e40af;">✈️ Trip Overview</h3>
                <p style="margin: 0; color: #374151;">${itinerary.overview}</p>
            </div>

            <h3 style="color: #1e40af; margin-bottom: 20px;">📅 Daily Itinerary</h3>
            
            ${itinerary.days.map((day: any) => `
                <div class="day-card">
                    <div class="day-header">
                        <div>
                            <strong>Day ${day.day}</strong>
                            <span style="opacity: 0.8; margin-left: 10px;">${new Date(day.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                        </div>
                        ${day.estimatedCost ? `<span style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 12px; font-size: 12px;">${day.estimatedCost}</span>` : ''}
                    </div>
                    <div class="day-content">
                        <div class="activities">
                            ${day.activities.map((activity: string, index: number) => `
                                <div class="activity">
                                    <span class="time-badge">${index === 0 ? 'AM' : index === 1 ? 'PM' : 'EVE'}</span>
                                    <span>${activity}</span>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="meals-accommodation">
                            ${(day.meals.breakfast || day.meals.lunch || day.meals.dinner) ? `
                                <div class="info-box">
                                    <h4>🍽️ Meals</h4>
                                    ${day.meals.breakfast ? `<p><strong>Breakfast:</strong> ${day.meals.breakfast}</p>` : ''}
                                    ${day.meals.lunch ? `<p><strong>Lunch:</strong> ${day.meals.lunch}</p>` : ''}
                                    ${day.meals.dinner ? `<p><strong>Dinner:</strong> ${day.meals.dinner}</p>` : ''}
                                </div>
                            ` : '<div></div>'}
                            
                            ${day.accommodation ? `
                                <div class="info-box">
                                    <h4>🏨 Accommodation</h4>
                                    <p>${day.accommodation}</p>
                                </div>
                            ` : '<div></div>'}
                        </div>
                        
                        ${day.notes ? `
                            <div style="background: #fef3c7; padding: 10px; border-radius: 6px; margin-top: 15px; border-left: 3px solid #f59e0b;">
                                <p style="margin: 0; font-size: 13px; color: #92400e; font-style: italic;"><strong>💡 Note:</strong> ${day.notes}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}

            ${itinerary.tips && itinerary.tips.length > 0 ? `
                <div class="tips">
                    <h3>💡 Essential Travel Tips</h3>
                    ${itinerary.tips.map((tip: string) => `
                        <div class="tip">
                            <span>•</span>
                            <span>${tip}</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>

        <div class="footer">
            <p><strong>TripCraft</strong> - AI-Powered Travel Planning</p>
            <p>This itinerary was generated on ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p style="margin-top: 10px; font-size: 11px; color: #9ca3af;">
                Plan your next adventure at <a href="https://tripcraft.app" style="color: #2563eb;">tripcraft.app</a>
            </p>
        </div>
    </div>
</body>
</html>
  `
}