import { Statistics } from "./Statistics";
import pilot from "../assets/pilot.png";

export const About = () => {
  return (
    <section
      id="about"
      className="container py-24 sm:py-32"
    >
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-4 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <img
            src={pilot}
            alt=""
            className="w-[400px] object-contain rounded-lg"
          />
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  About{" "}
                </span>
                Our Project
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
              Our project is an AI-powered workplace safety system that 
              uses CCTV cameras to detect missing Personal Protective Equipment (PPE) 
              like helmets, goggles, and safety shoes in real time. When a violation is 
              detected, automated alerts are sent to safety managers via mobile apps or emails, 
              enabling quick intervention. The system maintains an incident log for future analysis 
              and compliance tracking. It offers customizable safety rules to adapt to different 
              worksites and provides an intuitive dashboard for monitoring violations. Scalable 
              across multiple locations, it ensures a proactive approach to workplace safety.
            </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
