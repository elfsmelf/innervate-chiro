"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Phone,
  MapPin,
  Star,
  Shield,
  Zap,
  Heart,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  CalendarCheck,
  BadgeCheck,
} from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { type CarouselApi } from "@/components/ui/carousel";
import { useSourcebuster } from "@/hooks/use-sourcebuster";
import { getClickIds, newLeadId, savePendingLead } from "@/lib/tracking";

const services = [
  { name: "Neck Pain", description: "Relief from stiffness and tension" },
  { name: "Back Pain", description: "Lower, mid, and upper back treatment" },
  { name: "Hip & Gluteal Pain", description: "Hip alignment and muscle tension" },
  { name: "Migraines & Headaches", description: "Natural headache relief" },
  { name: "Bad Posture", description: "Correct postural imbalances" },
  { name: "Sciatica", description: "Sciatic nerve pain relief" },
  { name: "Shoulder Pain", description: "Restore mobility and comfort" },
  { name: "Nerve Pain", description: "Pinched nerve treatment" },
  { name: "Trouble Sleeping", description: "Improve sleep quality" },
  { name: "Sports Injuries", description: "Recovery and prevention" },
];

const howItWorks = [
  {
    step: "01",
    title: "Make an Appointment",
    description: "Book online or call our clinic at a time that suits you. We offer flexible hours, including after-hours appointments.",
    icon: CalendarCheck,
  },
  {
    step: "02",
    title: "Consultation & Assessment",
    description: "Dr Matt takes the time to understand your health goals, complete a full posture and movement assessment, and discuss your options clearly.",
    icon: Users,
  },
  {
    step: "03",
    title: "Personalised Care Plan",
    description: "If chiropractic care is suitable, you'll receive a tailored plan focused on improving balance, mobility, and function.",
    icon: Heart,
  },
  {
    step: "04",
    title: "Gentle, Hands-On Care",
    description: "Experience safe, evidence-based techniques designed to help your body move and perform at its best — comfortably and naturally.",
    icon: Shield,
  },
];

const examIncludes = [
  "Thorough Chiropractic Consultation",
  "Neurological & Orthopaedic Testing",
  "Detailed 21-Point Spinal Exam",
  "Full Spinal X-ray Analysis (free with Medicare)",
];

const reviewImages = [
  "innervate%20chiro%20reviews1.png",
  "innervate%20chiro%20reviews2.png",
  "innervate%20chiro%20reviews3.png",
  "innervate%20chiro%20reviews4.png",
  "innervate%20chiro%20reviews5.png",
  "innervate%20chiro%20reviews6.png",
  "innervate%20chiro%20reviews7.png",
  "innervate%20chiro%20reviews8.png",
  "innervate%20chiro%20reviews9.png",
];

function ReviewsCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="mx-auto max-w-2xl">
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {reviewImages.map((image, i) => (
            <CarouselItem key={i} className="flex items-center justify-center min-h-[400px]">
              <div className="overflow-hidden rounded-xl border border-[#b0bde6]/30 bg-white shadow-sm">
                <img
                  src={`https://assets.guestsnapper.com/wedding-gallery-media/${image}`}
                  alt={`Google Review ${i + 1}`}
                  className="h-auto w-full object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex -left-12 border-[#b0bde6] bg-white text-[#0d2577] hover:bg-[#f8faff]" />
        <CarouselNext className="hidden sm:flex -right-12 border-[#b0bde6] bg-white text-[#0d2577] hover:bg-[#f8faff]" />
      </Carousel>

      {/* Dots */}
      <div className="mt-6 flex justify-center gap-3 sm:gap-2">
        {reviewImages.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`h-3 w-3 rounded-full transition-all sm:h-2.5 sm:w-2.5 ${
              current === i
                ? "bg-[#0d2577] w-8 sm:w-6"
                : "bg-[#b0bde6] hover:bg-[#627acc]"
            }`}
            aria-label={`Go to review ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const trackingData = useSourcebuster();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const leadId = newLeadId();
    const clickIds = getClickIds();
    const submissionData = {
      ...formData,
      lead_id: leadId,
      date_time: new Date().toISOString(),
      gclid: trackingData?.gclid || clickIds.gclid,
      gbraid: clickIds.gbraid,
      wbraid: clickIds.wbraid,
      ...(trackingData && {
        channel: trackingData.channel,
        source: trackingData.source,
        medium: trackingData.medium,
        campaign: trackingData.campaign,
        content: trackingData.content,
        term: trackingData.term,
        firstSource: trackingData.firstSource,
        firstMedium: trackingData.firstMedium,
        firstCampaign: trackingData.firstCampaign,
        visits: trackingData.visits,
        pagesSeen: trackingData.pagesSeen,
        landingPage: trackingData.landingPage,
        leadPage: trackingData.leadPage,
        referer: trackingData.referer,
      }),
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        // The conversion fires on /voucher-code, once, using this hand-off.
        savePendingLead({
          leadId,
          name: formData.name,
          email: formData.email,
          phone: formData.mobile,
        });
        window.location.href = "/voucher-code";
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="absolute left-0 right-0 top-0 z-50">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center">
            <img
              src="https://assets.guestsnapper.com/wedding-gallery-media/innervate%20chiro%20darkmode.webp"
              alt="Innervate Chiro"
              className="h-16 w-auto"
            />
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#services" className="text-sm font-medium text-white/90 transition-colors hover:text-white">
              Services
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-white/90 transition-colors hover:text-white">
              How It Works
            </a>
            <a href="#contact" className="text-sm font-medium text-white/90 transition-colors hover:text-white">
              Contact
            </a>
          </nav>
          <a href="tel:+61481882278">
            <Button className="h-12 gap-2 rounded-full bg-[#ff9b36] px-4 hover:bg-[#e88520] sm:px-6">
              <Phone className="h-5 w-5" />
              <span className="hidden sm:inline">(04) 8188 2278</span>
            </Button>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden pb-32 pt-28 lg:pb-40 lg:pt-32"
        style={{
          background: "linear-gradient(135deg, #0d2577 0%, #0d2577 30%, #1a3a9e 50%, #3a5aaa 70%, #627acc 100%)"
        }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-8">
            {/* Left Content */}
            <div>
              <h1 className="mb-2 font-serif text-5xl font-normal italic leading-tight text-white drop-shadow-sm md:text-6xl lg:text-7xl">
                {title || "New Client Offer"}
              </h1>
              <h2 className="mb-6 text-2xl font-light text-white md:text-3xl lg:text-4xl">
                Your Comprehensive Exam
                <br />
                & X-ray{" "}
                <span className="font-bold text-[#ff9b36]">ONLY $37</span>
              </h2>

              <p className="mb-8 max-w-md text-base leading-relaxed text-white/80 md:text-lg">
                At Innervate Chiro, we offer personalised treatment plans that focus on
                your unique health goals. Dr Matt uses traditional low force techniques
                to help your body self-heal and self-regulate.
              </p>

              <div className="mb-12 flex flex-col gap-4 sm:flex-row">
                <a href="#contact" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 w-full rounded-full border-2 border-white bg-white px-8 text-base font-semibold text-[#0d2577] hover:bg-white/90 sm:h-12 sm:w-auto"
                  >
                    Get The New Patient Offer
                  </Button>
                </a>
                <a href="tel:+61481882278" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="h-14 w-full gap-2 rounded-full bg-[#ff9b36] px-8 text-base font-semibold hover:bg-[#e88520] sm:h-12 sm:w-auto"
                  >
                    <Phone className="h-5 w-5" />
                    (04) 8188 2278
                  </Button>
                </a>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-8 lg:gap-12">
                <div>
                  <p className="text-4xl font-bold text-white md:text-5xl">110+</p>
                  <p className="text-sm text-white/70">5-Star Reviews</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-white md:text-5xl">1,000+</p>
                  <p className="text-sm text-white/70">Patients Helped</p>
                </div>
              </div>
            </div>

            {/* Right - Hero Image */}
            <div className="relative">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-white shadow-2xl">
                <img
                  src="https://assets.guestsnapper.com/wedding-gallery-media/innervate%20chiro%20hero.jpg"
                  alt="Dr Matt helping a patient"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* About Section */}
      <section className="relative z-0 bg-[#f8faff] pb-16 pt-52 md:pb-24 md:pt-44">
        {/* Trust Bar - Centered between sections */}
        <div className="absolute left-0 right-0 top-0 z-20 -translate-y-1/2 px-4 lg:px-8">
          <div className="container mx-auto">
            <Card className="rounded-2xl border border-[#b0bde6]/20 bg-white shadow-lg">
              <CardContent className="flex flex-col items-center justify-evenly gap-4 p-5 sm:gap-6 sm:p-6 md:flex-row lg:px-12 lg:py-8">
                <div className="flex w-full items-center justify-center gap-3 text-center md:w-auto md:text-left">
                  <BadgeCheck className="h-6 w-6 shrink-0 text-[#627acc]" />
                  <p className="text-sm font-medium text-[#0d2577] sm:text-base lg:text-lg">All Health Funds Accepted</p>
                </div>
                <div className="hidden h-10 w-px bg-[#b0bde6]/50 md:block" />
                <div className="flex w-full items-center justify-center gap-3 border-t border-[#b0bde6]/30 pt-4 text-center md:w-auto md:border-0 md:pt-0 md:text-left">
                  <Users className="h-6 w-6 shrink-0 text-[#627acc]" />
                  <p className="text-sm font-medium text-[#0d2577] sm:text-base lg:text-lg">Care for the Whole Family</p>
                </div>
                <div className="hidden h-10 w-px bg-[#b0bde6]/50 md:block" />
                <div className="flex w-full items-center justify-center gap-3 border-t border-[#b0bde6]/30 pt-4 text-center md:w-auto md:border-0 md:pt-0 md:text-left">
                  <CalendarCheck className="h-6 w-6 shrink-0 text-[#627acc]" />
                  <p className="text-sm font-medium text-[#0d2577] sm:text-base lg:text-lg">Easy Online Booking</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            {/* Left - Photo */}
            <div className="relative w-[90%] mx-auto lg:mx-0">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-xl">
                <img
                  src="https://assets.guestsnapper.com/wedding-gallery-media/matt%20about%20us%20profile%20shot.webp"
                  alt="Dr Matt Moschione"
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <Badge className="mb-4 bg-[#0d2577]/10 text-[#0d2577] hover:bg-[#0d2577]/10">
                About
              </Badge>
              <h2 className="mb-6 font-serif text-4xl italic text-[#0d2577] md:text-5xl">
                Dr. Matt
              </h2>

              <div className="space-y-4 text-[#727272]">
                <p>
                  Prior to Dr Matt embarking on his Chiropractic journey, he spent years working as a massage therapist in Sydney and Italy in clinics and with a football team. He was an athlete in football and track/field since young and still loves playing sports. He also has a passion for DJing electronic music and wishes to produce his own one day!
                </p>
                <p>
                  He knew there were more profound changes in clients&apos; health to be made which lead to studying his Master of Chiropractic at Macquarie University in Sydney where he originates from.
                </p>
                <p>
                  He is a thorough professional and believes in rendering the best services. He analyses the root and the underlying causes of the problem before giving a treatment. His treatment has been effective to a lot of patients and has many happy clients. His expertise in his chiro practice in Woolloongabba, Queensland has made him the best and highly recommended.
                </p>
                <p className="font-medium text-[#0d2577]">
                  Chiropractic to Dr Matt is an essential part of a healthy lifestyle, just like brushing your teeth or being happy!
                </p>
              </div>

              <p className="mt-6 font-serif text-xl italic text-[#0d2577]">
                Dr. Matt Moschione
              </p>

              {/* Mission & Vision */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <Card className="border-0 bg-white shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="mb-2 font-serif text-xl italic text-[#0d2577]">Our Mission</h3>
                    <p className="text-sm text-[#727272]">
                      To help people move better and live well through gentle, personalised care.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-white shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="mb-2 font-serif text-xl italic text-[#0d2577]">Our Vision</h3>
                    <p className="text-sm text-[#727272]">
                      To create a healthier, more connected community.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a href="#contact" className="w-full sm:w-auto">
                  <Button size="lg" className="h-14 w-full gap-2 rounded-full bg-[#ff9b36] px-8 text-base font-semibold text-white hover:bg-[#e88520] sm:h-12 sm:w-auto">
                    Get The New Patient Offer
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </a>
                <a href="tel:+61481882278" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="h-14 w-full gap-2 rounded-full border-2 border-[#0d2577] px-8 text-base font-semibold text-[#0d2577] hover:bg-[#0d2577]/5 sm:h-12 sm:w-auto">
                    <Phone className="h-5 w-5" />
                    (04) 8188 2278
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-[#727272]">
              Trusted by Brisbane Locals
            </p>
            <img
              src="https://assets.guestsnapper.com/wedding-gallery-media/115%20google%20reviews.png"
              alt="115 Google Reviews - 5 Stars"
              className="mx-auto h-auto max-w-xs"
            />
          </div>

          {/* Reviews Carousel */}
          <ReviewsCarousel />
        </div>
      </section>

      {/* What's Included Section */}
      <section className="bg-[#f8faff] py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-white text-[#0d2577] hover:bg-white">
              Normally $145
            </Badge>
            <h2 className="mb-4 font-serif text-3xl italic text-[#0d2577] md:text-4xl">
              What&apos;s Included in Your $37 Exam
            </h2>
            <p className="mb-10 text-[#727272]">
              Get a comprehensive assessment to understand exactly what&apos;s causing your pain
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {examIncludes.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl bg-white p-4 text-left shadow-sm"
                >
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-[#ff9b36]" />
                  <span className="font-medium text-[#0d2577]">{item}</span>
                </div>
              ))}
            </div>

            <a href="#contact" className="mt-8 block">
              <Button size="lg" className="h-14 w-full gap-2 rounded-full bg-[#ff9b36] px-8 text-base font-semibold text-white hover:bg-[#e88520] sm:h-12 sm:w-auto">
                Claim Your $37 Voucher
                <ArrowRight className="h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <Badge className="mb-4 bg-[#f8faff] text-[#0d2577] hover:bg-[#f8faff]">
              What We Treat
            </Badge>
            <h2 className="mb-4 font-serif text-3xl italic text-[#0d2577] md:text-4xl">
              How Can We Help You?
            </h2>
            <p className="mx-auto max-w-2xl text-[#727272]">
              We aim to improve and restore spinal function using safe and effective
              traditional low force chiropractic techniques.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Services - 2 columns */}
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
              {services.map((service, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f8faff] transition-colors group-hover:bg-[#0d2577]">
                    <CheckCircle2 className="h-5 w-5 text-[#0d2577] transition-colors group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0d2577]">{service.name}</h3>
                    <p className="text-sm text-[#727272]">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Image */}
            <div className="hidden overflow-hidden rounded-2xl lg:block">
              <img
                src="https://assets.guestsnapper.com/wedding-gallery-media/InnervateChiro596lowres.jpg"
                alt="Dr Matt at Innervate Chiro"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="mt-10">
            <a href="#contact" className="block sm:text-center">
              <Button
                variant="outline"
                size="lg"
                className="h-14 w-full gap-2 rounded-full border-2 border-[#0d2577] px-8 text-base font-semibold text-[#0d2577] hover:bg-[#f8faff] sm:h-12 sm:w-auto"
              >
                Book Your Assessment
                <ArrowRight className="h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-[#f8faff] py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-16 text-center">
            <Badge className="mb-4 bg-white text-[#0d2577] hover:bg-white">
              How It Works
            </Badge>
            <h2 className="mb-4 font-serif text-3xl italic text-[#0d2577] md:text-4xl">
              A Simple, Supportive Approach to Lasting Wellness
            </h2>
            <p className="mx-auto max-w-3xl text-[#727272]">
              We believe great chiropractic care starts with understanding you — your lifestyle,
              goals, and how you want to feel. Every visit is tailored to support lasting comfort,
              movement, and confidence in your body.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item, i) => (
              <div key={i} className="relative">
                {/* Connector line */}
                {i < howItWorks.length - 1 && (
                  <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-[#b0bde6]/50 lg:block" />
                )}

                <div className="relative flex flex-col items-center text-center">
                  {/* Step number */}
                  <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0d2577]">
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Step indicator */}
                  <span className="mb-2 text-sm font-bold text-[#ff9b36]">STEP {item.step}</span>

                  <h3 className="mb-3 text-xl font-semibold text-[#0d2577]">{item.title}</h3>
                  <p className="text-sm text-[#727272]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Contact Form Section */}
      <section
        id="contact"
        className="relative overflow-hidden py-20 md:py-28"
        style={{
          background: "linear-gradient(135deg, #0d2577 0%, #091a5a 50%, #0d2577 100%)"
        }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#ff9b36] blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left - Content */}
            <div className="text-white">
              <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30">
                Limited Time Offer
              </Badge>
              <h2 className="mb-4 font-serif text-5xl italic md:text-6xl lg:text-7xl">
                Get Your $37
              </h2>
              <h3 className="mb-6 text-2xl font-light md:text-3xl">
                Chiropractic Exam Voucher
              </h3>
              <p className="mb-10 max-w-md text-lg text-white/70">
                Normally $145 — Save $108 on your first visit! Experience the difference
                that professional chiropractic care can make.
              </p>

              <ul className="mb-12 space-y-4">
                {examIncludes.map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff9b36]">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
                <a href="tel:+61481882278" className="flex items-center gap-3 text-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <Phone className="h-5 w-5 text-[#ff9b36]" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Call us now</p>
                    <p className="font-semibold">(04) 8188 2278</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 text-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <MapPin className="h-5 w-5 text-[#ff9b36]" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Visit us</p>
                    <p className="font-semibold">Woolloongabba, Brisbane</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Form Card */}
            <div className="space-y-6">
              <Card className="border-0 shadow-2xl">
                <CardContent className="p-8 md:p-10">
                  <h3 className="mb-2 text-2xl font-semibold text-[#0d2577]">
                    Claim Your Voucher
                  </h3>
                  <p className="mb-8 text-[#727272]">
                    Fill out the form and we&apos;ll send your voucher instantly
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-[#0d2577] sm:text-base">Name</Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        className="h-14 rounded-xl border-[#b0bde6] bg-[#f8faff] text-base focus:border-[#0d2577] focus:ring-[#0d2577] sm:h-12"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-[#0d2577] sm:text-base">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="h-14 rounded-xl border-[#b0bde6] bg-[#f8faff] text-base focus:border-[#0d2577] focus:ring-[#0d2577] sm:h-12"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="text-sm font-medium text-[#0d2577] sm:text-base">Mobile</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="0400 000 000"
                        className="h-14 rounded-xl border-[#b0bde6] bg-[#f8faff] text-base focus:border-[#0d2577] focus:ring-[#0d2577] sm:h-12"
                        value={formData.mobile}
                        onChange={(e) =>
                          setFormData({ ...formData, mobile: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium text-[#0d2577] sm:text-base">How Can We Help?</Label>
                      <textarea
                        id="message"
                        className="flex min-h-[120px] w-full rounded-xl border border-[#b0bde6] bg-[#f8faff] px-4 py-4 text-base placeholder:text-[#727272] focus:border-[#0d2577] focus:outline-none focus:ring-2 focus:ring-[#0d2577]/20"
                        placeholder="Tell us about your condition..."
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                      />
                    </div>
                    {submitStatus === "error" && (
                      <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-center text-red-700 text-sm">
                        Something went wrong. Please try again or call us at (04) 8188 2278.
                      </div>
                    )}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-16 w-full gap-2 rounded-full bg-[#ff9b36] text-lg font-semibold text-white hover:bg-[#e88520] disabled:opacity-50 sm:h-14"
                    >
                      {isSubmitting ? "Sending..." : "Get My $37 Voucher"}
                      {!isSubmitting && <ArrowRight className="h-5 w-5" />}
                    </Button>
                    <p className="text-center text-xs text-[#727272]">
                      We respect your privacy. Your information will never be shared.
                    </p>
                  </form>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0d2577] py-12 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4">
                <img
                  src="https://assets.guestsnapper.com/wedding-gallery-media/innervate%20chiro%20darkmode.webp"
                  alt="Innervate Chiro"
                  className="h-16 w-auto"
                />
              </div>
              <p className="text-white/70">
                Brisbane&apos;s trusted chiropractor helping patients restore spinal
                function and live pain-free.
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-semibold">Contact</h4>
              <div className="space-y-3 text-white/70">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#ff9b36]" />
                  <a href="tel:+61481882278" className="hover:text-white">
                    (04) 8188 2278
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#ff9b36]" />
                  Woolloongabba, South Brisbane
                </p>
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-semibold">Quick Links</h4>
              <div className="space-y-2 text-white/70">
                <a href="#services" className="block hover:text-white">
                  Services
                </a>
                <a href="#how-it-works" className="block hover:text-white">
                  How It Works
                </a>
                <a href="#contact" className="block hover:text-white">
                  Book Appointment
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/20 pt-8 text-center text-sm text-white/50">
            <p>
              &copy; {new Date().getFullYear()} Innervate Chiro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
