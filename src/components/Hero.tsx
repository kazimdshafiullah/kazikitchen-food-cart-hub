
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-kazi-cream to-white overflow-hidden">
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 z-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-kazi-dark mb-4">
            Delicious Food,<br />
            <span className="text-kazi-red">Delivered to Your Door</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-md mx-auto md:mx-0">
            Experience the taste of authentic homemade food with KaziKitchen. 
            Fresh ingredients, amazing recipes, fast delivery.
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
            <Button 
              asChild 
              size="lg" 
              className="bg-kazi-orange hover:bg-opacity-90 text-white px-6 md:px-8"
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
        <div className="md:w-1/2 mt-8 md:mt-0">
          <div className="aspect-square max-w-xs md:max-w-md mx-auto md:ml-auto rounded-full overflow-hidden border-4 md:border-8 border-white shadow-xl">
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
