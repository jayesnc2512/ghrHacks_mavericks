import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Check, Linkedin } from "lucide-react";
import { LightBulbIcon } from "./Icons";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import helmet from '../assets/helmet.png';
import gloves from '../assets/gloves.png';
import ppekit from '../assets/mainppe.png';
export const HeroCards = () => {
  return (
    <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
      {/* Testimonial */}
      <Card className="absolute w-[340px] -top-[15px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          Helmet Detection
        </CardHeader>

        <CardContent className="p-0">
        <img 
          src={helmet} 
          alt="Helmet Detection" 
          className="w-full h-full object-cover rounded-b-lg"
        />
  </CardContent>
      </Card>

      {/* Team */}
      <Card className="absolute right-[20px] top-4 w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="mt-8 flex justify-center items-center pb-2">
          {/* <img
            src="https://i.pravatar.cc/150?img=58"
            alt="user avatar"
            className="absolute grayscale-[0%] -top-12 rounded-full w-24 h-24 aspect-square object-cover"
          /> */}
          <CardTitle className="text-center">PPE Detection</CardTitle>
          {/* <CardDescription className="font-normal text-primary">
            Frontend Developer
          </CardDescription> */}
        </CardHeader>

        <CardContent className="p-0">
        <img 
          src={ppekit} 
          alt="PPE Detection" 
          className="w-full h-full object-cover rounded-b-lg"
        />
  </CardContent>

      </Card>

      {/* Pricing */}
      <Card className="absolute top-[150px] left-[50px] w-72  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
          Gloves Detection
        </CardHeader>

        <CardContent className="p-0">
        <img 
          src={gloves} 
          alt="Gloves Detection" 
          className="w-full h-full object-cover rounded-b-lg"
        />
  </CardContent>
      </Card>

      {/* Service */}
      <Card className="absolute w-[350px] -right-[10px] bottom-[35px]  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
            <LightBulbIcon />
          </div>
          <div>
            <CardTitle>Fire Detection</CardTitle>
            <CardDescription className="text-md mt-2">
              Fire Detection using Yolov8 and sound alert
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};
