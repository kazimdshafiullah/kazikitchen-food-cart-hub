
import { useState } from "react";
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
    item: "Egg Roll",
    price: 45,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    description: "Delicious egg roll with fresh vegetables",
    available: true,
    deadline: "Saturday 10:00 PM"
  },
  {
    day: "Monday", 
    item: "Alu Paratha",
    price: 40,
    image: "https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=400",
    description: "Traditional potato-stuffed paratha",
    available: true,
    deadline: "Sunday 10:00 PM"
  },
  {
    day: "Tuesday",
    item: "Chicken Keema Paratha",
    price: 65,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    description: "Spiced chicken keema with soft paratha",
    available: true,
    deadline: "Monday 10:00 PM"
  },
  {
    day: "Wednesday",
    item: "Vegetable Roll",
    price: 35,
    image: "https://images.unsplash.com/photo-1601314002957-4edc5a6b8c24?w=400",
    description: "Fresh vegetable roll with herbs",
    available: true,
    deadline: "Tuesday 10:00 PM"
  },
  {
    day: "Thursday",
    item: "Fish Fry with Rice",
    price: 85,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
    description: "Crispy fish fry served with steamed rice",
    available: true,
    deadline: "Wednesday 10:00 PM"
  }
];

const officeFoodMenu = {
  regular: [
    {
      day: "Sunday",
      item: "Chicken Curry Rice",
      price: 140,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
      description: "Traditional chicken curry with basmati rice",
      available: true
    },
    {
      day: "Monday",
      item: "Fish Curry Rice", 
      price: 145,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
      description: "Fresh fish curry with steamed rice",
      available: true
    },
    {
      day: "Tuesday",
      item: "Chicken Khichuri",
      price: 120,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
      description: "Comfort food with chicken and lentils",
      available: true
    },
    {
      day: "Wednesday",
      item: "Beef Curry Rice",
      price: 160,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
      description: "Tender beef curry with fragrant rice",
      available: true
    },
    {
      day: "Thursday",
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
      item: "Grilled Chicken Salad",
      price: 160,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
      description: "Healthy grilled chicken with mixed greens",
      available: true
    },
    {
      day: "Monday",
      item: "Fish with Steamed Vegetables",
      price: 165,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
      description: "Low-fat fish with nutritious vegetables",
      available: true
    },
    {
      day: "Tuesday",
      item: "Chicken Soup with Brown Rice",
      price: 140,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
      description: "Protein-rich soup with healthy brown rice",
      available: true
    },
    {
      day: "Wednesday",
      item: "Lentil Curry with Quinoa",
      price: 135,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
      description: "High-protein lentils with superfood quinoa",
      available: true
    },
    {
      day: "Thursday",
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
      item: "Mutton Biriyani",
      price: 220,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
      description: "Premium mutton biriyani with exotic spices",
      available: true
    },
    {
      day: "Monday",
      item: "Prawn Curry Rice",
      price: 200,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
      description: "Fresh prawn curry with premium rice",
      available: true
    },
    {
      day: "Tuesday",
      item: "Chicken Roast with Pulao",
      price: 190,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
      description: "Slow-cooked chicken roast with aromatic pulao",
      available: true
    },
    {
      day: "Wednesday",
      item: "Fish Fry Special",
      price: 185,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
      description: "Premium fish fry with special seasonings",
      available: true
    },
    {
      day: "Thursday",
      item: "Kacchi Biriyani",
      price: 250,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
      description: "Traditional kacchi biriyani with tender meat",
      available: true
    }
  ]
};

const WeekendMenu = () => {
  const [activeTab, setActiveTab] = useState("school-tiffin");
  const [activeOfficeCategory, setActiveOfficeCategory] = useState("regular");

  const MenuCard = ({ item, type = "school" }: { item: any, type?: string }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-amber-200 hover:border-amber-400">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={item.image}
            alt={item.item}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-2 left-2 bg-amber-500 text-white">
            {item.day}
          </Badge>
          {item.available ? (
            <Badge className="absolute top-2 right-2 bg-green-500 text-white">
              Available
            </Badge>
          ) : (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white">
              Sold Out
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
            disabled={!item.available}
          >
            <Link to={`/weekend-order/${type}/${item.day.toLowerCase()}/${activeOfficeCategory || 'school'}`}>
              Order Now
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-800 mb-4">Weekend Order Menu</h1>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            Plan your weekly meals with our School Tiffin and Office Food services
          </p>
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
              {schoolTiffinMenu.map((item) => (
                <MenuCard key={item.day} item={item} type="school" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="office-food">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-amber-800 mb-2">Office Food Menu</h2>
              <p className="text-amber-600">Professional catering for offices - Order by 9:30 AM</p>
            </div>
            
            {/* Office Food Categories */}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {officeFoodMenu.regular.map((item) => (
                    <MenuCard key={item.day} item={item} type="office" />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="diet">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {officeFoodMenu.diet.map((item) => (
                    <MenuCard key={item.day} item={item} type="office" />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="premium">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {officeFoodMenu.premium.map((item) => (
                    <MenuCard key={item.day} item={item} type="office" />
                  ))}
                </div>
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
