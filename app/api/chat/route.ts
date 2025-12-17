import { NextRequest, NextResponse } from 'next/server';

const restaurantInfo = {
  name: 'Sajed Restaurant',
  location: 'Manhattan, New York City',
  address: '123 Park Avenue, New York, NY 10001',
  phone: '(212) 555-0123',
  hours: {
    monday: 'Closed',
    tuesday: '5:00 PM - 11:00 PM',
    wednesday: '5:00 PM - 11:00 PM',
    thursday: '5:00 PM - 11:00 PM',
    friday: '5:00 PM - 12:00 AM',
    saturday: '5:00 PM - 12:00 AM',
    sunday: '5:00 PM - 10:00 PM',
  },
  cuisine: 'Contemporary Mediterranean with Persian influences',
  specialties: [
    'Saffron-infused lamb shank',
    'Grilled branzino with pomegranate glaze',
    'Wagyu beef kebab',
    'Truffle mushroom risotto',
    'Baklava with pistachios',
  ],
  priceRange: '$$$$ (Fine Dining)',
  dressCode: 'Business Casual to Formal',
  features: ['Private dining rooms', 'Wine cellar', 'Live music on weekends', 'Valet parking'],
};

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const lowerMessage = message.toLowerCase();
    let response = '';

    if (lowerMessage.includes('reservation') || lowerMessage.includes('book') || lowerMessage.includes('table')) {
      response = `I'd be delighted to help you with a reservation at ${restaurantInfo.name}. You can call us at ${restaurantInfo.phone} to reserve a table. We're open Tuesday through Sunday. Would you like to know our hours for a specific day?`;
    } else if (lowerMessage.includes('hour') || lowerMessage.includes('open') || lowerMessage.includes('close')) {
      response = `${restaurantInfo.name} is open Tuesday through Saturday from 5 PM to 11 PM, Friday and Saturday until midnight, and Sunday from 5 PM to 10 PM. We're closed on Mondays. When would you like to visit us?`;
    } else if (lowerMessage.includes('menu') || lowerMessage.includes('food') || lowerMessage.includes('dish') || lowerMessage.includes('specialty')) {
      response = `Our menu features ${restaurantInfo.cuisine}. Our signature dishes include our famous ${restaurantInfo.specialties[0]}, ${restaurantInfo.specialties[1]}, and ${restaurantInfo.specialties[2]}. We also offer an exquisite ${restaurantInfo.specialties[3]} and finish with our house-made ${restaurantInfo.specialties[4]}. Would you like to hear more about any specific dish?`;
    } else if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where')) {
      response = `${restaurantInfo.name} is located in the heart of ${restaurantInfo.location} at ${restaurantInfo.address}. We offer valet parking for your convenience. Would you like directions?`;
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('expensive')) {
      response = `${restaurantInfo.name} is a fine dining establishment. Our price range is ${restaurantInfo.priceRange}. We offer an unforgettable culinary experience with the finest ingredients and impeccable service. Would you like to know about our tasting menu options?`;
    } else if (lowerMessage.includes('dress') || lowerMessage.includes('attire') || lowerMessage.includes('wear')) {
      response = `Our dress code is ${restaurantInfo.dressCode}. We want you to feel comfortable while maintaining the elegant atmosphere of our restaurant. Business casual or formal attire is perfect for dining with us.`;
    } else if (lowerMessage.includes('parking') || lowerMessage.includes('valet')) {
      response = `Yes, we offer complimentary valet parking for all our guests. Simply pull up to our entrance at ${restaurantInfo.address}, and our valet team will take care of your vehicle.`;
    } else if (lowerMessage.includes('special') || lowerMessage.includes('event') || lowerMessage.includes('private')) {
      response = `${restaurantInfo.name} offers ${restaurantInfo.features.join(', ')}. We're perfect for special occasions, business dinners, and celebrations. Would you like to inquire about private dining for a special event?`;
    } else if (lowerMessage.includes('wine') || lowerMessage.includes('drink') || lowerMessage.includes('bar')) {
      response = `We have an extensive wine collection housed in our temperature-controlled wine cellar, featuring selections from around the world. Our sommelier can help you pair the perfect wine with your meal. We also offer craft cocktails and premium spirits.`;
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      response = `Welcome to ${restaurantInfo.name}, New York's premier destination for ${restaurantInfo.cuisine}! I'm your AI assistant. How may I help you today? I can assist with reservations, menu information, hours, location, and more.`;
    } else if (lowerMessage.includes('thank')) {
      response = `You're very welcome! We look forward to serving you at ${restaurantInfo.name}. If you need anything else, feel free to ask. Have a wonderful day!`;
    } else {
      response = `Thank you for your interest in ${restaurantInfo.name}. I can help you with reservations, our menu, hours of operation, location, special events, and more. What would you like to know?`;
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
