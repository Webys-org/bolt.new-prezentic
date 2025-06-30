'use client';

import React, { useState } from 'react'
import { ArrowRight, ChevronRight, Menu, X, Sparkles, Presentation, Mic, Zap, Brain, Volume2, PlayCircle, Star, Users, Award, TrendingUp, Shield, Rocket, Globe, CheckCircle, ArrowDown, ExternalLink } from 'lucide-react'
import { Button } from './ui/button'
import { AnimatedGroup } from './ui/animated-group'
import { cn } from '../lib/utils'

const fadeUpVariants = {
    item: {
        hidden: {
            opacity: 0,
            y: 30,
            filter: 'blur(8px)',
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    },
}

const staggeredFadeUp = {
    container: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            },
        },
    },
    item: {
        hidden: {
            opacity: 0,
            y: 40,
            filter: 'blur(10px)',
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                type: 'spring',
                bounce: 0.4,
                duration: 1.2,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    },
}

interface HeroSectionProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  isAuthenticated: boolean;
}

export function HeroSection({ onGetStarted, onSignIn, isAuthenticated }: HeroSectionProps) {
    return (
        <>
            <HeroHeader onGetStarted={onGetStarted} onSignIn={onSignIn} isAuthenticated={isAuthenticated} />
            <main className="overflow-hidden relative">
                {/* Animated Background */}
                <div className="fixed inset-0 -z-50">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50"></div>
                    <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-teal-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
                </div>

                {/* Hero Section */}
                <section className="relative pt-16 md:pt-24 lg:pt-36 pb-12 md:pb-20">
                    <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
                        <div className="text-center">
                            <AnimatedGroup variants={staggeredFadeUp}>
                                {/* Announcement Badge */}
                                <div className="inline-flex items-center gap-2 md:gap-4 rounded-full border border-white/20 bg-white/10 backdrop-blur-md p-1 pl-3 md:pl-4 shadow-lg mb-4 md:mb-8 hover:bg-white/15 transition-all duration-300 opacity-0 animate-fade-up text-xs md:text-sm" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                                    <span className="text-blue-700 font-medium">🚀 Introducing AI-Powered Presentations</span>
                                    <span className="hidden md:block h-4 w-0.5 bg-blue-300/50"></span>
                                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 size-5 md:size-6 overflow-hidden rounded-full">
                                        <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out hover:translate-x-0">
                                            <span className="flex size-6">
                                                <ArrowRight className="m-auto size-3 text-white" />
                                            </span>
                                            <span className="flex size-6">
                                                <ArrowRight className="m-auto size-3 text-white" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                        
                                {/* Main Heading - Improved Typography */}
                                <h1 className="text-hero font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-3 md:mb-6 leading-tight opacity-0 animate-fade-up text-balance" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                                    Create Stunning AI Presentations
                                </h1>
                                
                                {/* Subheading - Better Readability */}
                                <p className="mx-auto max-w-3xl text-sm md:text-body-large text-gray-600 mb-6 md:mb-12 leading-relaxed opacity-0 animate-fade-up text-pretty" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                                    Generate professional presentations with AI-powered content, human-like voice narration, and auto-advance features. Transform your ideas into captivating presentations in minutes.
                                </p>
                            </AnimatedGroup>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-8 md:mb-16 opacity-0 animate-fade-up" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
                                <Button
                                    size="lg"
                                    onClick={onGetStarted}
                                    className="w-full sm:w-auto rounded-xl px-6 py-3 text-sm md:text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 hover:from-blue-700 hover:via-purple-700 hover:to-teal-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0">
                                    <Sparkles className="mr-2 h-4 w-4 md:h-6 md:w-6" />
                                    <span>{isAuthenticated ? 'Go to Dashboard' : 'Start Creating Free'}</span>
                                </Button>
                                
                                <Button
                                    size="lg"
                                    variant="ghost"
                                    onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full sm:w-auto rounded-xl px-6 py-3 text-sm md:text-lg bg-white/20 backdrop-blur-md border border-white/30 text-gray-700 hover:bg-white/30 hover:text-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl">
                                    <PlayCircle className="mr-2 h-4 w-4 md:h-6 md:w-6" />
                                    <span>Watch Demo</span>
                                </Button>
                            </div>

                            {/* Stats - Improved Typography */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8 max-w-4xl mx-auto mb-12 md:mb-20">
                                {[
                                    { number: "50K+", label: "Presentations Created" },
                                    { number: "99%", label: "User Satisfaction" },
                                    { number: "5min", label: "Average Creation Time" },
                                    { number: "24/7", label: "AI Support" }
                                ].map((stat, index) => (
                                    <div 
                                        key={index} 
                                        className="text-center p-3 md:p-6 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 opacity-0 animate-fade-up"
                                        style={{ animationDelay: `${0.9 + index * 0.1}s`, animationFillMode: 'forwards' }}
                                    >
                                        <div className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1 md:mb-2">
                                            {stat.number}
                                        </div>
                                        <div className="text-xs md:text-sm text-gray-600 font-medium">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce opacity-0 animate-fade-up" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
                        <ArrowDown className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                    </div>
                </section>

                {/* Features Section */}
                <section id="demo-section" className="py-12 md:py-20 relative">
                    <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
                        {/* Section Header - Improved Typography */}
                        <div className="text-center mb-8 md:mb-16">
                            <h2 className="text-section-title font-bold text-gray-900 mb-3 md:mb-6 opacity-0 animate-fade-up text-balance" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                                Powerful Features for Modern Presentations
                            </h2>
                            <p className="text-sm md:text-body-large text-gray-600 max-w-3xl mx-auto opacity-0 animate-fade-up text-pretty" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                                Everything you need to create, present, and share stunning presentations with AI assistance
                            </p>
                        </div>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-12 md:mb-20">
                            {[
                                {
                                    icon: Brain,
                                    title: "AI Content Generation",
                                    description: "Intelligent content creation with professional structure and flow",
                                    gradient: "from-blue-500 to-blue-600"
                                },
                                {
                                    icon: Volume2,
                                    title: "Human-like Voice Narration",
                                    description: "Emotional AI voice with natural pauses and emphasis",
                                    gradient: "from-purple-500 to-purple-600"
                                },
                                {
                                    icon: Zap,
                                    title: "Auto-Advance Slides",
                                    description: "Automated slide progression with perfect timing",
                                    gradient: "from-teal-500 to-teal-600"
                                },
                                {
                                    icon: Presentation,
                                    title: "Professional Templates",
                                    description: "Beautiful, customizable templates for any occasion",
                                    gradient: "from-indigo-500 to-indigo-600"
                                },
                                {
                                    icon: Globe,
                                    title: "Real-time Collaboration",
                                    description: "Work together with your team in real-time",
                                    gradient: "from-green-500 to-green-600"
                                },
                                {
                                    icon: Shield,
                                    title: "Enterprise Security",
                                    description: "Bank-level security for your sensitive presentations",
                                    gradient: "from-red-500 to-red-600"
                                }
                            ].map((feature, index) => (
                                <div 
                                    key={index} 
                                    className="group p-4 md:p-8 rounded-xl md:rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl opacity-0 animate-fade-up"
                                    style={{ animationDelay: `${0.6 + index * 0.1}s`, animationFillMode: 'forwards' }}
                                >
                                    <div className={`w-10 h-10 md:w-16 md:h-16 bg-gradient-to-r ${feature.gradient} rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className="h-5 w-5 md:h-8 md:w-8 text-white" />
                                    </div>
                                    <h3 className="text-base md:text-card-title font-bold text-gray-900 mb-2 md:mb-4">{feature.title}</h3>
                                    <p className="text-xs md:text-body text-gray-600 leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Demo Preview Section */}
                <section className="py-12 md:py-20 relative">
                    <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
                        <div className="text-center mb-8 md:mb-16">
                            <h2 className="text-section-title font-bold text-gray-900 mb-3 md:mb-6 opacity-0 animate-fade-up text-balance" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                                See It In Action
                            </h2>
                            <p className="text-sm md:text-body-large text-gray-600 max-w-3xl mx-auto opacity-0 animate-fade-up text-pretty" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                                Watch how our AI creates stunning presentations with human-like narration in real-time
                            </p>
                        </div>

                        {/* YouTube Video Demo */}
                        <div className="relative max-w-5xl mx-auto opacity-0 animate-fade-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                            <div className="aspect-video rounded-xl md:rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 border border-white/20 backdrop-blur-md overflow-hidden shadow-2xl">
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/1VGbmnOFLAI?autoplay=1&mute=1&loop=1&playlist=1VGbmnOFLAI&controls=0&modestbranding=1&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&start=0&end=0&playbackRate=2"
                                    title="Prezentic AI Presentation Demo"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    style={{ 
                                        border: 'none',
                                        borderRadius: 'inherit'
                                    }}
                                />
                                
                                {/* Video Overlay with Info */}
                                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 md:p-4 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-sm md:text-base mb-1">Live Demo: AI Presentation Creation</h3>
                                            <p className="text-xs md:text-sm text-gray-200">Watch real-time AI content generation with human-like narration</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs md:text-sm">
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                            <span>LIVE</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-12 md:py-20 relative">
                    <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
                        <div className="text-center mb-8 md:mb-16">
                            <h2 className="text-section-title font-bold text-gray-900 mb-3 md:mb-6 opacity-0 animate-fade-up text-balance" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                                Loved by Professionals Worldwide
                            </h2>
                            <p className="text-sm md:text-body-large text-gray-600 max-w-3xl mx-auto opacity-0 animate-fade-up text-pretty" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                                Join thousands of satisfied users who create amazing presentations daily
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                            {[
                                {
                                    name: "Sarah Johnson",
                                    role: "Marketing Director",
                                    company: "TechCorp",
                                    content: "This AI presentation tool has revolutionized how we create client presentations. The voice narration feature is incredibly natural and professional.",
                                    rating: 5
                                },
                                {
                                    name: "Michael Chen",
                                    role: "Sales Manager",
                                    company: "InnovateCo",
                                    content: "The auto-advance feature saves me hours of preparation time. My presentations are now more engaging and professional than ever before.",
                                    rating: 5
                                },
                                {
                                    name: "Emily Rodriguez",
                                    role: "Educator",
                                    company: "University",
                                    content: "As an educator, I love how quickly I can create engaging lectures. The AI content generation is spot-on and saves me so much time.",
                                    rating: 5
                                }
                            ].map((testimonial, index) => (
                                <div 
                                    key={index} 
                                    className="p-4 md:p-8 rounded-xl md:rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 opacity-0 animate-fade-up"
                                    style={{ animationDelay: `${0.6 + index * 0.2}s`, animationFillMode: 'forwards' }}
                                >
                                    <div className="flex items-center mb-2 md:mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-xs md:text-body text-gray-700 mb-3 md:mb-6 leading-relaxed">"{testimonial.content}"</p>
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3 md:mr-4">
                                            <span className="text-white font-bold text-xs md:text-lg">
                                                {testimonial.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 text-sm md:text-base">{testimonial.name}</div>
                                            <div className="text-gray-600 text-xs md:text-sm">{testimonial.role} at {testimonial.company}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="py-12 md:py-20 relative">
                    <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
                        <div className="text-center mb-8 md:mb-16">
                            <h2 className="text-section-title font-bold text-gray-900 mb-3 md:mb-6 opacity-0 animate-fade-up text-balance" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                                Simple, Transparent Pricing
                            </h2>
                            <p className="text-sm md:text-body-large text-gray-600 max-w-3xl mx-auto opacity-0 animate-fade-up text-pretty" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                                Choose the perfect plan for your presentation needs
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
                            {[
                                {
                                    name: "Starter",
                                    price: "Free",
                                    period: "forever",
                                    description: "Perfect for getting started",
                                    features: [
                                        "5 presentations per month",
                                        "Basic AI content generation",
                                        "Standard templates",
                                        "Community support"
                                    ],
                                    popular: false
                                },
                                {
                                    name: "Professional",
                                    price: "$19",
                                    period: "per month",
                                    description: "For professionals and teams",
                                    features: [
                                        "Unlimited presentations",
                                        "Advanced AI features",
                                        "Premium templates",
                                        "Voice narration",
                                        "Auto-advance mode",
                                        "Priority support"
                                    ],
                                    popular: true
                                },
                                {
                                    name: "Enterprise",
                                    price: "Custom",
                                    period: "contact us",
                                    description: "For large organizations",
                                    features: [
                                        "Everything in Professional",
                                        "Custom branding",
                                        "Advanced analytics",
                                        "SSO integration",
                                        "Dedicated support",
                                        "Custom training"
                                    ],
                                    popular: false
                                }
                            ].map((plan, index) => (
                                <div 
                                    key={index} 
                                    className={`relative p-4 md:p-8 rounded-xl md:rounded-3xl border transition-all duration-300 hover:scale-105 opacity-0 animate-fade-up ${
                                        plan.popular 
                                            ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-xl' 
                                            : 'bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20'
                                    }`}
                                    style={{ animationDelay: `${0.6 + index * 0.2}s`, animationFillMode: 'forwards' }}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium">
                                                Most Popular
                                            </span>
                                        </div>
                                    )}
                                    
                                    <div className="text-center mb-4 md:mb-8">
                                        <h3 className="text-base md:text-card-title font-bold text-gray-900 mb-1 md:mb-2">{plan.name}</h3>
                                        <div className="mb-1 md:mb-2">
                                            <span className="text-xl md:text-4xl font-bold text-gray-900">{plan.price}</span>
                                            <span className="text-xs md:text-sm text-gray-600 ml-1 md:ml-2">{plan.period}</span>
                                        </div>
                                        <p className="text-xs md:text-body text-gray-600">{plan.description}</p>
                                    </div>

                                    <ul className="space-y-2 md:space-y-4 mb-4 md:mb-8">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-center">
                                                <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500 mr-2 md:mr-3 flex-shrink-0" />
                                                <span className="text-xs md:text-body text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        onClick={onGetStarted}
                                        className={`w-full rounded-lg md:rounded-xl py-2 md:py-3 text-xs md:text-sm transition-all duration-300 ${
                                            plan.popular
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                                                : 'bg-white/20 backdrop-blur-md border border-white/30 text-gray-700 hover:bg-white/30'
                                        }`}>
                                        {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-12 md:py-20 relative">
                    <div className="mx-auto max-w-4xl px-4 md:px-6 text-center relative z-10">
                        <div className="p-6 md:p-12 rounded-xl md:rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white relative overflow-hidden opacity-0 animate-fade-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                            <div className="relative z-10">
                                <h2 className="text-xl md:text-section-title font-bold mb-3 md:mb-6 text-balance">
                                    Ready to Transform Your Presentations?
                                </h2>
                                <p className="text-sm md:text-body-large mb-4 md:mb-8 text-blue-100 text-pretty">
                                    Join thousands of professionals who create stunning presentations with AI
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                                    <Button
                                        size="lg"
                                        onClick={onGetStarted}
                                        className="bg-white text-blue-600 hover:bg-gray-100 rounded-lg md:rounded-xl px-6 py-3 text-xs md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                                        <Rocket className="mr-2 h-4 w-4 md:h-6 md:w-6" />
                                        Start Creating Now
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="ghost"
                                        className="border-2 border-white/30 text-white hover:bg-white/10 rounded-lg md:rounded-xl px-6 py-3 text-xs md:text-lg">
                                        Learn More
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 md:py-16 relative">
                    <div className="mx-auto max-w-7xl px-4 md:px-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-12">
                            <div className="col-span-1 md:col-span-2 opacity-0 animate-fade-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-lg flex items-center justify-center">
                                        <Sparkles className="h-4 w-4 md:h-6 md:w-6 text-white" />
                                    </div>
                                    <span className="text-lg md:text-2xl font-bold text-gray-900">Prezentic</span>
                                </div>
                                <p className="text-xs md:text-body text-gray-600 mb-3 md:mb-6 max-w-md">
                                    Create stunning presentations with AI-powered content generation, human-like voice narration, and professional templates.
                                </p>
                                <div className="flex space-x-3 md:space-x-4">
                                    {/* Social Media Icons */}
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer">
                                        <span className="text-gray-600">𝕏</span>
                                    </div>
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer">
                                        <span className="text-gray-600">in</span>
                                    </div>
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer">
                                        <span className="text-gray-600">f</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                                <h4 className="font-semibold text-gray-900 mb-3 md:mb-4 text-sm md:text-base">Product</h4>
                                <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
                                    <li><a href="#" className="hover:text-gray-900 transition-colors text-gray-600">Features</a></li>
                                    <li><a href="#" className="hover:text-gray-900 transition-colors text-gray-600">Templates</a></li>
                                    <li><a href="#" className="hover:text-gray-900 transition-colors text-gray-600">Pricing</a></li>
                                    <li><a href="#" className="hover:text-gray-900 transition-colors text-gray-600">API</a></li>
                                </ul>
                            </div>
                            
                            <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                                <h4 className="font-semibold text-gray-900 mb-3 md:mb-4 text-sm md:text-base">Support</h4>
                                <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
                                    <li><a href="#" className="hover:text-gray-900 transition-colors text-gray-600">Help Center</a></li>
                                    <li><a href="#" className="hover:text-gray-900 transition-colors text-gray-600">Contact Us</a></li>
                                    <li><a href="#" className="hover:text-gray-900 transition-colors text-gray-600">Privacy Policy</a></li>
                                    <li><a href="#" className="hover:text-gray-900 transition-colors text-gray-600">Terms of Service</a></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-4 md:pt-8 opacity-0 animate-fade-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                            <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
                                <p className="text-gray-600 text-xs md:text-sm">
                                    © 2024 Prezentic. All rights reserved.
                                </p>
                                <div className="flex items-center gap-3 md:gap-4">
                                    <a 
                                        href="https://bolt.new" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-xs md:text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                                    >
                                        <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
                                        <span>Built with Bolt.new</span>
                                        <ExternalLink className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </>
    )
}

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Templates', href: '#templates' },
    { name: 'About', href: '#about' },
]

interface HeroHeaderProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  isAuthenticated: boolean;
}

const HeroHeader = ({ onGetStarted, onSignIn, isAuthenticated }: HeroHeaderProps) => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    
    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <nav className="mx-auto max-w-7xl px-4 md:px-6 py-2 md:py-4">
                <div className={cn(
                    'rounded-lg md:rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md transition-all duration-300 px-3 py-2 md:px-6 md:py-3 opacity-0 animate-fade-up',
                    isScrolled && 'bg-white/20 shadow-lg'
                )} style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center space-x-2 md:space-x-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-lg flex items-center justify-center">
                                <Sparkles className="h-4 w-4 md:h-6 md:w-6 text-white" />
                            </div>
                            <div>
                                <div className="text-base md:text-lg font-bold text-gray-900">Prezentic</div>
                                <div className="text-[10px] md:text-xs text-gray-600">Presentation Maker</div>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-6 md:space-x-8">
                            {menuItems.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.href}
                                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 text-sm"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>

                        {/* Desktop CTA Buttons */}
                        <div className="hidden lg:flex items-center space-x-3 md:space-x-4">
                            {!isAuthenticated ? (
                                <>
                                    <Button
                                        variant="ghost"
                                        onClick={onSignIn}
                                        className="text-gray-700 hover:text-gray-900 hover:bg-white/20 rounded-lg md:rounded-xl text-sm">
                                        Sign In
                                    </Button>
                                    <Button
                                        onClick={onGetStarted}
                                        className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 hover:from-blue-700 hover:via-purple-700 hover:to-teal-700 text-white rounded-lg md:rounded-xl px-4 md:px-6 shadow-lg hover:shadow-xl transition-all duration-300 text-sm">
                                        Get Started
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={onGetStarted}
                                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 hover:from-blue-700 hover:via-purple-700 hover:to-teal-700 text-white rounded-lg md:rounded-xl px-4 md:px-6 shadow-lg hover:shadow-xl transition-all duration-300 text-sm">
                                    Go to Dashboard
                                </Button>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMenuState(!menuState)}
                            className="lg:hidden p-1 md:p-2 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all"
                        >
                            {menuState ? (
                                <X className="h-5 w-5 md:h-6 md:w-6 text-gray-700" />
                            ) : (
                                <Menu className="h-5 w-5 md:h-6 md:w-6 text-gray-700" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {menuState && (
                        <div className="lg:hidden mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/20">
                            <div className="space-y-2 md:space-y-4">
                                {menuItems.map((item, index) => (
                                    <a
                                        key={index}
                                        href={item.href}
                                        className="block text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm"
                                        onClick={() => setMenuState(false)}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                                <div className="flex flex-col space-y-2 pt-3 md:pt-4">
                                    {!isAuthenticated ? (
                                        <>
                                            <Button
                                                variant="ghost"
                                                onClick={() => {
                                                    onSignIn();
                                                    setMenuState(false);
                                                }}
                                                className="justify-start text-gray-700 hover:bg-white/20 rounded-lg md:rounded-xl text-sm">
                                                Sign In
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    onGetStarted();
                                                    setMenuState(false);
                                                }}
                                                className="justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg md:rounded-xl text-sm">
                                                Get Started
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            onClick={() => {
                                                onGetStarted();
                                                setMenuState(false);
                                            }}
                                            className="justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg md:rounded-xl text-sm">
                                            Go to Dashboard
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    )
}