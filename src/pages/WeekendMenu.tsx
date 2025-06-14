import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, Star } from "lucide-react";

// Mock data for weekend menu items
const schoolTiffinMenu = [
  {
    day: "Sunday",
    dayNumber: 0,
    item: "Egg Roll",
    price: 45,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    description: "Delicious egg roll with fresh vegetables",
    available: true,
    deadline: "Saturday 10:00 PM"
  },
  {
    day: "Monday", 
    dayNumber: 1,
    item: "Alu Paratha",
    price: 40,
    image: "https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=400",
    description: "Traditional potato-stuffed paratha",
    available: true,
    deadline: "Sunday 10:00 PM"
  },
  {
    day: "Tuesday",
    dayNumber: 2,
    item: "Chicken Keema Paratha",
    price: 65,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    description: "Spiced chicken keema with soft paratha",
    available: true,
    deadline: "Monday 10:00 PM"
  },
  {
    day: "Wednesday",
    dayNumber: 3,
    item: "Vegetable Roll",
    price: 35,
    image: "https://images.unsplash.com/photo-1601314002957-4edc5a6b8c24?w=400",
    description: "Fresh vegetable roll with herbs",
    available: true,
    deadline: "Tuesday 10:00 PM"
  },
  {
    day: "Thursday",
    dayNumber: 4,
    item: "Fish Fry with Rice",
    price: 85,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
    description: "Crispy fish fry served with steamed rice",
    available: true,
    deadline: "Wednesday 10:00 PM"
  }
];

const officeFoodMenu = {
  breakfast: {
    regular: [
      {
        day: "Sunday",
        dayNumber: 0,
        item: "Paratha with Egg Curry",
        price: 65,
        image: "https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=400",
        description: "Fresh paratha with spiced egg curry",
        available: true
      },
      {
        day: "Monday",
        dayNumber: 1,
        item: "Puri with Aloo Dum", 
        price: 60,
        image: "https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=400",
        description: "Crispy puri with traditional potato curry",
        available: true
      },
      {
        day: "Tuesday",
        dayNumber: 2,
        item: "Khichuri with Omelette",
        price: 70,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Comfort khichuri with fluffy omelette",
        available: true
      },
      {
        day: "Wednesday",
        dayNumber: 3,
        item: "Bread with Dal",
        price: 55,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Fresh bread with protein-rich lentil curry",
        available: true
      },
      {
        day: "Thursday",
        dayNumber: 4,
        item: "Rice with Fish Curry",
        price: 80,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Steamed rice with traditional fish curry",
        available: true
      }
    ],
    diet: [
      {
        day: "Sunday",
        dayNumber: 0,
        item: "Oats with Fruits",
        price: 75,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Healthy oats with fresh seasonal fruits",
        available: true
      },
      {
        day: "Monday",
        dayNumber: 1,
        item: "Wheat Bread with Boiled Egg",
        price: 70,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Whole wheat bread with protein-rich boiled egg",
        available: true
      },
      {
        day: "Tuesday",
        dayNumber: 2,
        item: "Vegetable Upma",
        price: 65,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Nutritious upma with mixed vegetables",
        available: true
      },
      {
        day: "Wednesday",
        dayNumber: 3,
        item: "Daliya with Vegetables",
        price: 68,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Healthy broken wheat with fresh vegetables",
        available: true
      },
      {
        day: "Thursday",
        dayNumber: 4,
        item: "Brown Rice with Grilled Fish",
        price: 90,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Nutritious brown rice with grilled fish",
        available: true
      }
    ],
    premium: [
      {
        day: "Sunday",
        dayNumber: 0,
        item: "Continental Breakfast",
        price: 120,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Premium continental breakfast with variety",
        available: true
      },
      {
        day: "Monday",
        dayNumber: 1,
        item: "Pancakes with Chicken",
        price: 115,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Fluffy pancakes with grilled chicken strips",
        available: true
      },
      {
        day: "Tuesday",
        dayNumber: 2,
        item: "French Toast with Beef",
        price: 130,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Golden french toast with tender beef",
        available: true
      },
      {
        day: "Wednesday",
        dayNumber: 3,
        item: "Sandwich Platter",
        price: 125,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Assorted premium sandwiches",
        available: true
      },
      {
        day: "Thursday",
        dayNumber: 4,
        item: "English Breakfast",
        price: 140,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Full English breakfast with all essentials",
        available: true
      }
    ]
  },
  lunch: {
    regular: [
      {
        day: "Sunday",
        dayNumber: 0,
        item: "Chicken Curry Rice",
        price: 140,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Traditional chicken curry with basmati rice",
        available: true
      },
      {
        day: "Monday",
        dayNumber: 1,
        item: "Fish Curry Rice", 
        price: 145,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Fresh fish curry with steamed rice",
        available: true
      },
      {
        day: "Tuesday",
        dayNumber: 2,
        item: "Chicken Khichuri",
        price: 120,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Comfort food with chicken and lentils",
        available: true
      },
      {
        day: "Wednesday",
        dayNumber: 3,
        item: "Beef Curry Rice",
        price: 160,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Tender beef curry with fragrant rice",
        available: true
      },
      {
        day: "Thursday",
        dayNumber: 4,
        item: "Vegetable Biriyani",
        price: 110,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Aromatic vegetable biriyani with spices",
        available: true
      }
    ],
    diet: [
      {
        day: "Sunday",
        dayNumber: 0,
        item: "Grilled Chicken Salad",
        price: 160,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Healthy grilled chicken with mixed greens",
        available: true
      },
      {
        day: "Monday",
        dayNumber: 1,
        item: "Fish with Steamed Vegetables",
        price: 165,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Low-fat fish with nutritious vegetables",
        available: true
      },
      {
        day: "Tuesday",
        dayNumber: 2,
        item: "Chicken Soup with Brown Rice",
        price: 140,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Protein-rich soup with healthy brown rice",
        available: true
      },
      {
        day: "Wednesday",
        dayNumber: 3,
        item: "Lentil Curry with Quinoa",
        price: 135,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "High-protein lentils with superfood quinoa",
        available: true
      },
      {
        day: "Thursday",
        dayNumber: 4,
        item: "Vegetable Stir Fry",
        price: 120,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Fresh vegetables with minimal oil",
        available: true
      }
    ],
    premium: [
      {
        day: "Sunday",
        dayNumber: 0,
        item: "Mutton Biriyani",
        price: 220,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Premium mutton biriyani with exotic spices",
        available: true
      },
      {
        day: "Monday",
        dayNumber: 1,
        item: "Prawn Curry Rice",
        price: 200,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Fresh prawn curry with premium rice",
        available: true
      },
      {
        day: "Tuesday",
        dayNumber: 2,
        item: "Chicken Roast with Pulao",
        price: 190,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Slow-cooked chicken roast with aromatic pulao",
        available: true
      },
      {
        day: "Wednesday",
        dayNumber: 3,
        item: "Fish Fry Special",
        price: 185,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Premium fish fry with special seasonings",
        available: true
      },
      {
        day: "Thursday",
        dayNumber: 4,
        item: "Kacchi Biriyani",
        price: 250,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        description: "Traditional kacchi biriyani with tender meat",
        available: true
      }
    ]
  }
};

const WeekendMenu = () => {
  const [activeTab, setActiveTab] = useState("school-tiffin");
  const [activeMealType, setActiveMealType] = useState("breakfast");
  const [activeOfficeCategory, setActiveOfficeCategory] = useState("regular");

  // Modified function to show weekend items with better availability logic
  const canOrderForDay = (dayNumber: number, orderType: string) => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute; // Convert to minutes

    if (orderType === "school") {
      // School tiffin: Order by 10 PM the day before
      const orderCutoff = 22 * 60; // 10 PM in minutes
      
      // For weekend view, always show all days but mark as unavailable if past cutoff
      if (currentDay === 6 && dayNumber === 0) { // Saturday ordering for Sunday
        return currentTime < orderCutoff;
      }
      if (currentDay === dayNumber - 1) { // Day before ordering
        return currentTime < orderCutoff;
      }
      if (currentDay < dayNumber) { // Future days
        return true;
      }
      if (currentDay > 4) { // If past Thursday, show next week items
        return true;
      }
      
      return false;
    } else {
      // Office food: Order by 9:30 AM the same day
      const orderCutoff = 9 * 60 + 30; // 9:30 AM in minutes
      
      // For weekend view, show all days but mark availability
      if (currentDay === dayNumber) {
        return currentTime < orderCutoff;
      }
      if (currentDay < dayNumber) {
        return true;
      }
      if (currentDay > 4) { // If past Thursday, show next week items
        return true;
      }
      
      return false;
    }
  };

  // Show all weekend items, including next week if current week is ending
  const getWeekendItems = (items: any[], orderType: string) => {
    const now = new Date();
    const currentDay = now.getDay();
    
    // Always show all current week items
    let weekendItems = [...items];
    
    // If it's Friday (5) or Saturday (6), also show next week items
    if (currentDay >= 5) {
      const nextWeekItems = items.map(item => ({
        ...item,
        day: `Next ${item.day}`,
        isNextWeek: true
      }));
      weekendItems = [...weekendItems, ...nextWeekItems];
    }
    
    return weekendItems;
  };

  const MenuCard = ({ item, type = "school", mealType = "breakfast" }: { item: any, type?: string, mealType?: string }) => {
    const isAvailable = canOrderForDay(item.dayNumber, type);
    const isNextWeek = item.isNextWeek || false;
    
    return (
      <Card className={`group transition-all duration-300 border ${isAvailable ? 'border-amber-200 hover:border-amber-400 hover:shadow-lg' : 'border-gray-200 opacity-75'}`}>
        <CardHeader className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={item.image}
              alt={item.item}
              className={`w-full h-48 object-cover ${isAvailable ? 'group-hover:scale-105' : ''} transition-transform duration-300`}
            />
            <Badge className={`absolute top-2 left-2 ${isNextWeek ? 'bg-purple-500' : 'bg-amber-500'} text-white`}>
              {item.day}
            </Badge>
            {isAvailable ? (
              <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                Available
              </Badge>
            ) : (
              <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                Order Closed
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg text-amber-800 mb-2">{item.item}</CardTitle>
          <p className="text-amber-600 text-sm mb-3">{item.description}</p>
          
          {type === "school" && item.deadline && (
            <div className="flex items-center text-xs text-amber-600 mb-3">
              <Clock className="w-3 h-3 mr-1" />
              Order by: {item.deadline}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-amber-800">৳{item.price}</span>
            <Button 
              asChild
              size="sm"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              disabled={!isAvailable}
            >
              {isAvailable ? (
                <Link to={`/weekend-order/${type}/${item.day.toLowerCase().replace('next ', '')}/${mealType}/${activeOfficeCategory || 'school'}`}>
                  Order Now
                </Link>
              ) : (
                <span>Order Closed</span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const weekendSchoolItems = useMemo(() => getWeekendItems(schoolTiffinMenu, "school"), []);
  const weekendOfficeBreakfastRegular = useMemo(() => getWeekendItems(officeFoodMenu.breakfast.regular, "office"), []);
  const weekendOfficeBreakfastDiet = useMemo(() => getWeekendItems(officeFoodMenu.breakfast.diet, "office"), []);
  const weekendOfficeBreakfastPremium = useMemo(() => getWeekendItems(officeFoodMenu.breakfast.premium, "office"), []);
  const weekendOfficeLunchRegular = useMemo(() => getWeekendItems(officeFoodMenu.lunch.regular, "office"), []);
  const weekendOfficeLunchDiet = useMemo(() => getWeekendItems(officeFoodMenu.lunch.diet, "office"), []);
  const weekendOfficeLunchPremium = useMemo(() => getWeekendItems(officeFoodMenu.lunch.premium, "office"), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-800 mb-4">Weekend Order Menu</h1>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            Plan your weekly meals with our School Tiffin and Office Food services
          </p>
          <div className="mt-4 p-4 bg-amber-100 rounded-lg">
            <p className="text-amber-800 font-medium">
              <Clock className="inline w-4 h-4 mr-2" />
              School Tiffin: Order by 10:00 PM the day before | Office Food: Order by 9:30 AM same day
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="school-tiffin" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              School Tiffin
            </TabsTrigger>
            <TabsTrigger value="office-food" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              Office Food
            </TabsTrigger>
          </TabsList>

          <TabsContent value="school-tiffin">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-amber-800 mb-2">School Tiffin Menu</h2>
              <p className="text-amber-600">Fresh daily tiffin for students - Order by 10 PM the day before</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {weekendSchoolItems.map((item, index) => (
                <MenuCard key={`${item.day}-${index}`} item={item} type="school" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="office-food">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-amber-800 mb-2">Office Food Menu</h2>
              <p className="text-amber-600">Professional catering for offices - Order by 9:30 AM same day</p>
            </div>
            
            <Tabs value={activeMealType} onValueChange={setActiveMealType} className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6">
                <TabsTrigger value="breakfast" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                  Breakfast
                </TabsTrigger>
                <TabsTrigger value="lunch" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                  Lunch
                </TabsTrigger>
              </TabsList>

              <TabsContent value="breakfast">
                <Tabs value={activeOfficeCategory} onValueChange={setActiveOfficeCategory} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto mb-8">
                    <TabsTrigger value="regular" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                      Regular
                    </TabsTrigger>
                    <TabsTrigger value="diet" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                      Diet
                    </TabsTrigger>
                    <TabsTrigger value="premium" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                      Premium
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="regular">
                    {weekendOfficeBreakfastRegular.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {weekendOfficeBreakfastRegular.map((item, index) => (
                          <MenuCard key={`${item.day}-${index}`} item={item} type="office" mealType="breakfast" />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-amber-600">No breakfast orders available for remaining days this week.</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="diet">
                    {weekendOfficeBreakfastDiet.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {weekendOfficeBreakfastDiet.map((item, index) => (
                          <MenuCard key={`${item.day}-${index}`} item={item} type="office" mealType="breakfast" />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-amber-600">No diet breakfast orders available for remaining days this week.</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="premium">
                    {weekendOfficeBreakfastPremium.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {weekendOfficeBreakfastPremium.map((item, index) => (
                          <MenuCard key={`${item.day}-${index}`} item={item} type="office" mealType="breakfast" />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-amber-600">No premium breakfast orders available for remaining days this week.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="lunch">
                <Tabs value={activeOfficeCategory} onValueChange={setActiveOfficeCategory} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto mb-8">
                    <TabsTrigger value="regular" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                      Regular
                    </TabsTrigger>
                    <TabsTrigger value="diet" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                      Diet
                    </TabsTrigger>
                    <TabsTrigger value="premium" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                      Premium
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="regular">
                    {weekendOfficeLunchRegular.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {weekendOfficeLunchRegular.map((item, index) => (
                          <MenuCard key={`${item.day}-${index}`} item={item} type="office" mealType="lunch" />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-amber-600">No lunch orders available for remaining days this week.</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="diet">
                    {weekendOfficeLunchDiet.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {weekendOfficeLunchDiet.map((item, index) => (
                          <MenuCard key={`${item.day}-${index}`} item={item} type="office" mealType="lunch" />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-amber-600">No diet lunch orders available for remaining days this week.</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="premium">
                    {weekendOfficeLunchPremium.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {weekendOfficeLunchPremium.map((item, index) => (
                          <MenuCard key={`${item.day}-${index}`} item={item} type="office" mealType="lunch" />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-amber-600">No premium lunch orders available for remaining days this week.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" className="border-amber-400 text-amber-700 hover:bg-amber-50">
            <Link to="/">← Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WeekendMenu;
