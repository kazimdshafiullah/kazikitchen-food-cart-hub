
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-kazi-cream to-white overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-kazi-dark mb-4">
            Delicious Food,<br />
            <span className="text-kazi-red">Delivered to Your Door</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            Experience the taste of authentic homemade food with KaziKitchen. 
            Fresh ingredients, amazing recipes, fast delivery.
          </p>
          <div className="flex space-x-4">
            <Button 
              asChild 
              size="lg" 
              className="bg-kazi-orange hover:bg-opacity-90 text-white px-8"
            >
              <a href="#categories">Explore Menu</a>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="border-kazi-orange text-kazi-orange hover:bg-kazi-orange hover:text-white"
            >
              <Link to="/#popular">Popular Items</Link>
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0">
          <div className="aspect-square max-w-md mx-auto md:ml-auto rounded-full overflow-hidden border-8 border-white shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500" 
              alt="Delicious Food" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
